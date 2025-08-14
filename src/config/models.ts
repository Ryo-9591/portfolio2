// 3Dモデル設定ファイル
// ここでモデルの有無を管理（ネットワーク通信不要）

export interface ModelConfig {
  name: string
  path: string
  enabled: boolean // trueの場合のみ読み込み
  format?: 'glb' | 'gltf' | 'obj' // モデル形式
  fileSize?: string // 推定ファイルサイズ
  priority?: 'low' | 'medium' | 'high' // 読み込み優先度
}

export const modelConfig: Record<string, ModelConfig> = {
  rocket: {
    name: 'rocket',
    path: '/models/rocket.glb',
    enabled: true, // ← ロケットモデルを読み込み（約478KB）
    format: 'glb',
    fileSize: '~478KB',
    priority: 'high'
  },
  satellite: {
    name: 'satellite', 
    path: '/models/satellite.glb',
    enabled: false, // ← 重いモデルを無効化（約10MB）
    format: 'glb',
    fileSize: '~10MB',
    priority: 'high'
  },
  spaceStation: {
    name: 'space-station',
    path: '/models/space-station.glb', 
    enabled: false, // ← 重いモデルを無効化（約9.6MB）
    format: 'glb',
    fileSize: '~9.6MB',
    priority: 'medium'
  },
  earth: {
    name: 'earth',
    path: '/models/earth.glb',
    enabled: false, // ← 重いモデルを無効化（約4.3MB）
    format: 'glb',
    fileSize: '~4.3MB',
    priority: 'high' // 地球は重要なので優先度を上げる
  },
  mars: {
    name: 'mars', 
    path: '/models/mars.glb',
    enabled: true, // ← 火星モデルを読み込み（約1.3MB）
    format: 'glb',
    fileSize: '~1.3MB',
    priority: 'medium'
  },
  jupiter: {
    name: 'jupiter',
    path: '/models/jupiter.glb',
    enabled: true, // ← 木星モデルを読み込み（約0.69MB）
    format: 'glb',
    fileSize: '~0.69MB',
    priority: 'medium'
  },
  saturn: {
    name: 'saturn',
    path: '/models/saturn.glb',
    enabled: true, // ← 土星モデルを読み込み（約0.7MB）
    format: 'glb',
    fileSize: '~0.7MB',
    priority: 'medium'
  },
  sun: {
    name: 'sun',
    path: '/models/sun.glb',
    enabled: false, // ← 重いモデルを無効化（約2.02MB）
    format: 'glb',
    fileSize: '~2.02MB',
    priority: 'medium'
  },
  moon: {
    name: 'moon',
    path: '/models/moon.glb',
    enabled: false, // ← 重いモデルを無効化（約2.1MB）
    format: 'glb',
    fileSize: '~2.1MB',
    priority: 'medium'
  },
  planet: {
    name: 'planet',
    path: '/models/planet.glb', 
    enabled: false, // ← 重いモデルを無効化（約2.26MB）
    format: 'glb',
    fileSize: '~2.26MB',
    priority: 'medium'
  },
  asteroid: {
    name: 'asteroid',
    path: '/models/asteroid.glb',
    enabled: false, // ← ここをtrueにすると小惑星モデルを読み込み
    format: 'glb',
    fileSize: '~1-4MB',
    priority: 'low'
  },
  gasPlanet: {
    name: 'gas-planet',
    path: '/models/gas-planet.glb',
    enabled: false, // ← ここをtrueにするとガス惑星モデルを読み込み
    format: 'glb',
    fileSize: '~3-8MB',
    priority: 'low'
  },
  astronaut: {
    name: 'astronaut',
    path: '/models/astronaut.glb',
    enabled: false, // ← 重いモデルを無効化（約2.4MB）
    format: 'glb',
    fileSize: '~2.4MB',
    priority: 'high'
  }
}

// 有効なモデルのみを返す関数
export const getEnabledModels = (): ModelConfig[] => {
  return Object.values(modelConfig).filter(model => model.enabled)
}

// 特定のモデルが有効かチェック
export const isModelEnabled = (modelName: string): boolean => {
  return modelConfig[modelName]?.enabled || false
}

// 優先度別にモデルを取得
export const getModelsByPriority = (priority: 'low' | 'medium' | 'high'): ModelConfig[] => {
  return Object.values(modelConfig).filter(model => 
    model.enabled && model.priority === priority
  )
}

// 総ファイルサイズの推定
export const getEstimatedTotalSize = (): string => {
  const enabledModels = getEnabledModels()
  if (enabledModels.length === 0) return '0MB (フォールバックのみ)'
  
  const sizeRanges = enabledModels.map(model => {
    const sizeStr = model.fileSize || '~1-3MB'
    const match = sizeStr.match(/(\d+)-(\d+)MB/)
    if (match) {
      return { min: parseInt(match[1]), max: parseInt(match[2]) }
    }
    return { min: 1, max: 3 }
  })
  
  const totalMin = sizeRanges.reduce((sum, range) => sum + range.min, 0)
  const totalMax = sizeRanges.reduce((sum, range) => sum + range.max, 0)
  
  return `~${totalMin}-${totalMax}MB`
}

// GLB最適化のための推奨設定
export const glbOptimizationTips = {
  compression: 'Draco圧縮を使用してファイルサイズを50-90%削減',
  textures: 'テクスチャは1024x1024以下、WebP形式推奨',
  geometry: 'ポリゴン数は10,000以下を目安に',
  materials: 'PBRマテリアルを使用、不要なマップは削除',
  animations: '必要最小限のキーフレームのみ保持',
  tools: 'gltf-pipeline, gltf-transform等のツールで最適化'
}
