/**
 * POST /api/admin/connect/youtube
 * Body: { channelId: string }  — accepts raw ID or full youtube.com/channel/... URL
 *
 * Validates by fetching channel name + subscriber count via YouTube Data API,
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

function extractChannelId(raw: string): string {
  // Accept: UC..., youtube.com/channel/UC..., @handle
  const match = raw.match(/channel\/(UC[\w-]+)/)
  if (match) return match[1]
  if (raw.startsWith('UC')) return raw.trim()
  return raw.trim()
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body      = await request.json().catch(() => ({}))
  const channelId = extractChannelId(String(body.channelId ?? ''))
  if (!channelId) return NextResponse.json({ error: 'channelId is required' }, { status: 400 })

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'YOUTUBE_API_KEY env var is not set' }, { status: 500 })

  // Validate via YouTube Data API
  const url = new URL('https://www.googleapis.com/youtube/v3/channels')
  url.searchParams.set('part', 'snippet,statistics')
  url.searchParams.set('id', channelId)
  url.searchParams.set('key', apiKey)

  const res  = await fetch(url.toString())
  const json = await res.json()

  const channel = json.items?.[0]
  if (!channel) {
    return NextResponse.json({
      error: `Channel ID "${channelId}" not found. Make sure it starts with "UC" and is a valid YouTube channel ID.`,
    }, { status: 400 })
  }

  const channelName   = channel.snippet?.title ?? channelId
  const subscribers   = parseInt(channel.statistics?.subscriberCount ?? '0', 10)

  // Save to Sanity
  await sanity().patch('platformCredentials')
    .setIfMissing({ _type: 'platformCredentials', _id: 'platformCredentials' })
    .set({ 'youtube.channelId': channelId, 'youtube.channelName': channelName, 'youtube.connectedAt': new Date().toISOString() })
    .commit()
    .catch(() => sanity().createOrReplace({
      _type: 'platformCredentials', _id: 'platformCredentials',
      youtube: { channelId, channelName, connectedAt: new Date().toISOString() },
    }))

  return NextResponse.json({
    success:     true,
    channelId,
    channelName,
    subscribers,
    envVar: { key: 'YOUTUBE_CHANNEL_ID', value: channelId },
  })
}
