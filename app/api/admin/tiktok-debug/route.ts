import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  'Accept':     'application/json, text/plain, */*',
  'Referer':    'https://www.tikwm.com/',
  'Origin':     'https://www.tikwm.com',
}

async function tryEndpoint(url: string, method: 'GET' | 'POST', body?: string) {
  try {
    const res = await fetch(url, {
      method,
      headers: method === 'POST'
        ? { ...BROWSER_HEADERS, 'Content-Type': 'application/x-www-form-urlencoded' }
        : BROWSER_HEADERS,
      body: method === 'POST' ? body : undefined,
      signal: AbortSignal.timeout(12_000),
    })
    const text = await res.text()
    let parsed: unknown = null
    try { parsed = JSON.parse(text) } catch { parsed = text.slice(0, 500) }
    return { status: res.status, ok: res.ok, body: parsed }
  } catch (e) {
    return { status: 0, ok: false, body: String(e) }
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const handle = (process.env.TIKTOK_USERNAME ?? 'legacy.home.team').replace(/^@/, '')
  const base   = 'https://www.tikwm.com/api'

  // Test multiple tikwm endpoints to find what works from Vercel IPs
  const [
    profilePost,
    profileGet,
    postsPost,
    postsGet,
    feedPost,
    feedGet,
    videoPost,
    videoGet,
  ] = await Promise.all([
    tryEndpoint(`${base}/user/info`,  'POST', `unique_id=${handle}`),
    tryEndpoint(`${base}/user/info?unique_id=${handle}`, 'GET'),
    tryEndpoint(`${base}/user/posts`, 'POST', `unique_id=${handle}&count=5&cursor=0`),
    tryEndpoint(`${base}/user/posts?unique_id=${handle}&count=5&cursor=0`, 'GET'),
    tryEndpoint(`${base}/user/feed`,  'POST', `unique_id=@${handle}&count=5&cursor=0`),
    tryEndpoint(`${base}/user/feed?unique_id=@${handle}&count=5&cursor=0`, 'GET'),
    tryEndpoint(`${base}/user/video`, 'POST', `unique_id=@${handle}&count=5&cursor=0`),
    tryEndpoint(`${base}/user/video?unique_id=@${handle}&count=5&cursor=0`, 'GET'),
  ])

  // Also check what the TikTok profile page returns
  let tikTokDirectStatus = 0
  let tikTokDirectHasSigi = false
  let tikTokDirectHasNext = false
  try {
    const res = await fetch(`https://www.tiktok.com/@${handle}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.google.com/',
      },
      signal: AbortSignal.timeout(20_000),
    })
    tikTokDirectStatus = res.status
    if (res.ok) {
      const html = await res.text()
      tikTokDirectHasSigi = html.includes('SIGI_STATE')
      tikTokDirectHasNext = html.includes('__NEXT_DATA__')
    }
  } catch {}

  return NextResponse.json({
    handle,
    manualTotalViewsEnvVar: process.env.TIKTOK_TOTAL_VIEWS ?? '(not set)',
    endpoints: {
      'profile POST': { status: profilePost.status, code: (profilePost.body as Record<string,unknown>)?.code },
      'profile GET':  { status: profileGet.status,  code: (profileGet.body as Record<string,unknown>)?.code },
      'posts POST':   { status: postsPost.status,   code: (postsPost.body as Record<string,unknown>)?.code },
      'posts GET':    { status: postsGet.status,    code: (postsGet.body as Record<string,unknown>)?.code },
      'feed POST':    { status: feedPost.status,    code: (feedPost.body as Record<string,unknown>)?.code },
      'feed GET':     { status: feedGet.status,     code: (feedGet.body as Record<string,unknown>)?.code },
      'video POST':   { status: videoPost.status,   code: (videoPost.body as Record<string,unknown>)?.code },
      'video GET':    { status: videoGet.status,    code: (videoGet.body as Record<string,unknown>)?.code },
    },
    tikTokDirect: {
      status: tikTokDirectStatus,
      hasSigiState: tikTokDirectHasSigi,
      hasNextData: tikTokDirectHasNext,
    },
    profileSample: profilePost.ok ? profilePost.body : profileGet.body,
  }, { status: 200 })
}
