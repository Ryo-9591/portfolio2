'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'

interface RocketProps {
  position: [number, number, number]
  onClick: () => void
  onHover: (isHovering: boolean, event?: React.PointerEvent) => void
}

export default function Rocket({ position, onClick, onHover }: RocketProps) {
  const meshRef = useRef<Mesh>(null!)
  const glowRef = useRef<Mesh>(null!)

  // アニメーション：浮遊とゆっくりした回転
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
    if (glowRef.current) {
      glowRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      glowRef.current.rotation.y += 0.02
    }
  })

  return (
    <group position={position}>
      {/* グロー効果 */}
      <mesh
        ref={glowRef}
        scale={[2.5, 2.5, 2.5]}
        onClick={onClick}
        onPointerEnter={(e) => onHover(true, e)}
        onPointerLeave={() => onHover(false)}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial 
          color="#7c3aed" 
          transparent={true}
          opacity={0.1}
        />
      </mesh>

      {/* メインロケット */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerEnter={(e) => onHover(true, e)}
        onPointerLeave={() => onHover(false)}
      >
        {/* ロケット本体 */}
        <group>
          {/* 胴体 */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
            <meshBasicMaterial color="#e5e7eb" />
          </mesh>
          
          {/* 先端 */}
          <mesh position={[0, 1.2, 0]}>
            <coneGeometry args={[0.3, 0.8, 8]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
          
          {/* 翼 */}
          {[0, 1, 2, 3].map((i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i * Math.PI) / 2) * 0.6,
                -0.8,
                Math.sin((i * Math.PI) / 2) * 0.6
              ]}
              rotation={[0, (i * Math.PI) / 2, 0]}
            >
              <boxGeometry args={[0.1, 0.6, 0.4]} />
              <meshBasicMaterial color="#dc2626" />
            </mesh>
          ))}

          {/* エンジン噴射口 */}
          <mesh position={[0, -1.2, 0]}>
            <cylinderGeometry args={[0.25, 0.35, 0.4, 8]} />
            <meshBasicMaterial color="#1f2937" />
          </mesh>

          {/* 噴射炎エフェクト */}
          <mesh position={[0, -1.8, 0]}>
            <coneGeometry args={[0.2, 1, 8]} />
            <meshBasicMaterial 
              color="#ff4500" 
              transparent={true}
              opacity={0.8}
            />
          </mesh>
        </group>
      </mesh>

      {/* パーティクル効果 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 4,
            position[1] + (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4
          ]}
        >
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial 
            color={Math.random() > 0.5 ? "#fbbf24" : "#7c3aed"} 
            transparent={true}
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}
