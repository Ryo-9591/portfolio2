'use client'

import { Suspense } from 'react'
import ModelLoader from './ModelLoader'

interface ModelLoaderWithFallbackProps {
  modelPath: string
  position: [number, number, number]
  scale?: [number, number, number] | number
  rotation?: [number, number, number]
  onClick?: () => void
  onHover?: (isHovering: boolean, event?: React.PointerEvent) => void
  animationType?: 'float' | 'rotate' | 'orbit' | 'none'
  fallbackColor?: string
}

// フォールバックコンポーネント
function FallbackModel({
  position,
  scale = 1,
  rotation = [0, 0, 0],
  onClick,
  onHover,
  fallbackColor = '#ffffff'
}: Omit<ModelLoaderWithFallbackProps, 'modelPath' | 'animationType'>) {
  return (
    <group 
      position={position}
      scale={scale}
      rotation={rotation}
      onClick={onClick}
      onPointerEnter={(e) => onHover?.(true, e)}
      onPointerLeave={() => onHover?.(false)}
    >
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={fallbackColor} />
      </mesh>
    </group>
  )
}

// ローディング中のコンポーネント
function LoadingModel({
  position,
  scale = 1,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number]
  scale?: [number, number, number] | number
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} scale={scale} rotation={rotation}>
      <mesh>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial color="#666666" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

export default function ModelLoaderWithFallback(props: ModelLoaderWithFallbackProps) {
  return (
    <Suspense
      fallback={
        <LoadingModel
          position={props.position}
          scale={props.scale}
          rotation={props.rotation}
        />
      }
    >
      <ModelLoader {...props} />
    </Suspense>
  )
}
