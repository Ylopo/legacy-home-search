import { NextResponse } from 'next/server'
import { getVAQueuePost } from '@/sanity/queries'
import { publishPostToAll } from '@/lib/publish-service'
import { getSanityWriteClient } from '@/lib/sanity-write'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { postId, socialCopy, videoUrl, videoThumbnailUrl } = body as {
    postId: string
    socialCopy?: string
    videoUrl?: string
    videoThumbnailUrl?: string
  }

  if (!postId) {
    return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  }

  // Save videoUrl to Sanity before fetching the post — covers the case where
  // the video was uploaded after mark-ready so it's not in Sanity yet
  if (videoUrl) {
    const writeClient = getSanityWriteClient()
    await writeClient.patch(postId).set({
      videoUrl,
      ...(videoThumbnailUrl ? { videoThumbnailUrl } : {}),
    }).commit()
  }

  const post = await getVAQueuePost(postId)
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  // Override videoUrl in case the Sanity CDN hasn't propagated the write yet
  if (videoUrl) {
    post.videoUrl = videoUrl
    if (videoThumbnailUrl) post.videoThumbnailUrl = videoThumbnailUrl
  }

  if (!['media_ready', 'publish_failed'].includes(post.workflowStatus ?? '')) {
    return NextResponse.json(
      { error: `Post is not ready to publish (status: ${post.workflowStatus})` },
      { status: 400 },
    )
  }

  const result = await publishPostToAll(post, socialCopy)

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    facebook: result.facebook,
    facebookReel: result.facebookReel,
    youtube: result.youtube,
    tiktok: result.tiktok,
    linkedin: result.linkedin,
    twitter: result.twitter,
    instagram: result.instagram,
  })
}
