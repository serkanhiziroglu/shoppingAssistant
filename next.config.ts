// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['serpapi.com', 'encrypted-tbn0.gstatic.com'],
  },
}

module.exports = nextConfig