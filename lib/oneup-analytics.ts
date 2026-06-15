/**
 * OneUp Analytics client
 *
 * Reads from https://analyze.oneupapp.io/api/{platform}/overview and /posts
 * for the four platforms we publish to: YouTube, Facebook, TikTok, Instagram.
 *
 * Normalizes each platform into a common shape so the dashboard can render
 * uniformly. The headline metric per platform is the most useful one for the
 * dashboard's "Across the Network" cards:
 *   - YouTube  → views
 *   - Facebook → reach (page_impressions)
 *   - TikTok   → views
 *   - Instagram → reach
 *
 * Auth: `apiKey` query param. Same agency key works across all categories.
 *
 * Period selection: pass a `preset` of `last_7_days | last_30_days | last_90_days`.
 *
 * Important quirk: OneUp's analytics needs to be enabled per category by
 * their support. We verified on 2026-06-15 that Legacy Home Team LPT
 * (category 179358) is enabled — all four endpoints return live data.
 */

const ANALYTICS_BASE = 'https://analyze.oneupapp.io/api'

export type AnalyticsPreset = 'last_7_days' | 'last_30_days' | 'last_90_days'

export type PlatformAnalytics = {
  platform: 'youtube' | 'facebook' | 'tiktok' | 'instagram'
  followers: number             // subscribers / fans / followers (current count)
  headlineMetricLabel: string   // "Views" | "Reach"
  headlineCurrent: number
  headlinePrior: number
  headlineChangePct: number     // signed integer percentage, e.g. +244 or -27
  metrics: NormalizedMetric[]   // full list of all metrics returned for the period
  topPost: NormalizedPost | null
  available: boolean            // false when OneUp returns success=false (account not enabled etc)
  error?: string                // populated when available=false
}

export type NormalizedMetric = {
  key: string
  name: string
  current: number
  prior: number
  changePct: number
}

export type NormalizedPost = {
  id: string
  caption: string
  url: string | null
  thumbnailUrl: string | null
  createdAt: string | null
  views: number
  likes: number
  comments: number
  shares: number
}

function getApiKey(): string {
  const k = process.env.ONEUP_API_KEY
  if (!k) throw new Error('ONEUP_API_KEY env var is not set')
  return k
}

// ─── Shared fetch helpers ─────────────────────────────────────────────────────

type RawMetric = {
  key: string
  name: string
  value_current_period: number | string
  value_last_period: number | string
  percentage_change: string
}

type RawOverview = {
  success: boolean
  message?: string
  data?: {
    metrics?: RawMetric[]
    total_subscribers?: number
    total_followers?: number
    follower_count?: number
  }
}

function num(x: unknown): number {
  if (typeof x === 'number') return x
  if (typeof x === 'string') return parseFloat(x.replace(/,/g, '')) || 0
  return 0
}

function parsePct(s: string | number | undefined): number {
  if (typeof s === 'number') return Math.round(s)
  if (typeof s !== 'string') return 0
  const m = s.match(/-?\d+(\.\d+)?/)
  return m ? Math.round(parseFloat(m[0])) : 0
}

function normalizeMetrics(raw: RawMetric[] | undefined): NormalizedMetric[] {
  if (!raw) return []
  return raw.map((m) => ({
    key: m.key,
    name: m.name,
    current: num(m.value_current_period),
    prior: num(m.value_last_period),
    changePct: parsePct(m.percentage_change),
  }))
}

function pickMetric(metrics: NormalizedMetric[], keys: string[]): NormalizedMetric | undefined {
  for (const k of keys) {
    const m = metrics.find((x) => x.key === k)
    if (m) return m
  }
  return undefined
}

async function fetchOverview(
  platform: PlatformAnalytics['platform'],
  socialNetworkId: string,
  preset: AnalyticsPreset,
  extra: Record<string, string> = {},
): Promise<{ ok: true; metrics: NormalizedMetric[]; followers: number } | { ok: false; error: string }> {
  const url = new URL(`${ANALYTICS_BASE}/${platform}/overview`)
  url.searchParams.set('apiKey', getApiKey())
  url.searchParams.set('social_network_id', socialNetworkId)
  url.searchParams.set('preset', preset)
  for (const [k, v] of Object.entries(extra)) url.searchParams.set(k, v)

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 600 } })
    const json = (await res.json()) as RawOverview
    if (!json.success || !json.data) {
      return { ok: false, error: json.message ?? 'OneUp analytics returned no data' }
    }
    const followers =
      json.data.total_subscribers ?? json.data.total_followers ?? json.data.follower_count ?? 0
    return { ok: true, metrics: normalizeMetrics(json.data.metrics), followers }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Network error' }
  }
}

// ─── Top post extraction (per-platform endpoint) ──────────────────────────────

type RawPost = {
  id?: string | number
  caption?: string
  message?: string
  text?: string
  share_url?: string
  permalink_url?: string
  thumbnail_url?: string
  full_picture?: string
  created_time?: string
  create_time?: string
  timestamp?: string
  stats?: Record<string, number | string>
}

async function fetchTopPost(
  platform: PlatformAnalytics['platform'],
  socialNetworkId: string,
  preset: AnalyticsPreset,
  primaryStatKey: string,
  extra: Record<string, string> = {},
): Promise<NormalizedPost | null> {
  const url = new URL(`${ANALYTICS_BASE}/${platform}/posts`)
  url.searchParams.set('apiKey', getApiKey())
  url.searchParams.set('social_network_id', socialNetworkId)
  url.searchParams.set('preset', preset)
  for (const [k, v] of Object.entries(extra)) url.searchParams.set(k, v)

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 600 } })
    const json = await res.json()
    const posts = (json?.data?.posts ?? []) as RawPost[]
    if (posts.length === 0) return null
    // Sort by the primary stat (views, reach, etc) descending — pick winner
    const sorted = [...posts].sort((a, b) => {
      const av = num(a.stats?.[primaryStatKey])
      const bv = num(b.stats?.[primaryStatKey])
      return bv - av
    })
    const p = sorted[0]
    return {
      id: String(p.id ?? ''),
      caption: p.caption ?? p.message ?? p.text ?? '',
      url: p.share_url ?? p.permalink_url ?? null,
      thumbnailUrl: p.thumbnail_url ?? p.full_picture ?? null,
      createdAt: p.created_time ?? p.create_time ?? p.timestamp ?? null,
      views: num(p.stats?.views ?? p.stats?.reach ?? p.stats?.media_views),
      likes: num(p.stats?.likes ?? p.stats?.reactions),
      comments: num(p.stats?.comments),
      shares: num(p.stats?.shares),
    }
  } catch {
    return null
  }
}

// ─── Per-platform wrappers ────────────────────────────────────────────────────

export async function getYouTubeAnalytics(preset: AnalyticsPreset = 'last_30_days'): Promise<PlatformAnalytics> {
  const id = process.env.ONEUP_YOUTUBE_CHANNEL_ID
  if (!id) return failed('youtube', 'ONEUP_YOUTUBE_CHANNEL_ID not set')

  const o = await fetchOverview('youtube', id, preset)
  if (!o.ok) return failed('youtube', o.error)

  const views = pickMetric(o.metrics, ['views'])
  const topPost = await fetchTopPost('youtube', id, preset, 'views')

  return {
    platform: 'youtube',
    followers: o.followers,
    headlineMetricLabel: 'Views',
    headlineCurrent: views?.current ?? 0,
    headlinePrior: views?.prior ?? 0,
    headlineChangePct: views?.changePct ?? 0,
    metrics: o.metrics,
    topPost,
    available: true,
  }
}

export async function getFacebookAnalytics(preset: AnalyticsPreset = 'last_30_days'): Promise<PlatformAnalytics> {
  const id = process.env.ONEUP_FACEBOOK_ACCOUNT_ID
  if (!id) return failed('facebook', 'ONEUP_FACEBOOK_ACCOUNT_ID not set')

  const o = await fetchOverview('facebook', id, preset, { timezone: 'America/Los_Angeles' })
  if (!o.ok) return failed('facebook', o.error)

  // Facebook's overview returns several reach-related metrics; we want the
  // unique-people impressions number ("Impressions" in OneUp's labelling).
  const reach = pickMetric(o.metrics, ['page_media_view', 'page_impressions', 'reach'])
  const topPost = await fetchTopPost('facebook', id, preset, 'reach', { timezone: 'America/Los_Angeles' })

  return {
    platform: 'facebook',
    followers: o.followers,
    headlineMetricLabel: 'Reach',
    headlineCurrent: reach?.current ?? 0,
    headlinePrior: reach?.prior ?? 0,
    headlineChangePct: reach?.changePct ?? 0,
    metrics: o.metrics,
    topPost,
    available: true,
  }
}

export async function getTikTokAnalytics(preset: AnalyticsPreset = 'last_30_days'): Promise<PlatformAnalytics> {
  const id = process.env.ONEUP_TIKTOK_ACCOUNT_ID
  if (!id) return failed('tiktok', 'ONEUP_TIKTOK_ACCOUNT_ID not set')

  const o = await fetchOverview('tiktok', id, preset)
  if (!o.ok) return failed('tiktok', o.error)

  const views = pickMetric(o.metrics, ['views'])
  const topPost = await fetchTopPost('tiktok', id, preset, 'views')

  return {
    platform: 'tiktok',
    followers: o.followers,
    headlineMetricLabel: 'Views',
    headlineCurrent: views?.current ?? 0,
    headlinePrior: views?.prior ?? 0,
    headlineChangePct: views?.changePct ?? 0,
    metrics: o.metrics,
    topPost,
    available: true,
  }
}

export async function getInstagramAnalytics(preset: AnalyticsPreset = 'last_30_days'): Promise<PlatformAnalytics> {
  const id = process.env.ONEUP_INSTAGRAM_ACCOUNT_ID
  if (!id) return failed('instagram', 'ONEUP_INSTAGRAM_ACCOUNT_ID not set')

  const o = await fetchOverview('instagram', id, preset)
  if (!o.ok) return failed('instagram', o.error)

  const reach = pickMetric(o.metrics, ['reach'])
  const topPost = await fetchTopPost('instagram', id, preset, 'reach')

  return {
    platform: 'instagram',
    followers: o.followers,
    headlineMetricLabel: 'Reach',
    headlineCurrent: reach?.current ?? 0,
    headlinePrior: reach?.prior ?? 0,
    headlineChangePct: reach?.changePct ?? 0,
    metrics: o.metrics,
    topPost,
    available: true,
  }
}

// ─── Combined fetcher for the dashboard ───────────────────────────────────────

export type AllPlatformAnalytics = {
  youtube: PlatformAnalytics
  facebook: PlatformAnalytics
  tiktok: PlatformAnalytics
  instagram: PlatformAnalytics
}

export async function getAllPlatformAnalytics(preset: AnalyticsPreset = 'last_30_days'): Promise<AllPlatformAnalytics> {
  const [youtube, facebook, tiktok, instagram] = await Promise.all([
    getYouTubeAnalytics(preset),
    getFacebookAnalytics(preset),
    getTikTokAnalytics(preset),
    getInstagramAnalytics(preset),
  ])
  return { youtube, facebook, tiktok, instagram }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function failed(platform: PlatformAnalytics['platform'], error: string): PlatformAnalytics {
  return {
    platform,
    followers: 0,
    headlineMetricLabel: platform === 'facebook' || platform === 'instagram' ? 'Reach' : 'Views',
    headlineCurrent: 0,
    headlinePrior: 0,
    headlineChangePct: 0,
    metrics: [],
    topPost: null,
    available: false,
    error,
  }
}
