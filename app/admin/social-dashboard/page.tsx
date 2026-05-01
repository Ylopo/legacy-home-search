'use client'

import { useEffect, useState } from 'react'
import type { SocialDashboardPost } from '@/sanity/queries'
import type { GSCOverview } from '@/lib/gsc-client'

// ─── Types ────────────────────────────────────────────────────────────────────

type DashboardData = {
  posts: SocialDashboardPost[]
  queue: { media_pending: number; media_ready: number }
  gsc: GSCOverview | null
  weeks: { label: string; count: number }[]
  stats: {
    total: number
    thisMonth: number
    withFacebook: number
    withFacebookReel: number
    withYouTube: number
    withTikTok: number
    recentCount: number
    daysSinceLastPost: number | null
    gscConnected: boolean
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  'market-update':       '#2563eb',
  'buying-tips':         '#16a34a',
  'selling-tips':        '#0891b2',
  'community-spotlight': '#7c3aed',
  'investment':          '#d97706',
  'news':                '#64748b',
  'cost-breakdown':      '#b45309',
  'flood-and-risk':      '#0f766e',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function pct(n: number, total: number) {
  if (!total) return '0%'
  return `${Math.round((n / total) * 100)}%`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, accent = '#1E3A5F' }: {
  label: string; value: string | number; sub?: string; accent?: string
}) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: accent, lineHeight: 1, marginBottom: 4 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: '#94a3b8' }}>{sub}</div>}
    </div>
  )
}

function PlatformBar({ label, icon, count, total, color }: {
  label: string; icon: string; count: number; total: number; color: string
}) {
  const width = total ? `${Math.max(4, (count / total) * 100)}%` : '4%'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 16, width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 13, color: '#475569', width: 130, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 99, height: 10, overflow: 'hidden' }}>
        <div style={{ width, background: color, height: '100%', borderRadius: 99, transition: 'width 0.4s' }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', width: 36, textAlign: 'right', flexShrink: 0 }}>{count}</span>
      <span style={{ fontSize: 12, color: '#94a3b8', width: 36, flexShrink: 0 }}>{pct(count, total)}</span>
    </div>
  )
}

function WeekChart({ weeks }: { weeks: { label: string; count: number }[] }) {
  const max = Math.max(...weeks.map(w => w.count), 1)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 60, marginBottom: 6 }}>
        {weeks.map((w, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{
              width: '100%', borderRadius: '3px 3px 0 0',
              background: i === weeks.length - 1 ? '#2563eb' : '#bfdbfe',
              height: `${(w.count / max) * 52}px`,
              minHeight: w.count > 0 ? 4 : 0,
              transition: 'height 0.3s',
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {weeks.map((w, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: i === weeks.length - 1 ? '#2563eb' : '#1a1a1a' }}>{w.count}</div>
            <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'clip' }}>{w.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Check({ yes }: { yes: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 20, height: 20, borderRadius: '50%',
      background: yes ? '#dcfce7' : '#f1f5f9',
      color: yes ? '#16a34a' : '#cbd5e1',
      fontSize: 11, fontWeight: 700,
    }}>
      {yes ? '✓' : '–'}
    </span>
  )
}

function GSCTrendSparkline({ trend }: { trend: { date: string; clicks: number }[] }) {
  if (!trend.length) return null
  const max = Math.max(...trend.map(t => t.clicks), 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 28 }}>
      {trend.map((t, i) => (
        <div
          key={i}
          title={`${t.date}: ${t.clicks} clicks`}
          style={{
            flex: 1, borderRadius: 2,
            background: '#2563eb',
            height: `${Math.max(2, (t.clicks / max) * 28)}px`,
            opacity: 0.6 + (i / trend.length) * 0.4,
          }}
        />
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SocialDashboardPage() {
  const secret = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('secret') ?? ''
    : ''

  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'no-facebook' | 'no-video'>('all')

  useEffect(() => {
    if (!secret) { setError('Unauthorized'); setLoading(false); return }
    fetch(`/api/social-dashboard?secret=${encodeURIComponent(secret)}`)
      .then(r => r.ok ? r.json() : Promise.reject('Unauthorized'))
      .then(setData)
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [secret])

  if (loading) return (
    <div style={S.page}>
      <div style={S.header}><span style={S.headerLabel}>Legacy Home Team · Social Performance</span></div>
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>Loading dashboard…</div>
    </div>
  )

  if (error || !data) return (
    <div style={S.page}>
      <div style={{ color: '#dc2626', textAlign: 'center', padding: 40, fontFamily: 'Inter, sans-serif' }}>{error || 'No data'}</div>
    </div>
  )

  const { posts, queue, gsc, weeks, stats } = data
  const totalQueue = queue.media_pending + queue.media_ready

  const filteredPosts = posts.filter(p => {
    if (filter === 'no-facebook') return !p.hasFacebook
    if (filter === 'no-video') return !p.hasYouTube && !p.hasTikTok
    return true
  })

  const healthAlerts: string[] = []
  if (stats.daysSinceLastPost !== null && stats.daysSinceLastPost >= 7)
    healthAlerts.push(`No post published in ${stats.daysSinceLastPost} days`)
  if (queue.media_pending >= 5)
    healthAlerts.push(`${queue.media_pending} posts stuck in "Needs Media"`)
  if (stats.recentCount === 0)
    healthAlerts.push('Zero posts published in the last 7 days')

  return (
    <div style={S.page}>

      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={S.headerLabel}>Legacy Home Team · Social Performance</div>
          <h1 style={S.headerTitle}>Content Dashboard</h1>
          <div style={S.headerSub}>
            Last 28 days · {stats.total} total posts · data as of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        <a
          href={`/admin/va-queue?secret=${secret}`}
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', alignSelf: 'flex-start', marginTop: 4 }}
        >
          ← Media Queue
        </a>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* Health alerts */}
        {healthAlerts.length > 0 && (
          <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: 10, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>⚠ Pipeline alerts:</span>
            {healthAlerts.map((a, i) => (
              <span key={i} style={{ fontSize: 13, color: '#92400e', background: '#fef3c7', borderRadius: 6, padding: '1px 8px' }}>{a}</span>
            ))}
          </div>
        )}

        {/* ── Section 1: Blog overview ── */}
        <div style={S.sectionLabel}>Blog Pipeline</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
          <StatCard label="Total Posts" value={stats.total} sub="all time" />
          <StatCard label="This Month" value={stats.thisMonth} sub="published" accent="#2563eb" />
          <StatCard label="In Queue" value={totalQueue} sub={`${queue.media_pending} need media · ${queue.media_ready} ready`} accent={totalQueue > 0 ? '#d97706' : '#16a34a'} />
          <StatCard label="Posts / Week" value={(stats.total / 8).toFixed(1)} sub="8-week avg" />
        </div>

        {/* Weekly posting volume */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px', marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>Weekly Posting Volume — Last 8 Weeks</div>
          <WeekChart weeks={weeks} />
        </div>

        {/* ── Section 2: Social distribution ── */}
        <div style={S.sectionLabel}>Social Distribution</div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', marginBottom: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Platform coverage — {stats.total} total posts
              </div>
              <PlatformBar label="Facebook Post"   icon="👥" count={stats.withFacebook}     total={stats.total} color="#1877f2" />
              <PlatformBar label="Facebook Reel"   icon="🎬" count={stats.withFacebookReel}  total={stats.total} color="#e1306c" />
              <PlatformBar label="YouTube"          icon="▶️" count={stats.withYouTube}      total={stats.total} color="#ff0000" />
              <PlatformBar label="TikTok"           icon="🎵" count={stats.withTikTok}       total={stats.total} color="#010101" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Distribution rate
              </div>
              {[
                { label: 'Posted to Facebook',      count: stats.withFacebook,     color: '#1877f2' },
                { label: 'Published as Reel',        count: stats.withFacebookReel, color: '#e1306c' },
                { label: 'Uploaded to YouTube',      count: stats.withYouTube,      color: '#ff0000' },
                { label: 'Posted to TikTok',         count: stats.withTikTok,       color: '#010101' },
              ].map(({ label, count, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 13, color: '#475569' }}>{label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color }}>{count}</span>
                    <span style={{ fontSize: 12, color: '#94a3b8', width: 36, textAlign: 'right' }}>{pct(count, stats.total)}</span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 16, padding: '12px', background: '#f8fafc', borderRadius: 8, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
                <strong style={{ color: '#1a1a1a' }}>Note:</strong> Reels and video platforms require a video to be uploaded in the VA editor before publishing. Facebook post rate reflects posts published via Blotato.
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 3: Google Search Console ── */}
        <div style={S.sectionLabel}>Google Search Console — Last 28 Days</div>
        {!stats.gscConnected ? (
          <div style={{ background: '#fff', border: '1.5px dashed #cbd5e1', borderRadius: 12, padding: '32px 24px', marginBottom: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>🔍</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Google Search Console not connected</div>
            <div style={{ fontSize: 13, color: '#64748b', maxWidth: 480, margin: '0 auto 16px' }}>
              Connect GSC to see organic search clicks, impressions, CTR, average position, and your top-performing pages.
            </div>
            <div style={{ display: 'inline-block', background: '#f1f5f9', borderRadius: 8, padding: '10px 20px', fontSize: 12, color: '#475569', textAlign: 'left' }}>
              Set env vars: <code style={{ color: '#2563eb' }}>GSC_SERVICE_ACCOUNT_JSON</code> + <code style={{ color: '#2563eb' }}>GSC_SITE_URL</code>
            </div>
          </div>
        ) : !gsc ? (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, padding: 20, marginBottom: 32, fontSize: 13, color: '#991b1b' }}>
            GSC credentials are set but the API returned an error. Check that the service account has access to the Search Console property.
          </div>
        ) : (
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
              <StatCard label="Clicks" value={gsc.clicks.toLocaleString()} sub="organic search" accent="#2563eb" />
              <StatCard label="Impressions" value={gsc.impressions.toLocaleString()} sub="search appearances" />
              <StatCard label="CTR" value={`${(gsc.ctr * 100).toFixed(2)}%`} sub="click-through rate" />
              <StatCard label="Avg Position" value={gsc.position.toFixed(1)} sub="lower = better" accent={gsc.position <= 10 ? '#16a34a' : gsc.position <= 20 ? '#d97706' : '#dc2626'} />
            </div>
            {gsc.trend.length > 0 && (
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px', marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>Daily Clicks — Last 28 Days</div>
                <GSCTrendSparkline trend={gsc.trend} />
              </div>
            )}
            {gsc.topPages.length > 0 && (
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>Top Pages by Clicks</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Page', 'Clicks', 'Impressions', 'CTR', 'Avg Position'].map(h => (
                        <th key={h} style={{ padding: '8px 16px', textAlign: h === 'Page' ? 'left' : 'right', color: '#64748b', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gsc.topPages.map((row, i) => {
                      const slug = row.page.replace(/^https?:\/\/[^/]+/, '')
                      return (
                        <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px 16px', maxWidth: 360 }}>
                            <a href={row.page} target="_blank" rel="noopener noreferrer"
                              style={{ color: '#2563eb', textDecoration: 'none', fontSize: 12, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {slug || '/'}
                            </a>
                          </td>
                          <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#1a1a1a' }}>{row.clicks}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'right', color: '#475569' }}>{row.impressions.toLocaleString()}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'right', color: '#475569' }}>{(row.ctr * 100).toFixed(2)}%</td>
                          <td style={{ padding: '10px 16px', textAlign: 'right', color: '#475569' }}>{row.position.toFixed(1)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Section 4: Post table ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={S.sectionLabel}>All Published Posts ({filteredPosts.length})</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {([
              { key: 'all',         label: 'All' },
              { key: 'no-facebook', label: 'Missing Facebook' },
              { key: 'no-video',    label: 'No Video' },
            ] as const).map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                  cursor: 'pointer', border: '1px solid #e2e8f0',
                  background: filter === f.key ? '#1E3A5F' : '#fff',
                  color: filter === f.key ? '#fff' : '#475569',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Post</th>
                <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Published</th>
                <th style={{ padding: '10px 16px', textAlign: 'center', color: '#64748b', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>👥 FB</th>
                <th style={{ padding: '10px 16px', textAlign: 'center', color: '#64748b', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>🎬 Reel</th>
                <th style={{ padding: '10px 16px', textAlign: 'center', color: '#64748b', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>▶️ YT</th>
                <th style={{ padding: '10px 16px', textAlign: 'center', color: '#64748b', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>🎵 TT</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post, i) => {
                const color = CATEGORY_COLORS[post.category] ?? '#64748b'
                return (
                  <tr key={post._id} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : undefined }}>
                    <td style={{ padding: '10px 16px', maxWidth: 420 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, background: `${color}18`, color, flexShrink: 0 }}>
                          {post.category?.replace(/-/g, ' ')}
                        </span>
                        <a
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: 13, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          title={post.title}
                        >
                          {post.title}
                        </a>
                      </div>
                    </td>
                    <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{fmt(post.publishedAt)}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                      {post.hasFacebook && post.facebookPostUrl
                        ? <a href={post.facebookPostUrl} target="_blank" rel="noopener noreferrer" title="View Facebook post"><Check yes /></a>
                        : <Check yes={post.hasFacebook} />}
                    </td>
                    <td style={{ padding: '10px 16px', textAlign: 'center' }}><Check yes={post.hasFacebookReel} /></td>
                    <td style={{ padding: '10px 16px', textAlign: 'center' }}><Check yes={post.hasYouTube} /></td>
                    <td style={{ padding: '10px 16px', textAlign: 'center' }}><Check yes={post.hasTikTok} /></td>
                  </tr>
                )
              })}
              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '40px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                    No posts match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f8f7f4',
    fontFamily: 'Inter, -apple-system, sans-serif',
    color: '#1a1a1a',
  },
  header: {
    background: '#1E3A5F',
    padding: '20px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.5)',
    display: 'block',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: '#fff',
    margin: '0 0 4px',
    letterSpacing: '-0.02em',
  },
  headerSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: '#64748b',
    marginBottom: 12,
  },
}
