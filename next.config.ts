import type { NextConfig } from 'next'
type RP = { protocol?: 'http' | 'https'; hostname: string; port?: string; pathname: string; search?: string }

const extraHosts = (process.env.NEXT_PUBLIC_IMAGE_HOSTS || '')
  .split(',')
  .map(h => h.trim())
  .filter(Boolean)

const remotePatterns: RP[] = [
  { protocol: 'https', hostname: 'img.clerk.com', pathname: '/**' },
  ...extraHosts.map((hostname): RP => ({ protocol: 'https', hostname, pathname: '/**' })),
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
}

export default nextConfig
