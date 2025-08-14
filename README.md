# 🚀 Space Portfolio - 宇宙モチーフポートフォリオサイト

宇宙をテーマにした没入感あふれるインタラクティブポートフォリオサイトです。ユーザーは宇宙空間を操縦するロケットの視点でサイトを探索し、3Dオブジェクトとインタラクションできます。

## ✨ 特徴

- **🌌 没入感のある3D宇宙空間**: React Three Fiberを使用した美しい3Dグラフィックス
- **🚀 インタラクティブな操作**: マウスでカメラを自由に操作
- **🪐 モーダルベースのナビゲーション**: ページ遷移なしのシームレスな体験
- **📱 レスポンシブデザイン**: モバイルデバイスでも快適に動作
- **⚡ 高パフォーマンス**: 最適化されたアニメーションとレンダリング

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **3Dレンダリング**: React Three Fiber + Three.js
- **アニメーション**: GSAP + Framer Motion
- **スタイリング**: Tailwind CSS
- **言語**: TypeScript
- **開発環境**: Docker

## 🚀 クイックスタート

### Dockerを使用した起動（推奨）

```bash
# リポジトリをクローン
git clone <your-repo-url>
cd space-portfolio

# Dockerコンテナを起動
docker-compose up --build
```

### ローカル環境での起動

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

アプリケーションは http://localhost:3000 で利用できます。

## 🎮 使い方

1. **🚀 ロケット（中央）**: クリックしてプロフィール情報を表示
2. **🪐 惑星**: 各惑星をクリックしてポートフォリオ作品を表示
3. **🛰️ 衛星**: クリックして問い合わせフォームを開く
4. **🏗️ 宇宙ステーション**: クリックしてスキルとブログ情報を表示
5. **マウス操作**: ドラッグで視点回転、スクロールでズーム

## 📁 プロジェクト構成

```
space-portfolio/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # グローバルスタイル
│   │   ├── layout.tsx         # ルートレイアウト
│   │   └── page.tsx           # メインページ
│   └── components/
│       ├── 3d/                # 3Dオブジェクト
│       │   ├── Rocket.tsx     # ロケットコンポーネント
│       │   ├── Planet.tsx     # 惑星コンポーネント
│       │   ├── Satellite.tsx  # 衛星コンポーネント
│       │   └── SpaceStation.tsx # 宇宙ステーション
│       ├── modals/            # モーダルコンポーネント
│       │   ├── ProfileModal.tsx
│       │   ├── ProjectModal.tsx
│       │   └── ContactModal.tsx
│       ├── ui/                # UIコンポーネント
│       │   └── HoverInfo.tsx
│       ├── LoadingScreen.tsx  # ローディング画面
│       └── SpaceScene.tsx     # メイン3Dシーン
├── public/                    # 静的ファイル
├── Dockerfile                 # Docker設定
├── docker-compose.yml         # Docker Compose設定
└── tailwind.config.js         # Tailwind CSS設定
```

## 🎨 カスタマイズ

### プロジェクト情報の更新

`src/components/SpaceScene.tsx` の `projects` 配列を編集して、あなたのプロジェクト情報を追加してください。

### プロフィール情報の更新

`src/components/modals/ProfileModal.tsx` を編集して、個人情報やスキルセットを更新してください。

### 色とスタイルの変更

`tailwind.config.js` でカスタムカラーパレットを編集できます：

```javascript
colors: {
  space: {
    dark: '#0a0a0a',
    blue: '#1e3a8a',
    purple: '#6b21a8',
    nebula: '#7c3aed',
  },
  cosmic: {
    gold: '#fbbf24',
    silver: '#e5e7eb',
    plasma: '#06b6d4',
  }
}
```

## 🚀 デプロイ

### Vercelでのデプロイ

```bash
# Vercel CLIをインストール
npm i -g vercel

# デプロイ
vercel
```

### その他のプラットフォーム

本プロジェクトは以下のプラットフォームでもデプロイ可能です：
- Netlify
- AWS Amplify
- Railway
- Heroku

## 📱 モバイル対応

- タッチジェスチャーによる3D操作
- レスポンシブデザイン
- パフォーマンス最適化

## 🔧 開発

### 利用可能なスクリプト

- `npm run dev`: 開発サーバーを起動
- `npm run build`: プロダクションビルドを作成
- `npm run start`: プロダクションサーバーを起動
- `npm run lint`: ESLintを実行

### 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🙏 謝辞

- [Three.js](https://threejs.org/) - 3Dグラフィックスライブラリ
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - React用Three.jsレンダラー
- [Framer Motion](https://www.framer.com/motion/) - アニメーションライブラリ
- [Tailwind CSS](https://tailwindcss.com/) - ユーティリティファーストCSSフレームワーク

---

**🌟 このプロジェクトが気に入ったら、ぜひスターを付けてください！**
