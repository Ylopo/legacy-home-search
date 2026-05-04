'use client'

import { useEffect, useState, useCallback } from 'react'
import type { RefreshCandidate, RefreshAction } from '@/lib/refresh-engine'

const ACTION_CONFIG: Record<
  RefreshAction,
  { label: string; bg: string; text: string; border: string }
> = {
  'full-refresh':  { label: 'Full Refresh',  bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  'light-refresh': { label: 'Light Refresh', bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
  'review-only':   { label: 'Review Only',   bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  'do-not-touch':  { label: 'OK',            bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' },
}

const TIER_COLORS: Record<string, string> = {
  'fast-changing': '#dc2626',
  'news-trend':    '#f59e0b',
  'competitive':   '#7c3aed',
  'money-page':    '#059669',
  'pillar':        '#2563eb',
  'seasonal':      '#0891b2',
  'evergreen':     '#16a34a',
}

function formatAge(days: number): string {
  if (days >= 365) {
    const y = Math.floor(days / 365)
    const m = Math.floor((days % 365) / 30)
    return m > 0 ? `${y}y ${m}m old` : `${y}y old`
  }
  if (days >= 30) return `${Math.floor(days / 30)}mo old`
  return `${days}d old`
}

// ─── Card component ───────────────────────────────────────────────────────────

type CardState =
  | { phase: 'idle' }
  | { phase: 'approving' }
  | { phase: 'done'; slug: string; title: string }
  | { phase: 'skipped' }
  | { phase: 'excluded' }
  | { phase: 'error'; message: string }

function CandidateCard({
  candidate,
  secret,
}: {
  candidate: RefreshCandidate
  secret: string
}) {
  const [cardState, setCardState] = useState<CardState>({ phase: 'idle' })
  const [playbookOpen, setPlaybookOpen] = useState(false)

  const actionCfg = ACTION_CONFIG[candidate.recommendedAction] ?? ACTION_CONFIG['review-only']
  const tierColor = TIER_COLORS[candidate.refreshTier] ?? '#555'

  const dueLabel = candidate.isOverdue
    ? `${Math.abs(candidate.daysUntilDue)}d overdue`
    : candidate.daysUntilDue <= 14
    ? `due in ${candidate.daysUntilDue}d`
    : `due ${new Date(candidate.nextReviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`

  async function handleApprove() {
    setCardState({ phase: 'approving' })
    try {
      const res = await fetch('/api/content/refresh-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret,
          postId: candidate.postId,
          playbook: candidate.playbook,
          action: candidate.recommendedAction,
          refreshTier: candidate.refreshTier,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setCardState({ phase: 'error', message: data.error ?? 'Refresh failed' })
      } else {
        setCardState({ phase: 'done', slug: data.slug, title: data.title })
      }
    } catch {
      setCardState({ phase: 'error', message: 'Network error — please try again' })
    }
  }

  async function handleSkip() {
    await fetch('/api/content/refresh-skip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, postId: candidate.postId }),
    })
    setCardState({ phase: 'skipped' })
  }

  async function handleExclude() {
    await fetch('/api/content/refresh-exclude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, postId: candidate.postId }),
    })
    setCardState({ phase: 'excluded' })
  }

  if (cardState.phase === 'skipped') {
    return (
      <div style={{ padding: '16px 20px', background: '#f8f7f4', border: '1px solid #e0ddd8', borderRadius: 10, color: '#888884', fontSize: 14 }}>
        Skipped — will re-appear in 30 days.
      </div>
    )
  }
  if (cardState.phase === 'excluded') {
    return (
      <div style={{ padding: '16px 20px', background: '#f8f7f4', border: '1px solid #e0ddd8', borderRadius: 10, color: '#888884', fontSize: 14 }}>
        Excluded permanently — will never appear in the refresh queue.
      </div>
    )
  }
  if (cardState.phase === 'done') {
    return (
      <div style={{ padding: '20px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#15803d', marginBottom: 6 }}>✓ Refreshed successfully</div>
        <div style={{ fontSize: 14, color: '#1a1a1a', marginBottom: 12 }}>{cardState.title}</div>
        <a
          href={`/blog/${cardState.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', background: '#16a34a', color: '#fff', fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 6, textDecoration: 'none' }}
        >
          View Live Post →
        </a>
      </div>
    )
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e0ddd8',
      borderRadius: 10,
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      {/* Badges */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span style={{
          background: tierColor + '18',
          color: tierColor,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          padding: '3px 8px',
          borderRadius: 4,
        }}>
          {candidate.refreshTier}
        </span>
        <span style={{
          background: actionCfg.bg,
          color: actionCfg.text,
          border: `1px solid ${actionCfg.border}`,
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          padding: '3px 8px',
          borderRadius: 4,
        }}>
          {actionCfg.label}
        </span>
        <span style={{
          background: '#f8f7f4',
          color: '#2563eb',
          fontSize: 11,
          fontWeight: 700,
          padding: '3px 8px',
          borderRadius: 4,
        }}>
          {candidate.priorityScore}/100
        </span>
      </div>

      {/* Title */}
      <div>
        <a
          href={`/blog/${candidate.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', textDecoration: 'none' }}
        >
          {candidate.title}
        </a>
      </div>

      {/* Stats */}
      <div style={{ fontSize: 12, color: '#888884', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <span>{formatAge(candidate.ageInDays)}</span>
        <span style={{ color: candidate.isOverdue ? '#dc2626' : '#888884' }}>{dueLabel}</span>
        <span>{candidate.category}</span>
        {candidate.refreshCount > 0 && <span>Refreshed {candidate.refreshCount}x</span>}
      </div>

      {/* Reasons */}
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#555550', lineHeight: 1.6 }}>
        {candidate.refreshReasons.map((r, i) => (
          <li key={i}>{r}</li>
        ))}
      </ul>

      {/* Playbook toggle */}
      <div>
        <button
          onClick={() => setPlaybookOpen((v) => !v)}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span style={{ transform: playbookOpen ? 'rotate(90deg)' : 'rotate(0)', display: 'inline-block', transition: 'transform 0.15s' }}>▶</span>
          {playbookOpen ? 'Hide' : 'Show'} playbook ({candidate.playbook.length} items)
        </button>
        {playbookOpen && (
          <ol style={{ margin: '8px 0 0 0', paddingLeft: 20, fontSize: 12, color: '#555550', lineHeight: 1.7 }}>
            {candidate.playbook.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        )}
      </div>

      {/* Action buttons */}
      {cardState.phase === 'error' && (
        <div style={{ fontSize: 13, color: '#dc2626', padding: '8px 12px', background: '#fef2f2', borderRadius: 6 }}>
          {cardState.message}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
        <button
          onClick={handleApprove}
          disabled={cardState.phase === 'approving'}
          style={{
            background: cardState.phase === 'approving' ? '#93c5fd' : '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 7,
            padding: '9px 18px',
            fontSize: 13,
            fontWeight: 700,
            cursor: cardState.phase === 'approving' ? 'not-allowed' : 'pointer',
          }}
        >
          {cardState.phase === 'approving' ? 'Refreshing with Claude…' : '✓ Approve & Refresh'}
        </button>
        <button
          onClick={handleSkip}
          disabled={cardState.phase === 'approving'}
          style={{
            background: '#f8f7f4',
            color: '#555550',
            border: '1px solid #e0ddd8',
            borderRadius: 7,
            padding: '9px 16px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Skip 30 days
        </button>
        <button
          onClick={handleExclude}
          disabled={cardState.phase === 'approving'}
          style={{
            background: 'none',
            color: '#888884',
            border: 'none',
            padding: '9px 12px',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Exclude Forever
        </button>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RefreshQueuePage() {
  const [candidates, setCandidates] = useState<RefreshCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [secret, setSecret] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setSecret(params.get('secret') ?? '')
    }
  }, [])

  const fetchQueue = useCallback(async () => {
    if (!secret) return
    setLoading(true)
    try {
      const res = await fetch(`/api/content/refresh-queue?secret=${encodeURIComponent(secret)}`)
      if (!res.ok) {
        setError('Unauthorized or server error')
        return
      }
      const data = await res.json()
      setCandidates(data.candidates ?? [])
    } catch {
      setError('Failed to load refresh queue')
    } finally {
      setLoading(false)
    }
  }, [secret])

  useEffect(() => {
    if (secret) fetchQueue()
  }, [secret, fetchQueue])

  const fullRefreshCount = candidates.filter((c) => c.recommendedAction === 'full-refresh').length
  const lightRefreshCount = candidates.filter((c) => c.recommendedAction === 'light-refresh').length
  const overdueCount = candidates.filter((c) => c.isOverdue).length

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', padding: '32px 16px', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#2563eb', marginBottom: 6 }}>
            Legacy Home Search · Content Refresh Queue
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a1a', margin: '0 0 8px' }}>
            Refresh Queue
          </h1>
          {!loading && candidates.length > 0 && (
            <div style={{ fontSize: 14, color: '#888884' }}>
              {candidates.length} post{candidates.length === 1 ? '' : 's'} ready for review
              {overdueCount > 0 && ` · ${overdueCount} overdue`}
              {fullRefreshCount > 0 && ` · ${fullRefreshCount} need full refresh`}
              {lightRefreshCount > 0 && ` · ${lightRefreshCount} need light refresh`}
            </div>
          )}
        </div>

        {/* Legend */}
        {!loading && candidates.length > 0 && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            {Object.entries(ACTION_CONFIG)
              .filter(([k]) => k !== 'do-not-touch')
              .map(([key, cfg]) => (
                <span key={key} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 4, background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  {cfg.label}
                </span>
              ))}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888884' }}>Loading refresh queue…</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#dc2626' }}>{error}</div>
        ) : candidates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#888884', background: '#fff', borderRadius: 12, border: '1px solid #e0ddd8' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>No posts currently due for refresh</div>
            <div style={{ fontSize: 13 }}>Check back next Monday after the evaluation cron runs, or trigger it manually:</div>
            <code style={{ display: 'inline-block', marginTop: 10, fontSize: 12, background: '#f8f7f4', padding: '6px 12px', borderRadius: 6, border: '1px solid #e0ddd8' }}>
              POST /api/cron/refresh-evaluation
            </code>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {candidates.map((c) => (
              <CandidateCard key={c.postId} candidate={c} secret={secret} />
            ))}
          </div>
        )}

        {/* Footer note */}
        {!loading && candidates.length > 0 && (
          <div style={{ marginTop: 24, fontSize: 12, color: '#aaa9a4', textAlign: 'center' }}>
            Queue refreshed weekly on Mondays · Approve to rewrite with Claude · Skip to defer 30 days · Exclude to remove permanently
          </div>
        )}

      </div>
    </div>
  )
}
