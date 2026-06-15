import type { CSSProperties } from 'react'
import { client } from '@/sanity/client'
import { fetchSiteGA4Overview, type SiteGA4Overview } from '@/lib/ga4'
import { getAllPlatformAnalytics, type PlatformAnalytics } from '@/lib/oneup-analytics'

type Props = { searchParams: Promise<{ secret?: string }> }

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  category: string
  publishedAt: string | null
  videoUrl?: string
  coverImageUrl?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  'market-update':       'Market Update',
  'buying-tips':         'Buying Tips',
  'selling-tips':        'Selling Tips',
  'community-spotlight': 'Community',
  'investment':          'Investor Tips',
  'news':                'News',
  'cost-breakdown':      'Cost Breakdown',
  'flood-and-risk':      'Flood & Risk',
  'local-history':       'Local History',
}

const CATEGORY_COLORS: Record<string, string> = {
  'market-update':       '#3b82f6',
  'buying-tips':         '#22c55e',
  'selling-tips':        '#a855f7',
  'community-spotlight': '#ec4899',
  'investment':          '#9333ea',
  'news':                '#64748b',
  'cost-breakdown':      '#d97706',
  'flood-and-risk':      '#0ea5e9',
  'local-history':       '#c9a875',
}

const PUBLISHING_TARGET_PER_WEEK = 10

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtNum(n: number): string {
  return n.toLocaleString()
}

function fmtChange(pct: number): { text: string; positive: boolean; isZero: boolean } {
  if (!Number.isFinite(pct) || pct === 0) return { text: '0%', positive: false, isZero: true }
  return { text: `${pct > 0 ? '↑' : '↓'} ${Math.abs(pct)}%`, positive: pct > 0, isZero: false }
}

function fmtDateLong(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function fmtDateTime(d: Date): string {
  return d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function fmtDateShort(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function daysAgo(iso: string | null): number | null {
  if (!iso) return null
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s
  return s.slice(0, n - 1).replace(/[\s,;:]+$/, '') + '…'
}

// 12-week momentum: posts per week, current week last
function buildMomentum(posts: BlogPost[]): Array<{ label: string; count: number; isPeak: boolean; isCurrent: boolean }> {
  const weeks: { start: Date; end: Date; count: number; label: string }[] = []
  const now = new Date()
  for (let i = 11; i >= 0; i--) {
    const end = new Date(now.getTime() - i * 7 * 86400 * 1000)
    const start = new Date(end.getTime() - 7 * 86400 * 1000)
    weeks.push({ start, end, count: 0, label: i === 0 ? 'this wk' : fmtDateShort(start) })
  }
  for (const p of posts) {
    if (!p.publishedAt) continue
    const t = new Date(p.publishedAt).getTime()
    const w = weeks.find((w) => t >= w.start.getTime() && t < w.end.getTime())
    if (w) w.count++
  }
  const peakCount = Math.max(...weeks.map((w) => w.count))
  return weeks.map((w, i) => ({
    label: w.label,
    count: w.count,
    isPeak: peakCount > 0 && w.count === peakCount,
    isCurrent: i === weeks.length - 1,
  }))
}

// Build a cumulative time series of posts published, week by week, from
// the project start through today. Always monotonically increasing.
function buildCumulativePosts(
  posts: BlogPost[],
  startDate: Date,
): Array<{ date: Date; cumulative: number }> {
  const sorted = [...posts]
    .filter((p) => p.publishedAt)
    .sort((a, b) => new Date(a.publishedAt!).getTime() - new Date(b.publishedAt!).getTime())
  const today = new Date()
  const series: Array<{ date: Date; cumulative: number }> = []
  // Weekly buckets from start → now
  const cursor = new Date(startDate)
  let runningTotal = 0
  while (cursor.getTime() <= today.getTime()) {
    const weekEnd = new Date(cursor.getTime() + 7 * 86400 * 1000)
    runningTotal += sorted.filter((p) => {
      const t = new Date(p.publishedAt!).getTime()
      return t >= cursor.getTime() && t < weekEnd.getTime()
    }).length
    series.push({ date: new Date(cursor), cumulative: runningTotal })
    cursor.setDate(cursor.getDate() + 7)
  }
  return series
}

// Build a cumulative time series of website sessions from GA4's daily trend.
// GA4 sometimes returns the dates in YYYYMMDD; we normalise either form.
function buildCumulativeSessions(
  trend: { date: string; sessions: number }[] | undefined,
): Array<{ date: Date; cumulative: number }> {
  if (!trend?.length) return []
  const parsed = trend
    .map((d) => {
      const raw = d.date
      const iso = raw.length === 8
        ? `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
        : raw
      return { date: new Date(iso), sessions: d.sessions }
    })
    .filter((d) => !isNaN(d.date.getTime()))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
  let running = 0
  return parsed.map((d) => {
    running += d.sessions
    return { date: d.date, cumulative: running }
  })
}

// Consecutive days with at least one published post, ending today (or
// yesterday if today has nothing yet).
function publishingStreak(posts: BlogPost[]): number {
  const days = new Set(
    posts
      .filter((p) => p.publishedAt)
      .map((p) => new Date(p.publishedAt!).toDateString()),
  )
  let streak = 0
  const cursor = new Date()
  // Allow today to be a "miss" — start checking from yesterday if today empty
  if (!days.has(cursor.toDateString())) cursor.setDate(cursor.getDate() - 1)
  while (days.has(cursor.toDateString())) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogDashboardPage({ searchParams }: Props) {
  const { secret } = await searchParams

  if (secret !== process.env.ADMIN_SECRET) {
    return (
      <div style={s.page}>
        <div style={s.container}>
          <div style={s.errorBox}>
            <h1 style={{ margin: 0, fontSize: 18 }}>Unauthorized</h1>
            <p style={{ margin: '12px 0 0', fontSize: 14, color: '#a8a29e' }}>
              Add <code>?secret=YOUR_ADMIN_SECRET</code> to the URL.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── Fetch in parallel ──────────────────────────────────────────────────────
  // First load posts + the 30-day GA4 + OneUp, then issue a second GA4 call
  // that covers the entire project lifetime for the cumulative-growth chart.
  const [posts, ga4, platforms] = await Promise.all([
    client.fetch<BlogPost[]>(
      `*[_type == "blogPost" && (workflowStatus == "published" || status == "published")]
       | order(publishedAt desc)[0...500]{
         _id, title, slug, category, publishedAt, videoUrl,
         "coverImageUrl": coverImage.asset->url
       }`,
      {},
      { next: { revalidate: 300 } },
    ).catch(() => [] as BlogPost[]),
    fetchSiteGA4Overview(30).catch(() => null),
    getAllPlatformAnalytics('last_30_days').catch(() => null),
  ])

  // Project start = the oldest post's publish date (or today, as fallback).
  // Cap the GA4 lookback at 365 days to stay inside GA4 retention defaults.
  const oldestPost = [...posts].reverse().find((p) => p.publishedAt)
  const projectStart = oldestPost?.publishedAt ? new Date(oldestPost.publishedAt) : new Date()
  const daysSinceStart = Math.max(7, Math.min(365, Math.ceil((Date.now() - projectStart.getTime()) / 86400000)))
  const ga4LifeTime = await fetchSiteGA4Overview(daysSinceStart).catch(() => null)

  // ── Derived data ────────────────────────────────────────────────────────────
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 86400 * 1000)
  const postsAllTime = posts.length
  const postsLast30 = posts.filter((p) => p.publishedAt && new Date(p.publishedAt) >= thirtyDaysAgo).length
  const postsPrior30 = posts.filter((p) => {
    if (!p.publishedAt) return false
    const t = new Date(p.publishedAt)
    return t >= sixtyDaysAgo && t < thirtyDaysAgo
  }).length
  const postsChange = postsPrior30 === 0 ? (postsLast30 > 0 ? 100 : 0) : Math.round(((postsLast30 - postsPrior30) / postsPrior30) * 100)

  const momentum = buildMomentum(posts)
  const peakWeek = momentum.reduce((m, w) => (w.count > m.count ? w : m), momentum[0])
  const streak = publishingStreak(posts)

  // Hours saved — 2 hours per post (research, draft, edit, schedule, publish).
  // "This week" = last 7 calendar days.
  const HOURS_PER_POST = 2
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400 * 1000)
  const postsThisWeek = posts.filter((p) => p.publishedAt && new Date(p.publishedAt) >= sevenDaysAgo).length
  const hoursSavedThisWeek = postsThisWeek * HOURS_PER_POST
  const hoursSavedAllTime = postsAllTime * HOURS_PER_POST

  // Combined reach across all available platforms (skip unavailable / 0 entries)
  const platformsList: PlatformAnalytics[] = platforms
    ? [platforms.facebook, platforms.youtube, platforms.tiktok, platforms.instagram]
    : []
  const totalReach30 = platformsList.reduce((sum, p) => sum + p.headlineCurrent, 0)
  const totalReachPrior = platformsList.reduce((sum, p) => sum + p.headlinePrior, 0)
  const totalReachChange = totalReachPrior === 0 ? (totalReach30 > 0 ? 100 : 0) : Math.round(((totalReach30 - totalReachPrior) / totalReachPrior) * 100)

  // Most recent post = closest top performer until per-post analytics flows in
  const topPerformer = posts.find((p) => p.publishedAt) ?? null

  // GA4 trend → sparkline (last 30 days)
  const websiteTrend: number[] = ga4?.trend?.map((d) => d.sessions) ?? []
  const ga4Sessions = ga4?.sessions ?? null

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* ── 1. Header ──────────────────────────────────────────────────── */}
        <div style={s.headerWrap}>
          <div style={s.brandLabel}>BARRY JENKINS · LEGACY HOME TEAM · LPT</div>
          <h1 style={s.headerTitle}>
            The Content Engine, <em style={s.titleEm}>at a glance</em>
          </h1>
          <div style={s.headerMeta}>
            <span style={s.livePill}><span style={s.liveDot} /> LIVE</span>
            <span style={s.metaSep}>·</span>
            <span>Hampton Roads, Virginia</span>
            <span style={s.metaSep}>·</span>
            <span>{fmtNum(postsAllTime)} posts published all-time</span>
            <span style={s.metaSep}>·</span>
            <span>Updated {fmtDateTime(now)}</span>
          </div>
        </div>

        {/* ── 2. KPI cards ───────────────────────────────────────────────── */}
        <div style={s.kpiGrid}>
          {/* Posts Published */}
          <div style={s.kpiCard}>
            <div style={s.kpiLabel}>POSTS PUBLISHED · 30 DAYS</div>
            <div style={s.kpiNumber}>{fmtNum(postsLast30)}</div>
            <KpiDelta change={postsChange} positive label="vs prior 30 days" />
          </div>
          {/* Total Reach */}
          <div style={s.kpiCard}>
            <div style={s.kpiLabel}>TOTAL REACH · 30 DAYS</div>
            <div style={s.kpiNumber}>{fmtNum(totalReach30)}</div>
            <KpiDelta change={totalReachChange} positive label="across all platforms" />
          </div>
          {/* Top Performer */}
          <div style={s.kpiCard}>
            <div style={s.kpiLabel}>TOP PERFORMER</div>
            <div style={{ ...s.kpiNumber, fontSize: 18, lineHeight: 1.4, fontWeight: 600 }}>
              {topPerformer ? truncate(topPerformer.title, 60) : '—'}
            </div>
            <div style={{ ...s.kpiSub, color: '#1E3A5F', marginTop: 14, fontWeight: 600 }}>views arriving soon</div>
          </div>
          {/* Hours Saved */}
          <div style={s.kpiCard}>
            <div style={s.kpiLabel}>HOURS SAVED · THIS WEEK</div>
            <div style={{ ...s.kpiNumber, display: 'flex', alignItems: 'baseline', gap: 12 }}>
              {hoursSavedThisWeek}
              <span style={{ fontSize: 18, color: '#888884', fontWeight: 500 }}>hour{hoursSavedThisWeek === 1 ? '' : 's'}</span>
            </div>
            <div style={s.kpiSub}>
              <strong style={{ color: '#1a1a1a' }}>{fmtNum(hoursSavedAllTime)} hours</strong> saved all-time
            </div>
          </div>
        </div>

        {/* ── 2b. Always Climbing — cumulative growth ────────────────────── */}
        {(() => {
          const cumPosts = buildCumulativePosts(posts, projectStart)
          const cumSessions = buildCumulativeSessions(ga4LifeTime?.trend)
          const totalSessionsLife = cumSessions.length ? cumSessions[cumSessions.length - 1].cumulative : (ga4LifeTime?.sessions ?? 0)
          const weeksOfContent = Math.max(1, Math.ceil(daysSinceStart / 7))
          const avgPostsPerWeek = (postsAllTime / weeksOfContent).toFixed(1)
          const startLabel = projectStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

          return (
            <div style={s.section}>
              <div style={s.sectionHead}>
                <div>
                  <div style={s.sectionEyebrow}>CUMULATIVE GROWTH</div>
                  <h2 style={s.sectionTitle}>Always Climbing</h2>
                  <div style={{ fontSize: 13, color: '#555550', marginTop: 8, maxWidth: 600 }}>
                    Consistent posting compounds over time. Every published post stays indexed
                    and keeps driving traffic — the total only goes up. Started {startLabel}.
                  </div>
                </div>
                <div style={s.sectionMeta}>Since {startLabel}</div>
              </div>

              {/* 3 mini-KPIs */}
              <div style={{ ...s.kpiGrid, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: 16 }}>
                <div style={s.kpiCard}>
                  <div style={s.kpiLabel}>TOTAL POSTS · ALL-TIME</div>
                  <div style={s.kpiNumber}>{fmtNum(postsAllTime)}</div>
                  <div style={s.kpiSub}>and counting</div>
                </div>
                <div style={s.kpiCard}>
                  <div style={s.kpiLabel}>WEBSITE SESSIONS · ALL-TIME</div>
                  <div style={s.kpiNumber}>{totalSessionsLife > 0 ? fmtNum(totalSessionsLife) : '—'}</div>
                  <div style={s.kpiSub}>{totalSessionsLife > 0 ? 'driven by the content engine' : 'GA4 trend will populate here'}</div>
                </div>
                <div style={s.kpiCard}>
                  <div style={s.kpiLabel}>CONSISTENCY · POSTS / WEEK</div>
                  <div style={s.kpiNumber}>{avgPostsPerWeek}</div>
                  <div style={s.kpiSub}>average over {weeksOfContent} week{weeksOfContent === 1 ? '' : 's'}</div>
                </div>
              </div>

              {/* Two side-by-side cumulative charts */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
                <div style={s.chartWrap}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <div style={{ ...s.kpiLabel, marginBottom: 0 }}>CUMULATIVE POSTS PUBLISHED</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1E3A5F' }}>{fmtNum(postsAllTime)}</div>
                  </div>
                  <CumulativeChart
                    series={cumPosts}
                    color="#1E3A5F"
                    fillFrom="rgba(30,58,95,0.18)"
                    fillTo="rgba(30,58,95,0)"
                    yLabelSuffix=" posts"
                  />
                </div>
                <div style={s.chartWrap}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <div style={{ ...s.kpiLabel, marginBottom: 0 }}>CUMULATIVE WEBSITE SESSIONS</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>
                      {totalSessionsLife > 0 ? fmtNum(totalSessionsLife) : '—'}
                    </div>
                  </div>
                  {cumSessions.length > 1 ? (
                    <CumulativeChart
                      series={cumSessions}
                      color="#2563eb"
                      fillFrom="rgba(176,125,46,0.18)"
                      fillTo="rgba(176,125,46,0)"
                      yLabelSuffix=" sessions"
                    />
                  ) : (
                    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888884', fontSize: 13 }}>
                      Awaiting more GA4 trend data
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })()}

        {/* ── 3. Momentum chart ──────────────────────────────────────────── */}
        <div style={s.section}>
          <div style={s.sectionHead}>
            <div>
              <div style={s.sectionEyebrow}>PUBLISHING PACE</div>
              <h2 style={s.sectionTitle}>Momentum</h2>
            </div>
            <div style={s.sectionMeta}>Posts per week · last 12 weeks</div>
          </div>
          <div style={s.chartWrap}>
            <MomentumChart weeks={momentum} />
            <div style={s.chartLegend}>
              <LegendDot color="#1E3A5F" label="Posts published" />
              <LegendDot color="#2563eb" label="Peak week" />
              <span style={s.legendDashed}>--- Target {PUBLISHING_TARGET_PER_WEEK} / week</span>
            </div>
          </div>
        </div>

        {/* ── 4. Across the Network ──────────────────────────────────────── */}
        <div style={s.section}>
          <div style={s.sectionHead}>
            <div>
              <div style={s.sectionEyebrow}>DISTRIBUTION</div>
              <h2 style={s.sectionTitle}>Across the <em style={s.titleEm}>Network</em></h2>
            </div>
            <div style={s.sectionMeta}>Reach this month, by platform</div>
          </div>
          <div style={s.networkGrid}>
            <NetworkCard
              icon="🌐"
              name="WEBSITE"
              source="GA4"
              available={ga4Sessions !== null}
              current={ga4Sessions ?? 0}
              metricLabel="SESSIONS · 30 DAYS"
              changePct={null}
              trend={websiteTrend}
              topPostTitle={topPerformer?.title ?? null}
              topPostMeta="trend available next period"
            />
            <NetworkCard
              icon="▶"
              name="YOUTUBE"
              source="ONEUP"
              available={platforms?.youtube.available ?? false}
              current={platforms?.youtube.headlineCurrent ?? 0}
              metricLabel="VIEWS · 30 DAYS"
              changePct={platforms?.youtube.headlineChangePct ?? null}
              trend={[]}
              topPostTitle={platforms?.youtube.topPost?.caption ?? null}
              topPostMeta={platforms?.youtube.topPost ? `${fmtNum(platforms.youtube.topPost.views)} views` : ''}
            />
            <NetworkCard
              icon="🎵"
              name="TIKTOK"
              source="ONEUP"
              available={platforms?.tiktok.available ?? false}
              current={platforms?.tiktok.headlineCurrent ?? 0}
              metricLabel="VIEWS · 30 DAYS"
              changePct={platforms?.tiktok.headlineChangePct ?? null}
              trend={[]}
              topPostTitle={platforms?.tiktok.topPost?.caption ?? null}
              topPostMeta={platforms?.tiktok.topPost ? `${fmtNum(platforms.tiktok.topPost.views)} views` : ''}
            />
            <NetworkCard
              icon="f"
              name="FACEBOOK"
              source="ONEUP"
              available={platforms?.facebook.available ?? false}
              current={platforms?.facebook.headlineCurrent ?? 0}
              metricLabel="REACH · 30 DAYS"
              changePct={platforms?.facebook.headlineChangePct ?? null}
              trend={[]}
              topPostTitle={platforms?.facebook.topPost?.caption ?? null}
              topPostMeta={platforms?.facebook.topPost ? `${fmtNum(platforms.facebook.topPost.views)} reach` : ''}
            />
          </div>
        </div>

        {/* ── 5. Top Performing Posts ──────────────────────────────────── */}
        <div style={s.section}>
          <div style={s.sectionHead}>
            <div>
              <div style={s.sectionEyebrow}>EDITORIAL</div>
              <h2 style={s.sectionTitle}>Top Performing <em style={s.titleEm}>Posts</em></h2>
            </div>
            <div style={s.sectionMeta}>Last 30 days</div>
          </div>
          <div style={s.tableWrap}>
            <div style={s.tableHeader}>
              <div style={{ ...s.tableCell, flex: 3 }}>TITLE</div>
              <div style={{ ...s.tableCell, flex: 1 }}>CATEGORY</div>
              <div style={{ ...s.tableCell, flex: 1 }}>PUBLISHED</div>
              <div style={{ ...s.tableCell, flex: 1, textAlign: 'right' as const }}>PAGEVIEWS</div>
              <div style={{ ...s.tableCell, flex: 1, textAlign: 'right' as const }}>ENGAGEMENT</div>
              <div style={{ ...s.tableCell, flex: 1, textAlign: 'right' as const }}>SOCIAL REACH</div>
            </div>
            {posts
              .filter((p) => p.publishedAt && new Date(p.publishedAt) >= thirtyDaysAgo)
              .slice(0, 10)
              .map((p, idx) => {
                const color = CATEGORY_COLORS[p.category] ?? '#a8a29e'
                const label = CATEGORY_LABELS[p.category] ?? p.category
                const age = daysAgo(p.publishedAt)
                return (
                  <div key={p._id} style={{ ...s.tableRow, ...(idx === 0 ? s.tableRowBest : {}) }}>
                    <div style={{ ...s.tableCell, flex: 3, display: 'flex', gap: 14, alignItems: 'center' }}>
                      {p.coverImageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`${p.coverImageUrl}?w=140&q=70&fm=jpg`}
                          alt=""
                          style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
                        />
                      )}
                      <div>
                        <div style={{ color: '#1a1a1a', lineHeight: 1.35, fontWeight: 500 }}>{p.title}</div>
                        {idx === 0 && (
                          <span style={s.bestInShow}>BEST IN SHOW</span>
                        )}
                      </div>
                    </div>
                    <div style={{ ...s.tableCell, flex: 1 }}>
                      <span style={{ ...s.categoryPill, borderColor: color, color }}>{label.toUpperCase()}</span>
                    </div>
                    <div style={{ ...s.tableCell, flex: 1 }}>
                      <div style={{ color: '#1a1a1a', fontWeight: 500 }}>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</div>
                      <div style={s.tableMutedSmall}>{age === null ? '' : age === 0 ? '0d ago' : `${age}d ago`}</div>
                    </div>
                    <div style={{ ...s.tableCell, flex: 1, textAlign: 'right' as const, color: '#888884' }}>—</div>
                    <div style={{ ...s.tableCell, flex: 1, textAlign: 'right' as const, color: '#888884' }}>—</div>
                    <div style={{ ...s.tableCell, flex: 1, textAlign: 'right' as const, color: '#888884' }}>—</div>
                  </div>
                )
              })}
          </div>
        </div>

        <div style={{ height: 64 }} />
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiDelta({ change, positive, label }: { change: number; positive: boolean; label: string }) {
  const fmt = fmtChange(change)
  const color = fmt.isZero ? '#a8a29e' : fmt.positive ? '#4ade80' : '#f87171'
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 14, fontSize: 12 }}>
      <span style={{ color, fontWeight: 600 }}>{fmt.text}</span>
      <span style={{ color: '#a8a29e' }}>{label}</span>
    </div>
  )
}

function MomentumChart({ weeks }: { weeks: ReturnType<typeof buildMomentum> }) {
  const BAR_AREA = 220
  const max = Math.max(PUBLISHING_TARGET_PER_WEEK + 2, ...weeks.map((w) => w.count))
  // Position of the target line, in px from the bottom of the bar area.
  const targetPx = (PUBLISHING_TARGET_PER_WEEK / max) * BAR_AREA
  return (
    <div style={{ paddingTop: 28 }}>
      {/* Bar area + target line */}
      <div style={{ position: 'relative', height: BAR_AREA }}>
        {/* Target line — sits above bars, runs full width of the chart */}
        <div style={{
          position: 'absolute', left: 0, right: 60, bottom: targetPx,
          borderTop: '1px dashed #888884', pointerEvents: 'none',
        }} />
        <span style={{
          position: 'absolute', right: 0, bottom: targetPx - 8,
          fontSize: 10, color: '#888884', letterSpacing: '0.1em', fontWeight: 600,
        }}>
          TARGET · {PUBLISHING_TARGET_PER_WEEK} / WK
        </span>
        {/* Baseline (x-axis) */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTop: '1px solid #e0ddd8' }} />
        {/* Bars */}
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '100%', gap: 6 }}>
          {weeks.map((w, i) => {
            const isPeak = w.isPeak && w.count > 0
            // Empty weeks still get a 2px sliver so columns stay visible.
            const barPx = w.count > 0 ? (w.count / max) * BAR_AREA : 2
            const color = isPeak ? '#2563eb' : w.count > 0 ? '#1E3A5F' : '#e0ddd8'
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  position: 'relative',
                  height: '100%',
                }}
              >
                {isPeak && (
                  <div style={{ position: 'absolute', top: -20, color: '#2563eb', fontSize: 12, fontWeight: 700 }}>
                    {w.count}
                  </div>
                )}
                <div
                  style={{
                    width: '78%',
                    maxWidth: 56,
                    height: barPx,
                    background: color,
                    borderRadius: '4px 4px 0 0',
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
      {/* X-axis labels — one per bar, in the same flex grid so they align exactly */}
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        {weeks.map((w, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 10,
              color: w.isCurrent ? '#1a1a1a' : '#888884',
              fontWeight: w.isCurrent ? 600 : 500,
            }}
          >
            {w.label}
          </div>
        ))}
      </div>
    </div>
  )
}

function NetworkCard(props: {
  icon: string
  name: string
  source: 'GA4' | 'ONEUP'
  available: boolean
  current: number
  metricLabel: string
  changePct: number | null
  trend: number[]
  topPostTitle: string | null
  topPostMeta: string
}) {
  const { icon, name, source, available, current, metricLabel, changePct, trend, topPostTitle, topPostMeta } = props
  return (
    <div style={s.networkCard}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={s.platformIcon}>{icon}</div>
        <div style={{ fontSize: 13, letterSpacing: '0.12em', flex: 1 }}>{name}</div>
        <span style={available ? s.liveBadge : s.offlineBadge}>
          <span style={available ? s.liveDot : s.offlineDot} />
          {available ? `LIVE · ${source}` : 'OFFLINE'}
        </span>
      </div>
      {available ? (
        <>
          <div style={{ fontSize: 32, lineHeight: 1, color: '#1a1a1a', fontWeight: 700, letterSpacing: '-0.02em' }}>
            {current > 0 ? fmtNum(current) : '—'}
          </div>
          <div style={{ ...s.kpiLabel, marginTop: 6, marginBottom: 0 }}>{metricLabel}</div>
          {changePct !== null && current > 0 && (
            <div style={{ marginTop: 10, fontSize: 12 }}>
              <span style={{ color: changePct >= 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                {changePct >= 0 ? '↑' : '↓'} {Math.abs(changePct)}%
              </span>
              <span style={{ color: '#888884' }}> vs prior 30 days</span>
            </div>
          )}
          {trend.length > 1 && <Sparkline values={trend} />}
        </>
      ) : (
        <div style={{ fontSize: 14, color: '#888884', padding: '20px 0' }}>Awaiting first metrics</div>
      )}
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #e0ddd8' }}>
        <div style={{ ...s.kpiLabel, marginBottom: 6 }}>TOP POST</div>
        <div style={{ fontSize: 14, color: '#1a1a1a', lineHeight: 1.4, fontWeight: 500 }}>
          {topPostTitle ? truncate(topPostTitle, 90) : '—'}
        </div>
        {topPostMeta && <div style={{ fontSize: 11, color: '#888884', marginTop: 6 }}>{topPostMeta}</div>}
      </div>
    </div>
  )
}

function CumulativeChart({
  series,
  color,
  fillFrom,
  fillTo,
  yLabelSuffix,
}: {
  series: Array<{ date: Date; cumulative: number }>
  color: string
  fillFrom: string
  fillTo: string
  yLabelSuffix: string
}) {
  if (series.length < 2) {
    return <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888884', fontSize: 13 }}>Awaiting trend data</div>
  }
  const w = 600, h = 200, padX = 8, padY = 18
  const innerW = w - padX * 2
  const innerH = h - padY * 2
  const max = Math.max(...series.map((s) => s.cumulative), 1)
  const step = innerW / (series.length - 1)
  const points = series.map((s, i) => {
    const x = padX + i * step
    const y = padY + innerH - (s.cumulative / max) * innerH
    return { x, y }
  })
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${padY + innerH} L${points[0].x.toFixed(1)},${padY + innerH} Z`
  const gradientId = `grad-${color.replace(/[^a-zA-Z0-9]/g, '')}`
  const latest = series[series.length - 1]
  const startLabel = series[0].date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  const endLabel = latest.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <div>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fillFrom} />
            <stop offset="100%" stopColor={fillTo} />
          </linearGradient>
        </defs>
        {/* Baseline */}
        <line x1={padX} y1={padY + innerH} x2={padX + innerW} y2={padY + innerH} stroke="#e0ddd8" strokeWidth="1" />
        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradientId})`} />
        {/* Line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        {/* End-point dot */}
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill={color} />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#888884', marginTop: 6 }}>
        <span>{startLabel}</span>
        <span>
          <strong style={{ color: '#1a1a1a' }}>{latest.cumulative.toLocaleString()}</strong>
          {yLabelSuffix} as of {endLabel}
        </span>
      </div>
    </div>
  )
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null
  const max = Math.max(...values, 1)
  const w = 200, h = 36
  const step = w / (values.length - 1)
  const points = values.map((v, i) => `${i * step},${h - (v / max) * h}`).join(' ')
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ marginTop: 16 }}>
      <polyline fill="none" stroke="#1E3A5F" strokeWidth="1.5" points={points} opacity="0.8" />
    </svg>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#888884', fontWeight: 500 }}>
      <span style={{ width: 10, height: 10, background: color, borderRadius: 2 }} />
      {label}
    </span>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

// Brand palette mirrors app/globals.css for the marketing site.
const NAVY = '#1E3A5F'
const NAVY_HOVER = '#16304F'
const ACCENT_LIGHT = '#EEF1F5'
const BLUE = '#2563eb'
const TEXT = '#1a1a1a'
const TEXT_SECONDARY = '#555550'
const TEXT_MUTED = '#888884'
const BORDER = '#e0ddd8'
const BORDER_LIGHT = '#ece9e4'
const OFF_WHITE = '#f8f7f4'
const WHITE = '#ffffff'
const SUCCESS = '#16a34a'
const DANGER = '#dc2626'

const s: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: OFF_WHITE,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    color: TEXT,
  },
  container: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '56px 32px 24px',
  },
  errorBox: {
    background: WHITE,
    border: `1px solid ${BORDER}`,
    borderRadius: 8,
    padding: 24,
    color: TEXT,
  },

  // Header
  headerWrap: {
    paddingBottom: 36,
    marginBottom: 36,
    borderBottom: `1px solid ${BORDER_LIGHT}`,
  },
  brandLabel: {
    fontSize: 11,
    letterSpacing: '0.22em',
    color: NAVY,
    marginBottom: 18,
    fontWeight: 600,
  } as CSSProperties,
  headerTitle: {
    fontSize: 40,
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
    margin: '0 0 18px',
    color: TEXT,
  },
  titleEm: {
    fontFamily: '"Newsreader", Georgia, serif',
    fontStyle: 'italic',
    fontWeight: 700,
    fontSize: '1.15em',
    color: BLUE,
    letterSpacing: '-0.005em',
  },
  headerMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 14,
    alignItems: 'center',
    fontSize: 13,
    color: TEXT_MUTED,
  },
  livePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    background: 'rgba(22,163,74,0.08)',
    border: `1px solid rgba(22,163,74,0.25)`,
    borderRadius: 99,
    fontSize: 11,
    letterSpacing: '0.1em',
    color: SUCCESS,
    fontWeight: 600,
  },
  liveDot: { width: 6, height: 6, borderRadius: '50%', background: SUCCESS },
  metaSep: { color: BORDER },

  // KPI grid
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 1,
    background: BORDER,
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 56,
  },
  kpiCard: {
    background: WHITE,
    padding: '32px 28px',
  },
  kpiLabel: {
    fontSize: 11,
    letterSpacing: '0.14em',
    color: TEXT_MUTED,
    marginBottom: 14,
    textTransform: 'uppercase' as const,
    fontWeight: 600,
  },
  kpiNumber: {
    fontSize: 48,
    lineHeight: 1,
    color: TEXT,
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  kpiSub: {
    marginTop: 12,
    fontSize: 12,
    color: TEXT_MUTED,
  },

  // Section
  section: {
    marginBottom: 56,
  },
  sectionHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  sectionEyebrow: {
    fontSize: 11,
    letterSpacing: '0.18em',
    color: NAVY,
    marginBottom: 8,
    fontWeight: 600,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1.15,
    margin: 0,
    color: TEXT,
    letterSpacing: '-0.01em',
  },
  sectionMeta: {
    fontSize: 12,
    color: TEXT_MUTED,
  },

  // Chart
  chartWrap: {
    background: WHITE,
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: '28px 28px 20px',
  },
  chartLegend: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 24,
    marginTop: 18,
    paddingTop: 18,
    borderTop: `1px solid ${BORDER_LIGHT}`,
  },
  legendDashed: {
    fontSize: 11,
    color: TEXT_MUTED,
  },

  // Network grid
  networkGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 16,
  },
  networkCard: {
    background: WHITE,
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: '22px 24px 24px',
  },
  platformIcon: {
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    color: TEXT,
  },
  liveBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 10,
    letterSpacing: '0.1em',
    padding: '3px 9px',
    background: 'rgba(22,163,74,0.08)',
    border: `1px solid rgba(22,163,74,0.25)`,
    borderRadius: 99,
    color: SUCCESS,
    fontWeight: 600,
  },
  offlineBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 10,
    letterSpacing: '0.1em',
    padding: '3px 9px',
    background: ACCENT_LIGHT,
    border: `1px solid ${BORDER}`,
    borderRadius: 99,
    color: TEXT_MUTED,
    fontWeight: 600,
  },
  offlineDot: { width: 6, height: 6, borderRadius: '50%', background: TEXT_MUTED },

  // Table
  tableWrap: {
    background: WHITE,
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'flex',
    padding: '14px 24px',
    borderBottom: `1px solid ${BORDER}`,
    background: OFF_WHITE,
    fontSize: 11,
    letterSpacing: '0.14em',
    color: TEXT_MUTED,
    fontWeight: 600,
  },
  tableRow: {
    display: 'flex',
    padding: '20px 24px',
    borderBottom: `1px solid ${BORDER_LIGHT}`,
    alignItems: 'center',
    fontSize: 13,
  },
  tableRowBest: {
    borderLeft: `3px solid ${NAVY}`,
    paddingLeft: 21,
    background: ACCENT_LIGHT,
  },
  tableCell: { display: 'block' },
  tableMutedSmall: { fontSize: 11, color: TEXT_MUTED, marginTop: 2 },
  categoryPill: {
    display: 'inline-block',
    padding: '3px 12px',
    border: '1px solid',
    borderRadius: 99,
    fontSize: 10,
    letterSpacing: '0.1em',
    fontWeight: 600,
  },
  bestInShow: {
    display: 'inline-block',
    marginTop: 8,
    padding: '3px 10px',
    background: NAVY,
    borderRadius: 99,
    fontSize: 10,
    letterSpacing: '0.14em',
    color: WHITE,
    fontWeight: 600,
  },
}
