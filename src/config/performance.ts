// パフォーマンス設定ファイル
// 軽量化とクオリティのバランスを調整

export interface PerformanceConfig {
  // モデル設定
  useExternalModels: boolean // 外部3Dモデルを使用するか
  modelQuality: 'low' | 'medium' | 'high' // モデル品質
  
  // ジオメトリ設定
  geometrySegments: number // ジオメトリの分割数
  particleCount: number // パーティクル数
  
  // レンダリング設定
  shadowsEnabled: boolean // 影の有効/無効
  antialiasing: boolean // アンチエイリアス
  devicePixelRatio: number // ピクセル比率上限
  
  // アニメーション設定
  animationFPS: number // アニメーションFPS上限
  reducedMotion: boolean // モーション軽減
}

// パフォーマンスプリセット
export const performancePresets: Record<string, PerformanceConfig> = {
  // 最軽量（現在の設定）
  minimal: {
    useExternalModels: false,
    modelQuality: 'low',
    geometrySegments: 8,
    particleCount: 50,
    shadowsEnabled: false,
    antialiasing: false,
    devicePixelRatio: 1,
    animationFPS: 30,
    reducedMotion: false
  },
  
  // バランス型（最適化済み）
  balanced: {
    useExternalModels: true, // 外部モデル使用（最適化済み）
    modelQuality: 'medium',
    geometrySegments: 8, // 12→8に削減
    particleCount: 60, // 120→60に削減
    shadowsEnabled: false,
    antialiasing: false,
    devicePixelRatio: 1, // 1.5→1に削減
    animationFPS: 30, // 60→30に削減（バッテリー節約）
    reducedMotion: false
  },
  
  // 高品質（外部モデル使用）
  highQuality: {
    useExternalModels: true,
    modelQuality: 'high',
    geometrySegments: 32,
    particleCount: 500,
    shadowsEnabled: true,
    antialiasing: true,
    devicePixelRatio: 2,
    animationFPS: 60,
    reducedMotion: false
  }
}

// 現在のパフォーマンス設定（最軽量に変更）
export const currentPerformance: PerformanceConfig = performancePresets.minimal

// デバイス性能に基づく自動設定
export const getOptimalPerformance = (): PerformanceConfig => {
  // GPU情報の取得（簡易版）
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
  
  if (!gl) {
    return performancePresets.minimal
  }
  
  const renderer = gl.getParameter(gl.RENDERER) || ''
  const vendor = gl.getParameter(gl.VENDOR) || ''
  
  // 高性能GPU判定（簡易）
  const isHighEndGPU = /nvidia|amd|intel iris|apple/i.test(renderer) && 
                       !/intel.*hd|intel.*uhd/i.test(renderer)
  
  // メモリ情報
  const memory = (navigator as any).deviceMemory || 4
  
  if (isHighEndGPU && memory >= 8) {
    return performancePresets.highQuality
  } else if (memory >= 4) {
    return performancePresets.balanced
  } else {
    return performancePresets.minimal
  }
}

// パフォーマンス設定の適用
export const applyPerformanceSettings = (config: PerformanceConfig) => {
  // Canvas設定の調整
  const canvasSettings = {
    dpr: [1, config.devicePixelRatio],
    antialias: config.antialiasing,
    performance: { min: config.animationFPS / 60 }
  }
  
  return canvasSettings
}
