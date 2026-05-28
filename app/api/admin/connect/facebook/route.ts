/**
 * POST /api/admin/connect/facebook
 * Body: { userToken: string, pageId: string }
 *
 * Exchanges a short-lived User Access Token for a never-expiring Page Access Token,
 * validates it by fetching the page name, then saves metadata to Sanity.
 *
 * Returns the long-lived page token for the operator to save as FACEBOOK_PAGE_ACCESS_TOKEN.
 *
 * Required env vars (shared across clients, set once):
 *   FACEBOOK_APP_ID, FACEBOOK_APP_SECRET
 */

import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export const dynamic = 'force-dynamic'

const GRAPH = 'https://graph.facebook.com/v22.0'

function sanity() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '2nr7n3lm',
    dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    token:     process.env.SANITY_WRITE_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
  })
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const appId     = process.env.FACEBOOK_APP_ID?.trim()
  const appSecret = process.env.FACEBOOK_APP_SECRET?.trim()
  if (!appId || !appSecret) {
    return NextResponse.json({
      error: 'FACEBOOK_APP_ID and FACEBOOK_APP_SECRET must be set in Vercel env vars first.',
      fix: 'Go to developers.facebook.com → your app → Settings → Basic → copy App ID and Secret.',
    }, { status: 400 })
  }

  const body      = await request.json().catch(() => ({}))
  const userToken = String(body.userToken ?? '').trim()
  const pageId    = String(body.pageId ?? '').trim()
  if (!userToken) return NextResponse.json({ error: 'userToken is required' }, { status: 400 })
  if (!pageId)    return NextResponse.json({ error: 'pageId is required' }, { status: 400 })

  // Step 1: short-lived → long-lived user token
  const exchUrl = new URL(`${GRAPH}/oauth/access_token`)
  exchUrl.searchParams.set('grant_type', 'fb_exchange_token')
  exchUrl.searchParams.set('client_id', appId)
  exchUrl.searchParams.set('client_secret', appSecret)
  exchUrl.searchParams.set('fb_exchange_token', userToken)
  const exchRes  = await fetch(exchUrl.toString())
  const exchJson = await exchRes.json()
  if (exchJson.error) {
    return NextResponse.json({ error: `Token exchange failed: ${exchJson.error.message}` }, { status: 400 })
  }
  const longLivedToken = exchJson.access_token as string

  // Step 2: long-lived user token → never-expiring page token
  const accsUrl = new URL(`${GRAPH}/me/accounts`)
  accsUrl.searchParams.set('fields', 'access_token,name,id')
  accsUrl.searchParams.set('access_token', longLivedToken)
  const accsRes  = await fetch(accsUrl.toString())
  const accsJson = await accsRes.json()
  if (accsJson.error) {
    return NextResponse.json({ error: `Could not fetch pages: ${accsJson.error.message}` }, { status: 400 })
  }

  const pages    = accsJson.data ?? []
  const match    = pages.find((p: any) => p.id === pageId)
  if (!match) {
    return NextResponse.json({
      error: `Page ID ${pageId} not found. Available pages: ${pages.map((p: any) => `${p.name} (${p.id})`).join(', ') || 'none'}`,
      availablePages: pages.map((p: any) => ({ id: p.id, name: p.name })),
    }, { status: 400 })
  }

  const pageToken = match.access_token as string
  const pageName  = match.name as string

  // Save metadata to Sanity
  await sanity().patch('platformCredentials')
    .setIfMissing({ _type: 'platformCredentials', _id: 'platformCredentials' })
    .set({ 'facebook.pageId': pageId, 'facebook.pageName': pageName, 'facebook.connectedAt': new Date().toISOString() })
    .commit()
    .catch(() => sanity().createOrReplace({
      _type: 'platformCredentials', _id: 'platformCredentials',
      facebook: { pageId, pageName, connectedAt: new Date().toISOString() },
    }))

  return NextResponse.json({
    success: true,
    pageId,
    pageName,
    availablePages: pages.map((p: any) => ({ id: p.id, name: p.name })),
    envVars: [
      { key: 'FACEBOOK_PAGE_ACCESS_TOKEN', value: pageToken },
      { key: 'FACEBOOK_PAGE_ID',           value: pageId },
    ],
    instructions: [
      'Copy FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID into Vercel → Environment Variables.',
      'This token never expires.',
    ],
  })
}
