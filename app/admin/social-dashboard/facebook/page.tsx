'use client'

import { useEffect, useState } from 'react'
import type { SocialDashboardPost } from '@/sanity/queries'
import type { FacebookOverview } from '@/lib/facebook-client'

type Data = {
  posts: SocialDashboardPost[]
  facebook: FacebookOverview | null
  stats: {
    total: number
    withFacebook: number
    withFacebookReel: number
    thisMonth: number
    facebookConnected: boolean
  }
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
function fmtCompact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

function StatCard({ label, value, sub, accent = '#1877f2' }: {
  label: string; value: string | number; sub?: string; accent?: string
}) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 22px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: accent, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8' }}>{sub}</div>}
    </div>
  )
}

const TYPE_LABEL: Record<string, string> = {
  photo: '📷 Photo',
  video: '🎬 Video',
  link: '🔗 Link',
  status: '📝 Status',
  reel: '🎥 Reel',
}

export default function FacebookPage() {
  const secret = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('secret') ?? ''
    : ''

  const [data, setData]       = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!secret) { setError('Unauthorized'); setLoading(false); return }
    fetch(`/api/social-dashboard?secret=${encodeURIComponent(secret)}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setData)
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [secret])

  if (loading) return <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>Loading…</div>
  if (error || !data) return <div style={{ color: '#dc2626', textAlign: 'center', padding: 40 }}>{error || 'No data'}</div>

  const { posts, facebook, stats } = data
  const fbPosts = posts.filter(p => p.hasFacebook)
  const reactionsSum = facebook
    ? Object.values(facebook.page.reactions28d).reduce((s, n) => s + n, 0)
    : 0

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          👥 Facebook
        </h1>
        <div style={{ fontSize: 13, color: '#64748b' }}>
          {facebook ? `${facebook.page.pageName} · last 28 days` : 'Posts & Reels published via Blotato'}
        </div>
      </div>

      {facebook ? (
        <>
          {/* Page-level stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 14 }}>
            <StatCard label="Page Reach"      value={fmtCompact(facebook.page.reach28d)}       sub="unique users (28d)" accent="#1877f2" />
            <StatCard label="Engagements"     value={fmtCompact(facebook.page.engagements28d)} sub="post engagements (28d)" accent="#16a34a" />
            <StatCard label="Video Views"     value={fmtCompact(facebook.page.videoViews28d)}  sub="last 28 days" accent="#e1306c" />
            <StatCard label="Followers"       value={fmtCompact(facebook.page.fanCount)}       sub="total" accent="#475569" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
            <StatCard label="Page Views"      value={fmtCompact(facebook.page.pageViews28d)}   sub="last 28 days" accent="#475569" />
            <StatCard label="Reactions"       value={fmtCompact(reactionsSum)}                  sub="all types (28d)" accent="#d97706" />
            <StatCard label="Posts on Page"   value={facebook.recentPosts.length}              sub="recent fetched" accent="#475569" />
            <StatCard label="Avg Reach/Post"  value={fmtCompact(facebook.recentPosts.length ? Math.round(facebook.recentPosts.reduce((s, p) => s + p.reach, 0) / facebook.recentPosts.length) : 0)} sub="across recent posts" accent="#0891b2" />
          </div>

          {/* Reactions breakdown */}
          {Object.keys(facebook.page.reactions28d).length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 22px', marginBottom: 28 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Reactions Breakdown — Last 28 Days</div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {Object.entries(facebook.page.reactions28d).map(([type, count]) => {
                  const emoji: Record<string, string> = { like: '👍', love: '❤️', wow: '😮', haha: '😂', sad: '😢', anger: '😠', thankful: '🙏', pride: '🏳️‍🌈' }
                  return (
                    <div key={type} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 22 }}>{emoji[type] ?? '•'}</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#1a1a1a' }}>{count}</span>
                      <span style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{type}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Top posts by reach */}
          {facebook.topPostsByReach.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12 }}>
                Top Posts by Reach
              </div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Post</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Type</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Reach</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Reactions</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Comments</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facebook.topPostsByReach.map((p, i) => (
                      <tr key={p.id} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : undefined }}>
                        <td style={{ padding: '10px 16px', maxWidth: 380 }}>
                          <a href={p.permalink} target="_blank" rel="noopener noreferrer"
                            style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                            title={p.message}>
                            {p.message.slice(0, 90) || '(no text)'}
                          </a>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{fmt(p.createdAt)}</div>
                        </td>
                        <td style={{ padding: '10px 16px', fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>{TYPE_LABEL[p.type] ?? p.type}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#1877f2' }}>{fmtCompact(p.reach)}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'right', color: '#475569' }}>{p.reactions}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'right', color: '#475569' }}>{p.comments}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'right', color: '#475569' }}>{p.clicks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* All recent posts */}
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12 }}>
            Recent Posts ({facebook.recentPosts.length})
          </div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Post</th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Date</th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Type</th>
                  <th style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Reach</th>
                  <th style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>👍 + ❤️</th>
                  <th style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>💬</th>
                </tr>
              </thead>
              <tbody>
                {facebook.recentPosts.map((p, i) => (
                  <tr key={p.id} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : undefined }}>
                    <td style={{ padding: '10px 16px', maxWidth: 360 }}>
                      <a href={p.permalink} target="_blank" rel="noopener noreferrer"
                        style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                        title={p.message}>
                        {p.message.slice(0, 80) || '(no text)'}
                      </a>
                    </td>
                    <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{fmt(p.createdAt)}</td>
                    <td style={{ padding: '10px 16px', fontSize: 11, color: '#64748b', whiteSpace: 'nowrap' }}>{TYPE_LABEL[p.type] ?? p.type}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#1a1a1a' }}>{fmtCompact(p.reach)}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', color: '#475569' }}>{p.reactions}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', color: '#475569' }}>{p.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          {/* Connect prompt fallback */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            <StatCard label="Posts via Blotato" value={stats.withFacebook}     sub="all time" accent="#1877f2" />
            <StatCard label="Reels via Blotato" value={stats.withFacebookReel} sub="all time" accent="#e1306c" />
            <StatCard label="Page Reach"        value="—" sub={stats.facebookConnected ? 'API error' : 'connect API'} accent="#cbd5e1" />
            <StatCard label="Engagements"       value="—" sub={stats.facebookConnected ? 'API error' : 'connect API'} accent="#cbd5e1" />
          </div>
          <div style={{ background: '#fff', border: '1.5px dashed #cbd5e1', borderRadius: 12, padding: '22px 24px', marginBottom: 28 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              {stats.facebookConnected ? '⚠️ Facebook API returned an error' : 'Connect Facebook Graph API'}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 12 }}>
              {stats.facebookConnected
                ? 'Token is set but the API returned an error. Check that the Page Access Token has the required scopes (pages_read_engagement, read_insights).'
                : 'Set FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID env vars to display page reach, engagements, video views, and per-post stats.'}
            </div>
          </div>
        </>
      )}

      {/* Posts table — what we've published from the blog pipeline */}
      <div style={{ marginTop: 32, fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12 }}>
        Blog Posts Published to Facebook ({fbPosts.length})
      </div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Post</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Published</th>
              <th style={{ padding: '10px 16px', textAlign: 'center', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Reel</th>
              <th style={{ padding: '10px 16px', textAlign: 'center', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>FB Post</th>
            </tr>
          </thead>
          <tbody>
            {fbPosts.map((post, i) => (
              <tr key={post._id} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : undefined }}>
                <td style={{ padding: '10px 16px', maxWidth: 420 }}>
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                    title={post.title}>
                    {post.title}
                  </a>
                </td>
                <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{fmt(post.publishedAt)}</td>
                <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                  <span style={{ fontSize: 11, color: post.hasFacebookReel ? '#e1306c' : '#cbd5e1' }}>
                    {post.hasFacebookReel ? '🎬' : '—'}
                  </span>
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                  {post.facebookPostUrl
                    ? <a href={post.facebookPostUrl} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 12, color: '#1877f2', textDecoration: 'none', fontWeight: 600 }}>
                        View →
                      </a>
                    : <span style={{ fontSize: 11, color: '#94a3b8' }}>—</span>}
                </td>
              </tr>
            ))}
            {fbPosts.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '40px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                  No posts have been published to Facebook yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
