export const dynamic = 'force-dynamic'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { fetchQuery, fetchMutation } from 'convex/nextjs'
import { api } from '../../../../convex/_generated/api'
import { PageHeader } from '@/components/layout/page-header'
import { ContentCard } from '@/components/layout/content-card'
import { Section } from '@/components/layout/section'

function computeSummary(content: string) {
  const text = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > 400 ? text.slice(0, 400) + '…' : text
}

export default async function Page() {
  const { userId } = await auth()
  if (!userId) return <div className="p-6 text-sm">Unauthorized</div>
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(userId)
  const items = await fetchQuery(api.news.listAll, { clerkUserId: clerkUser.id })

  async function createNews(formData: FormData) {
    'use server'
    const title = String(formData.get('title') || '')
    const type = String(formData.get('type') || 'tool') as 'tool' | 'use_case' | 'regulation'
    const content = String(formData.get('content') || '')
    const tags = String(formData.get('tags') || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
    const isPremium = formData.get('isPremium') === 'on'
    const isPublished = formData.get('isPublished') === 'on'
    const summaryInput = String(formData.get('summary') || '')
    const summary = summaryInput || computeSummary(content)
    await fetchMutation(api.news.create, {
      clerkUserId: clerkUser.id,
      title,
      summary,
      content,
      type,
      tags,
      isPremium,
      isPublished,
      sourceUrl: undefined,
      imageUrl: undefined,
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader title="News Management" description="Kelola konten berita" breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'News' }]} />
      <Section>
        <ContentCard title="Tambah Berita" description="Buat konten baru">
          <form action={createNews} className="space-y-3">
            <input name="title" placeholder="Judul" className="w-full rounded border p-2" required />
            <select name="type" className="rounded border p-2">
              <option value="tool">Tool</option>
              <option value="use_case">Use Case</option>
              <option value="regulation">Regulation</option>
            </select>
            <input name="tags" placeholder="Tag (pisahkan dengan koma)" className="w-full rounded border p-2" />
            <textarea name="summary" placeholder="Ringkasan (opsional, auto jika kosong)" className="w-full rounded border p-2 h-24" />
            <textarea name="content" placeholder="Konten (HTML diperbolehkan)" className="w-full rounded border p-2 h-40" required />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isPremium" /> Premium</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isPublished" /> Publish sekarang</label>
            <button type="submit" className="rounded bg-primary px-3 py-2 text-primary-foreground">Simpan</button>
          </form>
        </ContentCard>
      </Section>

      <Section>
        <ContentCard title="Daftar Berita" description="Konten yang tersedia">
          <div className="space-y-2">
            {items.map(item => (
              <div key={item._id} className="rounded border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.title}</div>
                    <div className="text-muted-foreground">{item.isPublished ? 'Published' : 'Draft'} • {item.isPremium ? 'Premium' : 'Free'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ContentCard>
      </Section>
    </div>
  )
}
