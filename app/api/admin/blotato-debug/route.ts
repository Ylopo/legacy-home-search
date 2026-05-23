import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 20

const BASE_URL = 'https://backend.blotato.com/v2'

async function pingAccount(apiKey: string, accountId: string): Promise<{ ok: boolean; status: number; body: unknown }> {
  try {
    // GET a non-existent post ID — tests that auth + account routing works.
    // Blotato returns 404 (not 401/403) when the key is valid but the post doesn't exist.
    const res = await fetch(`${BASE_URL}/posts/ping-test-${accountId}`, {
      headers: { 'blotato-api-key': apiKey, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8_000),
    })
    let body: unknown
    try { body = await res.json() } catch { body = await res.text().catch(() => '(no body)') }
    return { ok: res.status < 500, status: res.status, body }
  } catch (e) {
    return { ok: false, status: 0, body: String(e) }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.BLOTATO_API_KEY ?? process.env.BLOTATO_KEY ?? ''
  const hasApiKey = !!apiKey

  const accounts = {
    facebook:      process.env.BLOTATO_FACEBOOK_ACCOUNT_ID    ?? '(NOT SET)',
    youtube:       process.env.BLOTATO_YOUTUBE_ACCOUNT_ID      ?? '(NOT SET)',
    tiktok:        process.env.BLOTATO_TIKTOK_ACCOUNT_ID       ?? '(NOT SET)',
    linkedin:      process.env.BLOTATO_LINKEDIN_ACCOUNT_ID     ?? '20512 (default)',
    x:             process.env.BLOTATO_X_ACCOUNT_ID            ?? '17792 (default)',
    threads:       process.env.BLOTATO_THREADS_ACCOUNT_ID      ?? '6535 (default)',
    instagram:     process.env.BLOTATO_INSTAGRAM_ACCOUNT_ID    ?? '(NOT SET)',
    facebookPageId: process.env.BLOTATO_FACEBOOK_PAGE_ID       ?? '(NOT SET)',
  }

  // Quick auth test — just checks that the API key is accepted at all
  let authTest: { ok: boolean; status: number; body: unknown } = { ok: false, status: 0, body: 'API key not configured' }
  if (hasApiKey) {
    authTest = await pingAccount(apiKey, 'auth-test')
  }

  return NextResponse.json({
    hasApiKey,
    apiKeyPrefix: hasApiKey ? apiKey.slice(0, 8) + '...' : '(not set)',
    accounts,
    authTest,
    diagnosis: {
      instagramConfigured: !!process.env.BLOTATO_INSTAGRAM_ACCOUNT_ID,
      instagramAccountId: process.env.BLOTATO_INSTAGRAM_ACCOUNT_ID ?? null,
      likelyCause: !hasApiKey
        ? 'BLOTATO_API_KEY not set — all publishes fail'
        : !process.env.BLOTATO_INSTAGRAM_ACCOUNT_ID
        ? 'BLOTATO_INSTAGRAM_ACCOUNT_ID not set in Vercel — Instagram silently throws on every publish'
        : authTest.status === 401 || authTest.status === 403
        ? 'API key is invalid or expired'
        : 'Env vars look correct — check Blotato dashboard to confirm account 45624 is connected to Instagram',
    },
  }, { status: 200 })
}
