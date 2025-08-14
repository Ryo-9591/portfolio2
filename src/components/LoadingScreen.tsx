'use client'

import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-space-dark flex items-center justify-center z-50">
      <div className="text-center">
        {/* ロケットアイコンのアニメーション */}
        <motion.div
          className="text-6xl mb-8"
          animate={{ 
            y: [-20, 20, -20],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🚀
        </motion.div>

        {/* ローディングテキスト */}
        <motion.h1
          className="text-2xl font-bold glow-text mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          宇宙への旅を準備中...
        </motion.h1>

        {/* プログレスバー */}
        <div className="w-64 h-2 bg-space-blue rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cosmic-plasma to-cosmic-gold"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3, ease: "easeInOut" }}
          />
        </div>

        {/* 星のパーティクル */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
