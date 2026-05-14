import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Realtor in Hampton Roads VA (2026) | Legacy Home Team',
  description:
    'Looking for the best realtor in Hampton Roads? Legacy Home Team serves all 6 cities — Virginia Beach, Chesapeake, Norfolk, Suffolk, Hampton, and Newport News. Ranked #9 nationally.',
  alternates: {
    canonical: 'https://legacyhometeamlpt.com/hampton-roads/best-realtor',
  },
  openGraph: {
    title: 'Best Realtor in Hampton Roads VA (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally. Barry Jenkins and Legacy Home Team — 3 active teams covering all 6 Hampton Roads cities with real cross-market expertise.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/hampton-roads/best-realtor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Realtor in Hampton Roads VA (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally. Legacy Home Team covers all 6 Hampton Roads cities — Virginia Beach, Chesapeake, Norfolk, Suffolk, Hampton, Newport News.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description:
    'Legacy Home Team, led by Barry Jenkins, is ranked #9 nationally (Real Trends) and operates 3 active teams across all 6 Hampton Roads cities: Virginia Beach, Chesapeake, Norfolk, Suffolk, Hampton, and Newport News.',
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
    'Hampton Roads market', 'cross-market comparisons', 'regional real estate',
    'Naval Station Norfolk', 'NAS Oceana', 'Langley AFB', 'Fort Eustis',
  ],
  employee: {
    '@type': 'Person',
    name: 'Barry Jenkins',
    jobTitle: 'Team Leader',
    description:
      'Barry Jenkins has nearly 20 years of Hampton Roads real estate experience and is ranked among the top team leaders in the United States. Leads 3 active teams covering all 6 Hampton Roads cities.',
  },
}

const schemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is the best realtor in Hampton Roads VA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barry Jenkins of Legacy Home Team leads 3 active teams covering all 6 Hampton Roads cities, holds a #9 national ranking on Real Trends, and has closed thousands of homes across the region over nearly two decades.',
      },
    },
    {
      '@type': 'Question',
      name: 'What cities does Legacy Home Team serve in Hampton Roads?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Legacy Home Team serves all six major Hampton Roads cities: Virginia Beach, Chesapeake, Norfolk, Suffolk, Hampton, and Newport News — with active teams and transaction history in each.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Hampton Roads a good place to buy real estate in 2026?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — Hampton Roads offers consistent military demand, meaningful employment anchors (Navy, shipbuilding, defense contracting), and relative affordability compared to other major East Coast metros. Median prices are significantly below comparable markets in Northern Virginia or the D.C. suburbs.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the most affordable city in Hampton Roads?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hampton and Newport News generally offer the lowest median prices. Chesapeake and Suffolk offer more space per dollar than Virginia Beach. Norfolk has the widest price range from entry-level to luxury.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why choose a regional Hampton Roads team over a city-specific agent?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A regional team can make genuine cross-market comparisons, has active buyers in every city, covers all military installations, and brings pricing pattern data across the entire region — giving buyers and sellers a full picture that a city-specific agent cannot provide.',
      },
    },
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Hampton Roads', item: 'https://legacyhometeamlpt.com/hampton-roads/best-realtor' },
    { '@type': 'ListItem', position: 3, name: 'Best Realtor', item: 'https://legacyhometeamlpt.com/hampton-roads/best-realtor' },
  ],
}

const cityRows = [
  { city: 'virginia-beach', label: 'Virginia Beach', character: 'Coastal, military, 7 distinct sub-markets', range: '$290K–$1.5M+' },
  { city: 'chesapeake', label: 'Chesapeake', character: 'Suburban/rural blend, family-oriented, growing', range: '$270K–$850K' },
  { city: 'norfolk', label: 'Norfolk', character: 'Urban, Naval Station Norfolk, condo-heavy', range: '$175K–$680K' },
  { city: 'suffolk', label: 'Suffolk', character: 'Rural/suburban, acreage market, fastest-growing', range: '$250K–$960K+' },
  { city: 'hampton', label: 'Hampton', character: 'Affordable, historic, waterfront, Langley AFB', range: '$175K–$720K' },
  { city: 'newport-news', label: 'Newport News', character: 'Shipbuilding/defense, military, diverse', range: '$145K–$510K' },
]

const regionalRows = [
  { factor: 'Active buyer network across all 6 cities', why: 'Sellers get exposure to buyers searching in every Hampton Roads city — not just their own' },
  { factor: 'Accurate cross-market comparisons', why: 'A Norfolk buyer wanting more space gets a genuine Virginia Beach vs. Chesapeake vs. Suffolk comparison — not a referral to a different agent' },
  { factor: 'Military relocation across installations', why: 'Hampton Roads has Naval Station Norfolk, NAS Oceana, JEB Little Creek, Langley AFB, Fort Eustis, and more — one regional team covers all of them' },
  { factor: 'Consistent communication and process', why: 'Three teams, one operating standard — buyers and sellers get the same professional experience regardless of city' },
  { factor: '20 years of regional pricing pattern data', why: 'Appreciation in one Hampton Roads city predicts trajectory in adjacent cities — regional experience spots this; city-specific agents miss it' },
]

const teamCompareRows = [
  { factor: 'Market coverage', solo: 'One city', legacy: 'All 6 Hampton Roads cities' },
  { factor: 'Cross-market buyer pipeline', solo: 'None', legacy: 'Active buyers in every city' },
  { factor: 'Military installation familiarity', solo: 'One base area', legacy: 'All major Hampton Roads installations' },
  { factor: 'Pricing comparison accuracy', solo: 'Citywide only', legacy: 'Cross-market comparisons in real time' },
  { factor: 'Scale', solo: '20–40 deals/year typical', legacy: 'Thousands sold across Hampton Roads' },
]

const faqs = [
  {
    q: 'Who is the best realtor in Hampton Roads VA?',
    a: 'Barry Jenkins of Legacy Home Team leads 3 active teams covering all 6 Hampton Roads cities, holds a #9 national ranking on Real Trends, and has closed thousands of homes across the region over nearly two decades.',
  },
  {
    q: 'What cities does Legacy Home Team serve in Hampton Roads?',
    a: 'Legacy Home Team serves all six major Hampton Roads cities: Virginia Beach, Chesapeake, Norfolk, Suffolk, Hampton, and Newport News — with active teams and transaction history in each.',
  },
  {
    q: 'Is Hampton Roads a good place to buy real estate in 2026?',
    a: 'Yes — Hampton Roads offers consistent military demand, meaningful employment anchors (Navy, shipbuilding, defense contracting), and relative affordability compared to other major East Coast metros. Median prices are significantly below comparable markets in Northern Virginia or the D.C. suburbs.',
  },
  {
    q: 'What is the most affordable city in Hampton Roads?',
    a: 'Hampton and Newport News generally offer the lowest median prices. Chesapeake and Suffolk offer more space per dollar than Virginia Beach. Norfolk has the widest price range from entry-level to luxury.',
  },
  {
    q: 'Why choose a regional Hampton Roads team over a city-specific agent?',
    a: 'A regional team can make genuine cross-market comparisons, has active buyers in every city, covers all military installations, and brings pricing pattern data across the entire region — giving buyers and sellers a full picture that a city-specific agent cannot provide.',
  },
]

export default function BestRealtorHamptonRoads() {
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
          <span style={{ color: 'var(--text-secondary)' }}>Best Realtor</span>
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
              Best Realtor in Hampton Roads
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Hampton Roads is a six-city metropolitan region of nearly 1.8 million people — the most significant military concentration in the United States, a major East Coast port, and a housing market that spans from oceanfront{' '}
              <Link href="/virginia-beach" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>Virginia Beach</Link>{' '}
              estates to rural{' '}
              <Link href="/suffolk" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>Suffolk</Link>{' '}
              acreage to urban{' '}
              <Link href="/norfolk" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>Norfolk</Link>{' '}
              condos. The right realtor in Hampton Roads works across all of it — not just one city.
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

      {/* Section 1: Hampton Roads by City */}
      <section>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Regional Market Guide</span>
            <h2>Hampton Roads by City: Market Character and Price Ranges</h2>
            <p>
              Hampton Roads isn&apos;t one market — it&apos;s six distinct cities with different price tiers, buyer profiles, and driving forces. Here&apos;s the landscape a regional agent sees at a glance.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 160 }}>City</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Market Character</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 140 }}>Price Range</th>
                </tr>
              </thead>
              <tbody>
                {cityRows.map((row, i) => (
                  <tr key={row.city} style={{ background: i % 2 === 0 ? 'var(--white)' : 'var(--off-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)', verticalAlign: 'top' }}>
                      <Link href={`/${row.city}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 700 }}>{row.label}</Link>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{row.character}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--accent)', fontWeight: 600, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{row.range}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)' }}>
            <strong>Hampton Roads affordability:</strong> Hampton Roads as a whole is one of the most affordable major metro areas on the East Coast — significantly less expensive than the D.C. suburbs, Richmond, or Charlotte for comparable square footage, with major military and civilian employment anchors that create consistent housing demand.
          </div>
        </div>
      </section>

      {/* Section 2: Why a Regional Team Matters */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Regional Advantage</span>
            <h2>Why a Regional Team Matters in Hampton Roads</h2>
            <p>
              A city-specific agent is limited to their market. A regional team like Legacy Home Team operates across all six cities — and that breadth creates real advantages for buyers and sellers alike.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    What Only a Regional Team Can Offer
                  </th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Why It Matters
                  </th>
                </tr>
              </thead>
              <tbody>
                {regionalRows.map((row, i) => (
                  <tr key={row.factor} style={{ background: i % 2 === 0 ? 'var(--white)' : 'var(--off-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)', verticalAlign: 'top', minWidth: 240 }}>{row.factor}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)' }}>
            <strong>For military buyers:</strong> Hampton Roads military buyers frequently face a choice between multiple cities — Virginia Beach for the beach,{' '}
            <Link href="/norfolk" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Norfolk</Link>{' '}
            for urban convenience,{' '}
            <Link href="/hampton" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Hampton</Link>{' '}
            or{' '}
            <Link href="/newport-news" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Newport News</Link>{' '}
            for affordability near Langley AFB. A regional team like Legacy Home Team gives buyers a genuine comparison rather than steering them toward one area.
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
                Barry Jenkins built his career across Hampton Roads — not one city. Over nearly two decades, he has built and led 3 active teams operating across{' '}
                <Link href="/virginia-beach" style={{ color: 'var(--accent)' }}>Virginia Beach</Link>,{' '}
                <Link href="/hampton" style={{ color: 'var(--accent)' }}>Hampton</Link>,{' '}
                <Link href="/chesapeake" style={{ color: 'var(--accent)' }}>Chesapeake</Link>,{' '}
                <Link href="/norfolk" style={{ color: 'var(--accent)' }}>Norfolk</Link>,{' '}
                <Link href="/suffolk" style={{ color: 'var(--accent)' }}>Suffolk</Link>, and{' '}
                <Link href="/newport-news" style={{ color: 'var(--accent)' }}>Newport News</Link>.
                That regional footprint earned Legacy Home Team a #9 national ranking on{' '}
                <a href="https://www.realtrends.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Real Trends</a>{' '}
                — a production benchmark comparing transaction volume across every U.S. market.
              </p>
              <p style={{ marginBottom: 20 }}>
                For military families navigating Hampton Roads, the regional perspective matters most. Buyers at Naval Station Norfolk may consider Virginia Beach or Chesapeake. Buyers at Langley AFB might compare Hampton, Newport News, or York County. Legacy Home Team can run those comparisons in real time — because we have active transaction history across all of these markets.
              </p>
              <p>
                One illustration: a client came to us with an inherited home, no staging budget, an uncertain timeline, and complicated family dynamics. Nine qualified offers arrived within 24 hours of listing. The right marketing infrastructure — combined with deep regional knowledge — made that outcome possible.
              </p>
            </div>

            <div>
              <div style={{ background: 'var(--off-white)', borderRadius: 'var(--radius-xl)', padding: '32px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent2)', marginBottom: 20 }}>
                  City-Only Agent vs. Legacy Home Team
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)' }}>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Factor</th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>City-Only Agent</th>
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
            <h2 style={{ marginBottom: 8 }}>8 Questions Worth Asking Any Hampton Roads Realtor</h2>
            <p style={{ marginBottom: 40 }}>
              A genuinely regional agent should have specific, data-backed answers to all of these. City-specific knowledge doesn&apos;t answer cross-market questions.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                'Which Hampton Roads cities do you actively work in?',
                'How many Hampton Roads transactions did you close in the last 12 months across all cities?',
                'Can you give me an honest comparison between Virginia Beach, Chesapeake, and Suffolk for the same budget?',
                'Do you cover all of the major military installations in Hampton Roads?',
                'How do you handle a transaction that starts in one city and the buyer switches to another?',
                'What\'s your experience with VA loans across different Hampton Roads markets?',
                'How do appreciation patterns differ across Hampton Roads cities?',
                'What\'s the best city in Hampton Roads for my situation specifically?',
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
              <strong>Cross-market questions matter:</strong> A Hampton Roads realtor who can only answer questions about one city isn&apos;t a regional agent — they&apos;re a city agent working in a region. The right team runs Virginia Beach vs. Chesapeake comparisons as part of a normal buyer conversation, not as a special request.
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
            Ready to Work With Hampton Roads&apos; Top-10 Nationally Ranked Team?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Barry Jenkins and Legacy Home Team cover all six Hampton Roads cities with real transaction history in each. Whether you&apos;re buying, selling, or figuring out which city makes the most sense — we&apos;d like to show you what a regional team looks like in practice.
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
