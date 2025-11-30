"use client"
import { useAuth } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Doc, Id } from '../../../../convex/_generated/dataModel'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function BulkOpsPage() {
  const { userId } = useAuth()
  const news = useQuery(api.news.listAll, { clerkUserId: userId ?? '' })
  const research = useQuery(api.research.listAll, { clerkUserId: userId ?? '' })
  const newsUpdate = useMutation(api.news.update)
  const researchUpdate = useMutation(api.research.update)
  const newsRemove = useMutation(api.news.remove)
  const researchRemove = useMutation(api.research.remove)
  const [selectedNews, setSelectedNews] = useState<string[]>([])
  const [selectedResearch, setSelectedResearch] = useState<string[]>([])

  async function bulkPublish(kind: 'news' | 'research', ids: string[]) {
    if (!userId) return
    await Promise.all(
      ids.map(id =>
        kind === 'news'
          ? newsUpdate({ clerkUserId: userId, id: id as Id<'news'>, isPublished: true })
          : researchUpdate({ clerkUserId: userId, id: id as Id<'research'>, isPublished: true })
      )
    )
  }
  async function bulkUnpublish(kind: 'news' | 'research', ids: string[]) {
    if (!userId) return
    await Promise.all(
      ids.map(id =>
        kind === 'news'
          ? newsUpdate({ clerkUserId: userId, id: id as Id<'news'>, isPublished: false })
          : researchUpdate({ clerkUserId: userId, id: id as Id<'research'>, isPublished: false })
      )
    )
  }
  async function bulkRemove(kind: 'news' | 'research', ids: string[]) {
    if (!userId) return
    await Promise.all(
      ids.map(id => (kind === 'news' ? newsRemove({ clerkUserId: userId, id: id as Id<'news'> }) : researchRemove({ clerkUserId: userId, id: id as Id<'research'> })))
    )
  }

  return (
    <div className='space-y-6'>
      <PageHeader title='Bulk Content Operations' description='Publish, unpublish, dan remove secara massal.' breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Bulk Ops' }]} />

      <Section>
        <ContentCard title='News' description='Pilih item untuk operasi massal'>
          {news ? (
            <div className='space-y-2'>
              <div className='flex gap-2'>
                <Button size='sm' onClick={() => bulkPublish('news', selectedNews)}>Publish</Button>
                <Button size='sm' variant='secondary' onClick={() => bulkUnpublish('news', selectedNews)}>Unpublish</Button>
                <Button size='sm' variant='outline' onClick={() => bulkRemove('news', selectedNews)}>Remove</Button>
              </div>
              {news.map((n: Doc<'news'>) => (
                <label key={n._id} className='flex items-center gap-2 border rounded p-2'>
                  <input type='checkbox' checked={selectedNews.includes(n._id)} onChange={e => setSelectedNews(prev => e.target.checked ? [...prev, n._id] : prev.filter(id => id !== n._id))} />
                  <span className='text-sm'>{n.title} — {n.isPublished ? 'Published' : 'Draft'}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className='text-sm text-muted-foreground'>Memuat…</div>
          )}
        </ContentCard>
      </Section>

      <Section>
        <ContentCard title='Research' description='Pilih item untuk operasi massal'>
          {research ? (
            <div className='space-y-2'>
              <div className='flex gap-2'>
                <Button size='sm' onClick={() => bulkPublish('research', selectedResearch)}>Publish</Button>
                <Button size='sm' variant='secondary' onClick={() => bulkUnpublish('research', selectedResearch)}>Unpublish</Button>
                <Button size='sm' variant='outline' onClick={() => bulkRemove('research', selectedResearch)}>Remove</Button>
              </div>
              {research.map((r: Doc<'research'>) => (
                <label key={r._id} className='flex items-center gap-2 border rounded p-2'>
                  <input type='checkbox' checked={selectedResearch.includes(r._id)} onChange={e => setSelectedResearch(prev => e.target.checked ? [...prev, r._id] : prev.filter(id => id !== r._id))} />
                  <span className='text-sm'>{r.title} — {r.isPublished ? 'Published' : 'Draft'}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className='text-sm text-muted-foreground'>Memuat…</div>
          )}
        </ContentCard>
      </Section>
    </div>
  )
}
