import { NextResponse } from 'next/server'
import { getSocialDashboardPosts, getQueueCounts } from '@/sanity/queries'
import { getGSCOverview } from '@/lib/gsc-client'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [posts, queue, gsc] = await Promise.all([
    getSocialDashboardPosts(),
    getQueueCounts(),
    getGSCOverview(28),
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
    gsc,
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
      recentCount:      recentPosts.length,
      daysSinceLastPost,
      gscConnected:     !!process.env.GSC_REFRESH_TOKEN && !!process.env.GSC_SITE_URL,
    },
  })
}
