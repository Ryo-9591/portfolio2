'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group } from 'three'
import { Billboard } from '@react-three/drei'

interface Text3DTitleProps {
  position: [number, number, number]
  size?: number
  color?: string
}

export default function Text3DTitle({ position, size = 1.5, color = "#60a5fa" }: Text3DTitleProps) {
  const groupRef = useRef<Group>(null!)

  // ゆっくりとしたフローティングアニメーション + 動的回転（最適化）
  useFrame((state) => {
    if (!groupRef.current || state.clock.elapsedTime % 0.1 > 0.016) return // 約10FPSに制限
    
    const time = state.clock.elapsedTime
    groupRef.current.position.y = position[1] + Math.sin(time * 0.3) * 0.2
    // Y軸回転を大きくして、CONTACTラベルのような動的な向き変更
    groupRef.current.rotation.y = Math.sin(time * 0.2) * 0.15
    // X軸にも少し回転を追加
    groupRef.current.rotation.x = Math.sin(time * 0.15) * 0.05
  })

  return (
    <Billboard
      follow={true}
      lockX={false}
      lockY={false}
      lockZ={false}
    >
      <group ref={groupRef} position={[position[0], position[1], position[2]]}>
        {/* PORTFOLIO */}
        <group position={[-4 * size, 1 * size, 0]}>
        {/* P */}
        <group position={[-4 * size, 0, 0]}>
          {/* 縦線 */}
          <mesh position={[-0.3 * size, 0, 0]}>
            <boxGeometry args={[0.25 * size, 1.4 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 上横線 */}
          <mesh position={[0.1 * size, 0.5 * size, 0]}>
            <boxGeometry args={[0.7 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 中横線 */}
          <mesh position={[0.1 * size, 0.1 * size, 0]}>
            <boxGeometry args={[0.7 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 右縦線 */}
          <mesh position={[0.45 * size, 0.3 * size, 0]}>
            <boxGeometry args={[0.25 * size, 0.6 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
        </group>

        {/* O */}
        <group position={[-2.5 * size, 0, 0]}>
          {/* 上横線 */}
          <mesh position={[0, 0.5 * size, 0]}>
            <boxGeometry args={[0.8 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 下横線 */}
          <mesh position={[0, -0.5 * size, 0]}>
            <boxGeometry args={[0.8 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 左縦線 */}
          <mesh position={[-0.4 * size, 0, 0]}>
            <boxGeometry args={[0.25 * size, 1.0 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 右縦線 */}
          <mesh position={[0.4 * size, 0, 0]}>
            <boxGeometry args={[0.25 * size, 1.0 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
        </group>

        {/* R */}
        <group position={[-1 * size, 0, 0]}>
          {/* 縦線 */}
          <mesh position={[-0.3 * size, 0, 0]}>
            <boxGeometry args={[0.25 * size, 1.4 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 上横線 */}
          <mesh position={[0.1 * size, 0.5 * size, 0]}>
            <boxGeometry args={[0.7 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 中横線 */}
          <mesh position={[0.1 * size, 0.1 * size, 0]}>
            <boxGeometry args={[0.7 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 右上縦線 */}
          <mesh position={[0.45 * size, 0.3 * size, 0]}>
            <boxGeometry args={[0.25 * size, 0.6 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* Rの脚部 - 斜め線を2つに分けて明確に */}
          <mesh position={[0.2 * size, -0.15 * size, 0]} rotation={[0, 0, Math.PI / 6]}>
            <boxGeometry args={[0.4 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          <mesh position={[0.35 * size, -0.4 * size, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.4 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
        </group>

        {/* T */}
        <group position={[0.5 * size, 0, 0]}>
          {/* 上横線 */}
          <mesh position={[0, 0.5 * size, 0]}>
            <boxGeometry args={[1.2 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 縦線 */}
          <mesh position={[0, -0.1 * size, 0]}>
            <boxGeometry args={[0.25 * size, 1.0 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
        </group>

        {/* F */}
        <group position={[2 * size, 0, 0]}>
          {/* 縦線 */}
          <mesh position={[-0.3 * size, 0, 0]}>
            <boxGeometry args={[0.25 * size, 1.4 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 上横線 */}
          <mesh position={[0.1 * size, 0.5 * size, 0]}>
            <boxGeometry args={[0.7 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 中横線 */}
          <mesh position={[0.05 * size, 0.1 * size, 0]}>
            <boxGeometry args={[0.6 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
        </group>

        {/* O (OLIO の最初のO) */}
        <group position={[3.5 * size, 0, 0]}>
          {/* 上横線 */}
          <mesh position={[0, 0.5 * size, 0]}>
            <boxGeometry args={[0.8 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 下横線 */}
          <mesh position={[0, -0.5 * size, 0]}>
            <boxGeometry args={[0.8 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 左縦線 */}
          <mesh position={[-0.4 * size, 0, 0]}>
            <boxGeometry args={[0.25 * size, 1.0 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 右縦線 */}
          <mesh position={[0.4 * size, 0, 0]}>
            <boxGeometry args={[0.25 * size, 1.0 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
        </group>

        {/* L */}
        <group position={[5 * size, 0, 0]}>
          {/* 縦線 */}
          <mesh position={[-0.3 * size, 0, 0]}>
            <boxGeometry args={[0.25 * size, 1.4 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 下横線 */}
          <mesh position={[0.1 * size, -0.5 * size, 0]}>
            <boxGeometry args={[0.7 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
        </group>

        {/* I */}
        <group position={[6.2 * size, 0, 0]}>
          {/* 縦線 */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.25 * size, 1.4 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 上横線 */}
          <mesh position={[0, 0.5 * size, 0]}>
            <boxGeometry args={[0.6 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 下横線 */}
          <mesh position={[0, -0.5 * size, 0]}>
            <boxGeometry args={[0.6 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
        </group>

        {/* O (OLIO の最後のO) */}
        <group position={[7.5 * size, 0, 0]}>
          {/* 上横線 */}
          <mesh position={[0, 0.5 * size, 0]}>
            <boxGeometry args={[0.8 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 下横線 */}
          <mesh position={[0, -0.5 * size, 0]}>
            <boxGeometry args={[0.8 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 左縦線 */}
          <mesh position={[-0.4 * size, 0, 0]}>
            <boxGeometry args={[0.25 * size, 1.0 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 右縦線 */}
          <mesh position={[0.4 * size, 0, 0]}>
            <boxGeometry args={[0.25 * size, 1.0 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
        </group>
      </group>

      {/* SITE */}
      <group position={[-1 * size, -1.5 * size, 0]}>
        {/* S */}
        <group position={[-1.5 * size, 0, 0]}>
          <mesh position={[0, 0.4 * size, 0]}>
            <boxGeometry args={[0.8 * size, 0.2 * size, 0.3 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.8 * size, 0.2 * size, 0.3 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          <mesh position={[0, -0.4 * size, 0]}>
            <boxGeometry args={[0.8 * size, 0.2 * size, 0.3 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          <mesh position={[-0.3 * size, 0.2 * size, 0]}>
            <boxGeometry args={[0.2 * size, 0.4 * size, 0.3 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          <mesh position={[0.3 * size, -0.2 * size, 0]}>
            <boxGeometry args={[0.2 * size, 0.4 * size, 0.3 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
        </group>

        {/* I */}
        <group position={[0, 0, 0]}>
          {/* 縦線 */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.25 * size, 1.0 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 上横線 */}
          <mesh position={[0, 0.4 * size, 0]}>
            <boxGeometry args={[0.6 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 下横線 */}
          <mesh position={[0, -0.4 * size, 0]}>
            <boxGeometry args={[0.6 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
        </group>

        {/* T */}
        <group position={[1.5 * size, 0, 0]}>
          {/* 上横線 */}
          <mesh position={[0, 0.4 * size, 0]}>
            <boxGeometry args={[1.2 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 縦線 */}
          <mesh position={[0, -0.1 * size, 0]}>
            <boxGeometry args={[0.25 * size, 1.0 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
        </group>

        {/* E */}
        <group position={[3 * size, 0, 0]}>
          {/* 縦線 */}
          <mesh position={[-0.3 * size, 0, 0]}>
            <boxGeometry args={[0.25 * size, 1.4 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 上横線 */}
          <mesh position={[0.1 * size, 0.5 * size, 0]}>
            <boxGeometry args={[0.7 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 中横線 */}
          <mesh position={[0.05 * size, 0, 0]}>
            <boxGeometry args={[0.6 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
          {/* 下横線 */}
          <mesh position={[0.1 * size, -0.5 * size, 0]}>
            <boxGeometry args={[0.7 * size, 0.25 * size, 0.4 * size]} />
            <meshBasicMaterial color={color} transparent={true} opacity={1.0} />
          </mesh>
        </group>
      </group>

      {/* 背景パネル */}
      <mesh position={[0, -0.2 * size, -0.5 * size]} scale={[14 * size, 4.5 * size, 0.2 * size]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial 
          color="#1e293b" 
          transparent={true} 
          opacity={0.3} 
        />
      </mesh>

      {/* グロー効果 */}
      <mesh position={[0, -0.2 * size, -0.7 * size]} scale={[16 * size, 5.5 * size, 0.1 * size]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial 
          color={color} 
          transparent={true} 
          opacity={0.1} 
        />
      </mesh>

      {/* 装飾パーティクル - 削除 */}
      {/* 黄色い輪のオブジェクトを削除
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const radius = 8 * size
        return (
          <mesh
            key={`particle-${i}`}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle * 2) * 0.5 * size,
              Math.sin(angle) * 0.3 * size
            ]}
          >
            <sphereGeometry args={[0.08 * size, 8, 8]} />
            <meshBasicMaterial 
              color="#fbbf24" 
              transparent={true} 
              opacity={0.8} 
            />
          </mesh>
        )
      })}
      */}
      </group>
    </Billboard>
  )
}
