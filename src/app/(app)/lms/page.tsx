export const dynamic = 'force-dynamic'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'
import Link from 'next/link'
import { fetchQuery } from 'convex/nextjs'
import { api } from '../../../../convex/_generated/api'
export default async function Page() {
  const courses = await fetchQuery(api.courses.list, {})
  return (
    <div className="space-y-6">
      <PageHeader
        title="LMS"
        description="Daftar kursus dan modul"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'LMS' },
        ]}
      />
      <Section>
        <ContentCard title="Katalog Kursus" description="Pilih kursus untuk mulai belajar.">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.length === 0 ? (
              <div className="rounded-[var(--radius)] border border-border p-4">Belum ada kursus.</div>
            ) : (
              courses.map(c => (
                <div key={c._id} className="rounded-[var(--radius)] border border-border p-4">
                  <div className="text-base font-semibold">{c.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{c.description}</div>
                  <Link href={`/lms/${c.slug}`} className="mt-3 inline-block rounded bg-primary px-3 py-1 text-primary-foreground">Lihat Kursus</Link>
                </div>
              ))
            )}
          </div>
        </ContentCard>
      </Section>
    </div>
  )
}
