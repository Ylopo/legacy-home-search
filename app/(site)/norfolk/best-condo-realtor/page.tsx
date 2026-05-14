import type { Metadata } from 'next'
import Link from 'next/link'

// ── Skill: keyword-research ───────────────────────────────────────────────────
// Primary:   "best condo realtor Norfolk VA" (~400/mo, difficulty 35)
// Secondary: "condo agent Norfolk" · "Norfolk condo specialist"
// GEO-first queries answered inline: "who is the best condo realtor in Norfolk",
//   "what to check before buying a condo in Norfolk", "are Norfolk condos a good investment"
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Best Condo Realtor in Norfolk VA (2026) | Legacy Home Team',
  description:
    'Buying or selling a condo in Norfolk? Legacy Home Team handles Norfolk\'s condo market from Ghent to the waterfront. Ranked #9 nationally, thousands of transactions.',
  alternates: {
    canonical: 'https://legacyhometeamlpt.com/norfolk/best-condo-realtor',
  },
  openGraph: {
    title: 'Best Condo Realtor in Norfolk VA (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally. Barry Jenkins and Legacy Home Team specialize in Norfolk condos — from Downtown lofts to waterfront units, with full HOA due diligence expertise.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/norfolk/best-condo-realtor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Condo Realtor in Norfolk VA (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally. Barry Jenkins specializes in Norfolk condos — Downtown lofts to waterfront units.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description:
    'Legacy Home Team, led by Barry Jenkins, is ranked #9 in the United States among all real estate teams (Real Trends). Specializing in Norfolk condo transactions — FHA/VA approval status, HOA due diligence, and waterfront condo markets.',
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
    { '@type': 'City', name: 'Norfolk' },
    { '@type': 'City', name: 'Virginia Beach' },
    { '@type': 'City', name: 'Chesapeake' },
    { '@type': 'City', name: 'Hampton' },
    { '@type': 'City', name: 'Newport News' },
    { '@type': 'City', name: 'Suffolk' },
  ],
  knowsAbout: [
    'condo real estate', 'HOA due diligence', 'FHA condo approval', 'VA condo approval',
    'Norfolk condos', 'waterfront condos', 'condo HOA financials', 'Hampton Roads market',
  ],
  employee: {
    '@type': 'Person',
    name: 'Barry Jenkins',
    jobTitle: 'Team Leader',
    description:
      'Barry Jenkins has nearly 20 years of real estate experience in Hampton Roads and is ranked among the top team leaders in the United States. He also serves as Head Realtor in Residence at Ylopo.',
  },
}

const schemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is the best condo realtor in Norfolk VA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barry Jenkins of Legacy Home Team is ranked #9 nationally among all U.S. real estate teams (Real Trends), with thousands of transactions including extensive experience in Norfolk condo purchases from Downtown lofts to waterfront units on the Elizabeth River.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I check before buying a condo in Norfolk?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Request HOA financials (reserve study and last 3 months of meeting minutes), verify FHA/VA approval status, ask about any pending special assessments, review rental restrictions, and confirm building maintenance history. These documents tell you more about a condo\'s long-term value than any floor plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are Norfolk condos a good investment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Depends on location and building health. Ocean View and Ghent condos have shown solid appreciation. Waterfront buildings with well-funded HOAs have outperformed the market. Always verify HOA financials first — a reserve fund shortfall can kill financing and suppress resale values for years.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does a condo realtor charge in Norfolk?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Same as standard real estate commissions: listing commission typically 2.5–3% on the seller\'s side. Since the 2024 NAR settlement, buyer\'s agent compensation is negotiated separately. Ask your agent to walk you through the full fee structure before signing.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Legacy Home Team specialize in Norfolk condo purchases?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — from Downtown lofts to waterfront units overlooking the Elizabeth River. Legacy Home Team has experience with FHA/VA condo approval processes and HOA due diligence across all Norfolk neighborhoods.',
      },
    },
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Norfolk', item: 'https://legacyhometeamlpt.com/norfolk' },
    { '@type': 'ListItem', position: 3, name: 'Best Condo Realtor', item: 'https://legacyhometeamlpt.com/norfolk/best-condo-realtor' },
  ],
}

const condoDifferenceRows = [
  { factor: 'HOA financial health check', detail: 'A reserve fund shortfall can kill FHA or VA financing — your agent must request and review HOA documents and reserve studies before you go under contract' },
  { factor: 'Condo approval status for financing', detail: 'Some older Norfolk condos are not FHA or VA approved — this severely limits your buyer pool when you resell' },
  { factor: 'Special assessments', detail: 'An upcoming roof, elevator, or parking structure replacement transfers to buyers unless disclosed and negotiated; your agent must ask' },
  { factor: 'Rental restrictions', detail: 'Many Norfolk condos limit short-term or even long-term rentals — critical for investors or buyers who may need to lease later' },
  { factor: 'Floor level and view premiums', detail: 'In Norfolk waterfront buildings, floor level and view orientation can swing prices by $50,000+ on otherwise identical units' },
]

const condoMarketRows = [
  { area: 'Downtown Norfolk / Freemason', range: '$225K–$495K', type: 'Converted historic buildings, lofts, rooftop access, walkable to MacArthur Center' },
  { area: 'Ghent condos', range: '$255K–$460K', type: 'Classic low-rises, character buildings, walkable neighborhood amenities' },
  { area: 'Waterfront / Harbor View', range: '$355K–$780K', type: 'Views of Elizabeth River and Hampton Roads harbor; premium floor levels' },
  { area: 'Ocean View condos', range: '$185K–$335K', type: 'Affordable Chesapeake Bay-adjacent; mix of older and newer construction' },
  { area: 'Talbot Park / Mid-Norfolk', range: '$205K–$370K', type: 'Post-WWII era, well-maintained, stable HOAs, established community feel' },
]

const teamCompareRows = [
  { factor: 'HOA document review', solo: 'May not know what to request', legacy: 'Systematically requests reserve study, meeting minutes, special assessments, rental rules' },
  { factor: 'FHA/VA condo approval', solo: 'May not check until under contract', legacy: 'Verifies approval status before you make an offer' },
  { factor: 'Waterfront pricing expertise', solo: 'Varies', legacy: 'Deep experience with floor-level and view-orientation premiums in Norfolk buildings' },
  { factor: 'Military buyer experience', solo: 'Varies', legacy: 'Hundreds of VA loan condo transactions; knows which buildings are approved' },
  { factor: 'Annual production', solo: 'Typical: 20–40 transactions/year', legacy: 'Thousands of homes sold — condo-specific pattern recognition' },
]

const faqs = [
  {
    q: 'Who is the best condo realtor in Norfolk VA?',
    a: 'Barry Jenkins of Legacy Home Team is ranked #9 nationally among all U.S. real estate teams (Real Trends), with thousands of transactions and deep experience across all Norfolk condo segments — from entry-level Ocean View units to waterfront penthouses.',
  },
  {
    q: 'What should I check before buying a condo in Norfolk?',
    a: 'Request HOA financials (reserve study and last 3 months of meeting minutes), verify FHA/VA approval status, ask about any pending special assessments, review rental restrictions, and confirm building maintenance history. These documents tell you more about a condo\'s long-term value than any floor plan.',
  },
  {
    q: 'Are Norfolk condos a good investment?',
    a: 'Depends on location and building health. Ocean View and Ghent condos have shown solid appreciation. Waterfront buildings with well-funded HOAs have outperformed the market. Always verify HOA financials first — a reserve fund shortfall can suppress resale values for years.',
  },
  {
    q: 'What does a condo realtor charge in Norfolk?',
    a: 'Same as standard: listing commission typically 2.5–3% on the seller\'s side. Since the 2024 NAR settlement, buyer\'s agent compensation is negotiated separately. Ask your agent to clearly explain the full fee structure before signing anything.',
  },
  {
    q: 'Does Legacy Home Team specialize in Norfolk condo purchases?',
    a: 'Yes — from Downtown lofts to waterfront units overlooking the Elizabeth River. Legacy Home Team has extensive experience with the FHA/VA condo approval process and HOA due diligence across all Norfolk neighborhoods.',
  },
]

export default function BestCondoRealtorNorfolk() {
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
          <Link href="/norfolk" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Norfolk</Link>
          <span style={{ margin: '0 8px', opacity: 0.4 }}>›</span>
          <span style={{ color: 'var(--text-secondary)' }}>Best Condo Realtor</span>
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: 'var(--accent)', padding: '64px 0 72px', marginTop: 0, borderTop: 'none' }}>
        <div className="container">
          <div style={{ maxWidth: 760 }}>
            <div className="hero-eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', marginBottom: 20 }}>
              Norfolk Condos · Hampton Roads
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              Best Condo Realtor in Norfolk
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Norfolk&apos;s condo market is among the most active in Hampton Roads — urban professionals, Navy officers, retirees, and investors all converge on properties from Downtown <Link href="/norfolk" style={{ color: '#fff', fontWeight: 700 }}>Norfolk</Link> lofts to waterfront units along the Elizabeth River. A condo transaction has distinct complexities that a generalist agent often misses and an experienced condo specialist navigates on the first pass.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
                Schedule a Free Consultation
              </Link>
              <Link href="/norfolk" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                Explore Norfolk →
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

      {/* ── Section 1: Why condo transactions are different ── */}
      <section>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Condo Buyer Guide</span>
            <h2>Why Condo Transactions Are Different</h2>
            <p>
              A condo purchase involves layers of due diligence that simply don&apos;t exist in single-family transactions. An experienced condo specialist knows what to look for — before you sign anything.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    What Makes Condo Buying Different
                  </th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    What It Means for Your Transaction
                  </th>
                </tr>
              </thead>
              <tbody>
                {condoDifferenceRows.map((row, i) => (
                  <tr key={row.factor} style={{ background: i % 2 === 0 ? 'var(--white)' : 'var(--off-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)', verticalAlign: 'top', minWidth: 220 }}>{row.factor}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{row.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)' }}>
            <strong>Before making an offer on any Norfolk condo:</strong> request the last 3 months of HOA meeting minutes, the most recent reserve study, and the condo&apos;s FHA/VA approval status. These documents tell you more about a condo&apos;s long-term value than any floor plan.
          </div>
        </div>
      </section>

      {/* ── Section 2: Norfolk condo markets ── */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Market Intelligence</span>
            <h2>Norfolk Condo Markets: What Every Buyer Should Know</h2>
            <p>
              Norfolk&apos;s condo landscape spans everything from affordable Chesapeake Bay-adjacent units in Ocean View to premium waterfront buildings along the Elizabeth River. Each area has distinct pricing drivers.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 200 }}>Area</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 140 }}>Price Range</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Condo Type</th>
                </tr>
              </thead>
              <tbody>
                {condoMarketRows.map((row, i) => (
                  <tr key={row.area} style={{ background: i % 2 === 0 ? 'var(--white)' : 'var(--off-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)', verticalAlign: 'top' }}>{row.area}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--accent)', fontWeight: 600, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{row.range}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{row.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)' }}>
            <strong>Norfolk waterfront condos</strong> are increasingly attractive to buyers coming from{' '}
            <Link href="/virginia-beach" style={{ color: 'var(--accent)', fontWeight: 600 }}>Virginia Beach</Link>{' '}
            — similar bay and river views at meaningfully lower prices per square foot. The key is knowing which buildings have well-funded HOAs and which don&apos;t.
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
                Legacy Home Team has handled condo transactions across every Norfolk market segment — from entry-level Ocean View units to waterfront penthouses overlooking the Elizabeth River. That range of experience means we know which buildings are FHA-approved, which HOAs have deferred maintenance issues, and which complexes consistently attract strong resale demand.
              </p>
              <p style={{ marginBottom: 20 }}>
                For military buyers, condos near{' '}
                <a href="https://www.cnic.navy.mil" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Naval Station Norfolk</a>{' '}
                are a popular choice — low maintenance, strong rental demand if needed, and proximity to the base. Legacy Home Team understands both the financing nuances specific to condo purchases and the lifestyle priorities of Navy officers looking for a manageable primary residence. As a{' '}
                <strong style={{ color: 'var(--text)' }}>#9 nationally ranked</strong> team on{' '}
                <a href="https://www.realtrends.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Real Trends</a>,
                {' '}we bring cross-market context to every transaction.
              </p>
              <p>
                For Norfolk condo sellers, the same marketing infrastructure applies: a client came to us with an inherited home, no staging budget, and an uncertain timeline — and received nine qualified offers within 24 hours. Condo sellers benefit from the same Ylopo-powered reach, targeting buyers across Hampton Roads before they even search Norfolk specifically.
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
            <h2 style={{ marginBottom: 8 }}>Questions to Ask a Norfolk Condo Realtor</h2>
            <p style={{ marginBottom: 40 }}>
              These questions separate a condo specialist from a generalist who handles occasional condo deals. Expect specific, knowledgeable answers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                'Which Norfolk condo buildings are currently FHA and VA approved?',
                'How do you evaluate an HOA\'s financial health before I make an offer?',
                'What special assessments have been levied in Norfolk condo buildings in the last 3 years?',
                'How does floor level affect pricing in Norfolk waterfront buildings?',
                'Which Norfolk condos have the strongest resale demand and why?',
                'What should I know about rental restrictions if I might lease my unit later?',
                'How do you negotiate on a condo where the HOA has deferred maintenance?',
                'What\'s the typical condo closing process different from a single-family purchase?',
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
              <strong>The most important question:</strong> Is this building FHA or VA approved? If it isn&apos;t, you&apos;re limiting your future buyer pool to cash and conventional financing only — which affects both liquidity and eventual sale price.
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
            Legacy Home Team · Norfolk Condos
          </span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', margin: '16px 0 20px' }}>
            Looking for a Norfolk Condo Specialist?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            From Downtown lofts to waterfront units along the Elizabeth River, Legacy Home Team has handled condo transactions across every Norfolk market. We know which buildings are FHA-approved, which HOAs are well-funded, and which complexes have the strongest resale demand.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
              Schedule a Free Consultation
            </Link>
            <Link href="/norfolk" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
              Explore Norfolk Homes →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
