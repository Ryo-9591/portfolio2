/** @type {import('next').NextConfig} */
const nextConfig = {
  // Three.jsの最適化設定
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: 'raw-loader'
    });
    return config;
  },
  // Three.jsのESMサポート
  transpilePackages: ['three']
}

module.exports = nextConfig
