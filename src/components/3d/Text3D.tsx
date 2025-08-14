'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

interface Text3DProps {
  position: [number, number, number]
  text: string
  size?: number
  color?: string
}

export default function Text3D({ position, text, size = 1, color = "#ffffff" }: Text3DProps) {
  const groupRef = useRef<Group>(null!)
  const lettersRef = useRef<Group[]>([])

  // フローティングアニメーション
  useFrame((state) => {
    if (!groupRef.current) return
    
    const time = state.clock.elapsedTime
    groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.3
    
    // 各文字の個別アニメーション
    lettersRef.current.forEach((letter, i) => {
      if (letter) {
        letter.position.y = Math.sin(time * 0.8 + i * 0.3) * 0.2
        letter.rotation.y = Math.sin(time * 0.6 + i * 0.2) * 0.1
      }
    })
  })

  // 文字を3Dジオメトリで表現
  const renderText = () => {
    const letters = text.split('')
    const letterWidth = size * 0.8
    const totalWidth = letters.length * letterWidth
    const startX = -totalWidth / 2

    return letters.map((letter, i) => (
      <group
        key={i}
        ref={(el) => {
          if (el) lettersRef.current[i] = el
        }}
        position={[startX + i * letterWidth, 0, 0]}
      >
        {/* 文字の3D表現（簡易版） */}
        {letter === 'ポ' && (
          <group>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[0.1, 0.6, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
            <mesh position={[0.2, 0.3, 0]}>
              <boxGeometry args={[0.1, 0.6, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
            <mesh position={[0.1, 0.5, 0]}>
              <boxGeometry args={[0.3, 0.1, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
            <mesh position={[0.1, 0.1, 0]}>
              <boxGeometry args={[0.3, 0.1, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
          </group>
        )}
        
        {letter === 'ー' && (
          <mesh>
            <boxGeometry args={[0.4, 0.1, 0.1]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
        )}
        
        {letter === 'ト' && (
          <group>
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[0.4, 0.1, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.1, 0.8, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
          </group>
        )}
        
        {letter === 'フ' && (
          <group>
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[0.4, 0.1, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
            <mesh position={[-0.1, 0.1, 0]}>
              <boxGeometry args={[0.1, 0.4, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
            <mesh position={[0.1, -0.1, 0]}>
              <boxGeometry args={[0.1, 0.4, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
          </group>
        )}
        
        {letter === 'ォ' && (
          <group scale={[0.8, 0.8, 0.8]}>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[0.1, 0.6, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
            <mesh position={[0.2, 0.3, 0]}>
              <boxGeometry args={[0.1, 0.6, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
            <mesh position={[0.1, 0.5, 0]}>
              <boxGeometry args={[0.3, 0.1, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
            <mesh position={[0.1, 0.1, 0]}>
              <boxGeometry args={[0.3, 0.1, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
          </group>
        )}
        
        {letter === 'リ' && (
          <group>
            <mesh position={[-0.1, 0, 0]}>
              <boxGeometry args={[0.1, 0.8, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
            <mesh position={[0.1, 0, 0]}>
              <boxGeometry args={[0.1, 0.8, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
          </group>
        )}
        
        {letter === 'オ' && (
          <group>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[0.1, 0.6, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
            <mesh position={[0.2, 0.3, 0]}>
              <boxGeometry args={[0.1, 0.6, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
            <mesh position={[0.1, 0.5, 0]}>
              <boxGeometry args={[0.3, 0.1, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
            <mesh position={[0.1, 0.1, 0]}>
              <boxGeometry args={[0.3, 0.1, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
          </group>
        )}
        
        {letter === 'サ' && (
          <group>
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[0.4, 0.1, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.4, 0.1, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
            <mesh position={[0.15, -0.2, 0]}>
              <boxGeometry args={[0.1, 0.4, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
          </group>
        )}
        
        {letter === 'イ' && (
          <group>
            <mesh position={[-0.1, 0, 0]}>
              <boxGeometry args={[0.1, 0.8, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
            <mesh position={[0.1, 0, 0]}>
              <boxGeometry args={[0.1, 0.6, 0.1]} />
              <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
            </mesh>
          </group>
        )}
        
        {/* スペース */}
        {letter === ' ' && <group />}
        
        {/* デフォルト（四角形） */}
        {!['ポ', 'ー', 'ト', 'フ', 'ォ', 'リ', 'オ', 'サ', 'イ', ' '].includes(letter) && (
          <mesh>
            <boxGeometry args={[0.3, 0.6, 0.1]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
        )}
        
        {/* 文字のグロー効果 */}
        <mesh scale={[1.2, 1.2, 1.2]}>
          <boxGeometry args={[0.4, 0.8, 0.2]} />
          <meshBasicMaterial 
            color={color} 
            transparent={true} 
            opacity={0.1} 
          />
        </mesh>
      </group>
    ))
  }

  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]}>
      {renderText()}
      
      {/* 背景パネル */}
      <mesh position={[0, 0, -0.5]} scale={[text.length * 0.9, 1.5, 0.1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial 
          color="#1e293b" 
          transparent={true} 
          opacity={0.3} 
        />
      </mesh>
      
      {/* 装飾パーティクル */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const radius = text.length * 0.6
        return (
          <mesh
            key={`particle-${i}`}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 0.3,
              Math.sin(angle) * 0.2
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial 
              color="#fbbf24" 
              transparent={true} 
              opacity={0.8} 
            />
          </mesh>
        )
      })}
    </group>
  )
}
