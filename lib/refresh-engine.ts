/**
 * lib/refresh-engine.ts
 *
 * Core logic for the content refresh subsystem:
 *   - Classify a post's refresh tier (from Sanity field or auto-detected from category)
 *   - Compute a priority score (0–100)
 *   - Determine the recommended action (full-refresh / light-refresh / review-only / do-not-touch)
 *   - Generate a deterministic playbook (no LLM at evaluation time)
 *   - Build the full refresh queue from a list of published posts
 */

import {
  REFRESH_CONFIG,
  type RefreshTier,
  type RefreshAction,
} from './refresh-config'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PostSummary {
  _id: string
  title: string
  slug: string
  category: string
  publishedAt: string
  lastRefreshedAt?: string
  refreshTier?: string
  refreshExcluded?: boolean
  refreshCount?: number
}

export interface RefreshCandidate {
  postId: string
  title: string
  slug: string
  category: string
  publishedAt: string
  lastRefreshedAt?: string
  refreshTier: RefreshTier
  ageInDays: number
  daysSinceLastRefresh: number
  nextReviewDate: string
  daysUntilDue: number       // negative = overdue
  isOverdue: boolean
  priorityScore: number
  recommendedAction: RefreshAction
  refreshReasons: string[]
  playbook: string[]
  refreshCount: number
}

// GA4 extension point — stubbed, not wired. When GA4 API is available,
// pass this data into buildRefreshQueue() to enable traffic-based scoring.
export interface GA4PostData {
  slug: string
  sessions7d: number
  sessionsTrend: number    // positive = growing, negative = declining (e.g. -0.15 = 15% drop)
  avgPosition?: number     // search ranking average position (lower = better)
}

// ─── Classify ─────────────────────────────────────────────────────────────────

export function classifyPost(post: PostSummary): RefreshTier {
  if (post.refreshTier && post.refreshTier in REFRESH_CONFIG.cadences) {
    return post.refreshTier as RefreshTier
  }
  return (
    REFRESH_CONFIG.categoryToTier[post.category] ?? REFRESH_CONFIG.defaultTier
  )
}

// ─── Compute next review date ─────────────────────────────────────────────────

function computeNextReviewDate(post: PostSummary, tier: RefreshTier): Date {
  const cadence = REFRESH_CONFIG.cadences[tier]
  const baseline = post.lastRefreshedAt ?? post.publishedAt
  const baseDate = new Date(baseline)
  const windowDays = post.lastRefreshedAt
    ? cadence.subsequent
    : cadence.firstReview
  return new Date(baseDate.getTime() + windowDays * 24 * 60 * 60 * 1000)
}

// ─── Score components ─────────────────────────────────────────────────────────

function overdueScore(daysOverdue: number): number {
  if (daysOverdue <= 0) return 0
  if (daysOverdue <= 30) return Math.round((daysOverdue / 30) * 15)
  if (daysOverdue <= 90) return 15 + Math.round(((daysOverdue - 30) / 60) * 10)
  return REFRESH_CONFIG.scoring.overdue // max 30
}

function volatilityScore(tier: RefreshTier): number {
  return REFRESH_CONFIG.volatilityByTier[tier] ?? 10
}

function importanceScore(category: string): number {
  return (
    REFRESH_CONFIG.importanceByCategory[category] ??
    REFRESH_CONFIG.defaultImportance
  )
}

function ageScore(ageInDays: number): number {
  if (ageInDays < 90) return 0
  if (ageInDays < 180) return 5
  if (ageInDays < 365) return 10
  return REFRESH_CONFIG.scoring.age // max 15
}

function seasonalScore(post: PostSummary): number {
  const now = new Date()
  const titleLower = post.title.toLowerCase()
  const categoryLower = post.category.toLowerCase()
  const combined = `${titleLower} ${categoryLower}`

  for (const rule of REFRESH_CONFIG.seasonalKeywords) {
    const matches = rule.keywords.some((kw) => combined.includes(kw))
    if (!matches) continue

    // Check if any peak month is within the seasonal lead window
    const leadDays = REFRESH_CONFIG.seasonalLeadDays
    for (const peakMonth of rule.peakMonths) {
      // Build the next occurrence of this month
      let peakYear = now.getFullYear()
      const peakDate = new Date(peakYear, peakMonth - 1, 1)
      if (peakDate < now) {
        peakDate.setFullYear(peakYear + 1)
      }
      const daysToPeak = Math.floor(
        (peakDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
      )
      if (daysToPeak >= 0 && daysToPeak <= leadDays) {
        // Scale: full score at 0 days to peak, half score at leadDays
        const ratio = 1 - daysToPeak / leadDays
        return Math.round(REFRESH_CONFIG.scoring.seasonal * (0.5 + ratio * 0.5))
      }
    }
  }
  return 0
}

// ─── Compute priority score ───────────────────────────────────────────────────

export function computeScore(
  post: PostSummary,
  tier: RefreshTier,
  ageInDays: number,
  daysOverdue: number,
  ga4Data?: GA4PostData,
): number {
  let score = 0
  score += overdueScore(daysOverdue)
  score += volatilityScore(tier)
  score += importanceScore(post.category)
  score += ageScore(ageInDays)
  score += seasonalScore(post)

  // GA4 bonus — stubbed; add up to +30 when wired
  if (ga4Data) {
    if (ga4Data.sessionsTrend < -0.1) {
      score += Math.min(15, Math.round(Math.abs(ga4Data.sessionsTrend) * 50))
    }
    if (ga4Data.avgPosition !== undefined && ga4Data.avgPosition >= 4 && ga4Data.avgPosition <= 15) {
      score += 10
    }
  }

  return Math.min(100, score)
}

// ─── Determine action ─────────────────────────────────────────────────────────

export function determineAction(score: number, ageInDays: number): RefreshAction {
  if (ageInDays < REFRESH_CONFIG.minAgeDays) return 'do-not-touch'
  if (score >= REFRESH_CONFIG.actionThresholds.fullRefresh) return 'full-refresh'
  if (score >= REFRESH_CONFIG.actionThresholds.lightRefresh) return 'light-refresh'
  if (score >= REFRESH_CONFIG.actionThresholds.reviewOnly) return 'review-only'
  return 'do-not-touch'
}

// ─── Build refresh reasons ────────────────────────────────────────────────────

function buildReasons(
  post: PostSummary,
  tier: RefreshTier,
  ageInDays: number,
  daysOverdue: number,
  seasonalBonus: number,
): string[] {
  const reasons: string[] = []

  if (daysOverdue > 0) {
    reasons.push(`${daysOverdue} day${daysOverdue === 1 ? '' : 's'} overdue for scheduled review`)
  } else if (daysOverdue > -30) {
    reasons.push(`Review due in ${Math.abs(daysOverdue)} day${Math.abs(daysOverdue) === 1 ? '' : 's'}`)
  }

  const tierLabels: Record<RefreshTier, string> = {
    'fast-changing': 'Fast-changing category — stats and data decay quickly',
    'news-trend':    'News/trend content — may be superseded by newer developments',
    'competitive':   'Competitive topic — competitors may have fresher content',
    'money-page':    'High-value money page — important to keep accurate and current',
    'pillar':        'Pillar content — periodic review ensures continued authority',
    'seasonal':      'Seasonal content — timing-sensitive',
    'evergreen':     'Evergreen content — periodic review for continued relevance',
  }
  reasons.push(tierLabels[tier])

  if (ageInDays >= 365) {
    reasons.push(`${Math.floor(ageInDays / 365)} year${Math.floor(ageInDays / 365) > 1 ? 's' : ''} old — likely contains outdated year references`)
  } else if (ageInDays >= 180) {
    reasons.push(`${Math.floor(ageInDays / 30)} months old`)
  }

  if (seasonalBonus > 0) {
    reasons.push('Seasonal relevance window approaching')
  }

  if ((post.refreshCount ?? 0) === 0) {
    reasons.push('Never been refreshed')
  }

  return reasons
}

// ─── Generate playbook ────────────────────────────────────────────────────────

export function generatePlaybook(
  post: PostSummary,
  action: RefreshAction,
): string[] {
  if (action === 'do-not-touch' || action === 'review-only') {
    return [
      'Re-check current search intent — what does the SERP show for this post\'s primary keyword?',
      'Scan for obviously outdated year references (e.g., 2024 in title or body)',
      'Check if any linked sources have moved or become unavailable',
    ]
  }

  const items: string[] = [
    'Re-check current search intent — what does the SERP show for this post\'s primary keyword?',
    'Update all statistics, data, and pricing to current figures',
    'Replace year references in title and body (e.g., 2024 → 2026)',
    'Verify all external links still resolve and point to current, authoritative sources',
  ]

  // Category-specific items
  if (post.category === 'cost-breakdown') {
    items.push('Refresh closing cost figures — verify against current Virginia market rates')
    items.push('Update property tax data and HOA fee ranges for Hampton Roads')
  }
  if (post.category === 'market-update' || post.category === 'news') {
    items.push('Check whether the underlying market data has been superseded by newer reports')
    items.push('Update or replace any time-stamped statistics with the latest available figures')
  }
  if (post.category === 'buying-tips' || post.category === 'selling-tips') {
    items.push('Verify all regulatory and legal references are current (Virginia law, VHDA, etc.)')
    items.push('Add or update the FAQ section to address current buyer/seller concerns')
  }
  if (post.category === 'flood-and-risk') {
    items.push('Check FEMA flood zone map for any remapping updates affecting Hampton Roads')
    items.push('Verify flood insurance premium figures are current (NFIP rate changes)')
  }
  if (post.category === 'investment') {
    items.push('Update cap rate and rental yield figures for Hampton Roads submarkets')
  }

  if (action === 'full-refresh') {
    items.push('Expand any sections that are thin compared to what top-ranking competitors cover')
    items.push('Strengthen H1/H2 structure if search intent has evolved')
    items.push('Review and improve internal links — add 2–3 links to newer relevant posts')
    items.push('Update the CTA to reflect current offers and messaging')
    items.push('Freshen the opening paragraph with a current Hampton Roads hook or data point')
  }

  return items
}

// ─── Build refresh queue ──────────────────────────────────────────────────────

export function buildRefreshQueue(
  posts: PostSummary[],
  skippedIds: Set<string>,
  ga4Data?: Map<string, GA4PostData>,
): RefreshCandidate[] {
  const now = new Date()
  const candidates: RefreshCandidate[] = []

  for (const post of posts) {
    // Permanent exclusions
    if (post.refreshExcluded) continue
    if (REFRESH_CONFIG.excludedSlugs.includes(post.slug)) continue
    if (skippedIds.has(post._id)) continue

    const publishedDate = new Date(post.publishedAt)
    const ageInDays = Math.floor(
      (now.getTime() - publishedDate.getTime()) / (24 * 60 * 60 * 1000)
    )

    if (ageInDays < REFRESH_CONFIG.minAgeDays) continue

    const tier = classifyPost(post)
    const nextReviewDate = computeNextReviewDate(post, tier)
    const daysUntilDue = Math.floor(
      (nextReviewDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)
    )
    const daysOverdue = -daysUntilDue
    const isOverdue = daysUntilDue < 0

    const daysSinceLastRefresh = post.lastRefreshedAt
      ? Math.floor(
          (now.getTime() - new Date(post.lastRefreshedAt).getTime()) /
            (24 * 60 * 60 * 1000)
        )
      : ageInDays

    const ga4 = ga4Data?.get(post.slug)
    const score = computeScore(post, tier, ageInDays, daysOverdue, ga4)
    const action = determineAction(score, ageInDays)

    if (action === 'do-not-touch') continue

    const sBonus = seasonalScore(post)
    const reasons = buildReasons(post, tier, ageInDays, daysOverdue, sBonus)
    const playbook = generatePlaybook(post, action)

    candidates.push({
      postId: post._id,
      title: post.title,
      slug: post.slug,
      category: post.category,
      publishedAt: post.publishedAt,
      lastRefreshedAt: post.lastRefreshedAt,
      refreshTier: tier,
      ageInDays,
      daysSinceLastRefresh,
      nextReviewDate: nextReviewDate.toISOString(),
      daysUntilDue,
      isOverdue,
      priorityScore: score,
      recommendedAction: action,
      refreshReasons: reasons,
      playbook,
      refreshCount: post.refreshCount ?? 0,
    })
  }

  // Sort by priority score descending, take top N
  return candidates
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, REFRESH_CONFIG.maxCandidatesPerRun)
}
