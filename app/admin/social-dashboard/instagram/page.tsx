'use client'

import { useEffect, useState } from 'react'

type Data = { stats: { total: number } }

export default function InstagramPage() {
  const secret = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('secret') ?? ''
    : ''

  const [, setData]           = useState<Data | null>(null)
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
  if (error) return <div style={{ color: '#dc2626', textAlign: 'center', padding: 40 }}>{error}</div>

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          📸 Instagram
        </h1>
        <div style={{ fontSize: 13, color: '#64748b' }}>Coming in Phase 2</div>
      </div>

      <div style={{ background: '#fff', border: '1.5px dashed #cbd5e1', borderRadius: 16, padding: '56px 32px', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📸</div>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Instagram — Phase 2</div>
        <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 24 }}>
          Instagram publishing and analytics will be added once you provide a Facebook Page Access Token with Instagram Business Account permissions.
          <br /><br />
          Blotato supports Instagram feed posts, Stories, and Reels — all publishable through the same VA editor workflow.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, textAlign: 'left', maxWidth: 380, margin: '0 auto' }}>
          {['Feed posts', 'Reels', 'Stories', 'Reach & impressions', 'Engagement rate', 'Follower growth'].map(m => (
            <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#f8fafc', borderRadius: 8 }}>
              <span style={{ color: '#cbd5e1', fontSize: 12 }}>○</span>
              <span style={{ fontSize: 13, color: '#64748b' }}>{m}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
