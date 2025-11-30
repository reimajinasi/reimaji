export const dynamic = 'force-dynamic'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'
//
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { fetchQuery } from 'convex/nextjs'
import { api } from '../../../../convex/_generated/api'

export default async function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const q = typeof searchParams.q === 'string' ? searchParams.q : ''
  const tag = typeof searchParams.tag === 'string' ? searchParams.tag : undefined
  const items = await fetchQuery(api.research.list, { q, tag, limit: 50 })
  return (
    <div className="space-y-6">
      <PageHeader
        title="Research"
        description="Ringkasan riset dan rekomendasi praktis."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Research' },
        ]}
        actions={
          <form action="/research" className="flex items-center gap-2">
            <Input name="q" defaultValue={q} placeholder="Cari riset..." className="w-56" />
            <Input name="tag" defaultValue={tag} placeholder="Tag" className="w-40" />
            <Button variant="primary" type="submit">Cari</Button>
          </form>
        }
      />
      <Section>
        <ContentCard title="Riset Terbaru" description="List konten diprioritaskan berdasarkan tanggal publish.">
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-sm text-muted-foreground">Belum ada konten.</div>
            ) : (
              items.map(item => (
                <div key={item._id} className="rounded-[var(--radius)] border border-border p-4">
                  <div className="flex items-center justify-between">
                    <Link href={`/research/${item.slug}`} className="text-base font-semibold hover:underline">
                      {item.title}
                    </Link>
                    {item.isPremium && <span className="text-xs rounded bg-amber-100 px-2 py-1 text-amber-800">Premium</span>}
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">{item.summary}</div>
                </div>
              ))
            )}
          </div>
        </ContentCard>
      </Section>
    </div>
  )
}
