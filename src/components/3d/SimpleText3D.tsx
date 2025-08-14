'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

interface SimpleText3DProps {
  position: [number, number, number]
  text: string
  size?: number
  color?: string
}

export default function SimpleText3D({ position, text, size = 1, color = "#ffffff" }: SimpleText3DProps) {
  const groupRef = useRef<Group>(null!)

  // ゆっくりとしたフローティングアニメーション
  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.elapsedTime
    groupRef.current.position.y = position[1] + Math.sin(time * 0.3) * 0.2
    groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.05
  })

  // シンプルな文字表現
  const renderSimpleText = () => {
    const words = text.split(' ')
    const totalWidth = words.length * 4 * size
    const startX = -totalWidth / 2

    return words.map((word, wordIndex) => (
      <group key={wordIndex} position={[startX + wordIndex * 4 * size, 0, 0]}>
        {/* 背景パネル */}
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[3.5 * size, 1.5 * size, 0.2 * size]} />
          <meshBasicMaterial 
            color="#1e293b" 
            transparent={true} 
            opacity={0.8} 
          />
        </mesh>
        
        {/* 文字の枠 */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.2 * size, 1.2 * size, 0.3 * size]} />
          <meshBasicMaterial 
            color={color} 
            transparent={true} 
            opacity={1.0} 
          />
        </mesh>
        
        {/* 文字の中身（くり抜き風） */}
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[2.8 * size, 0.8 * size, 0.2 * size]} />
          <meshBasicMaterial 
            color="#0f172a" 
            transparent={true} 
            opacity={1.0} 
          />
        </mesh>
        
        {/* 装飾ライン */}
        <mesh position={[0, 0.7 * size, 0.1]}>
          <boxGeometry args={[3.0 * size, 0.1 * size, 0.1 * size]} />
          <meshBasicMaterial 
            color={color} 
            transparent={true} 
            opacity={1.0} 
          />
        </mesh>
        <mesh position={[0, -0.7 * size, 0.1]}>
          <boxGeometry args={[3.0 * size, 0.1 * size, 0.1 * size]} />
          <meshBasicMaterial 
            color={color} 
            transparent={true} 
            opacity={1.0} 
          />
        </mesh>
        
        {/* グロー効果 */}
        <mesh position={[0, 0, -0.2]} scale={[1.3, 1.3, 1.3]}>
          <boxGeometry args={[3.5 * size, 1.5 * size, 0.1 * size]} />
          <meshBasicMaterial 
            color={color} 
            transparent={true} 
            opacity={0.2} 
          />
        </mesh>
        
        {/* 角の装飾 */}
        {[
          [-1.5 * size, 0.6 * size], [1.5 * size, 0.6 * size],
          [-1.5 * size, -0.6 * size], [1.5 * size, -0.6 * size]
        ].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.2]}>
            <sphereGeometry args={[0.1 * size, 8, 8]} />
            <meshBasicMaterial 
              color="#fbbf24" 
              transparent={true} 
              opacity={1.0} 
            />
          </mesh>
        ))}
      </group>
    ))
  }

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      {renderSimpleText()}
      
      {/* 周囲のパーティクル */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 6 * size
        return (
          <mesh
            key={`particle-${i}`}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 0.5,
              Math.sin(angle) * 0.3
            ]}
          >
            <sphereGeometry args={[0.08 * size, 8, 8]} />
            <meshBasicMaterial 
              color="#60a5fa" 
              transparent={true} 
              opacity={0.8} 
            />
          </mesh>
        )
      })}
    </group>
  )
}
