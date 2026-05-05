import { NextResponse } from 'next/server'
import { getSocialDashboardPosts, getQueueCounts } from '@/sanity/queries'
import { getGSCOverview } from '@/lib/gsc-client'
import { getYouTubeOverview } from '@/lib/youtube-client'
import { getFacebookOverview } from '@/lib/facebook-client'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

// Wraps an async fn so errors don't break the whole route — captures them
// per-platform so the dashboard can show the actual error message in the UI.
async function safe<T>(fn: () => Promise<T>): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await fn()
    return { data, error: null }
  } catch (e: any) {
    const error = e?.message ?? String(e)
    console.error('[social-dashboard]', error)
    return { data: null, error }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [posts, queue, gscRes, youtubeRes, facebookRes] = await Promise.all([
    getSocialDashboardPosts(),
    getQueueCounts(),
    safe(() => getGSCOverview(28)),
    safe(() => getYouTubeOverview()),
    safe(() => getFacebookOverview()),
  ])

  // Weekly posting volume — last 8 weeks
  const now = Date.now()
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date(now - (7 - i) * 7 * 86400 * 1000)
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart.getTime() + 7 * 86400 * 1000)
    return {
      label: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count: posts.filter(p => {
        const d = new Date(p.publishedAt)
        return d >= weekStart && d < weekEnd
      }).length,
    }
  })

  // Pipeline health alerts
  const sevenDaysAgo = new Date(now - 7 * 86400 * 1000).toISOString()
  const recentPosts = posts.filter(p => p.publishedAt > sevenDaysAgo)
  const lastPublished = posts[0]?.publishedAt ?? null
  const daysSinceLastPost = lastPublished
    ? Math.floor((now - new Date(lastPublished).getTime()) / 86400 / 1000)
    : null

  return NextResponse.json({
    posts,
    queue,
    gsc: gscRes.data,
    youtube: youtubeRes.data,
    facebook: facebookRes.data,
    errors: {
      gsc: gscRes.error,
      youtube: youtubeRes.error,
      facebook: facebookRes.error,
    },
    weeks,
    stats: {
      total: posts.length,
      thisMonth: posts.filter(p => {
        const d = new Date(p.publishedAt)
        const now = new Date()
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }).length,
      withFacebook:     posts.filter(p => p.hasFacebook).length,
      withFacebookReel: posts.filter(p => p.hasFacebookReel).length,
      withYouTube:      posts.filter(p => p.hasYouTube).length,
      withTikTok:       posts.filter(p => p.hasTikTok).length,
      withLinkedIn:     posts.filter(p => p.hasLinkedIn).length,
      withTwitter:      posts.filter(p => p.hasTwitter).length,
      recentCount:      recentPosts.length,
      daysSinceLastPost,
      gscConnected:      !!process.env.GSC_REFRESH_TOKEN && !!process.env.GSC_SITE_URL,
      youtubeConnected:  !!process.env.YOUTUBE_API_KEY && !!process.env.YOUTUBE_CHANNEL_ID,
      facebookConnected: !!process.env.FACEBOOK_PAGE_ACCESS_TOKEN && !!process.env.FACEBOOK_PAGE_ID,
    },
  })
}
