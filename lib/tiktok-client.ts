/**
 * TikTok profile + video stats client
 *
 * Uses Firecrawl (AI-powered web scraper) to extract stats from the public
 * TikTok profile page. Results are cached in Upstash Redis with a 25-hour TTL
 * so the analytics dashboard never makes a live Firecrawl request at page load.
 *
 * Env vars:
 *   FIRECRAWL_API_KEY          — from app.firecrawl.dev
 *   TIKTOK_USERNAME            — handle without @ (default: "legacy.home.team")
 *   UPSTASH_REDIS_REST_URL
 *   UPSTASH_REDIS_REST_TOKEN
 */

import { Redis } from '@upstash/redis'
import FirecrawlApp from '@mendable/firecrawl-js'

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

type FirecrawlVideo = {
  title?: string
  views?: number
  likes?: number
  comments?: number
  shares?: number
  publishedAt?: string
  videoUrl?: string
}

type FirecrawlTikTokData = {
  username?: string
  displayName?: string
  followers?: number
  following?: number
  totalLikes?: number
  videoCount?: number
  bio?: string
  verified?: boolean
  recentVideos?: FirecrawlVideo[]
}

async function fetchLive(): Promise<TikTokOverview> {
  const apiKey = process.env.FIRECRAWL_API_KEY
  if (!apiKey) throw new Error('FIRECRAWL_API_KEY not set')

  const handle = username()
  const firecrawl = new FirecrawlApp({ apiKey })

  const result = await firecrawl.scrape(`https://www.tiktok.com/@${handle}`, {
    formats: [{
      type: 'json',
      prompt: `Extract TikTok profile statistics for @${handle}. Look for:
- Username and display name
- Follower count (labeled "Followers")
- Following count (labeled "Following")
- Total likes count (labeled "Likes")
- Total video count
- Bio/description text
- Whether the account has a verified checkmark
- All recent videos shown on the page — for each capture: caption/title, view count, like count, comment count, share count, publish date, and video URL`,
      schema: {
        type: 'object',
        properties: {
          username:    { type: 'string' },
          displayName: { type: 'string' },
          followers:   { type: 'number' },
          following:   { type: 'number' },
          totalLikes:  { type: 'number' },
          videoCount:  { type: 'number' },
          bio:         { type: 'string' },
          verified:    { type: 'boolean' },
          recentVideos: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title:       { type: 'string' },
                views:       { type: 'number' },
                likes:       { type: 'number' },
                comments:    { type: 'number' },
                shares:      { type: 'number' },
                publishedAt: { type: 'string' },
                videoUrl:    { type: 'string' },
              },
            },
          },
        },
      },
    }],
  })

  const raw = ((result as { json?: unknown }).json ?? {}) as FirecrawlTikTokData

  const profile: TikTokProfile = {
    username:    raw.username    ?? handle,
    displayName: raw.displayName ?? handle,
    followers:   toInt(raw.followers),
    following:   toInt(raw.following),
    totalLikes:  toInt(raw.totalLikes),
    videoCount:  toInt(raw.videoCount),
    bio:         raw.bio,
    verified:    Boolean(raw.verified),
  }

  const recentVideos: TikTokVideo[] = (raw.recentVideos ?? []).map((v, i) => {
    const idMatch = v.videoUrl?.match(/\/video\/(\d+)/)
    return {
      id:           idMatch?.[1] ?? String(i),
      title:        v.title        ?? '',
      playCount:    toInt(v.views),
      likeCount:    toInt(v.likes),
      commentCount: toInt(v.comments),
      shareCount:   toInt(v.shares),
      publishedAt:  v.publishedAt  ?? new Date().toISOString(),
    }
  })

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
