"use client"
import { useAuth } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'

export default function EngagementPage() {
  const { userId } = useAuth()
  const roleStats = useQuery(api.users.roleStats, { clerkUserId: userId ?? '' })
  const courseStats = useQuery(api.progress.courseStats, { clerkUserId: userId ?? '' })

  return (
    <div className='space-y-6'>
      <PageHeader title='User Engagement' description='Distribusi role dan interaksi LMS.' breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Engagement' }]} />

      <Section>
        <ContentCard title='Role Distribution' description='Jumlah pengguna per role'>
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

      <Section>
        <ContentCard title='Course Activity' description='Pengguna unik dan jumlah completion per course'>
          {courseStats && courseStats.byCourse.length > 0 ? (
            <div className='space-y-2'>
              {courseStats.byCourse.map((c: { courseId: string; title: string; uniqueUsers: number; completions: number }) => (
                <div key={c.courseId} className='flex justify-between border rounded p-2'>
                  <div className='font-medium'>{c.title}</div>
                  <div className='text-sm'>Users: {c.uniqueUsers} · Completions: {c.completions}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-sm text-muted-foreground'>Belum ada aktivitas.</div>
          )}
        </ContentCard>
      </Section>
    </div>
  )
}
