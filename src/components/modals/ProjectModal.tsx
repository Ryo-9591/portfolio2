'use client'

import { motion } from 'framer-motion'
import { X, Github, ExternalLink, Calendar, Code, Zap } from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  image: string
  demoUrl: string
  githubUrl: string
}

interface ProjectModalProps {
  project: Project
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const techColors: { [key: string]: string } = {
    'Next.js': '#000000',
    'React': '#61dafb',
    'TypeScript': '#3178c6',
    'JavaScript': '#f7df1e',
    'Tailwind CSS': '#06b6d4',
    'Node.js': '#339933',
    'Python': '#3776ab',
    'FastAPI': '#009688',
    'MongoDB': '#47a248',
    'Socket.io': '#010101',
    'OpenAI API': '#412991',
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
              🪐 {project.title}
            </h2>
            <p className="text-cosmic-silver">{project.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-cosmic-silver hover:text-white transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* プロジェクト画像 */}
        <div className="mb-8">
          <div className="relative w-full h-64 bg-gradient-to-br from-space-blue to-space-purple rounded-lg overflow-hidden">
            {/* プレースホルダー画像の代わりにグラデーションとアイコン */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {project.id === 'project1' ? '🛒' : 
                   project.id === 'project2' ? '📋' : '🤖'}
                </div>
                <p className="text-cosmic-silver text-sm">プロジェクトイメージ</p>
              </div>
            </div>
            
            {/* オーバーレイエフェクト */}
            <div className="absolute inset-0 bg-gradient-to-t from-black from-0% via-transparent to-transparent opacity-60" />
            
            {/* アクションボタン */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 px-3 py-2 bg-cosmic-plasma bg-opacity-80 hover:bg-opacity-100 rounded-lg transition-colors text-white text-sm"
              >
                <ExternalLink size={16} />
                <span>デモ</span>
              </a>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors text-white text-sm"
              >
                <Github size={16} />
                <span>コード</span>
              </a>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 左カラム - 詳細情報 */}
          <div className="space-y-6">
            {/* 技術スタック */}
            <div>
              <h4 className="text-lg font-semibold text-cosmic-gold mb-4 flex items-center">
                <Code className="mr-2" size={20} />
                使用技術
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: techColors[tech] || '#6366f1',
                      borderColor: techColors[tech] || '#6366f1',
                      color: tech === 'Next.js' || tech === 'Socket.io' ? '#ffffff' : '#000000'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* プロジェクト詳細 */}
            <div>
              <h4 className="text-lg font-semibold text-cosmic-gold mb-3 flex items-center">
                <Zap className="mr-2" size={20} />
                主な機能
              </h4>
              <div className="space-y-2">
                {project.id === 'project1' && (
                  <>
                    <div className="flex items-start space-x-2">
                      <span className="text-cosmic-plasma">•</span>
                      <span className="text-cosmic-silver text-sm">レスポンシブなショッピングカート機能</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-cosmic-plasma">•</span>
                      <span className="text-cosmic-silver text-sm">Stripe決済システム統合</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-cosmic-plasma">•</span>
                      <span className="text-cosmic-silver text-sm">商品検索・フィルタリング機能</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-cosmic-plasma">•</span>
                      <span className="text-cosmic-silver text-sm">管理者ダッシュボード</span>
                    </div>
                  </>
                )}
                {project.id === 'project2' && (
                  <>
                    <div className="flex items-start space-x-2">
                      <span className="text-cosmic-plasma">•</span>
                      <span className="text-cosmic-silver text-sm">リアルタイムタスク同期</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-cosmic-plasma">•</span>
                      <span className="text-cosmic-silver text-sm">チーム協働機能</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-cosmic-plasma">•</span>
                      <span className="text-cosmic-silver text-sm">プロジェクト進捗可視化</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-cosmic-plasma">•</span>
                      <span className="text-cosmic-silver text-sm">通知システム</span>
                    </div>
                  </>
                )}
                {project.id === 'project3' && (
                  <>
                    <div className="flex items-start space-x-2">
                      <span className="text-cosmic-plasma">•</span>
                      <span className="text-cosmic-silver text-sm">自然言語処理による対話</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-cosmic-plasma">•</span>
                      <span className="text-cosmic-silver text-sm">コンテキスト理解機能</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-cosmic-plasma">•</span>
                      <span className="text-cosmic-silver text-sm">多言語サポート</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-cosmic-plasma">•</span>
                      <span className="text-cosmic-silver text-sm">学習履歴管理</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 右カラム - 開発情報 */}
          <div className="space-y-6">
            {/* 開発期間・役割 */}
            <div>
              <h4 className="text-lg font-semibold text-cosmic-gold mb-3 flex items-center">
                <Calendar className="mr-2" size={20} />
                プロジェクト情報
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-cosmic-silver text-sm">開発期間:</span>
                  <span className="text-white text-sm ml-2">
                    {project.id === 'project1' ? '3ヶ月' : 
                     project.id === 'project2' ? '2ヶ月' : '4ヶ月'}
                  </span>
                </div>
                <div>
                  <span className="text-cosmic-silver text-sm">チーム規模:</span>
                  <span className="text-white text-sm ml-2">
                    {project.id === 'project1' ? '4名' : 
                     project.id === 'project2' ? '2名' : '個人開発'}
                  </span>
                </div>
                <div>
                  <span className="text-cosmic-silver text-sm">役割:</span>
                  <span className="text-white text-sm ml-2">
                    {project.id === 'project1' ? 'フロントエンド開発' : 
                     project.id === 'project2' ? 'フルスタック開発' : '全工程担当'}
                  </span>
                </div>
              </div>
            </div>

            {/* 学んだこと・課題 */}
            <div>
              <h4 className="text-lg font-semibold text-cosmic-gold mb-3">
                💡 学んだこと
              </h4>
              <p className="text-cosmic-silver text-sm leading-relaxed">
                {project.id === 'project1' && 
                  'Next.jsのSSRとSSGを活用したパフォーマンス最適化、Stripeを使った安全な決済システムの実装方法を習得しました。また、大規模なECサイトにおけるSEO対策の重要性を実感しました。'}
                {project.id === 'project2' && 
                  'Socket.ioを使ったリアルタイム通信の実装、MongoDBでの効率的なデータ設計、チーム開発におけるGit運用のベストプラクティスを学びました。'}
                {project.id === 'project3' && 
                  'OpenAI APIの効果的な活用方法、プロンプトエンジニアリングの技術、AIサービスにおけるレート制限やコスト管理の重要性を理解しました。'}
              </p>
            </div>

            {/* パフォーマンス指標 */}
            <div>
              <h4 className="text-lg font-semibold text-cosmic-gold mb-3">
                📊 成果
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-5 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-cosmic-plasma">
                    {project.id === 'project1' ? '95%' : 
                     project.id === 'project2' ? '40%' : '90%'}
                  </div>
                  <div className="text-xs text-cosmic-silver">
                    {project.id === 'project1' ? 'Lighthouse スコア' : 
                     project.id === 'project2' ? '作業効率向上' : 'ユーザー満足度'}
                  </div>
                </div>
                <div className="bg-white bg-opacity-5 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-cosmic-gold">
                    {project.id === 'project1' ? '50ms' : 
                     project.id === 'project2' ? '100+' : '24/7'}
                  </div>
                  <div className="text-xs text-cosmic-silver">
                    {project.id === 'project1' ? '平均応答時間' : 
                     project.id === 'project2' ? 'アクティブユーザー' : 'サービス稼働'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 pt-6 border-t border-cosmic-plasma border-opacity-30">
          <div className="flex justify-center space-x-4">
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-6 py-3 bg-cosmic-plasma hover:bg-opacity-80 rounded-lg transition-colors text-white font-medium"
            >
              <ExternalLink size={20} />
              <span>ライブデモを見る</span>
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-6 py-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-colors text-white font-medium"
            >
              <Github size={20} />
              <span>ソースコードを見る</span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
