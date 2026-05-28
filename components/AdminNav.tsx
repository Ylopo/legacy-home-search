'use client'

import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import { useUrlSecret } from '@/hooks/useUrlSecret'

const PIPELINE = [
  { label: 'Idea Review',       path: '/admin/idea-review' },
  { label: 'Media Queue',       path: '/admin/va-queue' },
  { label: 'Analytics',         path: '/admin/analytics' },
  { label: 'Connect Platforms', path: '/admin/connect' },
] as const

const CONTENT_MACHINE_BASE = '/admin/social-dashboard'

const REPORTING_ITEMS = [
  { label: 'Facebook analytics',  path: '/admin/social-dashboard/facebook',       exact: false },
  { label: 'Instagram analytics', path: '/admin/social-dashboard/instagram',      exact: false },
  { label: 'YouTube analytics',   path: '/admin/social-dashboard/youtube',        exact: false },
  { label: 'TikTok analytics',    path: '/admin/social-dashboard/tiktok',         exact: false },
  { label: 'LinkedIn analytics',  path: '/admin/social-dashboard/linkedin',       exact: false },
  { label: 'Google Search',       path: '/admin/social-dashboard/google-search',  exact: false },
] as const

function isActive(pathname: string, path: string, exact = false): boolean {
  if (exact) return pathname === path
  return pathname === path || pathname.startsWith(path + '/')
}

export function AdminNav() {
  const pathname = usePathname()
  const secret = useUrlSecret()
  const [open, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function openMenu()  { clearTimeout(closeTimer.current); setOpen(true) }
  function closeMenu() { closeTimer.current = setTimeout(() => setOpen(false), 120) }

  const onReporting = pathname.startsWith(CONTENT_MACHINE_BASE)

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
        marginRight: 12, whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        Legacy Home Team
      </span>

      {/* Pipeline section */}
      <span style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)', marginRight: 6, flexShrink: 0,
      }}>
        Pipeline
      </span>
      {PIPELINE.map(item => {
        const active = isActive(pathname, item.path)
        return (
          <a
            key={item.path}
            href={link(item.path)}
            style={{
              padding: '0 13px',
              lineHeight: '52px',
              fontSize: 13,
              fontWeight: active ? 600 : 400,
              color: active ? '#fff' : 'rgba(255,255,255,0.5)',
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

      {/* Divider */}
      <span style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.1)', margin: '0 12px', flexShrink: 0 }} />

      {/* Reporting section */}
      <span style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)', marginRight: 6, flexShrink: 0,
      }}>
        Reporting
      </span>

      {/* Reporting dropdown */}
      <div
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
        style={{ position: 'relative', flexShrink: 0 }}
      >
        <a
          href={link(CONTENT_MACHINE_BASE)}
          style={{
            padding: '0 14px',
            lineHeight: '52px',
            fontSize: 13,
            fontWeight: onReporting ? 600 : 400,
            color: onReporting ? '#fff' : 'rgba(255,255,255,0.5)',
            background: onReporting || open ? 'rgba(255,255,255,0.09)' : 'transparent',
            borderRadius: 6,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            textDecoration: 'none',
          }}
        >
          Overview
          <span style={{
            fontSize: 10,
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s',
            color: 'rgba(255,255,255,0.5)',
          }}>▼</span>
        </a>

        {open && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            paddingTop: 4,
            background: 'transparent',
            zIndex: 100,
            minWidth: 200,
          }}>
          <div style={{
            background: '#1f2937',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: 6,
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          }}>
            {REPORTING_ITEMS.map(item => {
              const active = isActive(pathname, item.path, item.exact)
              return (
                <a
                  key={item.path}
                  href={link(item.path)}
                  style={{
                    display: 'block',
                    padding: '8px 14px',
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                    textDecoration: 'none',
                    borderRadius: 5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.label}
                </a>
              )
            })}
          </div>
          </div>
        )}
      </div>

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
