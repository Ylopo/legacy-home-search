'use client'

import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Home',          path: '/admin/social-dashboard',            exact: true  },
  { label: 'Google Search', path: '/admin/social-dashboard/google-search', exact: false },
  { label: 'Facebook',      path: '/admin/social-dashboard/facebook',   exact: false },
  { label: 'YouTube',       path: '/admin/social-dashboard/youtube',    exact: false },
  { label: 'TikTok',        path: '/admin/social-dashboard/tiktok',     exact: false },
]

export function SocialDashboardNav() {
  const pathname = usePathname()
  const secret = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('secret') ?? ''
    : ''

  return (
    <nav style={{
      background: '#111827',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      gap: 2,
      overflowX: 'auto',
      flexShrink: 0,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      minHeight: 50,
    }}>
      <span style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)',
        paddingRight: 16, borderRight: '1px solid rgba(255,255,255,0.1)',
        marginRight: 8, whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        Legacy Home Team
      </span>

      {NAV_ITEMS.map(item => {
        const active = item.exact
          ? pathname === item.path
          : pathname.startsWith(item.path)
        return (
          <a
            key={item.path}
            href={`${item.path}?secret=${encodeURIComponent(secret)}`}
            style={{
              padding: '0 13px',
              lineHeight: '50px',
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              color: active ? '#fff' : 'rgba(255,255,255,0.45)',
              textDecoration: 'none',
              background: active ? 'rgba(255,255,255,0.09)' : 'transparent',
              borderRadius: 6,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {item.label}
          </a>
        )
      })}

      <div style={{ flex: 1 }} />

      <div style={{
        padding: '5px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
        background: '#064e3b', color: '#6ee7b7', whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        ● Live
      </div>
    </nav>
  )
}
