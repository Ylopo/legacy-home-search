/**
 * One-time helper: exchanges a short-lived User Access Token for a
 * never-expiring Page Access Token.
 *
 * Required env vars (add to Vercel once):
 *   FACEBOOK_APP_ID      — Meta app ID  (from developers.facebook.com → your app → Settings → Basic)
 *   FACEBOOK_APP_SECRET  — Meta app secret (same page, click Show)
 *   FACEBOOK_PAGE_ID     — already set (1557003871204016)
 *
 * Usage:
 *   GET /api/admin/facebook-generate-token
 *     ?secret=ADMIN_SECRET
 *     &user_token=PASTE_FRESH_GRAPH_EXPLORER_TOKEN_HERE
 *
 * Returns the permanent Page Access Token. Save it to FACEBOOK_PAGE_ACCESS_TOKEN in Vercel.
 */

import { NextResponse } from 'next/server'

const BASE = 'https://graph.facebook.com/v22.0'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const appId     = process.env.FACEBOOK_APP_ID?.trim()
  const appSecret = process.env.FACEBOOK_APP_SECRET?.trim()
  const pageId    = process.env.FACEBOOK_PAGE_ID?.trim()
  const userToken = searchParams.get('user_token')?.trim()

  if (!appId || !appSecret) {
    return NextResponse.json({
      error: 'FACEBOOK_APP_ID and FACEBOOK_APP_SECRET are not set in Vercel.',
      fix: 'Go to developers.facebook.com → your app → Settings → Basic → copy App ID and App Secret → add both to Vercel environment variables.',
    }, { status: 400 })
  }

  if (!userToken) {
    return NextResponse.json({
      error: 'Missing ?user_token= parameter.',
      fix: 'Go to developers.facebook.com/tools/explorer → generate a User Token with pages_show_list, pages_read_engagement, read_insights permissions → paste it as ?user_token=TOKEN',
    }, { status: 400 })
  }

  // Step 1: exchange short-lived user token → long-lived user token (60 days)
  let longLivedToken: string
  try {
    const url = new URL(`${BASE}/oauth/access_token`)
    url.searchParams.set('grant_type',       'fb_exchange_token')
    url.searchParams.set('client_id',        appId)
    url.searchParams.set('client_secret',    appSecret)
    url.searchParams.set('fb_exchange_token', userToken)

    const res  = await fetch(url.toString())
    const json = await res.json() as { access_token?: string; error?: { message: string } }

    if (json.error) {
      return NextResponse.json({
        step: 'exchange_to_long_lived',
        error: json.error.message,
        fix: 'Confirm FACEBOOK_APP_ID and FACEBOOK_APP_SECRET are correct, and that the user_token is a fresh token from Graph API Explorer.',
      }, { status: 400 })
    }
    if (!json.access_token) {
      return NextResponse.json({ step: 'exchange_to_long_lived', error: 'No access_token in response', raw: json }, { status: 500 })
    }
    longLivedToken = json.access_token
  } catch (e) {
    return NextResponse.json({ step: 'exchange_to_long_lived', error: String(e) }, { status: 500 })
  }

  // Step 2: use long-lived token to get page tokens (page tokens from long-lived tokens never expire)
  let pageToken: string | null = null
  let allPages: { id: string; name: string }[] = []
  try {
    const url = new URL(`${BASE}/me/accounts`)
    url.searchParams.set('fields',       'access_token,name,id')
    url.searchParams.set('access_token', longLivedToken)

    const res  = await fetch(url.toString())
    const json = await res.json() as {
      data?: { id: string; name: string; access_token: string }[]
      error?: { message: string }
    }

    if (json.error) {
      return NextResponse.json({ step: 'get_page_token', error: json.error.message }, { status: 400 })
    }

    allPages = (json.data ?? []).map(p => ({ id: p.id, name: p.name }))

    const match = (json.data ?? []).find(p => p.id === pageId)
    pageToken = match?.access_token ?? null
  } catch (e) {
    return NextResponse.json({ step: 'get_page_token', error: String(e) }, { status: 500 })
  }

  if (!pageToken) {
    return NextResponse.json({
      step: 'match_page',
      error: `No page found with ID ${pageId}. Pages returned: ${allPages.map(p => `${p.name} (${p.id})`).join(', ') || 'none'}`,
      fix: 'Confirm FACEBOOK_PAGE_ID matches one of the pages listed above, and that the user token has pages_show_list permission.',
      longLivedToken,
    }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    pageToken,
    pageId,
    pages: allPages,
    instructions: [
      '1. Copy the pageToken value above.',
      '2. Go to Vercel → Project Settings → Environment Variables.',
      '3. Update FACEBOOK_PAGE_ACCESS_TOKEN to this new value.',
      '4. Redeploy (or wait for next deploy). This token never expires.',
    ],
  })
}
