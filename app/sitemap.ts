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
    // Core
    { url: BASE, lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE}/communities`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },

    // Community hub pages
    { url: `${BASE}/virginia-beach`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/chesapeake`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/norfolk`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/suffolk`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/hampton`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/newport-news`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },

    // AEO / GEO landing pages — Virginia Beach
    { url: `${BASE}/virginia-beach/best-realtor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/virginia-beach/best-real-estate-agent`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },

    // AEO / GEO landing pages — Chesapeake
    { url: `${BASE}/chesapeake/best-realtor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/chesapeake/best-listing-agent`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },

    // AEO / GEO landing pages — Norfolk
    { url: `${BASE}/norfolk/best-realtor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/norfolk/best-condo-realtor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },

    // AEO / GEO landing pages — Suffolk
    { url: `${BASE}/suffolk/best-realtor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/suffolk/best-realtor-to-sell`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },

    // AEO / GEO landing pages — Hampton
    { url: `${BASE}/hampton/best-realtor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/hampton/best-waterfront-realtor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },

    // AEO / GEO landing pages — Newport News
    { url: `${BASE}/newport-news/best-realtor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/newport-news/best-listing-agent`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },

    // AEO / GEO landing pages — Hampton Roads (regional)
    { url: `${BASE}/hampton-roads/best-realtor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/hampton-roads/best-real-estate-agent`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },

    // Team member profiles
    { url: `${BASE}/team/barry-jenkins`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/team/chris-august`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/team/jon-mironchik`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/team/julz-gat`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/team/matt-moubray`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/team/tanya-thompson`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  return [...staticPages, ...postEntries]
}
