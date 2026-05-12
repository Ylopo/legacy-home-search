'use client'

import { useEffect, useState } from 'react'
import type { SocialDashboardPost } from '@/sanity/queries'
import { useUrlSecret } from '@/hooks/useUrlSecret'

type Data = {
  posts: SocialDashboardPost[]
  stats: { total: number; withInstagram: number; thisMonth: number }
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StatCard({ label, value, sub, accent = '#e1306c' }: {
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

const SETUP_STEPS = [
  {
    title: 'Instagram is connected via Blotato',
    body: 'Instagram posts are published automatically through your Blotato account (ID 45624). No separate API credentials are needed — Blotato handles the Meta/Instagram OAuth on your behalf.',
  },
  {
    title: 'Instagram Graph API analytics (optional)',
    body: 'Meta provides the Instagram Graph API for follower counts, impressions, reach, and engagement data. Visit developers.facebook.com → create an app with Instagram Graph API access.',
  },
  {
    title: 'Generate an access token',
    body: 'Under your Meta app, generate a long-lived Page Access Token with instagram_basic and instagram_manage_insights permissions. Your Instagram account must be a Professional account (Creator or Business) linked to a Facebook Page.',
  },
  {
    title: 'Note your Instagram Business Account ID',
    body: 'Retrieve your Instagram account ID via the Graph API: GET https://graph.facebook.com/me/accounts → then GET /{page-id}?fields=instagram_business_account',
  },
  {
    title: 'Add to Vercel env vars',
    body: 'Set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID in your Vercel project settings. Follower counts and post impressions will appear here on the next deploy.',
  },
]

export default function InstagramPage() {
  const secret = useUrlSecret()

  const [data, setData]       = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [open, setOpen]       = useState<number | null>(null)

  useEffect(() => {
    if (!secret) return
    fetch(`/api/social-dashboard?secret=${encodeURIComponent(secret)}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setData)
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [secret])

  if (loading) return <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>Loading…</div>
  if (error || !data) return <div style={{ color: '#dc2626', textAlign: 'center', padding: 40 }}>{error || 'No data'}</div>

  const { posts, stats } = data
  const igPosts = posts.filter(p => p.hasInstagram)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
        }}>
          📸
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Instagram
          </h1>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            Posts published via Blotato · <a href={`/admin/social-dashboard?secret=${secret}`} style={{ color: '#2563eb', textDecoration: 'none' }}>← Content Dashboard</a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label="Posts Submitted"  value={stats.withInstagram ?? 0} sub="via Blotato"  accent="#e1306c" />
        <StatCard label="This Month"       value={stats.thisMonth}          sub="blog posts"   accent="#475569" />
        <StatCard label="Followers"        value="—"                        sub="connect API"  accent="#cbd5e1" />
        <StatCard label="Impressions"      value="—"                        sub="connect API"  accent="#cbd5e1" />
      </div>

      {/* Connect prompt */}
      <div style={{ background: '#fff', border: '1.5px dashed #cbd5e1', borderRadius: 12, padding: '22px 24px', marginBottom: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, color: '#1a1a1a' }}>
          Instagram Analytics
        </div>
        <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 16 }}>
          Publishing is already live via Blotato (account ID 45624). Once the optional Instagram Graph API is connected, this page will show follower count, post impressions, reach, and engagement — pulled directly from the Instagram Insights API.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SETUP_STEPS.map((step, i) => (
            <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 16px', background: open === i ? '#f8fafc' : '#fafafa',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: '50%', color: '#fff', fontSize: 11, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: 'linear-gradient(135deg, #f09433, #dc2743, #bc1888)',
                }}>{i + 1}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{step.title}</span>
                <span style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: 12 }}>{open === i ? '▲' : '▼'}</span>
              </button>
              {open === i && (
                <div style={{ padding: '12px 16px 14px 48px', fontSize: 13, color: '#475569', lineHeight: 1.6, background: '#f8fafc' }}>
                  {step.body}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, background: '#f8fafc', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#475569' }}>
          <strong>Env vars needed for analytics:</strong>
          <span style={{ fontFamily: 'monospace', marginLeft: 8 }}>
            INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID
          </span>
        </div>
      </div>

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
                    style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                    title={post.title}>
                    {post.title}
                  </a>
                </td>
                <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{fmt(post.publishedAt)}</td>
                <td style={{ padding: '10px 16px', color: '#94a3b8', fontSize: 12 }}>{post.category?.replace(/-/g, ' ')}</td>
              </tr>
            ))}
            {igPosts.length === 0 && (
              <tr>
                <td colSpan={3} style={{ padding: '40px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                  No posts submitted to Instagram yet via Blotato.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
