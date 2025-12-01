import { ResearchForm } from '@/components/admin/research/research-form'
import { Separator } from '@/components/ui/separator'

export default function CreateResearchPage() {
  return (
    <div className='space-y-6 p-10 pb-16'>
      <div className='space-y-0.5'>
        <h2 className='text-2xl font-bold tracking-tight'>Create Research Paper</h2>
        <p className='text-muted-foreground'>Add a new research paper to the platform.</p>
      </div>
      <Separator className='my-6' />
      <ResearchForm />
    </div>
  )
}
