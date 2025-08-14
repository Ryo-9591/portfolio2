'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Universal3DModelProps } from '../Universal3DModel'

export default function SatelliteFallback({ 
  position, 
  scale = [1, 1, 1], 
  rotation = [0, 0, 0],
  onClick, 
  onPointerOver, 
  onPointerOut 
}: Universal3DModelProps) {
  const groupRef = useRef<Group>(null!)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.8
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
      {/* メインボディ */}
      <mesh>
        <boxGeometry args={[1.5, 1.0, 0.8]} />
        <meshBasicMaterial color="#e0e0e0" />
      </mesh>
      
      {/* ソーラーパネル */}
      {[-1, 1].map((side, i) => (
        <mesh key={i} position={[side * 1.5, 0, 0]} rotation={[0, 0, side * Math.PI / 12]}>
          <boxGeometry args={[0.05, 2.0, 1.5]} />
          <meshBasicMaterial color="#1e40af" transparent opacity={0.8} />
        </mesh>
      ))}
      
      {/* アンテナ */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.0, 6]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
      
      {/* 受信器 */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#ff6b6b" />
      </mesh>
    </group>
  )
}
