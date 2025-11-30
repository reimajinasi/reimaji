import type { MetadataRoute } from 'next'
import { fetchQuery } from 'convex/nextjs'
import { api } from '../../convex/_generated/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/news`, lastModified: new Date() },
    { url: `${base}/research`, lastModified: new Date() },
    { url: `${base}/lms`, lastModified: new Date() },
  ]
  try {
    const news = await fetchQuery(api.news.list, { limit: 100 })
    for (const n of news) urls.push({ url: `${base}/news/${n.slug}`, lastModified: new Date(n.updatedAt || n.publishedAt || Date.now()) })
  } catch {}
  try {
    const research = await fetchQuery(api.research.list, { limit: 100 })
    for (const r of research) urls.push({ url: `${base}/research/${r.slug}`, lastModified: new Date(r.updatedAt || r.publishedAt || Date.now()) })
  } catch {}
  return urls
}
