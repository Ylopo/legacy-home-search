import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'
import imageUrlBuilder from '@sanity/image-url'
import { createClient } from '@sanity/client'
import { getBlogPostsPaginated, getMarketReports } from '@/sanity/queries'
import { BlogSearch } from './BlogSearch'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Hampton Roads Real Estate Blog | Legacy Home Search',
  description:
    'Expert insights on Hampton Roads real estate — market updates, buying tips, community spotlights, and investment analysis from the Legacy Home Search team.',
}

const CATEGORY_LABELS: Record<string, string> = {
  'market-update':       'Market Update',
  'buying-tips':         'Buying Tips',
  'selling-tips':        'Selling Tips',
  'community-spotlight': 'Community Spotlight',
  'investment':          'Investment',
  'news':                'News',
  'local-history':       'Local History',
  'community-development': 'Community Development',
}

const CATEGORY_TABS = [
  { value: 'market-report',        label: 'Market Reports' },
  { value: 'market-update',        label: 'Market Update' },
  { value: 'buying-tips',          label: 'Buying Tips' },
  { value: 'selling-tips',         label: 'Selling Tips' },
  { value: 'community-spotlight',  label: 'Community Spotlight' },
  { value: 'investment',           label: 'Investment' },
  { value: 'news',                 label: 'News' },
  { value: 'local-history',        label: 'Local History' },
  { value: 'community-development', label: 'Community Dev' },
]

const PER_PAGE = 25

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '2nr7n3lm',
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})
const builder = imageUrlBuilder(sanityClient)
function urlFor(source: any) { return builder.image(source) }

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string; q?: string }>
}) {
  const { category, page: pageParam, q } = await searchParams
  const page     = Math.max(1, parseInt(pageParam ?? '1', 10))
  const search   = q?.trim() ?? ''

  // Market reports tab: show all reports, no pagination
  if (category === 'market-report') {
    const reports = await getMarketReports(100)
    return (
      <BlogShell category={category} search={search} page={1} totalPages={1} totalPosts={reports.length}>
        {reports.length === 0 ? (
          <div className="blog-empty"><p>No market reports yet — check back soon.</p></div>
        ) : (
          <div className="blog-grid">
            {reports.map(item => {
              const imgUrl = item.coverImage
                ? urlFor(item.coverImage).width(600).height(340).fit('crop').url()
                : null
              return (
                <Link key={item._id} href={`/market-reports/${item.slug}`} className="blog-card">
                  <div className="blog-card-img">
                    {imgUrl
                      ? <Image src={imgUrl} alt={`${item.communityName} Market Report`} fill sizes="(max-width: 768px) 100vw, 400px" style={{ objectFit: 'cover' }} />
                      : <div className="blog-card-placeholder" />}
                  </div>
                  <div className="blog-card-body">
                    <span className="blog-card-category">Market Report</span>
                    <h2 className="blog-card-title">{item.communityName} Real Estate Market Trends, {item.reportPeriod}</h2>
                    {item.marketSummary && <p className="blog-card-excerpt">{item.marketSummary.slice(0, 120)}…</p>}
                    <div className="blog-card-meta">
                      <span>{item.reportPeriod}</span>
                      {item.medianListPrice && <span style={{ fontWeight: 600, color: '#2563eb' }}>{item.medianListPrice}</span>}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </BlogShell>
    )
  }

  // All other tabs + All: paginated blog posts
  const { posts, total } = await getBlogPostsPaginated({
    page,
    perPage: PER_PAGE,
    search,
    category: category ?? '',
  })

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  return (
    <BlogShell category={category} search={search} page={page} totalPages={totalPages} totalPosts={total}>
      {posts.length === 0 ? (
        <div className="blog-empty">
          <p>
            {search
              ? `No posts found for "${search}".`
              : category
              ? 'No posts in this category yet — check back soon.'
              : 'No posts yet — check back soon.'}
          </p>
          {search && (
            <Link href={category ? `/blog?category=${category}` : '/blog'} style={{ color: '#2563eb', fontSize: 14 }}>
              ← Clear search
            </Link>
          )}
        </div>
      ) : (
        <div className="blog-grid">
          {posts.map(item => {
            const imgUrl = item.coverImage
              ? urlFor(item.coverImage).width(600).height(340).fit('crop').url()
              : null
            const pubDate = item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
              : ''
            const categoryLabel = CATEGORY_LABELS[item.category ?? ''] ?? item.category

            return (
              <Link key={item._id} href={`/blog/${item.slug}`} className="blog-card">
                <div className="blog-card-img">
                  {imgUrl
                    ? <Image src={imgUrl} alt={item.title} fill sizes="(max-width: 768px) 100vw, 400px" style={{ objectFit: 'cover' }} />
                    : <div className="blog-card-placeholder" />}
                </div>
                <div className="blog-card-body">
                  {categoryLabel && <span className="blog-card-category">{categoryLabel}</span>}
                  <h2 className="blog-card-title">{item.title}</h2>
                  {item.excerpt && <p className="blog-card-excerpt">{item.excerpt}</p>}
                  <div className="blog-card-meta">
                    <span>{pubDate}</span>
                    {item.aiGenerated && <span className="blog-ai-badge">AI</span>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </BlogShell>
  )
}

// ─── Shell (hero + tabs + search + children + pagination) ────────────────────

function BlogShell({
  category, search, page, totalPages, totalPosts, children,
}: {
  category?: string
  search: string
  page: number
  totalPages: number
  totalPosts: number
  children: React.ReactNode
}) {
  function pageLink(p: number) {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (search)   params.set('q', search)
    if (p > 1)    params.set('page', String(p))
    const qs = params.toString()
    return qs ? `/blog?${qs}` : '/blog'
  }

  function tabLink(cat?: string) {
    const params = new URLSearchParams()
    if (cat)    params.set('category', cat)
    if (search) params.set('q', search)
    const qs = params.toString()
    return qs ? `/blog?${qs}` : '/blog'
  }

  const activeStyle  = { background: '#2563eb', borderColor: '#2563eb', color: '#fff' }
  const inactiveStyle = { background: '#fff', borderColor: '#e0ddd8', color: '#555550' }
  const tabBase: React.CSSProperties = {
    display: 'inline-block', padding: '7px 16px', borderRadius: 999,
    fontSize: 13, fontWeight: 600, textDecoration: 'none',
    border: '1.5px solid', transition: 'all 0.15s',
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="blog-hero">
        <div className="container">
          <span className="section-label">Insights &amp; News</span>
          <h1 className="blog-hero-title">Hampton Roads Real Estate Blog</h1>
          <p className="blog-hero-sub">
            Market reports, buying &amp; selling guides, and community insights — from the Legacy Home Search team.
          </p>
        </div>
      </section>

      {/* ── LISTING ── */}
      <section className="blog-listing">
        <div className="container">

          {/* Search + tabs row */}
          <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Search bar */}
            <Suspense>
              <BlogSearch defaultValue={search} />
            </Suspense>

            {/* Category tabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Link href={tabLink()} style={{ ...tabBase, ...(!category ? activeStyle : inactiveStyle) }}>All</Link>
              {CATEGORY_TABS.map(tab => (
                <Link
                  key={tab.value}
                  href={tabLink(tab.value)}
                  style={{ ...tabBase, ...(category === tab.value ? activeStyle : inactiveStyle) }}
                >
                  {tab.label}
                </Link>
              ))}
            </div>

            {/* Result count */}
            {category !== 'market-report' && (
              <div style={{ fontSize: 13, color: '#94a3b8' }}>
                {search
                  ? <><strong style={{ color: '#1a1a1a' }}>{totalPosts}</strong> result{totalPosts !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;</>
                  : <><strong style={{ color: '#1a1a1a' }}>{totalPosts}</strong> post{totalPosts !== 1 ? 's' : ''}{category ? ` in ${CATEGORY_LABELS[category] ?? category}` : ''}</>
                }
                {totalPages > 1 && <> · page {page} of {totalPages}</>}
              </div>
            )}
          </div>

          {/* Posts */}
          {children}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 6, marginTop: 48, flexWrap: 'wrap',
            }}>
              {/* Prev */}
              {page > 1 ? (
                <Link href={pageLink(page - 1)} style={paginBtn(false)}>← Prev</Link>
              ) : (
                <span style={paginBtn(true)}>← Prev</span>
              )}

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                const isEllipsisBefore = p === 2 && page > 4
                const isEllipsisAfter  = p === totalPages - 1 && page < totalPages - 3
                const shouldShow = p === 1 || p === totalPages || Math.abs(p - page) <= 1

                if (!shouldShow) {
                  if (isEllipsisBefore || isEllipsisAfter) {
                    return <span key={p} style={{ color: '#94a3b8', fontSize: 13, padding: '0 2px' }}>…</span>
                  }
                  return null
                }

                return (
                  <Link
                    key={p}
                    href={pageLink(p)}
                    style={{
                      ...paginBtn(p === page),
                      ...(p === page ? { background: '#2563eb', borderColor: '#2563eb', color: '#fff', fontWeight: 700 } : {}),
                    }}
                  >
                    {p}
                  </Link>
                )
              })}

              {/* Next */}
              {page < totalPages ? (
                <Link href={pageLink(page + 1)} style={paginBtn(false)}>Next →</Link>
              ) : (
                <span style={paginBtn(true)}>Next →</span>
              )}
            </nav>
          )}

        </div>
      </section>
    </>
  )
}

function paginBtn(disabled: boolean): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: 38, height: 38, padding: '0 12px',
    borderRadius: 8, border: '1.5px solid #e0ddd8',
    background: disabled ? '#f8f7f4' : '#fff',
    color: disabled ? '#cbd5e1' : '#374151',
    fontSize: 13, fontWeight: 500, textDecoration: 'none',
    cursor: disabled ? 'default' : 'pointer',
    pointerEvents: disabled ? 'none' : 'auto',
  } as React.CSSProperties
}
