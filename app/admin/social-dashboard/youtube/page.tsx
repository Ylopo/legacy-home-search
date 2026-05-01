'use client'

import { useEffect, useState } from 'react'
import type { SocialDashboardPost } from '@/sanity/queries'
import type { YouTubeOverview } from '@/lib/youtube-client'

type Data = {
  posts: SocialDashboardPost[]
  youtube: YouTubeOverview | null
  stats: {
    total: number
    withYouTube: number
    thisMonth: number
    youtubeConnected: boolean
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

function StatCard({ label, value, sub, accent = '#ff0000' }: {
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

export default function YouTubePage() {
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

  const { posts, youtube, stats } = data
  const ytPosts = posts.filter(p => p.hasYouTube)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        {youtube?.channel.thumbnailUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={youtube.channel.thumbnailUrl} alt="" style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0 }} />
        )}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            ▶️ YouTube
          </h1>
          <div style={{ fontSize: 13, color: '#64748b' }}>
            {youtube ? youtube.channel.channelTitle : 'Videos published via Blotato'}
          </div>
        </div>
      </div>

      {/* Stats — real data when connected, posting fallback otherwise */}
      {youtube ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            <StatCard label="Subscribers"     value={fmtCompact(youtube.channel.subscribers)}  sub="all time" accent="#ff0000" />
            <StatCard label="Total Views"     value={fmtCompact(youtube.channel.totalViews)}   sub="lifetime" />
            <StatCard label="Videos"          value={youtube.channel.videoCount}                sub="published on channel" />
            <StatCard label="Recent Views"    value={fmtCompact(youtube.recentViews)}          sub={`last ${youtube.recentVideos.length} videos`} accent="#475569" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
            <StatCard label="Likes"      value={fmtCompact(youtube.recentLikes)}    sub="across recent videos" accent="#16a34a" />
            <StatCard label="Comments"   value={fmtCompact(youtube.recentComments)} sub="across recent videos" accent="#2563eb" />
            <StatCard label="Avg Views" value={fmtCompact(youtube.recentVideos.length ? Math.round(youtube.recentViews / youtube.recentVideos.length) : 0)} sub="per video" accent="#d97706" />
          </div>

          {/* Top videos */}
          {youtube.topVideos.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12 }}>
                Top Videos by Views
              </div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Video</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Published</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Views</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Likes</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {youtube.topVideos.map((v, i) => (
                      <tr key={v.videoId} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : undefined }}>
                        <td style={{ padding: '10px 16px', maxWidth: 380 }}>
                          <a href={`https://youtube.com/watch?v=${v.videoId}`} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'flex', gap: 10, alignItems: 'center', color: '#1a1a1a', textDecoration: 'none' }}>
                            {v.thumbnailUrl && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={v.thumbnailUrl} alt="" style={{ width: 60, height: 34, borderRadius: 4, objectFit: 'cover', flexShrink: 0 }} />
                            )}
                            <span style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={v.title}>{v.title}</span>
                          </a>
                        </td>
                        <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{fmt(v.publishedAt)}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#ff0000' }}>{fmtCompact(v.views)}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'right', color: '#475569' }}>{fmtCompact(v.likes)}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'right', color: '#475569' }}>{fmtCompact(v.comments)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Recent videos */}
          {youtube.recentVideos.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12 }}>
                Recent Uploads ({youtube.recentVideos.length})
              </div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Video</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Published</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Views</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Likes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {youtube.recentVideos.slice(0, 25).map((v, i) => (
                      <tr key={v.videoId} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : undefined }}>
                        <td style={{ padding: '10px 16px', maxWidth: 380 }}>
                          <a href={`https://youtube.com/watch?v=${v.videoId}`} target="_blank" rel="noopener noreferrer"
                            style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                            title={v.title}>
                            {v.title}
                          </a>
                        </td>
                        <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{fmt(v.publishedAt)}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#ff0000' }}>{fmtCompact(v.views)}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'right', color: '#475569' }}>{fmtCompact(v.likes)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {/* Connect prompt */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            <StatCard label="Videos Uploaded" value={stats.withYouTube} sub="from Blotato" accent="#ff0000" />
            <StatCard label="This Month"      value={stats.thisMonth}    sub="blog posts"  accent="#475569" />
            <StatCard label="Subscribers"     value="—" sub={stats.youtubeConnected ? 'API error' : 'connect API'} accent="#cbd5e1" />
            <StatCard label="Total Views"     value="—" sub={stats.youtubeConnected ? 'API error' : 'connect API'} accent="#cbd5e1" />
          </div>

          <div style={{ background: '#fff', border: '1.5px dashed #cbd5e1', borderRadius: 12, padding: '22px 24px', marginBottom: 28 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              {stats.youtubeConnected ? '⚠️ YouTube API returned an error' : 'Connect YouTube Data API'}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginBottom: 12 }}>
              {stats.youtubeConnected
                ? 'Credentials are set but the API returned an error. Check that the API key has YouTube Data API v3 enabled and the channel ID is correct.'
                : 'Set YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID env vars to display subscribers, total views, recent uploads, top videos, and per-video stats.'}
            </div>
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#475569' }}>
              <strong>Env vars needed:</strong>
              <span style={{ fontFamily: 'monospace', marginLeft: 8, color: '#2563eb' }}>
                YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID
              </span>
            </div>
          </div>
        </>
      )}

      {/* Posts table — what we've submitted via Blotato */}
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12 }}>
        Submitted via Blotato ({ytPosts.length})
      </div>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Post</th>
              <th style={{ padding: '10px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase' }}>Published</th>
            </tr>
          </thead>
          <tbody>
            {ytPosts.map((post, i) => (
              <tr key={post._id} style={{ borderTop: i > 0 ? '1px solid #f1f5f9' : undefined }}>
                <td style={{ padding: '10px 16px', maxWidth: 420 }}>
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#1a1a1a', textDecoration: 'none', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                    title={post.title}>
                    {post.title}
                  </a>
                </td>
                <td style={{ padding: '10px 16px', color: '#64748b', fontSize: 12, whiteSpace: 'nowrap' }}>{fmt(post.publishedAt)}</td>
              </tr>
            ))}
            {ytPosts.length === 0 && (
              <tr>
                <td colSpan={2} style={{ padding: '40px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                  No videos submitted to YouTube yet via Blotato.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
