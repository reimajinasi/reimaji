import { PageHeader } from '@/components/layout/page-header'
import { ContentCard } from '@/components/layout/content-card'
import { Section } from '@/components/layout/section'
import { WorkflowControls } from './workflow-controls'

export default function WorkflowPage() {
  return (
    <div className='space-y-6'>
      <PageHeader title='Content Workflow' description='Draft → Publish → Unpublish. Review & approval sederhana.' breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Workflow' }]} />
      <Section>
        <ContentCard title='News' description='Kelola status publikasi berita'>
          <WorkflowControls kind='news' />
        </ContentCard>
      </Section>
      <Section>
        <ContentCard title='Research' description='Kelola status publikasi riset'>
          <WorkflowControls kind='research' />
        </ContentCard>
      </Section>
    </div>
  )
}
