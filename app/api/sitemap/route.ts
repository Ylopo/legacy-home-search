import { getBlogPosts, getMarketReports } from '@/sanity/queries'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://www.legacyhometeamlpt.com'

const STATIC_PAGES = [
  { url: BASE_URL,                       priority: '1.0', changefreq: 'weekly' },
  { url: `${BASE_URL}/blog`,             priority: '0.9', changefreq: 'daily'  },
  { url: `${BASE_URL}/communities`,      priority: '0.8', changefreq: 'monthly' },
  { url: `${BASE_URL}/virginia-beach`,   priority: '0.8', changefreq: 'monthly' },
  { url: `${BASE_URL}/chesapeake`,       priority: '0.8', changefreq: 'monthly' },
  { url: `${BASE_URL}/norfolk`,          priority: '0.8', changefreq: 'monthly' },
  { url: `${BASE_URL}/suffolk`,          priority: '0.8', changefreq: 'monthly' },
  { url: `${BASE_URL}/hampton`,          priority: '0.8', changefreq: 'monthly' },
  { url: `${BASE_URL}/newport-news`,     priority: '0.8', changefreq: 'monthly' },
  { url: `${BASE_URL}/market-reports`,   priority: '0.7', changefreq: 'monthly' },
  { url: `${BASE_URL}/team`,             priority: '0.6', changefreq: 'monthly' },
]

function entry(url: string, lastmod: string, priority: string, changefreq: string) {
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

export async function GET() {
  const today = new Date().toISOString().split('T')[0]

  const [posts, reports] = await Promise.all([
    getBlogPosts(500).catch(() => []),
    getMarketReports(200).catch(() => []),
  ])

  const staticEntries = STATIC_PAGES.map(p =>
    entry(p.url, today, p.priority, p.changefreq)
  )

  const blogEntries = posts.map(post =>
    entry(
      `${BASE_URL}/blog/${post.slug}`,
      post.publishedAt ? post.publishedAt.split('T')[0] : today,
      '0.7',
      'monthly',
    )
  )

  const reportEntries = reports.map(report =>
    entry(
      `${BASE_URL}/market-reports/${report.slug}`,
      report.publishedAt ? report.publishedAt.split('T')[0] : today,
      '0.7',
      'monthly',
    )
  )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticEntries, ...blogEntries, ...reportEntries].join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
