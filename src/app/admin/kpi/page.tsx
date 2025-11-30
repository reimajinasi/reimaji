'use client'

import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'
import { useEffect, useState } from 'react'

export default function KPIPage() {
  const getKPIs = useMutation(api.analytics.getKPIs)
  const [data, setData] = useState<{
    totalUsers: number
    newUsersLast30Days: number
    totalCourseCompletions: number
    totalSubscriptions: number
  } | null>(null)

  useEffect(() => {
    getKPIs({}).then(setData)
  }, [getKPIs])

  return (
    <div className='space-y-6'>
      <PageHeader
        title='KPI Dashboard'
        description='Key Performance Indicators untuk Reimaji.'
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'KPI' }]}
      />

      <Section>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <ContentCard title='Total Users' description='Semua pengguna terdaftar'>
            <div className='text-3xl font-bold'>{data ? data.totalUsers : '-'}</div>
          </ContentCard>
          <ContentCard title='New Users (30d)' description='Pengguna baru bulan ini'>
            <div className='text-3xl font-bold'>{data ? data.newUsersLast30Days : '-'}</div>
          </ContentCard>
          <ContentCard title='Course Completions' description='Total kursus diselesaikan'>
            <div className='text-3xl font-bold'>{data ? data.totalCourseCompletions : '-'}</div>
          </ContentCard>
          <ContentCard title='Subscriptions' description='Total langganan aktif'>
            <div className='text-3xl font-bold'>{data ? data.totalSubscriptions : '-'}</div>
          </ContentCard>
        </div>
      </Section>
    </div>
  )
}
