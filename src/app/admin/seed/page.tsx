import { PageHeader } from '@/components/layout/page-header'
import { ContentCard } from '@/components/layout/content-card'
import { Section } from '@/components/layout/section'
import { SeedContent } from './seed/run'

export default function SeedPage() {
  return (
    <div className='space-y-6'>
      <PageHeader title='Seed Content' description='Buat konten awal untuk News, Research, dan Course.' breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Seed' }]} />
      <Section>
        <ContentCard title='Jalankan Seed' description='Menambahkan 20+ berita, 15+ riset, dan 1 course dengan 4 modul + 2 lesson'>
          <SeedContent />
        </ContentCard>
      </Section>
    </div>
  )
}
