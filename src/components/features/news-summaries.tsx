"use client"
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookmarkButton } from '@/components/features/bookmark-button'

export function NewsSummaries() {
  const items = useQuery(api.news.list, { limit: 6 })

  if (items === undefined) return <div className='space-y-2'><div className='h-6 bg-muted rounded' /><div className='h-6 bg-muted rounded' /><div className='h-6 bg-muted rounded' /></div>
  if (!items || items.length === 0)
    return (
      <div className='text-sm text-muted-foreground'>Belum ada berita dipublikasikan.</div>
    )

  return (
    <div className='space-y-4'>
      {items.map(item => (
        <Card key={item._id} className='p-4 space-y-2'>
          <div className='font-medium'>{item.title}</div>
          <p className='text-sm text-muted-foreground'>{item.summary}</p>
          <div className='flex gap-2'>
            <Link href={`/news/${item.slug}`}><Button size='sm'>More</Button></Link>
            <BookmarkButton kind='news' entityId={item._id as string} />
          </div>
        </Card>
      ))}
      <div className='pt-2'>
        <Link href='/news'><Button variant='secondary'>Lihat semua berita</Button></Link>
      </div>
    </div>
  )
}
