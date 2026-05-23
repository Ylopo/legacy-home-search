/**
 * Facebook Graph API client (Page-level analytics)
 *
 * Requires env vars:
 *   FACEBOOK_PAGE_ACCESS_TOKEN  — never-expiring Page Access Token
 *   FACEBOOK_PAGE_ID            — e.g. "1101893253009079"
 *
 * Scopes the token must have:
 *   pages_show_list, pages_read_engagement, read_insights
 */

const API_BASE = 'https://graph.facebook.com/v22.0'

export type FBPageStats = {
  pageName: string
  reach28d: number          // unique users who saw any content (28d)
  engagements28d: number    // total post engagements (28d)
  videoViews28d: number     // total video views (28d)
  pageViews28d: number      // logged-out + logged-in page views (28d)
  reactions28d: Record<string, number>  // { like, love, wow, ... }
  fanCount: number          // current page fan/follower count
}

export type FBPost = {
  id: string
  message: string
  createdAt: string
  permalink: string
  type: 'photo' | 'video' | 'link' | 'status' | 'reel' | string
  reach: number             // post_impressions_unique
  clicks: number            // post_clicks
  reactions: number         // total reactions (any type)
  comments: number
  shares: number
  videoViews?: number       // post_video_views (if applicable)
}

export type FacebookOverview = {
  page: FBPageStats
  recentPosts: FBPost[]     // last 25 posts with stats
  topPostsByReach: FBPost[] // top 10 by reach
}

function rawToken() { return process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim() || null }
function pageId()   { return process.env.FACEBOOK_PAGE_ID?.trim() || null }

// If the env var holds a User Token instead of a Page Token, exchange it
// automatically via /me/accounts so the caller doesn't have to know the diff.
let _resolvedToken: string | null = null
async function resolvePageToken(): Promise<string> {
  if (_resolvedToken) return _resolvedToken
  const t = rawToken()
  if (!t) throw new Error('FACEBOOK_PAGE_ACCESS_TOKEN not set')
  const id = pageId()
  if (!id) { _resolvedToken = t; return t }

  // Try /me/accounts — succeeds for User Tokens, 190s for Page Tokens
  try {
    const url = new URL(`${API_BASE}/me/accounts`)
    url.searchParams.set('fields', 'access_token,id')
    url.searchParams.set('access_token', t)
    const res  = await fetch(url.toString())
    const json = await res.json() as { data?: { id: string; access_token: string }[] }
    if (json.data) {
      const page = json.data.find(p => p.id === id)
      if (page?.access_token) {
        _resolvedToken = page.access_token
        return _resolvedToken
      }
    }
  } catch {}

  // Already a Page Token (or /me/accounts failed) — use as-is
  _resolvedToken = t
  return _resolvedToken
}

async function fbFetch(path: string, params: Record<string, string> = {}) {
  const t = await resolvePageToken()
  const url = new URL(`${API_BASE}${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  url.searchParams.set('access_token', t)
  const res  = await fetch(url.toString())
  const json = await res.json()
  if (json.error) {
    // Clear cached token on auth errors so the next invocation re-resolves
    const code = json.error?.code
    if (code === 190 || code === 102 || code === 463) _resolvedToken = null
    throw new Error(`FB API: ${json.error.message}`)
  }
  return json
}

// Page-level insights — tested working in v22.0
const PAGE_METRICS = [
  'page_impressions_unique',
  'page_post_engagements',
  'page_video_views',
  'page_views_total',
  'page_actions_post_reactions_total',
].join(',')

async function getPageStats(): Promise<FBPageStats | null> {
  const id = pageId()
  if (!id) return null

  const [info, insights] = await Promise.all([
    fbFetch(`/${id}`, { fields: 'name,fan_count,followers_count' }),
    fbFetch(`/${id}/insights`, { metric: PAGE_METRICS, period: 'days_28' }),
  ])

  const lookup: Record<string, any> = {}
  for (const m of insights.data ?? []) {
    lookup[m.name] = m.values?.[m.values.length - 1]?.value
  }

  return {
    pageName: info.name ?? 'Unknown',
    fanCount: info.followers_count ?? info.fan_count ?? 0,
    reach28d: lookup.page_impressions_unique ?? 0,
    engagements28d: lookup.page_post_engagements ?? 0,
    videoViews28d: lookup.page_video_views ?? 0,
    pageViews28d: lookup.page_views_total ?? 0,
    reactions28d: lookup.page_actions_post_reactions_total ?? {},
  }
}

// Per-post stats — uses insights for reach/clicks, direct fields for reactions/comments/shares
const POST_INSIGHT_METRICS = [
  'post_impressions_unique',
  'post_clicks',
  'post_video_views',
].join(',')

async function getRecentPosts(limit = 25): Promise<FBPost[]> {
  const id = pageId()
  if (!id) return []

  // 1. List recent posts with engagement summary
  const list = await fbFetch(`/${id}/posts`, {
    fields: 'id,message,created_time,permalink_url,attachments{media_type,type},reactions.summary(true),comments.summary(true),shares',
    limit: String(limit),
  })

  const posts = list.data ?? []
  if (!posts.length) return []

  // 2. Batch insights for all post IDs (parallel)
  const insightsArr = await Promise.all(
    posts.map((p: any) =>
      fbFetch(`/${p.id}/insights`, { metric: POST_INSIGHT_METRICS }).catch(() => null)
    )
  )

  return posts.map((p: any, i: number) => {
    const insights = insightsArr[i]?.data ?? []
    const get = (name: string) => insights.find((x: any) => x.name === name)?.values?.[0]?.value
    const attachment = p.attachments?.data?.[0]
    return {
      id: p.id,
      message: p.message ?? '',
      createdAt: p.created_time,
      permalink: p.permalink_url ?? `https://facebook.com/${p.id}`,
      type: attachment?.media_type ?? attachment?.type ?? 'status',
      reach: Number(get('post_impressions_unique') ?? 0),
      clicks: Number(get('post_clicks') ?? 0),
      reactions: Number(p.reactions?.summary?.total_count ?? 0),
      comments: Number(p.comments?.summary?.total_count ?? 0),
      shares: Number(p.shares?.count ?? 0),
      videoViews: Number(get('post_video_views') ?? 0),
    } satisfies FBPost
  })
}

export async function getFacebookOverview(): Promise<FacebookOverview | null> {
  if (!rawToken() || !pageId()) return null

  const [page, recentPosts] = await Promise.all([
    getPageStats(),
    getRecentPosts(25),
  ])
  if (!page) return null

  const topPostsByReach = [...recentPosts].sort((a, b) => b.reach - a.reach).slice(0, 10)

  return { page, recentPosts, topPostsByReach }
}
