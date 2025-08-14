'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Group } from 'three'

interface SatelliteProps {
  position: [number, number, number]
  onClick: () => void
  onHover: (isHovering: boolean, event?: React.PointerEvent) => void
}

export default function Satellite({ position, onClick, onHover }: SatelliteProps) {
  const groupRef = useRef<Group>(null!)
  const solarPanelRef1 = useRef<Mesh>(null!)
  const solarPanelRef2 = useRef<Mesh>(null!)
  const antennaRef = useRef<Mesh>(null!)

  // アニメーション：軌道運動とソーラーパネルの回転
  useFrame((state) => {
    if (groupRef.current) {
      // 軌道運動
      const time = state.clock.elapsedTime * 0.3
      groupRef.current.position.x = position[0] + Math.cos(time) * 2
      groupRef.current.position.z = position[2] + Math.sin(time) * 2
      groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.5
      
      // 地球を向く回転
      groupRef.current.rotation.y = time + Math.PI
    }

    // ソーラーパネルの回転
    if (solarPanelRef1.current && solarPanelRef2.current) {
      solarPanelRef1.current.rotation.z += 0.02
      solarPanelRef2.current.rotation.z -= 0.02
    }

    // アンテナの振動
    if (antennaRef.current) {
      antennaRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <group 
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerEnter={(e) => onHover(true, e)}
      onPointerLeave={() => onHover(false)}
    >
      {/* メイン本体 */}
      <mesh>
        <boxGeometry args={[1, 0.6, 1]} />
        <meshBasicMaterial color="#e5e7eb" />
      </mesh>

      {/* ソーラーパネル左 */}
      <mesh ref={solarPanelRef1} position={[-1.5, 0, 0]}>
        <boxGeometry args={[1, 0.05, 2]} />
        <meshBasicMaterial color="#1e40af" />
      </mesh>

      {/* ソーラーパネル右 */}
      <mesh ref={solarPanelRef2} position={[1.5, 0, 0]}>
        <boxGeometry args={[1, 0.05, 2]} />
        <meshBasicMaterial color="#1e40af" />
      </mesh>

      {/* アンテナ */}
      <mesh ref={antennaRef} position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>

      {/* アンテナディッシュ */}
      <mesh position={[0, 1.3, 0]} rotation={[Math.PI / 6, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.25, 0.1, 16]} />
        <meshBasicMaterial color="#e5e7eb" />
      </mesh>

      {/* 通信ビーム */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.1, 0.5, 8]} />
        <meshBasicMaterial 
          color="#06b6d4" 
          transparent={true}
          opacity={0.3}
        />
      </mesh>

      {/* 信号ライト */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI) / 2) * 0.6,
            0.35,
            Math.sin((i * Math.PI) / 2) * 0.6
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial 
            color={i % 2 === 0 ? "#ef4444" : "#22c55e"}
          />
        </mesh>
      ))}

      {/* 推進器 */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.4, -0.4, -0.6]}>
          <cylinderGeometry args={[0.08, 0.06, 0.2]} />
          <meshBasicMaterial color="#374151" />
        </mesh>
      ))}

      {/* 通信信号エフェクト */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={`signal-${i}`}
          position={[0, 1.8 + i * 0.3, 0]}
          scale={[1 + i * 0.2, 0.1, 1 + i * 0.2]}
        >
          <ringGeometry args={[0.2, 0.25, 16]} />
          <meshBasicMaterial 
            color="#06b6d4"
            transparent={true}
            opacity={0.6 - i * 0.1}
          />
        </mesh>
      ))}
    </group>
  )
}
