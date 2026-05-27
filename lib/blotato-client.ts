/**
 * Blotato API client
 *
 * Base URL: https://backend.blotato.com/v2
 * Auth:     blotato-api-key: {key}
 *
 * Phase 1: Account IDs are hardcoded per-client in env vars.
 * Phase 2+: swap account ID resolvers to read from Sanity clientConfig doc.
 *
 * Env vars required:
 *   BLOTATO_API_KEY                 — API key
 *   BLOTATO_FACEBOOK_ACCOUNT_ID    — Blotato account ID for Facebook (29353)
 *   BLOTATO_YOUTUBE_ACCOUNT_ID     — Blotato account ID for YouTube (34912)
 *   BLOTATO_TIKTOK_ACCOUNT_ID      — Blotato account ID for TikTok (39905)
 *   BLOTATO_LINKEDIN_ACCOUNT_ID    — Blotato account ID for LinkedIn (20512)
 *   BLOTATO_X_ACCOUNT_ID           — Blotato account ID for X/Twitter (17792)
 *   BLOTATO_THREADS_ACCOUNT_ID     — Blotato account ID for Threads (6535)
 *   BLOTATO_INSTAGRAM_ACCOUNT_ID   — Blotato account ID for Instagram (45624)
 *   BLOTATO_FACEBOOK_PAGE_ID       — Facebook Page ID (1101893253009079)
 */

const BASE_URL = 'https://backend.blotato.com/v2'

function getHeaders(): Record<string, string> {
  const apiKey = process.env.BLOTATO_API_KEY ?? process.env.BLOTATO_KEY
  if (!apiKey) throw new Error('BLOTATO_API_KEY env var is not set')
  return {
    'blotato-api-key': apiKey,
    'Content-Type': 'application/json',
  }
}

function getFacebookAccountId(): string {
  const id = process.env.BLOTATO_FACEBOOK_ACCOUNT_ID
  if (!id) throw new Error('BLOTATO_FACEBOOK_ACCOUNT_ID env var is not set')
  return id
}

function getYouTubeAccountId(): string {
  const id = process.env.BLOTATO_YOUTUBE_ACCOUNT_ID
  if (!id) throw new Error('BLOTATO_YOUTUBE_ACCOUNT_ID env var is not set')
  return id
}

function getTikTokAccountId(): string {
  const id = process.env.BLOTATO_TIKTOK_ACCOUNT_ID
  if (!id) throw new Error('BLOTATO_TIKTOK_ACCOUNT_ID env var is not set')
  return id
}

function getLinkedInAccountId(): string {
  return process.env.BLOTATO_LINKEDIN_ACCOUNT_ID ?? '20512'
}

function getXAccountId(): string {
  return process.env.BLOTATO_X_ACCOUNT_ID ?? '17792'
}

function getThreadsAccountId(): string {
  return process.env.BLOTATO_THREADS_ACCOUNT_ID ?? '6535'
}

function getInstagramAccountId(): string {
  const id = process.env.BLOTATO_INSTAGRAM_ACCOUNT_ID
  if (!id) throw new Error('BLOTATO_INSTAGRAM_ACCOUNT_ID env var is not set')
  return id
}

function getPageId(): string {
  const id = process.env.BLOTATO_FACEBOOK_PAGE_ID
  if (!id) throw new Error('BLOTATO_FACEBOOK_PAGE_ID env var is not set')
  return id
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type BlotatoPublishResult = {
  postSubmissionId: string
}

export type BlotatoPostStatus = {
  status: 'pending' | 'published' | 'failed'
  postUrl?: string
  errorMessage?: string
}

// ─── Publish ──────────────────────────────────────────────────────────────────

// Facebook Graph API rejects posts with very long text payloads
const FB_TEXT_LIMIT = 2000

export async function publishToFacebook(
  text: string,
  imageUrl: string,
): Promise<BlotatoPublishResult> {
  const accountId = getFacebookAccountId()
  const pageId = getPageId()
  const safeText = text.length > FB_TEXT_LIMIT ? text.slice(0, FB_TEXT_LIMIT - 3) + '...' : text

  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      post: {
        accountId,
        content: {
          text: safeText,
          mediaUrls: [imageUrl],
          platform: 'facebook',
        },
        target: {
          targetType: 'facebook',
          pageId,
        },
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Blotato Facebook publish failed (${res.status}): ${body}`)
  }

  const data = await res.json()

  if (!data.postSubmissionId) {
    throw new Error(`Blotato response missing postSubmissionId: ${JSON.stringify(data)}`)
  }

  return { postSubmissionId: String(data.postSubmissionId) }
}

export async function publishToFacebookReel(
  text: string,
  videoUrl: string,
): Promise<BlotatoPublishResult> {
  const accountId = getFacebookAccountId()
  const pageId = getPageId()
  const safeText = text.length > FB_TEXT_LIMIT ? text.slice(0, FB_TEXT_LIMIT - 3) + '...' : text

  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      post: {
        accountId,
        content: {
          text: safeText,
          mediaUrls: [videoUrl],
          platform: 'facebook',
        },
        target: {
          targetType: 'facebook',
          pageId,
        },
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Blotato Facebook Reel publish failed (${res.status}): ${body}`)
  }

  const data = await res.json()

  if (!data.postSubmissionId) {
    throw new Error(`Blotato response missing postSubmissionId: ${JSON.stringify(data)}`)
  }

  return { postSubmissionId: String(data.postSubmissionId) }
}

export async function publishToYouTube(
  title: string,
  description: string,
  videoUrl: string,
  thumbnailUrl?: string,
): Promise<BlotatoPublishResult> {
  const accountId = getYouTubeAccountId()
  const safeTitle = title.length > 100 ? title.slice(0, 97) + '...' : title

  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      post: {
        accountId,
        content: {
          text: description,
          mediaUrls: [videoUrl],
          platform: 'youtube',
        },
        target: {
          targetType: 'youtube',
          title: safeTitle,
          privacyStatus: 'public',
          shouldNotifySubscribers: true,
          ...(thumbnailUrl ? { thumbnailUrl } : {}),
        },
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Blotato YouTube publish failed (${res.status}): ${body}`)
  }

  const data = await res.json()

  if (!data.postSubmissionId) {
    throw new Error(`Blotato YouTube response missing postSubmissionId: ${JSON.stringify(data)}`)
  }

  return { postSubmissionId: String(data.postSubmissionId) }
}

export async function publishToTikTok(
  caption: string,
  videoUrl: string,
): Promise<BlotatoPublishResult> {
  const accountId = getTikTokAccountId()

  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      post: {
        accountId,
        content: {
          text: caption,
          mediaUrls: [videoUrl],
          platform: 'tiktok',
        },
        target: {
          targetType: 'tiktok',
          privacyLevel: 'PUBLIC_TO_EVERYONE',
          disabledComments: false,
          disabledDuet: false,
          disabledStitch: false,
          isBrandedContent: false,
          isYourBrand: false,
          isAiGenerated: false,
          coverTimestampMs: 0,
        },
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Blotato TikTok publish failed (${res.status}): ${body}`)
  }

  const data = await res.json()

  if (!data.postSubmissionId) {
    throw new Error(`Blotato TikTok response missing postSubmissionId: ${JSON.stringify(data)}`)
  }

  return { postSubmissionId: String(data.postSubmissionId) }
}

// LinkedIn text limit (3000 chars visible before truncation)
const LI_TEXT_LIMIT = 3000
// X/Twitter character limit — leave room for auto-appended link (~23 chars)
const X_TEXT_LIMIT = 257

export async function publishToLinkedIn(
  text: string,
  mediaUrl: string,
): Promise<BlotatoPublishResult> {
  const accountId = getLinkedInAccountId()
  const safeText = text.length > LI_TEXT_LIMIT ? text.slice(0, LI_TEXT_LIMIT - 3) + '...' : text

  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      post: {
        accountId,
        content: {
          text: safeText,
          mediaUrls: [mediaUrl],
          platform: 'linkedin',
        },
        target: {
          targetType: 'linkedin',
        },
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Blotato LinkedIn publish failed (${res.status}): ${body}`)
  }

  const data = await res.json()
  if (!data.postSubmissionId) {
    throw new Error(`Blotato LinkedIn response missing postSubmissionId: ${JSON.stringify(data)}`)
  }
  return { postSubmissionId: String(data.postSubmissionId) }
}

export async function publishToX(
  text: string,
  mediaUrl: string,
): Promise<BlotatoPublishResult> {
  const accountId = getXAccountId()
  const safeText = text.length > X_TEXT_LIMIT ? text.slice(0, X_TEXT_LIMIT - 3) + '...' : text

  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      post: {
        accountId,
        content: {
          text: safeText,
          mediaUrls: [mediaUrl],
          platform: 'twitter',
        },
        target: {
          targetType: 'twitter',
        },
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Blotato X publish failed (${res.status}): ${body}`)
  }

  const data = await res.json()
  if (!data.postSubmissionId) {
    throw new Error(`Blotato X response missing postSubmissionId: ${JSON.stringify(data)}`)
  }
  return { postSubmissionId: String(data.postSubmissionId) }
}

// Instagram character limit (2200 chars visible before truncation)
const IG_TEXT_LIMIT = 2200

export async function publishToInstagram(
  text: string,
  mediaUrl: string,
): Promise<BlotatoPublishResult> {
  const accountId = getInstagramAccountId()
  const safeText = text.length > IG_TEXT_LIMIT ? text.slice(0, IG_TEXT_LIMIT - 3) + '...' : text

  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      post: {
        accountId,
        content: {
          text: safeText,
          mediaUrls: [mediaUrl],
          platform: 'instagram',
        },
        target: {
          targetType: 'instagram',
        },
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Blotato Instagram publish failed (${res.status}): ${body}`)
  }

  const data = await res.json()
  if (!data.postSubmissionId) {
    throw new Error(`Blotato Instagram response missing postSubmissionId: ${JSON.stringify(data)}`)
  }
  return { postSubmissionId: String(data.postSubmissionId) }
}

export async function publishToInstagramReel(
  text: string,
  videoUrl: string,
): Promise<BlotatoPublishResult> {
  const accountId = getInstagramAccountId()
  const safeText = text.length > IG_TEXT_LIMIT ? text.slice(0, IG_TEXT_LIMIT - 3) + '...' : text

  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      post: {
        accountId,
        content: {
          text: safeText,
          mediaUrls: [videoUrl],
          platform: 'instagram',
        },
        target: {
          targetType: 'instagram',
        },
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Blotato Instagram Reel publish failed (${res.status}): ${body}`)
  }

  const data = await res.json()
  if (!data.postSubmissionId) {
    throw new Error(`Blotato Instagram Reel response missing postSubmissionId: ${JSON.stringify(data)}`)
  }
  return { postSubmissionId: String(data.postSubmissionId) }
}

// ─── Poll status ──────────────────────────────────────────────────────────────

export async function getPostStatus(postSubmissionId: string): Promise<BlotatoPostStatus> {
  const res = await fetch(`${BASE_URL}/posts/${postSubmissionId}`, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Blotato status check failed (${res.status}): ${body}`)
  }

  const data = await res.json()

  return {
    status: data.status ?? 'pending',
    postUrl: data.postUrl ?? data.url ?? undefined,
    errorMessage: data.errorMessage ?? data.error ?? undefined,
  }
}

// Threads character limit (500 chars)
const THREADS_TEXT_LIMIT = 500

export async function publishToThreads(
  text: string,
  mediaUrl: string,
): Promise<BlotatoPublishResult> {
  const accountId = getThreadsAccountId()
  const safeText = text.length > THREADS_TEXT_LIMIT ? text.slice(0, THREADS_TEXT_LIMIT - 3) + '...' : text

  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      post: {
        accountId,
        content: {
          text: safeText,
          mediaUrls: [mediaUrl],
          platform: 'threads',
        },
        target: {
          targetType: 'threads',
        },
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Blotato Threads publish failed (${res.status}): ${body}`)
  }

  const data = await res.json()
  if (!data.postSubmissionId) {
    throw new Error(`Blotato Threads response missing postSubmissionId: ${JSON.stringify(data)}`)
  }
  return { postSubmissionId: String(data.postSubmissionId) }
}

// ─── Account/page lookup (future multi-client use) ───────────────────────────

export async function getConnectedAccounts(): Promise<Array<{ id: string; platform: string; fullname: string }>> {
  const res = await fetch(`${BASE_URL}/users/me/accounts`, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Blotato getConnectedAccounts failed (${res.status}): ${body}`)
  }

  const data = await res.json()
  return data.items ?? data
}

export async function getFacebookSubaccounts(
  accountId: string,
): Promise<Array<{ id: string; name: string; accountId: string }>> {
  const res = await fetch(`${BASE_URL}/users/me/accounts/${accountId}/subaccounts`, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Blotato getSubaccounts failed (${res.status}): ${body}`)
  }

  const data = await res.json()
  return data.items ?? data
}
