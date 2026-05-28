'use client'

import { useEffect, useState } from 'react'
import type { SocialDashboardPost } from '@/sanity/queries'
import type { LinkedInOverview } from '@/lib/linkedin-client'
import { useUrlSecret } from '@/hooks/useUrlSecret'

type DashData = {
  posts: SocialDashboardPost[]
  stats: { total: number; withLinkedIn: number; thisMonth: number }
  linkedin?: LinkedInOverview | null
  linkedinError?: string | null
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function Stat({ label, value, sub, color = '#0a66c2' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 22px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8' }}>{sub}</div>}
    </div>
  )
}

export default function LinkedInPage() {
  const secret = useUrlSecret()
  const [data, setData]       = useState<DashData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!secret) return
    Promise.all([
      fetch(`/api/social-dashboard?secret=${encodeURIComponent(secret)}`).then(r => r.json()),
      fetch(`/api/analytics/overview?secret=${encodeURIComponent(secret)}&days=28`).then(r => r.json()),
    ])
      .then(([social, analytics]) => {
        setData({
          posts:         social.posts ?? [],
          stats:         social.stats ?? { total: 0, withLinkedIn: 0, thisMonth: 0 },
          linkedin:      analytics.linkedin ?? null,
          linkedinError: analytics.linkedinError ?? null,
        })
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [secret])

  if (loading) return <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>Loading…</div>
  if (error || !data) return <div style={{ color: '#dc2626', textAlign: 'center', padding: 40 }}>{error || 'No data'}</div>

  const { posts, stats, linkedin } = data
  const liPosts = posts.filter(p => p.hasLinkedIn)
  const profile  = linkedin?.profile
  const apiPosts = linkedin?.recentPosts ?? []
  const totalImpressions = apiPosts.reduce((s, p) => s + p.impressions, 0)
  const totalClicks      = apiPosts.reduce((s, p) => s + p.clicks, 0)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 48, height: 48, borderRadius: 10, background: '#0a66c2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>💼</div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            LinkedIn{profile ? ` · ${profile.name}` : ''}
          </h1>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Posts via Blotato · <a href={`/admin/social-dashboard?secret=${secret}`} style={{ color: '#2563eb', textDecoration: 'none' }}>← Content Dashboard</a>
          </div>
        </div>
      </div>

      {/* Token expiry warning */}
      {linkedin?.tokenExpiresWarning && (
        <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#92400e' }}>
          ⚠️ LinkedIn token is expiring soon. Go to the{' '}
          <a href={`/admin/connect?secret=${secret}`} style={{ color: '#92400e', fontWeight: 700 }}>Platform Connections</a>{' '}
          wizard and reconnect LinkedIn before the token expires (60-day limit).
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <Stat label="Posts Published"   value={stats.withLinkedIn}                            sub="via Blotato"     color="#0a66c2" />
        <Stat label="This Month"        value={stats.thisMonth}                               sub="blog posts"      color="#475569" />
        <Stat label="Followers"         value={profile ? profile.followers.toLocaleString() : '—'} sub={profile ? 'company page' : 'connect API'} color={profile ? '#0a66c2' : '#cbd5e1'} />
        <Stat label="Impressions (28d)" value={totalImpressions > 0 ? totalImpressions.toLocaleString() : '—'} sub={totalImpressions > 0 ? 'recent posts' : 'connect API'} color={totalImpressions > 0 ? '#0a66c2' : '#cbd5e1'} />
      </div>

      {/* Not connected prompt */}
      {!linkedin && (
        <div style={{ background: '#fff', border: '1.5px dashed #cbd5e1', borderRadius: 12, padding: '20px 22px', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>LinkedIn Analytics not connected</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
            Connect via the <a href={`/admin/connect?secret=${secret}`} style={{ color: '#2563eb' }}>Platform Connections wizard</a> to see follower growth, post impressions, and engagement.
          </div>
          <div style={{ fontSize: 12, color: '#475569', background: '#f8fafc', borderRadius: 8, padding: '10px 14px', fontFamily: 'monospace' }}>
            Required: LINKEDIN_ACCESS_TOKEN · LINKEDIN_ORGANIZATION_ID
          </div>
        </div>
      )}

      {/* Recent posts from LinkedIn API */}
      {apiPosts.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12 }}>
            Recent Posts — LinkedIn Insights
          </div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Post</th>
                  <th style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Impressions</th>
                  <th style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Clicks</th>
                  <th style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Reactions</th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Published</th>
                </tr>
              </thead>
              <tbody>
                {apiPosts.map((post, i) => (
                  <tr key={post.id} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : undefined }}>
                    <td style={{ padding: '10px 16px', maxWidth: 340 }}>
                      <a href={post.postUrl} target="_blank" rel="noopener noreferrer"
                        style={{ color: '#1a1a1a', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                        {post.commentary || '(no text)'}
                      </a>
                    </td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#1a1a1a' }}>{post.impressions.toLocaleString()}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', color: '#475569' }}>{post.clicks.toLocaleString()}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', color: '#475569' }}>{post.reactions.toLocaleString()}</td>
                    <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{fmt(post.publishedAt)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <td style={{ padding: '10px 16px', fontWeight: 700, fontSize: 12, color: '#64748b' }}>Total</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700 }}>{totalImpressions.toLocaleString()}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700 }}>{totalClicks.toLocaleString()}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </>
      )}

      {/* Posts table from Blotato */}
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12 }}>
        Submitted via Blotato ({liPosts.length})
      </div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Post</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Published</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Category</th>
            </tr>
          </thead>
          <tbody>
            {liPosts.map((post, i) => (
              <tr key={post._id} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : undefined }}>
                <td style={{ padding: '10px 16px', maxWidth: 420 }}>
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#1a1a1a', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                    title={post.title}>{post.title}</a>
                </td>
                <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{fmt(post.publishedAt)}</td>
                <td style={{ padding: '10px 16px', color: '#94a3b8', fontSize: 12 }}>{post.category?.replace(/-/g, ' ')}</td>
              </tr>
            ))}
            {liPosts.length === 0 && (
              <tr><td colSpan={3} style={{ padding: '40px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No posts submitted to LinkedIn yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
