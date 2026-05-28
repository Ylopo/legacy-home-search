'use client'

import { useEffect, useState } from 'react'
import type { SocialDashboardPost } from '@/sanity/queries'
import type { InstagramOverview } from '@/lib/instagram-client'
import { useUrlSecret } from '@/hooks/useUrlSecret'

type DashData = {
  posts: SocialDashboardPost[]
  stats: { total: number; withInstagram: number; thisMonth: number }
  instagram?: InstagramOverview | null
  instagramError?: string | null
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function Stat({ label, value, sub, color = '#e1306c' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 22px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8' }}>{sub}</div>}
    </div>
  )
}

export default function InstagramPage() {
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
          posts:          social.posts ?? [],
          stats:          social.stats ?? { total: 0, withInstagram: 0, thisMonth: 0 },
          instagram:      analytics.instagram ?? null,
          instagramError: analytics.instagramError ?? null,
        })
      })
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [secret])

  if (loading) return <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>Loading…</div>
  if (error || !data) return <div style={{ color: '#dc2626', textAlign: 'center', padding: 40 }}>{error || 'No data'}</div>

  const { posts, stats, instagram } = data
  const igPosts = posts.filter(p => p.hasInstagram)
  const profile = instagram?.profile
  const topPosts = instagram?.topPostsByReach ?? []

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>📸</div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Instagram{profile ? ` · @${profile.username}` : ''}
          </h1>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Posts via Blotato · <a href={`/admin/social-dashboard?secret=${secret}`} style={{ color: '#2563eb', textDecoration: 'none' }}>← Content Dashboard</a>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <Stat label="Posts Published"  value={stats.withInstagram}           sub="via Blotato"   color="#e1306c" />
        <Stat label="This Month"       value={stats.thisMonth}               sub="blog posts"    color="#475569" />
        <Stat label="Followers"        value={profile ? profile.followers.toLocaleString() : '—'} sub={profile ? 'Instagram' : 'connect API'} color={profile ? '#e1306c' : '#cbd5e1'} />
        <Stat label="Posts on Account" value={profile ? profile.mediaCount.toLocaleString() : '—'} sub={profile ? 'total media' : 'connect API'} color={profile ? '#e1306c' : '#cbd5e1'} />
      </div>

      {/* Not connected prompt */}
      {!instagram && (
        <div style={{ background: '#fff', border: '1.5px dashed #cbd5e1', borderRadius: 12, padding: '20px 22px', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Instagram Analytics not connected</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
            Connect via the <a href={`/admin/connect?secret=${secret}`} style={{ color: '#2563eb' }}>Platform Connections wizard</a> to see follower counts, post reach, and impressions.
          </div>
          <div style={{ fontSize: 12, color: '#475569', background: '#f8fafc', borderRadius: 8, padding: '10px 14px', fontFamily: 'monospace' }}>
            Required: INSTAGRAM_ACCESS_TOKEN · INSTAGRAM_BUSINESS_ACCOUNT_ID
          </div>
        </div>
      )}

      {/* Top posts by reach */}
      {topPosts.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12 }}>
            Top Posts by Reach
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
            {topPosts.slice(0, 9).map(post => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden', textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                {post.thumbnailUrl && (
                  <div style={{ height: 120, background: '#f1f5f9', overflow: 'hidden' }}>
                    <img src={post.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                    <span style={{ color: '#64748b' }}>👁 {post.reach.toLocaleString()}</span>
                    <span style={{ color: '#64748b' }}>❤️ {post.likeCount.toLocaleString()}</span>
                    <span style={{ color: '#64748b' }}>💬 {post.commentsCount.toLocaleString()}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{fmt(post.timestamp)}</div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      {/* Posts table */}
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12 }}>
        Submitted via Blotato ({igPosts.length})
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
            {igPosts.map((post, i) => (
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
            {igPosts.length === 0 && (
              <tr><td colSpan={3} style={{ padding: '40px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No posts submitted to Instagram yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
