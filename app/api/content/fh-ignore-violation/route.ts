import { NextResponse } from 'next/server'
import { resolveViolation } from '@/lib/fair-housing'

export const dynamic = 'force-dynamic'

/**
 * Dismiss a single FH violation without modifying the post body — used when
 * the operator judges the flagged phrase OK to leave in place.
 *
 * Body: { postId: string, violationIndex: number }
 * Returns: { ok: true, fhResult: FHCheckResult }
 */
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId, violationIndex } = await request.json().catch(() => ({}))
  if (!postId || typeof violationIndex !== 'number') {
    return NextResponse.json({ error: 'postId and violationIndex required' }, { status: 400 })
  }

  const fhResult = await resolveViolation(postId, violationIndex)
  if (!fhResult) {
    return NextResponse.json({ error: 'No FH check result for this post' }, { status: 404 })
  }
  return NextResponse.json({ ok: true, fhResult })
}
