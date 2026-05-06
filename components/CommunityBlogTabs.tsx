'use client'

import { useState, type ReactNode } from 'react'

type Props = {
  recentCards: ReactNode[]
  featuredCards: ReactNode
  hasRecent: boolean
}

export default function CommunityBlogTabs({ recentCards, featuredCards, hasRecent }: Props) {
  const [tab, setTab] = useState<'recent' | 'popular'>('recent')

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 18px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 700,
    border: 'none',
    cursor: 'pointer',
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? '#fff' : 'var(--text-secondary)',
    transition: 'background 0.15s, color 0.15s',
  })

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, background: '#e9eef7', borderRadius: 24, padding: 4, width: 'fit-content' }}>
        <button style={tabStyle(tab === 'recent')} onClick={() => setTab('recent')}>Recent Posts</button>
        <button style={tabStyle(tab === 'popular')} onClick={() => setTab('popular')}>Most Popular</button>
      </div>

      {tab === 'recent' ? (
        hasRecent ? (
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'thin' }}>
            {recentCards}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No recent posts found for this community yet.</p>
        )
      ) : (
        featuredCards
      )}
    </div>
  )
}
