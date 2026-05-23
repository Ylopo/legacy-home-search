/**
 * TikTok profile + video stats client
 *
 * Uses tikwm.com (public, no API key required). Tries POST first (required
 * from server-side IPs), falls back to GET on 403. Profile and video fetches
 * are independent — if videos fail, profile stats still cache and display.
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
  totalViews: number
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

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  'Accept':     'application/json, text/plain, */*',
  'Referer':    'https://www.tikwm.com/',
  'Origin':     'https://www.tikwm.com',
}

// Try POST (needed for Vercel datacenter IPs), fall back to GET on 403.
async function tikwmFetch(path: string, params: Record<string, string>): Promise<Record<string, unknown> | null> {
  const base = `https://www.tikwm.com/api${path}`

  // Attempt 1: POST with form-encoded body
  try {
    const res = await fetch(base, {
      method:  'POST',
      headers: { ...BROWSER_HEADERS, 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams(params).toString(),
      signal:  AbortSignal.timeout(15_000),
    })
    if (res.ok) {
      const json = await res.json() as Record<string, unknown>
      if (json.code === 0) return json
      console.warn(`[tiktok] tikwm POST ${path} code=${json.code} msg=${json.msg}`)
    } else {
      console.warn(`[tiktok] tikwm POST ${path} HTTP ${res.status} — trying GET`)
    }
  } catch (e) {
    console.warn(`[tiktok] tikwm POST ${path} threw:`, e)
  }

  // Attempt 2: GET with query string
  try {
    const url = new URL(base)
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
    const res = await fetch(url.toString(), {
      headers: BROWSER_HEADERS,
      signal:  AbortSignal.timeout(15_000),
    })
    if (!res.ok) {
      console.warn(`[tiktok] tikwm GET ${path} HTTP ${res.status}`)
      return null
    }
    const json = await res.json() as Record<string, unknown>
    if (json.code !== 0) {
      console.warn(`[tiktok] tikwm GET ${path} code=${json.code}`)
      return null
    }
    return json
  } catch (e) {
    console.warn(`[tiktok] tikwm GET ${path} threw:`, e)
    return null
  }
}

// Scrape TikTok's own profile page and extract the SIGI_STATE embedded JSON
// which contains the video list with play counts. Used as fallback when the
// tikwm /user/posts endpoint is blocked.
async function fetchVideosDirect(handle: string): Promise<TikTokVideo[]> {
  try {
    const res = await fetch(`https://www.tiktok.com/@${handle}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Referer': 'https://www.google.com/',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
      },
      signal: AbortSignal.timeout(20_000),
    })

    if (!res.ok) {
      console.warn(`[tiktok] direct scrape HTTP ${res.status}`)
      return []
    }

    const html = await res.text()

    // TikTok embeds page state in a <script id="SIGI_STATE"> tag
    const sigiMatch = html.match(/<script id="SIGI_STATE"[^>]*>([\s\S]+?)<\/script>/)
    if (sigiMatch) {
      const state = JSON.parse(sigiMatch[1]) as Record<string, unknown>
      // ItemModule is a map of videoId → video data
      const itemModule = (state.ItemModule ?? {}) as Record<string, Record<string, unknown>>
      const items = Object.values(itemModule)
      if (items.length > 0) {
        return items.map(item => {
          const s = (item.stats ?? {}) as Record<string, unknown>
          return {
            id:           String(item.id ?? ''),
            title:        String(item.desc ?? ''),
            playCount:    toInt(s.playCount),
            likeCount:    toInt(s.diggCount),
            commentCount: toInt(s.commentCount),
            shareCount:   toInt(s.shareCount),
            publishedAt:  item.createTime
              ? new Date(toInt(item.createTime) * 1000).toISOString()
              : new Date().toISOString(),
            coverUrl: (item.video as Record<string, unknown>)?.cover as string | undefined,
          }
        }).filter(v => v.id)
      }
    }

    // Older fallback: __NEXT_DATA__
    const nextMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]+?)<\/script>/)
    if (nextMatch) {
      const nextData = JSON.parse(nextMatch[1]) as Record<string, unknown>
      const props = (nextData.props as Record<string, unknown> | undefined)
      const pageProps = (props?.pageProps as Record<string, unknown> | undefined)
      const items = ((pageProps?.itemList ?? pageProps?.items ?? []) as Record<string, unknown>[])
      return items.map((item, i) => {
        const s = (item.stats ?? item.statistics ?? {}) as Record<string, unknown>
        return {
          id:           String(item.id ?? i),
          title:        String(item.desc ?? ''),
          playCount:    toInt(s.playCount),
          likeCount:    toInt(s.diggCount),
          commentCount: toInt(s.commentCount),
          shareCount:   toInt(s.shareCount),
          publishedAt:  item.createTime
            ? new Date(toInt(item.createTime) * 1000).toISOString()
            : new Date().toISOString(),
          coverUrl: (item.video as Record<string, unknown>)?.cover as string | undefined,
        }
      }).filter(v => v.id)
    }

    console.warn('[tiktok] direct scrape: no SIGI_STATE or __NEXT_DATA__ found in page')
    return []
  } catch (e) {
    console.warn('[tiktok] direct scrape threw:', e)
    return []
  }
}

// Try tikwm's URL-based single endpoint — different path, may not be Vercel-blocked
async function fetchVideosViaUrlApi(handle: string): Promise<TikTokVideo[]> {
  try {
    // Some tikwm mirrors expose /api/user/video or /api/user/feed — try them
    for (const path of ['/user/feed', '/user/video']) {
      const json = await tikwmFetch(path, { unique_id: `@${handle}`, count: '20', cursor: '0' })
      const rawVideos = ((json?.data as Record<string, unknown>)?.videos ?? []) as Record<string, unknown>[]
      if (rawVideos.length > 0) {
        console.log(`[tiktok] tikwm ${path} returned ${rawVideos.length} videos`)
        return rawVideos.map(v => ({
          id:           String(v.video_id ?? v.id ?? ''),
          title:        String(v.title ?? v.desc ?? ''),
          playCount:    toInt(v.play        ?? v.playCount),
          likeCount:    toInt(v.digg_count  ?? v.likeCount),
          commentCount: toInt(v.comment_count ?? v.commentCount),
          shareCount:   toInt(v.share_count   ?? v.shareCount),
          publishedAt:  v.create_time
            ? new Date(toInt(v.create_time) * 1000).toISOString()
            : new Date().toISOString(),
          coverUrl: typeof v.cover === 'string' ? v.cover : undefined,
        }))
      }
    }
  } catch (e) {
    console.warn('[tiktok] tikwm alternate video endpoints failed:', e)
  }
  return []
}

async function fetchLive(): Promise<TikTokOverview> {
  const handle = username()

  // Profile fetch is required — throw if it fails
  const profileJson = await tikwmFetch('/user/info', { unique_id: handle })
  if (!profileJson) throw new Error('tikwm profile fetch failed (both POST and GET)')

  const pd    = (profileJson.data ?? {}) as Record<string, unknown>
  const user  = (pd.user  ?? {}) as Record<string, unknown>
  const stats = (pd.stats ?? pd) as Record<string, unknown>

  // Log raw profile data so we can see every available field in Vercel logs
  console.log('[tiktok] raw stats:', JSON.stringify(stats))
  console.log('[tiktok] raw user keys:', Object.keys(user).join(', '))

  const profile: TikTokProfile = {
    username:    String(user.uniqueId    ?? handle),
    displayName: String(user.nickname   ?? handle),
    followers:   toInt(stats.followerCount  ?? pd.fans),
    following:   toInt(stats.followingCount ?? pd.friends),
    totalLikes:  toInt(stats.heartCount ?? stats.heart ?? pd.heart),
    // TikTok includes total profile views as playCount in some API versions
    totalViews:  toInt(stats.playCount ?? stats.play ?? stats.videoPlayCount ?? 0),
    videoCount:  toInt(stats.videoCount ?? stats.video ?? pd.video),
    avatarUrl:   typeof user.avatarLarger === 'string' ? user.avatarLarger : undefined,
    bio:         typeof user.signature   === 'string' ? user.signature    : undefined,
    verified:    Boolean(user.verified),
  }

  // Video fetch — cascade through multiple strategies:
  // 1. tikwm /user/posts (primary, often blocked from Vercel datacenter IPs)
  // 2. tikwm alternate endpoints (/user/feed, /user/video)
  // 3. TikTok direct SIGI_STATE page scrape
  let recentVideos: TikTokVideo[] = []

  // Strategy 1: tikwm /user/posts
  try {
    const videosJson = await tikwmFetch('/user/posts', { unique_id: handle, count: '20', cursor: '0' })
    const rawVideos = ((videosJson?.data as Record<string, unknown>)?.videos ?? []) as Record<string, unknown>[]
    if (rawVideos.length > 0) {
      recentVideos = rawVideos.map(v => ({
        id:           String(v.video_id ?? v.id ?? ''),
        title:        String(v.title ?? v.desc ?? ''),
        playCount:    toInt(v.play        ?? v.playCount),
        likeCount:    toInt(v.digg_count  ?? v.likeCount),
        commentCount: toInt(v.comment_count ?? v.commentCount),
        shareCount:   toInt(v.share_count   ?? v.shareCount),
        publishedAt:  v.create_time
          ? new Date(toInt(v.create_time) * 1000).toISOString()
          : new Date().toISOString(),
        coverUrl: typeof v.cover === 'string' ? v.cover : undefined,
      }))
      console.log(`[tiktok] tikwm /user/posts returned ${recentVideos.length} videos`)
    }
  } catch (e) {
    console.warn('[tiktok] tikwm /user/posts threw:', e)
  }

  // Strategy 2: alternate tikwm paths
  if (recentVideos.length === 0) {
    recentVideos = await fetchVideosViaUrlApi(handle)
  }

  // Strategy 3: scrape TikTok's profile page for SIGI_STATE embedded JSON
  if (recentVideos.length === 0) {
    recentVideos = await fetchVideosDirect(handle)
    if (recentVideos.length > 0) {
      console.log(`[tiktok] direct scrape returned ${recentVideos.length} videos`)
    }
  }

  const recentViews = recentVideos.reduce((s, v) => s + v.playCount, 0)
  const recentLikes = recentVideos.reduce((s, v) => s + v.likeCount, 0)

  // If video scraping returned nothing, fall back to the TIKTOK_TOTAL_VIEWS env var
  // so operators can manually set the correct number from TikTok Creator Studio.
  const manualTotal = toInt(process.env.TIKTOK_TOTAL_VIEWS ?? '0')
  if (recentViews === 0 && manualTotal > 0) {
    console.log(`[tiktok] using manual TIKTOK_TOTAL_VIEWS override: ${manualTotal}`)
    profile.totalViews = manualTotal
  } else if (recentViews > 0) {
    profile.totalViews = recentViews
  }

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
