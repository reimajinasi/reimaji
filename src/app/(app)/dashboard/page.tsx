export const dynamic = 'force-dynamic'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'
import { Button } from '@/components/ui/button'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchMutation, fetchQuery } from 'convex/nextjs'
import { api } from '../../../../convex/_generated/api'
import { DashboardTracker } from '@/components/features/dashboard-tracker'

export default async function Page() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  const client = await clerkClient()
  const user = await client.users.getUser(userId)
  await fetchMutation(api.users.upsertFromClerk, {
    clerkUserId: user.id,
    email: user.emailAddresses?.[0]?.emailAddress,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
  })
  const dbUser = await fetchQuery(api.users.getByClerkId, { clerkUserId: user.id })
  return (
    <div className='space-y-6'>
      <DashboardTracker />
      <PageHeader
        title='Dashboard'
        description='Ringkasan akun dan progres'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]}
        actions={<Button variant='primary'>Tambah Aksi</Button>}
      />
      <Section>
        <ContentCard title='Profil' description='Informasi dasar akun'>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='rounded-[var(--radius)] border border-border p-4'>
              <div className='text-sm text-muted-foreground'>Email</div>
              <div className='mt-1 text-sm'>{dbUser?.email ?? '—'}</div>
            </div>
            <div className='rounded-[var(--radius)] border border-border p-4'>
              <div className='text-sm text-muted-foreground'>Role</div>
              <div className='mt-1 text-sm'>{dbUser?.role ?? '—'}</div>
            </div>
          </div>
        </ContentCard>
      </Section>
      <Section>
        <ContentCard title='Statistik Cepat' description='Kartu ringkas untuk progres belajar.'>
          <div className='grid gap-4 md:grid-cols-2'>
            <div className='rounded-[var(--radius)] border border-border p-4'>
              <div className='text-sm text-muted-foreground'>Kursus diikuti</div>
              <div className='mt-1 text-2xl font-semibold'>0</div>
            </div>
            <div className='rounded-[var(--radius)] border border-border p-4'>
              <div className='text-sm text-muted-foreground'>Modul selesai</div>
              <div className='mt-1 text-2xl font-semibold'>0</div>
            </div>
          </div>
        </ContentCard>
      </Section>
    </div>
  )
}
