/**
 * lib/refresh-config.ts
 *
 * All configuration for the content refresh subsystem.
 * Tune thresholds here — no other files need to change for most adjustments.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type RefreshTier =
  | 'evergreen'
  | 'pillar'
  | 'competitive'
  | 'fast-changing'
  | 'seasonal'
  | 'news-trend'
  | 'money-page'

export type RefreshAction =
  | 'do-not-touch'
  | 'review-only'
  | 'light-refresh'
  | 'full-refresh'

// ─── Main config object ────────────────────────────────────────────────────────

export const REFRESH_CONFIG = {
  // Minimum post age before it can enter the refresh queue at all
  minAgeDays: 90,

  // Maximum candidates stored in the refresh queue at one time
  maxCandidatesPerRun: 20,

  // Cadences in days: firstReview = initial review window, subsequent = after each refresh
  cadences: {
    'evergreen':     { firstReview: 120, subsequent: 365 },
    'pillar':        { firstReview: 90,  subsequent: 180 },
    'competitive':   { firstReview: 90,  subsequent: 180 },
    'fast-changing': { firstReview: 30,  subsequent: 90  },
    'seasonal':      { firstReview: 60,  subsequent: 365 }, // lead time before peak
    'news-trend':    { firstReview: 30,  subsequent: 90  },
    'money-page':    { firstReview: 60,  subsequent: 120 },
  } as Record<RefreshTier, { firstReview: number; subsequent: number }>,

  // Auto-assign tier from post category when refreshTier is not set in Sanity
  categoryToTier: {
    'market-update':       'fast-changing',
    'news':                'news-trend',
    'buying-tips':         'competitive',
    'selling-tips':        'competitive',
    'cost-breakdown':      'fast-changing',
    'community-spotlight': 'evergreen',
    'investment':          'competitive',
    'flood-and-risk':      'competitive',
  } as Record<string, RefreshTier>,

  // Default tier when category doesn't map to one
  defaultTier: 'competitive' as RefreshTier,

  // Scoring weights (must sum to 100 when GA4 is absent)
  scoring: {
    overdue:     30,  // how far past scheduled review date
    volatility:  20,  // topic volatility based on tier
    importance:  15,  // category business importance
    age:         15,  // raw age of content
    seasonal:    20,  // seasonal relevance window bonus
  },

  // Volatility score per tier (max = scoring.volatility)
  volatilityByTier: {
    'news-trend':    20,
    'fast-changing': 18,
    'competitive':   15,
    'money-page':    15,
    'pillar':        10,
    'seasonal':      12,
    'evergreen':     5,
  } as Record<RefreshTier, number>,

  // Category importance score (max = scoring.importance = 15)
  importanceByCategory: {
    'cost-breakdown':      15,
    'money-page':          15,
    'buying-tips':         13,
    'selling-tips':        12,
    'investment':          11,
    'flood-and-risk':      11,
    'community-spotlight': 10,
    'market-update':       9,
    'news':                6,
  } as Record<string, number>,

  // Default importance for unmapped categories
  defaultImportance: 8,

  // Action thresholds (priority score → recommended action)
  actionThresholds: {
    fullRefresh:   75,
    lightRefresh:  45,
    reviewOnly:    20,
  },

  // Seasonal keywords: if any match the post title/category, seasonal bonus applies
  // when the corresponding calendar months are within 60 days
  seasonalKeywords: [
    { keywords: ['pcs', 'military', 'base', 'relocation'], peakMonths: [3, 4, 5, 6] },     // PCS season spring/summer
    { keywords: ['flood', 'hurricane', 'storm', 'surge'], peakMonths: [6, 7, 8, 9, 10] }, // hurricane season
    { keywords: ['school', 'family', 'district'],         peakMonths: [5, 6, 7] },          // pre-school-year buying
    { keywords: ['tax', 'year-end', 'investment'],        peakMonths: [10, 11, 12] },        // year-end planning
    { keywords: ['spring', 'selling season'],             peakMonths: [2, 3, 4] },           // spring market
  ],

  // Seasonal lead time in days — how far ahead of peak month to surface the post
  seasonalLeadDays: 60,

  // Posts with these slugs are never auto-refreshed regardless of settings
  // (add slugs here for manually curated content)
  excludedSlugs: [] as string[],
} as const
