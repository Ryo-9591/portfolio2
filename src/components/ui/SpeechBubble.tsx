'use client'

import { motion } from 'framer-motion'

interface SpeechBubbleProps {
  text: string
  position: [number, number]
}

export default function SpeechBubble({ text, position }: SpeechBubbleProps) {
  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      style={{
        left: `${position[0]}px`,
        top: `${position[1]}px`,
        transform: 'translate(-50%, -100%)'
      }}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="relative">
        {/* 吹き出しの本体 */}
        <div className="bg-white text-black px-4 py-2 rounded-2xl shadow-lg border-2 border-gray-300 relative">
          <span className="text-sm font-bold text-gray-800">{text}</span>
          
          {/* 吹き出しの尻尾（下向きの三角形） */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white"></div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-300" style={{ marginTop: '-1px' }}></div>
        </div>
      </div>
    </motion.div>
  )
}
