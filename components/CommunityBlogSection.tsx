import type { CommunityPost } from '@/sanity/queries'
import CommunityBlogTabs from './CommunityBlogTabs'

type Props = {
  communityName: string
  recentPosts: CommunityPost[]
  featuredPosts: CommunityPost[]
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function CommunityBlogSection({ communityName, recentPosts, featuredPosts }: Props) {
  if (recentPosts.length === 0 && featuredPosts.length === 0) return null

  const recentCards = recentPosts.map((post) => (
    <a
      key={post._id}
      href={`/blog/${post.slug}`}
      style={{
        flexShrink: 0,
        width: 240,
        background: 'var(--white)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {post.coverImageUrl ? (
        <img
          src={post.coverImageUrl}
          alt={post.title}
          style={{ width: '100%', height: 140, objectFit: 'cover' }}
        />
      ) : (
        <div style={{ width: '100%', height: 140, background: 'var(--off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
          🏠
        </div>
      )}
      <div style={{ padding: '14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4 }}>{post.title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 'auto' }}>{fmt(post.publishedAt)}</div>
      </div>
    </a>
  ))

  const featuredCards = featuredPosts.length > 0 ? (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
      {featuredPosts.map((post) => (
        <a
          key={post._id}
          href={`/blog/${post.slug}`}
          style={{
            background: 'var(--white)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 22px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {post.category && (
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)' }}>
              {post.category.replace(/-/g, ' ')}
            </div>
          )}
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4 }}>{post.title}</div>
          {post.excerpt && (
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {post.excerpt}
            </div>
          )}
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{fmt(post.publishedAt)}</div>
        </a>
      ))}
    </div>
  ) : (
    <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No pinned posts yet — check back soon.</p>
  )

  return (
    <section style={{ background: 'var(--off-white)', padding: '64px 0' }}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">From the Blog</span>
          <h2>Latest {communityName} Insights</h2>
          <p>Market updates, buying tips, and local news relevant to {communityName} homeowners and buyers.</p>
        </div>
        <CommunityBlogTabs
          recentCards={recentCards}
          featuredCards={featuredCards}
          hasRecent={recentPosts.length > 0}
        />
        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <a href="/blog" style={{ display: 'inline-block', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px 24px', borderRadius: 'var(--radius)', textDecoration: 'none' }}>
            View All Blog Posts →
          </a>
        </div>
      </div>
    </section>
  )
}
