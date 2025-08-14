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

// Canvas内で使用するラベル更新コンポーネント（ロード時のみ計算）
export function LabelUpdater() {
  const context = useContext(LabelContext)
  const { useThree } = require('@react-three/fiber')
  const { Vector3 } = require('three')
   
  const { camera, size } = useThree()
  const vector = useRef(new Vector3())

  // 座標計算（シンプル化）
  useEffect(() => {
    if (!context) return
    
    const calculatePositions = () => {
      if (context.labels.length === 0) return
      
      context.labels.forEach((label) => {
        try {
          // 3D座標をスクリーン座標に変換
          vector.current.set(label.position[0], label.position[1], label.position[2])
          vector.current.project(camera)

          // スクリーン座標を計算
          const x = Math.round((vector.current.x * 0.5 + 0.5) * size.width)
          const y = Math.round((vector.current.y * -0.5 + 0.5) * size.height)

          // 可視性判定（シンプル化）
          const isVisible = vector.current.z < 50.0 && 
                           x >= -2000 && x <= size.width + 2000 &&
                           y >= -2000 && y <= size.height + 2000

          // 更新
          context.updateLabel(label.id, { x, y, visible: isVisible })
        } catch (error) {
          console.warn(`Error calculating label ${label.id}:`, error)
        }
      })
    }

    // 初期計算
    setTimeout(calculatePositions, 100)
  }, [context, camera, size])

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
    setLabels(prev => {
      const existingLabel = prev.find(label => label.id === id)
      if (!existingLabel || 
          existingLabel.screenPosition?.x !== screenPosition.x ||
          existingLabel.screenPosition?.y !== screenPosition.y ||
          existingLabel.screenPosition?.visible !== screenPosition.visible) {
        return prev.map(label => 
          label.id === id ? { ...label, screenPosition } : label
        )
      }
      return prev // 変更がない場合は再レンダリングしない
    })
  }

    // ラベル追加
  const addLabel = (label: { id: string, text: string, position: [number, number, number], color: string }) => {
    setLabels(prev => {
      const filtered = prev.filter(l => l.id !== label.id)
      return [...filtered, label]
    })
  }

  return (
    <LabelContext.Provider value={{ labels, updateLabel, addLabel }}>
      {children}
             {/* HTML ラベルレンダリング */}
               {labels.map((label) => {
          if (!label.screenPosition) return null
          
          // 座標が有効な範囲内かチェック
          const isValidPosition = label.screenPosition.x !== undefined && 
                                 label.screenPosition.y !== undefined &&
                                 !isNaN(label.screenPosition.x) && 
                                 !isNaN(label.screenPosition.y)
          
          if (!isValidPosition) return null
          
          return (
            <div
              key={label.id}
              className="fixed pointer-events-none"
              style={{
                left: label.screenPosition.x,
                top: label.screenPosition.y,
                transform: 'translate(-50%, -50%)',
                color: label.color,
                zIndex: 9999,
                position: 'fixed'
              }}
            >
              <div className="text-center whitespace-nowrap">
                                 <div 
                   className="text-sm font-medium tracking-wide select-none"
                   style={{
                     fontFamily: '"Space Mono", "Courier New", monospace',
                     letterSpacing: '0.2em',
                     fontSize: '14px',
                     fontWeight: '400',
                     textTransform: 'uppercase',
                     color: `${label.color}`,
                     zIndex: '9999',
                     display: 'block',
                     visibility: 'visible',
                     background: `linear-gradient(135deg, 
                       rgba(255,255,255,0.1) 0%, 
                       rgba(255,255,255,0.05) 50%, 
                       rgba(255,255,255,0.1) 100%)`,
                     backdropFilter: 'blur(10px)',
                     WebkitBackdropFilter: 'blur(10px)',
                     border: `1px solid rgba(255,255,255,0.2)`,
                     borderRadius: '20px',
                     padding: '8px 16px',
                     boxShadow: `
                       0 8px 32px rgba(0,0,0,0.3),
                       inset 0 1px 0 rgba(255,255,255,0.1),
                       0 0 20px ${label.color}40
                     `,
                     textShadow: `
                       0 0 10px ${label.color},
                       0 0 20px ${label.color}80,
                       0 0 30px ${label.color}60
                     `,
                     animation: 'glassFloat 4s ease-in-out infinite'
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
        console.log(`useRegisterLabel: context available, adding label ${id}`)
        context.addLabel({ id, text, position, color })
      } else {
        console.log(`useRegisterLabel: context not available for ${id}`)
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
