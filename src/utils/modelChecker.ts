/**
 * モデルファイルの存在をチェックする
 */
export async function checkModelExists(modelPath: string): Promise<boolean> {
  try {
    const response = await fetch(modelPath, { method: 'HEAD' })
    return response.ok
  } catch (error) {
    console.warn(`Model file not found: ${modelPath}`)
    return false
  }
}

/**
 * 複数のモデルファイルの存在をチェックする
 */
export async function checkMultipleModels(modelPaths: string[]): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {}
  
  await Promise.all(
    modelPaths.map(async (path) => {
      results[path] = await checkModelExists(path)
    })
  )
  
  return results
}

/**
 * プロジェクトで使用する全モデルのリスト
 */
export const REQUIRED_MODELS = [
  '/models/rocket.glb',
  '/models/astronaut.glb',
  '/models/satellite.glb',
  '/models/space-station.glb'
] as const

/**
 * プロジェクト用モデルのパスを生成
 */
export function getProjectModelPath(projectId: string): string {
  return `/models/projects/${projectId}.glb`
}

/**
 * アプリケーション起動時にモデルの存在をチェック
 */
export async function initializeModelCheck(): Promise<void> {
  console.log('🔍 Checking 3D model availability...')
  
  const modelStatus = await checkMultipleModels(REQUIRED_MODELS)
  
  const availableModels = Object.entries(modelStatus)
    .filter(([_, exists]) => exists)
    .map(([path]) => path)
    
  const missingModels = Object.entries(modelStatus)
    .filter(([_, exists]) => !exists)
    .map(([path]) => path)
  
  if (availableModels.length > 0) {
    console.log('✅ Available 3D models:', availableModels)
  }
  
  if (missingModels.length > 0) {
    console.log('⚠️  Missing 3D models (using fallbacks):', missingModels)
    console.log('💡 Place model files in public/models/ directory to enable 3D models')
  }
  
  console.log(`📊 Model availability: ${availableModels.length}/${REQUIRED_MODELS.length} models found`)
}
