'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: Record<string, unknown>[]
  }
}

function getSourceMarket(): string {
  const h1 = document.querySelector('h1')
  return (h1?.textContent ?? '').trim().slice(0, 60)
}

function normalizeSlug(path: string): string {
  const s = path
    .toLowerCase()
    .replace(/\.html?$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return s || 'home'
}

function extractListingId(pathname: string): string {
  const m = pathname.match(/\/search\/detail\/([^/?#]+)/)
  return m?.[1] ?? ''
}

// Module-level duplicate-click guard (same href within 500 ms = one event)
let _lastHref = ''
let _lastTime = 0

export default function YlopoTrack() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element | null)?.closest('a') as HTMLAnchorElement | null
      if (!anchor?.href) return
      // Only fire for YLOPO property detail pages
      if (!anchor.href.includes('/search/detail/')) return

      const now = Date.now()
      if (anchor.href === _lastHref && now - _lastTime < 500) return
      _lastHref = anchor.href
      _lastTime = now

      let url: URL
      try { url = new URL(anchor.href) } catch { return }

      const listingId    = extractListingId(url.pathname)
      const sourcePage   = window.location.pathname
      const sourceTitle  = document.title
      const sourceMarket = getSourceMarket()
      const pageSlug     = normalizeSlug(sourcePage)

      const eventParams = {
        listing_id:    listingId,
        listing_url:   anchor.href,
        source_page:   sourcePage,
        source_title:  sourceTitle,
        source_market: sourceMarket,
        widget_type:   anchor.closest('.YLOPO_resultsWidget') ? 'results-widget' : 'embedded',
        link_domain:   url.hostname,
        link_path:     url.pathname,
      }

      // GA4 custom event
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'idx_property_click', eventParams)
      }

      // GTM / dataLayer forward-compatible push
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: 'idx_property_click', ...eventParams })
      }

      // Append attribution params to the outbound URL (skip if already decorated)
      if (!url.searchParams.has('utm_source')) {
        url.searchParams.set('utm_source', 'website')
        url.searchParams.set('utm_medium', 'idx')
        url.searchParams.set('utm_campaign', pageSlug)
        url.searchParams.set('utm_content', 'ylopo-widget')
        url.searchParams.set('src_page', sourcePage)
        url.searchParams.set('src_title', sourceTitle.slice(0, 100))
        url.searchParams.set('src_market', sourceMarket.slice(0, 60))
        anchor.href = url.toString()
      }
    }

    // Capture phase: runs before YLOPO's own handlers; also works if YLOPO calls stopPropagation
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [])

  return null
}
