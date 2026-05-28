/**
 * Instagram Graph API client (Business account analytics)
 *
 * Reuses the same long-lived Facebook Page Access Token — no separate auth needed.
 * The Instagram Business Account must be linked to the Facebook Page.
 *
 * Env vars required:
 *   INSTAGRAM_ACCESS_TOKEN        — same long-lived token as FACEBOOK_PAGE_ACCESS_TOKEN
 *   INSTAGRAM_BUSINESS_ACCOUNT_ID — Instagram business account ID
 *                                   (GET /{facebook-page-id}?fields=instagram_business_account)
 *
 * Scopes the token must have:
 *   instagram_basic, instagram_manage_insights
 */

const API_BASE = 'https://graph.facebook.com/v22.0'

export type IGProfile = {
  username: string
  name: string
  followers: number
  mediaCount: number
  profilePictureUrl?: string
}

export type IGPost = {
  id: string
  timestamp: string
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | string
  likeCount: number
  commentsCount: number
  reach: number
  impressions: number
  saved: number
  permalink: string
  thumbnailUrl?: string
}

export type InstagramOverview = {
  profile: IGProfile
  recentPosts: IGPost[]
  topPostsByReach: IGPost[]
}

function token()     { return process.env.INSTAGRAM_ACCESS_TOKEN?.trim() || null }
function accountId() { return process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim() || null }

async function igFetch(path: string, params: Record<string, string> = {}) {
  const t = token()
  if (!t) throw new Error('INSTAGRAM_ACCESS_TOKEN not set')
  const url = new URL(`${API_BASE}${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  url.searchParams.set('access_token', t)
  const res  = await fetch(url.toString())
  const json = await res.json()
  if (json.error) throw new Error(`Instagram API: ${json.error.message}`)
  return json
}

async function getProfile(): Promise<IGProfile | null> {
  const id = accountId()
  if (!id) return null
  const data = await igFetch(`/${id}`, {
    fields: 'username,name,followers_count,media_count,profile_picture_url',
  })
  return {
    username:          data.username ?? '',
    name:              data.name ?? '',
    followers:         data.followers_count ?? 0,
    mediaCount:        data.media_count ?? 0,
    profilePictureUrl: data.profile_picture_url,
  }
}

async function getRecentPosts(limit = 20): Promise<IGPost[]> {
  const id = accountId()
  if (!id) return []

  const list = await igFetch(`/${id}/media`, {
    fields: 'id,timestamp,media_type,like_count,comments_count,thumbnail_url,permalink',
    limit: String(limit),
  })
  const posts = list.data ?? []
  if (!posts.length) return []

  // Fetch per-post insights in parallel
  const insightsArr = await Promise.all(
    posts.map((p: any) =>
      igFetch(`/${p.id}/insights`, { metric: 'reach,impressions,saved' }).catch(() => null)
    )
  )

  return posts.map((p: any, i: number) => {
    const ins = insightsArr[i]?.data ?? []
    const get = (name: string) => ins.find((x: any) => x.name === name)?.values?.[0]?.value ?? 0
    return {
      id:           p.id,
      timestamp:    p.timestamp,
      mediaType:    p.media_type ?? 'IMAGE',
      likeCount:    p.like_count ?? 0,
      commentsCount: p.comments_count ?? 0,
      reach:        Number(get('reach')),
      impressions:  Number(get('impressions')),
      saved:        Number(get('saved')),
      permalink:    p.permalink ?? '',
      thumbnailUrl: p.thumbnail_url,
    } satisfies IGPost
  })
}

export async function getInstagramOverview(): Promise<InstagramOverview | null> {
  if (!token() || !accountId()) return null
  const [profile, recentPosts] = await Promise.all([getProfile(), getRecentPosts(20)])
  if (!profile) return null
  const topPostsByReach = [...recentPosts].sort((a, b) => b.reach - a.reach).slice(0, 9)
  return { profile, recentPosts, topPostsByReach }
}
