"use client"
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Doc, Id } from '../../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { useAuth } from '@clerk/nextjs'

export function WorkflowControls({ kind }: { kind: 'news' | 'research' }) {
  const { userId } = useAuth()
  const list = useQuery(kind === 'news' ? api.news.listAll : api.research.listAll, { clerkUserId: userId ?? '' })
  const newsUpdate = useMutation(api.news.update)
  const researchUpdate = useMutation(api.research.update)

  if (list === undefined) return <div className='text-sm text-muted-foreground'>Memuat…</div>
  if (!list || list.length === 0) return <div className='text-sm text-muted-foreground'>Tidak ada konten.</div>

  return (
    <div className='space-y-3'>
      {list.map((item: Doc<'news'> | Doc<'research'>) => (
        <div key={item._id} className='flex items-center justify-between border rounded p-2'>
          <div className='text-sm'>
            <div className='font-medium'>{item.title}</div>
            <div className='text-xs text-muted-foreground'>{item.isPublished ? 'Published' : 'Draft'}</div>
          </div>
          <div className='flex gap-2'>
            <Button
              size='sm'
              onClick={() =>
                (kind === 'news'
                  ? newsUpdate({ clerkUserId: userId ?? '', id: item._id as Id<'news'>, isPublished: true })
                  : researchUpdate({ clerkUserId: userId ?? '', id: item._id as Id<'research'>, isPublished: true }))
              }
            >
              Publish
            </Button>
            <Button
              size='sm'
              variant='secondary'
              onClick={() =>
                (kind === 'news'
                  ? newsUpdate({ clerkUserId: userId ?? '', id: item._id as Id<'news'>, isPublished: false })
                  : researchUpdate({ clerkUserId: userId ?? '', id: item._id as Id<'research'>, isPublished: false }))
              }
            >
              Unpublish
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
