import { NextResponse } from 'next/server'
import { refreshTikTokCache } from '@/lib/tiktok-client'

export const dynamic   = 'force-dynamic'
export const maxDuration = 30

export async function GET(request: Request) {
  // Accept Vercel cron Authorization header OR manual ?secret= call
  const cronSecret = process.env.CRON_SECRET
  const { searchParams } = new URL(request.url)
  const authHeader = request.headers.get('authorization')

  const ok = !cronSecret
    || authHeader === `Bearer ${cronSecret}`
    || searchParams.get('secret') === cronSecret

  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await refreshTikTokCache()
    console.log(
      `[tiktok-scrape] cached — followers: ${data.profile.followers}, ` +
      `videos: ${data.profile.videoCount}, recent views: ${data.recentViews}`
    )
    return NextResponse.json({
      ok: true,
      followers:   data.profile.followers,
      totalViews:  data.profile.totalViews,
      totalLikes:  data.profile.totalLikes,
      videoCount:  data.profile.videoCount,
      recentViews: data.recentViews,
      cachedAt:    data.cachedAt,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[tiktok-scrape] failed:', msg)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
