'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Universal3DModelProps } from '../Universal3DModel'

export default function SpaceStationFallback({ 
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
      groupRef.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.2
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
      {/* 中央ハブ */}
      <mesh>
        <sphereGeometry args={[1.0, 12, 12]} />
        <meshBasicMaterial color="#c0c0c0" />
      </mesh>
      
      {/* モジュール */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <group key={i} rotation={[0, angle, 0]}>
            <mesh position={[2.0, 0, 0]}>
              <cylinderGeometry args={[0.4, 0.4, 1.5, 8]} />
              <meshBasicMaterial color="#e0e0e0" />
            </mesh>
            
            {/* 接続チューブ */}
            <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.2, 0.2, 1.0, 6]} />
              <meshBasicMaterial color="#808080" />
            </mesh>
          </group>
        )
      })}
      
      {/* ソーラーパネル */}
      {[0, 1].map((i) => (
        <group key={i} rotation={[0, i * Math.PI, 0]}>
          <mesh position={[3.5, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.05, 2.0, 4.0]} />
            <meshBasicMaterial color="#1e40af" transparent opacity={0.8} />
          </mesh>
          <mesh position={[3.5, -1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.05, 2.0, 4.0]} />
            <meshBasicMaterial color="#1e40af" transparent opacity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
