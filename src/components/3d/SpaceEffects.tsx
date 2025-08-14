'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'

interface SpaceEffectsProps {
  center?: [number, number, number]
}

export default function SpaceEffects({ center = [0, 0, 0] }: SpaceEffectsProps) {
  const nebulaeRef = useRef<Group[]>([])
  const energyRingsRef = useRef<Group[]>([])
  const wormholeRef = useRef<Group>(null!)

  // 軽量化されたアニメーション（自転のみ、30FPS制限）
  useFrame((state) => {
    // 30FPSに制限（約0.033秒間隔）
    if (state.clock.elapsedTime % 0.033 < 0.016) {
      const time = state.clock.elapsedTime
      
      // 星雲の軽微な自転（速度削減）
      nebulaeRef.current.forEach((nebula, i) => {
        if (nebula) {
          nebula.rotation.y = time * (0.025 + i * 0.01)
        }
      })
      
      // エネルギーリングの自転（速度削減）
      energyRingsRef.current.forEach((ring, i) => {
        if (ring) {
          ring.rotation.z = time * (0.1 + i * 0.05)
        }
      })
      
      // ワームホールの自転（速度削減）
      if (wormholeRef.current) {
        wormholeRef.current.rotation.z = time * 0.25
      }
    }
  })

  return (
    <group>
      {/* 星雲エフェクト（軽量化） */}
      {[0, 1].map((i) => {
        const angle = (i / 3) * Math.PI * 2
        const distance = 60 + i * 20
        return (
          <group
            key={`nebula-${i}`}
            ref={(el) => {
              if (el) nebulaeRef.current[i] = el
            }}
            position={[
              center[0] + Math.cos(angle) * distance,
              center[1] + (i - 1) * 15,
              center[2] + Math.sin(angle) * distance
            ]}
          >
            {/* メイン星雲 */}
            <mesh>
              <sphereGeometry args={[8, 8, 8]} />
              <meshBasicMaterial 
                color={i === 0 ? "#7c3aed" : i === 1 ? "#3b82f6" : "#06b6d4"} 
                transparent={true} 
                opacity={0.1} 
              />
            </mesh>
            
            {/* 星雲の核 */}
            <mesh>
              <sphereGeometry args={[3, 8, 8]} />
              <meshBasicMaterial 
                color={i === 0 ? "#a855f7" : i === 1 ? "#60a5fa" : "#22d3ee"} 
                transparent={true} 
                opacity={0.3} 
              />
            </mesh>
            
            {/* 星雲内の星（軽量化） */}
            {Array.from({ length: 3 }).map((_, j) => {
              const starAngle = (j / 6) * Math.PI * 2
              const starRadius = 2 + Math.random() * 4
              return (
                <mesh
                  key={`star-${j}`}
                  position={[
                    Math.cos(starAngle) * starRadius,
                    (Math.random() - 0.5) * 6,
                    Math.sin(starAngle) * starRadius
                  ]}
                >
                  <sphereGeometry args={[0.05, 6, 6]} />
                  <meshBasicMaterial color="#ffffff" transparent={true} opacity={0.8} />
                </mesh>
              )
            })}
          </group>
        )
      })}

      {/* エネルギーリング - 削除 */}
      {/* 黄色い輪のオブジェクトを削除
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2
        const distance = 45
        return (
          <group
            key={`energy-ring-${i}`}
            ref={(el) => {
              if (el) energyRingsRef.current[i] = el
            }}
            position={[
              center[0] + Math.cos(angle) * distance,
              center[1] + Math.sin(angle * 2) * 10,
              center[2] + Math.sin(angle) * distance
            ]}
          >
            <mesh>
              <torusGeometry args={[3, 0.3, 8, 32]} />
              <meshBasicMaterial 
                color="#fbbf24" 
                transparent={true} 
                opacity={0.6} 
              />
            </mesh>
            <mesh>
              <torusGeometry args={[2.5, 0.1, 8, 32]} />
              <meshBasicMaterial 
                color="#f59e0b" 
                transparent={true} 
                opacity={0.8} 
              />
            </mesh>
          </group>
        )
      })}
      */}

      {/* ワームホール */}
      <group
        ref={wormholeRef}
        position={[center[0] - 80, center[1] + 20, center[2] + 60]}
      >
        {/* ワームホールの層 */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={`wormhole-layer-${i}`} scale={[1 - i * 0.15, 1 - i * 0.15, 1]}>
            <torusGeometry args={[4 - i * 0.5, 0.5, 16, 32]} />
            <meshBasicMaterial 
              color={i % 2 === 0 ? "#8b5cf6" : "#a855f7"} 
              transparent={true} 
              opacity={0.4 - i * 0.05} 
            />
          </mesh>
        ))}
        
        {/* ワームホール中心の光 */}
        <mesh>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent={true} opacity={0.8} />
        </mesh>
      </group>

      {/* 宇宙塵の雲（さらに軽量化） */}
      {Array.from({ length: 8 }).map((_, i) => {
        const cloudAngle = (i / 30) * Math.PI * 2
        const cloudDistance = 70 + Math.random() * 40
        return (
          <mesh
            key={`dust-cloud-${i}`}
            position={[
              center[0] + Math.cos(cloudAngle) * cloudDistance,
              center[1] + (Math.random() - 0.5) * 60,
              center[2] + Math.sin(cloudAngle) * cloudDistance
            ]}
          >
            <sphereGeometry args={[1 + Math.random() * 2, 8, 8]} />
            <meshBasicMaterial 
              color="#6b7280" 
              transparent={true} 
              opacity={0.1} 
            />
          </mesh>
        )
      })}

      {/* 遠方の星々（さらに軽量化） */}
      {Array.from({ length: 25 }).map((_, i) => {
        const starAngle = Math.random() * Math.PI * 2
        const starDistance = 100 + Math.random() * 200
        const starHeight = (Math.random() - 0.5) * 200
        return (
          <mesh
            key={`distant-star-${i}`}
            position={[
              center[0] + Math.cos(starAngle) * starDistance,
              center[1] + starHeight,
              center[2] + Math.sin(starAngle) * starDistance
            ]}
          >
            <sphereGeometry args={[0.1 + Math.random() * 0.2, 4, 4]} />
            <meshBasicMaterial 
              color={Math.random() > 0.7 ? "#fbbf24" : "#ffffff"} 
              transparent={true} 
              opacity={0.6 + Math.random() * 0.4} 
            />
          </mesh>
        )
      })}
    </group>
  )
}
