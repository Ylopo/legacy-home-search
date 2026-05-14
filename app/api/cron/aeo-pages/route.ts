import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { AEO_QUEUE, TOTAL_ROUNDS, CITIES_PER_ROUND } from '@/lib/aeo-queue'
import { generateAEOContent, generateAEOPageTSX, commitFilesToGitHub } from '@/lib/aeo-generator'
import { sendAEODailyEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const REDIS_ROUND_KEY = 'aeo:round'

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) throw new Error('Upstash Redis not configured')
  return new Redis({ url, token })
}

async function runAEOBatch() {
  const redis = getRedis()

  // Get current round
  const rawRound = await redis.get<number>(REDIS_ROUND_KEY)
  const round = rawRound ?? 0

  if (round >= TOTAL_ROUNDS) {
    console.log('[aeo-pages] All rounds complete — nothing to do')
    return NextResponse.json({ ok: true, message: 'All AEO pages already generated' })
  }

  const batchStart = round * CITIES_PER_ROUND
  const batch = AEO_QUEUE.slice(batchStart, batchStart + CITIES_PER_ROUND)

  console.log(`[aeo-pages] Round ${round + 1}/${TOTAL_ROUNDS} — generating ${batch.length} pages`)

  const results: Array<{ entry: typeof batch[0]; tsx: string; error?: string }> = []

  // Generate content for each page (sequential to avoid Claude rate limits)
  for (const entry of batch) {
    try {
      console.log(`[aeo-pages] Generating ${entry.city}/${entry.slug}`)
      const content = await generateAEOContent(entry)
      const tsx = generateAEOPageTSX(entry, content)
      results.push({ entry, tsx })
    } catch (err: any) {
      console.error(`[aeo-pages] Failed to generate ${entry.city}/${entry.slug}:`, err?.message)
      results.push({ entry, tsx: '', error: err?.message ?? 'Unknown error' })
    }
  }

  const successful = results.filter(r => !r.error)

  if (successful.length === 0) {
    return NextResponse.json({ ok: false, error: 'All page generations failed' }, { status: 500 })
  }

  // Commit all successful pages in a single GitHub commit
  const files = successful.map(r => ({
    path: `app/(site)/${r.entry.city}/${r.entry.slug}/page.tsx`,
    content: r.tsx,
  }))

  const pageList = successful.map(r => `${r.entry.cityName}: ${r.entry.h1}`).join(', ')
  const commitMessage = `Add AEO pages — Round ${round + 1}/${TOTAL_ROUNDS}\n\nPages: ${pageList}\n\nCo-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`

  try {
    await commitFilesToGitHub(files, commitMessage)
    console.log(`[aeo-pages] Committed ${files.length} files to GitHub`)
  } catch (err: any) {
    console.error('[aeo-pages] GitHub commit failed:', err?.message)
    return NextResponse.json({ ok: false, error: `GitHub commit failed: ${err?.message}` }, { status: 500 })
  }

  // Advance the round counter
  await redis.set(REDIS_ROUND_KEY, round + 1)

  // Send email summary
  const emailPages = successful.map(r => ({
    h1: r.entry.h1,
    url: `/${r.entry.city}/${r.entry.slug}`,
    city: r.entry.cityName,
  }))

  try {
    await sendAEODailyEmail(emailPages, round, TOTAL_ROUNDS)
  } catch (err: any) {
    console.error('[aeo-pages] Email send failed:', err?.message)
  }

  return NextResponse.json({
    ok: true,
    round: round + 1,
    totalRounds: TOTAL_ROUNDS,
    generated: successful.length,
    failed: results.filter(r => r.error).length,
    pages: emailPages,
  })
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runAEOBatch()
}

export async function POST(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  const body = await request.json().catch(() => ({}))
  if (body.secret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runAEOBatch()
}
