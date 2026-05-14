import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Realtor in Hampton VA (2026) | Legacy Home Team',
  description:
    'Looking for the best realtor in Hampton, VA? Legacy Home Team is ranked #9 in the U.S. with thousands of homes sold. Barry Jenkins covers Hampton\'s waterfront, historic, and military neighborhoods.',
  alternates: {
    canonical: 'https://legacyhometeamlpt.com/hampton/best-realtor',
  },
  openGraph: {
    title: 'Best Realtor in Hampton VA (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally. Barry Jenkins and Legacy Home Team — Fort Monroe leasehold expertise, Langley AFB military relocation, and Hampton waterfront transactions.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/hampton/best-realtor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Realtor in Hampton VA (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally. Barry Jenkins covers Hampton waterfront, Fort Monroe, and Langley AFB relocation.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description:
    'Legacy Home Team, led by Barry Jenkins, is ranked #9 in the United States among all real estate teams (Real Trends). Serving Hampton, VA with expertise in Fort Monroe leasehold properties, Langley AFB military relocation, and Hampton waterfront transactions.',
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
    { '@type': 'City', name: 'Hampton' },
    { '@type': 'City', name: 'Virginia Beach' },
    { '@type': 'City', name: 'Chesapeake' },
    { '@type': 'City', name: 'Norfolk' },
    { '@type': 'City', name: 'Newport News' },
    { '@type': 'City', name: 'Suffolk' },
  ],
  knowsAbout: [
    'real estate', 'home buying', 'home selling', 'military relocation',
    'Fort Monroe leasehold', 'waterfront properties', 'Hampton neighborhoods', 'Hampton Roads market',
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
      name: 'Who is the best realtor in Hampton VA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barry Jenkins of Legacy Home Team is ranked #9 nationally among all U.S. real estate teams (Real Trends), with thousands of homes sold across Hampton Roads. Legacy Home Team has specific experience in Fort Monroe leasehold transactions, Langley AFB military relocation, and Hampton waterfront properties.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Hampton VA a good place to buy real estate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — Hampton offers some of the most affordable prices in Hampton Roads with genuine waterfront access, historic character, and strong military rental demand. Neighborhoods like Buckroe Beach and Hampton Harbor offer water access at prices well below Virginia Beach comparables.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes Fort Monroe special for real estate buyers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fort Monroe is a former military fort converted to civilian housing on a leasehold structure — the U.S. Army retains land ownership while buyers purchase the historic structures. Properties have stunning Chesapeake Bay views and unique architecture not found anywhere else in Hampton Roads. The Army Ground Lease governs all transactions and requires specific knowledge to navigate.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to sell a home in Hampton?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Approximately 35–45 days on average in Hampton. Waterfront properties and Fort Monroe may vary. Correctly priced homes in Buckroe Beach and Wythe often sell faster due to strong military and coastal buyer demand.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Legacy Home Team serve Hampton VA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — Legacy Home Team provides full Hampton Roads coverage including Fort Monroe leasehold expertise, Langley AFB military relocation experience, and Hampton waterfront transactions across Buckroe Beach, Hampton Harbor, Fox Hill, and the Hampton River corridor.',
      },
    },
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Hampton', item: 'https://legacyhometeamlpt.com/hampton' },
    { '@type': 'ListItem', position: 3, name: 'Best Realtor', item: 'https://legacyhometeamlpt.com/hampton/best-realtor' },
  ],
}

const criteriaRows = [
  { criteria: 'Langley AFB and Fort Eustis familiarity', why: 'Hampton sits adjacent to Langley Air Force Base — a significant source of PCS buyers and sellers; military relocation experience is essential' },
  { criteria: 'Fort Monroe knowledge', why: 'Fort Monroe is a unique leasehold property situation — the U.S. Army owns the land and buyers purchase only the structures; most agents outside Hampton have never encountered this' },
  { criteria: 'Waterfront and harbor expertise', why: 'Hampton Roads harbor, Hampton River, and Chesapeake Bay access give Hampton significant waterfront inventory — each priced by different factors' },
  { criteria: 'Historic district sensitivity', why: 'Phoebus and parts of Downtown Hampton have design review requirements and renovation complexities that affect offers and appraisals' },
  { criteria: 'Investment property awareness', why: 'Hampton has among the highest investor activity in Hampton Roads due to affordable entry prices and strong military rental demand' },
]

const neighborhoodRows = [
  { area: 'Phoebus', range: '$185K–$350K', note: 'Historic arts district; emerging; renovation opportunity; walkable to shops and restaurants' },
  { area: 'Buckroe Beach', range: '$225K–$440K', note: 'Chesapeake Bay beach access; affordable vs. Virginia Beach beachfront; strong rental demand' },
  { area: 'Hampton Harbor', range: '$355K–$650K', note: 'Newer waterfront development; marina slips; higher-end for Hampton; harbor views' },
  { area: 'Fox Hill', range: '$235K–$415K', note: 'Working waterfront character; Hampton River access; historic fishing community' },
  { area: 'Fort Monroe', range: '$285K–$680K', note: 'Leasehold (Army owns land); stunning Chesapeake Bay views; unique historic military architecture' },
  { area: 'Wythe / Riverdale', range: '$245K–$395K', note: 'Near Langley AFB; established neighborhoods; stable; practical for military families' },
  { area: 'Downtown Hampton', range: '$195K–$335K', note: 'Revitalizing corridor; investment opportunity; new commercial activity nearby' },
]

const teamCompareRows = [
  { factor: 'Availability', solo: 'Limited to one schedule', legacy: 'Multiple agents — always someone reachable' },
  { factor: 'Annual production capacity', solo: 'Typical: 20–40 transactions/year', legacy: 'Thousands sold — scale that builds pattern recognition' },
  { factor: 'Marketing reach', solo: 'Standard MLS listing', legacy: 'Ylopo-powered digital ads, social retargeting, and MLS' },
  { factor: 'Fort Monroe experience', solo: 'Rarely encountered', legacy: 'Closed leasehold transactions; familiar with Army Ground Lease' },
  { factor: 'Military PCS experience', solo: 'Varies', legacy: 'Established process for Langley AFB — tight timelines handled routinely' },
]

const faqs = [
  {
    q: 'Who is the best realtor in Hampton VA?',
    a: 'Barry Jenkins of Legacy Home Team is ranked #9 nationally among all U.S. real estate teams (Real Trends), with thousands of homes sold across Hampton Roads. Legacy Home Team has specific expertise in Fort Monroe leasehold transactions and Langley AFB military relocation.',
  },
  {
    q: 'Is Hampton VA a good place to buy real estate?',
    a: 'Yes — Hampton offers some of the most affordable prices in Hampton Roads with genuine waterfront access, historic character, and strong military rental demand. Neighborhoods like Buckroe Beach and Hampton Harbor offer water access at prices well below Virginia Beach comparables.',
  },
  {
    q: 'What makes Fort Monroe special for real estate buyers?',
    a: 'Fort Monroe is a former U.S. Army fort converted to civilian housing. The Army retains ownership of the land; buyers purchase only the structures through a Ground Lease. Properties have exceptional Chesapeake Bay views and unique historic architecture. The leasehold structure requires specific knowledge to navigate correctly.',
  },
  {
    q: 'How long does it take to sell a home in Hampton?',
    a: '35–45 days on average. Waterfront properties and Fort Monroe may vary. Correctly priced homes in Buckroe Beach and Wythe often sell faster due to strong military and coastal buyer demand.',
  },
  {
    q: 'Does Legacy Home Team serve Hampton VA?',
    a: 'Yes — full Hampton Roads coverage including Fort Monroe leasehold expertise, Langley AFB military relocation experience, and Hampton waterfront transactions across Buckroe Beach, Hampton Harbor, and Fox Hill.',
  },
]

export default function BestRealtorHampton() {
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
          <Link href="/hampton" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Hampton</Link>
          <span style={{ margin: '0 8px', opacity: 0.4 }}>›</span>
          <span style={{ color: 'var(--text-secondary)' }}>Best Realtor</span>
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: 'var(--accent)', padding: '64px 0 72px', marginTop: 0, borderTop: 'none' }}>
        <div className="container">
          <div style={{ maxWidth: 760 }}>
            <div className="hero-eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', marginBottom: 20 }}>
              Hampton · Hampton Roads
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              Best Realtor in Hampton
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Hampton is one of the oldest English-speaking settlements in continuous existence in the United States — a city with genuine historic character, direct waterfront access along the Hampton Roads harbor, proximity to{' '}
              <a href="https://www.langley.af.mil" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'underline' }}>Langley Air Force Base</a>{' '}
              and NASA Langley Research Center, and some of the most affordable entry-level prices in all of Hampton Roads. It&apos;s a market that rewards knowing its distinct neighborhoods.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
                Schedule a Free Consultation
              </Link>
              <Link href="/hampton" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                Explore Hampton →
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
            <h2>What to Look for in a Hampton Realtor</h2>
            <p>
              Hampton&apos;s market has distinct characteristics that separate a genuinely knowledgeable local agent from someone who simply holds a Hampton Roads license. Here&apos;s what actually matters.
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
                    Why It Matters in Hampton
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
            <strong>Fort Monroe buyers:</strong> Fort Monroe is a property type unlike anything else in Hampton Roads — and most agents outside Hampton have never handled one. If you&apos;re buying or selling at Fort Monroe, insist on an agent who has closed transactions there. The leasehold structure, Army Ground Lease, and property condition rules require specific knowledge.
          </div>
        </div>
      </section>

      {/* Section 2: Neighborhoods */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Market Intelligence</span>
            <h2>Hampton Neighborhoods: What Every Buyer and Seller Should Know</h2>
            <p>
              Hampton&apos;s neighborhoods range from historic waterfront villages to military-adjacent suburbs to one of the most architecturally unique property types in the region. Each carries different pricing dynamics.
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
            <strong>Buckroe Beach:</strong> Buckroe Beach is the Hampton Roads waterfront story that most buyers outside Hampton don&apos;t know yet — Chesapeake Bay beach access at prices significantly below comparable{' '}
            <Link href="/virginia-beach" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Virginia Beach</Link>{' '}
            oceanfront. For buyers comparing coastal options, it&apos;s a direct comparison worth making.
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
                Barry Jenkins has served Hampton&apos;s buyers and sellers for nearly two decades — from the affordable renovation opportunities of Phoebus to the unique leasehold properties at{' '}
                <a href="https://fortmonroe.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Fort Monroe</a>{' '}
                to waterfront homes along Hampton Harbor. That range of experience is what a market as varied as Hampton requires.
              </p>
              <p style={{ marginBottom: 20 }}>
                Hampton&apos;s military market deserves specific attention.{' '}
                <a href="https://www.langley.af.mil" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Langley Air Force Base</a>{' '}
                brings a steady flow of PCS buyers and sellers each year — buyers who need an agent who understands VA loan timelines, the neighborhoods closest to base, and how to move quickly when orders arrive. Legacy Home Team has handled this transaction type hundreds of times across Hampton Roads.
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
            <h2 style={{ marginBottom: 8 }}>8 Questions Worth Asking Before You Choose a Hampton Realtor</h2>
            <p style={{ marginBottom: 40 }}>
              A genuinely knowledgeable Hampton agent should have specific, data-backed answers to all of these. Vague responses aren&apos;t answers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                'How many Hampton transactions did you close in the last 12 months?',
                'Have you personally closed a Fort Monroe leasehold transaction?',
                'Do you have experience with VA loan purchases in Hampton?',
                'What\'s the rental demand like in Buckroe Beach, and what does that mean for buyers?',
                'How does Hampton pricing compare to similar properties in Newport News and Norfolk?',
                'Which Hampton neighborhoods have the strongest appreciation trends?',
                'What should I know about the revitalization happening in Phoebus and Downtown Hampton?',
                'Do you understand the design restrictions in Hampton\'s historic districts?',
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
              <strong>Fort Monroe specifically:</strong> Most Hampton Roads agents have never seen a leasehold transaction. If you&apos;re considering Fort Monroe, ask any agent directly: Have you closed a property there? If the answer is no, proceed with caution — the Army Ground Lease has specific clauses that affect your rights as a buyer.
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
            Legacy Home Team · Hampton
          </span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', margin: '16px 0 20px' }}>
            Ready to Work With Hampton&apos;s Best Realtor?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Barry Jenkins and Legacy Home Team have closed thousands of homes across Hampton Roads — including Fort Monroe leasehold transactions that most agents have never handled. Whether you&apos;re buying, selling, or relocating to Hampton, we&apos;d like to show you what that experience looks like in practice.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
              Schedule a Free Consultation
            </Link>
            <Link href="/hampton" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
              Explore Hampton Homes →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
