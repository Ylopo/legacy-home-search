import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Listing Agent in Hampton (2026) | Legacy Home Team',
  description: 'Hampton\'s best listing agent: Barry Jenkins, ranked #9 nationally (Real Trends). Avg DOM 22-42 days. Buckroe, Fort Monroe, Phoebus expertise. Call today.',
  alternates: { canonical: 'https://legacyhometeamlpt.com/hampton/best-listing-agent' },
  openGraph: {
    title: 'Best Listing Agent in Hampton (2026) | Legacy Home Team',
    description: 'List with Barry Jenkins, #9 nationally ranked agent. Hampton specialists for Buckroe, Fort Monroe, Phoebus, and Langley AFB corridor.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/hampton/best-listing-agent',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Listing Agent in Hampton (2026) | Legacy Home Team',
    description: 'List with Barry Jenkins, #9 nationally ranked agent. Hampton specialists for Buckroe, Fort Monroe, Phoebus, and Langley AFB corridor.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description: 'Legacy Home Team, led by Barry Jenkins (#9 nationally per Real Trends), is Hampton\'s top listing-side brokerage with deep expertise across Buckroe Beach, Fort Monroe, Phoebus, and the Langley AFB corridor.',
  url: 'https://legacyhometeamlpt.com',
  telephone: '(757) 816-4037',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '5224 Indian River Rd',
    addressLocality: 'Hampton',
    addressRegion: 'VA',
    postalCode: '23464',
    addressCountry: 'US',
  },
  sameAs: ['https://www.realtrends.com/rankings/real-trends-500/'],
}

const schemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is the best listing agent in Hampton?',
      acceptedAnswer: { '@type': 'Answer', text: 'Barry Jenkins and Legacy Home Team are the top-ranked listing team serving Hampton, ranked #9 nationally among all U.S. real estate teams by Real Trends. We\'ve closed thousands of homes across Hampton Roads with deep expertise in every Hampton sub-market.' },
    },
    {
      '@type': 'Question',
      name: 'What\'s the average days on market in Hampton right now?',
      acceptedAnswer: { '@type': 'Answer', text: 'Hampton\'s average DOM in 2025 is running between 22 and 42 days depending on neighborhood and price point. Properly priced listings in Buckroe Beach and the Langley AFB corridor often sell faster; Fort Monroe ground-lease homes can take longer due to buyer education.' },
    },
    {
      '@type': 'Question',
      name: 'How do you price a Buckroe Beach vacation rental?',
      acceptedAnswer: { '@type': 'Answer', text: 'We use a hybrid model: traditional sold comps blended with projected short-term rental income analysis. Most Buckroe buyers are investors who underwrite on cash flow, so we present both sets of numbers in the listing package.' },
    },
    {
      '@type': 'Question',
      name: 'Do I need special disclosures for Fort Monroe?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes — Fort Monroe properties are held under an Army Ground Lease, which must be disclosed and explained clearly to buyers and their lenders upfront. We handle this paperwork on every Fort Monroe listing and coordinate with title to avoid closing delays.' },
    },
    {
      '@type': 'Question',
      name: 'How do you reach military buyers relocating to Langley AFB?',
      acceptedAnswer: { '@type': 'Answer', text: 'Through Ylopo\'s AI-driven targeting we market directly to PCS-bound buyers searching from outside Virginia, plus we coordinate with relocation specialists and VA-loan-fluent lenders. The Langley AFB corridor is one of Hampton\'s most reliable demand sources year-round.' },
    },
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Hampton', item: 'https://legacyhometeamlpt.com/hampton' },
    { '@type': 'ListItem', position: 3, name: 'Best Listing Agent in Hampton', item: 'https://legacyhometeamlpt.com/hampton/best-listing-agent' },
  ],
}

const criteriaRows = [
  { criteria: 'Sub-market pricing expertise', why: 'Hampton median sale prices range $265K-$340K depending on neighborhood — a generalist will underprice or overshoot.' },
  { criteria: 'Vacation rental income analysis', why: 'Buckroe Beach buyers are often investors who price on projected nightly revenue, not comps alone.' },
  { criteria: 'Fort Monroe disclosure fluency', why: 'The Army Ground Lease structure scares off unprepared agents and confuses buyers if not handled cleanly upfront.' },
  { criteria: 'Military buyer marketing reach', why: 'The Langley AFB PCS cycle drives reliable demand — your agent needs to be targeting those buyers directly.' },
  { criteria: 'Days-on-market track record', why: 'Hampton averages 22-42 DOM in 2025; a strong listing agent should be hitting the low end of that window.' },
]

const submarketsRows = [
  { area: 'Buckroe Beach', range: '$285K-$425K', note: 'Vacation rental investor pool; we price using income analysis alongside comps.' },
  { area: 'Fort Monroe', range: '$320K-$550K', note: 'Historic inventory under Army Ground Lease — disclosure must be airtight.' },
  { area: 'Phoebus', range: '$210K-$310K', note: 'Walkable rowhouses and bungalows; first-time buyers and renovators dominate.' },
  { area: 'Langley AFB Corridor', range: '$265K-$340K', note: 'Steady PCS demand from incoming military families — VA loan readiness matters.' },
  { area: 'Wythe / Olde Hampton', range: '$240K-$380K', note: 'Mix of waterfront and historic; price varies block to block.' },
  { area: 'Riverdale / Aberdeen Gardens', range: '$215K-$295K', note: 'Established neighborhoods with strong owner-occupant demand.' },
]

const teamCompareRows = [
  { factor: 'Availability', solo: 'Limited to one schedule', legacy: 'Multiple agents — always someone reachable' },
  { factor: 'Annual production', solo: 'Typical: 20–40 transactions/year', legacy: 'Thousands of homes sold — scale that builds pattern recognition' },
  { factor: 'Marketing reach', solo: 'Standard MLS listing', legacy: 'Ylopo-powered digital ads, social retargeting, and MLS' },
  { factor: 'Negotiation approach', solo: 'One perspective', legacy: 'Team-reviewed, market-tested strategy' },
  { factor: 'Military PCS experience', solo: 'Varies', legacy: 'Established process — tight timelines handled routinely' },
]

const faqs = [
  { q: 'Who is the best listing agent in Hampton?', a: 'Barry Jenkins and Legacy Home Team are the top-ranked listing team serving Hampton, ranked #9 nationally among all U.S. real estate teams by Real Trends. We\'ve closed thousands of homes across Hampton Roads with deep expertise in every Hampton sub-market.' },
  { q: 'What\'s the average days on market in Hampton right now?', a: 'Hampton\'s average DOM in 2025 is running between 22 and 42 days depending on neighborhood and price point. Properly priced listings in Buckroe Beach and the Langley AFB corridor often sell faster; Fort Monroe ground-lease homes can take longer due to buyer education.' },
  { q: 'How do you price a Buckroe Beach vacation rental?', a: 'We use a hybrid model: traditional sold comps blended with projected short-term rental income analysis. Most Buckroe buyers are investors who underwrite on cash flow, so we present both sets of numbers in the listing package.' },
  { q: 'Do I need special disclosures for Fort Monroe?', a: 'Yes — Fort Monroe properties are held under an Army Ground Lease, which must be disclosed and explained clearly to buyers and their lenders upfront. We handle this paperwork on every Fort Monroe listing and coordinate with title to avoid closing delays.' },
  { q: 'How do you reach military buyers relocating to Langley AFB?', a: 'Through Ylopo\'s AI-driven targeting we market directly to PCS-bound buyers searching from outside Virginia, plus we coordinate with relocation specialists and VA-loan-fluent lenders. The Langley AFB corridor is one of Hampton\'s most reliable demand sources year-round.' },
]

export default function BestListingAgentHampton() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaRealEstateAgent) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />

      {/* Breadcrumb */}
      <div style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--border-light)', paddingTop: 'var(--nav-h)' }}>
        <div className="container" style={{ padding: '14px 24px', fontSize: 13, color: 'var(--text-muted)' }}>
          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px', opacity: 0.4 }}>›</span>
          <Link href="/hampton" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Hampton</Link>
          <span style={{ margin: '0 8px', opacity: 0.4 }}>›</span>
          <span style={{ color: 'var(--text-secondary)' }}>Best Listing Agent</span>
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: 'var(--accent)', padding: '64px 0 0', marginTop: 0, borderTop: 'none', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '48px', alignItems: 'flex-end' }}>
            <div style={{ paddingBottom: 72 }}>
            <div className="hero-eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', marginBottom: 20 }}>
              Hampton · Hampton Roads
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              Best Listing Agent in Hampton
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Hampton isn't one market — it's five. Selling a Buckroe Beach short-term rental requires income-based pricing, a Fort Monroe home demands Army Ground Lease disclosure, and a Phoebus rowhouse competes on entirely different fundamentals. Our team has listed across every one of these sub-markets and knows which buyer pool to position your home toward.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
                Schedule a Free Consultation
              </Link>
              <Link href="/hampton" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                Explore Hampton Homes →
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

      {/* Section 1 */}
      <section>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Seller Strategy</span>
            <h2>What to Look For in a Hampton Listing Agent</h2>
            <p>Not every agent who lists in Hampton understands the disclosure quirks, military buyer cycles, or vacation rental math that drive value here. Use this checklist before you sign anything.</p>
          </div>
          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>What to Look For</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Why It Matters in Hampton</th>
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
            <strong>Pro tip:</strong> Ask any agent you interview to show you their last three Hampton listings with actual DOM and list-to-sale ratios. If they hesitate, move on.
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <h2>Why Hampton Sellers Need a Specialist</h2>
            <p>Hampton's neighborhoods price, market, and close very differently from each other — and from neighboring Newport News, Norfolk, or Virginia Beach. Here's how we break down the sub-markets when we list.</p>
          </div>
          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Area / Zone</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Price Range</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Key Consideration</th>
                </tr>
              </thead>
              <tbody>
                {submarketsRows.map((row, i) => (
                  <tr key={row.area} style={{ background: i % 2 === 0 ? 'var(--white)' : 'var(--off-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)', verticalAlign: 'top', minWidth: 160 }}>{row.area}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{row.range}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)' }}>
            <strong>Pro tip:</strong> If you're near the Langley AFB corridor, list 60-90 days ahead of the PCS season peak (April-July). We time launches to that cycle — see langley.af.mil for base activity context.
          </div>
        </div>
      </section>

      {/* Section 3: Barry + Team */}
      <section>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            <div>
              <span className="section-label">About Legacy Home Team</span>
              <h2 style={{ marginBottom: 20 }}>Barry Jenkins &amp; Legacy Home Team</h2>
              <p style={{ marginBottom: 20 }}>Barry Jenkins has spent nearly 20 years selling homes across Hampton Roads and is ranked #9 nationally among all U.S. real estate teams by Real Trends. Our team has closed thousands of transactions across Hampton, Newport News, Norfolk, Virginia Beach, Chesapeake, and Suffolk — and Hampton specifically is one of our most active listing markets.</p>
              <p style={{ marginBottom: 20 }}>Barry also serves as Head Realtor in Residence at Ylopo and CMO at Better Homes and Gardens NAGR, which means our Hampton listings get exposure through AI-driven buyer targeting that local solo agents simply can't replicate. We put your home in front of qualified investors, PCS-bound military families, and out-of-state buyers within hours of going live.</p>
              <p>We run three teams across Hampton Roads and have listed in every Hampton sub-market — from Buckroe Beach rentals to Fort Monroe ground-lease properties. That depth is why our Hampton sellers consistently close inside the 22-42 day market average, often closer to the front end.</p>
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

      {/* Section 4: Questions to ask */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <span className="section-label">Due Diligence</span>
            <h2 style={{ marginBottom: 8 }}>Questions to Ask Before Choosing a Hampton Listing Agent</h2>
            <p style={{ marginBottom: 40 }}>A competent agent should have specific, data-backed answers to all of these. Vague responses are not answers.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
        'How many homes have you personally listed in Hampton in the last 12 months?',
        'What\'s your average days-on-market versus the Hampton average of 22-42 days?',
        'How do you price a Buckroe Beach property if the buyer pool is investor-heavy?',
        'Are you familiar with the Fort Monroe Army Ground Lease disclosure process?',
        'How do you market to incoming Langley AFB PCS buyers specifically?',
        'What\'s your list-to-sale price ratio over the last 25 closings?',
        'Do you have a dedicated marketing budget per listing, and what does it cover?',
        'Can you provide references from three Hampton sellers from the past year?',
              ].map((q, i) => (
                <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>{q}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)', marginTop: 24 }}>
              <strong>Pro tip:</strong> The right listing agent should answer all eight of these without flinching. Vague answers about marketing reach or DOM are red flags — ask for specific numbers.
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {faqs.map(({ q, a }) => (
                <div key={q} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--off-white)', padding: '16px 24px', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>{q}</div>
                  <div style={{ padding: '16px 24px', fontSize: 14, lineHeight: 1.75, color: 'var(--text-secondary)' }}>{a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--accent)', textAlign: 'center', padding: '80px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <span className="section-label" style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)' }}>
            Legacy Home Team · Hampton
          </span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', margin: '16px 0 20px' }}>
            List Your Hampton Home With the #9 Team in the Country
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Whether you're selling a Buckroe Beach cottage, a Fort Monroe historic home, or a Phoebus rowhouse, our team knows exactly how to price, position, and close it. Reach out today for a no-pressure listing consultation and a sub-market-specific pricing analysis.
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
