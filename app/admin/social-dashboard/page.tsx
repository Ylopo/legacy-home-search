'use client'

import { useEffect, useState } from 'react'
import type { SocialDashboardPost } from '@/sanity/queries'
import type { GSCOverview } from '@/lib/gsc-client'
import { useUrlSecret } from '@/hooks/useUrlSecret'

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
    withLinkedIn: number
    withTwitter: number
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

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function pct(n: number, total: number) {
  return total ? `${Math.round((n / total) * 100)}%` : '0%'
}

function StatCard({ label, value, sub, accent = '#1E3A5F' }: {
  label: string; value: string | number; sub?: string; accent?: string
}) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 22px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: accent, lineHeight: 1, marginBottom: 4 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8' }}>{sub}</div>}
    </div>
  )
}

function PlatformBar({ label, icon, count, total, color }: {
  label: string; icon: string; count: number; total: number; color: string
}) {
  const pctVal = total ? (count / total) * 100 : 0
  const width = `${Math.max(4, isNaN(pctVal) ? 0 : pctVal)}%`
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <span style={{ fontSize: 15, width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 13, color: '#475569', width: 130, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 99, height: 8, overflow: 'hidden' }}>
        <div style={{ width, background: color, height: '100%', borderRadius: 99, transition: 'width 0.4s' }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', width: 36, textAlign: 'right', flexShrink: 0 }}>{count}</span>
      <span style={{ fontSize: 11, color: '#94a3b8', width: 34, flexShrink: 0 }}>{pct(count, total)}</span>
    </div>
  )
}

function WeekChart({ weeks }: { weeks: { label: string; count: number }[] }) {
  const max = Math.max(...weeks.map(w => w.count), 1)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 56, marginBottom: 6 }}>
        {weeks.map((w, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
              width: '100%', borderRadius: '3px 3px 0 0',
              background: i === weeks.length - 1 ? '#2563eb' : '#bfdbfe',
              height: `${(w.count / max) * 48}px`,
              minHeight: w.count > 0 ? 4 : 0,
              transition: 'height 0.3s',
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 5 }}>
        {weeks.map((w, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: i === weeks.length - 1 ? '#2563eb' : '#1a1a1a' }}>{w.count}</div>
            <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}>{w.label}</div>
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
      color: yes ? '#16a34a' : '#cbd5e1', fontSize: 11, fontWeight: 700,
    }}>
      {yes ? '✓' : '–'}
    </span>
  )
}

const SL = { fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#64748b', marginBottom: 12 }

export default function SocialDashboardHome() {
  const secret = useUrlSecret()

  const [data, setData]       = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [filter, setFilter]   = useState<'all' | 'no-facebook' | 'no-video'>('all')

  useEffect(() => {
    if (!secret) return
    fetch(`/api/social-dashboard?secret=${encodeURIComponent(secret)}`)
      .then(r => r.ok ? r.json() : Promise.reject('Unauthorized'))
      .then(setData)
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false))
  }, [secret])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>Loading dashboard…</div>
  )
  if (error || !data) return (
    <div style={{ color: '#dc2626', textAlign: 'center', padding: 40 }}>{error || 'No data'}</div>
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
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

      {/* Page title */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>Content Dashboard</h1>
        <div style={{ fontSize: 13, color: '#64748b' }}>
          {stats.total} total posts · data as of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          &nbsp;·&nbsp;
          <a href={`/admin/va-queue?secret=${secret}`} style={{ color: '#2563eb', textDecoration: 'none' }}>← Media Queue</a>
        </div>
      </div>

      {/* Health alerts */}
      {healthAlerts.length > 0 && (
        <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: 10, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>⚠ Pipeline alerts:</span>
          {healthAlerts.map((a, i) => (
            <span key={i} style={{ fontSize: 12, color: '#92400e', background: '#fef3c7', borderRadius: 6, padding: '2px 8px' }}>{a}</span>
          ))}
        </div>
      )}

      {/* ── Blog Pipeline ── */}
      <div style={SL}>Blog Pipeline</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Total Posts"   value={stats.total}                     sub="all time" />
        <StatCard label="This Month"    value={stats.thisMonth}                  sub="published" accent="#2563eb" />
        <StatCard label="In Queue"      value={totalQueue}                       sub={`${queue.media_pending} need media · ${queue.media_ready} ready`} accent={totalQueue > 0 ? '#d97706' : '#16a34a'} />
        <StatCard label="Posts / Week"  value={(stats.total / 8).toFixed(1)}    sub="8-week avg" />
      </div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 22px', marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 14 }}>Weekly Posting Volume — Last 8 Weeks</div>
        <WeekChart weeks={weeks} />
      </div>

      {/* ── Social Distribution ── */}
      <div style={SL}>Social Distribution</div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '22px', marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Platform coverage — {stats.total} total posts
            </div>
            <PlatformBar label="Facebook Post"  icon="👥" count={stats.withFacebook}     total={stats.total} color="#1877f2" />
            <PlatformBar label="Facebook Reel"  icon="🎬" count={stats.withFacebookReel}  total={stats.total} color="#e1306c" />
            <PlatformBar label="YouTube"         icon="▶️" count={stats.withYouTube}      total={stats.total} color="#ff0000" />
            <PlatformBar label="TikTok"          icon="🎵" count={stats.withTikTok}       total={stats.total} color="#010101" />
            <PlatformBar label="LinkedIn"        icon="💼" count={stats.withLinkedIn ?? 0}     total={stats.total} color="#0a66c2" />
            <PlatformBar label="X / Twitter"     icon="𝕏" count={stats.withTwitter ?? 0}      total={stats.total} color="#000000" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Quick links
            </div>
            {[
              { label: 'Facebook analytics',  path: '/admin/social-dashboard/facebook',      count: stats.withFacebook,     color: '#1877f2' },
              { label: 'YouTube analytics',    path: '/admin/social-dashboard/youtube',       count: stats.withYouTube,      color: '#ff0000' },
              { label: 'TikTok analytics',     path: '/admin/social-dashboard/tiktok',        count: stats.withTikTok,       color: '#000' },
              { label: 'LinkedIn analytics',   path: '/admin/social-dashboard/linkedin',      count: stats.withLinkedIn,     color: '#0a66c2' },
              { label: 'X / Twitter',          path: '/admin/social-dashboard/twitter',       count: stats.withTwitter,      color: '#000' },
              { label: 'Google Search',        path: '/admin/social-dashboard/google-search', count: gsc?.clicks ?? null,    color: '#2563eb' },
            ].map(({ label, path, count, color }) => (
              <a key={label}
                href={`${path}?secret=${encodeURIComponent(secret)}`}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: 'inherit' }}
              >
                <span style={{ fontSize: 13, color: '#475569' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color }}>
                  {count !== null ? count.toLocaleString() : '–'} →
                </span>
              </a>
            ))}
            <div style={{ marginTop: 14, padding: '10px', background: '#f8fafc', borderRadius: 8, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
              Click any platform to view deeper analytics.
            </div>
          </div>
        </div>
      </div>

      {/* ── Post Table ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={SL}>All Published Posts ({filteredPosts.length})</div>
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
              {['Post', 'Published', '👥 FB', '🎬 Reel', '▶️ YT', '🎵 TT', '💼 LI', '𝕏 X'].map((h, i) => (
                <th key={h} style={{ padding: '10px 16px', textAlign: i <= 1 ? 'left' : 'center', color: '#64748b', fontWeight: 600, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post, i) => {
              const color = CATEGORY_COLORS[post.category] ?? '#64748b'
              return (
                <tr key={post._id} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : undefined }}>
                  <td style={{ padding: '10px 16px', maxWidth: 420 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: `${color}18`, color, flexShrink: 0 }}>
                        {post.category?.replace(/-/g, ' ')}
                      </span>
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                        style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title={post.title}>
                        {post.title}
                      </a>
                    </div>
                  </td>
                  <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{fmt(post.publishedAt)}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                    {post.hasFacebook && post.facebookPostUrl
                      ? <a href={post.facebookPostUrl} target="_blank" rel="noopener noreferrer"><Check yes /></a>
                      : <Check yes={post.hasFacebook} />}
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}><Check yes={post.hasFacebookReel} /></td>
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}><Check yes={post.hasYouTube} /></td>
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}><Check yes={post.hasTikTok} /></td>
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}><Check yes={post.hasLinkedIn} /></td>
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}><Check yes={post.hasTwitter} /></td>
                </tr>
              )
            })}
            {filteredPosts.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '40px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                  No posts match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
