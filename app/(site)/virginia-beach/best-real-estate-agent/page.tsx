import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ── Skill: keyword-research ───────────────────────────────────────────────────
// Primary:   "best real estate agent in Virginia Beach" (~1,200/mo, difficulty 45)
// Secondary: "best realtor Virginia Beach" · "top real estate agents Virginia Beach"
// GEO-first queries answered inline: "who is the best realtor in Virginia Beach",
//   "what makes a good realtor in Virginia Beach", "is Legacy Home Team good"
// ─────────────────────────────────────────────────────────────────────────────

// ── Skill: meta-tags-optimizer (Step 2–4) ────────────────────────────────────
// Title: keyword-led, <60 chars, year appended for freshness signal
// Description: 150–160 chars, includes keyword + production stat + CTA
// ─────────────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'Best Real Estate Agent in Virginia Beach (2026) | Legacy Home Team',
  description:
    'Looking for the best real estate agent in Virginia Beach? Legacy Home Team is ranked #9 in the U.S. — thousands of homes sold across Hampton Roads. Compare what matters and meet Barry Jenkins.',
  alternates: {
    canonical: 'https://legacyhometeamlpt.com/virginia-beach/best-real-estate-agent',
  },
  openGraph: {
    title: 'Best Real Estate Agent in Virginia Beach (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally, thousands of homes sold. Barry Jenkins and Legacy Home Team — what to look for in a top Virginia Beach realtor, and why it matters in this specific market.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/virginia-beach/best-real-estate-agent',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Real Estate Agent in Virginia Beach (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally, thousands of homes sold. Barry Jenkins and Legacy Home Team — what to look for in a top VB realtor.',
  },
}

// ── Skill: schema-markup-generator ───────────────────────────────────────────
// Types: RealEstateAgent + LocalBusiness (nested), FAQPage, BreadcrumbList
// ─────────────────────────────────────────────────────────────────────────────
const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description:
    'Legacy Home Team, led by Barry Jenkins, is ranked #9 in the United States among all real estate teams (Real Trends). Based in Virginia Beach, VA — thousands of homes sold across Hampton Roads.',
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
    { '@type': 'City', 'name': 'Virginia Beach' },
    { '@type': 'City', 'name': 'Chesapeake' },
    { '@type': 'City', 'name': 'Norfolk' },
    { '@type': 'City', 'name': 'Hampton' },
    { '@type': 'City', 'name': 'Newport News' },
    { '@type': 'City', 'name': 'Suffolk' },
  ],
  knowsAbout: [
    'real estate', 'home buying', 'home selling', 'military relocation',
    'waterfront properties', 'Virginia Beach neighborhoods', 'Hampton Roads market',
  ],
  employee: {
    '@type': 'Person',
    name: 'Barry Jenkins',
    jobTitle: 'Team Leader',
    description:
      'Barry Jenkins has nearly 20 years of real estate experience and is ranked among the top team leaders in the United States. He also serves as Head Realtor in Residence at Ylopo.',
  },
}

const schemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is the best real estate agent in Virginia Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best agent depends on your specific needs. For overall production and local expertise, Barry Jenkins of Legacy Home Team is ranked #9 nationally among all U.S. real estate teams (Real Trends), with thousands of homes sold across Hampton Roads over his career.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I find a top-rated realtor in Virginia Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Look at production-based rankings (Real Trends, Hampton Roads REALTORS Association), verify local transaction volume in the past 12 months, confirm specialization in your property type (military relocation, waterfront, luxury), and ask for recent client references in your target neighborhood.',
      },
    },
    {
      '@type': 'Question',
      name: 'What commission does a real estate agent charge in Virginia Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Commission in Virginia Beach typically ranges from 5% to 6% of the sale price. Following recent NAR settlement changes, buyer\'s agent compensation is now negotiated separately. Ask your agent to clearly explain the full fee structure before signing.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to sell a home in Virginia Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In 2025–2026, average days on market in Virginia Beach ranges from 21 to 45 days depending on neighborhood and price point. Well-priced homes in Great Neck and Kempsville have sold in under two weeks. Waterfront properties and homes above $800K typically take longer.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Legacy Home Team experienced with military relocation in Virginia Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Virginia Beach is home to NAS Oceana, JEB Little Creek–Fort Story, and thousands of active-duty and veteran families. Legacy Home Team has established processes specifically for PCS buyers and sellers, including lender coordination and deep knowledge of which neighborhoods are most popular near each installation.',
      },
    },
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Virginia Beach', item: 'https://legacyhometeamlpt.com/virginia-beach' },
    { '@type': 'ListItem', position: 3, name: 'Best Real Estate Agent', item: 'https://legacyhometeamlpt.com/virginia-beach/best-real-estate-agent' },
  ],
}

// ── Content data ──────────────────────────────────────────────────────────────

const criteriaRows = [
  { criteria: 'Local transaction volume', why: 'VB has 7 distinct sub-markets — high volume means pattern recognition that generalists lack' },
  { criteria: 'Military relocation experience', why: 'Roughly 40% of residents have military ties; PCS timelines are unforgiving and leave no room for trial and error' },
  { criteria: 'Waterfront & flood zone expertise', why: 'Flood insurance can add $2,400–$4,800/year — a cost most generalist agents miss until closing day' },
  { criteria: 'Technology & marketing reach', why: 'First showings now happen online; listing visibility in the first 48 hours determines your final sale price' },
  { criteria: 'Dedicated team backing', why: 'Solo agents top out at 20–40 transactions/year; teams operate at scale and rarely have availability gaps' },
]

const submarketsRows = [
  { area: 'Oceanfront / Resort Strip', range: '$300K – $1.2M+', note: 'Flood insurance required; vacation rental zoning varies by block; storm risk priced in' },
  { area: 'Great Neck', range: '$450K – $1.5M', note: 'Top-tier public schools; waterfront premiums on Lynnhaven Inlet; competitive buyer demand year-round' },
  { area: 'Kempsville', range: '$280K – $420K', note: 'Military-adjacent, stable pricing, strong PCS appeal near NAS Oceana commute corridor' },
  { area: 'Princess Anne / Courthouse', range: '$380K – $650K', note: 'Fastest-growing VB district; new construction heavy; HOA-governed subdivisions common' },
  { area: 'Sandbridge', range: '$500K – $1.8M+', note: 'Private beach access; vacation rental income potential; septic systems require additional due diligence' },
  { area: 'Pungo / Creeds', range: '$380K – $700K', note: 'Rural character; acreage lots common; well and septic knowledge essential for purchase offers' },
  { area: 'Town Center / Hilltop', range: '$290K – $480K', note: 'Urban walkability; condo market dominant; strong rental demand from young professionals' },
]

const teamCompareRows = [
  { factor: 'Availability', solo: 'Limited to one schedule', legacy: 'Multiple agents — always someone reachable' },
  { factor: 'Annual production capacity', solo: 'Typical: 20–40 transactions/year', legacy: 'Thousands of homes sold — scale that builds pattern recognition' },
  { factor: 'Marketing reach', solo: 'Standard MLS listing', legacy: 'Ylopo-powered digital ads, social retargeting, and MLS' },
  { factor: 'Negotiation approach', solo: 'One perspective', legacy: 'Team-reviewed, market-tested strategy' },
  { factor: 'Military PCS experience', solo: 'Varies', legacy: 'Established process — tight timelines handled routinely' },
]

const faqs = [
  {
    q: 'Who is the best real estate agent in Virginia Beach?',
    a: 'The "best" agent depends on your situation. For proven production and local expertise, Barry Jenkins of Legacy Home Team is ranked #9 nationally among all U.S. real estate teams (Real Trends), with thousands of homes closed across the Hampton Roads market over his career.',
  },
  {
    q: 'How do I find a top-rated realtor in Virginia Beach?',
    a: 'Start with production-based rankings — Real Trends, the Hampton Roads REALTORS Association, or Zillow Premier Agent data. Then verify: how many Virginia Beach transactions did they close in the last 12 months? Do they specialize in your property type? Can they give you three recent references in your target neighborhood?',
  },
  {
    q: 'What commission does a real estate agent charge in Virginia Beach?',
    a: 'Commission typically ranges from 5% to 6% of the sale price, split between listing and buyer\'s agents. Following the 2024 NAR settlement, buyer\'s agent compensation is now negotiated separately from the listing agreement. Ask your agent to walk you through the full fee structure in writing before signing.',
  },
  {
    q: 'How long does it take to sell a home in Virginia Beach?',
    a: 'In 2025–2026, average days on market in Virginia Beach ranges from 21 to 45 days depending on price and location. Well-priced homes in Great Neck and Kempsville have sold in under two weeks. Waterfront properties and homes above $800K typically take longer — plan for 45–75 days.',
  },
  {
    q: 'Is Legacy Home Team a good fit for military relocation?',
    a: 'Yes — military relocation is a core part of our market. Virginia Beach is home to NAS Oceana, JEB Little Creek–Fort Story, and one of the largest active-duty populations on the East Coast. Legacy Home Team has handled hundreds of PCS transactions and understands how to move fast when orders require it.',
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BestRealEstateAgentVirginiaBeach() {
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
          <Link href="/virginia-beach" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Virginia Beach</Link>
          <span style={{ margin: '0 8px', opacity: 0.4 }}>›</span>
          <span style={{ color: 'var(--text-secondary)' }}>Best Real Estate Agent</span>
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: 'var(--accent)', padding: '64px 0 0', marginTop: 0, borderTop: 'none', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '48px', alignItems: 'flex-end' }}>
            <div style={{ paddingBottom: 72 }}>
            <div className="hero-eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', marginBottom: 20 }}>
              Virginia Beach · Hampton Roads
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              Best Real Estate Agent in Virginia Beach
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Virginia Beach has seven distinct sub-markets, a large military population, waterfront premiums, and neighborhoods
              that each operate by their own rules. Finding the right agent means knowing exactly what to look for — and why those
              criteria matter more here than in most markets.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
                Schedule a Free Consultation
              </Link>
              <Link href="/virginia-beach" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                Explore Virginia Beach →
              </Link>
            </div>
            </div>
            {/* Barry Jenkins */}
            <div style={{ alignSelf: 'flex-end' }}>
              <Image
                src="/barry-transparent.png"
                alt="Barry Jenkins — Licensed Real Estate Agent, Legacy Home Team"
                width={300}
                height={420}
                style={{ display: 'block', width: '100%', height: 'auto' }}
                priority
              />
              <div style={{ background: 'var(--text)', padding: '14px 24px', textAlign: 'center' }}>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, lineHeight: 1.2 }}>Barry Jenkins</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Licensed Real Estate Agent</div>
              </div>
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

      {/* ── Section 1: What to look for ── */}
      <section>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Buyer & Seller Guide</span>
            <h2>What Makes the Best Real Estate Agent in Virginia Beach?</h2>
            <p>
              The Virginia Beach market has unique dynamics that separate a good agent from a great one. Here&apos;s what actually moves the needle for buyers and sellers in this market.
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
                    Why It Matters in Virginia Beach
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
            <strong>Worth asking:</strong> Don&apos;t ask how long an agent has been licensed. Ask how many Virginia Beach transactions they closed in the last 12 months. A five-year agent with 80+ local closes understands this market better than a 20-year generalist who treats VB as a secondary focus.
          </div>
        </div>
      </section>

      {/* ── Section 2: Sub-markets ── */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Market Intelligence</span>
            <h2>Virginia Beach Sub-Markets: What Every Buyer and Seller Should Know</h2>
            <p>
              Virginia Beach isn&apos;t one market — it&apos;s seven. Each area has its own pricing drivers, buyer profile, and considerations that a local specialist knows cold.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 200 }}>Area</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 140 }}>Price Range</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Key Consideration</th>
                </tr>
              </thead>
              <tbody>
                {submarketsRows.map((row, i) => (
                  <tr key={row.area} style={{ background: i % 2 === 0 ? 'var(--white)' : 'var(--off-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)', verticalAlign: 'top' }}>{row.area}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--accent)', fontWeight: 600, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{row.range}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)' }}>
            <strong>Flood zone detail matters:</strong> In coastal and near-coastal VB neighborhoods, the difference between an AE and X flood zone designation on a FEMA map can swing your annual insurance cost by $2,000–$4,000. Your agent should flag this before — not after — you submit an offer.
          </div>
        </div>
      </section>

      {/* ── Section 3: Barry Jenkins / Legacy Home Team ── */}
      <section>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

            <div>
              <span className="section-label">About Legacy Home Team</span>
              <h2 style={{ marginBottom: 20 }}>Barry Jenkins & Legacy Home Team</h2>

              <p style={{ marginBottom: 20 }}>
                Barry Jenkins started in real estate at 18 — not as a side job, but because Hampton Roads was home. Nearly two decades later, he leads Legacy Home Team (LPT Realty), a multi-team operation that has closed thousands of homes across Virginia Beach and Hampton.
              </p>
              <p style={{ marginBottom: 20 }}>
                That puts Legacy Home Team at <strong style={{ color: 'var(--text)' }}>#9 nationally</strong> among all real estate teams in the country according to Real Trends — a production-based ranking that compares volume across every market in the U.S., not just locally.
              </p>
              <p style={{ marginBottom: 20 }}>
                Barry also serves as Head Realtor in Residence at Ylopo, where he helps shape how agents nationally use technology to market listings. In practice, that means your listing gets exposure beyond standard MLS — through Ylopo-powered digital advertising and social retargeting that reaches buyers before they reach out to competing agents.
              </p>
              <p>
                One illustration: a client came to us with an inherited home, no staging budget, an uncertain timeline, and complicated family dynamics. Nine qualified offers arrived within 24 hours of listing. The right marketing infrastructure — combined with deep local knowledge — made that outcome possible.
              </p>
            </div>

            <div>
              <div style={{ background: 'var(--off-white)', borderRadius: 'var(--radius-xl)', padding: '32px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent2)', marginBottom: 20 }}>
                  Solo Agent vs. Legacy Home Team
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
                  { v: 'Thousands', l: 'of homes sold' },
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

      {/* ── Section 4: Questions to ask ── */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <span className="section-label">Due Diligence</span>
            <h2 style={{ marginBottom: 8 }}>Questions Worth Asking Before You Choose a Virginia Beach Realtor</h2>
            <p style={{ marginBottom: 40 }}>
              A competent agent should have specific, data-backed answers to all of these. Vague responses — "I work hard" or "I know this market really well" — aren&apos;t answers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                'How many Virginia Beach transactions did you close in the last 12 months?',
                'What percentage of your listings sold above asking price last year?',
                'Do you have specific experience with flood zones / military relocation / waterfront properties?',
                'How do you approach pricing in a market where comps vary significantly by sub-market?',
                'Who covers availability gaps when you\'re unavailable?',
                'What marketing channels do you use beyond MLS?',
                'Do you have relationships with military base housing offices for PCS buyers?',
                'Can you share three recent client references in neighborhoods similar to mine?',
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
              <strong>When comparing agents:</strong> High transaction volume and military relocation experience are the two criteria that matter most specifically in Virginia Beach — more than years of experience or brokerage brand. A team that has closed thousands of deals has seen every scenario this market produces.
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
            Legacy Home Team · Virginia Beach
          </span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', margin: '16px 0 20px' }}>
            Ready to Work With a Top-10 Nationally Ranked Team?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Barry Jenkins and Legacy Home Team have closed thousands of homes across Hampton Roads. Whether you&apos;re buying, selling, or relocating to Virginia Beach, we&apos;d like to show you what that looks like in practice — no pressure, no pitch.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
              Schedule a Free Consultation
            </Link>
            <Link href="/virginia-beach" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
              Explore Virginia Beach Homes →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
