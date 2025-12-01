'use client'

import { NewsForm } from '@/components/admin/news/news-form'
import { Separator } from '@/components/ui/separator'
import { useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { useParams } from 'next/navigation'

export default function EditNewsPage() {
  const params = useParams()
  const id = params.id as Id<'news'>
  const news = useQuery(api.news.getById, { id })

  if (news === undefined) {
    return <div className='p-10'>Loading...</div>
  }

  if (news === null) {
    return <div className='p-10'>Article not found</div>
  }

  return (
    <div className='space-y-6 p-10 pb-16'>
      <div className='space-y-0.5'>
        <h2 className='text-2xl font-bold tracking-tight'>Edit News Article</h2>
        <p className='text-muted-foreground'>Update existing article content.</p>
      </div>
      <Separator className='my-6' />
      <NewsForm initialData={news} isEdit />
    </div>
  )
}
