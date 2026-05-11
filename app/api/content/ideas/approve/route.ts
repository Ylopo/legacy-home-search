import { NextRequest, NextResponse } from 'next/server'
import { getIdea, updateIdeaStatus, addCoveredTopic } from '@/lib/idea-store'
import { writePostFromIdea } from '@/lib/idea-writer'
import { readLearnings } from '@/lib/learnings'
import { publishBlogPost } from '@/lib/sanity-write'
import { checkFairHousing, saveFHResult } from '@/lib/fair-housing'
import { sendFairHousingAlertEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const maxDuration = 120 // writing takes ~20-30s

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { ideaId } = await req.json().catch(() => ({}))
  if (!ideaId) return NextResponse.json({ error: 'ideaId is required' }, { status: 400 })

  const idea = await getIdea(ideaId)
  if (!idea) return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
  if (idea.status === 'approved') {
    return NextResponse.json({ error: 'Already approved' }, { status: 409 })
  }

  try {
    // ── 1. Read LEARNINGS.md for voice/style context ────────────────────
    const learningsContext = await readLearnings()

    // ── 2. Write the blog post ──────────────────────────────────────────
    const draft = await writePostFromIdea(idea, learningsContext)

    // ── 3. Publish to Sanity as media_pending ───────────────────────────
    const postId = await publishBlogPost(draft)

    // ── 4. Fair Housing check ───────────────────────────────────────────
    const fhContent = [draft.title, draft.excerpt, ...draft.body.map((b: any) =>
      b.children?.map((c: any) => c.text ?? '').join('') ?? ''
    )].filter(Boolean).join('\n')

    let fhSeverity: 'clear' | 'warning' | 'violation' = 'clear'
    try {
      const fhResult = await checkFairHousing(fhContent, 'blog-post')
      fhSeverity = fhResult.severity
      await saveFHResult(postId, fhResult)

      if (fhResult.severity === 'violation') {
        const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://legacyhometeamlpt.com').replace(/\/+$/, '')
        const adminSecret = process.env.ADMIN_SECRET ?? ''
        await sendFairHousingAlertEmail({
          postId,
          postTitle: draft.title,
          vaQueueUrl: `${appUrl}/admin/va-queue/${postId}?secret=${encodeURIComponent(adminSecret)}`,
          result: fhResult,
        }).catch(e => console.error('[ideas/approve] FH alert email failed:', e?.message))
      }
    } catch (e: any) {
      console.error('[ideas/approve] FH check failed:', e?.message)
    }

    // ── 5. Mark idea approved + record topic as covered ─────────────────
    await updateIdeaStatus(ideaId, 'approved')
    await addCoveredTopic(draft.slug)

    return NextResponse.json({
      success: true,
      postId,
      slug: draft.slug,
      title: draft.title,
      vaQueueUrl: `/admin/va-queue/${postId}`,
      fairHousing: fhSeverity,
    })
  } catch (err) {
    console.error('[ideas/approve] Error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Writing failed' },
      { status: 500 }
    )
  }
}
