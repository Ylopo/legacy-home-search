'use client'

import { useEffect, useState } from 'react'
import type { SocialDashboardPost } from '@/sanity/queries'

type Data = {
  posts: SocialDashboardPost[]
  stats: { total: number; withTikTok: number; thisMonth: number }
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StatCard({ label, value, sub, accent = '#010101' }: {
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

export default function TikTokPage() {
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
  const ttPosts = posts.filter(p => p.hasTikTok)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          🎵 TikTok
        </h1>
        <div style={{ fontSize: 13, color: '#64748b' }}>Videos published via Blotato</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label="Videos Posted"  value={stats.withTikTok}  sub="all time"    accent="#010101" />
        <StatCard label="This Month"      value={stats.thisMonth}   sub="blog posts"  accent="#475569" />
        <StatCard label="Views"           value="—"                 sub="connect API" accent="#cbd5e1" />
        <StatCard label="Likes"           value="—"                 sub="connect API" accent="#cbd5e1" />
      </div>

      {/* Connect prompt */}
      <div style={{ background: '#fff', border: '1.5px dashed #cbd5e1', borderRadius: 12, padding: '22px 24px', marginBottom: 28, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 28, flexShrink: 0 }}>📊</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>TikTok Analytics — Phase 2</div>
          <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 12 }}>
            Connect the TikTok Business API to see video views, likes, comments, shares, reach, and follower growth over time.
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#475569' }}>
            <strong>Env vars needed:</strong>
            <span style={{ fontFamily: 'monospace', marginLeft: 8, color: '#2563eb' }}>
              TIKTOK_ACCESS_TOKEN, TIKTOK_OPEN_ID
            </span>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
            Apply at <strong>developers.tiktok.com</strong> for Business API access. Review typically takes 1–3 business days.
          </div>
        </div>
      </div>

      {/* Videos table */}
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12 }}>
        Videos Submitted to TikTok ({ttPosts.length})
      </div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Post</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Published</th>
              <th style={{ padding: '10px 16px', textAlign: 'center', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Views</th>
              <th style={{ padding: '10px 16px', textAlign: 'center', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Likes</th>
            </tr>
          </thead>
          <tbody>
            {ttPosts.map((post, i) => (
              <tr key={post._id} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : undefined }}>
                <td style={{ padding: '10px 16px', maxWidth: 420 }}>
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                    title={post.title}>
                    {post.title}
                  </a>
                </td>
                <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{fmt(post.publishedAt)}</td>
                <td style={{ padding: '10px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>—</td>
                <td style={{ padding: '10px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 12 }}>—</td>
              </tr>
            ))}
            {ttPosts.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '40px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                  No videos have been submitted to TikTok yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
