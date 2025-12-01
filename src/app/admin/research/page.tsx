import { ResearchTable } from '@/components/admin/research/research-table'
import { Separator } from '@/components/ui/separator'

export default function ResearchAdminPage() {
  return (
    <div className='space-y-6 p-10 pb-16'>
      <div className='space-y-0.5'>
        <h2 className='text-2xl font-bold tracking-tight'>Research Management</h2>
        <p className='text-muted-foreground'>Manage research papers, implications, and analysis.</p>
      </div>
      <Separator className='my-6' />
      <ResearchTable />
    </div>
  )
}
