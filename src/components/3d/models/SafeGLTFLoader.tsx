'use client'

import { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import * as THREE from 'three'
import { Universal3DModelProps } from './Universal3DModel'

interface SafeGLTFLoaderProps extends Universal3DModelProps {
  onLoadSuccess?: (scene: THREE.Object3D) => void
  onLoadError?: (error: Error) => void
}

export default function SafeGLTFLoader({
  modelPath,
  fallbackComponent: FallbackComponent,
  onLoadSuccess,
  onLoadError,
  ...props
}: SafeGLTFLoaderProps) {
  const [loadState, setLoadState] = useState<'loading' | 'success' | 'error'>('loading')
  const [scene, setScene] = useState<THREE.Object3D | null>(null)
  const groupRef = useRef<Group>(null!)

  useEffect(() => {
    let mounted = true
    
    // ファイル存在チェック
    fetch(modelPath, { method: 'HEAD' })
      .then(response => {
        if (!mounted) return
        
        if (response.ok) {
          // ファイルが存在する場合のみGLTF読み込み
          try {
            import('@react-three/drei').then(({ useGLTF }) => {
              if (!mounted) return
              
              // GLTFLoaderを正しくインポートして使用
              import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
                if (!mounted) return
                
                const loader = new GLTFLoader()
                loader.load(
                  modelPath,
                  (gltf) => {
                    if (!mounted) return
                    
                    // マテリアルを安全に変換（色情報保持）
                    gltf.scene.traverse((child) => {
                      if (child instanceof THREE.Mesh && child.material) {
                        if (child.material instanceof THREE.MeshStandardMaterial || 
                            child.material instanceof THREE.MeshPhysicalMaterial) {
                          // 元のマテリアルの色とテクスチャを保持
                          const originalColor = child.material.color ? child.material.color.clone() : new THREE.Color(0xffffff)
                          const originalMap = child.material.map
                          const originalEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0x000000)
                          
                          child.material = new THREE.MeshBasicMaterial({
                            map: originalMap,
                            color: originalColor,
                            transparent: child.material.transparent || false,
                            opacity: child.material.opacity !== undefined ? child.material.opacity : 1.0,
                            side: child.material.side || THREE.FrontSide,
                            // エミッシブ色を追加して発光効果を保持
                            ...(originalEmissive.getHex() !== 0 && { color: originalEmissive })
                          })
                        }
                      }
                    })
                    
                    setScene(gltf.scene)
                    setLoadState('success')
                    onLoadSuccess?.(gltf.scene)
                  },
                  undefined,
                  (error) => {
                    if (!mounted) return
                    console.log(`ℹ️ GLTF load failed: ${modelPath}, using fallback`)
                    setLoadState('error')
                    onLoadError?.(error)
                  }
                )
              }).catch(() => {
                if (!mounted) return
                console.log(`ℹ️ GLTFLoader import failed: ${modelPath}, using fallback`)
                setLoadState('error')
              })
            })
          } catch (error) {
            if (!mounted) return
            console.log(`ℹ️ GLTF loader error: ${modelPath}, using fallback`)
            setLoadState('error')
            onLoadError?.(error as Error)
          }
        } else {
          // ファイルが存在しない場合
          console.log(`ℹ️ Model not found: ${modelPath}, using fallback`)
          setLoadState('error')
        }
      })
      .catch(() => {
        if (!mounted) return
        console.log(`ℹ️ Model fetch failed: ${modelPath}, using fallback`)
        setLoadState('error')
      })
    
    return () => {
      mounted = false
    }
  }, [modelPath, onLoadSuccess, onLoadError])

  // アニメーション（常に呼び出し）
  useFrame((state) => {
    if (!groupRef.current || !props.animation || loadState !== 'success') return
    
    const time = state.clock.elapsedTime
    
    // 回転アニメーション
    if (props.animation.rotation) {
      const { axis, speed, amplitude } = props.animation.rotation
      const rotationValue = Math.sin(time * speed) * amplitude
      
      switch (axis) {
        case 'x':
          groupRef.current.rotation.x = (props.rotation?.[0] || 0) + rotationValue
          break
        case 'y':
          groupRef.current.rotation.y = (props.rotation?.[1] || 0) + rotationValue
          break
        case 'z':
          groupRef.current.rotation.z = (props.rotation?.[2] || 0) + rotationValue
          break
      }
    }
    
    // 位置アニメーション
    if (props.animation.position) {
      const { axis, speed, amplitude } = props.animation.position
      const positionValue = Math.sin(time * speed) * amplitude
      
      switch (axis) {
        case 'x':
          groupRef.current.position.x = props.position[0] + positionValue
          break
        case 'y':
          groupRef.current.position.y = props.position[1] + positionValue
          break
        case 'z':
          groupRef.current.position.z = props.position[2] + positionValue
          break
      }
    }
    
    // スケールアニメーション
    if (props.animation.scale) {
      const { speed, amplitude } = props.animation.scale
      const scaleValue = 1 + Math.sin(time * speed) * amplitude
      groupRef.current.scale.setScalar(scaleValue)
    }
  })

  // ローディング中は何も表示しない
  if (loadState === 'loading') {
    return null
  }

  // エラーの場合のみフォールバックを表示
  if (loadState === 'error' || !scene) {
    return <FallbackComponent {...props} />
  }

  // 成功した場合は3Dモデルを表示
  return (
    <group
      ref={groupRef}
      position={props.position}
      scale={props.scale}
      rotation={props.rotation}
      onClick={(e) => {
        e.stopPropagation()
        props.onClick?.()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        props.onPointerOver?.(e)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        props.onPointerOut?.(e)
      }}
    >
      <primitive object={scene} />
    </group>
  )
}
