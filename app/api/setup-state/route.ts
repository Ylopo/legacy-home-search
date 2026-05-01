import { NextResponse } from 'next/server'
import { getStepStates, setStepState } from '@/lib/setup-state'

export const dynamic = 'force-dynamic'

function authorized(req: Request) {
  const url = new URL(req.url)
  return url.searchParams.get('secret') === process.env.ADMIN_SECRET
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const setupId = new URL(request.url).searchParams.get('setupId') ?? ''
  if (!setupId) return NextResponse.json({ error: 'Missing setupId' }, { status: 400 })
  const states = await getStepStates(setupId)
  return NextResponse.json({ states })
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await request.json().catch(() => ({}))
  const { setupId, stepId, done } = body as { setupId?: string; stepId?: string; done?: boolean }
  if (!setupId || !stepId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const states = await setStepState(setupId, stepId, !!done)
  return NextResponse.json({ states })
}
