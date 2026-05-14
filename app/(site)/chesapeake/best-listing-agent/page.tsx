import type { Metadata } from 'next'
import Link from 'next/link'

// ── Skill: keyword-research ───────────────────────────────────────────────────
// Primary:   "best listing agent in Chesapeake VA" (~400/mo, difficulty 36)
// Secondary: "sell my home in Chesapeake" · "listing agent Chesapeake VA"
// GEO-first queries: "how to sell my home fast in Chesapeake",
//   "how much does a listing agent cost in Chesapeake VA"
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Best Listing Agent in Chesapeake VA (2026) | Legacy Home Team',
  description:
    'Selling your home in Chesapeake VA? Legacy Home Team is ranked #9 in the U.S. with thousands of homes listed and sold. Get a free home valuation and the right pricing strategy.',
  alternates: {
    canonical: 'https://legacyhometeamlpt.com/chesapeake/best-listing-agent',
  },
  openGraph: {
    title: 'Best Listing Agent in Chesapeake VA (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally. Barry Jenkins and Legacy Home Team sell homes across all Chesapeake neighborhoods — from Great Bridge to rural acreage.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/chesapeake/best-listing-agent',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Listing Agent in Chesapeake VA (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally. Barry Jenkins — the right listing agent for Chesapeake sellers.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description:
    'Legacy Home Team, led by Barry Jenkins, is ranked #9 in the United States among all real estate teams (Real Trends). Listing specialists in Chesapeake, VA — serving all neighborhoods from Great Bridge to rural western Chesapeake with thousands of homes sold across Hampton Roads.',
  url: 'https://legacyhometeamlpt.com',
  telephone: '(757) 816-4037',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '5224 Indian River Rd',
    addressLocality: 'Virginia Beach',
    addressRegion: 'VA',
    postalCode: '23464',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 36.7783,
    longitude: -76.0236,
  },
  areaServed: [
    { '@type': 'City', 'name': 'Chesapeake' },
    { '@type': 'City', 'name': 'Virginia Beach' },
    { '@type': 'City', 'name': 'Norfolk' },
    { '@type': 'City', 'name': 'Hampton' },
    { '@type': 'City', 'name': 'Newport News' },
    { '@type': 'City', 'name': 'Suffolk' },
  ],
  knowsAbout: [
    'Chesapeake home selling', 'listing agent', 'home pricing strategy',
    'cross-market buyer reach', 'Great Bridge real estate', 'Chesapeake comps',
    'pre-listing preparation', 'days on market', 'Hampton Roads sellers',
  ],
  employee: {
    '@type': 'Person',
    name: 'Barry Jenkins',
    jobTitle: 'Team Leader',
    description:
      'Barry Jenkins has nearly 20 years of listing experience across Hampton Roads. He serves as Head Realtor in Residence at Ylopo and leads a team ranked #9 nationally on Real Trends.',
  },
}

const schemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is the best listing agent in Chesapeake VA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barry Jenkins of Legacy Home Team is consistently among the top listing agents in Chesapeake and Hampton Roads. The team is ranked #9 nationally on Real Trends with thousands of homes sold across the region.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a listing agent charge in Chesapeake?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Listing agent commission in Chesapeake is typically 2.5% to 3% on the seller\'s side, with a total commission of 5% to 6% split between the listing and buyer\'s agents. Following the 2024 NAR settlement, buyer\'s agent compensation is negotiated separately from the listing agreement.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I sell my home fast in Chesapeake?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The fastest Chesapeake home sales come from correct pricing, listing on Thursday (when buyer search traffic peaks), professional photography, and cross-market marketing reach to Virginia Beach and Norfolk buyers. Overpriced homes lose first-week momentum and often sit for 60+ days.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I do before listing my home in Chesapeake?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Declutter and deep clean, address minor deferred maintenance, improve curb appeal, and consider a pre-listing inspection. Ask your agent which repairs are likely to return value in your specific Chesapeake neighborhood — not every improvement has equal ROI across different sub-markets.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Legacy Home Team list and sell homes in Chesapeake?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — Legacy Home Team provides full Hampton Roads listing and selling services across all Chesapeake neighborhoods, from South Norfolk entry-level homes to rural acreage properties in western Chesapeake.',
      },
    },
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Chesapeake', item: 'https://legacyhometeamlpt.com/chesapeake' },
    { '@type': 'ListItem', position: 3, name: 'Best Listing Agent', item: 'https://legacyhometeamlpt.com/chesapeake/best-listing-agent' },
  ],
}

// ── Content data ──────────────────────────────────────────────────────────────

const criteriaRows = [
  {
    criteria: 'Chesapeake-specific comps experience',
    why: 'Comps from Great Bridge don\'t price Hickory — a listing agent needs hyper-local data, not citywide averages',
  },
  {
    criteria: 'Cross-market buyer reach',
    why: 'Many Chesapeake buyers are also searching Virginia Beach and Norfolk; your listing needs exposure across all three markets',
  },
  {
    criteria: 'Professional photography (including drone)',
    why: 'Chesapeake\'s rural and waterfront properties especially benefit from aerial photos — buyers make viewing decisions based on listing images',
  },
  {
    criteria: 'Pricing speed vs. patience strategy',
    why: 'Chesapeake DOM averages 30–40 days; homes that come in overpriced lose first-week buyer momentum that rarely returns',
  },
  {
    criteria: 'Network of ready buyers',
    why: 'A regional team with thousands of past clients often has active buyers searching right now in your target price range',
  },
]

const pricingRows = [
  {
    neighborhood: 'Great Bridge',
    sellerAdvantage: 'High demand; competitive offers common',
    pricingFactor: 'School district premium — buyers pay measurably more vs. comparable Hickory homes',
  },
  {
    neighborhood: 'Greenbrier',
    sellerAdvantage: 'Strong retail amenity premium',
    pricingFactor: 'Proximity to Town Center retail drives buyer interest and supports pricing',
  },
  {
    neighborhood: 'Western Branch / Hickory',
    sellerAdvantage: 'Stable, predictable market',
    pricingFactor: 'Lot size and condition drive price differences between similar addresses',
  },
  {
    neighborhood: 'Deep Creek',
    sellerAdvantage: 'Waterfront adds 15–30% premium',
    pricingFactor: 'Off-water Deep Creek homes price purely on age, lot, and condition',
  },
  {
    neighborhood: 'South Norfolk',
    sellerAdvantage: 'Investor + first-time buyer mix',
    pricingFactor: 'High cash buyer activity; quick closings common; condition less critical',
  },
  {
    neighborhood: 'Rural / Acreage',
    sellerAdvantage: 'Scarcity premium for the right buyer',
    pricingFactor: 'Harder comps — agent needs land and well/septic experience to price accurately',
  },
]

const teamCompareRows = [
  { factor: 'Buyer reach', solo: 'Local MLS audience', legacy: 'Cross-market reach across VB, Norfolk, and Chesapeake buyers' },
  { factor: 'Listing marketing', solo: 'Standard MLS + basic photos', legacy: 'Ylopo digital ads, social retargeting, professional photography' },
  { factor: 'Pricing strategy', solo: 'One perspective on comps', legacy: 'Team-reviewed market analysis with neighborhood-level precision' },
  { factor: 'Pre-listing support', solo: 'Varies', legacy: 'Structured pre-listing process — presentation, timing, pricing sequence' },
  { factor: 'Annual listing volume', solo: 'Typical: 10–25 listings/year', legacy: 'Hundreds of listings annually — pattern recognition at scale' },
]

const faqs = [
  {
    q: 'Who is the best listing agent in Chesapeake VA?',
    a: 'Barry Jenkins of Legacy Home Team is consistently among the top listing agents in Chesapeake and Hampton Roads. The team is ranked #9 nationally on Real Trends with thousands of homes sold across the region.',
  },
  {
    q: 'How much does a listing agent charge in Chesapeake?',
    a: 'Listing agent commission in Chesapeake is typically 2.5% to 3% on the seller\'s side, with a total commission of 5% to 6% split between the listing and buyer\'s agents. Following the 2024 NAR settlement, buyer\'s agent compensation is negotiated separately from the listing agreement.',
  },
  {
    q: 'How do I sell my home fast in Chesapeake?',
    a: 'The fastest Chesapeake home sales come from correct pricing, listing on Thursday (when buyer search traffic peaks), professional photography, and cross-market marketing reach to Virginia Beach and Norfolk buyers. Overpriced homes lose first-week momentum and often sit for 60+ days.',
  },
  {
    q: 'What should I do before listing my home in Chesapeake?',
    a: 'Declutter and deep clean, address minor deferred maintenance, improve curb appeal, and consider a pre-listing inspection. Ask your agent which repairs are likely to return value in your specific Chesapeake neighborhood — not every improvement has equal ROI across different sub-markets.',
  },
  {
    q: 'Does Legacy Home Team list and sell homes in Chesapeake?',
    a: 'Yes — Legacy Home Team provides full Hampton Roads listing and selling services across all Chesapeake neighborhoods, from South Norfolk entry-level homes to rural acreage properties in western Chesapeake.',
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BestListingAgentChesapeake() {
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaRealEstateAgent) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />

      {/* Breadcrumb */}
      <div style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--border-light)', paddingTop: 'var(--nav-h)' }}>
        <div className="container" style={{ padding: '14px 24px', fontSize: 13, color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px', opacity: 0.4 }}>›</span>
          <Link href="/chesapeake" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Chesapeake</Link>
          <span style={{ margin: '0 8px', opacity: 0.4 }}>›</span>
          <span style={{ color: 'var(--text-secondary)' }}>Best Listing Agent</span>
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: 'var(--accent)', padding: '64px 0 72px', marginTop: 0, borderTop: 'none' }}>
        <div className="container">
          <div style={{ maxWidth: 760 }}>
            <div className="hero-eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', marginBottom: 20 }}>
              Chesapeake · Hampton Roads
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              Best Listing Agent in Chesapeake
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Selling a home in <Link href="/chesapeake" style={{ color: '#fff', textDecoration: 'underline' }}>Chesapeake</Link> requires
              understanding who your buyer is — and where they&apos;re looking. Most Chesapeake buyers are comparing your home
              against similar properties in <Link href="/virginia-beach" style={{ color: '#fff', textDecoration: 'underline' }}>Virginia Beach</Link> and{' '}
              <Link href="/norfolk" style={{ color: '#fff', textDecoration: 'underline' }}>Norfolk</Link>. Your listing agent
              needs to reach all three markets to maximize competition for your home.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
                Get a Free Home Valuation
              </Link>
              <Link href="/chesapeake" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                Explore Chesapeake →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="stats-bar" style={{ background: 'var(--text)', padding: '32px 0' }}>
        <div className="container">
          <div className="stats-grid">
            {[
              { num: '~20 yrs', lbl: 'Local Experience' },
              { num: '#9', lbl: 'Nationally Ranked (Real Trends)' },
              { num: 'Thousands', lbl: 'of Homes Sold' },
              { num: '3 Teams', lbl: 'Across Hampton Roads' },
            ].map(({ num, lbl }) => (
              <div key={lbl} className="stat-item">
                <div className="stat-num">{num}</div>
                <div className="stat-lbl">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Section 1: What makes a great listing agent ── */}
      <section>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Seller&apos;s Guide</span>
            <h2>What Makes the Best Listing Agent for Chesapeake Sellers?</h2>
            <p>
              A listing agent&apos;s job in Chesapeake is different from the same role in a uniform market. The wide range of
              property types — and the cross-market buyer competition — means seller strategy here is genuinely specialized.
            </p>
          </div>

          {/* Criteria table */}
          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    What to Look For
                  </th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Why It Matters for Chesapeake Sellers
                  </th>
                </tr>
              </thead>
              <tbody>
                {criteriaRows.map((row, i) => (
                  <tr key={row.criteria} style={{ background: i % 2 === 0 ? 'var(--white)' : 'var(--off-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)', verticalAlign: 'top', minWidth: 220 }}>{row.criteria}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)' }}>
            <strong>A listing agent&apos;s job starts before the sign goes in the yard.</strong> The right pre-listing conversation —
            on pricing, presentation, and timing — determines whether you sell in three weeks at asking price or spend 90 days
            chasing the market downward.
          </div>
        </div>
      </section>

      {/* ── Section 2: Chesapeake pricing by neighborhood ── */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Market Intelligence</span>
            <h2>What Chesapeake Sellers Need to Know About Pricing</h2>
            <p>
              Each Chesapeake neighborhood has different seller dynamics. Understanding your specific sub-market is the
              difference between strategic pricing and guesswork.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 180 }}>Neighborhood</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Typical Seller Advantage</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Key Pricing Factor</th>
                </tr>
              </thead>
              <tbody>
                {pricingRows.map((row, i) => (
                  <tr key={row.neighborhood} style={{ background: i % 2 === 0 ? 'var(--white)' : 'var(--off-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)', verticalAlign: 'top' }}>{row.neighborhood}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--accent)', fontWeight: 500, verticalAlign: 'top', lineHeight: 1.65 }}>{row.sellerAdvantage}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{row.pricingFactor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)' }}>
            <strong>For waterfront Chesapeake properties</strong> along the Elizabeth River or Deep Creek, flood insurance
            status is a key selling point. A listing agent who proactively obtains and discloses the FEMA flood zone
            designation gets ahead of buyer objections before they become offer contingencies.
          </div>
        </div>
      </section>

      {/* ── Section 3: Barry Jenkins / Legacy Home Team ── */}
      <section>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

            <div>
              <span className="section-label">About Legacy Home Team</span>
              <h2 style={{ marginBottom: 20 }}>Barry Jenkins &amp; Legacy Home Team</h2>

              <p style={{ marginBottom: 20 }}>
                For Chesapeake sellers, Legacy Home Team&apos;s advantage is the cross-market buyer reach that comes from operating
                3 active teams across Hampton Roads. Most Chesapeake listings draw serious buyers from{' '}
                <Link href="/virginia-beach" style={{ color: 'var(--accent)' }}>Virginia Beach</Link> and{' '}
                <Link href="/norfolk" style={{ color: 'var(--accent)' }}>Norfolk</Link> — buyers who are comparing your home
                against properties in those markets. An agent who only works Chesapeake misses that cross-market demand entirely.
              </p>
              <p style={{ marginBottom: 20 }}>
                On the technology side, Barry&apos;s role as Head Realtor in Residence at Ylopo means Legacy Home Team listings
                get Ylopo-powered digital advertising that reaches in-market buyers across all Hampton Roads cities — not
                just the MLS audience. That reach is what creates the competition that drives final sale prices.
              </p>
              <p>
                An example of what that infrastructure produces for sellers: a client with an inherited home — no staging
                budget, an uncertain timeline, complicated family dynamics — received nine qualified offers within 24 hours of
                listing. The right listing strategy and regional marketing reach made that outcome possible.
              </p>
            </div>

            <div>
              <div style={{ background: 'var(--off-white)', borderRadius: 'var(--radius-xl)', padding: '32px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent2)', marginBottom: 20 }}>
                  Solo Listing Agent vs. Legacy Home Team
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Factor</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Solo Agent</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--accent)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Legacy Home Team</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamCompareRows.map((row, i) => (
                        <tr key={row.factor} style={{ borderBottom: '1px solid var(--border-light)', background: i % 2 !== 0 ? 'var(--white)' : 'transparent' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>{row.factor}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontSize: 13 }}>{row.solo}</td>
                          <td style={{ padding: '10px 12px', color: 'var(--text)', fontSize: 13, fontWeight: 500 }}>{row.legacy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
                {[
                  { v: '~20 yrs', l: 'Hampton Roads experience' },
                  { v: '#9 US', l: 'Real Trends ranking' },
                  { v: 'Thousands', l: 'Homes sold career' },
                  { v: '3', l: 'Teams across Hampton Roads' },
                ].map(({ v, l }) => (
                  <div key={l} style={{ background: 'var(--accent)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1, marginBottom: 4 }}>{v}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Section 4: Questions for sellers ── */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <span className="section-label">Due Diligence</span>
            <h2 style={{ marginBottom: 8 }}>Questions to Ask Before Hiring a Chesapeake Listing Agent</h2>
            <p style={{ marginBottom: 40 }}>
              The right listing agent will have specific, quantified answers to these questions. If the answer is a pitch
              rather than a number, keep asking.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                'How many Chesapeake listings did you close in the last 12 months?',
                'What\'s your average list-to-sale price ratio in Chesapeake?',
                'How do you market listings to buyers searching in Virginia Beach and Norfolk?',
                'What does your pre-listing process look like?',
                'Do you use professional photography and drone for all listings?',
                'How do you handle pricing strategy if the first offers come in low?',
                'What\'s your average days on market for Chesapeake listings?',
                'Can you show me a sample marketing plan for a home like mine?',
              ].map((q, i) => (
                <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {i + 1}
                  </span>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>{q}</p>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)', marginTop: 24 }}>
              <strong>Most important question for Chesapeake sellers:</strong> How many of your listings drew serious buyers
              from Virginia Beach or Norfolk? Cross-market demand is what creates competitive offers — and an agent who
              can&apos;t answer this question clearly isn&apos;t reaching that buyer pool.
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section>
        <div className="container">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div className="section-header" style={{ textAlign: 'left', margin: '0 0 40px' }}>
              <span className="section-label">FAQ</span>
              <h2>Frequently Asked Questions</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ borderBottom: '1px solid var(--border-light)', padding: '28px 0' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 10, lineHeight: 1.4 }}>
                    {faq.q}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text-secondary)', margin: 0 }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--accent)', borderTop: 'none' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Legacy Home Team · Chesapeake
          </span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', margin: '16px 0 20px' }}>
            Ready to Sell Your Chesapeake Home With a Top-10 Nationally Ranked Team?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Barry Jenkins and Legacy Home Team have closed thousands of listings across Hampton Roads. We&apos;ll show you
            exactly what your Chesapeake home is worth — and the cross-market strategy we&apos;d use to sell it.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
              Get a Free Home Valuation
            </Link>
            <Link href="/chesapeake" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
              Explore Chesapeake →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
