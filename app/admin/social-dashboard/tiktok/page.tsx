'use client'

import { useEffect, useState } from 'react'
import type { SocialDashboardPost } from '@/sanity/queries'
import { useUrlSecret } from '@/hooks/useUrlSecret'

type Data = {
  posts: SocialDashboardPost[]
  stats: { total: number; withTikTok: number; thisMonth: number }
}

const SETUP_ID = 'tiktok'

type SetupStep = {
  id: string
  title: string
  body: React.ReactNode
}

const STEPS: SetupStep[] = [
  {
    id: 'signin',
    title: 'Sign in to TikTok Developers',
    body: (
      <>
        Go to <a href="https://developers.tiktok.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>developers.tiktok.com</a>
        {' '}→ click <strong>Login</strong> (top right) → <strong>Continue with TikTok</strong> → sign in with the
        {' '}<strong>Legacy Home Team TikTok account</strong> → accept the developer Terms of Service.
      </>
    ),
  },
  {
    id: 'create-app',
    title: 'Create the app',
    body: (
      <>
        Click <strong>Manage apps</strong> (top right) → <strong>+ Connect an app</strong>. Fill in:
        <div style={{ marginTop: 8, padding: 12, background: '#f8fafc', borderRadius: 8, fontSize: 12, lineHeight: 1.7 }}>
          <div><strong>App name:</strong> Legacy Home Team Analytics</div>
          <div><strong>Description:</strong> Internal analytics dashboard for tracking Legacy Home Team's TikTok video performance and follower growth alongside our other social channels.</div>
          <div><strong>Category:</strong> Tools and productivity</div>
          <div><strong>Website URL:</strong> https://www.legacyhometeamlpt.com</div>
          <div><strong>Terms of Service URL:</strong> https://www.legacyhometeamlpt.com</div>
          <div><strong>Privacy Policy URL:</strong> https://www.legacyhometeamlpt.com</div>
          <div><strong>Platform:</strong> Web</div>
          <div><strong>Redirect URI:</strong> https://www.legacyhometeamlpt.com/api/tiktok/callback</div>
        </div>
      </>
    ),
  },
  {
    id: 'add-products',
    title: 'Add products',
    body: (
      <>
        On the app dashboard, click <strong>Add products</strong> and enable both:
        <ul style={{ marginTop: 6, marginBottom: 0, paddingLeft: 22 }}>
          <li><strong>Login Kit</strong></li>
          <li><strong>Display API</strong></li>
        </ul>
      </>
    ),
  },
  {
    id: 'add-scopes',
    title: 'Request scopes',
    body: (
      <>
        Under <strong>Scopes</strong>, request all four:
        <ul style={{ marginTop: 6, marginBottom: 0, paddingLeft: 22, fontFamily: 'monospace', fontSize: 12 }}>
          <li>user.info.basic</li>
          <li>user.info.profile</li>
          <li>user.info.stats</li>
          <li>video.list</li>
        </ul>
      </>
    ),
  },
  {
    id: 'submit-review',
    title: 'Submit for review',
    body: (
      <>
        For each scope, paste this justification:
        <div style={{ marginTop: 8, padding: 12, background: '#f8fafc', borderRadius: 8, fontSize: 12, fontStyle: 'italic', lineHeight: 1.6, color: '#475569' }}>
          Our internal team uses this dashboard to monitor the performance of organic content posted from our company's own TikTok account. user.info.stats tracks our follower growth, and video.list shows view counts and engagement on videos we publish ourselves. No third-party user data is accessed — this is for our own first-party account only.
        </div>
        <div style={{ marginTop: 8 }}>Click <strong>Submit for review</strong>. Approval typically takes 1–3 business days.</div>
      </>
    ),
  },
  {
    id: 'send-credentials',
    title: 'Send the Client Key + Client Secret',
    body: (
      <>
        From the app's <strong>Basic Information</strong> / <strong>Credentials</strong> section, send these to me:
        <ul style={{ marginTop: 6, marginBottom: 0, paddingLeft: 22 }}>
          <li><strong>Client Key</strong></li>
          <li><strong>Client Secret</strong></li>
        </ul>
        You can send these as soon as the app is created — no need to wait for approval.
      </>
    ),
  },
  {
    id: 'authorize',
    title: 'Click the authorization link (after approval)',
    body: (
      <>
        Once TikTok approves the app, I'll send you a one-click authorization link. You'll click it, sign in with the
        {' '}<strong>Legacy Home Team TikTok account</strong>, and click <strong>Authorize</strong>. Takes ~10 seconds.
        After that the dashboard pulls all the analytics automatically — you never have to touch this again.
      </>
    ),
  },
]

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

function Checklist({ secret }: { secret: string }) {
  const [states, setStates]   = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState<string | null>(null)

  useEffect(() => {
    if (!secret) return
    fetch(`/api/setup-state?secret=${encodeURIComponent(secret)}&setupId=${SETUP_ID}`)
      .then(r => r.json())
      .then(d => setStates(d.states ?? {}))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [secret])

  async function toggle(stepId: string) {
    if (pending) return
    const next = !states[stepId]
    setPending(stepId)
    setStates(s => ({ ...s, [stepId]: next })) // optimistic
    try {
      const res = await fetch(`/api/setup-state?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ setupId: SETUP_ID, stepId, done: next }),
      })
      const d = await res.json()
      if (d.states) setStates(d.states)
    } catch {
      setStates(s => ({ ...s, [stepId]: !next })) // rollback
    } finally {
      setPending(null)
    }
  }

  const done = STEPS.filter(s => states[s.id]).length
  const pct = Math.round((done / STEPS.length) * 100)

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '24px', marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 2 }}>📋 TikTok Setup Checklist</div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            One-time setup so we can pull TikTok analytics. Click each box as you finish.
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: pct === 100 ? '#16a34a' : '#1a1a1a' }}>{done} / {STEPS.length}</div>
          <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>complete</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, marginBottom: 22, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: pct === 100 ? '#16a34a' : '#2563eb',
          borderRadius: 99,
          transition: 'width 0.3s',
        }} />
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {STEPS.map((step, i) => {
          const isDone    = !!states[step.id]
          const isPending = pending === step.id
          return (
            <div key={step.id} style={{
              display: 'flex',
              gap: 14,
              padding: '14px 16px',
              borderRadius: 10,
              background: isDone ? '#f0fdf4' : '#f8fafc',
              border: '1px solid ' + (isDone ? '#bbf7d0' : '#e2e8f0'),
              opacity: isPending ? 0.6 : 1,
              transition: 'background 0.2s',
            }}>
              {/* Checkbox */}
              <button
                onClick={() => !loading && toggle(step.id)}
                disabled={loading || isPending}
                aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
                style={{
                  flexShrink: 0,
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: '2px solid ' + (isDone ? '#16a34a' : '#cbd5e1'),
                  background: isDone ? '#16a34a' : '#fff',
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 800,
                  cursor: loading ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 1,
                  transition: 'background 0.2s, border 0.2s',
                }}
              >
                {isDone ? '✓' : ''}
              </button>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: isDone ? '#15803d' : '#1a1a1a',
                  textDecoration: isDone ? 'line-through' : 'none',
                }}>
                  Step {i + 1} — {step.title}
                </div>
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6 }}>
                  {step.body}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {pct === 100 && (
        <div style={{ marginTop: 18, padding: '14px 18px', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 10, fontSize: 13, color: '#15803d', fontWeight: 600, textAlign: 'center' }}>
          🎉 All steps complete — TikTok analytics will populate as soon as the wiring is finalized.
        </div>
      )}
    </div>
  )
}

export default function TikTokPage() {
  const secret = useUrlSecret()

  const [data, setData]       = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

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
  const ttPosts = posts.filter(p => p.hasTikTok)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          🎵 TikTok
        </h1>
        <div style={{ fontSize: 13, color: '#64748b' }}>Setup in progress — analytics will appear here once authorized</div>
      </div>

      {/* Setup Checklist — top of page */}
      <Checklist secret={secret} />

      {/* Current state stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard label="Videos Posted"  value={stats.withTikTok}  sub="all time"    accent="#010101" />
        <StatCard label="This Month"      value={stats.thisMonth}   sub="blog posts"  accent="#475569" />
        <StatCard label="Views"           value="—"                 sub="awaiting setup" accent="#cbd5e1" />
        <StatCard label="Likes"           value="—"                 sub="awaiting setup" accent="#cbd5e1" />
      </div>

      {/* Submitted videos table */}
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#64748b', marginBottom: 12 }}>
        Videos Submitted via Blotato ({ttPosts.length})
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
              </tr>
            ))}
            {ttPosts.length === 0 && (
              <tr>
                <td colSpan={2} style={{ padding: '40px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                  No videos submitted to TikTok yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
