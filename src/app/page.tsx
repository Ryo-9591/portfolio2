'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import LoadingScreen from '@/components/LoadingScreen'

// 3Dコンポーネントを動的インポートしてSSRを無効化
const SpaceScene = dynamic(() => import('@/components/SpaceScene'), {
  ssr: false,
  loading: () => <LoadingScreen />
})

export default function Home() {
  return (
    <main className="relative w-full h-screen">
      {/* 星空の背景 */}
      <div className="star-field">
        {/* CSSアニメーションで星を表示（最軽量） */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* メイン3Dシーン */}
      <Suspense fallback={<LoadingScreen />}>
        <SpaceScene />
      </Suspense>
    </main>
  )
}
