/**
 * TikTok profile + video stats client
 *
 * Uses tikwm.com (public, no API key required) to fetch stats for public TikTok
 * profiles via POST requests, which are required from server-side IPs.
 * Results are cached in Upstash Redis with a 25-hour TTL so the analytics
 * dashboard never makes a live request at page-load time.
 *
 * Env vars:
 *   TIKTOK_USERNAME   — handle without @ (default: "legacy.home.team")
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */

import { Redis } from '@upstash/redis'

export type TikTokProfile = {
  username: string
  displayName: string
  followers: number
  following: number
  totalLikes: number
  videoCount: number
  avatarUrl?: string
  bio?: string
  verified: boolean
}

export type TikTokVideo = {
  id: string
  title: string
  playCount: number
  likeCount: number
  commentCount: number
  shareCount: number
  publishedAt: string
  coverUrl?: string
}

export type TikTokOverview = {
  profile: TikTokProfile
  recentVideos: TikTokVideo[]
  recentViews: number
  recentLikes: number
  cachedAt: string
  stale?: boolean
}

const CACHE_KEY = 'tiktok:overview'
const CACHE_TTL = 90_000  // 25 hours in seconds

function getRedis(): Redis {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) throw new Error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN')
  return new Redis({ url, token })
}

function username(): string {
  return (process.env.TIKTOK_USERNAME ?? 'legacy.home.team').replace(/^@/, '')
}

function toInt(v: unknown): number {
  const n = parseInt(String(v ?? 0), 10)
  return isNaN(n) || n < 0 ? 0 : n
}

// tikwm.com requires POST from server-side IPs; GET is rejected from Vercel
// datacenter ranges. Browser-like headers + Referer/Origin are required.
const TIKWM_HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'User-Agent':   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  'Accept':       'application/json',
  'Referer':      'https://www.tikwm.com/',
  'Origin':       'https://www.tikwm.com',
}

async function tikwmPost(path: string, params: Record<string, string>): Promise<Record<string, unknown>> {
  const res = await fetch(`https://www.tikwm.com/api${path}`, {
    method:  'POST',
    headers: TIKWM_HEADERS,
    body:    new URLSearchParams(params).toString(),
    signal:  AbortSignal.timeout(15_000),
  })
  if (!res.ok) throw new Error(`tikwm ${path} HTTP ${res.status}`)
  const json = await res.json() as Record<string, unknown>
  if (json.code !== 0) throw new Error(`tikwm ${path} error: ${json.msg ?? json.code}`)
  return json
}

async function fetchLive(): Promise<TikTokOverview> {
  const handle = username()

  const [profileJson, videosJson] = await Promise.all([
    tikwmPost('/user/info',  { unique_id: handle }),
    tikwmPost('/user/posts', { unique_id: handle, count: '12', cursor: '0' }),
  ])

  // tikwm returns stats at data.stats OR flattened into data — handle both
  const pd    = (profileJson.data ?? {}) as Record<string, unknown>
  const user  = (pd.user  ?? {}) as Record<string, unknown>
  const stats = (pd.stats ?? pd) as Record<string, unknown>

  const profile: TikTokProfile = {
    username:    String(user.uniqueId    ?? handle),
    displayName: String(user.nickname   ?? handle),
    followers:   toInt(stats.followerCount  ?? pd.fans),
    following:   toInt(stats.followingCount ?? pd.friends),
    totalLikes:  toInt(stats.heartCount ?? stats.heart ?? pd.heart),
    videoCount:  toInt(stats.videoCount ?? stats.video ?? pd.video),
    avatarUrl:   typeof user.avatarLarger === 'string' ? user.avatarLarger : undefined,
    bio:         typeof user.signature   === 'string' ? user.signature    : undefined,
    verified:    Boolean(user.verified),
  }

  const rawVideos = ((videosJson.data as Record<string, unknown>)?.videos ?? []) as Record<string, unknown>[]
  const recentVideos: TikTokVideo[] = rawVideos.map(v => ({
    id:           String(v.video_id ?? v.id ?? ''),
    title:        String(v.title ?? v.desc ?? ''),
    playCount:    toInt(v.play    ?? v.playCount),
    likeCount:    toInt(v.digg_count  ?? v.likeCount),
    commentCount: toInt(v.comment_count ?? v.commentCount),
    shareCount:   toInt(v.share_count   ?? v.shareCount),
    publishedAt:  v.create_time
      ? new Date(toInt(v.create_time) * 1000).toISOString()
      : new Date().toISOString(),
    coverUrl: typeof v.cover === 'string' ? v.cover : undefined,
  }))

  const recentViews = recentVideos.reduce((s, v) => s + v.playCount, 0)
  const recentLikes = recentVideos.reduce((s, v) => s + v.likeCount, 0)

  return { profile, recentVideos, recentViews, recentLikes, cachedAt: new Date().toISOString() }
}

// Writes fresh data to Redis. Called by the daily cron.
export async function refreshTikTokCache(): Promise<TikTokOverview> {
  const data = await fetchLive()
  const redis = getRedis()
  await redis.set(CACHE_KEY, JSON.stringify(data), { ex: CACHE_TTL })
  return data
}

// Returns cached data if available, falls back to a live fetch on cache miss.
// On total failure returns null; callers must treat null gracefully.
export async function getTikTokOverview(): Promise<TikTokOverview | null> {
  try {
    const redis = getRedis()
    const cached = await redis.get<string>(CACHE_KEY)
    if (cached) {
      return (typeof cached === 'string' ? JSON.parse(cached) : cached) as TikTokOverview
    }
    return await refreshTikTokCache()
  } catch (cacheErr) {
    console.warn('[tiktok] Redis unavailable, attempting live fetch:', cacheErr)
    try {
      return await fetchLive()
    } catch (fetchErr) {
      console.error('[tiktok] Live fetch failed:', fetchErr)
      return null
    }
  }
}
