export const dynamic = 'force-dynamic'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchQuery } from 'convex/nextjs'
import { api } from '../../../../../convex/_generated/api'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'

export default async function Page({ params }: { params: { slug: string } }) {
  const { userId } = await auth()
  const item = await fetchQuery(api.news.getBySlug, { slug: params.slug })
  if (!item || !item.isPublished || item.deletedAt) redirect('/news')

  let role: 'guest' | 'free' | 'pro' | 'admin' | 'superadmin' = 'guest'
  if (userId) {
    const user = await fetchQuery(api.users.getByClerkId, { clerkUserId: userId })
    role = (user?.role as 'guest' | 'free' | 'pro' | 'admin' | 'superadmin') ?? 'free'
  }

  const canAccess = !item.isPremium || ['pro', 'admin', 'superadmin'].includes(role)

  return (
    <div className="space-y-6">
      <PageHeader
        title={item.title}
        description={item.summary}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'News', href: '/news' }, { label: item.title }]}
      />
      <Section>
        <ContentCard title="Konten" description={canAccess ? 'Konten lengkap' : 'Konten terkunci untuk pengguna Premium'}>
          {canAccess ? (
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: item.content }} />
          ) : (
            <div className="space-y-3">
              <div className="rounded border border-border p-4 text-sm">Konten premium. Silakan upgrade ke Pro untuk akses penuh.</div>
              <div className="text-sm text-muted-foreground">Ringkasan:</div>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: item.summary }} />
            </div>
          )}
        </ContentCard>
      </Section>
    </div>
  )
}
