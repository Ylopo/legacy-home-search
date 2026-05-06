import { NextResponse } from 'next/server'
import { getVAQueuePost } from '@/sanity/queries'
import { markScheduled, cancelScheduled } from '@/lib/content-workflow'
import { getSanityWriteClient } from '@/lib/sanity-write'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { postId, scheduledPublishAt, videoUrl, videoThumbnailUrl } = body as {
    postId: string
    scheduledPublishAt: string
    videoUrl?: string
    videoThumbnailUrl?: string
  }

  if (!postId || !scheduledPublishAt) {
    return NextResponse.json({ error: 'postId and scheduledPublishAt are required' }, { status: 400 })
  }

  if (new Date(scheduledPublishAt) <= new Date()) {
    return NextResponse.json({ error: 'scheduledPublishAt must be in the future' }, { status: 400 })
  }

  const post = await getVAQueuePost(postId)
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  if (!['media_ready', 'publish_failed', 'scheduled'].includes(post.workflowStatus ?? '')) {
    return NextResponse.json(
      { error: `Post cannot be scheduled from status: ${post.workflowStatus}` },
      { status: 400 },
    )
  }

  // Save video URL if provided (mirrors the publish route)
  if (videoUrl) {
    const writeClient = getSanityWriteClient()
    await writeClient.patch(postId).set({
      videoUrl,
      ...(videoThumbnailUrl ? { videoThumbnailUrl } : {}),
    }).commit()
  }

  await markScheduled(postId, scheduledPublishAt)
  return NextResponse.json({ ok: true, scheduledPublishAt })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { postId } = body as { postId: string }
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 })

  await cancelScheduled(postId)
  return NextResponse.json({ ok: true })
}
