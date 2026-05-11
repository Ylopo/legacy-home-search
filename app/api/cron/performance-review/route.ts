import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { fetchBlogGA4Data } from '@/lib/ga4'
import { getSocialDashboardPosts } from '@/sanity/queries'
import { getYouTubeOverview } from '@/lib/youtube-client'
import { getFacebookOverview } from '@/lib/facebook-client'
import { setPerformanceWeights, type PerformanceWeights, type CategoryBreakdownEntry } from '@/lib/idea-store'
import { sendPerformanceReviewEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

async function safe<T>(label: string, fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn()
  } catch (e: any) {
    console.error(`[performance-review] ${label}:`, e?.message ?? e)
    return null
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const secret = body?.secret ?? new URL(request.url).searchParams.get('secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return runReview()
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return runReview()
}

async function runReview() {
  const now = new Date()
  const periodEnd = now.toISOString().slice(0, 10)
  const periodStartDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
  const periodStart = periodStartDate.toISOString().slice(0, 10)

  const [ga4Map, posts, ytOverview, fbOverview] = await Promise.all([
    safe('GA4', () => fetchBlogGA4Data()),
    safe('Sanity', () => getSocialDashboardPosts()),
    safe('YouTube', () => getYouTubeOverview()),
    safe('Facebook', () => getFacebookOverview()),
  ])

  const allPosts = posts ?? []

  // ── Category performance: join GA4 pageviews with Sanity post categories ──────
  const categoryStats: Record<string, { totalViews: number; count: number }> = {}
  const topPostsRaw: { title: string; category: string; pageViews: number; slug: string }[] = []

  for (const post of allPosts) {
    if (!post.slug || !post.category) continue
    const slug = post.slug as string
    const pageViews = ga4Map?.get(slug)?.pageViews ?? 0
    const cat = post.category as string

    if (!categoryStats[cat]) categoryStats[cat] = { totalViews: 0, count: 0 }
    categoryStats[cat].totalViews += pageViews
    categoryStats[cat].count += 1

    if (pageViews > 0) {
      topPostsRaw.push({ title: post.title ?? '', category: cat, pageViews, slug })
    }
  }

  topPostsRaw.sort((a, b) => b.pageViews - a.pageViews)
  const topPosts = topPostsRaw.slice(0, 5)

  // ── Compute per-category avg and multipliers ──────────────────────────────────
  const categories = Object.entries(categoryStats)
  const totalViews = categories.reduce((s, [, v]) => s + v.totalViews, 0)
  const totalPosts = categories.reduce((s, [, v]) => s + v.count, 0)
  const overallAvg = totalPosts > 0 ? totalViews / totalPosts : 0

  const categoryBreakdown: CategoryBreakdownEntry[] = categories
    .filter(([, v]) => v.count >= 2)
    .map(([category, v]) => {
      const avgPageViews = v.count > 0 ? Math.round(v.totalViews / v.count) : 0
      const rawMultiplier = overallAvg > 0 ? avgPageViews / overallAvg : 1
      const weightMultiplier = Math.min(1.5, Math.max(0.7, Math.round(rawMultiplier * 10) / 10))
      return { category, avgPageViews, postsAnalyzed: v.count, weightMultiplier }
    })
    .sort((a, b) => b.avgPageViews - a.avgPageViews)

  const weights: Record<string, number> = {}
  for (const entry of categoryBreakdown) {
    weights[entry.category] = entry.weightMultiplier
  }

  // ── Ask Claude to generate plain-English insights ─────────────────────────────
  const nextPeriodFocus = categoryBreakdown
    .filter((e) => e.weightMultiplier >= 1.2)
    .map((e) => e.category)
    .slice(0, 3)

  let insights = 'Performance data has been collected and category weights updated.'

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  if (categoryBreakdown.length > 0) {
    try {
      const breakdownSummary = categoryBreakdown
        .map((e) => `${e.category}: avg ${e.avgPageViews} views (${e.postsAnalyzed} posts, multiplier ${e.weightMultiplier}x)`)
        .join('\n')

      const topPostsSummary = topPosts
        .slice(0, 3)
        .map((p) => `"${p.title}" [${p.category}] — ${p.pageViews} views`)
        .join('\n')

      const insightRes = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `You are the content strategist for Legacy Home Team LPT in Hampton Roads, VA. Write 3-4 sentences analyzing this bi-weekly content performance. Be specific and actionable. Do not use bullet points or headers — write in plain flowing sentences.

Category performance (avg pageviews per post):
${breakdownSummary}

Top posts:
${topPostsSummary}

Overall average: ${Math.round(overallAvg)} views/post
YouTube views (recent): ${ytOverview?.recentViews ?? 'N/A'}
Facebook reach (28d): ${fbOverview?.page?.reach28d ?? 'N/A'}

Write the insights paragraph now:`,
        }],
      })

      if (insightRes.content[0].type === 'text') {
        insights = insightRes.content[0].text.trim()
      }
    } catch (e: any) {
      console.error('[performance-review] Claude insights failed:', e?.message)
    }
  }

  // ── Store to Redis ─────────────────────────────────────────────────────────────
  const performanceWeights: PerformanceWeights = {
    updatedAt: now.toISOString(),
    weights,
    insights,
    topPosts,
    nextPeriodFocus,
    categoryBreakdown,
  }

  await setPerformanceWeights(performanceWeights)

  // ── Count posts published in this period ──────────────────────────────────────
  const postsPublishedCount = allPosts.filter((p) => {
    if (!p.publishedAt) return false
    const d = new Date(p.publishedAt)
    return d >= periodStartDate && d <= now
  }).length

  const estimatedReach =
    (fbOverview?.page?.reach28d ?? 0) + (ytOverview?.recentViews ?? 0)

  // ── Send email ────────────────────────────────────────────────────────────────
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://legacyhometeamlpt.com').replace(/\/+$/, '')
  const adminSecret = process.env.ADMIN_SECRET ?? ''

  let emailSent = false
  try {
    await sendPerformanceReviewEmail({
      periodStart,
      periodEnd,
      postsPublishedCount,
      estimatedReach,
      weights: performanceWeights,
      youtubeViews: ytOverview?.recentViews ?? 0,
      facebookReach: fbOverview?.page?.reach28d ?? 0,
      analyticsUrl: `${appUrl}/admin/analytics?secret=${encodeURIComponent(adminSecret)}`,
    })
    emailSent = true
  } catch (e: any) {
    console.error('[performance-review] email failed:', e?.message)
  }

  console.log(`[performance-review] done — ${categoryBreakdown.length} categories, emailSent=${emailSent}`)

  return NextResponse.json({
    ok: true,
    categoriesAnalyzed: categoryBreakdown.length,
    topPosts: topPosts.length,
    emailSent,
    periodStart,
    periodEnd,
  })
}
