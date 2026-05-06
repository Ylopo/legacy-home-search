import { NextResponse } from 'next/server'
import { getScheduledPostsDue, getVAQueuePost } from '@/sanity/queries'
import { publishPostToAll } from '@/lib/publish-service'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date().toISOString()
  const duePosts = await getScheduledPostsDue(now)

  if (duePosts.length === 0) {
    return NextResponse.json({ published: 0, failed: 0 })
  }

  let published = 0
  let failed = 0

  for (const stub of duePosts) {
    try {
      const post = await getVAQueuePost(stub._id)
      if (!post) { failed++; continue }

      const result = await publishPostToAll(post, undefined, stub.scheduledPublishAt)
      if (result.ok) {
        published++
        console.log(`[scheduled-publish] Published: ${post.title}`)
      } else {
        failed++
        console.error(`[scheduled-publish] Failed: ${post.title} — ${result.error}`)
      }
    } catch (e) {
      failed++
      console.error(`[scheduled-publish] Error on ${stub._id}:`, e instanceof Error ? e.message : e)
    }
  }

  return NextResponse.json({ published, failed, total: duePosts.length })
}
