"use client"
import { useAuth } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'

export default function BadgesPage() {
  const { userId } = useAuth()
  const badges = useQuery(api.achievements.listByUser, userId ? { clerkUserId: userId } : 'skip')

  return (
    <div className='space-y-6'>
      <PageHeader title='Badges' description='Pencapaian yang kamu raih' breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Badges' }]} />
      <Section>
        <ContentCard title='Daftar Badge'>
          {badges && badges.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
              {badges.map(b => (
                <div key={b.key} className='border rounded p-3'>
                  <div className='font-semibold'>{b.title}</div>
                  <div className='text-sm text-muted-foreground'>{b.description}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-sm text-muted-foreground'>Belum ada badge.</div>
          )}
        </ContentCard>
      </Section>
    </div>
  )
}
