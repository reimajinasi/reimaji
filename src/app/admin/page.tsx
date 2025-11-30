export const dynamic = 'force-dynamic'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'
import { Button } from '@/components/ui/button'
export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin"
        description="Overview area admin"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Admin' },
        ]}
        actions={<Button variant="primary">Buat Konten</Button>}
      />
      <Section>
        <ContentCard title="Ringkasan" description="Kontrol konten dan modul.">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-[var(--radius)] border border-border p-4">
              <div className="text-sm text-muted-foreground">News</div>
              <div className="mt-1 text-xl font-semibold">0</div>
            </div>
            <div className="rounded-[var(--radius)] border border-border p-4">
              <div className="text-sm text-muted-foreground">Research</div>
              <div className="mt-1 text-xl font-semibold">0</div>
            </div>
            <div className="rounded-[var(--radius)] border border-border p-4">
              <div className="text-sm text-muted-foreground">Courses</div>
              <div className="mt-1 text-xl font-semibold">0</div>
            </div>
          </div>
        </ContentCard>
      </Section>
    </div>
  )
}
