import * as THREE from 'three'

// 軽量化設定
export interface OptimizationConfig {
  maxPolygons: number
  maxTextureSize: number
  enableLOD: boolean
  compressionLevel: 'low' | 'medium' | 'high'
}

// デフォルト軽量化設定
export const DEFAULT_OPTIMIZATION: OptimizationConfig = {
  maxPolygons: 5000,
  maxTextureSize: 1024,
  enableLOD: true,
  compressionLevel: 'medium'
}

// プロジェクト別軽量化設定
export const PROJECT_OPTIMIZATION: OptimizationConfig = {
  maxPolygons: 3000,
  maxTextureSize: 512,
  enableLOD: true,
  compressionLevel: 'high'
}

/**
 * 3Dモデルを軽量化する
 */
export function optimizeModel(scene: THREE.Object3D, config: OptimizationConfig = DEFAULT_OPTIMIZATION): THREE.Object3D {
  const optimizedScene = scene.clone()
  
  optimizedScene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // ジオメトリの軽量化
      optimizeGeometry(child, config)
      
      // マテリアルの軽量化
      optimizeMaterial(child, config)
    }
  })
  
  return optimizedScene
}

/**
 * ジオメトリの軽量化
 */
function optimizeGeometry(mesh: THREE.Mesh, config: OptimizationConfig) {
  const geometry = mesh.geometry
  
  // ポリゴン数チェック
  const vertexCount = geometry.attributes.position?.count || 0
  const triangleCount = vertexCount / 3
  
  if (triangleCount > config.maxPolygons) {
    console.warn(`Model has ${triangleCount} triangles, exceeds limit of ${config.maxPolygons}`)
    
    // Simple decimation (頂点間引き)
    if (geometry.attributes.position) {
      const positions = geometry.attributes.position.array
      const decimationRatio = config.maxPolygons / triangleCount
      
      if (decimationRatio < 1) {
        // 簡易的な頂点削減
        const newPositions = new Float32Array(Math.floor(positions.length * decimationRatio))
        const step = 1 / decimationRatio
        
        for (let i = 0; i < newPositions.length; i += 3) {
          const sourceIndex = Math.floor((i / 3) * step) * 3
          newPositions[i] = positions[sourceIndex]
          newPositions[i + 1] = positions[sourceIndex + 1]
          newPositions[i + 2] = positions[sourceIndex + 2]
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(newPositions, 3))
      }
    }
  }
  
  // ジオメトリの最適化
  geometry.computeBoundingBox()
  geometry.computeBoundingSphere()
  
  // 不要な属性を削除
  if (config.compressionLevel === 'high') {
    // 高圧縮の場合、法線を削除（自動計算）
    if (geometry.attributes.normal) {
      geometry.deleteAttribute('normal')
      geometry.computeVertexNormals()
    }
  }
}

/**
 * マテリアルの軽量化
 */
function optimizeMaterial(mesh: THREE.Mesh, config: OptimizationConfig) {
  const material = mesh.material
  
  if (Array.isArray(material)) {
    mesh.material = material.map(mat => optimizeSingleMaterial(mat, config))
  } else {
    mesh.material = optimizeSingleMaterial(material, config)
  }
}

/**
 * 単一マテリアルの軽量化
 */
function optimizeSingleMaterial(material: THREE.Material, config: OptimizationConfig): THREE.Material {
  // PBRマテリアルをBasicMaterialに変換（軽量化）
  if (material instanceof THREE.MeshStandardMaterial || 
      material instanceof THREE.MeshPhysicalMaterial) {
    
    // 安全にプロパティを取得
    const map = material.map ? optimizeTexture(material.map, config) : null
    const color = material.color ? material.color.clone() : new THREE.Color(0xffffff)
    
    const basicMaterial = new THREE.MeshBasicMaterial({
      map: map,
      color: color,
      transparent: material.transparent || false,
      opacity: material.opacity !== undefined ? material.opacity : 1.0,
      side: material.side !== undefined ? material.side : THREE.FrontSide,
      alphaTest: material.alphaTest || 0
    })
    
    // 元のマテリアルを破棄
    material.dispose()
    
    return basicMaterial
  }
  
  return material
}

/**
 * テクスチャの軽量化
 */
function optimizeTexture(texture: THREE.Texture | null, config: OptimizationConfig): THREE.Texture | null {
  if (!texture || !texture.image) return texture
  
  const image = texture.image
  if (image.width <= config.maxTextureSize && image.height <= config.maxTextureSize) {
    return texture
  }
  
  // Canvas を使用してテクスチャサイズを削減
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return texture
  
  const scale = Math.min(
    config.maxTextureSize / image.width,
    config.maxTextureSize / image.height
  )
  
  canvas.width = Math.floor(image.width * scale)
  canvas.height = Math.floor(image.height * scale)
  
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  
  const optimizedTexture = new THREE.CanvasTexture(canvas)
  optimizedTexture.wrapS = texture.wrapS
  optimizedTexture.wrapT = texture.wrapT
  optimizedTexture.magFilter = THREE.LinearFilter
  optimizedTexture.minFilter = THREE.LinearMipmapLinearFilter
  
  return optimizedTexture
}

/**
 * LOD (Level of Detail) を作成
 */
export function createLOD(
  highDetailScene: THREE.Object3D,
  config: OptimizationConfig = DEFAULT_OPTIMIZATION
): THREE.LOD {
  const lod = new THREE.LOD()
  
  if (!config.enableLOD) {
    lod.addLevel(highDetailScene, 0)
    return lod
  }
  
  // 高詳細版
  lod.addLevel(highDetailScene, 0)
  
  // 中詳細版
  const mediumConfig: OptimizationConfig = {
    ...config,
    maxPolygons: Math.floor(config.maxPolygons * 0.5),
    maxTextureSize: Math.floor(config.maxTextureSize * 0.7)
  }
  const mediumDetailScene = optimizeModel(highDetailScene, mediumConfig)
  lod.addLevel(mediumDetailScene, 50)
  
  // 低詳細版
  const lowConfig: OptimizationConfig = {
    ...config,
    maxPolygons: Math.floor(config.maxPolygons * 0.2),
    maxTextureSize: Math.floor(config.maxTextureSize * 0.5),
    compressionLevel: 'high'
  }
  const lowDetailScene = optimizeModel(highDetailScene, lowConfig)
  lod.addLevel(lowDetailScene, 200)
  
  return lod
}

/**
 * モデルの統計情報を取得
 */
export function getModelStats(scene: THREE.Object3D): {
  triangleCount: number
  vertexCount: number
  materialCount: number
  textureCount: number
  memoryUsage: number
} {
  let triangleCount = 0
  let vertexCount = 0
  let materialCount = 0
  const textures = new Set<THREE.Texture>()
  
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const geometry = child.geometry
      if (geometry.attributes.position) {
        vertexCount += geometry.attributes.position.count
        triangleCount += geometry.attributes.position.count / 3
      }
      
      const material = child.material
      if (Array.isArray(material)) {
        materialCount += material.length
        material.forEach(mat => collectTextures(mat, textures))
      } else {
        materialCount++
        collectTextures(material, textures)
      }
    }
  })
  
  // メモリ使用量推定 (MB)
  const memoryUsage = (vertexCount * 32 + textures.size * 1024 * 1024) / (1024 * 1024)
  
  return {
    triangleCount: Math.floor(triangleCount),
    vertexCount,
    materialCount,
    textureCount: textures.size,
    memoryUsage: Math.round(memoryUsage * 100) / 100
  }
}

/**
 * マテリアルからテクスチャを収集
 */
function collectTextures(material: THREE.Material, textures: Set<THREE.Texture>) {
  if ('map' in material && material.map) textures.add(material.map)
  if ('normalMap' in material && material.normalMap) textures.add(material.normalMap)
  if ('roughnessMap' in material && material.roughnessMap) textures.add(material.roughnessMap)
  if ('metalnessMap' in material && material.metalnessMap) textures.add(material.metalnessMap)
  if ('aoMap' in material && material.aoMap) textures.add(material.aoMap)
  if ('emissiveMap' in material && material.emissiveMap) textures.add(material.emissiveMap)
}
