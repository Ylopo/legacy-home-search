import type { MetadataRoute } from 'next'
import { getBlogPosts, getMarketReports } from '@/sanity/queries'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://www.legacyhometeamlpt.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, reports] = await Promise.all([
    getBlogPosts(500).catch(() => []),
    getMarketReports(200).catch(() => []),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/blog`,                    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/communities`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/virginia-beach`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/chesapeake`,              lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/norfolk`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/suffolk`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/hampton`,                 lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/newport-news`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/market-reports`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/team`,                    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const reportEntries: MetadataRoute.Sitemap = reports.map((report) => ({
    url: `${BASE_URL}/market-reports/${report.slug}`,
    lastModified: report.publishedAt ? new Date(report.publishedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticPages, ...blogEntries, ...reportEntries]
}
