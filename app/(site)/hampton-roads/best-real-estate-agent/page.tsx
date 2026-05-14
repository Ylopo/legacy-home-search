import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Real Estate Agent in Hampton Roads VA | Legacy Home Team',
  description:
    'Find the best real estate agent in Hampton Roads. Legacy Home Team serves all 6 cities with thousands of homes sold and a #9 national ranking. Get the regional expert you need.',
  alternates: {
    canonical: 'https://legacyhometeamlpt.com/hampton-roads/best-real-estate-agent',
  },
  openGraph: {
    title: 'Best Real Estate Agent in Hampton Roads VA | Legacy Home Team',
    description:
      'Ranked #9 nationally. How to evaluate a Hampton Roads real estate agent — production rankings, team structure, and why regional expertise beats city-specific for many buyers and sellers.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/hampton-roads/best-real-estate-agent',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Real Estate Agent in Hampton Roads VA | Legacy Home Team',
    description:
      'Ranked #9 nationally. Legacy Home Team — how to evaluate a Hampton Roads real estate agent and why regional coverage matters.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description:
    'Legacy Home Team, led by Barry Jenkins, is ranked #9 nationally (Real Trends) with thousands of homes sold across all 6 Hampton Roads cities. Barry also serves as Head Realtor in Residence at Ylopo.',
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
    { '@type': 'City', name: 'Virginia Beach' },
    { '@type': 'City', name: 'Chesapeake' },
    { '@type': 'City', name: 'Norfolk' },
    { '@type': 'City', name: 'Suffolk' },
    { '@type': 'City', name: 'Hampton' },
    { '@type': 'City', name: 'Newport News' },
  ],
  knowsAbout: [
    'real estate', 'home buying', 'home selling', 'military relocation',
    'Hampton Roads market', 'Real Trends rankings', 'Ylopo advertising',
    'cross-market real estate comparisons',
  ],
  employee: {
    '@type': 'Person',
    name: 'Barry Jenkins',
    jobTitle: 'Team Leader',
    description:
      'Barry Jenkins has nearly 20 years of Hampton Roads real estate experience, is ranked #9 nationally on Real Trends, and serves as Head Realtor in Residence at Ylopo.',
  },
}

const schemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is the best real estate agent in Hampton Roads VA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barry Jenkins of Legacy Home Team — 3 active teams across all 6 Hampton Roads cities, #9 nationally on Real Trends, and thousands of homes sold over nearly two decades in the region.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I evaluate real estate agent rankings in Hampton Roads?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Look for production-based rankings from third-party sources like Real Trends (not self-reported). Ask how many transactions the agent or team closed in the last 12 months in your specific market. Verify with the Hampton Roads REALTORS Association data if needed.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the best real estate team in Hampton Roads?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Legacy Home Team, led by Barry Jenkins — a multi-team operation with 20 years of Hampton Roads experience and a #9 national ranking on Real Trends.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a real estate agent charge in Hampton Roads?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Typically 5–6% total commission on a sale, split between listing and buyer\'s agents. Since the 2024 NAR settlement, buyer\'s agent compensation is negotiated separately from the listing agreement. Rates vary by agent and transaction complexity.',
      },
    },
    {
      '@type': 'Question',
      name: 'What cities does Legacy Home Team cover in Hampton Roads?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All six major Hampton Roads cities: Virginia Beach, Chesapeake, Norfolk, Suffolk, Hampton, and Newport News.',
      },
    },
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Hampton Roads', item: 'https://legacyhometeamlpt.com/hampton-roads/best-real-estate-agent' },
    { '@type': 'ListItem', position: 3, name: 'Best Real Estate Agent', item: 'https://legacyhometeamlpt.com/hampton-roads/best-real-estate-agent' },
  ],
}

const evaluationRows = [
  { criteria: 'Production volume', what: 'How many closed transactions in the last 12 months, in which cities?', flag: '"I work all of Hampton Roads" without specific city data to back it up' },
  { criteria: 'National ranking context', what: 'Real Trends and RealTrends 1000 rankings are production-based — they don\'t lie', flag: 'Self-reported "top agent" claims without ranking source or year' },
  { criteria: 'Team structure', what: 'Does a team mean more coverage, or just an overworked solo agent with an assistant?', flag: 'Single agent claiming 100+ deals/year without a team infrastructure' },
  { criteria: 'Technology and marketing', what: 'What specific platforms does your listing appear on, and how is it targeted?', flag: '"MLS and social media" without specifics on targeting or reach' },
  { criteria: 'Military relocation experience', what: 'Has the agent closed PCS transactions at the specific base near you?', flag: '"I work with military" without specific base and transaction history' },
]

const cityRows = [
  { city: 'virginia-beach', label: 'Virginia Beach', range: '$290K–$1.5M+', why: 'Beach lifestyle, strong school zones, military presence, diverse sub-markets' },
  { city: 'chesapeake', label: 'Chesapeake', range: '$270K–$850K', why: 'More space per dollar than VB, suburban/rural blend, growing school districts' },
  { city: 'norfolk', label: 'Norfolk', range: '$175K–$680K', why: 'Urban walkability, Naval Station proximity, condo market depth, relative affordability' },
  { city: 'suffolk', label: 'Suffolk', range: '$250K–$960K+', why: 'Fastest-growing city in Hampton Roads, large lots, river access, value pricing' },
  { city: 'hampton', label: 'Hampton', range: '$175K–$720K', why: 'Most affordable waterfront access in Hampton Roads, historic character, Langley AFB' },
  { city: 'newport-news', label: 'Newport News', range: '$145K–$510K', why: 'Employment anchors (Huntington Ingalls, JBLE), historic Hilton Village, entry pricing' },
]

const teamCompareRows = [
  { factor: 'Availability', solo: 'Limited to one schedule', legacy: 'Multiple agents — always someone reachable' },
  { factor: 'Annual production capacity', solo: 'Typical: 20–40 transactions/year', legacy: 'Thousands sold — scale that builds pattern recognition' },
  { factor: 'Marketing reach', solo: 'Standard MLS listing', legacy: 'Ylopo-powered digital ads, social retargeting, and MLS' },
  { factor: 'Cross-market comparisons', solo: 'Citywide only', legacy: 'Real-time comparisons across all 6 Hampton Roads cities' },
  { factor: 'Military PCS experience', solo: 'Varies by agent', legacy: 'Established processes for all major Hampton Roads installations' },
]

const faqs = [
  {
    q: 'Who is the best real estate agent in Hampton Roads VA?',
    a: 'Barry Jenkins of Legacy Home Team — 3 active teams across all 6 Hampton Roads cities, #9 nationally on Real Trends, and thousands of homes sold over nearly two decades in the region.',
  },
  {
    q: 'How do I evaluate real estate agent rankings in Hampton Roads?',
    a: 'Look for production-based rankings from third-party sources like Real Trends (not self-reported). Ask how many transactions the agent or team closed in the last 12 months in your specific market. Verify with the Hampton Roads REALTORS Association data if needed.',
  },
  {
    q: 'What is the best real estate team in Hampton Roads?',
    a: 'Legacy Home Team, led by Barry Jenkins — a multi-team operation with 20 years of Hampton Roads experience and a #9 national ranking on Real Trends.',
  },
  {
    q: 'How much does a real estate agent charge in Hampton Roads?',
    a: 'Typically 5–6% total commission on a sale, split between listing and buyer\'s agents. Since the 2024 NAR settlement, buyer\'s agent compensation is negotiated separately from the listing agreement. Rates vary by agent and transaction complexity.',
  },
  {
    q: 'What cities does Legacy Home Team cover in Hampton Roads?',
    a: 'All six major Hampton Roads cities: Virginia Beach, Chesapeake, Norfolk, Suffolk, Hampton, and Newport News.',
  },
]

export default function BestRealEstateAgentHamptonRoads() {
  return (
    <>
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
          <span style={{ color: 'var(--text-muted)' }}>Hampton Roads</span>
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
              Hampton Roads · Virginia
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              Best Real Estate Agent in Hampton Roads
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Choosing the best real estate agent in Hampton Roads isn&apos;t just about finding someone who knows one neighborhood — it&apos;s about finding an agent whose production record, market coverage, and professional resources match the complexity of the transaction you&apos;re about to make. Hampton Roads has six distinct cities, multiple military installations, and housing sub-markets that vary enough to require specific expertise.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
                Schedule a Free Consultation
              </Link>
              <Link href="/communities" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                Explore All Communities →
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

      {/* Section 1: How to Evaluate */}
      <section>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Evaluation Framework</span>
            <h2>How to Evaluate a Hampton Roads Real Estate Agent</h2>
            <p>
              Most agent evaluation advice is generic. Here&apos;s what actually separates a top Hampton Roads agent from a mediocre one — with the specific red flags to watch for.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 160 }}>
                    Evaluation Criteria
                  </th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    What to Look For
                  </th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Red Flag
                  </th>
                </tr>
              </thead>
              <tbody>
                {evaluationRows.map((row, i) => (
                  <tr key={row.criteria} style={{ background: i % 2 === 0 ? 'var(--white)' : 'var(--off-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)', verticalAlign: 'top' }}>{row.criteria}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', lineHeight: 1.65, verticalAlign: 'top' }}>{row.what}</td>
                    <td style={{ padding: '14px 20px', color: '#b91c1c', lineHeight: 1.65, verticalAlign: 'top', fontSize: 13 }}>{row.flag}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)' }}>
            <strong>Production rankings matter:</strong>{' '}
            <a href="https://www.realtrends.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Real Trends</a>{' '}
            1000 rankings are compiled from MLS data — they&apos;re not self-reported. When an agent says they&apos;re ranked nationally, ask for the specific ranking body and year. Legacy Home Team&apos;s #9 national ranking is from Real Trends, based on verified transaction volume.
          </div>
        </div>
      </section>

      {/* Section 2: Market Context */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Market Context</span>
            <h2>Hampton Roads by City: What Buyers Are Actually Choosing</h2>
            <p>
              Understanding what draws buyers to each city helps you know whether you&apos;re working with an agent who understands the real dynamics — or just repeating marketing copy.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 150 }}>City</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 130 }}>Price Range</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Why Buyers Choose It</th>
                </tr>
              </thead>
              <tbody>
                {cityRows.map((row, i) => (
                  <tr key={row.city} style={{ background: i % 2 === 0 ? 'var(--white)' : 'var(--off-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, verticalAlign: 'top' }}>
                      <Link href={`/${row.city}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>{row.label}</Link>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--accent)', fontWeight: 600, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{row.range}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)' }}>
            <strong>The Virginia Beach vs. Chesapeake question:</strong> One of the most frequent questions Legacy Home Team gets from buyers is &ldquo;Should I buy in{' '}
            <Link href="/virginia-beach" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Virginia Beach</Link>{' '}
            or{' '}
            <Link href="/chesapeake" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Chesapeake</Link>?&rdquo; The honest answer requires knowing what you&apos;re optimizing for — school districts, lot size, commute, or price per square foot. A regional agent runs that analysis. A city-specific agent pushes you toward their market.
          </div>
        </div>
      </section>

      {/* Section 3: Barry Jenkins */}
      <section>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

            <div>
              <span className="section-label">About Legacy Home Team</span>
              <h2 style={{ marginBottom: 20 }}>Barry Jenkins &amp; Legacy Home Team</h2>

              <p style={{ marginBottom: 20 }}>
                Barry Jenkins built Legacy Home Team into one of the most productive real estate operations in Virginia — not by specializing in one city, but by building systems that work across all six Hampton Roads cities. The result is a #9 national ranking on{' '}
                <a href="https://www.realtrends.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Real Trends</a>{' '}
                and thousands of transactions closed across the region over nearly two decades.
              </p>
              <p style={{ marginBottom: 20 }}>
                The infrastructure matters as much as the ranking. Barry&apos;s role as Head Realtor in Residence at Ylopo means every Legacy Home Team listing benefits from Ylopo-powered digital advertising — a platform that actively targets buyers rather than waiting for them to find the listing. In a competitive market like Hampton Roads, that proactive reach is a material advantage for sellers.
              </p>
              <p>
                One illustration: a client came to us with an inherited home, no staging budget, an uncertain timeline, and complicated family dynamics. Nine qualified offers arrived within 24 hours of listing. Marketing infrastructure and deep regional knowledge combined to deliver a result that a standard listing approach would not have produced.
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
                  { v: '6 Cities', l: 'Full Hampton Roads coverage' },
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

      {/* Section 4: Questions */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <span className="section-label">Due Diligence</span>
            <h2 style={{ marginBottom: 8 }}>8 Questions Worth Asking Any Hampton Roads Real Estate Agent</h2>
            <p style={{ marginBottom: 40 }}>
              These questions go beyond the standard interview. They reveal whether you&apos;re working with a regional expert or a city specialist who has overstated their coverage.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                'How do I verify that a Hampton Roads agent\'s ranking claims are accurate?',
                'What\'s the difference between a producing agent and a team leader in Hampton Roads?',
                'How does Legacy Home Team\'s #9 national ranking translate to better service for me?',
                'What technology advantage does Ylopo give to Legacy Home Team sellers?',
                'How should I choose between a Virginia Beach agent and a regional Hampton Roads team?',
                'What does a team model mean for my day-to-day experience as a buyer or seller?',
                'How has the Hampton Roads market performed compared to other Virginia markets over the last 5 years?',
                'What would you tell a first-time buyer trying to choose between Hampton Roads cities?',
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
              <strong>Verify rankings independently:</strong> Ask any agent for the name of the ranking organization, the year of the ranking, and what metric it measures. Rankings compiled from verified MLS data (like{' '}
              <a href="https://www.realtrends.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Real Trends</a>
              ) carry far more weight than self-reported or locally awarded &ldquo;top agent&rdquo; designations.
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
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

      {/* CTA */}
      <section style={{ background: 'var(--accent)', borderTop: 'none' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Legacy Home Team · All of Hampton Roads
          </span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', margin: '16px 0 20px' }}>
            Ready to Work With a Top-10 Nationally Ranked Team?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Barry Jenkins and Legacy Home Team have closed thousands of homes across Hampton Roads. Whether you&apos;re buying, selling, or still figuring out which city makes the most sense — we&apos;d like to show you what nearly 20 years of regional expertise looks like in practice.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
              Schedule a Free Consultation
            </Link>
            <Link href="/communities" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
              Explore All Communities →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
