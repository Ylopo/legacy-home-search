'use client'

import { useEffect, useState } from 'react'
import type { SocialDashboardPost } from '@/sanity/queries'

type Data = {
  posts: SocialDashboardPost[]
  stats: { total: number; withFacebook: number; withFacebookReel: number; thisMonth: number }
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function PlaceholderStat({ label, sub }: { label: string; sub: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 22px', opacity: 0.5 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: '#cbd5e1', lineHeight: 1, marginBottom: 4 }}>—</div>
      <div style={{ fontSize: 11, color: '#94a3b8' }}>{sub}</div>
    </div>
  )
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

  const { posts, stats } = data
  const fbPosts = posts.filter(p => p.hasFacebook)
  const reelPosts = posts.filter(p => p.hasFacebookReel)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          👥 Facebook
        </h1>
        <div style={{ fontSize: 13, color: '#64748b' }}>Posts &amp; Reels published via Blotato</div>
      </div>

      {/* Posting stats (from Sanity — always available) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label="Posts Published"  value={stats.withFacebook}     sub="all time"       accent="#1877f2" />
        <StatCard label="Reels Published"  value={stats.withFacebookReel} sub="all time"       accent="#e1306c" />
        <StatCard label="This Month"       value={stats.thisMonth}         sub="blog posts"     accent="#475569" />
        <StatCard label="Total Blog Posts" value={stats.total}             sub="in Sanity"      accent="#475569" />
      </div>

      {/* Native analytics connect prompt */}
      <div style={{ background: '#fff', border: '1.5px dashed #cbd5e1', borderRadius: 12, padding: '22px 24px', marginBottom: 28, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 28, flexShrink: 0 }}>📊</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Native Facebook Analytics — Phase 2</div>
          <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 12 }}>
            Connect your Facebook Page Access Token to unlock reach, impressions, post engagements, video views, and Reel plays per post.
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#475569' }}>
            <strong>Env vars needed:</strong>
            <span style={{ fontFamily: 'monospace', marginLeft: 8, color: '#2563eb' }}>
              FACEBOOK_PAGE_ACCESS_TOKEN, FACEBOOK_PAGE_ID
            </span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, flexShrink: 0 }}>
          {['Page Reach', 'Post Impressions', 'Engagements', 'Reel Plays'].map(m => (
            <PlaceholderStat key={m} label={m} sub="connect to see" />
          ))}
        </div>
      </div>

      {/* Posts table */}
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12 }}>
        Posts Published to Facebook ({fbPosts.length})
      </div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Post</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Published</th>
              <th style={{ padding: '10px 16px', textAlign: 'center', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Reel</th>
              <th style={{ padding: '10px 16px', textAlign: 'center', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Facebook Post</th>
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
                    {post.hasFacebookReel ? '🎬 Yes' : '—'}
                  </span>
                </td>
                <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                  {post.facebookPostUrl
                    ? <a href={post.facebookPostUrl} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: 12, color: '#1877f2', textDecoration: 'none', fontWeight: 600 }}>
                        View post →
                      </a>
                    : <span style={{ fontSize: 11, color: '#94a3b8' }}>No URL stored</span>}
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

      {/* Reels table if different from posts */}
      {reelPosts.length > 0 && reelPosts.some(p => !p.hasFacebook) && (
        <>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12 }}>
            Reels Only ({reelPosts.filter(p => !p.hasFacebook).length})
          </div>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Post</th>
                  <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Published</th>
                </tr>
              </thead>
              <tbody>
                {reelPosts.filter(p => !p.hasFacebook).map((post, i) => (
                  <tr key={post._id} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : undefined }}>
                    <td style={{ padding: '10px 16px' }}>
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                        style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: 13 }}>
                        {post.title}
                      </a>
                    </td>
                    <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 12 }}>{fmt(post.publishedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
