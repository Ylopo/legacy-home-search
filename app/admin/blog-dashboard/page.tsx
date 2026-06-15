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
            <div style={{ ...s.kpiNumber, fontSize: 22, lineHeight: 1.3, fontStyle: 'italic' }}>
              {topPerformer ? truncate(topPerformer.title, 60) : '—'}
            </div>
            <div style={{ ...s.kpiSub, color: '#c9a875', marginTop: 14 }}>views arriving soon</div>
          </div>
          {/* Publishing Streak */}
          <div style={s.kpiCard}>
            <div style={s.kpiLabel}>PUBLISHING STREAK</div>
            <div style={{ ...s.kpiNumber, display: 'flex', alignItems: 'baseline', gap: 12 }}>
              {streak}
              <span style={{ fontSize: 22, fontStyle: 'italic', color: '#a8a29e' }}>day{streak === 1 ? '' : 's'}</span>
            </div>
            <div style={s.kpiSub}>consecutive days with a published post</div>
          </div>
        </div>

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
              <LegendDot color="#26514e" label="Posts published" />
              <LegendDot color="#c9a875" label="Peak week" />
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
                        <div style={{ color: '#e5e0d5', lineHeight: 1.35 }}>{p.title}</div>
                        {idx === 0 && (
                          <span style={s.bestInShow}>BEST IN SHOW</span>
                        )}
                      </div>
                    </div>
                    <div style={{ ...s.tableCell, flex: 1 }}>
                      <span style={{ ...s.categoryPill, borderColor: color, color }}>{label.toUpperCase()}</span>
                    </div>
                    <div style={{ ...s.tableCell, flex: 1 }}>
                      <div style={{ color: '#a8a29e' }}>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</div>
                      <div style={s.tableMutedSmall}>{age === null ? '' : age === 0 ? '0d ago' : `${age}d ago`}</div>
                    </div>
                    <div style={{ ...s.tableCell, flex: 1, textAlign: 'right' as const, color: '#a8a29e' }}>—</div>
                    <div style={{ ...s.tableCell, flex: 1, textAlign: 'right' as const, color: '#a8a29e' }}>—</div>
                    <div style={{ ...s.tableCell, flex: 1, textAlign: 'right' as const, color: '#a8a29e' }}>—</div>
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
  const max = Math.max(PUBLISHING_TARGET_PER_WEEK + 2, ...weeks.map((w) => w.count))
  const targetY = (PUBLISHING_TARGET_PER_WEEK / max) * 100
  return (
    <div style={{ position: 'relative', height: 280, padding: '20px 0 30px' }}>
      {/* Target line */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: `calc(30px + ${targetY}% - ${(targetY / 100) * 230}px)`,
        borderTop: '1px dashed rgba(168,162,158,0.4)', pointerEvents: 'none',
      }}>
        <span style={{ position: 'absolute', right: 0, top: -8, fontSize: 10, color: '#a8a29e', letterSpacing: '0.1em' }}>
          TARGET · {PUBLISHING_TARGET_PER_WEEK} / WK
        </span>
      </div>
      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', height: 230, gap: 8 }}>
        {weeks.map((w, i) => {
          const h = max > 0 ? (w.count / max) * 100 : 0
          const color = w.isPeak && w.count > 0 ? '#c9a875' : '#26514e'
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', height: '100%' }}>
              {w.isPeak && w.count > 0 && (
                <div style={{ position: 'absolute', top: -16, fontStyle: 'italic', color: '#c9a875', fontSize: 12 }}>{w.count}</div>
              )}
              <div style={{ flex: 1 }} />
              <div style={{
                width: '70%', maxWidth: 60,
                height: `${h}%`,
                background: color,
                opacity: w.count === 0 ? 0.25 : 1,
                transition: 'background 0.2s',
              }} />
            </div>
          )
        })}
      </div>
      {/* X-axis labels — every other week */}
      <div style={{ display: 'flex', height: 30, gap: 8, marginTop: 4 }}>
        {weeks.map((w, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: '#a8a29e' }}>
            {i % 2 === 0 ? w.label : ''}
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
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 42, lineHeight: 1, color: '#e5e0d5' }}>
            {current > 0 ? fmtNum(current) : '—'}
          </div>
          <div style={{ ...s.kpiLabel, marginTop: 6 }}>{metricLabel}</div>
          {changePct !== null && current > 0 && (
            <div style={{ marginTop: 10, fontSize: 12 }}>
              <span style={{ color: changePct >= 0 ? '#4ade80' : '#f87171', fontWeight: 600 }}>
                {changePct >= 0 ? '↑' : '↓'} {Math.abs(changePct)}%
              </span>
              <span style={{ color: '#a8a29e' }}> vs prior 30 days</span>
            </div>
          )}
          {trend.length > 1 && <Sparkline values={trend} />}
        </>
      ) : (
        <div style={{ fontSize: 14, color: '#a8a29e', padding: '20px 0' }}>Awaiting first metrics</div>
      )}
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(168,162,158,0.12)' }}>
        <div style={{ ...s.kpiLabel, marginBottom: 6 }}>TOP POST</div>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 15, color: '#e5e0d5', lineHeight: 1.35 }}>
          {topPostTitle ? truncate(topPostTitle, 90) : '—'}
        </div>
        {topPostMeta && <div style={{ ...s.kpiLabel, marginTop: 6, letterSpacing: '0.06em', textTransform: 'none' }}>{topPostMeta}</div>}
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
      <polyline fill="none" stroke="#a8a29e" strokeWidth="1" points={points} opacity="0.7" />
    </svg>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#a8a29e' }}>
      <span style={{ width: 10, height: 10, background: color, borderRadius: 2 }} />
      {label}
    </span>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #0a0e10 0%, #050708 100%)',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    color: '#e5e0d5',
  },
  container: {
    maxWidth: 1400,
    margin: '0 auto',
    padding: '56px 32px 24px',
  },
  errorBox: {
    background: '#141417',
    border: '1px solid #2a2a30',
    borderRadius: 8,
    padding: 24,
    color: '#e5e0d5',
  },

  // Header
  headerWrap: {
    paddingBottom: 36,
    marginBottom: 36,
    borderBottom: '1px solid rgba(168,162,158,0.12)',
  },
  brandLabel: {
    fontSize: 11,
    letterSpacing: '0.22em',
    color: '#c9a875',
    marginBottom: 18,
    fontWeight: 500,
  } as CSSProperties,
  headerTitle: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: 56,
    fontWeight: 400,
    lineHeight: 1.05,
    letterSpacing: '-0.01em',
    margin: '0 0 24px',
    color: '#f5efe2',
  },
  titleEm: {
    color: '#a8a29e',
    fontWeight: 400,
  },
  headerMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 14,
    alignItems: 'center',
    fontSize: 13,
    color: '#a8a29e',
  },
  livePill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 12px',
    border: '1px solid rgba(74,222,128,0.4)',
    borderRadius: 99,
    fontSize: 11,
    letterSpacing: '0.1em',
    color: '#4ade80',
  },
  liveDot: { width: 6, height: 6, borderRadius: '50%', background: '#4ade80' },
  metaSep: { color: 'rgba(168,162,158,0.4)' },

  // KPI grid
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 1,
    background: 'rgba(168,162,158,0.12)',
    border: '1px solid rgba(168,162,158,0.12)',
    marginBottom: 56,
  },
  kpiCard: {
    background: '#0c1012',
    padding: '32px 28px',
  },
  kpiLabel: {
    fontSize: 11,
    letterSpacing: '0.16em',
    color: '#a8a29e',
    marginBottom: 14,
    textTransform: 'uppercase' as const,
  },
  kpiNumber: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: 72,
    lineHeight: 1,
    color: '#f5efe2',
    fontWeight: 400,
  },
  kpiSub: {
    marginTop: 12,
    fontSize: 12,
    color: '#a8a29e',
  },

  // Section
  section: {
    marginBottom: 56,
  },
  sectionHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 32,
    flexWrap: 'wrap' as const,
    gap: 12,
  },
  sectionEyebrow: {
    fontSize: 11,
    letterSpacing: '0.22em',
    color: '#a8a29e',
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Cormorant Garamond, serif',
    fontSize: 40,
    fontWeight: 400,
    lineHeight: 1.05,
    margin: 0,
    color: '#f5efe2',
  },
  sectionMeta: {
    fontSize: 12,
    color: '#a8a29e',
  },

  // Chart
  chartWrap: {
    background: '#0c1012',
    border: '1px solid rgba(168,162,158,0.12)',
    padding: '28px 28px 20px',
  },
  chartLegend: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 24,
    marginTop: 18,
    paddingTop: 18,
    borderTop: '1px solid rgba(168,162,158,0.1)',
  },
  legendDashed: {
    fontSize: 11,
    color: '#a8a29e',
  },

  // Network grid
  networkGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 16,
  },
  networkCard: {
    background: '#0c1012',
    border: '1px solid rgba(168,162,158,0.12)',
    padding: '22px 24px 24px',
  },
  platformIcon: {
    width: 22,
    height: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    color: '#f5efe2',
  },
  liveBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 10,
    letterSpacing: '0.12em',
    padding: '3px 9px',
    border: '1px solid rgba(74,222,128,0.4)',
    borderRadius: 99,
    color: '#4ade80',
  },
  offlineBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 10,
    letterSpacing: '0.12em',
    padding: '3px 9px',
    border: '1px solid rgba(168,162,158,0.3)',
    borderRadius: 99,
    color: '#a8a29e',
  },
  offlineDot: { width: 6, height: 6, borderRadius: '50%', background: '#a8a29e' },

  // Table
  tableWrap: {
    background: '#0c1012',
    border: '1px solid rgba(168,162,158,0.12)',
  },
  tableHeader: {
    display: 'flex',
    padding: '14px 24px',
    borderBottom: '1px solid rgba(168,162,158,0.12)',
    fontSize: 11,
    letterSpacing: '0.16em',
    color: '#a8a29e',
  },
  tableRow: {
    display: 'flex',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(168,162,158,0.06)',
    alignItems: 'center',
    fontSize: 13,
  },
  tableRowBest: {
    borderLeft: '2px solid #c9a875',
    paddingLeft: 22,
    background: 'rgba(201,168,117,0.02)',
  },
  tableCell: { display: 'block' },
  tableMutedSmall: { fontSize: 11, color: '#666', marginTop: 2 },
  categoryPill: {
    display: 'inline-block',
    padding: '3px 12px',
    border: '1px solid',
    borderRadius: 99,
    fontSize: 10,
    letterSpacing: '0.12em',
  },
  bestInShow: {
    display: 'inline-block',
    marginTop: 8,
    padding: '3px 10px',
    border: '1px solid #c9a875',
    borderRadius: 99,
    fontSize: 10,
    letterSpacing: '0.16em',
    color: '#c9a875',
  },
}
