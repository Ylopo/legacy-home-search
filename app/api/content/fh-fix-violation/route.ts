import { NextResponse } from 'next/server'
import { applyFixToPostBody, getFHResult, resolveViolation } from '@/lib/fair-housing'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

/**
 * Apply a single FH violation's suggested fix to the post body, then remove
 * the violation from the cached FH result.
 *
 * Body: { postId: string, violationIndex: number }
 *
 * Returns:
 *   { ok: true, fhResult: FHCheckResult }            on success
 *   { ok: false, error: "Phrase not found …" }       if the excerpt couldn't be located in the post body
 *   { ok: false, error: "…" }                        on any other failure
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

  const existing = await getFHResult(postId)
  if (!existing) {
    return NextResponse.json({ error: 'No FH check result for this post' }, { status: 404 })
  }
  const violation = existing.violations[violationIndex]
  if (!violation) {
    return NextResponse.json({ error: 'Violation index out of range' }, { status: 404 })
  }

  try {
    const { found } = await applyFixToPostBody(postId, violation.excerpt, violation.suggestion)
    if (!found) {
      return NextResponse.json(
        {
          ok: false,
          error: `Phrase "${violation.excerpt}" not found in the post body — edit manually in Sanity Studio`,
        },
        { status: 422 },
      )
    }
    const fhResult = await resolveViolation(postId, violationIndex)
    return NextResponse.json({ ok: true, fhResult })
  } catch (err) {
    console.error('[fh-fix-violation] Error:', err instanceof Error ? err.message : err)
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Fix failed' },
      { status: 500 },
    )
  }
}
