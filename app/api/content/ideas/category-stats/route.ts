import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/client'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const posts = await client.fetch<{ category: string | null }[]>(
      `*[_type == "blogPost" && workflowStatus == "published"]{ category }`
    )

    const counts: Record<string, number> = {}
    for (const post of posts) {
      const cat = post.category ?? 'uncategorized'
      counts[cat] = (counts[cat] ?? 0) + 1
    }

    return NextResponse.json(counts)
  } catch (err) {
    console.error('[GET /api/content/ideas/category-stats]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
