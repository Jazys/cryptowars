/** @type {import('next').NextConfig} */
const nextConfig = {
 output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/spothq/cryptocurrency-icons/**',
      },
    ],
  },
}

module.exports = nextConfig 