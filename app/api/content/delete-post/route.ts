import { NextResponse } from 'next/server'
import { getSanityWriteClient } from '@/lib/sanity-write'

export const dynamic = 'force-dynamic'

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId } = await request.json()
  if (!postId) return NextResponse.json({ error: 'postId is required' }, { status: 400 })

  const client = getSanityWriteClient()
  await client.delete(postId)

  return NextResponse.json({ ok: true })
}
