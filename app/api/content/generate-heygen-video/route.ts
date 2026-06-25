import { NextResponse } from 'next/server'
import { generateHeyGenVideo } from '@/lib/heygen-client'
import { normalizeScriptForSpeech } from '@/lib/script-normalizer'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { script } = await request.json()
  if (!script?.trim()) {
    return NextResponse.json({ error: 'script is required' }, { status: 400 })
  }

  try {
    // Expand numerals/prices/years into spoken English so the avatar reads
    // them naturally. Fail-safe — falls back to the original script if the
    // normalizer errors.
    const normalized = await normalizeScriptForSpeech(script.trim())
    const videoId = await generateHeyGenVideo(normalized)
    return NextResponse.json({ videoId, normalizedScript: normalized })
  } catch (err) {
    console.error('[generate-heygen-video]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to start video generation' },
      { status: 500 },
    )
  }
}
