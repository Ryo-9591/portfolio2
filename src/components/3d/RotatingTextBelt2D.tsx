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

  // テキストを円周上に沿って配置（帯の外側に）
  const textPositions = text.split('').map((char, index) => {
    const angle = (index / text.length) * Math.PI * 2
    const x = Math.cos(angle) * (radius + 0.5)
    const z = Math.sin(angle) * (radius + 0.5)
    return { char, position: [x, 0, z] as [number, number, number], angle }
  })

  return (
    <group ref={groupRef} position={centerPosition}>
      {/* 透明感のある帯（1つ） */}
      <mesh>
        <cylinderGeometry args={[radius, radius, beltWidth, 64, 1, true]} />
        <meshBasicMaterial color={beltColor} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      
      {/* テキスト（帯の円周上に沿って配置し、帯と一緒に回転） */}
      {textPositions.map(({ char, position, angle }, index) => (
        <Text
          key={index}
          position={position}
          fontSize={fontSize}
          color={color}
          anchorX="center"
          anchorY="middle"
          rotation={[0, -angle + Math.PI / 2, 0]} // テキストが円周上に沿って向くように
        >
          {char}
        </Text>
      ))}
    </group>
  )
}
