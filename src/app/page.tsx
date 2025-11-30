import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className='space-y-6'>
      <PageHeader
        title='Reimaji'
        description='Platform AI Literacy untuk knowledge workers di Indonesia.'
        breadcrumbs={[{ label: 'Home' }]}
        actions={<Button variant='primary'>Mulai</Button>}
      />
      <Section>
        <ContentCard title='Selamat datang' description='Ini adalah halaman beranda tanpa template Next.js.'>
          <p className='text-sm text-muted-foreground'>
            Gunakan navigasi di atas untuk membuka News, Research, Dashboard, LMS, atau Admin.
          </p>
        </ContentCard>
      </Section>
    </div>
  )
}
