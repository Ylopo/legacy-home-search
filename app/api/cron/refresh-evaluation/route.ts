import { NextResponse } from 'next/server'
import { getPublishedPostsForRefresh } from '@/sanity/queries'
import { buildRefreshQueue } from '@/lib/refresh-engine'
import { saveRefreshQueue, getSkippedIdsFromList } from '@/lib/refresh-store'
import { sendRefreshDigest } from '@/lib/email'

export const maxDuration = 60

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runEvaluation()
}

// Allow POST for manual testing
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  if (body.secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runEvaluation()
}

async function runEvaluation() {
  console.log('[refresh-evaluation] Starting weekly refresh evaluation')

  const posts = await getPublishedPostsForRefresh()
  console.log(`[refresh-evaluation] Evaluating ${posts.length} published posts`)

  // Fetch skip flags for all post IDs in bulk
  const skippedIds = await getSkippedIdsFromList(posts.map((p) => p._id))

  // Build the scored and ranked queue (no GA4 data yet — extension point)
  const candidates = buildRefreshQueue(posts, skippedIds)
  console.log(`[refresh-evaluation] ${candidates.length} candidates queued`)

  // Persist queue to Redis
  await saveRefreshQueue(candidates)

  // Send email digest if there are candidates
  let emailSent = false
  if (candidates.length > 0) {
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.legacyhometeamlpt.com').replace(/\/+$/, '')
    const queueUrl = `${appUrl}/admin/refresh-queue?secret=${process.env.ADMIN_SECRET}`
    try {
      await sendRefreshDigest(candidates, queueUrl)
      emailSent = true
    } catch (err) {
      console.error('[refresh-evaluation] Failed to send digest email:', err)
    }
  }

  return NextResponse.json({
    evaluated: posts.length,
    queued: candidates.length,
    emailSent,
  })
}
