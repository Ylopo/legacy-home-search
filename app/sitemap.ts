import type { MetadataRoute } from 'next'
import { getBlogPosts } from '@/sanity/queries'

const BASE = 'https://legacyhometeamlpt.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts(500)

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: post.lastRefreshedAt ?? post.publishedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/communities`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/virginia-beach`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/chesapeake`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/norfolk`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  return [...staticPages, ...postEntries]
}
