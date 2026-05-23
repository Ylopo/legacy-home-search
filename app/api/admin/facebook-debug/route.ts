import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rawToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim() ?? ''
  const pageId   = process.env.FACEBOOK_PAGE_ID?.trim() ?? ''
  const base     = 'https://graph.facebook.com/v22.0'

  // Step 1: inspect the token itself
  let tokenInfo: unknown = null
  try {
    const r = await fetch(`${base}/debug_token?input_token=${rawToken}&access_token=${rawToken}`)
    tokenInfo = await r.json()
  } catch (e) {
    tokenInfo = String(e)
  }

  // Step 2: try /me/accounts to get page tokens
  let accounts: unknown = null
  try {
    const r = await fetch(`${base}/me/accounts?fields=access_token,name,id&access_token=${rawToken}`)
    accounts = await r.json()
  } catch (e) {
    accounts = String(e)
  }

  // Step 3: try calling the page directly
  let pageTest: unknown = null
  try {
    const r = await fetch(`${base}/${pageId}?fields=name,fan_count&access_token=${rawToken}`)
    pageTest = await r.json()
  } catch (e) {
    pageTest = String(e)
  }

  return NextResponse.json({
    tokenFirst20: rawToken.slice(0, 20) + '...',
    tokenLength:  rawToken.length,
    pageId,
    tokenInfo,
    accounts,
    pageTest,
  }, { status: 200 })
}
