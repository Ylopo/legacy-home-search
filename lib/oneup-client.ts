/**
 * OneUp API client
 *
 * Base URLs:
 *   https://www.oneupapp.io/api          — publish + status
 *   https://analyze.oneupapp.io/api      — analytics (see oneup-analytics.ts)
 *
 * Auth: query-string `apiKey={key}` on every call (OneUp's convention).
 *
 * One agency API key works for all categories under the same OneUp account.
 * Per-client routing is by category_id; each social account is identified by
 * its OneUp social_network_id.
 *
 * Env vars required:
 *   ONEUP_API_KEY                 — agency API key
 *   ONEUP_CATEGORY_ID             — Legacy Home Team LPT = 179358
 *   ONEUP_FACEBOOK_ACCOUNT_ID    — Facebook Page ID (1101893253009079)
 *   ONEUP_YOUTUBE_CHANNEL_ID     — YouTube channel ID (UC...)
 *   ONEUP_TIKTOK_ACCOUNT_ID      — TikTok social_network_id (_000...)
 *   ONEUP_INSTAGRAM_ACCOUNT_ID   — Instagram account ID (17841...)
 *   ONEUP_LINKEDIN_ACCOUNT_ID    — LinkedIn URN (urn:li:person:...)
 *   ONEUP_X_ACCOUNT_ID           — X account handle (handle_twitter)
 *
 * Notes:
 *   - OneUp's worker SKIPS past-due timestamps. `scheduled_date_time` for
 *     "publish now" must format the CURRENT time in the OneUp account's
 *     local TZ (America/Los_Angeles for US agency accounts).
 *   - YouTube title is hard-capped at 100 chars by YouTube itself.
 *   - Threads is intentionally NOT supported — OneUp doesn't expose it.
 */

const BASE_URL = 'https://www.oneupapp.io/api'

function getApiKey(): string {
  const key = process.env.ONEUP_API_KEY
  if (!key) throw new Error('ONEUP_API_KEY env var is not set')
  return key
}

function getCategoryId(): string {
  const id = process.env.ONEUP_CATEGORY_ID
  if (!id) throw new Error('ONEUP_CATEGORY_ID env var is not set')
  return id
}

function getFacebookAccountId(): string {
  const id = process.env.ONEUP_FACEBOOK_ACCOUNT_ID
  if (!id) throw new Error('ONEUP_FACEBOOK_ACCOUNT_ID env var is not set')
  return id
}

function getYouTubeAccountId(): string {
  const id = process.env.ONEUP_YOUTUBE_CHANNEL_ID
  if (!id) throw new Error('ONEUP_YOUTUBE_CHANNEL_ID env var is not set')
  return id
}

function getTikTokAccountId(): string {
  const id = process.env.ONEUP_TIKTOK_ACCOUNT_ID
  if (!id) throw new Error('ONEUP_TIKTOK_ACCOUNT_ID env var is not set')
  return id
}

function getInstagramAccountId(): string {
  const id = process.env.ONEUP_INSTAGRAM_ACCOUNT_ID
  if (!id) throw new Error('ONEUP_INSTAGRAM_ACCOUNT_ID env var is not set')
  return id
}

function getLinkedInAccountId(): string {
  const id = process.env.ONEUP_LINKEDIN_ACCOUNT_ID
  if (!id) throw new Error('ONEUP_LINKEDIN_ACCOUNT_ID env var is not set')
  return id
}

function getXAccountId(): string {
  const id = process.env.ONEUP_X_ACCOUNT_ID
  if (!id) throw new Error('ONEUP_X_ACCOUNT_ID env var is not set')
  return id
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIMEZONE = 'America/Los_Angeles'

/**
 * Formats a Date as `YYYY-MM-DD HH:mm` in the OneUp account's local timezone.
 * OneUp's worker reads this string as "naive" PT time and refuses past-due
 * timestamps — so for "publish now" we pass the *current* PT time.
 */
function formatOneUpDateTime(d: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(d)

  const lookup: Record<string, string> = {}
  for (const p of parts) lookup[p.type] = p.value
  // 'en-CA' gives ISO-ish date already (YYYY-MM-DD); hour can be '24' instead of '00' on edge
  const hour = lookup.hour === '24' ? '00' : lookup.hour
  return `${lookup.year}-${lookup.month}-${lookup.day} ${hour}:${lookup.minute}`
}

function clampYouTubeTitle(t: string): string {
  return t.length > 100 ? t.slice(0, 97) + '...' : t
}

/**
 * OneUp's publish endpoints take all parameters in the query string and a
 * POST with an empty body. The response does NOT include a post_id — it
 * only confirms scheduling success. To get a post_id back for later status
 * polling, we follow the schedule call with a `getscheduledposts` query and
 * pick the matching record by content + recency.
 *
 * Quirks confirmed by live testing (2026-06-12):
 *   - `social_network_id` MUST be a JSON-encoded array string e.g. `'["id"]'`.
 *     Plain string returns "Social Network ID must be an array."; `id[]=…`
 *     bracket notation returns "Social Network ID should not be array."
 *     The keyword `ALL` is also accepted (fan-out to all category accounts).
 *   - Image posts use `image_url` (not `media_url`).
 *   - Video posts use `video_url` (not `media_url`) and optional `video_title`.
 *   - The schedule response is `{message, error, data: []}` — no post_id.
 */
async function oneUpPost(
  endpoint: string,
  socialNetworkId: string,
  params: Record<string, string>,
  platformLabel: string,
): Promise<OneUpPublishResult> {
  const url = new URL(`${BASE_URL}/${endpoint}`)
  url.searchParams.set('apiKey', getApiKey())
  url.searchParams.set('category_id', getCategoryId())
  url.searchParams.set('scheduled_date_time', formatOneUpDateTime())
  url.searchParams.set('social_network_id', JSON.stringify([socialNetworkId]))
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)

  const res = await fetch(url.toString(), { method: 'POST' })

  if (!res.ok) {
    const body = await res.text().catch(() => '(no body)')
    throw new Error(`OneUp ${platformLabel} publish failed (${res.status}): ${body}`)
  }

  const data = await res.json().catch(() => ({}))
  if (data?.error) {
    throw new Error(`OneUp ${platformLabel} publish failed: ${data?.message ?? JSON.stringify(data)}`)
  }

  // OneUp doesn't return a post_id on schedule. Query the scheduled queue
  // and find the post we just created (filter by social_network_username
  // matching the account we used, and pick the highest post_id — most recent).
  const queueRes = await fetch(`${BASE_URL}/getscheduledposts?apiKey=${getApiKey()}`)
  const queueData = await queueRes.json().catch(() => ({ data: [] }))
  const recent = (queueData?.data ?? []) as Array<{
    post_id: number
    content?: string
    social_network_username?: string
  }>
  // Best-effort match: highest post_id whose social_network_username matches.
  // Username comparison is lenient because OneUp may strip suffixes.
  const handleHint = socialNetworkId.replace(/_twitter$/, '')
  const candidates = recent
    .filter((p) => (p.social_network_username ?? '').toLowerCase().includes(handleHint.toLowerCase().slice(0, 12)))
    .sort((a, b) => b.post_id - a.post_id)

  const postId = candidates[0]?.post_id ?? Date.now()
  return { postSubmissionId: String(postId) }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type OneUpPublishResult = {
  postSubmissionId: string
}

export type OneUpPostStatus = {
  status: 'pending' | 'published' | 'failed'
  postUrl?: string
  errorMessage?: string
}

// ─── Publish — text + image ───────────────────────────────────────────────────

const FB_TEXT_LIMIT = 2000

export async function publishToFacebook(
  text: string,
  imageUrl: string,
): Promise<OneUpPublishResult> {
  const safeText = text.length > FB_TEXT_LIMIT ? text.slice(0, FB_TEXT_LIMIT - 3) + '...' : text
  return oneUpPost('scheduleimagepost', getFacebookAccountId(), {
    content: safeText,
    image_url: imageUrl,
  }, 'Facebook')
}

export async function publishToInstagram(
  text: string,
  imageUrl: string,
): Promise<OneUpPublishResult> {
  return oneUpPost('scheduleimagepost', getInstagramAccountId(), {
    content: text,
    image_url: imageUrl,
  }, 'Instagram')
}

export async function publishToLinkedIn(
  text: string,
  imageUrl: string,
): Promise<OneUpPublishResult> {
  return oneUpPost('scheduleimagepost', getLinkedInAccountId(), {
    content: text,
    image_url: imageUrl,
  }, 'LinkedIn')
}

const X_TEXT_LIMIT = 280

export async function publishToX(
  text: string,
  imageUrl?: string,
): Promise<OneUpPublishResult> {
  const safeText = text.length > X_TEXT_LIMIT ? text.slice(0, X_TEXT_LIMIT - 3) + '...' : text
  if (imageUrl) {
    return oneUpPost('scheduleimagepost', getXAccountId(), {
      content: safeText,
      image_url: imageUrl,
    }, 'X')
  }
  return oneUpPost('scheduletextpost', getXAccountId(), {
    content: safeText,
  }, 'X')
}

// ─── Publish — video ──────────────────────────────────────────────────────────

export async function publishToYouTube(
  title: string,
  description: string,
  videoUrl: string,
  thumbnailUrl?: string,
): Promise<OneUpPublishResult> {
  // OneUp's title param is `title` (NOT `video_title` — that gets silently
  // dropped, then YouTube rejects with "invalid or empty video title").
  // For YouTube and Reddit, OneUp uses the `title` query param as the post
  // title; for other platforms it's ignored. Verified against OneUp's docs
  // and a failed-post log on 2026-06-15.
  const params: Record<string, string> = {
    content: description,
    video_url: videoUrl,
    title: clampYouTubeTitle(title),
  }
  if (thumbnailUrl) params.thumbnail_url = thumbnailUrl
  return oneUpPost('schedulevideopost', getYouTubeAccountId(), params, 'YouTube')
}

export async function publishToTikTok(
  text: string,
  videoUrl: string,
): Promise<OneUpPublishResult> {
  return oneUpPost('schedulevideopost', getTikTokAccountId(), {
    content: text,
    video_url: videoUrl,
  }, 'TikTok')
}

export async function publishToFacebookReel(
  text: string,
  videoUrl: string,
): Promise<OneUpPublishResult> {
  const safeText = text.length > FB_TEXT_LIMIT ? text.slice(0, FB_TEXT_LIMIT - 3) + '...' : text
  return oneUpPost('schedulevideopost', getFacebookAccountId(), {
    content: safeText,
    video_url: videoUrl,
  }, 'Facebook Reel')
}

export async function publishToInstagramReel(
  text: string,
  videoUrl: string,
): Promise<OneUpPublishResult> {
  return oneUpPost('schedulevideopost', getInstagramAccountId(), {
    content: text,
    video_url: videoUrl,
  }, 'Instagram Reel')
}

// ─── Status polling ───────────────────────────────────────────────────────────

/**
 * Polls OneUp for the published/scheduled/failed state of a submitted post.
 * OneUp doesn't expose a single by-id status endpoint; instead it has three
 * separate listings (`getpublishedposts`, `getscheduledposts`, `getfailedposts`).
 * We search all three for the post_id.
 */
export async function getPostStatus(postSubmissionId: string): Promise<OneUpPostStatus> {
  const apiKey = getApiKey()

  const [published, scheduled, failed] = await Promise.all([
    fetch(`${BASE_URL}/getpublishedposts?apiKey=${apiKey}`).then((r) => r.json()).catch(() => ({})),
    fetch(`${BASE_URL}/getscheduledposts?apiKey=${apiKey}`).then((r) => r.json()).catch(() => ({})),
    fetch(`${BASE_URL}/getfailedposts?apiKey=${apiKey}`).then((r) => r.json()).catch(() => ({})),
  ])

  const matchById = (list: Array<{ post_id?: string | number; live_url?: string; post_url?: string }> = []) =>
    list.find((p) => String(p.post_id) === postSubmissionId)

  const pub = matchById(published?.data)
  if (pub) return { status: 'published', postUrl: pub.live_url ?? pub.post_url }

  const fail = matchById(failed?.data)
  if (fail) {
    const f = fail as { error_message?: string; failure_reason?: string }
    return { status: 'failed', errorMessage: f.error_message ?? f.failure_reason }
  }

  if (matchById(scheduled?.data)) return { status: 'pending' }

  // Not found in any list yet — treat as still propagating
  return { status: 'pending' }
}
