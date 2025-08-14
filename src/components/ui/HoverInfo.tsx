'use client'

import { motion } from 'framer-motion'
import { HoverData } from '../SpaceScene'

interface HoverInfoProps {
  data: HoverData
}

export default function HoverInfo({ data }: HoverInfoProps) {
  return (
    <motion.div
      className="fixed pointer-events-none z-40 bg-space-blue bg-opacity-90 backdrop-blur-sm border border-cosmic-plasma rounded-lg p-3 max-w-xs"
      style={{
        left: data.position.x + 15,
        top: data.position.y - 10,
      }}
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="text-sm">
        <h3 className="text-cosmic-gold font-semibold mb-1 glow-text">
          {data.title}
        </h3>
        <p className="text-cosmic-silver text-xs leading-relaxed">
          {data.description}
        </p>
      </div>
      
      {/* 装飾的な境界線 */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cosmic-plasma to-cosmic-gold rounded-lg opacity-20 -z-10" />
      
      {/* ポインター */}
      <div className="absolute -left-1 top-4 w-2 h-2 bg-space-blue border-l border-b border-cosmic-plasma transform rotate-45" />
    </motion.div>
  )
}
