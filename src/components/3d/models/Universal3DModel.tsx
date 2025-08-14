'use client'

import { useRef, Suspense, useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import * as THREE from 'three'
import { optimizeModel, createLOD, getModelStats, OptimizationConfig, DEFAULT_OPTIMIZATION, PROJECT_OPTIMIZATION } from '../../../utils/modelOptimization'
import ModelErrorBoundary from './ModelErrorBoundary'

export interface Universal3DModelProps {
  modelPath: string
  fallbackComponent: React.ComponentType<Universal3DModelProps>
  position: [number, number, number]
  scale?: [number, number, number]
  rotation?: [number, number, number]
  onClick?: () => void
  onPointerOver?: (event: any) => void
  onPointerOut?: (event: any) => void
  animation?: {
    rotation?: { axis: 'x' | 'y' | 'z', speed: number, amplitude: number }
    position?: { axis: 'x' | 'y' | 'z', speed: number, amplitude: number }
    scale?: { speed: number, amplitude: number }
  }
  optimizationLevel?: 'low' | 'medium' | 'high' | 'project'
  enableLOD?: boolean
  enableStats?: boolean
}

// 3Dモデルコンポーネント
function Model3D({ 
  modelPath, 
  position, 
  scale = [1, 1, 1], 
  rotation = [0, 0, 0],
  onClick, 
  onPointerOver, 
  onPointerOut,
  animation,
  optimizationLevel = 'medium',
  enableLOD = true,
  enableStats = false,
  fallbackComponent: FallbackComponent
}: Universal3DModelProps) {
  const groupRef = useRef<Group>(null!)
  
  // GLTFモデルを読み込み
  const { scene: originalScene } = useGLTF(modelPath)
  
  // 最適化設定
  const optimizationConfig: OptimizationConfig = useMemo(() => {
    switch (optimizationLevel) {
      case 'low':
        return { ...DEFAULT_OPTIMIZATION, maxPolygons: 10000, compressionLevel: 'low' }
      case 'medium':
        return DEFAULT_OPTIMIZATION
      case 'high':
        return { ...DEFAULT_OPTIMIZATION, maxPolygons: 2000, compressionLevel: 'high' }
      case 'project':
        return PROJECT_OPTIMIZATION
      default:
        return DEFAULT_OPTIMIZATION
    }
  }, [optimizationLevel])
  
  // モデルを最適化（安全な方法）
  const optimizedScene = useMemo(() => {
    if (!originalScene) return null
    
    try {
      const clonedScene = originalScene.clone()
      
      // シンプルなマテリアル変換（エラー回避）
      clonedScene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material = child.material.map(mat => {
              if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
                return new THREE.MeshBasicMaterial({
                  map: mat.map,
                  color: mat.color.clone(),
                  transparent: mat.transparent,
                  opacity: mat.opacity
                })
              }
              return mat
            })
          } else {
            const mat = child.material
            if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
              child.material = new THREE.MeshBasicMaterial({
                map: mat.map,
                color: mat.color.clone(),
                transparent: mat.transparent,
                opacity: mat.opacity
              })
            }
          }
        }
      })
      
      if (enableStats) {
        const originalStats = getModelStats(originalScene)
        const optimizedStats = getModelStats(clonedScene)
        console.log(`Model Stats for ${modelPath}:`, {
          original: originalStats,
          optimized: optimizedStats
        })
      }
      
      return clonedScene
    } catch (error) {
      console.warn(`Model optimization failed for ${modelPath}, using original:`, error)
      return originalScene
    }
  }, [originalScene, optimizationConfig, enableStats, modelPath])
  
  // LODを作成（一時的に無効化してエラー回避）
  const lodScene = useMemo(() => {
    if (!optimizedScene) return null
    
    // LODは一時的に無効化（安定性優先）
    return optimizedScene
  }, [optimizedScene])
  
  // アニメーション
  useFrame((state) => {
    if (!groupRef.current || !animation) return
    
    const time = state.clock.elapsedTime
    
    // 回転アニメーション
    if (animation.rotation) {
      const { axis, speed, amplitude } = animation.rotation
      const rotationValue = Math.sin(time * speed) * amplitude
      
      switch (axis) {
        case 'x':
          groupRef.current.rotation.x = rotation[0] + rotationValue
          break
        case 'y':
          groupRef.current.rotation.y = rotation[1] + rotationValue
          break
        case 'z':
          groupRef.current.rotation.z = rotation[2] + rotationValue
          break
      }
    }
    
    // 位置アニメーション
    if (animation.position) {
      const { axis, speed, amplitude } = animation.position
      const positionValue = Math.sin(time * speed) * amplitude
      
      switch (axis) {
        case 'x':
          groupRef.current.position.x = position[0] + positionValue
          break
        case 'y':
          groupRef.current.position.y = position[1] + positionValue
          break
        case 'z':
          groupRef.current.position.z = position[2] + positionValue
          break
      }
    }
    
    // スケールアニメーション
    if (animation.scale) {
      const { speed, amplitude } = animation.scale
      const scaleValue = 1 + Math.sin(time * speed) * amplitude
      groupRef.current.scale.setScalar(scaleValue)
    }
  })

  if (!lodScene) return null

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        onPointerOver?.(e)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        onPointerOut?.(e)
      }}
    >
      <primitive object={lodScene} />
    </group>
  )
}

// メインコンポーネント
export default function Universal3DModel(props: Universal3DModelProps) {
  const { fallbackComponent: FallbackComponent } = props
  
  return (
    <ModelErrorBoundary 
      fallback={FallbackComponent} 
      fallbackProps={props}
    >
      <Suspense fallback={<FallbackComponent {...props} />}>
        <Model3D {...props} />
      </Suspense>
    </ModelErrorBoundary>
  )
}

// プリロード機能（エラー抑制付き）
export function preloadModel(modelPath: string) {
  try {
    useGLTF.preload(modelPath)
  } catch (error) {
    // モデルファイルが存在しない場合はフォールバックを使用
    console.warn(`Model preload failed: ${modelPath}, will use fallback`)
  }
}
