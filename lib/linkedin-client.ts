/**
 * LinkedIn Marketing Developer Platform client (Organization analytics)
 *
 * Requires LinkedIn app with "Marketing Developer Platform" product added.
 * OAuth 2.0 token EXPIRES EVERY 60 DAYS — must be refreshed manually.
 *
 * Env vars required:
 *   LINKEDIN_ACCESS_TOKEN    — OAuth 2.0 bearer token (60-day expiry)
 *   LINKEDIN_ORGANIZATION_ID — numeric org ID from company page URL
 *                              e.g. linkedin.com/company/12345678 → "12345678"
 *
 * Required OAuth scopes:
 *   r_organization_social, rw_organization_admin
 */

const API_BASE = 'https://api.linkedin.com/v2'

export type LIProfile = {
  orgId: string
  name: string
  followers: number
}

export type LIPost = {
  id: string
  commentary: string
  publishedAt: string
  impressions: number
  clicks: number
  reactions: number
  shares: number
  engagementRate: number
  postUrl: string
}

export type LinkedInOverview = {
  profile: LIProfile
  recentPosts: LIPost[]
  tokenExpiresWarning: boolean  // true if token may be within 10 days of expiry
}

function token()  { return process.env.LINKEDIN_ACCESS_TOKEN?.trim() || null }
function orgId()  { return process.env.LINKEDIN_ORGANIZATION_ID?.trim() || null }
function orgUrn() { return `urn:li:organization:${orgId()}` }

async function liFetch(path: string, params: Record<string, string> = {}) {
  const t = token()
  if (!t) throw new Error('LINKEDIN_ACCESS_TOKEN not set')
  const url = new URL(`${API_BASE}${path}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${t}`,
      'LinkedIn-Version': '202401',
      'X-Restli-Protocol-Version': '2.0.0',
    },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`LinkedIn API ${res.status}: ${body.slice(0, 200)}`)
  }
  return res.json()
}

async function getProfile(): Promise<LIProfile | null> {
  const id = orgId()
  if (!id) return null

  const [orgData, networkData] = await Promise.all([
    liFetch(`/organizations/${id}`, { fields: 'localizedName' }),
    liFetch(`/networkSizes/${encodeURIComponent(orgUrn())}`, { edgeType: 'CompanyFollowedByMember' }),
  ])

  return {
    orgId:     id,
    name:      orgData.localizedName ?? 'Unknown',
    followers: networkData.firstDegreeSize ?? 0,
  }
}

async function getRecentPosts(count = 20): Promise<LIPost[]> {
  const id = orgId()
  if (!id) return []

  // Fetch posts and share stats in parallel
  const [postsData, statsData] = await Promise.all([
    liFetch('/ugcPosts', {
      q: 'authors',
      authors: `List(${encodeURIComponent(orgUrn())})`,
      count: String(count),
    }),
    liFetch('/organizationalEntityShareStatistics', {
      q: 'organizationalEntity',
      organizationalEntity: encodeURIComponent(orgUrn()),
    }).catch(() => ({ elements: [] })),
  ])

  const posts = postsData.elements ?? []
  const statsMap: Record<string, any> = {}
  for (const s of statsData.elements ?? []) {
    const shareId = s.share ?? s.ugcPost
    if (shareId) statsMap[shareId] = s.totalShareStatistics
  }

  return posts.map((p: any) => {
    const shareId = p.id
    const stats   = statsMap[shareId] ?? {}
    const impressions = stats.impressionCount ?? 0
    const clicks      = stats.clickCount ?? 0
    const reactions   = stats.likeCount ?? 0
    const shares      = stats.shareCount ?? 0
    const engagementRate = impressions > 0
      ? ((clicks + reactions + shares) / impressions)
      : 0

    // Extract text from structured content
    const commentary = p.specificContent?.['com.linkedin.ugc.ShareContent']
      ?.shareCommentary?.text
      ?? p.specificContent?.['com.linkedin.ugc.MemberNetworkVisibility']
      ?? ''

    const publishedAt = p.firstPublishedAt
      ? new Date(p.firstPublishedAt).toISOString()
      : new Date().toISOString()

    return {
      id:             shareId,
      commentary:     String(commentary).slice(0, 120),
      publishedAt,
      impressions,
      clicks,
      reactions,
      shares,
      engagementRate,
      postUrl: `https://www.linkedin.com/feed/update/${encodeURIComponent(shareId)}/`,
    } satisfies LIPost
  })
}

export async function getLinkedInOverview(): Promise<LinkedInOverview | null> {
  if (!token() || !orgId()) return null

  const [profile, recentPosts] = await Promise.all([getProfile(), getRecentPosts(20)])
  if (!profile) return null

  // LinkedIn tokens expire after 60 days; we can't know the issue date,
  // so we surface a warning to remind operators to refresh periodically.
  // If LINKEDIN_TOKEN_ISSUED_AT env var is set (ISO date), we use it.
  let tokenExpiresWarning = false
  const issuedAt = process.env.LINKEDIN_TOKEN_ISSUED_AT
  if (issuedAt) {
    const issued = new Date(issuedAt)
    const daysSince = (Date.now() - issued.getTime()) / (1000 * 60 * 60 * 24)
    if (daysSince > 50) tokenExpiresWarning = true
  }

  return { profile, recentPosts, tokenExpiresWarning }
}
