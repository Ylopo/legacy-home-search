'use client'

import { usePathname } from 'next/navigation'
import { useUrlSecret } from '@/hooks/useUrlSecret'

const TABS = [
  { label: 'Idea Review', path: '/admin/idea-review' },
  { label: 'Media Queue', path: '/admin/va-queue' },
  { label: 'Analytics',   path: '/admin/blog-dashboard' },
] as const

function isActive(pathname: string, path: string): boolean {
  return pathname === path || pathname.startsWith(path + '/')
}

export function AdminNav() {
  const pathname = usePathname()
  const secret = useUrlSecret()

  const link = (path: string) => `${path}?secret=${encodeURIComponent(secret)}`

  return (
    <nav style={{
      background: '#111827',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 4,
      flexShrink: 0,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      minHeight: 52,
      position: 'relative',
      zIndex: 50,
      overflow: 'visible',
    }}>
      {/* Brand */}
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
        paddingRight: 18, borderRight: '1px solid rgba(255,255,255,0.1)',
        marginRight: 16, whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        Legacy Home Team
      </span>

      {/* Tabs */}
      {TABS.map(tab => {
        const active = isActive(pathname, tab.path)
        return (
          <a
            key={tab.path}
            href={link(tab.path)}
            style={{
              padding: '0 14px',
              lineHeight: '52px',
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              color: active ? '#fff' : 'rgba(255,255,255,0.55)',
              textDecoration: 'none',
              background: active ? 'rgba(255,255,255,0.09)' : 'transparent',
              borderRadius: 6,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {tab.label}
          </a>
        )
      })}

      <div style={{ flex: 1 }} />

      {/* Live indicator */}
      <div style={{
        padding: '5px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
        background: '#064e3b', color: '#6ee7b7', whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        ● Live
      </div>
    </nav>
  )
}
