'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Universal3DModelProps } from '../Universal3DModel'

export default function ProjectFallback({ 
  position, 
  scale = [1, 1, 1], 
  rotation = [0, 0, 0],
  onClick, 
  onPointerOver, 
  onPointerOut 
}: Universal3DModelProps) {
  const groupRef = useRef<Group>(null!)
  const satelliteRef = useRef<Group>(null!)

  // アニメーション
  useFrame((state) => {
    if (groupRef.current) {
      // 自転
      groupRef.current.rotation.y = rotation[1] + state.clock.elapsedTime * 0.5
      // 浮遊
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
    
    // 衛星の公転
    if (satelliteRef.current) {
      satelliteRef.current.rotation.y = state.clock.elapsedTime * 2
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
      {/* プロジェクト惑星形状 - 軽量 */}
      
      {/* メイン球体 */}
      <mesh>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color="#4a90e2" />
      </mesh>
      
      {/* 表面の詳細 */}
      <mesh scale={[1.02, 1.02, 1.02]}>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshBasicMaterial color="#87ceeb" transparent opacity={0.6} />
      </mesh>
      
      {/* 大気 */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
      
      {/* 軌道リング */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.2, 0.1, 4, 16]} />
        <meshBasicMaterial color="#ffd700" transparent opacity={0.8} />
      </mesh>
      
      {/* 衛星 */}
      <group ref={satelliteRef}>
        <mesh position={[2.5, 0, 0]}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshBasicMaterial color="#ff6b6b" />
        </mesh>
      </group>
    </group>
  )
}
