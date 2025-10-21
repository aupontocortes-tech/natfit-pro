/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const repoName = 'natfitpro'

const nextConfig = {
  reactStrictMode: true,
  // Exporta site estático para GitHub Pages
  output: 'export',
  images: { unoptimized: true },
  // Usa subcaminho do repositório apenas em produção
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
}

module.exports = nextConfig