"use client"
import { useAuth } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'

export default function AnalyticsPage() {
  const { userId } = useAuth()
  const newsStats = useQuery(api.news.stats, { clerkUserId: userId ?? '', limitTop: 5 })
  const researchStats = useQuery(api.research.stats, { clerkUserId: userId ?? '', limitTop: 5 })
  const roleStats = useQuery(api.users.roleStats, { clerkUserId: userId ?? '' })

  return (
    <div className='space-y-6'>
      <PageHeader title='Content Analytics' description='Ringkasan konten: published vs draft, tag teratas, dan view tertinggi.' breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Analytics' }]} />

      <Section>
        <ContentCard title='News' description='Status dan insights'>
          {newsStats ? (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='p-3 border rounded'>Published: {newsStats.totalPublished}</div>
              <div className='p-3 border rounded'>Draft: {newsStats.totalDraft}</div>
              <div className='p-3 border rounded'>Top Tags: {newsStats.topTags.map(t => `${t.tag}(${t.count})`).join(', ')}</div>
            </div>
          ) : (
            <div className='text-sm text-muted-foreground'>Memuat…</div>
          )}
        </ContentCard>
      </Section>

      <Section>
        <ContentCard title='Research' description='Status dan insights'>
          {researchStats ? (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='p-3 border rounded'>Published: {researchStats.totalPublished}</div>
              <div className='p-3 border rounded'>Draft: {researchStats.totalDraft}</div>
              <div className='p-3 border rounded'>Top Tags: {researchStats.topTags.map(t => `${t.tag}(${t.count})`).join(', ')}</div>
            </div>
          ) : (
            <div className='text-sm text-muted-foreground'>Memuat…</div>
          )}
        </ContentCard>
      </Section>

      <Section>
        <ContentCard title='Users' description='Distribusi role'>
          {roleStats ? (
            <div className='grid grid-cols-2 md:grid-cols-5 gap-2'>
              <div className='p-2 border rounded'>Total: {roleStats.total}</div>
              <div className='p-2 border rounded'>Guest: {roleStats.counts.guest}</div>
              <div className='p-2 border rounded'>Free: {roleStats.counts.free}</div>
              <div className='p-2 border rounded'>Pro: {roleStats.counts.pro}</div>
              <div className='p-2 border rounded'>Admin: {roleStats.counts.admin}</div>
            </div>
          ) : (
            <div className='text-sm text-muted-foreground'>Memuat…</div>
          )}
        </ContentCard>
      </Section>
    </div>
  )
}
