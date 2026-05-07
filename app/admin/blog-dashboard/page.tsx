import { client } from '@/sanity/client'
import { fetchBlogGA4Data, type PostGA4Stats } from '@/lib/ga4'

type Props = { searchParams: Promise<{ secret?: string }> }

interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  category: string
  publishedAt: string | null
  aiGenerated: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  'market-update': 'Market Update',
  'buying-tips': 'Buying Tips',
  'selling-tips': 'Selling Tips',
  'community-spotlight': 'Community',
  'investment': 'Investment',
  'news': 'News',
}

const CATEGORY_COLORS: Record<string, string> = {
  'market-update': '#2563eb',
  'buying-tips': '#16a34a',
  'selling-tips': '#9333ea',
  'community-spotlight': '#ea580c',
  'investment': '#0891b2',
  'news': '#64748b',
}

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null
  const ms = Date.now() - new Date(dateStr).getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function postsPerWeek(posts: BlogPost[]): string {
  const published = posts.filter(p => p.publishedAt)
  if (published.length < 2) return '—'
  const oldest = new Date(published[published.length - 1].publishedAt!).getTime()
  const newest = new Date(published[0].publishedAt!).getTime()
  const weeks = (newest - oldest) / (1000 * 60 * 60 * 24 * 7)
  if (weeks < 0.1) return '—'
  return (published.length / weeks).toFixed(1)
}

function fmtNum(n: number): string {
  return n.toLocaleString()
}

function fmtSec(sec: number): string {
  if (sec <= 0) return '—'
  if (sec < 60) return `${sec}s`
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

function fmtPerDay(total: number, ageDays: number): string {
  const days = Math.min(90, Math.max(1, ageDays))
  const v = total / days
  return v < 1 ? v.toFixed(2) : v.toFixed(1)
}

export default async function BlogDashboardPage({ searchParams }: Props) {
  const { secret } = await searchParams

  if (secret !== process.env.ADMIN_SECRET) {
    return (
      <div style={s.page}>
        <div style={s.container}>
          <div style={s.errorBox}>
            Unauthorized — add <code>?secret=YOUR_ADMIN_SECRET</code> to the URL.
          </div>
        </div>
      </div>
    )
  }

  const [posts, ga4Map] = await Promise.all([
    client.fetch<BlogPost[]>(`
      *[_type == "blogPost"] | order(publishedAt desc) {
        _id, title, slug, category, publishedAt, aiGenerated
      }
    `),
    fetchBlogGA4Data(),
  ])

  const total = posts.length
  const published = posts.filter(p => p.publishedAt)
  const aiCount = posts.filter(p => p.aiGenerated).length

  const byCat: Record<string, number> = {}
  for (const p of posts) {
    byCat[p.category] = (byCat[p.category] ?? 0) + 1
  }

  const ppw = postsPerWeek(published)
  const reportDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000
  const recent90 = published.filter(p => new Date(p.publishedAt!).getTime() > cutoff)

  // ── GA4 aggregates ────────────────────────────────────────────────────────────
  const hasGA4 = ga4Map.size > 0

  const postsWithGA4 = published.filter(p => ga4Map.has(p.slug?.current ?? ''))

  const totalPV   = postsWithGA4.reduce((s, p) => s + (ga4Map.get(p.slug?.current ?? '')?.pageViews   ?? 0), 0)
  const totalSess = postsWithGA4.reduce((s, p) => s + (ga4Map.get(p.slug?.current ?? '')?.sessions    ?? 0), 0)
  const totalUsers = postsWithGA4.reduce((s, p) => s + (ga4Map.get(p.slug?.current ?? '')?.activeUsers ?? 0), 0)
  const engSecs   = postsWithGA4.map(p => ga4Map.get(p.slug?.current ?? '')?.avgEngagementSec ?? 0).filter(v => v > 0)
  const avgEngSec = engSecs.length > 0 ? Math.round(engSecs.reduce((a, b) => a + b, 0) / engSecs.length) : null

  const n = postsWithGA4.length || 1
  const avgPVPerPostPerDay   = hasGA4 ? parseFloat((totalPV   / n / 90).toFixed(2)) : null
  const avgSessPerPostPerDay = hasGA4 ? parseFloat((totalSess / n / 90).toFixed(2)) : null
  const avgUsersPerPostPerDay = hasGA4 ? parseFloat((totalUsers / n / 90).toFixed(2)) : null

  // Top 5 posts by total pageviews
  const top5 = [...published]
    .filter(p => (ga4Map.get(p.slug?.current ?? '')?.pageViews ?? 0) > 0)
    .sort((a, b) =>
      (ga4Map.get(b.slug?.current ?? '')?.pageViews ?? 0) -
      (ga4Map.get(a.slug?.current ?? '')?.pageViews ?? 0)
    )
    .slice(0, 5)

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* ─── HEADER ─── */}
        <div style={s.header}>
          <div style={s.eyebrow}>Legacy Home Search · Barry Jenkins</div>
          <h1 style={s.title}>Blog Effectiveness Dashboard</h1>
          <p style={s.sub}>
            Report generated {reportDate} · Data source: Sanity CMS{gaId ? ' + Google Analytics' : ''} · {total} total posts
          </p>
        </div>

        {/* ─── WHY ─── */}
        <div style={s.prose}>
          <p style={s.whyHeading}>Why we're doing this.</p>
          <p style={s.whyText}>
            The rules for ranking on Google changed more in the last 18 months than in the previous five years combined.
            AI Overviews now answer many queries at the top of the search page before anyone clicks a link.
            Google's algorithm weights real user behavior — how long people stay, whether they bounce back —
            more than keywords or backlinks, and thin content is actively hurting sites that produce too much of it.
            The short version: stop publishing filler, make every post directly answer one question a buyer or seller
            actually types, and prove real local expertise. That's what this dashboard tracks.
          </p>
        </div>

        {/* ─── THIS WEEK'S READ ─── */}
        <div style={s.weekCard}>
          <div style={s.weekLabel}>This week's read · {reportDate}</div>

          <div style={s.weekSection}>
            <div style={s.weekSectionTitle}>Overall blog effectiveness</div>
            <p style={s.weekSectionText}>
              {total === 0
                ? 'No posts published yet. Use the blog pipeline to start publishing.'
                : hasGA4
                  ? `The blog has ${total} published posts and Google Analytics is live. ${postsWithGA4.length} posts have traffic data below. Total pageviews (last 90 days): ${fmtNum(totalPV)} across ${fmtNum(totalSess)} sessions.`
                  : gaId
                    ? `The blog has ${total} published posts and Google Analytics is collecting data. Traffic metrics will appear once the GA4 API connection activates.`
                    : `The blog has ${total} published posts across ${Object.keys(byCat).length} categories.`
              }
              {total > 0 && ` Posting frequency: ${ppw} posts/week over the tracked period.`}
            </p>
          </div>

          {total > 0 && (
            <div style={s.weekSection}>
              <div style={s.weekSectionTitle}>Content breakdown</div>
              <p style={s.weekSectionText}>
                {Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([cat, count]) =>
                  `${CATEGORY_LABELS[cat] ?? cat}: ${count}`
                ).join(' · ')}.
                {aiCount > 0 && ` ${aiCount} posts flagged as AI-generated.`}
                {recent90.length > 0 && ` ${recent90.length} posts published in the last 90 days.`}
              </p>
            </div>
          )}
        </div>

        {/* ─── HEADLINE KPIs ─── */}
        <h2 style={s.sectionTitle}>Headline numbers ({total} posts · last 90 days)</h2>

        <div style={s.kpiGrid}>
          {[
            {
              label: 'Pageviews per post per day',
              value: avgPVPerPostPerDay !== null ? String(avgPVPerPostPerDay) : '—',
              bench: '0.15 – 0.35',
              live: hasGA4,
            },
            {
              label: 'Sessions per post per day',
              value: avgSessPerPostPerDay !== null ? String(avgSessPerPostPerDay) : '—',
              bench: '0.12 – 0.30',
              live: hasGA4,
            },
            {
              label: 'Users per post per day',
              value: avgUsersPerPostPerDay !== null ? String(avgUsersPerPostPerDay) : '—',
              bench: '0.10 – 0.25',
              live: hasGA4,
            },
            {
              label: 'Avg engagement time',
              value: avgEngSec !== null ? fmtSec(avgEngSec) : '—',
              bench: '30 – 60 sec',
              live: hasGA4,
            },
          ].map((kpi) => (
            <div key={kpi.label} style={s.kpiCard}>
              <div style={{ ...s.kpiValue, color: kpi.live && kpi.value !== '—' ? '#2563eb' : '#94a3b8' }}>
                {kpi.value}
              </div>
              <div style={s.kpiLabel}>{kpi.label}</div>
              <div style={s.kpiBench}>
                Typical real-estate blog: <strong>{kpi.bench}</strong>
              </div>
            </div>
          ))}
        </div>

        {/* ─── GA STATUS BANNER ─── */}
        {!gaId ? (
          <div style={s.gaWarning}>
            <div style={s.gaWarningTitle}>Google Analytics not connected</div>
            <p style={s.gaWarningText}>
              Add <code style={s.code}>NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX</code> to your Vercel environment
              variables to activate traffic tracking.
            </p>
          </div>
        ) : hasGA4 ? (
          <div style={s.gaSuccess}>
            <strong>Google Analytics connected and live</strong> — Measurement ID: <code style={s.code}>{gaId}</code> ·
            Property ID: <code style={s.code}>{process.env.GA4_PROPERTY_ID}</code> ·
            {postsWithGA4.length} of {published.length} posts have traffic data (last 90 days).
          </div>
        ) : (
          <div style={s.gaWarning}>
            <div style={s.gaWarningTitle}>Google Analytics tracking active — API pending</div>
            <p style={s.gaWarningText}>
              GA4 Measurement ID <code style={s.code}>{gaId}</code> is collecting data.
              Add <code style={s.code}>GA4_PROPERTY_ID</code> + <code style={s.code}>GA4_SERVICE_ACCOUNT_JSON</code> to
              Vercel env vars to pull live traffic data into this dashboard.
            </p>
          </div>
        )}

        {/* ─── TOP PERFORMERS ─── */}
        {top5.length > 0 && (
          <>
            <h2 style={s.sectionTitle}>Top performing posts (last 90 days)</h2>
            <div style={s.topGrid}>
              {top5.map((post, rank) => {
                const stats = ga4Map.get(post.slug?.current ?? '') as PostGA4Stats
                const days = Math.min(90, Math.max(1, daysSince(post.publishedAt) ?? 90))
                return (
                  <div key={post._id} style={s.topCard}>
                    <div style={s.topRank}>#{rank + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <a
                        href={`/blog/${post.slug?.current}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={s.topTitle}
                      >
                        {post.title}
                      </a>
                      <div style={s.topMeta}>
                        <span style={{ ...s.catPill, background: (CATEGORY_COLORS[post.category] ?? '#94a3b8') + '18', color: CATEGORY_COLORS[post.category] ?? '#64748b' }}>
                          {CATEGORY_LABELS[post.category] ?? post.category}
                        </span>
                        <span style={s.topStat}>👁 {fmtNum(stats.pageViews)} views</span>
                        <span style={s.topStat}>📈 {fmtPerDay(stats.pageViews, days)}/day</span>
                        <span style={s.topStat}>⏱ {fmtSec(stats.avgEngagementSec)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* ─── BENCHMARK TABLE ─── */}
        <h2 style={s.sectionTitle}>How we compare to a typical real-estate blog</h2>
        <p style={s.metaNote}>
          Industry benchmark ranges drawn from published marketing studies (HubSpot, Databox, SEMrush, SimilarWeb).
          Ranges reflect the middle 50% of mature informational posts on real-estate blogs — not top performers.
        </p>
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={{ ...s.th, width: '35%' }}>Metric</th>
                <th style={s.th}>Legacy Home Search</th>
                <th style={s.th}>Typical real-estate blog</th>
                <th style={s.th}>How we stack up</th>
              </tr>
            </thead>
            <tbody>
              {[
                [
                  'Pageviews / post / day',
                  avgPVPerPostPerDay !== null ? String(avgPVPerPostPerDay) : '— (GA pending)',
                  '0.15 – 0.35',
                  avgPVPerPostPerDay === null ? 'Will update as GA data arrives'
                    : avgPVPerPostPerDay >= 0.35 ? '🟢 Above benchmark'
                    : avgPVPerPostPerDay >= 0.15 ? '🟡 Within benchmark range'
                    : '🔴 Below benchmark — increase promotion',
                ],
                [
                  'Avg engagement time',
                  avgEngSec !== null ? fmtSec(avgEngSec) : '— (GA pending)',
                  '30 – 60 sec',
                  avgEngSec === null ? 'Will update as GA data arrives'
                    : avgEngSec >= 60 ? '🟢 Above benchmark'
                    : avgEngSec >= 30 ? '🟡 Within benchmark range'
                    : '🔴 Below benchmark — improve content depth',
                ],
                [
                  'Sessions / post / day',
                  avgSessPerPostPerDay !== null ? String(avgSessPerPostPerDay) : '— (GA pending)',
                  '0.12 – 0.30',
                  avgSessPerPostPerDay === null ? 'Will update as GA data arrives'
                    : avgSessPerPostPerDay >= 0.30 ? '🟢 Above benchmark'
                    : avgSessPerPostPerDay >= 0.12 ? '🟡 Within benchmark range'
                    : '🔴 Below benchmark',
                ],
                [
                  'Posts published',
                  String(total),
                  'varies',
                  total >= 20 ? 'Healthy volume' : total > 0 ? 'Building — keep publishing' : 'No posts yet',
                ],
                [
                  'Posts / week',
                  ppw,
                  '3 – 7',
                  ppw === '—' ? 'Not enough data'
                    : parseFloat(ppw) >= 3 ? '🟢 On target'
                    : '🔴 Below target — increase cadence',
                ],
              ].map(([metric, us, bench, note], i) => (
                <tr key={metric} style={{ background: i % 2 === 0 ? '#fff' : '#fafaf8' }}>
                  <td style={s.td}><strong>{metric}</strong></td>
                  <td style={{ ...s.td, fontWeight: 600 }}>{us}</td>
                  <td style={s.td}>{bench}</td>
                  <td style={{ ...s.td, color: '#64748b', fontSize: 12 }}>{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── CATEGORY BREAKDOWN ─── */}
        <h2 style={s.sectionTitle}>Content breakdown by category</h2>
        <div style={s.catGrid}>
          {Object.entries(byCat).sort((a, b) => b[1] - a[1]).map(([cat, count]) => (
            <div key={cat} style={s.catCard}>
              <div style={{ ...s.catDot, background: CATEGORY_COLORS[cat] ?? '#94a3b8' }} />
              <div>
                <div style={s.catCount}>{count}</div>
                <div style={s.catName}>{CATEGORY_LABELS[cat] ?? cat}</div>
              </div>
            </div>
          ))}
          {Object.keys(byCat).length === 0 && (
            <div style={{ color: '#94a3b8', fontSize: 14 }}>No posts yet.</div>
          )}
        </div>

        {/* ─── CHANNEL TABLE (placeholder) ─── */}
        <h2 style={s.sectionTitle}>Where the traffic comes from</h2>
        {!hasGA4 && (
          <p style={s.metaNote}>
            Channel breakdown requires GA4 API access (see status banner above).
          </p>
        )}
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Channel</th>
                <th style={s.th}>Pageviews</th>
                <th style={s.th}>Sessions</th>
                <th style={s.th}>% of PV</th>
              </tr>
            </thead>
            <tbody>
              {['Organic Search', 'Direct', 'Organic Social', 'Referral'].map((ch, i) => (
                <tr key={ch} style={{ background: i % 2 === 0 ? '#fff' : '#fafaf8' }}>
                  <td style={s.td}>{ch}</td>
                  <td style={{ ...s.td, color: '#94a3b8' }}>—</td>
                  <td style={{ ...s.td, color: '#94a3b8' }}>—</td>
                  <td style={{ ...s.td, color: '#94a3b8' }}>—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!hasGA4 && (
          <p style={{ ...s.metaNote, marginTop: 6 }}>
            Channel breakdown needs a channel grouping dimension query — coming once the GA4 API is active.
          </p>
        )}

        {/* ─── POST-BY-POST TABLE ─── */}
        <h2 style={s.sectionTitle}>Post-by-post results ({total} posts · last 90 days)</h2>
        {!hasGA4 && (
          <p style={s.metaNote}>
            Traffic metrics show — until Google Analytics API data is active.
          </p>
        )}

        {total === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
            No posts published yet.
          </div>
        ) : (
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={{ ...s.th, width: '38%' }}>Post</th>
                  <th style={s.th}>Category</th>
                  <th style={s.th}>Published</th>
                  <th style={s.th}>Age</th>
                  <th style={s.th}>Views</th>
                  <th style={s.th}>PV/day</th>
                  <th style={s.th}>Sess/day</th>
                  <th style={s.th}>Engage</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, i) => {
                  const days = daysSince(post.publishedAt) ?? 0
                  const stats = ga4Map.get(post.slug?.current ?? '')
                  const pvDay   = stats ? fmtPerDay(stats.pageViews, days) : '—'
                  const sessDay = stats ? fmtPerDay(stats.sessions, days) : '—'
                  const engage  = stats ? fmtSec(stats.avgEngagementSec) : '—'
                  const isTop = top5.some(t => t._id === post._id)
                  return (
                    <tr key={post._id} style={{ background: isTop ? '#fffbeb' : i % 2 === 0 ? '#fff' : '#fafaf8' }}>
                      <td style={s.td}>
                        <a
                          href={`/blog/${post.slug?.current}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={s.postLink}
                        >
                          {post.title}
                        </a>
                        {isTop && <span style={s.topBadge}>Top</span>}
                        {post.aiGenerated && <span style={s.aiBadge}>AI</span>}
                      </td>
                      <td style={s.td}>
                        <span style={{
                          ...s.catPill,
                          background: (CATEGORY_COLORS[post.category] ?? '#94a3b8') + '18',
                          color: CATEGORY_COLORS[post.category] ?? '#64748b',
                        }}>
                          {CATEGORY_LABELS[post.category] ?? post.category ?? '—'}
                        </span>
                      </td>
                      <td style={{ ...s.td, fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                        {formatDate(post.publishedAt)}
                      </td>
                      <td style={{ ...s.td, fontSize: 12, color: '#64748b', textAlign: 'center' }}>
                        {days > 0 ? `${days}d` : '—'}
                      </td>
                      <td style={{ ...s.td, textAlign: 'center', fontWeight: stats ? 600 : 400, color: stats ? '#1a1a1a' : '#94a3b8' }}>
                        {stats ? fmtNum(stats.pageViews) : '—'}
                      </td>
                      <td style={{ ...s.td, textAlign: 'center', color: stats ? '#1a1a1a' : '#94a3b8' }}>{pvDay}</td>
                      <td style={{ ...s.td, textAlign: 'center', color: stats ? '#1a1a1a' : '#94a3b8' }}>{sessDay}</td>
                      <td style={{ ...s.td, textAlign: 'center', color: stats ? '#1a1a1a' : '#94a3b8' }}>{engage}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── FOOTER NOTE ─── */}
        <div style={s.footerNote}>
          <strong>Benchmark sources:</strong>{' '}
          HubSpot State of Marketing (engagement time by industry),
          Databox Benchmarks (GA4 real-estate cohort),
          SEMrush real-estate industry studies (organic search share),
          SimilarWeb real-estate category data (channel mix).
          Ranges reflect mature informational posts on real-estate blogs; "typical" means the middle 50%
          of sites in those studies, not the top performers.
        </div>

      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f8f7f4',
    fontFamily: 'Inter, -apple-system, sans-serif',
    color: '#1a1a1a',
  },
  container: { maxWidth: 1100, margin: '0 auto', padding: '48px 24px 100px' },
  errorBox: {
    background: 'rgba(220,38,38,0.08)',
    border: '1px solid rgba(220,38,38,0.2)',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: 8,
    fontSize: 14,
  },
  header: { marginBottom: 32, paddingBottom: 28, borderBottom: '1px solid #e0ddd8' },
  eyebrow: {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
    textTransform: 'uppercase' as const, color: '#2563eb', marginBottom: 8,
  },
  title: { fontSize: 32, fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.025em' },
  sub: { fontSize: 14, color: '#888884', margin: 0, lineHeight: 1.7 },
  prose: { marginBottom: 28 },
  whyHeading: { fontWeight: 700, margin: '0 0 8px', fontSize: 15 },
  whyText: { margin: 0, fontSize: 14, color: '#444', lineHeight: 1.8 },
  weekCard: {
    background: '#fff',
    border: '1px solid #e0ddd8',
    borderRadius: 12,
    padding: '24px 28px',
    marginBottom: 36,
  },
  weekLabel: {
    fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
    textTransform: 'uppercase' as const, color: '#2563eb', marginBottom: 16,
  },
  weekSection: { marginBottom: 16 },
  weekSectionTitle: { fontWeight: 700, fontSize: 15, marginBottom: 6 },
  weekSectionText: { margin: 0, fontSize: 14, color: '#444', lineHeight: 1.8 },
  sectionTitle: {
    fontSize: 18, fontWeight: 700, margin: '40px 0 12px', letterSpacing: '-0.015em',
  },
  metaNote: { fontSize: 13, color: '#888884', margin: '0 0 14px', lineHeight: 1.7 },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 16,
    marginBottom: 24,
  },
  kpiCard: {
    background: '#fff',
    border: '1px solid #e0ddd8',
    borderRadius: 12,
    padding: '20px 24px',
  },
  kpiValue: { fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 4 },
  kpiLabel: { fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 8, lineHeight: 1.4 },
  kpiBench: { fontSize: 12, color: '#888884', lineHeight: 1.5 },
  gaWarning: {
    background: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: 10,
    padding: '16px 20px',
    marginBottom: 36,
  },
  gaWarningTitle: { fontWeight: 700, fontSize: 14, color: '#92400e', marginBottom: 6 },
  gaWarningText: { margin: 0, fontSize: 13, color: '#78350f', lineHeight: 1.7 },
  gaSuccess: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: 10,
    padding: '14px 20px',
    fontSize: 13,
    color: '#15803d',
    marginBottom: 36,
    lineHeight: 1.7,
  },
  code: {
    fontFamily: 'monospace',
    background: 'rgba(0,0,0,0.06)',
    padding: '1px 5px',
    borderRadius: 4,
    fontSize: 12,
  },
  topGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10,
    marginBottom: 8,
  },
  topCard: {
    background: '#fff',
    border: '1px solid #e0ddd8',
    borderRadius: 10,
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
  },
  topRank: {
    fontSize: 20,
    fontWeight: 800,
    color: '#2563eb',
    minWidth: 32,
    lineHeight: 1.3,
  },
  topTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#1a1a1a',
    textDecoration: 'none',
    lineHeight: 1.4,
    display: 'block',
    marginBottom: 6,
  },
  topMeta: { display: 'flex', flexWrap: 'wrap' as const, gap: 8, alignItems: 'center' },
  topStat: { fontSize: 12, color: '#64748b' },
  tableWrap: { overflowX: 'auto' as const, marginBottom: 8 },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 },
  th: {
    padding: '10px 14px',
    textAlign: 'left' as const,
    background: '#f0ede8',
    fontWeight: 700,
    fontSize: 12,
    color: '#444',
    borderBottom: '1px solid #e0ddd8',
    whiteSpace: 'nowrap' as const,
  },
  td: {
    padding: '10px 14px',
    borderBottom: '1px solid #f0ede8',
    verticalAlign: 'middle' as const,
    fontSize: 13,
  },
  postLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: 500,
    lineHeight: 1.4,
  },
  topBadge: {
    display: 'inline-block',
    marginLeft: 6,
    fontSize: 10,
    fontWeight: 700,
    background: '#fffbeb',
    color: '#d97706',
    border: '1px solid #fde68a',
    padding: '1px 5px',
    borderRadius: 4,
    verticalAlign: 'middle',
  },
  aiBadge: {
    display: 'inline-block',
    marginLeft: 6,
    fontSize: 10,
    fontWeight: 700,
    background: '#eff6ff',
    color: '#2563eb',
    padding: '1px 5px',
    borderRadius: 4,
    verticalAlign: 'middle',
  },
  catPill: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 100,
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
  },
  catGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 12,
    marginBottom: 8,
  },
  catCard: {
    background: '#fff',
    border: '1px solid #e0ddd8',
    borderRadius: 10,
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minWidth: 140,
  },
  catDot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  catCount: { fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 },
  catName: { fontSize: 12, color: '#888884', marginTop: 2 },
  footerNote: {
    marginTop: 60,
    paddingTop: 24,
    borderTop: '1px solid #e0ddd8',
    fontSize: 12,
    color: '#aaa9a4',
    lineHeight: 1.8,
  },
}
