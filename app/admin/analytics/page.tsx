'use client'

import { useEffect, useState } from 'react'
import { AdminNav } from '@/components/AdminNav'

// ── Types ──────────────────────────────────────────────────────────────────────

type Overview = {
  generatedAt: string
  days: number
  content: {
    totalPosts: number
    postsThisMonth: number
    postsLastMonth: number
    videoPostsThisMonth: number
    weeks: { label: string; count: number }[]
    coverage: Record<string, number>
    categoryBreakdown: { category: string; count: number }[]
  }
  website: {
    sessions: number; pageViews: number; activeUsers: number; avgEngagementSec: number
    channels: { channel: string; sessions: number; pageViews: number }[]
    trend: { date: string; sessions: number; pageViews: number }[]
  } | null
  websiteError: string | null
  search: {
    clicks: number; impressions: number; ctr: number; position: number
    trend: { date: string; clicks: number; impressions: number }[]
    topPages: { page: string; clicks: number; impressions: number; ctr: number; position: number }[]
    topQueries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[]
    devices: { device: string; clicks: number; impressions: number }[]
  } | null
  searchError: string | null
  youtube: {
    channel: { channelTitle: string; subscribers: number; totalViews: number; videoCount: number; thumbnailUrl?: string }
    topVideos: { videoId: string; title: string; publishedAt: string; views: number; likes: number; comments: number }[]
    recentViews: number; recentLikes: number; recentComments: number
  } | null
  youtubeError: string | null
  facebook: {
    page: { pageName: string; reach28d: number; engagements28d: number; videoViews28d: number; pageViews28d: number; fanCount: number }
    topPostsByReach: { id: string; message: string; createdAt: string; reach: number; reactions: number; comments: number; shares: number; videoViews?: number; type: string }[]
  } | null
  facebookError: string | null
  estimatedReach: number
  connected: { ga4: boolean; gsc: boolean; youtube: boolean; facebook: boolean }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 10_000)    return (n / 1_000).toFixed(0) + 'K'
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K'
  return n.toLocaleString()
}
function fmtPct(n: number) { return (n * 100).toFixed(1) + '%' }
function fmtTime(sec: number) {
  const m = Math.floor(sec / 60); const s = sec % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}
function pctChange(current: number, previous: number) {
  if (!previous) return null
  return Math.round(((current - previous) / previous) * 100)
}
function labelCategory(cat: string) {
  return cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

// ── Inline SVG Charts ──────────────────────────────────────────────────────────

function BarChart({ data, color = '#2563eb', height = 80 }: {
  data: { label: string; count: number }[]
  color?: string
  height?: number
}) {
  const max = Math.max(...data.map(d => d.count), 1)
  const W = 600; const BAR_W = Math.floor((W - (data.length - 1) * 4) / data.length)
  return (
    <svg viewBox={`0 0 ${W} ${height + 20}`} style={{ width: '100%', height: height + 20 }}>
      {data.map((d, i) => {
        const bh = Math.max(2, (d.count / max) * height)
        const x = i * (BAR_W + 4)
        const y = height - bh
        return (
          <g key={i}>
            <rect x={x} y={y} width={BAR_W} height={bh} fill={color} rx={2} opacity={0.85} />
            {d.count > 0 && (
              <text x={x + BAR_W / 2} y={y - 3} textAnchor="middle" fontSize={9} fill="#64748b">{d.count}</text>
            )}
            <text x={x + BAR_W / 2} y={height + 14} textAnchor="middle" fontSize={8} fill="#94a3b8">{d.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

function SparkLine({ data, color = '#2563eb', height = 48 }: {
  data: number[]
  color?: string
  height?: number
}) {
  if (data.length < 2) return null
  const max = Math.max(...data, 1); const min = 0
  const W = 300
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W
    const y = height - ((v - min) / (max - min)) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${height}`} style={{ width: '100%', height }} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <polyline
        points={`0,${height} ${pts} ${W},${height}`}
        fill={color} opacity={0.08}
      />
    </svg>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function KPICard({ label, value, sub, trend, color = '#2563eb', icon }: {
  label: string; value: string; sub?: string; trend?: number | null; color?: string; icon?: string
}) {
  const trendColor = trend === null || trend === undefined ? '' : trend >= 0 ? '#16a34a' : '#dc2626'
  const trendArrow = trend === null || trend === undefined ? '' : trend >= 0 ? '↑' : '↓'
  return (
    <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', padding: '20px 22px', borderLeft: `4px solid ${color}` }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
        {icon && <span style={{ marginRight: 6 }}>{icon}</span>}{label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1, marginBottom: 4 }}>{value}</div>
      {(sub || trend !== null && trend !== undefined) && (
        <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 8 }}>
          {sub && <span>{sub}</span>}
          {trend !== null && trend !== undefined && (
            <span style={{ color: trendColor, fontWeight: 600 }}>{trendArrow} {Math.abs(trend)}% vs last month</span>
          )}
        </div>
      )}
    </div>
  )
}

function SectionHeader({ title, sub, color = '#0f172a' }: { title: string; sub?: string; color?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 16, fontWeight: 800, color, margin: 0, letterSpacing: '-0.02em' }}>{title}</h2>
      {sub && <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{sub}</p>}
    </div>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, ...style }}>
      {children}
    </div>
  )
}

function PlatformBadge({ icon, label, count, color, total }: {
  icon: string; label: string; count: number; color: string; total: number
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{label}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color }}>{count} posts</span>
        </div>
        <div style={{ height: 4, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.6s ease' }} />
        </div>
      </div>
      <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>{pct}%</span>
    </div>
  )
}

function NotConnected({ platform }: { platform: string }) {
  return (
    <div style={{ padding: '16px', background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: 10, color: '#94a3b8', fontSize: 13, textAlign: 'center' }}>
      {platform} not connected — <span style={{ color: '#64748b' }}>stats will appear once credentials are configured</span>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [data, setData]       = useState<Overview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [days, setDays]       = useState(28)

  const secret = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('secret') ?? ''
    : ''

  useEffect(() => {
    if (!secret) { setError('Unauthorized'); setLoading(false); return }
    setLoading(true)
    fetch(`/api/analytics/overview?secret=${encodeURIComponent(secret)}&days=${days}`)
      .then(r => r.ok ? r.json() : Promise.reject('Unauthorized'))
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError('Failed to load analytics'); setLoading(false) })
  }, [secret, days])

  if (loading) return (
    <Shell>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: '#64748b', fontSize: 14 }}>Loading analytics…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </Shell>
  )
  if (error) return <Shell><p style={{ padding: 32, color: '#dc2626' }}>{error}</p></Shell>
  if (!data)  return null

  const { content, website, search, youtube, facebook, estimatedReach, connected } = data
  const postTrend = pctChange(content.postsThisMonth, content.postsLastMonth)

  // ── Derived metrics ────────────────────────────────────────────────────────
  const weeklyAvg = content.weeks.length
    ? Math.round(content.weeks.reduce((s, w) => s + w.count, 0) / content.weeks.length * 10) / 10
    : 0

  const totalPlatformPosts = content.totalPosts
  const searchTrend = search?.trend ?? []

  return (
    <Shell>
      {/* ── Header ── */}
      <div style={{ background: '#0f172a', color: '#fff', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Legacy Home Team · Content Machine</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Performance Report</h1>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            Generated {new Date(data.generatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {([28, 90] as const).map(d => (
            <button key={d} onClick={() => setDays(d)} style={{
              padding: '6px 14px', borderRadius: 20, border: '1px solid',
              borderColor: days === d ? '#2563eb' : '#334155',
              background: days === d ? '#2563eb' : 'transparent',
              color: days === d ? '#fff' : '#94a3b8',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>Last {d} days</button>
          ))}
          <button
            onClick={() => window.print()}
            style={{ padding: '6px 14px', borderRadius: 20, border: '1px solid #334155', background: 'transparent', color: '#94a3b8', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginLeft: 4 }}
          >Print / Save PDF</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 40 }}>

        {/* ── Hero KPIs ── */}
        <div>
          <SectionHeader
            title="Digital Mayor Scorecard"
            sub={`Your combined market presence across all channels — last ${days} days`}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <KPICard
              label="Estimated Reach"
              value={fmt(estimatedReach)}
              sub="Unique people reached"
              color="#2563eb"
              icon="🌐"
            />
            <KPICard
              label="Content Published"
              value={String(content.postsThisMonth)}
              sub="posts this month"
              trend={postTrend}
              color="#7c3aed"
              icon="✍️"
            />
            <KPICard
              label="Search Impressions"
              value={search ? fmt(search.impressions) : '—'}
              sub={search ? `${fmt(search.clicks)} clicks · pos ${search.position.toFixed(1)}` : 'Not connected'}
              color="#0891b2"
              icon="🔍"
            />
            <KPICard
              label="Avg Weekly Posts"
              value={`${weeklyAvg}`}
              sub={`${content.totalPosts} total published`}
              color="#059669"
              icon="📅"
            />
            {website && (
              <KPICard
                label="Website Sessions"
                value={fmt(website.sessions)}
                sub={`${fmt(website.pageViews)} pageviews`}
                color="#d97706"
                icon="👤"
              />
            )}
            {youtube && (
              <KPICard
                label="YouTube Views"
                value={fmt(youtube.recentViews)}
                sub={`${fmt(youtube.channel.subscribers)} subscribers`}
                color="#dc2626"
                icon="▶️"
              />
            )}
          </div>
        </div>

        {/* ── Content Machine Output ── */}
        <div>
          <SectionHeader
            title="Content Machine Output"
            sub="Publishing velocity and platform distribution"
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>
            <Card>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                Weekly Publishing Volume (last 12 weeks)
              </div>
              <BarChart data={content.weeks} color="#2563eb" height={100} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 20, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{content.postsThisMonth}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>This month</div>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{content.videoPostsThisMonth}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>With video</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{content.totalPosts}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>All-time posts</div>
                </div>
              </div>
            </Card>

            <Card>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Platform Distribution
              </div>
              <PlatformBadge icon="👥" label="Facebook" count={content.coverage.facebook} color="#1877F2" total={totalPlatformPosts} />
              <PlatformBadge icon="🎬" label="Facebook Reel" count={content.coverage.facebookReel} color="#1877F2" total={totalPlatformPosts} />
              <PlatformBadge icon="▶️" label="YouTube" count={content.coverage.youtube} color="#dc2626" total={totalPlatformPosts} />
              <PlatformBadge icon="🎵" label="TikTok" count={content.coverage.tiktok} color="#000000" total={totalPlatformPosts} />
              <PlatformBadge icon="💼" label="LinkedIn" count={content.coverage.linkedin} color="#0077B5" total={totalPlatformPosts} />
              <PlatformBadge icon="𝕏" label="X / Twitter" count={content.coverage.twitter} color="#000000" total={totalPlatformPosts} />
              <PlatformBadge icon="🧵" label="Threads" count={content.coverage.threads} color="#333333" total={totalPlatformPosts} />
            </Card>
          </div>
        </div>

        {/* ── Website Performance ── */}
        <div>
          <SectionHeader title="Website Performance" sub="Traffic and engagement from Google Analytics" />
          {!connected.ga4 ? <NotConnected platform="Google Analytics (GA4)" /> : !website ? (
            <div style={{ padding: 16, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, fontSize: 13, color: '#991b1b' }}>
              GA4 error: {data.websiteError}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
              <Card>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                  {[
                    { label: 'Sessions',       value: fmt(website.sessions),          icon: '📊' },
                    { label: 'Pageviews',       value: fmt(website.pageViews),         icon: '📄' },
                    { label: 'Active Users',    value: fmt(website.activeUsers),       icon: '👤' },
                    { label: 'Avg Engagement',  value: fmtTime(website.avgEngagementSec), icon: '⏱' },
                  ].map(({ label, value, icon }) => (
                    <div key={label} style={{ padding: '14px 16px', background: '#f8fafc', borderRadius: 10 }}>
                      <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{value}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                    </div>
                  ))}
                </div>
                {website.trend.length > 1 && (
                  <>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Daily Sessions</div>
                    <SparkLine data={website.trend.map(t => t.sessions)} color="#2563eb" height={52} />
                  </>
                )}
              </Card>
              <Card>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                  Traffic by Channel
                </div>
                {website.channels.map(ch => (
                  <div key={ch.channel} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: 13, color: '#1a1a1a' }}>{ch.channel}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>{fmt(ch.sessions)}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>sessions</div>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}
        </div>

        {/* ── Search Visibility ── */}
        <div>
          <SectionHeader title="Search Visibility" sub="Google Search Console — how people find the site organically" />
          {!connected.gsc ? <NotConnected platform="Google Search Console" /> : !search ? (
            <div style={{ padding: 16, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, fontSize: 13, color: '#991b1b' }}>
              GSC error: {data.searchError}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { label: 'Clicks',       value: fmt(search.clicks) },
                  { label: 'Impressions',  value: fmt(search.impressions) },
                  { label: 'Avg CTR',      value: fmtPct(search.ctr) },
                  { label: 'Avg Position', value: search.position.toFixed(1) },
                ].map(({ label, value }) => (
                  <Card key={label} style={{ padding: '16px 20px', borderLeft: '3px solid #7c3aed' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{value}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{label}</div>
                  </Card>
                ))}
              </div>
              {searchTrend.length > 1 && (
                <Card>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                    Daily Search Clicks
                  </div>
                  <SparkLine data={searchTrend.map(t => t.clicks)} color="#7c3aed" height={60} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>{searchTrend[0]?.date}</span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>{searchTrend[searchTrend.length - 1]?.date}</span>
                  </div>
                </Card>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <Card>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Top Search Queries</div>
                  {search.topQueries.slice(0, 8).map(q => (
                    <div key={q.query} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: 12, color: '#1a1a1a', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>{q.query}</span>
                      <div style={{ flexShrink: 0, textAlign: 'right' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed' }}>{q.clicks}</span>
                        <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 4 }}>clicks</span>
                      </div>
                    </div>
                  ))}
                </Card>
                <Card>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Top Pages by Clicks</div>
                  {search.topPages.slice(0, 8).map(p => {
                    const slug = p.page.replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '') || '/'
                    return (
                      <div key={p.page} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span style={{ fontSize: 11, color: '#475569', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 12 }}>{slug}</span>
                        <div style={{ flexShrink: 0, textAlign: 'right' }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: '#7c3aed' }}>{p.clicks}</span>
                          <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 4 }}>clicks</span>
                        </div>
                      </div>
                    )
                  })}
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* ── YouTube ── */}
        <div>
          <SectionHeader title="YouTube Channel" sub="Video performance — reach and engagement" />
          {!connected.youtube ? <NotConnected platform="YouTube" /> : !youtube ? (
            <div style={{ padding: 16, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, fontSize: 13, color: '#991b1b' }}>
              YouTube error: {data.youtubeError}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { label: 'Subscribers',   value: fmt(youtube.channel.subscribers) },
                  { label: 'Total Views',   value: fmt(youtube.channel.totalViews) },
                  { label: 'Videos',        value: fmt(youtube.channel.videoCount) },
                  { label: 'Recent Likes',  value: fmt(youtube.recentLikes) },
                ].map(({ label, value }) => (
                  <Card key={label} style={{ padding: '16px 20px', borderLeft: '3px solid #dc2626' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{value}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{label}</div>
                  </Card>
                ))}
              </div>
              <Card>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Top Videos by Views</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {youtube.topVideos.slice(0, 8).map(v => (
                    <a key={v.videoId} href={`https://youtube.com/watch?v=${v.videoId}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'flex', gap: 10, padding: '10px 12px', background: '#f8fafc', borderRadius: 8, textDecoration: 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#f8fafc')}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{v.title}</div>
                        <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#64748b' }}>
                          <span>▶ {fmt(v.views)} views</span>
                          <span>👍 {fmt(v.likes)}</span>
                          <span>💬 {v.comments}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* ── Facebook ── */}
        <div>
          <SectionHeader title="Facebook Page" sub="Page reach, engagement, and post performance" />
          {!connected.facebook ? <NotConnected platform="Facebook" /> : !facebook ? (
            <div style={{ padding: 16, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, fontSize: 13, color: '#991b1b' }}>
              Facebook error: {data.facebookError}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                {[
                  { label: 'Page Reach',    value: fmt(facebook.page.reach28d),       sub: `${days}d unique` },
                  { label: 'Engagements',   value: fmt(facebook.page.engagements28d), sub: `${days}d total` },
                  { label: 'Video Views',   value: fmt(facebook.page.videoViews28d),  sub: `${days}d total` },
                  { label: 'Followers',     value: fmt(facebook.page.fanCount),        sub: 'current' },
                ].map(({ label, value, sub }) => (
                  <Card key={label} style={{ padding: '16px 20px', borderLeft: '3px solid #1877F2' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>{value}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{label}</div>
                    <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 2 }}>{sub}</div>
                  </Card>
                ))}
              </div>
              {facebook.topPostsByReach.length > 0 && (
                <Card>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>Top Posts by Reach</div>
                  {facebook.topPostsByReach.slice(0, 6).map(post => (
                    <a key={post.id} href={`https://facebook.com/${post.id}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, padding: '10px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none' }}
                    >
                      <div style={{ fontSize: 12, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {post.message?.slice(0, 100) || '(no caption)'}
                      </div>
                      <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
                        <span style={{ fontSize: 12, color: '#1877F2', fontWeight: 700 }}>{fmt(post.reach)} reach</span>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>👍 {post.reactions}</span>
                        <span style={{ fontSize: 11, color: '#94a3b8' }}>💬 {post.comments}</span>
                      </div>
                    </a>
                  ))}
                </Card>
              )}
            </div>
          )}
        </div>

        {/* ── Category Breakdown ── */}
        <div>
          <SectionHeader title="Content Strategy" sub="Topics covered — building topical authority across your market" />
          <Card>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {content.categoryBreakdown.slice(0, 12).map(({ category, count }) => (
                <div key={category} style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: 10 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#2563eb', marginBottom: 2 }}>{count}</div>
                  <div style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>{labelCategory(category)}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Footer ── */}
        <div style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 32, borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>
            Legacy Home Search Content Machine · Report generated {new Date(data.generatedAt).toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 4 }}>
            Website · Facebook · YouTube · TikTok · LinkedIn · X · Threads
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          nav, button { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', fontFamily: 'Inter, sans-serif' }}>
      <AdminNav />
      {children}
    </div>
  )
}
