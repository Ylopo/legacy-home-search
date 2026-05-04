import { NextResponse } from 'next/server'
import { getRefreshQueue } from '@/lib/refresh-store'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const candidates = await getRefreshQueue()
  return NextResponse.json({ candidates })
}
