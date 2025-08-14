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

// モデルプリロードは一時的に無効化（安定性優先）
// preloadModel('/models/rocket.glb')
// preloadModel('/models/astronaut.glb')
// preloadModel('/models/satellite.glb')
// preloadModel('/models/space-station.glb')

export default function SpaceScene() {
  // モーダルの状態管理
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [hoverData, setHoverData] = useState<HoverData | null>(null)

  // サンプルプロジェクトデータ（惑星モデル付き）
  const projects = [
    {
      id: 'project1',
      title: 'Eコマースサイト',
      description: 'Next.js + TypeScriptで構築したモダンなECサイト',
      tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      image: '/images/project1.jpg',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com/example/project1',
      planetModel: 'jupiter.glb' // 木星モデル
    },
    {
      id: 'project2', 
      title: 'タスク管理アプリ',
      description: 'React + Node.jsで作成したリアルタイムタスク管理システム',
      tech: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
      image: '/images/project2.jpg',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com/example/project2',
      planetModel: 'saturn.glb' // 土星モデル
    },
    {
      id: 'project3',
      title: 'AIチャットボット',
      description: 'OpenAI APIを活用したインテリジェントチャットボット',
      tech: ['Python', 'FastAPI', 'OpenAI API', 'React'],
      image: '/images/project3.jpg',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com/example/project3',
             planetModel: 'earth.glb' // 地球モデル（軽量バージョン）
    }
  ]

  const closeModal = () => setActiveModal(null)

  // プロジェクト用惑星モデルプリロードも一時無効化
  // const uniquePlanetModels = [...new Set(projects.map(p => p.planetModel))]
  // uniquePlanetModels.forEach(planetModel => {
  //   preloadModel(`/models/${planetModel}`)
  // })

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
         frameloop="demand" // 必要時のみレンダリング（軽量化）
         performance={{ min: 0.02 }} // 最低フレームレートをさらに下げて軽量化
         shadows={false} // 影を無効
       >
                                                                       {/* カメラ設定 */}
           <PerspectiveCamera makeDefault position={[0, 120, 500]} fov={50} />
        
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

                                  {/* 星空背景 - 超軽量化 */}
          <Stars 
            radius={200} 
            depth={30} 
            count={currentPerformance.particleCount * 2}
            factor={2} 
            saturation={0.4} 
            fade={true}
          />

        {/* ライティング - 3Dモデル用 */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.0} />
        
        {/* ラベル更新 */}
        <LabelUpdater />
        
        {/* 3Dオブジェクト */}
        <Suspense fallback={null}>
                                           {/* ロケット（中央） - 初期ロード時のみアニメーション */}
                                                                                                                                                                                                                                                                                                                                                                                                                               <Universal3DModel
                   modelPath="/models/rocket.glb"
                   fallbackComponent={RocketFallback}
                   position={[0, 0, 0]}
                   scale={[6.0, 6.0, 6.0]}
             optimizationLevel="high"
             enableLOD={true}
             enableStats={false}
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


                                                                                       {/* 宇宙飛行士（ロケットの近く） - 初期ロード時のみアニメーション */}
                             <Universal3DModel
                 modelPath="/models/astronaut.glb"
                 fallbackComponent={AstronautFallback}
                 position={[15, 2, 0]}
                 scale={[5.0, 5.0, 5.0]}
             optimizationLevel="high"
             enableLOD={true}
             enableStats={false}
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


                     {/* 惑星（プロジェクト） - 惑星モデル使用 */}
                                   {projects.map((project, index) => {
               const angle = (index / projects.length) * Math.PI * 2
                                                               const radius = 60 // 美しい円形配置のための適切な半径
               const x = Math.cos(angle) * radius
               const z = Math.sin(angle) * radius

             return (
               <Universal3DModel
                 key={project.id}
                 modelPath={`/models/${project.planetModel}`}
                 fallbackComponent={ProjectFallback}
                 position={[x, Math.sin(angle * 2) * 2, z]}
                                                                       scale={project.planetModel === 'jupiter.glb' ? [1.0, 1.0, 1.0] : 
                          project.planetModel === 'earth.glb' ? [0.8, 0.8, 0.8] : [4.0, 4.0, 4.0]}
                 optimizationLevel="project"
                 enableLOD={false}
                 enableStats={false}
                 animation={{
                   rotation: { axis: 'y', speed: 0.3, amplitude: 1 },
                   position: { axis: 'y', speed: 1.5, amplitude: 0.15 }
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
                  modelPath="/models/satelite.glb"
                  fallbackComponent={SatelliteFallback}
                  position={[25, 8, 20]}
                  scale={[0.1, 0.1, 0.1]}
             optimizationLevel="high"
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


                                                                                                                       {/* 宇宙ステーション（スキル/ブログ） - 軽量化済み */}
                                                                                                                       <Universal3DModel
                   modelPath="/models/space-station.glb"
                   fallbackComponent={SpaceStationFallback}
                   position={[-25, 5, -20]}
                   scale={[1.5, 1.5, 1.5]}
             optimizationLevel="high"
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

          






          







                   {/* 宇宙エフェクト - 軽量化のため一時無効化 */}
         {/* <SpaceEffects center={[0, 0, 0]} /> */}
        </Suspense>
      </Canvas>

                           {/* HTML ラベル - 軽量 */}
        <HtmlLabel text="ROCKET" position={[0, 15.0, 0]} color="#facc15" />
                             <HtmlLabel text="PROFILE" position={[15, 12, 0]} color="#60a5fa" />
                                                           <HtmlLabel text="CONTACT" position={[25, 18, 20]} color="#22c55e" />
                                                          <HtmlLabel text="STATION" position={[-25, 15, -20]} color="#a855f7" />
      
             {/* プロジェクトラベル */}
                                                               {projects.map((project, index) => {
            const angle = (index / projects.length) * Math.PI * 2
                                                   const radius = 60 // 美しい円形配置のための適切な半径
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
                   return (
            <HtmlLabel 
              key={`project-label-${index}`}
              text="PROJECTS" 
              position={[x, Math.sin(angle * 2) * 2 + 8, z]} 
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
