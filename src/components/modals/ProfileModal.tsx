'use client'

import { motion } from 'framer-motion'
import { X, Github, Linkedin, Mail, ExternalLink } from 'lucide-react'

interface ProfileModalProps {
  onClose: () => void
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const skills = [
    { name: 'JavaScript', level: 90, color: '#f7df1e' },
    { name: 'TypeScript', level: 85, color: '#3178c6' },
    { name: 'React', level: 88, color: '#61dafb' },
    { name: 'Next.js', level: 82, color: '#000000' },
    { name: 'Node.js', level: 80, color: '#339933' },
    { name: 'Python', level: 75, color: '#3776ab' },
    { name: 'Three.js', level: 70, color: '#000000' },
    { name: 'Docker', level: 78, color: '#2496ed' },
  ]

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="space-monitor max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold glow-text text-cosmic-gold mb-2">
              🚀 エンジニアプロフィール
            </h2>
            <p className="text-cosmic-silver">宇宙への情熱を持つフルスタック開発者</p>
          </div>
          <button
            onClick={onClose}
            className="text-cosmic-silver hover:text-white transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 左カラム */}
          <div className="space-y-6">
            {/* プロフィール画像とBasic Info */}
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-cosmic-plasma to-space-purple flex items-center justify-center text-6xl">
                👨‍🚀
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">山田 太郎</h3>
              <p className="text-cosmic-silver mb-4">フルスタック開発者</p>
              
              {/* ソーシャルリンク */}
              <div className="flex justify-center space-x-4">
                <a
                  href="https://github.com"
                  className="p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://linkedin.com"
                  className="p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="mailto:example@email.com"
                  className="p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>

            {/* 経歴 */}
            <div>
              <h4 className="text-lg font-semibold text-cosmic-gold mb-3 flex items-center">
                🌟 経歴
              </h4>
              <div className="space-y-3">
                <div className="border-l-2 border-cosmic-plasma pl-4">
                  <h5 className="font-medium text-white">シニアフロントエンド開発者</h5>
                  <p className="text-sm text-cosmic-silver">テックカンパニー A (2022 - 現在)</p>
                  <p className="text-xs text-cosmic-silver mt-1">
                    React/Next.jsを使用した大規模Webアプリケーションの開発・保守を担当
                  </p>
                </div>
                <div className="border-l-2 border-cosmic-plasma pl-4">
                  <h5 className="font-medium text-white">フルスタック開発者</h5>
                  <p className="text-sm text-cosmic-silver">スタートアップ B (2020 - 2022)</p>
                  <p className="text-xs text-cosmic-silver mt-1">
                    0から1の製品開発、技術選定、アーキテクチャ設計を担当
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 右カラム */}
          <div className="space-y-6">
            {/* スキルセット */}
            <div>
              <h4 className="text-lg font-semibold text-cosmic-gold mb-4 flex items-center">
                ⚡ 技術スキル
              </h4>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">{skill.name}</span>
                      <span className="text-cosmic-silver">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-space-dark bg-opacity-50 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: skill.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 自己紹介 */}
            <div>
              <h4 className="text-lg font-semibold text-cosmic-gold mb-3 flex items-center">
                💫 About Me
              </h4>
              <p className="text-cosmic-silver text-sm leading-relaxed">
                宇宙への憧れを持ちながら、地上でWebの世界を探索している開発者です。
                ユーザー体験を最優先に考え、美しく機能的なアプリケーションの開発を心がけています。
                新しい技術への好奇心が強く、常に学習し続けることを大切にしています。
              </p>
            </div>

            {/* 趣味・興味 */}
            <div>
              <h4 className="text-lg font-semibold text-cosmic-gold mb-3 flex items-center">
                🎯 趣味・興味
              </h4>
              <div className="flex flex-wrap gap-2">
                {['宇宙科学', '3Dグラフィックス', '機械学習', 'ゲーム開発', '天体観測', 'SF小説'].map((hobby) => (
                  <span
                    key={hobby}
                    className="px-3 py-1 bg-white bg-opacity-10 rounded-full text-xs text-cosmic-silver"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 pt-6 border-t border-cosmic-plasma border-opacity-30 text-center">
          <p className="text-cosmic-silver text-sm">
            "コードで宇宙を創造し、ユーザーに新たな体験を届ける" 🌌
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
