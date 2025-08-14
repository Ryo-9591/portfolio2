'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface PlanetProps {
  position: [number, number, number]
  color: string
  onClick: () => void
  onHover: (isHovering: boolean, event?: React.PointerEvent) => void
}

export default function Planet({ position, color, onClick, onHover }: PlanetProps) {
  const meshRef = useRef<Mesh>(null!)
  const ringRef = useRef<Mesh>(null!)
  const atmosphereRef = useRef<Mesh>(null!)

  // アニメーション：自転と浮遊
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.005
      ringRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y -= 0.005
      atmosphereRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5
    }
  })

  return (
    <group position={position}>
      {/* 大気圏エフェクト */}
      <mesh
        ref={atmosphereRef}
        scale={[1.3, 1.3, 1.3]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent={true}
          opacity={0.1}
        />
      </mesh>

      {/* リング */}
      <mesh
        ref={ringRef}
        rotation={[Math.PI / 2 + 0.3, 0, 0]}
      >
        <ringGeometry args={[1.5, 2, 32]} />
        <meshBasicMaterial 
          color={color} 
          transparent={true}
          opacity={0.3}
          side={2} // DoubleSide
        />
      </mesh>

      {/* メイン惑星 */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={(e) => onHover(true, e)}
        onPointerLeave={() => onHover(false)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color={color}
        />
      </mesh>

      {/* 表面の詳細 */}
      {Array.from({ length: 12 }).map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 12)
        const theta = Math.sqrt(12 * Math.PI) * phi
        
        return (
          <mesh
            key={i}
            position={[
              1.02 * Math.cos(theta) * Math.sin(phi),
              1.02 * Math.cos(phi),
              1.02 * Math.sin(theta) * Math.sin(phi)
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial 
              color={i % 2 === 0 ? "#ffffff" : "#cccccc"}
              transparent={true}
              opacity={0.7}
            />
          </mesh>
        )
      })}

      {/* 軌道パーティクル */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2
        const radius = 2.5 + Math.sin(i) * 0.3
        
        return (
          <mesh
            key={`particle-${i}`}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 3) * 0.2,
              Math.sin(angle) * radius
            ]}
          >
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial 
              color={color}
              transparent={true}
              opacity={0.8}
            />
          </mesh>
        )
      })}
    </group>
  )
}
