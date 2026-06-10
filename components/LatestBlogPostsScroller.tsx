import type { CommunityPost } from '@/sanity/queries'

type Props = {
  posts: CommunityPost[]
}

const CATEGORY_LABELS: Record<string, string> = {
  'market-update':       'Market Update',
  'buying-tips':         'Buying Tips',
  'selling-tips':        'Selling Tips',
  'community-spotlight': 'Community',
  investment:            'Investment',
  news:                  'News',
  'cost-breakdown':      'Cost Breakdown',
  'flood-and-risk':      'Flood & Risk',
  'local-history':       'Local History',
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function LatestBlogPostsScroller({ posts }: Props) {
  if (posts.length === 0) return null

  return (
    <section style={{ background: 'var(--off-white)', padding: '64px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
          <div>
            <span className="section-label">From the Blog</span>
            <h2 style={{ margin: '8px 0 0' }}>Latest Hampton Roads Insights</h2>
          </div>
          <a
            href="/blog"
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--accent)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            View all posts →
          </a>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 16,
            scrollbarWidth: 'thin',
          }}
        >
          {posts.map((post) => (
            <a
              key={post._id}
              href={`/blog/${post.slug}`}
              style={{
                flexShrink: 0,
                width: 280,
                background: 'var(--white)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                scrollSnapAlign: 'start',
              }}
            >
              {post.coverImageUrl ? (
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{ width: '100%', height: 160, background: 'var(--off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>
                  🏠
                </div>
              )}
              <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {post.category && CATEGORY_LABELS[post.category] && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {CATEGORY_LABELS[post.category]}
                  </span>
                )}
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.35 }}>{post.title}</div>
                {post.excerpt && (
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.excerpt}
                  </div>
                )}
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 'auto', paddingTop: 4 }}>{fmt(post.publishedAt)}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
