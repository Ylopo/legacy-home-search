import { NextResponse } from 'next/server'
import { getSocialDashboardPosts } from '@/sanity/queries'
import { fetchSiteGA4Overview, fetchIdxClickData } from '@/lib/ga4'
import { getTikTokOverview } from '@/lib/tiktok-client'
import { getGSCOverview } from '@/lib/gsc-client'
import { getYouTubeOverview } from '@/lib/youtube-client'
import { getFacebookOverview } from '@/lib/facebook-client'

export const dynamic = 'force-dynamic'
export const maxDuration = 45

async function safe<T>(label: string, fn: () => Promise<T>): Promise<{ data: T | null; error: string | null }> {
  try {
    return { data: await fn(), error: null }
  } catch (e: any) {
    console.error(`[analytics/overview] ${label}:`, e?.message ?? e)
    return { data: null, error: e?.message ?? String(e) }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const days = Math.min(90, Math.max(7, parseInt(searchParams.get('days') ?? '28', 10)))

  const [posts, websiteRes, searchRes, youtubeRes, facebookRes, idxRes, tiktokRes] = await Promise.all([
    getSocialDashboardPosts(),
    safe('GA4', () => fetchSiteGA4Overview(days)),
    safe('GSC', () => getGSCOverview(days)),
    safe('YouTube', () => getYouTubeOverview()),
    safe('Facebook', () => getFacebookOverview()),
    safe('IDX', () => fetchIdxClickData(days)),
    safe('TikTok', () => getTikTokOverview().then(d => { if (!d) throw new Error('no data'); return d })),
  ])

  // ── Content stats ────────────────────────────────────────────────────────────
  const now = new Date()
  const thisMonth = (p: { publishedAt: string }) => {
    const d = new Date(p.publishedAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonth = (p: { publishedAt: string }) => {
    const d = new Date(p.publishedAt)
    return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear()
  }

  const postsThisMonth = posts.filter(thisMonth)
  const postsLastMonth = posts.filter(lastMonth)

  // Weekly trend — last 12 weeks
  const weeks = Array.from({ length: 12 }, (_, i) => {
    const weekEnd   = new Date(now.getTime() - i * 7 * 86400 * 1000)
    const weekStart = new Date(weekEnd.getTime() - 7 * 86400 * 1000)
    return {
      label: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: posts.filter(p => {
        const d = new Date(p.publishedAt)
        return d >= weekStart && d < weekEnd
      }).length,
    }
  }).reverse()

  // Category breakdown
  const catMap: Record<string, number> = {}
  for (const p of posts) {
    catMap[p.category ?? 'uncategorized'] = (catMap[p.category ?? 'uncategorized'] ?? 0) + 1
  }
  const categoryBreakdown = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }))

  // Platform coverage
  const coverage = {
    facebook:     posts.filter(p => p.hasFacebook).length,
    facebookReel: posts.filter(p => p.hasFacebookReel).length,
    youtube:      posts.filter(p => p.hasYouTube).length,
    tiktok:       posts.filter(p => p.hasTikTok).length,
    linkedin:     posts.filter(p => p.hasLinkedIn).length,
    twitter:      posts.filter(p => p.hasTwitter).length,
    threads:      posts.filter(p => p.hasThreads).length,
  }

  // ── Estimated combined reach (sum of available sources) ─────────────────────
  // This is a conservative floor — we only add sources we have API access to.
  const ga4Users    = websiteRes.data?.activeUsers ?? 0
  const fbReach     = facebookRes.data?.page?.reach28d ?? 0
  const ytViews     = youtubeRes.data?.recentViews ?? 0
  const estimatedReach = ga4Users + fbReach + ytViews

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    days,
    content: {
      totalPosts:          posts.length,
      postsThisMonth:      postsThisMonth.length,
      postsLastMonth:      postsLastMonth.length,
      videoPostsThisMonth: postsThisMonth.filter(p => p.hasYouTube || p.hasFacebookReel || p.hasTikTok).length,
      weeks,
      coverage,
      categoryBreakdown,
    },
    website:      websiteRes.data,
    websiteError: websiteRes.error,
    search:       searchRes.data,
    searchError:  searchRes.error,
    youtube:      youtubeRes.data,
    youtubeError: youtubeRes.error,
    facebook:     facebookRes.data,
    facebookError: facebookRes.error,
    estimatedReach,
    idx:      idxRes.data,
    idxError: idxRes.error,
    tiktok:      tiktokRes.data,
    tiktokError: tiktokRes.error,
    connected: {
      ga4:      !!process.env.GA4_PROPERTY_ID && !!process.env.GA4_SERVICE_ACCOUNT_JSON,
      gsc:      !!process.env.GSC_REFRESH_TOKEN && !!process.env.GSC_SITE_URL,
      youtube:  !!process.env.YOUTUBE_API_KEY && !!process.env.YOUTUBE_CHANNEL_ID,
      facebook: !!process.env.FACEBOOK_PAGE_ACCESS_TOKEN && !!process.env.FACEBOOK_PAGE_ID,
    },
  })
}
