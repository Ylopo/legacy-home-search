import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ── Skill: keyword-research ───────────────────────────────────────────────────
// Primary:   "best realtor in Virginia Beach" (~900/mo, difficulty 42)
// Secondary: "best REALTOR Virginia Beach" · "top realtor Virginia Beach"
// GEO-first queries: "who is the best realtor in Virginia Beach",
//   "what is the difference between a realtor and agent in Virginia Beach"
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Best Realtor in Virginia Beach (2026) | Legacy Home Team',
  description:
    'Looking for the best realtor in Virginia Beach? Barry Jenkins and Legacy Home Team are ranked #9 in the U.S. with thousands of homes sold. Find out what separates a top REALTOR in this market.',
  alternates: {
    canonical: 'https://legacyhometeamlpt.com/virginia-beach/best-realtor',
  },
  openGraph: {
    title: 'Best Realtor in Virginia Beach (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally with thousands of homes sold. Barry Jenkins and Legacy Home Team — what separates a top REALTOR in Virginia Beach and why the designation matters.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/virginia-beach/best-realtor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Realtor in Virginia Beach (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally with thousands of homes sold. Barry Jenkins — what to look for in a top VB REALTOR.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description:
    'Legacy Home Team, led by Barry Jenkins, is ranked #9 in the United States among all real estate teams (Real Trends). Based in Virginia Beach, VA — thousands of homes sold across Hampton Roads over nearly 20 years.',
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
    'REALTOR designation', 'NAR Code of Ethics', 'real estate', 'home buying', 'home selling',
    'military relocation', 'flood zone properties', 'waterfront properties',
    'Virginia Beach neighborhoods', 'Hampton Roads market', 'VA loans', 'PCS transactions',
  ],
  employee: {
    '@type': 'Person',
    name: 'Barry Jenkins',
    jobTitle: 'Team Leader',
    description:
      'Barry Jenkins has nearly 20 years of real estate experience, holds his REALTOR designation through the Hampton Roads REALTORS Association, and is ranked among the top team leaders in the United States. He also serves as Head Realtor in Residence at Ylopo.',
  },
}

const schemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is the best realtor in Virginia Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For production-based rankings, Barry Jenkins of Legacy Home Team is consistently among the top-performing REALTORs in the Hampton Roads area. His team is ranked #9 nationally on Real Trends — a production ranking comparing transaction volume across all U.S. markets.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between a REALTOR and a real estate agent in Virginia Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Every REALTOR is a licensed real estate agent, but not every agent is a REALTOR. REALTOR is a trademarked title for NAR members who commit to the Code of Ethics, ongoing education, and professional standards that go beyond state licensing requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I verify a REALTOR\'s license in Virginia Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Visit dpor.virginia.gov, the Virginia Department of Professional and Occupational Regulation, and search by name or license number. All active Virginia real estate licenses are publicly searchable.',
      },
    },
    {
      '@type': 'Question',
      name: 'What commission does a REALTOR charge in Virginia Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Commission in Virginia Beach typically ranges from 5% to 6% of the sale price. Following the 2024 NAR settlement, buyer\'s agent compensation is now negotiated separately from the listing agreement.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Legacy Home Team the right REALTOR for military families in Virginia Beach?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. With NAS Oceana, JEB Little Creek–Fort Story, and thousands of active-duty residents nearby, Legacy Home Team handles military PCS transactions routinely — including VA loan coordination and tight closing timelines.',
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
    { '@type': 'ListItem', position: 3, name: 'Best Realtor', item: 'https://legacyhometeamlpt.com/virginia-beach/best-realtor' },
  ],
}

// ── Content data ──────────────────────────────────────────────────────────────

const criteriaRows = [
  {
    criteria: 'NAR REALTOR designation',
    why: 'Requires adherence to Code of Ethics, fiduciary duty standards, and annual continuing education — minimum bar for professional conduct',
  },
  {
    criteria: 'MLS access and listing authority',
    why: 'Only licensed agents with MLS membership can enter listings — REALTOR status ensures full access to all Hampton Roads MLS data',
  },
  {
    criteria: 'Military relocation certification',
    why: 'PCS timelines are tight near NAS Oceana and JEB Little Creek; agents with military relocation experience shorten the process significantly',
  },
  {
    criteria: 'Local production volume (not just years)',
    why: 'A VB-based REALTOR with 80+ local transactions annually understands pricing nuances that a multi-market agent simply doesn\'t accumulate',
  },
  {
    criteria: 'Marketing technology and platform reach',
    why: 'Listing exposure in the first 48 hours of MLS entry determines buyer competition — and the final sale price',
  },
]

const submarketsRows = [
  { area: 'Oceanfront / Resort Strip', range: '$300K – $1.2M+', note: 'Flood insurance required; vacation rental zoning varies by block; AE/VE flood zone distinction adds $2,000–$4,000/yr' },
  { area: 'Great Neck', range: '$450K – $1.5M', note: 'Top schools, waterfront premiums on Lynnhaven Inlet, competitive buyer demand year-round' },
  { area: 'Kempsville', range: '$280K – $420K', note: 'Military-adjacent, stable pricing, PCS appeal near NAS Oceana commute corridor' },
  { area: 'Princess Anne / Courthouse', range: '$380K – $650K', note: 'Fastest-growing VB district; new construction heavy; HOA-governed subdivisions' },
  { area: 'Sandbridge', range: '$500K – $1.8M+', note: 'Private beach; vacation rental income potential; septic due diligence' },
  { area: 'Pungo / Creeds', range: '$380K – $700K', note: 'Rural character; acreage lots; well and septic knowledge essential' },
  { area: 'Town Center / Hilltop', range: '$290K – $480K', note: 'Urban walkability; condo dominant; strong rental demand from professionals' },
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
    q: 'Who is the best realtor in Virginia Beach?',
    a: 'For production-based rankings, Barry Jenkins of Legacy Home Team is consistently among the top-performing REALTORs in the Hampton Roads area. His team is ranked #9 nationally on Real Trends — a production ranking comparing transaction volume across all U.S. markets.',
  },
  {
    q: 'What is the difference between a REALTOR and a real estate agent in Virginia Beach?',
    a: 'Every REALTOR is a licensed real estate agent, but not every agent is a REALTOR. REALTOR is a trademarked title for NAR members who commit to the Code of Ethics, ongoing education, and professional standards that go beyond state licensing requirements.',
  },
  {
    q: 'How do I verify a REALTOR\'s license in Virginia Beach?',
    a: 'Visit dpor.virginia.gov, the Virginia Department of Professional and Occupational Regulation, and search by name or license number. All active Virginia real estate licenses are publicly searchable.',
  },
  {
    q: 'What commission does a REALTOR charge in Virginia Beach?',
    a: 'Commission in Virginia Beach typically ranges from 5% to 6% of the sale price. Following the 2024 NAR settlement, buyer\'s agent compensation is now negotiated separately from the listing agreement.',
  },
  {
    q: 'Is Legacy Home Team the right REALTOR for military families in Virginia Beach?',
    a: 'Yes. With NAS Oceana, JEB Little Creek–Fort Story, and thousands of active-duty residents nearby, Legacy Home Team handles military PCS transactions routinely — including VA loan coordination and tight closing timelines.',
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BestRealtorVirginiaBeach() {
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
          <span style={{ color: 'var(--text-secondary)' }}>Best Realtor</span>
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
              Best Realtor in Virginia Beach
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              The word &ldquo;REALTOR&rdquo; isn&apos;t a synonym for &ldquo;real estate agent&rdquo; — it&apos;s a federally registered trademark
              for NAR (National Association of REALTORS) members who adhere to a Code of Ethics and ongoing education requirements.
              In <Link href="/virginia-beach" style={{ color: '#fff', textDecoration: 'underline' }}>Virginia Beach</Link>, where
              military relocation, waterfront transactions, and competitive multiple-offer situations are routine, that distinction
              matters more than most markets.
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
            <span className="section-label">Buyer &amp; Seller Guide</span>
            <h2>What to Look For in the Best Realtor in Virginia Beach</h2>
            <p>
              Virginia Beach has unique dynamics that separate a competent REALTOR from a great one. Here&apos;s what actually
              matters for buyers and sellers in this specific market.
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
            <strong>Worth verifying:</strong> Every REALTOR in Virginia is licensed through the Virginia Department of Professional
            and Occupational Regulation (DPOR). You can confirm any agent&apos;s active license status at dpor.virginia.gov before
            signing a representation agreement.
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
              Virginia Beach&apos;s seven distinct sub-markets each respond to different buyer profiles. A REALTOR who focuses here
              full-time builds pricing instincts that a generalist — even a licensed one — never develops.
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
            <strong>Flood zone detail matters:</strong> In flood zone neighborhoods, the difference between AE and X designation
            on a FEMA map can swing your annual insurance cost by $2,000–$4,000. Ask specifically about flood zone status
            before submitting an offer.
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
                Barry Jenkins holds his REALTOR designation through the{' '}
                <a href="https://www.hrra.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                  Hampton Roads REALTORS Association
                </a>{' '}
                — one of the largest local REALTOR associations in the Southeast. Over nearly two decades, he has operated
                under NAR&apos;s Code of Ethics and built a production record that placed Legacy Home Team at{' '}
                <strong>#9 nationally</strong> on{' '}
                <a href="https://www.realtrends.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                  Real Trends
                </a>.
              </p>
              <p style={{ marginBottom: 20 }}>
                The practical meaning of REALTOR-level performance: Barry&apos;s team has closed thousands of transactions across
                Hampton Roads, with deep experience in the scenarios Virginia Beach buyers and sellers face — flood zone
                negotiations, VA loan complexities, waterfront due diligence, and military PCS timing.
              </p>
              <p>
                An example of what that infrastructure produces: a client with an inherited home — no staging, an uncertain
                timeline, complicated family dynamics — received nine qualified offers within 24 hours of listing. The
                combination of REALTOR-standard marketing execution and Ylopo-powered digital reach made that outcome possible.
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

      {/* ── Section 4: Questions to ask ── */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <span className="section-label">Due Diligence</span>
            <h2 style={{ marginBottom: 8 }}>Questions Worth Asking Before You Choose a Virginia Beach Realtor</h2>
            <p style={{ marginBottom: 40 }}>
              A competent agent should have specific, data-backed answers to all of these. Vague responses — &ldquo;I work hard&rdquo;
              or &ldquo;I know this market really well&rdquo; — aren&apos;t answers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                'Are you a licensed REALTOR with an active NAR membership?',
                'How many Virginia Beach transactions did you close in the last 12 months?',
                'Can you walk me through your fiduciary obligations as my REALTOR?',
                'What percentage of your listings sold above asking price last year?',
                'Do you have specific experience with flood zone properties and VA loan transactions?',
                'How does your team handle coverage when you\'re unavailable?',
                'What marketing channels do you use beyond the MLS?',
                'Can I verify your DPOR license number and any disciplinary history?',
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
              <strong>When comparing agents:</strong> REALTOR status, local production volume, and military relocation experience
              are the criteria that matter most specifically in Virginia Beach. A team that has closed thousands of homes has
              seen every scenario this market produces.
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
            Ready to Work With a Top-10 Nationally Ranked REALTOR Team?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Barry Jenkins and Legacy Home Team have closed thousands of homes across Hampton Roads over nearly 20 years.
            Whether you&apos;re buying, selling, or relocating to Virginia Beach, we&apos;d like to show you what that looks like
            in practice — no pressure, no pitch.
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
