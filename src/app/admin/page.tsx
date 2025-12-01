'use client'

import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'
import { Button } from '@/components/ui/button'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { ArrowRight, Newspaper, FileText } from 'lucide-react'

export default function AdminPage() {
  const { user } = useUser()
  // Assuming stats queries exist or falling back to list length
  const news = useQuery(api.news.listAll, { clerkUserId: user?.id ?? '' })
  const research = useQuery(api.research.listAll, { clerkUserId: user?.id ?? '' })

  const newsCount = news?.length ?? 0
  const researchCount = research?.length ?? 0

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Admin Dashboard'
        description='Overview of content and platform statistics.'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Admin' }]}
      />

      <Section>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <ContentCard title='News Articles' description='Total published and draft articles.'>
            <div className='flex flex-col gap-4'>
              <div className='text-3xl font-bold'>{newsCount}</div>
              <Link href='/admin/news'>
                <Button variant='outline' className='w-full'>
                  Manage News <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </Link>
            </div>
          </ContentCard>

          <ContentCard title='Research Papers' description='Total research papers and insights.'>
            <div className='flex flex-col gap-4'>
              <div className='text-3xl font-bold'>{researchCount}</div>
              <Link href='/admin/research'>
                <Button variant='outline' className='w-full'>
                  Manage Research <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </Link>
            </div>
          </ContentCard>

          <ContentCard title='Quick Actions' description='Common tasks.'>
            <div className='flex flex-col gap-2'>
              <Link href='/admin/news/create'>
                <Button className='w-full justify-start' variant='ghost'>
                  <Newspaper className='mr-2 h-4 w-4' /> Create Article
                </Button>
              </Link>
              <Link href='/admin/research/create'>
                <Button className='w-full justify-start' variant='ghost'>
                  <FileText className='mr-2 h-4 w-4' /> Add Research Paper
                </Button>
              </Link>
            </div>
          </ContentCard>
        </div>
      </Section>
    </div>
  )
}
