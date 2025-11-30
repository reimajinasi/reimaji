import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { NewsSummaries } from '@/components/features/news-summaries'
import { ProductReviews } from '@/components/features/product-reviews'
import { ResearchSummaries } from '@/components/features/research-summaries'
import React from 'react'

export default function Home() {
  return (
    <div className='space-y-6'>
      <PageHeader
        title='Reimaji'
        description='Berita AI, review produk unggulan, dan ringkasan riset terbaru — singkat, padat, actionable.'
        breadcrumbs={[{ label: 'Home' }]}
        actions={<Link href='/sign-up'><Button variant='primary'>Daftar</Button></Link>}
      />

      <Section>
        <ContentCard title='Berita Terbaru' description='Inti kabar 1 paragraf ala X, dengan tautan More.'>
          <NewsSummaries />
        </ContentCard>
      </Section>

      <Section>
        <ContentCard title='Review Produk & Unggulan' description='Fungsi, spesialisasi, kekuatan, kelemahan, dan rekomendasi unggulan.'>
          <ProductReviews />
        </ContentCard>
      </Section>

      <Section>
        <ContentCard title='Riset Terbaru' description='Ringkasan paper 1 paragraf dan prediksi masa depan.'>
          <ResearchSummaries />
        </ContentCard>
      </Section>

      <Section>
        <ContentCard title='Belajar dengan LMS' description='Kursus terstruktur untuk literasi AI. Lanjut ke halaman khusus.'>
          <Link href='/lms'><Button variant='secondary'>Lihat Kursus</Button></Link>
        </ContentCard>
      </Section>

      <script
        type='application/ld+json'
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Reimaji',
            url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          }),
        }}
      />
    </div>
  )
}
