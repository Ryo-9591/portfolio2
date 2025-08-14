'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { isModelEnabled } from '../../config/models'

interface LightweightModelLoaderProps {
  modelType: string
  position: [number, number, number]
  scale?: [number, number, number]
  color: string
  onClick?: () => void
  onPointerOver?: (event: any) => void
  onPointerOut?: (event: any) => void
  shape?: 'sphere' | 'cube' | 'cone' | 'torus' | 'octahedron'
  size?: number
}

export default function LightweightModelLoader({
  modelType,
  position,
  scale = [1, 1, 1],
  color,
  onClick,
  onPointerOver,
  onPointerOut,
  shape = 'sphere',
  size = 1.5
}: LightweightModelLoaderProps) {
  const groupRef = useRef<Group>(null!)

  // 軽量なアニメーション（低フレームレート）
  useFrame((state) => {
    // 15FPSに制限（約0.066秒間隔）
    if (state.clock.elapsedTime % 0.066 < 0.033) {
      if (groupRef.current) {
        // ゆっくりとした自転
        groupRef.current.rotation.y += 0.005
        // 微細な浮遊
        groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1
      }
    }
  })
  
  // 高品質フォールバックジオメトリを生成
  const geometry = useMemo(() => {
    switch (shape) {
      case 'sphere':
        return <sphereGeometry args={[size, 32, 32]} />
      case 'cube':
        return <boxGeometry args={[size * 1.5, size * 1.5, size * 1.5]} />
      case 'cone':
        return <coneGeometry args={[size, size * 2, 32]} />
      case 'torus':
        return <torusGeometry args={[size, size * 0.4, 16, 32]} />
      case 'octahedron':
        return <octahedronGeometry args={[size, 2]} />
      default:
        return <sphereGeometry args={[size, 32, 32]} />
    }
  }, [shape, size])

  // モデルが有効でも、軽量化のためフォールバックのみ使用
  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onClick={(e) => {
        e?.stopPropagation?.()
        onClick?.()
      }}
      onPointerOver={(e) => {
        e?.stopPropagation?.()
        onPointerOver?.(e)
      }}
      onPointerOut={(e) => {
        e?.stopPropagation?.()
        onPointerOut?.(e)
      }}
    >
      {/* 軽量なジオメトリのみ使用 */}
      <mesh>
        {geometry}
        <meshBasicMaterial 
          color={color}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
      
      {/* 簡単なハイライト効果 */}
      <mesh position={[0.2, 0.3, 0.2]} scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[size, 6, 6]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent={true}
          opacity={0.15}
        />
      </mesh>
    </group>
  )
}
