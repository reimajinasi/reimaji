export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import Script from 'next/script'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { AuthHeader } from '../components/layout/auth-header'
import { MainNav } from '../components/layout/main-nav'
import { Container } from '@/components/layout/container'
import { ConvexClientProvider } from '@/components/providers/convex-client-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Reimaji – AI Literacy Platform',
  description: 'Berita AI, review produk unggulan, dan ringkasan riset terbaru untuk pekerja Indonesia.',
  keywords: ['AI', 'Artificial Intelligence', 'News', 'Research', 'LMS', 'Indonesia'],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Reimaji – AI Literacy Platform',
    description: 'Berita AI, review produk unggulan, dan ringkasan riset terbaru untuk pekerja Indonesia.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'Reimaji',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reimaji – AI Literacy Platform',
    description: 'Berita AI, review produk unggulan, dan ringkasan riset terbaru.',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <head>
          {process.env.NODE_ENV === 'development' && (
            <Script
              src="//unpkg.com/react-grab/dist/index.global.js"
              crossOrigin="anonymous"
              strategy="beforeInteractive"
            />
          )}
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ConvexClientProvider>
            <AuthHeader />
            <Container>
              <MainNav />
            </Container>
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
