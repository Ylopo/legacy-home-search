import { NextResponse } from 'next/server'
import { getFHResult } from '@/lib/fair-housing'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const postIds = (searchParams.get('postIds') ?? '').split(',').filter(Boolean)
  if (postIds.length === 0) {
    return NextResponse.json({})
  }

  const results = await Promise.all(
    postIds.map(async (id) => {
      const result = await getFHResult(id).catch(() => null)
      return [id, result] as const
    })
  )

  const map: Record<string, any> = {}
  for (const [id, result] of results) {
    if (result) map[id] = result
  }

  return NextResponse.json(map)
}
