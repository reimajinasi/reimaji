import { NewsTable } from '@/components/admin/news/news-table'
import { Separator } from '@/components/ui/separator'

export default function NewsAdminPage() {
  return (
    <div className='space-y-6 p-10 pb-16'>
      <div className='space-y-0.5'>
        <h2 className='text-2xl font-bold tracking-tight'>News Management</h2>
        <p className='text-muted-foreground'>
          Manage news articles, tools, use cases, and regulations.
        </p>
      </div>
      <Separator className='my-6' />
      <NewsTable />
    </div>
  )
}
