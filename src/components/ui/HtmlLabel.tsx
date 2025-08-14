'use client'

import { createContext, useContext, useRef, useState, useEffect } from 'react'

interface LabelContextType {
  labels: Array<{
    id: string
    text: string
    position: [number, number, number]
    color: string
    screenPosition?: { x: number, y: number, visible: boolean }
  }>
  updateLabel: (id: string, screenPosition: { x: number, y: number, visible: boolean }) => void
  addLabel: (label: { id: string, text: string, position: [number, number, number], color: string }) => void
}

const LabelContext = createContext<LabelContextType | null>(null)

// Canvas内で使用するラベル更新コンポーネント
export function LabelUpdater() {
  const context = useContext(LabelContext)
  const { useFrame, useThree } = require('@react-three/fiber')
  const { Vector3 } = require('three')
  
  const { camera, size } = useThree()
  const vector = useRef(new Vector3())
  const frameCount = useRef(0)

  useFrame(() => {
    if (!context) return

    context.labels.forEach((label) => {
      // 3D座標をスクリーン座標に変換
      vector.current.set(label.position[0], label.position[1], label.position[2])
      vector.current.project(camera)

      // スクリーン座標を計算（小数点を丸める）
      const x = Math.round((vector.current.x * 0.5 + 0.5) * size.width)
      const y = Math.round((vector.current.y * -0.5 + 0.5) * size.height)

      // カメラの後ろにある場合は非表示
      const isVisible = vector.current.z < 1

      // 常に更新（デバッグのため）
      context.updateLabel(label.id, { x, y, visible: isVisible })
    })
  })

  return null
}

// ラベルプロバイダー
export function LabelProvider({ children }: { children: React.ReactNode }) {
  const [labels, setLabels] = useState<Array<{
    id: string
    text: string
    position: [number, number, number]
    color: string
    screenPosition?: { x: number, y: number, visible: boolean }
  }>>([])

  const updateLabel = (id: string, screenPosition: { x: number, y: number, visible: boolean }) => {
    setLabels(prev => prev.map(label => 
      label.id === id ? { ...label, screenPosition } : label
    ))
  }

  const addLabel = (label: { id: string, text: string, position: [number, number, number], color: string }) => {
    setLabels(prev => [...prev.filter(l => l.id !== label.id), label])
  }

  return (
    <LabelContext.Provider value={{ labels, updateLabel, addLabel }}>
      {children}
      {/* HTML ラベルレンダリング */}
      {labels.map((label) => {
        // デバッグ用ログ
        console.log('Label:', label.id, 'ScreenPos:', label.screenPosition)
        
        if (!label.screenPosition) return null
        
        return (
          <div
            key={label.id}
            className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: label.screenPosition.x,
              top: label.screenPosition.y,
              color: label.color,
            }}
          >
            <div className="text-center">
              <div 
                className="text-lg font-bold tracking-wider drop-shadow-lg"
                style={{
                  textShadow: `
                    0 0 10px ${label.color},
                    0 0 20px ${label.color},
                    0 0 30px ${label.color},
                    2px 2px 4px rgba(0,0,0,0.8)
                  `,
                  fontFamily: 'monospace',
                  letterSpacing: '0.2em',
                  opacity: 1 // 常に表示
                }}
              >
                {label.text}
              </div>
            </div>
          </div>
        )
      })}
    </LabelContext.Provider>
  )
}

// ラベル登録用Hook
export function useRegisterLabel(id: string, text: string, position: [number, number, number], color: string) {
  const context = useContext(LabelContext)
  
  useEffect(() => {
    if (context) {
      context.addLabel({ id, text, position, color })
    }
  }, [context, id, text, position[0], position[1], position[2], color])
}

// 簡単に使用するためのコンポーネント
interface HtmlLabelProps {
  text: string
  position: [number, number, number]
  color?: string
}

export default function HtmlLabel({ text, position, color = '#ffffff' }: HtmlLabelProps) {
  const id = `${text}-${position.join('-')}`
  useRegisterLabel(id, text, position, color)
  return null
}
