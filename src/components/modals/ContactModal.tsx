'use client'

import { motion } from 'framer-motion'
import { X, Send, User, Mail, MessageSquare, Rocket } from 'lucide-react'
import { useState } from 'react'

interface ContactModalProps {
  onClose: () => void
}

export default function ContactModal({ onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // シミュレートされた送信プロセス
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)

    // 3秒後にモーダルを閉じる
    setTimeout(() => {
      onClose()
    }, 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="space-monitor max-w-2xl w-full mx-4"
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {!isSubmitted ? (
          <>
            {/* ヘッダー */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold glow-text text-cosmic-gold mb-2">
                  🛰️ 地球への通信
                </h2>
                <p className="text-cosmic-silver">
                  宇宙からのメッセージをお送りください
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-cosmic-silver hover:text-white transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* フォーム */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 名前フィールド */}
              <div>
                <label className="flex items-center text-cosmic-gold font-medium mb-2">
                  <User className="mr-2" size={18} />
                  お名前
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-space-dark bg-opacity-50 border border-cosmic-plasma border-opacity-30 rounded-lg focus:border-cosmic-plasma focus:border-opacity-100 focus:outline-none text-white placeholder-cosmic-silver transition-colors"
                  placeholder="宇宙飛行士の名前を入力してください"
                />
              </div>

              {/* メールフィールド */}
              <div>
                <label className="flex items-center text-cosmic-gold font-medium mb-2">
                  <Mail className="mr-2" size={18} />
                  メールアドレス
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-space-dark bg-opacity-50 border border-cosmic-plasma border-opacity-30 rounded-lg focus:border-cosmic-plasma focus:border-opacity-100 focus:outline-none text-white placeholder-cosmic-silver transition-colors"
                  placeholder="astronaut@space.com"
                />
              </div>

              {/* メッセージフィールド */}
              <div>
                <label className="flex items-center text-cosmic-gold font-medium mb-2">
                  <MessageSquare className="mr-2" size={18} />
                  メッセージ
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-space-dark bg-opacity-50 border border-cosmic-plasma border-opacity-30 rounded-lg focus:border-cosmic-plasma focus:border-opacity-100 focus:outline-none text-white placeholder-cosmic-silver resize-none transition-colors"
                  placeholder="宇宙からの重要なメッセージをお聞かせください..."
                />
              </div>

              {/* 送信ボタン */}
              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-8 py-3 bg-cosmic-plasma hover:bg-opacity-80 disabled:bg-opacity-50 rounded-lg transition-colors text-white font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>送信中...</span>
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      <span>地球に送信</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {/* 装飾的要素 */}
            <div className="mt-8 pt-6 border-t border-cosmic-plasma border-opacity-30">
              <div className="flex items-center justify-center space-x-4 text-cosmic-silver text-sm">
                <span>📡</span>
                <span>通信は暗号化されて安全に送信されます</span>
                <span>🔒</span>
              </div>
            </div>
          </>
        ) : (
          /* 送信完了画面 */
          <div className="text-center py-8">
            <motion.div
              className="text-8xl mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
            >
              🚀
            </motion.div>
            
            <motion.h3
              className="text-2xl font-bold text-cosmic-gold mb-4 glow-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              メッセージが送信されました！
            </motion.h3>
            
            <motion.p
              className="text-cosmic-silver mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              宇宙からのメッセージを受信しました。<br />
              24時間以内に地球からの返信をお送りします。
            </motion.p>

            {/* 光の線アニメーション */}
            <motion.div
              className="relative mx-auto w-64 h-32 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {/* 衛星 */}
              <div className="absolute left-0 top-0 text-2xl">🛰️</div>
              
              {/* 地球 */}
              <div className="absolute right-0 bottom-0 text-2xl">🌍</div>
              
              {/* 光の線 */}
              <motion.div
                className="absolute top-2 left-8 w-0 h-0.5 bg-gradient-to-r from-cosmic-plasma to-cosmic-gold"
                initial={{ width: 0 }}
                animate={{ width: "200px", rotate: -25 }}
                transition={{ duration: 2, delay: 1 }}
              />
              
              {/* パーティクル効果 */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-cosmic-gold rounded-full"
                  style={{
                    left: `${20 + i * 20}px`,
                    top: `${10 + i * 2}px`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 1 + i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>

            <motion.p
              className="text-cosmic-silver text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              このウィンドウは自動的に閉じられます...
            </motion.p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
