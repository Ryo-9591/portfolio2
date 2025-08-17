'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useState } from 'react'
import Universal3DModel from './3d/models/Universal3DModel'
import RocketFallback from './3d/models/fallbacks/RocketFallback'
import AstronautFallback from './3d/models/fallbacks/AstronautFallback'
import ProjectFallback from './3d/models/fallbacks/ProjectFallback'
import SatelliteFallback from './3d/models/fallbacks/SatelliteFallback'
import SpaceStationFallback from './3d/models/fallbacks/SpaceStationFallback'
import RotatingTextBelt2D from './3d/RotatingTextBelt2D'
import ProfileModal from './modals/ProfileModal'
import ProjectModal from './modals/ProjectModal'
import ContactModal from './modals/ContactModal'
import HoverInfo from './ui/HoverInfo'
import SpeechBubble from './ui/SpeechBubble'
import { AnimatePresence } from 'framer-motion'

export interface HoverData {
  title: string
  description: string
  position: { x: number; y: number }
}

export default function SpaceScene() {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [hoverData, setHoverData] = useState<HoverData | null>(null)

  const projects = [
    {
      id: 'project1',
      title: 'Eコマースサイト',
      description: 'Next.js + TypeScriptで構築したモダンなECサイト',
      tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      image: '/images/project1.jpg',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com/example/project1',
      planetModel: 'jupiter.glb'
    },
    {
      id: 'project2', 
      title: 'タスク管理アプリ',
      description: 'React + Node.jsで作成したリアルタイムタスク管理システム',
      tech: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
      image: '/images/project2.jpg',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com/example/project2',
      planetModel: 'saturn.glb'
    },
    {
      id: 'project3',
      title: 'AIチャットボット',
      description: 'OpenAI APIを活用したインテリジェントチャットボット',
      tech: ['Python', 'FastAPI', 'OpenAI API', 'React'],
      image: '/images/project3.jpg',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com/example/project3',
      planetModel: 'earth.glb'
    }
  ]

  const closeModal = () => setActiveModal(null)

  return (
    <>
             <Canvas
         className="w-full h-full"
         gl={{ 
           antialias: false,
           alpha: false,
           powerPreference: "high-performance",
           precision: "lowp",
           stencil: false
         }}
         dpr={1}
         frameloop="always"
         performance={{ min: 30 }}
         shadows={false}
       >
        <PerspectiveCamera makeDefault position={[0, 120, 500]} fov={50} />
        
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

        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.0} />
        
                 <Stars 
           radius={200} 
           depth={30} 
           count={1000}
           factor={27} 
           saturation={0.4} 
           fade={true}
         />
        
        <Suspense fallback={null}>
          <Universal3DModel
            modelPath="/models/rocket.glb"
            fallbackComponent={RocketFallback}
            position={[0, 0, 0]}
            scale={[4.5, 4.5, 4.5]}
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

          <RotatingTextBelt2D
            text="ROCKET"
            centerPosition={[0, 30, 0]}
            radius={8}
            height={30}
            rotationSpeed={0.6}
            color="#ea580c"
            fontSize={2.5}
            beltColor="#ea580c"
            beltWidth={3.0}
          />

          <Universal3DModel
            modelPath="/models/astronaut.glb"
            fallbackComponent={AstronautFallback}
            position={[12, 8, 6]}
            scale={[3.5, 3.5, 3.5]}
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

          <RotatingTextBelt2D
            text="PROFILE"
            centerPosition={[12, 18, 6]}
            radius={5}
            height={18}
            rotationSpeed={0.7}
            color="#60a5fa"
            fontSize={2.0}
            beltColor="#60a5fa"
            beltWidth={2.5}
          />

          {projects.map((project, index) => {
            const angle = (index / projects.length) * Math.PI * 2
            const radius = 60
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius

            return (
              <Universal3DModel
                key={project.id}
                modelPath={project.planetModel === 'jupiter.glb' ? '/models/sun.glb' : 
                          project.planetModel === 'earth.glb' ? '/models/moon.glb' : `/models/${project.planetModel}`}
                fallbackComponent={ProjectFallback}
                position={[x, Math.sin(angle * 2) * 3 + 5, z]}
                scale={project.planetModel === 'jupiter.glb' ? [0.3, 0.3, 0.3] : 
                       project.planetModel === 'earth.glb' ? [0.4, 0.4, 0.4] : [7.0, 7.0, 7.0]}
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

          <Universal3DModel
            modelPath="/models/satelite.glb"
            fallbackComponent={SatelliteFallback}
            position={[35, -15, 30]}
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

          <RotatingTextBelt2D
            text="CONTACT"
            centerPosition={[35, -5, 30]}
            radius={12}
            height={-5}
            rotationSpeed={0.9}
            color="#22c55e"
            fontSize={1.5}
            beltColor="#22c55e"
            beltWidth={2.0}
          />

          <Universal3DModel
            modelPath="/models/space-station.glb"
            fallbackComponent={SpaceStationFallback}
            position={[-60, 25, -25]}
            scale={[2.2, 2.2, 2.2]}
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

          {/* Earthモデル - stationの左下に配置 */}
          <Universal3DModel
            modelPath="/models/earth.glb"
            fallbackComponent={ProjectFallback}
            position={[-25, -25, 2]}
            scale={[0.9, 0.9, 0.9]}
            optimizationLevel="project"
            enableLOD={false}
            enableStats={false}
            animation={{
              rotation: { axis: 'y', speed: 0.3, amplitude: 1 }
            }}
            onClick={() => setActiveModal('earth')}
            onPointerOver={(event) => {
              if (event) {
                setHoverData({
                  title: '🌍 地球',
                  description: '私たちの故郷の星',
                  position: { x: event.clientX, y: event.clientY }
                })
              }
            }}
            onPointerOut={() => setHoverData(null)}
          />

          <RotatingTextBelt2D
            text="STATION"
            centerPosition={[-60, 35, -25]}
            radius={10}
            height={35}
            rotationSpeed={0.5}
            color="#a855f7"
            fontSize={2.5}
            beltColor="#a855f7"
            beltWidth={2.5}
          />

          {projects.map((project, index) => {
            const angle = (index / projects.length) * Math.PI * 2
            const radius = 60
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            const y = Math.sin(angle * 2) * 3 + 5
            return (
              <RotatingTextBelt2D
                key={`project-label-${index}`}
                text="PROJECTS"
                centerPosition={[x, y + 12, z]}
                radius={8}
                height={y + 20}
                rotationSpeed={0.4}
                color="#fbbf24"
                fontSize={1.5}
                beltColor="#fbbf24"
                beltWidth={2.0}
              />
            )
          })}
        </Suspense>
      </Canvas>



      <AnimatePresence>
        {hoverData && <HoverInfo data={hoverData} />}
      </AnimatePresence>

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
    </>
  )
}
