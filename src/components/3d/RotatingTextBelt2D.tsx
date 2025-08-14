'use client'

import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

interface RotatingTextBelt2DProps {
  text: string
  centerPosition: [number, number, number]
  radius: number
  height: number
  rotationSpeed: number
  color?: string
  fontSize?: number
  beltColor?: string
  beltWidth?: number
}

export default function RotatingTextBelt2D({
  text,
  centerPosition,
  radius,
  height,
  rotationSpeed,
  color = '#ffffff',
  fontSize = 0.5,
  beltColor = '#ffffff',
  beltWidth = 0.1
}: RotatingTextBelt2DProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Y軸周りの回転
      groupRef.current.rotation.y += rotationSpeed * 0.01
    }
  })

  // テキストを3つ、円周上に均等に配置（帯の外側に）
  const textCount = 3
  const textPositions = Array.from({ length: textCount }, (_, index) => {
    const angle = (index / textCount) * Math.PI * 2
    const x = Math.cos(angle) * (radius + 0.5)
    const z = Math.sin(angle) * (radius + 0.5)
    return { text, position: [x, 0, z] as [number, number, number], angle }
  })

  return (
    <group ref={groupRef} position={centerPosition}>
      {/* 高級感のあるメインベルト（グラデーション効果） */}
      <mesh>
        <cylinderGeometry args={[radius, radius, beltWidth, 64, 1, true]} />
        <meshBasicMaterial 
          color={beltColor} 
          transparent 
          opacity={0.1} 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* 内側の光るエッジ（サイバーパンク風） */}
      <mesh>
        <cylinderGeometry args={[radius - 0.02, radius - 0.02, beltWidth + 0.01, 64, 1, true]} />
        <meshBasicMaterial 
          color="#00ffff" 
          transparent 
          opacity={0.08} 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* 外側の光るエッジ（高級感） */}
      <mesh>
        <cylinderGeometry args={[radius + 0.02, radius + 0.02, beltWidth + 0.01, 64, 1, true]} />
        <meshBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.05} 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* テキスト（高級感のある宇宙ゲーム風スタイル） */}
      {textPositions.map(({ text, position, angle }, index) => (
        <Text
          key={index}
          position={position}
          fontSize={fontSize}
          color={color}
          anchorX="center"
          anchorY="middle"
          rotation={[0, -angle + Math.PI / 2, 0]}
          font="/fonts/Orbitron-Bold.ttf"
        >
          {text}
        </Text>
      ))}
    </group>
  )
}
