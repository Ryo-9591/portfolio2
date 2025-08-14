'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, Group } from 'three'

interface SpaceStationProps {
  position: [number, number, number]
  onClick: () => void
  onHover: (isHovering: boolean, event?: React.PointerEvent) => void
}

export default function SpaceStation({ position, onClick, onHover }: SpaceStationProps) {
  const groupRef = useRef<Group>(null!)
  const ringRef = useRef<Mesh>(null!)
  const moduleRefs = useRef<Mesh[]>([])

  // アニメーション：ゆっくりとした回転と浮遊
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.3) * 0.8
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01
    }

    // モジュールの個別アニメーション
    moduleRefs.current.forEach((module, i) => {
      if (module) {
        module.rotation.x = Math.sin(state.clock.elapsedTime + i) * 0.05
        module.rotation.z = Math.cos(state.clock.elapsedTime + i) * 0.05
      }
    })
  })

  return (
    <group 
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerEnter={(e) => onHover(true, e)}
      onPointerLeave={() => onHover(false)}
    >
      {/* 中央ハブ */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#e5e7eb" />
      </mesh>

      {/* 回転リング */}
      <mesh ref={ringRef}>
        <torusGeometry args={[3, 0.2, 8, 32]} />
        <meshBasicMaterial color="#6366f1" />
      </mesh>

      {/* 居住モジュール（リング上） */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <mesh
            key={`habitat-${i}`}
            ref={(el) => {
              if (el) moduleRefs.current[i] = el
            }}
            position={[
              Math.cos(angle) * 3,
              0,
              Math.sin(angle) * 3
            ]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.4, 0.6, 1.2]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>
        )
      })}

      {/* ドッキングポート */}
      {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, i) => (
        <mesh
          key={`dock-${i}`}
          position={[
            Math.cos(angle) * 1.2,
            0,
            Math.sin(angle) * 1.2
          ]}
          rotation={[0, angle, 0]}
        >
          <cylinderGeometry args={[0.15, 0.2, 0.8]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>
      ))}

      {/* ソーラーアレイ */}
      {[-1, 1].map((side) => (
        <group key={`solar-${side}`} position={[side * 5, 0, 0]}>
          {/* サポート構造 */}
          <mesh>
            <boxGeometry args={[3, 0.1, 0.1]} />
            <meshBasicMaterial color="#374151" />
          </mesh>
          
          {/* ソーラーパネル */}
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh
              key={i}
              position={[(-2.5 + i), 0, 0]}
              rotation={[0, 0, Math.sin(i) * 0.1]}
            >
              <boxGeometry args={[0.8, 0.02, 1.5]} />
              <meshBasicMaterial 
                color="#1e40af"
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* 通信アンテナ */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>

      {/* アンテナディッシュ */}
      <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 4, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.6, 0.2, 16]} />
        <meshBasicMaterial color="#e5e7eb" />
      </mesh>

      {/* 推進システム */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2
        return (
          <mesh
            key={`thruster-${i}`}
            position={[
              Math.cos(angle) * 4,
              -1,
              Math.sin(angle) * 4
            ]}
            rotation={[0, angle + Math.PI, 0]}
          >
            <cylinderGeometry args={[0.1, 0.15, 0.5]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        )
      })}

      {/* ナビゲーションライト */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        return (
          <mesh
            key={`light-${i}`}
            position={[
              Math.cos(angle) * 3.5,
              0.5,
              Math.sin(angle) * 3.5
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial 
              color={i % 3 === 0 ? "#ef4444" : i % 3 === 1 ? "#22c55e" : "#3b82f6"}
            />
          </mesh>
        )
      })}
    </group>
  )
}
