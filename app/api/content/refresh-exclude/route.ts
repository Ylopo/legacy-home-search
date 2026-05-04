import { NextResponse } from 'next/server'
import { getSanityWriteClient } from '@/lib/sanity-write'
import { removeFromQueue } from '@/lib/refresh-store'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  if (body.secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId } = body
  if (!postId) {
    return NextResponse.json({ error: 'Missing postId' }, { status: 400 })
  }

  const writeClient = getSanityWriteClient()
  await writeClient.patch(postId).set({ refreshExcluded: true }).commit()
  await removeFromQueue(postId)

  return NextResponse.json({ success: true })
}
