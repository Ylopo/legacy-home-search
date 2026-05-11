import { NextResponse } from 'next/server'
import { markFHReviewed } from '@/lib/fair-housing'

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId } = await request.json().catch(() => ({}))
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 })

  await markFHReviewed(postId)
  return NextResponse.json({ ok: true })
}
