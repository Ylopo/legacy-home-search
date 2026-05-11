'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { SanityBlogPost, WorkflowStatus } from '@/sanity/queries'
import { AdminNav } from '@/components/AdminNav'

// ─── Workflow queue status display ────────────────────────────────────────────

const STATUS_LABELS: Record<WorkflowStatus, string> = {
  media_pending:   'Needs Media',
  media_ready:     'Ready to Publish',
  publish_pending: 'Publish Pending',
  publishing:      'Publishing…',
  scheduled:       'Scheduled',
  published:       'Published',
  publish_failed:  'Publish Failed',
}

const STATUS_COLORS: Record<WorkflowStatus, { bg: string; text: string; border: string }> = {
  media_pending:   { bg: '#fff7ed', text: '#9a3412',  border: '#fb923c' },
  media_ready:     { bg: '#f0fdf4', text: '#166534',  border: '#4ade80' },
  publish_pending: { bg: '#eff6ff', text: '#1e40af',  border: '#60a5fa' },
  publishing:      { bg: '#eff6ff', text: '#1e40af',  border: '#60a5fa' },
  scheduled:       { bg: '#eff6ff', text: '#1d4ed8',  border: '#93c5fd' },
  published:       { bg: '#f0fdf4', text: '#166534',  border: '#86efac' },
  publish_failed:  { bg: '#fef2f2', text: '#991b1b',  border: '#f87171' },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sanityThumbUrl(ref: string) {
  return `https://cdn.sanity.io/images/2nr7n3lm/production/${ref.replace('image-', '').replace(/-(\w+)$/, '.$1')}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VAQueuePage() {
  const [posts,   setPosts]   = useState<SanityBlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())
  const [fhStatuses, setFhStatuses] = useState<Record<string, 'clear' | 'warning' | 'violation'>>({})

  const [monthlyStats, setMonthlyStats] = useState<{ totalPosts: number; videoPosts: number } | null>(null)

  function handleDelete(id: string) {
    setDeletedIds(prev => new Set([...prev, id]))
  }

  const secret = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('secret') ?? ''
    : ''

  useEffect(() => {
    if (!secret) {
      setLoading(false)
      setError('Unauthorized — add ?secret=... to the URL')
      return
    }

    fetch(`/api/content/queue?secret=${encodeURIComponent(secret)}`)
      .then(r => r.ok ? r.json() : Promise.reject('Unauthorized'))
      .then((loadedPosts: SanityBlogPost[]) => {
        setPosts(loadedPosts)
        const ids = loadedPosts.map(p => p._id).join(',')
        if (ids) {
          fetch(`/api/content/fh-status?secret=${encodeURIComponent(secret)}&postIds=${encodeURIComponent(ids)}`)
            .then(r => r.ok ? r.json() : {})
            .then((map: Record<string, { severity: 'clear' | 'warning' | 'violation' }>) => {
              const severities: Record<string, 'clear' | 'warning' | 'violation'> = {}
              for (const [id, result] of Object.entries(map)) {
                severities[id] = result.severity
              }
              setFhStatuses(severities)
            })
            .catch(() => {})
        }
      })
      .catch(() => setError('Failed to load queue'))
      .finally(() => setLoading(false))

    fetch(`/api/content/monthly-stats?secret=${encodeURIComponent(secret)}`)
      .then(r => r.ok ? r.json() : null)
      .then(setMonthlyStats)
      .catch(() => {})
  }, [secret])

  const pending = posts.filter(p => p.workflowStatus === 'media_pending' && !deletedIds.has(p._id))
  const ready   = posts.filter(p => p.workflowStatus === 'media_ready'   && !deletedIds.has(p._id))
  const other   = posts.filter(p => !['media_pending', 'media_ready'].includes(p.workflowStatus ?? '') && !deletedIds.has(p._id))

  const activeCount = posts.filter(p => ['media_pending', 'media_ready'].includes(p.workflowStatus ?? '')).length

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', fontFamily: 'Inter, sans-serif' }}>
      <AdminNav />

      {/* Title bar */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0',
        padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <h1 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>Media Queue</h1>
        {!loading && activeCount > 0 && (
          <span style={{ fontSize: 12, background: '#fff7ed', color: '#9a3412', borderRadius: 99, padding: '2px 10px', fontWeight: 600 }}>
            {activeCount} need attention
          </span>
        )}
        <Link
          href={`/admin/thumbnail-review?secret=${secret}`}
          style={{ marginLeft: 'auto', fontSize: 12, color: '#94a3b8', textDecoration: 'none' }}
        >
          Legacy Upload Tool
        </Link>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {loading && <p style={{ color: '#64748b' }}>Loading queue…</p>}
        {error  && <p style={{ color: '#dc2626', background: '#fef2f2', padding: 16, borderRadius: 8 }}>{error}</p>}

        {/* Needs Media */}
        {pending.length > 0 && (
          <Section title="Needs Media" count={pending.length} accent="#9a3412" bg="#fed7aa">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {pending.map(post => <PostCard key={post._id} post={post} secret={secret} onDelete={handleDelete} fhStatus={fhStatuses[post._id]} />)}
            </div>
          </Section>
        )}

        {/* Ready to Publish */}
        {ready.length > 0 && (
          <Section title="Ready to Publish" count={ready.length}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {ready.map(post => <PostCard key={post._id} post={post} secret={secret} onDelete={handleDelete} fhStatus={fhStatuses[post._id]} />)}
            </div>
          </Section>
        )}

        {/* In Progress */}
        {other.length > 0 && (
          <Section title="In Progress / Recent" count={other.length}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
              {other.map(post => <PostCard key={post._id} post={post} secret={secret} onDelete={handleDelete} fhStatus={fhStatuses[post._id]} />)}
            </div>
          </Section>
        )}

        {!loading && !error && posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0 32px', color: '#64748b' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>All caught up</p>
            <p>No posts need media right now.</p>
          </div>
        )}

        {/* Monthly Progress */}
        <MonthlyProgress stats={monthlyStats} />
      </div>
    </div>
  )
}

// ─── Monthly progress tracker ─────────────────────────────────────────────────

const BLOG_DAILY_GOAL  = 2
const VIDEO_DAILY_GOAL = 1

function MonthlyProgress({ stats }: { stats: { totalPosts: number; videoPosts: number } | null }) {
  const now           = new Date()
  const dayOfMonth    = now.getDate()
  const daysInMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const monthName     = now.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  const blogGoal  = BLOG_DAILY_GOAL  * daysInMonth
  const videoGoal = VIDEO_DAILY_GOAL * daysInMonth

  const expectedBlog  = BLOG_DAILY_GOAL  * dayOfMonth
  const expectedVideo = VIDEO_DAILY_GOAL * dayOfMonth

  const textPosts  = stats?.totalPosts ?? 0
  const videoPosts = stats?.videoPosts ?? 0

  function getStatus(actual: number, expected: number): { label: string; color: string } {
    if (actual >= expected)            return { label: 'On Track',  color: '#166534' }
    if (actual >= Math.floor(expected * 0.75)) return { label: 'Slightly Behind', color: '#92400e' }
    return { label: 'Behind', color: '#991b1b' }
  }

  function getBgColor(actual: number, expected: number): string {
    if (actual >= expected)            return '#f0fdf4'
    if (actual >= Math.floor(expected * 0.75)) return '#fffbeb'
    return '#fef2f2'
  }

  function getBorderColor(actual: number, expected: number): string {
    if (actual >= expected)            return '#86efac'
    if (actual >= Math.floor(expected * 0.75)) return '#fcd34d'
    return '#fca5a5'
  }

  function getBarColor(actual: number, expected: number): string {
    if (actual >= expected)            return '#16a34a'
    if (actual >= Math.floor(expected * 0.75)) return '#d97706'
    return '#dc2626'
  }

  const blogStatus  = getStatus(textPosts,  expectedBlog)
  const videoStatus = getStatus(videoPosts, expectedVideo)

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 12,
      padding: '20px 24px',
      marginTop: 8,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: '0 0 2px' }}>Monthly Progress</h2>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>{monthName} — Day {dayOfMonth} of {daysInMonth}</div>
        </div>
        <div style={{ fontSize: 12, color: '#64748b', textAlign: 'right' }}>
          <div>Goal: {BLOG_DAILY_GOAL} blog posts/day</div>
          <div>Goal: {VIDEO_DAILY_GOAL} video/day</div>
        </div>
      </div>

      {/* Blog posts row */}
      <ProgressRow
        label="Blog Posts (text + video)"
        actual={textPosts}
        goal={blogGoal}
        expected={expectedBlog}
        status={blogStatus}
        bgColor={getBgColor(textPosts, expectedBlog)}
        borderColor={getBorderColor(textPosts, expectedBlog)}
        barColor={getBarColor(textPosts, expectedBlog)}
      />

      <div style={{ height: 12 }} />

      {/* Video posts row */}
      <ProgressRow
        label="Video Posts"
        actual={videoPosts}
        goal={videoGoal}
        expected={expectedVideo}
        status={videoStatus}
        bgColor={getBgColor(videoPosts, expectedVideo)}
        borderColor={getBorderColor(videoPosts, expectedVideo)}
        barColor={getBarColor(videoPosts, expectedVideo)}
      />
    </div>
  )
}

function ProgressRow({
  label, actual, goal, expected, status, bgColor, borderColor, barColor,
}: {
  label: string
  actual: number
  goal: number
  expected: number
  status: { label: string; color: string }
  bgColor: string
  borderColor: string
  barColor: string
}) {
  const pct = Math.min(100, Math.round((actual / goal) * 100))
  const behind = expected - actual

  return (
    <div style={{
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: 10,
      padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: status.color }}>{status.label}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{actual} <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: 12 }}>/ {goal}</span></span>
        </div>
      </div>
      {/* Progress bar */}
      <div style={{ height: 6, background: 'rgba(0,0,0,0.07)', borderRadius: 99, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 99, transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
        {actual >= expected
          ? `${actual - expected > 0 ? `${actual - expected} ahead of pace` : 'Exactly on pace'} · ${goal - actual} remaining this month`
          : `${behind} behind pace · ${goal - actual} remaining this month`
        }
      </div>
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, count, accent = '#1a1a1a', bg = '#e2e8f0', subtitle, children }: {
  title: string
  count: number
  accent?: string
  bg?: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: subtitle ? 6 : 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: accent }}>{title}</h2>
        <span style={{ fontSize: 12, fontWeight: 700, background: bg, color: accent, borderRadius: 99, padding: '2px 8px' }}>
          {count}
        </span>
      </div>
      {subtitle && (
        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>{subtitle}</p>
      )}
      {children}
    </div>
  )
}

// ─── Workflow post card (links to VA editor) ──────────────────────────────────

function PostCard({ post, secret, onDelete, fhStatus }: { post: SanityBlogPost; secret: string; onDelete: (id: string) => void; fhStatus?: 'clear' | 'warning' | 'violation' }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const status = post.workflowStatus as WorkflowStatus
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS.media_pending
  const label  = STATUS_LABELS[status] ?? status
  const hasThumb = !!post.coverImage?.asset

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDeleting(true)
    try {
      await fetch(`/api/content/delete-post?secret=${encodeURIComponent(secret)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post._id }),
      })
      onDelete(post._id)
    } catch {
      setDeleting(false)
      setConfirming(false)
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <Link href={`/admin/va-queue/${post._id}?secret=${secret}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div style={{ background: '#fff', border: `1.5px solid ${confirming ? '#fca5a5' : colors.border}`, borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.15s' }}
          onMouseEnter={e => { if (!confirming) e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)' }}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
        >
          <div style={{ height: 140, background: hasThumb ? '#e2e8f0' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {hasThumb
              ? <img src={sanityThumbUrl(post.coverImage.asset._ref)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ textAlign: 'center', color: '#94a3b8' }}><div style={{ fontSize: 28, marginBottom: 4 }}>🖼</div><div style={{ fontSize: 12 }}>No thumbnail yet</div></div>
            }
          </div>
          <div style={{ padding: '14px 16px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#64748b' }}>
                {post.category?.replace(/-/g, ' ')}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {fhStatus === 'violation' && (
                  <span style={{ fontSize: 10, fontWeight: 700, background: '#fef2f2', color: '#dc2626', borderRadius: 99, padding: '2px 7px', border: '1px solid #fca5a5' }}>
                    FH Hold
                  </span>
                )}
                {fhStatus === 'warning' && (
                  <span style={{ fontSize: 10, fontWeight: 700, background: '#fffbeb', color: '#b45309', borderRadius: 99, padding: '2px 7px', border: '1px solid #fcd34d' }}>
                    FH Review
                  </span>
                )}
                <span style={{ fontSize: 11, fontWeight: 700, background: colors.bg, color: colors.text, borderRadius: 99, padding: '2px 8px' }}>
                  {label}
                </span>
              </div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.4, marginBottom: 8 }}>{post.title}</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>{post.publishedAt ? fmtDate(post.publishedAt) : 'Unpublished'}</div>
          </div>
        </div>
      </Link>

      {/* Trash button */}
      {!confirming && (
        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); setConfirming(true) }}
          title="Delete post"
          style={{
            position: 'absolute', top: 10, right: 10,
            width: 30, height: 30, borderRadius: 8,
            background: 'rgba(255,255,255,0.9)', border: '1px solid #e2e8f0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, cursor: 'pointer', color: '#94a3b8',
            backdropFilter: 'blur(4px)',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = '#fca5a5' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#e2e8f0' }}
        >
          🗑
        </button>
      )}

      {/* Inline delete confirmation */}
      {confirming && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', inset: 0, borderRadius: 12,
            background: 'rgba(255,255,255,0.97)', border: '1.5px solid #fca5a5',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 12, padding: 20, textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 28 }}>🗑</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.4 }}>Delete this post?</div>
          <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>This permanently removes it from Sanity. It cannot be undone.</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{
                padding: '8px 20px', background: '#dc2626', color: '#fff',
                border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700,
                cursor: deleting ? 'wait' : 'pointer', opacity: deleting ? 0.7 : 1,
              }}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
            <button
              onClick={e => { e.stopPropagation(); setConfirming(false) }}
              style={{
                padding: '8px 16px', background: 'none', color: '#64748b',
                border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
