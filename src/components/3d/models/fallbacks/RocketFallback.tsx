'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Universal3DModelProps } from '../Universal3DModel'

export default function RocketFallback({ 
  position, 
  scale = [1, 1, 1], 
  rotation = [0, 0, 0],
  onClick, 
  onPointerOver, 
  onPointerOut 
}: Universal3DModelProps) {
  const groupRef = useRef<Group>(null!)

  // 軽いアニメーション
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

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
      {/* シンプルなロケット形状 - 超軽量 */}
      
      {/* ノーズコーン */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[0.4, 1.0, 8]} />
        <meshBasicMaterial color="#ff4757" />
      </mesh>
      
      {/* メインボディ */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 2.0, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* エンジン */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.2, 1.0, 8]} />
        <meshBasicMaterial color="#2c2c54" />
      </mesh>
      
      {/* フィン */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2
        return (
          <mesh
            key={`fin-${i}`}
            position={[
              Math.cos(angle) * 0.5,
              -0.8,
              Math.sin(angle) * 0.5
            ]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.05, 0.8, 0.4]} />
            <meshBasicMaterial color="#706fd3" />
          </mesh>
        )
      })}
      
      {/* 噴射エフェクト */}
      <mesh position={[0, -1.2, 0]}>
        <coneGeometry args={[0.2, 0.8, 6]} />
        <meshBasicMaterial color="#ff4757" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}
