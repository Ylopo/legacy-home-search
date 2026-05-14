import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Realtor in Newport News VA (2026) | Legacy Home Team',
  description:
    'Looking for the best realtor in Newport News, VA? Legacy Home Team is ranked #9 in the U.S. with thousands of homes sold. Barry Jenkins covers Denbigh, Hilton Village, and Oyster Point.',
  alternates: {
    canonical: 'https://legacyhometeamlpt.com/newport-news/best-realtor',
  },
  openGraph: {
    title: 'Best Realtor in Newport News VA (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally. Barry Jenkins and Legacy Home Team — JBLE military relocation, Denbigh vs. Southeast pricing, and Hilton Village historic expertise.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/newport-news/best-realtor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Realtor in Newport News VA (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally. Barry Jenkins covers Denbigh, Hilton Village, Oyster Point, and JBLE military relocation in Newport News.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description:
    'Legacy Home Team, led by Barry Jenkins, is ranked #9 nationally (Real Trends). Serving Newport News, VA with expertise in Denbigh, Hilton Village, Oyster Point, JBLE military relocation, and the full Newport News market.',
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
    { '@type': 'City', name: 'Newport News' },
    { '@type': 'City', name: 'Hampton' },
    { '@type': 'City', name: 'Virginia Beach' },
    { '@type': 'City', name: 'Chesapeake' },
    { '@type': 'City', name: 'Norfolk' },
    { '@type': 'City', name: 'Suffolk' },
  ],
  knowsAbout: [
    'real estate', 'home buying', 'home selling', 'military relocation',
    'Joint Base Langley-Eustis', 'Denbigh', 'Hilton Village', 'Newport News neighborhoods', 'Hampton Roads market',
  ],
  employee: {
    '@type': 'Person',
    name: 'Barry Jenkins',
    jobTitle: 'Team Leader',
    description:
      'Barry Jenkins has nearly 20 years of Hampton Roads real estate experience and is ranked among the top team leaders in the United States. Serves Newport News with deep knowledge of military relocation and neighborhood-specific pricing.',
  },
}

const schemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is the best realtor in Newport News VA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barry Jenkins of Legacy Home Team is ranked #9 nationally among all U.S. real estate teams (Real Trends), with thousands of homes sold across Hampton Roads, including specific experience in Denbigh, Hilton Village, Oyster Point, and JBLE military relocation in Newport News.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Newport News VA a good place to buy real estate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — Newport News offers meaningful employment stability through Huntington Ingalls Industries and Joint Base Langley-Eustis, affordable prices relative to Virginia Beach, and established neighborhoods like Hilton Village with genuine historic character. Denbigh especially has strong family buyer demand.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the best neighborhoods in Newport News?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Denbigh for families and schools, Hilton Village for historic character and walkability, Oyster Point for proximity to employment and strong resale demand, Kiln Creek for suburban feel and golf course access.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to sell a home in Newport News?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '30–42 days on average in Newport News. Denbigh and Oyster Point often move faster due to strong demand. Southeast Newport News may take longer due to a different buyer profile that skews toward investors.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Legacy Home Team serve Newport News?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — full Hampton Roads coverage including JBLE military relocation experience, Hilton Village historic transactions, and the full range of Newport News neighborhoods from Denbigh to Southeast Newport News.',
      },
    },
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Newport News', item: 'https://legacyhometeamlpt.com/newport-news' },
    { '@type': 'ListItem', position: 3, name: 'Best Realtor', item: 'https://legacyhometeamlpt.com/newport-news/best-realtor' },
  ],
}

const criteriaRows = [
  { criteria: 'Joint Base Langley-Eustis experience', why: 'JBLE (Air Force + Army) drives significant PCS buyer activity in Newport News; military relocation expertise is essential for this market' },
  { criteria: 'Denbigh vs. Southeast pricing knowledge', why: 'North Newport News (Denbigh) and Southeast Newport News are dramatically different markets in price, condition, and buyer profile — conflating them misprices properties' },
  { criteria: 'Shipbuilding and defense sector awareness', why: 'Huntington Ingalls and nearby defense contractors employ thousands; their relocation patterns and employment stability affect buyer confidence and market timing' },
  { criteria: 'New construction understanding', why: 'Oyster Point\'s commercial growth has generated adjacent residential new construction; builder contracts differ from resale agreements' },
  { criteria: 'Investment property experience', why: 'Newport News has meaningful investor activity driven by military rental demand and affordable entry prices, especially in Southeast NN' },
]

const neighborhoodRows = [
  { area: 'Denbigh', range: '$255K–$475K', note: 'North Newport News; newer homes; better school ratings; military PCS popular area; near Christopher Newport University' },
  { area: 'Oyster Point', range: '$285K–$510K', note: 'Business district adjacent; townhomes and condos; strong resale demand; professional buyer profile' },
  { area: 'Hilton Village', range: '$295K–$510K', note: 'First planned community in the U.S. (1918); historic character; walkable; consistent appreciation' },
  { area: 'Newmarket / Central', range: '$205K–$370K', note: 'Military-adjacent; diverse; investment-friendly; practical for VA loan buyers' },
  { area: 'Southeast NN', range: '$145K–$290K', note: 'Entry-level; higher investor activity; improving corridor; cash buyer competition common' },
  { area: 'Kiln Creek', range: '$285K–$495K', note: 'Planned community with golf course access; suburban character; family-oriented; solid value' },
]

const teamCompareRows = [
  { factor: 'Availability', solo: 'Limited to one schedule', legacy: 'Multiple agents — always someone reachable' },
  { factor: 'Annual production capacity', solo: 'Typical: 20–40 transactions/year', legacy: 'Thousands sold — scale that builds pattern recognition' },
  { factor: 'Marketing reach', solo: 'Standard MLS listing', legacy: 'Ylopo-powered digital ads, social retargeting, and MLS' },
  { factor: 'Neighborhood pricing precision', solo: 'Citywide comps only', legacy: 'Denbigh vs. SE NN — neighborhood-specific analysis' },
  { factor: 'Military PCS experience', solo: 'Varies', legacy: 'JBLE-specific process — tight timelines handled routinely' },
]

const faqs = [
  {
    q: 'Who is the best realtor in Newport News VA?',
    a: 'Barry Jenkins of Legacy Home Team is ranked #9 nationally (Real Trends), with thousands of homes sold across Hampton Roads. Legacy Home Team has specific expertise in Denbigh, Hilton Village, and JBLE military relocation in Newport News.',
  },
  {
    q: 'Is Newport News VA a good place to buy real estate?',
    a: 'Yes — Newport News offers meaningful employment stability through Huntington Ingalls Industries and Joint Base Langley-Eustis, affordable prices relative to Virginia Beach, and established neighborhoods like Hilton Village with genuine historic character. Denbigh especially has strong family buyer demand.',
  },
  {
    q: 'What are the best neighborhoods in Newport News?',
    a: 'Denbigh for families and schools, Hilton Village for historic character and walkability, Oyster Point for proximity to employment and strong resale demand, Kiln Creek for suburban feel and golf course access.',
  },
  {
    q: 'How long does it take to sell a home in Newport News?',
    a: '30–42 days on average. Denbigh and Oyster Point often move faster due to strong demand. Southeast Newport News may take longer due to a buyer profile that skews toward investors rather than traditional financing buyers.',
  },
  {
    q: 'Does Legacy Home Team serve Newport News?',
    a: 'Yes — full Hampton Roads coverage including JBLE military relocation, Hilton Village historic transactions, and the full range of Newport News neighborhoods from Denbigh to Southeast Newport News.',
  },
]

export default function BestRealtorNewportNews() {
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
          <Link href="/newport-news" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Newport News</Link>
          <span style={{ margin: '0 8px', opacity: 0.4 }}>›</span>
          <span style={{ color: 'var(--text-secondary)' }}>Best Realtor</span>
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: 'var(--accent)', padding: '64px 0 72px', marginTop: 0, borderTop: 'none' }}>
        <div className="container">
          <div style={{ maxWidth: 760 }}>
            <div className="hero-eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', marginBottom: 20 }}>
              Newport News · Hampton Roads
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              Best Realtor in Newport News
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Newport News is a working city — home to Huntington Ingalls Industries (the largest shipbuilder in the Western Hemisphere),{' '}
              <a href="https://www.jble.af.mil" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>Joint Base Langley-Eustis</a>,
              and one of the most economically diverse buyer pools in Hampton Roads. A realtor who understands Newport News understands both the military and the civilian employment sectors that shape demand here.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
                Schedule a Free Consultation
              </Link>
              <Link href="/newport-news" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                Explore Newport News →
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

      {/* Section 1: What to look for */}
      <section>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Buyer &amp; Seller Guide</span>
            <h2>What to Look for in a Newport News Realtor</h2>
            <p>
              Newport News has market dynamics that reward specific local knowledge. Here&apos;s what separates a genuinely knowledgeable agent from someone who just covers the area.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    What to Look For
                  </th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Why It Matters in Newport News
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
            <strong>Pricing accuracy matters here:</strong> North Newport News (Denbigh, Kiln Creek, Oyster Point) and Southeast Newport News are effectively two different markets. An agent who prices a Denbigh home using Southeast comps — or vice versa — costs their clients tens of thousands of dollars. Always ask for neighborhood-specific closed sales, not citywide averages.
          </div>
        </div>
      </section>

      {/* Section 2: Neighborhoods */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Market Intelligence</span>
            <h2>Newport News Neighborhoods: What Every Buyer and Seller Should Know</h2>
            <p>
              From the historic Hilton Village to the growth corridors of Denbigh — Newport News neighborhoods each carry different pricing dynamics, buyer profiles, and investment considerations.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 200 }}>Neighborhood</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 140 }}>Price Range</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Key Consideration</th>
                </tr>
              </thead>
              <tbody>
                {neighborhoodRows.map((row, i) => (
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
            <strong>Hilton Village:</strong> Hilton Village is one of the most underappreciated historic neighborhoods in Hampton Roads — the first planned community ever built in the United States, with genuine architectural character and a walkable village core. Buyers who find it tend to stay.
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
                Legacy Home Team has served Newport News buyers and sellers for nearly two decades — from the entry-level investment opportunities of Southeast Newport News to the historic character of Hilton Village to the newer construction of Denbigh and Kiln Creek. That market breadth is what a city as economically diverse as Newport News requires.
              </p>
              <p style={{ marginBottom: 20 }}>
                For military buyers, Newport News offers proximity to{' '}
                <a href="https://www.jble.af.mil" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Joint Base Langley-Eustis</a>{' '}
                without the price premium of{' '}
                <Link href="/virginia-beach" style={{ color: 'var(--accent)' }}>Virginia Beach</Link>.
                Legacy Home Team handles PCS transactions in Newport News routinely — including VA loan coordination, tight closing timelines, and knowledge of which Denbigh and Newmarket neighborhoods are most practical for active-duty families.
              </p>
              <p>
                One illustration of what that infrastructure produces: a client came to us with an inherited home, no staging budget, an uncertain timeline, and complicated family dynamics. Nine qualified offers arrived within 24 hours of listing. The right marketing infrastructure — combined with deep local knowledge — made that outcome possible.
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

      {/* Section 4: Questions */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <span className="section-label">Due Diligence</span>
            <h2 style={{ marginBottom: 8 }}>8 Questions Worth Asking Before You Choose a Newport News Realtor</h2>
            <p style={{ marginBottom: 40 }}>
              A knowledgeable Newport News agent should have specific, data-backed answers to all of these. Vague responses aren&apos;t answers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                'How many Newport News transactions did you close in the last 12 months?',
                'Can you explain the price difference between Denbigh and Southeast Newport News?',
                'Do you have experience with VA loan purchases in Newport News?',
                'What do you know about the Huntington Ingalls employment effect on Newport News real estate?',
                'Have you closed transactions in Hilton Village, and what should I know about it?',
                'What\'s the investor competition like in Southeast Newport News?',
                'How does Newport News compare to Hampton for buyers on the same budget?',
                'Can you show me recent closed sales in my specific target neighborhood?',
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
              <strong>Neighborhood comps matter:</strong> In Newport News, asking for &quot;Newport News market data&quot; is meaningless. Ask for closed sales in Denbigh, Hilton Village, or whatever specific neighborhood you&apos;re targeting — and compare them to the listing you&apos;re considering. Citywide averages mask the real pricing story.
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
            Legacy Home Team · Newport News
          </span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', margin: '16px 0 20px' }}>
            Ready to Work With Newport News&apos;s Best Realtor?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Barry Jenkins and Legacy Home Team have closed thousands of homes across Hampton Roads — including specific experience in Denbigh, Hilton Village, and JBLE military relocation. Whether you&apos;re buying, selling, or relocating to Newport News, we&apos;d like to show you what that looks like in practice.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
              Schedule a Free Consultation
            </Link>
            <Link href="/newport-news" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
              Explore Newport News Homes →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
