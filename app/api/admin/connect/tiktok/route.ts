/**
 * POST /api/admin/connect/tiktok
 * Body: { username: string }
 *
 * Validates a TikTok username by fetching public profile data,
 * then saves metadata to Sanity platformCredentials.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export const dynamic = 'force-dynamic'

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

  const body = await request.json().catch(() => ({}))
  const username = String(body.username ?? '').replace(/^@/, '').trim()
  if (!username) return NextResponse.json({ error: 'username is required' }, { status: 400 })

  // Validate via tikwm public API
  let displayName = username
  let followers   = 0
  try {
    const res  = await fetch(`https://www.tikwm.com/api/user/info?unique_id=${username}`, { method: 'POST' })
    const json = await res.json()
    const user = json?.data?.user
    if (user) {
      displayName = user.nickname ?? username
      followers   = user.follower_count ?? 0
    }
  } catch {
    return NextResponse.json({ error: `Could not reach TikTok for @${username}. Check the username and try again.` }, { status: 400 })
  }

  // Save to Sanity
  await sanity().createOrReplace({
    _type: 'platformCredentials',
    _id:   'platformCredentials',
    tiktok: { username, connectedAt: new Date().toISOString() },
  }).catch(async () => {
    await sanity().patch('platformCredentials')
      .setIfMissing({ _type: 'platformCredentials' })
      .set({ 'tiktok.username': username, 'tiktok.connectedAt': new Date().toISOString() })
      .commit()
  })

  return NextResponse.json({
    success:     true,
    username,
    displayName,
    followers,
    envVar: { key: 'TIKTOK_USERNAME', value: username },
  })
}
