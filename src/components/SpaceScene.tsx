'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { currentPerformance, applyPerformanceSettings } from '../config/performance'
import Universal3DModel, { preloadModel } from './3d/models/Universal3DModel'
import RocketFallback from './3d/models/fallbacks/RocketFallback'
import AstronautFallback from './3d/models/fallbacks/AstronautFallback'
import ProjectFallback from './3d/models/fallbacks/ProjectFallback'
import SatelliteFallback from './3d/models/fallbacks/SatelliteFallback'
import SpaceStationFallback from './3d/models/fallbacks/SpaceStationFallback'
import HtmlLabel, { LabelProvider, LabelUpdater } from './ui/HtmlLabel'
import SpaceEffects from './3d/SpaceEffects'

import ProfileModal from './modals/ProfileModal'
import ProjectModal from './modals/ProjectModal'
import ContactModal from './modals/ContactModal'
import HoverInfo from './ui/HoverInfo'
import { motion, AnimatePresence } from 'framer-motion'

export interface HoverData {
  title: string
  description: string
  position: { x: number; y: number }
}

// モデルをプリロード
preloadModel('/models/rocket.glb')
preloadModel('/models/astronaut.glb')
preloadModel('/models/satellite.glb')
preloadModel('/models/space-station.glb')

export default function SpaceScene() {
  // モーダルの状態管理
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [hoverData, setHoverData] = useState<HoverData | null>(null)

  // サンプルプロジェクトデータ
  const projects = [
    {
      id: 'project1',
      title: 'Eコマースサイト',
      description: 'Next.js + TypeScriptで構築したモダンなECサイト',
      tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      image: '/images/project1.jpg',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com/example/project1'
    },
    {
      id: 'project2', 
      title: 'タスク管理アプリ',
      description: 'React + Node.jsで作成したリアルタイムタスク管理システム',
      tech: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
      image: '/images/project2.jpg',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com/example/project2'
    },
    {
      id: 'project3',
      title: 'AIチャットボット',
      description: 'OpenAI APIを活用したインテリジェントチャットボット',
      tech: ['Python', 'FastAPI', 'OpenAI API', 'React'],
      image: '/images/project3.jpg',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com/example/project3'
    }
  ]

  const closeModal = () => setActiveModal(null)

  // プロジェクト用モデルもプリロード
  projects.forEach(project => {
    preloadModel(`/models/projects/${project.id}.glb`)
  })

  return (
    <LabelProvider>
      {/* 3Dキャンバス（最軽量設定） */}
      <Canvas
        className="w-full h-full"
        gl={{ 
          antialias: false, // アンチエイリアス無効
          alpha: false, // アルファ無効
          powerPreference: "high-performance", // 高パフォーマンスGPU優先
          precision: "lowp", // 低精度計算
          stencil: false // ステンシル無効
        }}
        dpr={1} // デバイスピクセル比を1に固定
        frameloop="demand" // 必要時のみレンダリング
        performance={{ min: 0.05 }} // 最低フレームレートをさらに下げる
        shadows={false} // 影を無効
      >
        {/* カメラ設定 */}
        <PerspectiveCamera makeDefault position={[0, 0, 25]} fov={75} />
        
        {/* コントロール */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.8}
          rotateSpeed={0.4}
          minDistance={15}
          maxDistance={100}
        />

        {/* ライティング - 軽量化 */}
        <ambientLight intensity={0.6} />

                {/* 星空背景 - パフォーマンス最適化 */}
        <Stars 
          radius={400} 
          depth={80} 
          count={currentPerformance.particleCount * 10}
          factor={5} 
          saturation={0.8} 
          fade={true}
        />

        {/* ライティング - 3Dモデル用 */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.0} />
        
        {/* ラベル更新 */}
        <LabelUpdater />
        
        {/* 3Dオブジェクト */}
        <Suspense fallback={null}>
          {/* ロケット（中央） - 新システム */}
          <Universal3DModel
            modelPath="/models/rocket.glb"
            fallbackComponent={RocketFallback}
            position={[0, 0, 0]}
            scale={[2.0, 2.0, 2.0]}
            optimizationLevel="medium"
            enableLOD={true}
            enableStats={true}
            animation={{
              rotation: { axis: 'y', speed: 0.3, amplitude: 0.05 },
              position: { axis: 'y', speed: 2, amplitude: 0.1 }
            }}
            onClick={() => setActiveModal('profile')}
            onPointerOver={(event) => {
              if (event) {
                setHoverData({
                  title: '🚀 プロフィール',
                  description: 'エンジニア情報を表示',
                  position: { x: event.clientX, y: event.clientY }
                })
              }
            }}
            onPointerOut={() => setHoverData(null)}
          />


          {/* 宇宙飛行士（ロケットの近く） - 新システム */}
          <Universal3DModel
            modelPath="/models/astronaut.glb"
            fallbackComponent={AstronautFallback}
            position={[2.5, 1, 1]}
            scale={[2.5, 2.5, 2.5]}
            optimizationLevel="medium"
            enableLOD={true}
            enableStats={true}
            animation={{
              position: { axis: 'y', speed: 1.5, amplitude: 0.1 }
            }}
            onClick={() => setActiveModal('about')}
            onPointerOver={(event) => {
              if (event) {
                setHoverData({
                  title: '👨‍🚀 宇宙飛行士',
                  description: '経歴・スキル詳細',
                  position: { x: event.clientX, y: event.clientY }
                })
              }
            }}
            onPointerOut={() => setHoverData(null)}
          />


          {/* 惑星（プロジェクト） - 新システム */}
          {projects.map((project, index) => {
            const angle = (index / projects.length) * Math.PI * 2
            const radius = 20
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius

            return (
              <Universal3DModel
                key={project.id}
                modelPath={`/models/projects/${project.id}.glb`}
                fallbackComponent={ProjectFallback}
                position={[x, Math.sin(angle * 2) * 3, z]}
                scale={[1.0, 1.0, 1.0]}
                optimizationLevel="project"
                enableLOD={true}
                enableStats={false}
                animation={{
                  rotation: { axis: 'y', speed: 0.5, amplitude: 1 },
                  position: { axis: 'y', speed: 2, amplitude: 0.2 }
                }}
                onClick={() => setActiveModal(project.id)}
                onPointerOver={(event) => {
                  if (event) {
                    setHoverData({
                      title: `🪐 ${project.title}`,
                      description: project.description,
                      position: { x: event.clientX, y: event.clientY }
                    })
                  }
                }}
                onPointerOut={() => setHoverData(null)}
              />
            )
          })}

                    {/* 衛星（問い合わせ） - 高品質 */}
          <Universal3DModel
            modelPath="/models/satellite.glb"
            fallbackComponent={SatelliteFallback}
            position={[15, 8, 15]}
            scale={[1.2, 1.2, 1.2]}
            optimizationLevel="medium"
            enableLOD={true}
            enableStats={false}
            animation={{
              rotation: { axis: 'y', speed: 0.8, amplitude: 1 }
            }}
            onClick={() => setActiveModal('contact')}
            onPointerOver={(event) => {
              if (event) {
                setHoverData({
                  title: '🛰️ お問い合わせ',
                  description: 'メッセージを送信',
                  position: { x: event.clientX, y: event.clientY }
                })
              }
            }}
            onPointerOut={() => setHoverData(null)}
          />


                    {/* 宇宙ステーション（スキル/ブログ） - 高品質 */}
          <Universal3DModel
            modelPath="/models/space-station.glb"
            fallbackComponent={SpaceStationFallback}
            position={[-25, 12, -18]}
            scale={[1.5, 1.5, 1.5]}
            optimizationLevel="medium"
            enableLOD={true}
            enableStats={false}
            animation={{
              rotation: { axis: 'y', speed: 0.2, amplitude: 1 }
            }}
            onClick={() => setActiveModal('skills')}
            onPointerOver={(event) => {
              if (event) {
                setHoverData({
                  title: '🏗️ スキル & ブログ',
                  description: '技術スタックと記事',
                  position: { x: event.clientX, y: event.clientY }
                })
              }
            }}
            onPointerOut={() => setHoverData(null)}
          />


          {/* コンテンツがないオブジェクトは一時的に削除 */}
          {/* 
          <Suspense fallback={null}>
            <AsteroidModel
              position={[25, -5, 8]}
              onClick={() => setActiveModal('about')}
              onHover={(isHovering, event) => {
                if (isHovering && event) {
                  setHoverData({
                    title: '☄️ 小惑星',
                    description: '追加情報・経歴',
                    position: { x: event.clientX, y: event.clientY }
                  })
                } else {
                  setHoverData(null)
                }
              }}
            />
          </Suspense>

          <Suspense fallback={null}>
            <GasPlanetModel
              position={[-30, -8, 25]}
              onClick={() => setActiveModal('special')}
              onHover={(isHovering, event) => {
                if (isHovering && event) {
                  setHoverData({
                    title: '🪐 ガス惑星',
                    description: '特別プロジェクト',
                    position: { x: event.clientX, y: event.clientY }
                  })
                } else {
                  setHoverData(null)
                }
              }}
            />
          </Suspense>
          */}

          {/* 隕石群 - 一時的に削除 */}
          {/* <AsteroidField count={20} radius={50} center={[0, 0, 0]} /> */}
          
          {/* 宇宙ゲーム風パーツ - 一時的に削除 */}
          {/*
          <SpaceDebris 
            position={[35, 5, -20]} 
            type="wreckage"
            onHover={(isHovering, event) => {
              if (isHovering && event) {
                setHoverData({
                  title: '🛸 宇宙船の残骸',
                  description: '古い探査船の破片',
                  position: { x: event.clientX, y: event.clientY }
                })
              } else {
                setHoverData(null)
              }
            }}
          />
          
          <SpaceDebris 
            position={[-40, -10, 30]} 
            type="cargo"
            onHover={(isHovering, event) => {
              if (isHovering && event) {
                setHoverData({
                  title: '📦 カーゴコンテナ',
                  description: '放棄された貨物',
                  position: { x: event.clientX, y: event.clientY }
                })
              } else {
                setHoverData(null)
              }
            }}
          />
          
          <SpaceDebris 
            position={[25, -15, -35]} 
            type="probe"
            onHover={(isHovering, event) => {
              if (isHovering && event) {
                setHoverData({
                  title: '🛰️ 探査プローブ',
                  description: '自動探査機',
                  position: { x: event.clientX, y: event.clientY }
                })
              } else {
                setHoverData(null)
              }
            }}
          />
          
          <SpaceDebris 
            position={[-30, 20, -25]} 
            type="beacon"
            onHover={(isHovering, event) => {
              if (isHovering && event) {
                setHoverData({
                  title: '🚨 ナビゲーションビーコン',
                  description: '航行支援装置',
                  position: { x: event.clientX, y: event.clientY }
                })
              } else {
                setHoverData(null)
              }
            }}
          />
          
          <SpaceDebris 
            position={[45, 25, 10]} 
            type="crystal"
            onHover={(isHovering, event) => {
              if (isHovering && event) {
                setHoverData({
                  title: '💎 エネルギークリスタル',
                  description: '謎の結晶体',
                  position: { x: event.clientX, y: event.clientY }
                })
              } else {
                setHoverData(null)
              }
            }}
          />
          */}

          







          {/* 宇宙エフェクト - 背景として残す */}
          <SpaceEffects center={[0, 0, 0]} />
        </Suspense>
      </Canvas>

      {/* HTML ラベル - 軽量 */}
      <HtmlLabel text="ROCKET" position={[0, 7.0, 0]} color="#facc15" />
      <HtmlLabel text="PROFILE" position={[2.5, 6.0, 1]} color="#60a5fa" />
      <HtmlLabel text="CONTACT" position={[15, 11, 15]} color="#22c55e" />
      <HtmlLabel text="STATION" position={[-25, 16, -18]} color="#a855f7" />
      
      {/* プロジェクトラベル */}
      {projects.map((project, index) => {
        const angle = (index / projects.length) * Math.PI * 2
        const radius = 20
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        return (
          <HtmlLabel 
            key={`project-label-${index}`}
            text="PROJECTS" 
            position={[x, Math.sin(angle * 2) * 3 + 5, z]} 
            color="#fbbf24" 
          />
        )
      })}

      {/* ホバー情報 */}
      <AnimatePresence>
        {hoverData && <HoverInfo data={hoverData} />}
      </AnimatePresence>

      {/* モーダル */}
      <AnimatePresence>
        {activeModal === 'profile' && (
          <ProfileModal onClose={closeModal} />
        )}
        {projects.some(p => p.id === activeModal) && (
          <ProjectModal 
            project={projects.find(p => p.id === activeModal)!}
            onClose={closeModal}
          />
        )}
        {activeModal === 'contact' && (
          <ContactModal onClose={closeModal} />
        )}
      </AnimatePresence>
    </LabelProvider>
  )
}
