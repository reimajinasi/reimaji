import { NewsForm } from '@/components/admin/news/news-form'
import { Separator } from '@/components/ui/separator'

export default function CreateNewsPage() {
  return (
    <div className='space-y-6 p-10 pb-16'>
      <div className='space-y-0.5'>
        <h2 className='text-2xl font-bold tracking-tight'>Create News Article</h2>
        <p className='text-muted-foreground'>Add a new article to the platform.</p>
      </div>
      <Separator className='my-6' />
      <NewsForm />
    </div>
  )
}
