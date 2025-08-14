'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Universal3DModelProps } from '../Universal3DModel'

export default function AstronautFallback({ 
  position, 
  scale = [1, 1, 1], 
  rotation = [0, 0, 0],
  onClick, 
  onPointerOver, 
  onPointerOut 
}: Universal3DModelProps) {
  const groupRef = useRef<Group>(null!)
  const rightArmRef = useRef<Group>(null!)

  // アニメーション
  useFrame((state) => {
    if (groupRef.current) {
      // ビルボード効果（カメラに向く）
      groupRef.current.lookAt(state.camera.position)
    }
    
    // 右手を振る動作
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = -0.3 + Math.sin(state.clock.elapsedTime * 2.5) * 0.6
      rightArmRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
  })

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      rotation={rotation}
      onClick={(e) => {
        e?.stopPropagation?.()
        onClick?.()
      }}
      onPointerOver={(e) => {
        e?.stopPropagation?.()
        onPointerOver?.(e)
      }}
      onPointerOut={(e) => {
        e?.stopPropagation?.()
        onPointerOut?.(e)
      }}
    >
      {/* シンプルな宇宙飛行士形状 - 超軽量 */}
      
      {/* ヘルメット */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      
      {/* バイザー */}
      <mesh position={[0, 1.5, 0.35]}>
        <circleGeometry args={[0.25, 8]} />
        <meshBasicMaterial color="#1a1a2e" transparent opacity={0.8} />
      </mesh>
      
      {/* 胴体 - オレンジ色 */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 1.2, 8]} />
        <meshBasicMaterial color="#ff8c00" />
      </mesh>
      
      {/* コントロールパネル */}
      <mesh position={[0, 0.7, 0.41]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshBasicMaterial color="#2c2c54" />
      </mesh>
      
      {/* 左腕（静止） */}
      <group position={[-0.5, 0.8, 0]} rotation={[0, 0, 0.2]}>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 6]} />
          <meshBasicMaterial color="#ff8c00" />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
      
      {/* 右腕（手を振る） */}
      <group ref={rightArmRef} position={[0.5, 0.8, 0]} rotation={[0, 0, -0.3]}>
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 6]} />
          <meshBasicMaterial color="#ff8c00" />
        </mesh>
        <mesh position={[0, -0.7, 0]}>
          <sphereGeometry args={[0.1, 6, 6]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
      
      {/* 脚 */}
      {[-0.15, 0.15].map((x, i) => (
        <group key={i} position={[x, -0.3, 0]}>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 6]} />
            <meshBasicMaterial color="#ff8c00" />
          </mesh>
          <mesh position={[0, -0.9, 0.05]}>
            <boxGeometry args={[0.2, 0.15, 0.3]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}
      
      {/* 背中パック */}
      <mesh position={[0, 0.5, -0.3]}>
        <boxGeometry args={[0.3, 0.4, 0.15]} />
        <meshBasicMaterial color="#2c2c54" />
      </mesh>
    </group>
  )
}
