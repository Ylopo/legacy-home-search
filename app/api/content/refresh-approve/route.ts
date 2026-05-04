import { NextResponse } from 'next/server'
import { refreshPost } from '@/lib/refresh-writer'
import { removeFromQueue } from '@/lib/refresh-store'

export const maxDuration = 60

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  if (body.secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId, playbook, action, refreshTier } = body
  if (!postId || !playbook || !action) {
    return NextResponse.json({ error: 'Missing postId, playbook, or action' }, { status: 400 })
  }

  const result = await refreshPost(postId, playbook, action, refreshTier ?? 'competitive')

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  // Remove from queue after successful refresh
  await removeFromQueue(postId)

  return NextResponse.json({ success: true, slug: result.slug, title: result.title })
}
