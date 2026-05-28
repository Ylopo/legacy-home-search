/**
 * POST /api/admin/connect/instagram
 * Body: { pageId?: string }  — optional; falls back to FACEBOOK_PAGE_ID env var
 *
 * Uses the existing FACEBOOK_PAGE_ACCESS_TOKEN to auto-discover the
 * Instagram Business Account ID linked to the Facebook Page.
 * No new credentials needed — token is shared with Facebook.
 *
 * Saves the businessAccountId to Sanity platformCredentials.
 * Returns the ID for the operator to save as INSTAGRAM_BUSINESS_ACCOUNT_ID.
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

  const fbToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim()
    || process.env.INSTAGRAM_ACCESS_TOKEN?.trim()
  if (!fbToken) {
    return NextResponse.json({
      error: 'Facebook must be connected first. FACEBOOK_PAGE_ACCESS_TOKEN is not set.',
    }, { status: 400 })
  }

  const body   = await request.json().catch(() => ({}))
  const pageId = String(body.pageId ?? process.env.FACEBOOK_PAGE_ID ?? '').trim()
  if (!pageId) {
    return NextResponse.json({ error: 'pageId is required (or set FACEBOOK_PAGE_ID env var)' }, { status: 400 })
  }

  // Discover Instagram Business Account ID from the Facebook Page
  const url = new URL(`${GRAPH}/${pageId}`)
  url.searchParams.set('fields', 'instagram_business_account,name')
  url.searchParams.set('access_token', fbToken)

  const res  = await fetch(url.toString())
  const json = await res.json()
  if (json.error) {
    return NextResponse.json({ error: `Facebook API: ${json.error.message}` }, { status: 400 })
  }

  const igAccountId = json.instagram_business_account?.id
  if (!igAccountId) {
    return NextResponse.json({
      error: 'No Instagram Business Account linked to this Facebook Page.',
      fix: 'In Facebook Business Manager, link your Instagram Professional account to this Facebook Page, then retry.',
    }, { status: 400 })
  }

  // Fetch Instagram profile to confirm and get username
  const igUrl = new URL(`${GRAPH}/${igAccountId}`)
  igUrl.searchParams.set('fields', 'username,name,followers_count')
  igUrl.searchParams.set('access_token', fbToken)
  const igRes  = await fetch(igUrl.toString())
  const igJson = await igRes.json()
  const username  = igJson.username ?? ''
  const followers = igJson.followers_count ?? 0

  // Save to Sanity
  await sanity().patch('platformCredentials')
    .setIfMissing({ _type: 'platformCredentials', _id: 'platformCredentials' })
    .set({
      'instagram.businessAccountId': igAccountId,
      'instagram.username': username,
      'instagram.connectedAt': new Date().toISOString(),
    })
    .commit()
    .catch(() => sanity().createOrReplace({
      _type: 'platformCredentials', _id: 'platformCredentials',
      instagram: { businessAccountId: igAccountId, username, connectedAt: new Date().toISOString() },
    }))

  return NextResponse.json({
    success:             true,
    businessAccountId:   igAccountId,
    username,
    followers,
    envVars: [
      { key: 'INSTAGRAM_ACCESS_TOKEN',        value: '(same as FACEBOOK_PAGE_ACCESS_TOKEN)' },
      { key: 'INSTAGRAM_BUSINESS_ACCOUNT_ID', value: igAccountId },
    ],
    instructions: [
      'Set INSTAGRAM_BUSINESS_ACCOUNT_ID to the value above.',
      'Set INSTAGRAM_ACCESS_TOKEN to the same value as FACEBOOK_PAGE_ACCESS_TOKEN.',
    ],
  })
}
