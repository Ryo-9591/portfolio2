'use client'

import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

interface ModelLoaderProps {
  modelPath: string
  position: [number, number, number]
  scale?: [number, number, number] | number
  rotation?: [number, number, number]
  onClick?: () => void
  onHover?: (isHovering: boolean, event?: React.PointerEvent) => void
  animationType?: 'float' | 'rotate' | 'orbit' | 'none'
  fallbackColor?: string
}

export default function ModelLoader({
  modelPath,
  position,
  scale = 1,
  rotation = [0, 0, 0],
  onClick,
  onHover,
  animationType = 'float',
  fallbackColor = '#ffffff'
}: ModelLoaderProps) {
  const groupRef = useRef<Group>(null!)
  
  // GLTFモデルを読み込み（エラーハンドリング付き）
  let gltf
  try {
    gltf = useGLTF(modelPath)
  } catch (error) {
    console.warn(`Model not found: ${modelPath}, using fallback`)
    gltf = null
  }

  // アニメーション
  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.elapsedTime

    switch (animationType) {
      case 'float':
        groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.3
        break
      case 'rotate':
        groupRef.current.rotation.y = time * 0.5
        break
      case 'orbit':
        const radius = 2
        groupRef.current.position.x = position[0] + Math.cos(time * 0.3) * radius
        groupRef.current.position.z = position[2] + Math.sin(time * 0.3) * radius
        break
    }
  })

  if (!gltf?.scene) {
    // GLTFが正しく読み込まれていない場合のフォールバック
    return (
      <group 
        ref={groupRef}
        position={position}
        scale={scale}
        rotation={rotation}
        onClick={onClick}
        onPointerEnter={(e) => onHover?.(true, e)}
        onPointerLeave={() => onHover?.(false)}
      >
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={fallbackColor} />
        </mesh>
      </group>
    )
  }

  return (
    <group 
      ref={groupRef}
      position={position}
      scale={scale}
      rotation={rotation}
      onClick={onClick}
      onPointerEnter={(e) => onHover?.(true, e)}
      onPointerLeave={() => onHover?.(false)}
    >
      <primitive object={gltf.scene.clone()} />
    </group>
  )
}

// GLTFファイルのプリロード（パフォーマンス向上）
export function preloadModels() {
  useGLTF.preload('/models/rocket.glb')
  useGLTF.preload('/models/planet.glb')
  useGLTF.preload('/models/satellite.glb')
  useGLTF.preload('/models/space-station.glb')
}
