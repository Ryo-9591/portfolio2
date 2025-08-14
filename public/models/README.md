# 3Dモデルファイル配置場所

このディレクトリに3Dモデルファイル（GLB/GLTF形式）を配置してください。

## 📁 ディレクトリ構造

```
public/models/
├── README.md                 # このファイル
├── rocket.glb               # ロケットモデル（メイン）
├── astronaut.glb            # 宇宙飛行士モデル（プロフィール）
├── satellite.glb            # 衛星モデル（コンタクト）
├── space-station.glb        # 宇宙ステーションモデル（スキル）
└── projects/                # プロジェクト用モデル
    ├── project1.glb         # プロジェクト1のモデル
    ├── project2.glb         # プロジェクト2のモデル
    └── project3.glb         # プロジェクト3のモデル
```

## 🎯 軽量化システム

### 自動最適化レベル
- **low**: 10,000ポリゴン上限、低圧縮
- **medium**: 5,000ポリゴン上限、中圧縮（デフォルト）
- **high**: 2,000ポリゴン上限、高圧縮
- **project**: 3,000ポリゴン上限、高圧縮（プロジェクト用）

### LOD（Level of Detail）
- **高詳細**: 近距離用（0-50m）
- **中詳細**: 中距離用（50-200m）、50%ポリゴン削減
- **低詳細**: 遠距離用（200m以上）、80%ポリゴン削減

### テクスチャ最適化
- 自動リサイズ：1024x1024px以下
- 不要なマップ削除
- MeshBasicMaterial変換（軽量化）

## 📊 パフォーマンス

### 推奨スペック
- **ファイルサイズ**: 2-5MB以下
- **ポリゴン数**: 設定に応じて自動調整
- **テクスチャ**: 1024x1024以下（自動調整）

### モデル統計
- 最適化前後の比較表示
- メモリ使用量計算
- 軽量化率の表示

## 🔄 フォールバック

モデルファイルが存在しない場合、美しい軽量ジオメトリが自動表示されます：
- **ロケット**: 円錐＋円柱の組み合わせ
- **宇宙飛行士**: 球体＋円柱の人型
- **プロジェクト**: 惑星風の球体
- **衛星**: ボックス＋ソーラーパネル
- **宇宙ステーション**: モジュラー構造

## 💡 推奨サイト

### 無料
- [Sketchfab](https://sketchfab.com/) - CC0/無料モデル
- [Poly Haven](https://polyhaven.com/) - CC0ライセンス
- [Free3D](https://free3d.com/) - 無料モデル

### 有料
- [TurboSquid](https://www.turbosquid.com/)
- [CGTrader](https://www.cgtrader.com/)

## 🛠️ 使用例

```tsx
// 新しいUniversal3DModelシステム
<Universal3DModel
  modelPath="/models/rocket.glb"
  fallbackComponent={RocketFallback}
  position={[0, 0, 0]}
  optimizationLevel="medium"
  enableLOD={true}
  enableStats={true}
  animation={{
    rotation: { axis: 'y', speed: 0.5, amplitude: 0.1 }
  }}
/>
```

## 🔧 カスタマイズ

最適化設定は `src/utils/modelOptimization.ts` で調整可能：
- ポリゴン数上限
- テクスチャサイズ上限
- 圧縮レベル
- LOD距離設定
