'use client'

import { ResearchForm } from '@/components/admin/research/research-form'
import { Separator } from '@/components/ui/separator'
import { useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { Id } from '../../../../../convex/_generated/dataModel'
import { useParams } from 'next/navigation'

export default function EditResearchPage() {
  const params = useParams()
  const id = params.id as Id<'research'>
  const research = useQuery(api.research.getById, { id })

  if (research === undefined) {
    return <div className='p-10'>Loading...</div>
  }

  if (research === null) {
    return <div className='p-10'>Paper not found</div>
  }

  return (
    <div className='space-y-6 p-10 pb-16'>
      <div className='space-y-0.5'>
        <h2 className='text-2xl font-bold tracking-tight'>Edit Research Paper</h2>
        <p className='text-muted-foreground'>Update existing paper content.</p>
      </div>
      <Separator className='my-6' />
      <ResearchForm initialData={research} isEdit />
    </div>
  )
}
