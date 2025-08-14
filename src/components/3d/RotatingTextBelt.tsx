'use client'

import { useFrame } from '@react-three/fiber'
import { Text3D } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

interface RotatingTextBeltProps {
  text: string
  centerPosition: [number, number, number]
  radius: number
  height: number
  rotationSpeed: number
  color?: string
  fontSize?: number
  font?: string
}

export default function RotatingTextBelt({
  text,
  centerPosition,
  radius,
  height,
  rotationSpeed,
  color = '#ffffff',
  fontSize = 0.5,
  font = '/fonts/helvetiker_regular.typeface.json'
}: RotatingTextBeltProps) {
  const groupRef = useRef<THREE.Group>(null)
  const textRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (groupRef.current) {
      // Y軸周りの回転
      groupRef.current.rotation.y += rotationSpeed * 0.01
    }
  })

  // テキストを円周上に配置
  const textPositions = text.split('').map((char, index) => {
    const angle = (index / text.length) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    return { char, position: [x, height, z] as [number, number, number], angle }
  })

  return (
    <group ref={groupRef} position={centerPosition}>
      {textPositions.map(({ char, position, angle }, index) => (
        <Text3D
          key={index}
          ref={textRef}
          font={font}
          size={fontSize}
          height={0.1}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          position={position}
          rotation={[0, -angle + Math.PI / 2, 0]} // テキストが円の中心を向くように
        >
          {char}
          <meshStandardMaterial color={color} />
        </Text3D>
      ))}
    </group>
  )
}
