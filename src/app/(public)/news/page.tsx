export const dynamic = 'force-dynamic'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'
//
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { fetchQuery } from 'convex/nextjs'
import { api } from '../../../../convex/_generated/api'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const q = typeof params.q === 'string' ? params.q : ''
  const type =
    typeof params.type === 'string'
      ? (params.type as 'tool' | 'use_case' | 'regulation')
      : undefined
  const tag = typeof params.tag === 'string' ? params.tag : undefined

  let items
  if (!q && !type && !tag) {
    const getCachedNews = unstable_cache(
      async () => fetchQuery(api.news.list, { limit: 50 }),
      ['news-list-default'],
      { revalidate: 60, tags: ['news'] }
    )
    items = await getCachedNews()
  } else {
    items = await fetchQuery(api.news.list, { q, type, tag, limit: 50 })
  }
  return (
    <div className='space-y-6'>
      <PageHeader
        title='News'
        description='Daftar berita terbaru dan ringkasan AI.'
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'News' }]}
        actions={
          <form action='/news' className='flex items-center gap-2'>
            <Input name='q' defaultValue={q} placeholder='Cari berita...' className='w-56' />
            <select name='type' defaultValue={type} className='rounded border p-2'>
              <option value=''>Semua tipe</option>
              <option value='tool'>Tool</option>
              <option value='use_case'>Use Case</option>
              <option value='regulation'>Regulation</option>
            </select>
            <Input name='tag' defaultValue={tag} placeholder='Tag' className='w-40' />
            <Button variant='primary' type='submit'>
              Cari
            </Button>
          </form>
        }
      />
      <Section>
        <ContentCard
          title='Berita Terkini'
          description='List konten diprioritaskan berdasarkan tanggal publish.'
        >
          <div className='space-y-4'>
            {items.length === 0 ? (
              <div className='text-sm text-muted-foreground'>Belum ada konten.</div>
            ) : (
              items.map((item) => (
                <div key={item._id} className='rounded-[var(--radius)] border border-border p-4'>
                  <div className='flex items-center justify-between'>
                    <Link
                      href={`/news/${item.slug}`}
                      className='text-base font-semibold hover:underline'
                    >
                      {item.title}
                    </Link>
                    {item.isPremium && (
                      <span className='text-xs rounded bg-amber-100 px-2 py-1 text-amber-800'>
                        Premium
                      </span>
                    )}
                  </div>
                  <div className='mt-2 text-sm text-muted-foreground'>{item.summary}</div>
                </div>
              ))
            )}
          </div>
        </ContentCard>
      </Section>
    </div>
  )
}
