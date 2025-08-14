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
  const isInitialized = useRef(false)

  // ロード時のみ座標計算（パフォーマンス向上）
  useEffect(() => {
    if (!context) {
      console.log('LabelUpdater: context not available')
      return
    }
    
    const calculatePositions = () => {
      if (context.labels.length === 0) {
        console.log('LabelUpdater: no labels to calculate')
        return
      }
      
      console.log(`Calculating positions for ${context.labels.length} labels`)
      context.labels.forEach((label) => {
        try {
          // 3D座標をスクリーン座標に変換
          vector.current.set(label.position[0], label.position[1], label.position[2])
          vector.current.project(camera)

          // スクリーン座標を計算
          const x = Math.round((vector.current.x * 0.5 + 0.5) * size.width)
          const y = Math.round((vector.current.y * -0.5 + 0.5) * size.height)

                     // 可視性判定（テキスト表示を確実にするため大幅に緩和）
           const isVisible = vector.current.z < 50.0 && 
                            x >= -2000 && x <= size.width + 2000 &&
                            y >= -2000 && y <= size.height + 2000

          console.log(`Label ${label.id}: x=${x}, y=${y}, z=${vector.current.z}, visible=${isVisible}`)

          // 更新
          context.updateLabel(label.id, { x, y, visible: isVisible })
        } catch (error) {
          console.warn(`Error calculating label ${label.id}:`, error)
        }
      })
    }

    // 初期計算（複数回試行して確実に実行）
    const initialCalculation = () => {
      if (context.labels.length > 0) {
        calculatePositions()
        isInitialized.current = true
        console.log('LabelUpdater: initial calculation completed')
      } else {
        console.log('LabelUpdater: retrying initial calculation...')
        setTimeout(initialCalculation, 200)
      }
    }

    // 初期計算開始
    setTimeout(initialCalculation, 100)

    // カメラ変更時のみ再計算（ユーザー操作時）
    const handleCameraChange = () => {
      setTimeout(calculatePositions, 100) // 少し遅延させて安定化
    }

    // カメラ変更を検知（簡易的な方法）
    const checkCameraChange = () => {
      if (camera.position.x !== 0 || camera.position.y !== 0 || camera.position.z !== 25) {
        handleCameraChange()
      }
    }

    // 定期的にカメラ変更をチェック（低頻度）
    const interval = setInterval(checkCameraChange, 2000) // 2秒に1回

    return () => clearInterval(interval)
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

    // ラベル追加（デバッグログ追加）
  const addLabel = (label: { id: string, text: string, position: [number, number, number], color: string }) => {
    console.log(`Adding label to context:`, label)
    setLabels(prev => {
      const filtered = prev.filter(l => l.id !== label.id)
      const newLabels = [...filtered, label]
      console.log(`Total labels in context:`, newLabels.length)
      return newLabels
    })
  }

  return (
    <LabelContext.Provider value={{ labels, updateLabel, addLabel }}>
      {children}
             {/* HTML ラベルレンダリング */}
               {labels.map((label) => {
          console.log(`Rendering label ${label.id}:`, label.screenPosition)
          
          // 可視性チェックを緩和（デバッグ用）
          if (!label.screenPosition) {
            console.log(`Label ${label.id}: no screenPosition`)
            return null
          }
          
          // 座標が有効な範囲内かチェック
          const isValidPosition = label.screenPosition.x !== undefined && 
                                 label.screenPosition.y !== undefined &&
                                 !isNaN(label.screenPosition.x) && 
                                 !isNaN(label.screenPosition.y)
          
          if (!isValidPosition) {
            console.log(`Label ${label.id}: invalid position`, label.screenPosition)
            return null
          }
          
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
                     textShadow: `
                       0 0 15px ${label.color}30,
                       0 0 30px ${label.color}20,
                       0 0 45px ${label.color}10,
                       1px 1px 2px rgba(0,0,0,0.2),
                       -0.5px -0.5px 0px rgba(0,0,0,0.3),
                       0.5px -0.5px 0px rgba(0,0,0,0.3),
                       -0.5px 0.5px 0px rgba(0,0,0,0.3),
                       0.5px 0.5px 0px rgba(0,0,0,0.3)
                     `,
                     fontFamily: '"Permanent Marker", "Caveat", "Kalam", cursive',
                     letterSpacing: '0.1em',
                     fontSize: '16px',
                     fontWeight: '400',
                     textTransform: 'uppercase',
                     opacity: '0.8',
                     zIndex: '9999',
                     display: 'block',
                     visibility: 'visible'
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
  
  // デバッグ用：ラベルが登録されているか確認
  console.log(`HtmlLabel registered: ${id}`, { text, position, color })
  
  return null
}
