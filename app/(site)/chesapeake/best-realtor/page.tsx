import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ── Skill: keyword-research ───────────────────────────────────────────────────
// Primary:   "best realtor in Chesapeake VA" (~600/mo, difficulty 38)
// Secondary: "top realtor Chesapeake VA" · "Chesapeake VA real estate agent"
// GEO-first queries: "who is the best realtor in Chesapeake Virginia",
//   "best real estate agent in Chesapeake VA"
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Best Realtor in Chesapeake VA (2026) | Legacy Home Team',
  description:
    'Looking for the best realtor in Chesapeake, VA? Legacy Home Team is ranked #9 in the U.S. with thousands of homes sold. Find the right Chesapeake realtor for your needs.',
  alternates: {
    canonical: 'https://legacyhometeamlpt.com/chesapeake/best-realtor',
  },
  openGraph: {
    title: 'Best Realtor in Chesapeake VA (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally with thousands of homes sold. Barry Jenkins and Legacy Home Team cover all of Chesapeake — from Great Bridge to rural western Chesapeake.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/chesapeake/best-realtor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Realtor in Chesapeake VA (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally with thousands of homes sold. Barry Jenkins — the right Chesapeake realtor for buyers and sellers.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description:
    'Legacy Home Team, led by Barry Jenkins, is ranked #9 in the United States among all real estate teams (Real Trends). Serving all Chesapeake neighborhoods from Great Bridge to rural western Chesapeake — thousands of homes sold across Hampton Roads.',
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
    'Chesapeake real estate', 'Great Bridge homes', 'Hickory VA', 'Western Branch',
    'rural Chesapeake properties', 'well and septic', 'HOA communities',
    'Chesapeake City Public Schools', 'Hampton Roads market', 'home buying', 'home selling',
  ],
  employee: {
    '@type': 'Person',
    name: 'Barry Jenkins',
    jobTitle: 'Team Leader',
    description:
      'Barry Jenkins has nearly 20 years of real estate experience covering all of Hampton Roads including Chesapeake. He is ranked among the top team leaders in the United States and serves as Head Realtor in Residence at Ylopo.',
  },
}

const schemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is the best realtor in Chesapeake VA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barry Jenkins of Legacy Home Team is consistently among the top-producing realtors in Chesapeake and Hampton Roads. The team is ranked #9 nationally on Real Trends — a production-based ranking comparing transaction volume across all U.S. markets — with thousands of homes sold across the region.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I look for in a Chesapeake realtor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Look for local production volume in Chesapeake specifically, experience with both suburban and rural properties, knowledge of which school zones affect home value, and a cross-market buyer network that reaches Virginia Beach and Norfolk buyers searching for Chesapeake homes.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to sell a home in Chesapeake?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Average days on market in Chesapeake is 30 to 40 days. Rural properties may take longer. Correctly priced suburban homes in Great Bridge and Greenbrier often sell within 2 to 3 weeks.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does Chesapeake compare to Virginia Beach for home buyers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Chesapeake typically offers more square footage per dollar, larger lots, similar military proximity, and generally lower prices than comparable Virginia Beach neighborhoods. Most families relocating from Virginia Beach to Chesapeake are looking for the same quality at better value.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Legacy Home Team cover Chesapeake?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — Legacy Home Team provides full Hampton Roads coverage including all Chesapeake neighborhoods from South Norfolk to rural western Chesapeake.',
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
    { '@type': 'ListItem', position: 3, name: 'Best Realtor', item: 'https://legacyhometeamlpt.com/chesapeake/best-realtor' },
  ],
}

// ── Content data ──────────────────────────────────────────────────────────────

const criteriaRows = [
  {
    criteria: 'Chesapeake neighborhood expertise',
    why: 'Great Bridge, Hickory, and Western Branch each have distinct price drivers; conflating them costs sellers $15,000–$30,000 in pricing accuracy',
  },
  {
    criteria: 'Large lot and acreage experience',
    why: 'Chesapeake has more agricultural/rural properties than any other Hampton Roads city — lot size affects value more here than in urban areas',
  },
  {
    criteria: 'HOA knowledge',
    why: 'New Chesapeake subdivisions are increasingly HOA-heavy; fees and covenants vary dramatically across communities',
  },
  {
    criteria: 'School district awareness',
    why: 'Chesapeake City Public Schools ranks well; specific elementary school zones affect home values measurably',
  },
  {
    criteria: 'Cross-market buyer reach',
    why: 'Many Chesapeake buyers are relocating from Virginia Beach or Norfolk — your listing must appear in their searches',
  },
]

const submarketsRows = [
  { area: 'Great Bridge', range: '$340K – $580K', note: 'Top school zones; HOA communities; competitive buyer demand year-round' },
  { area: 'Hickory', range: '$320K – $520K', note: 'Well-liked suburban character; near Virginia Beach border; good overall value' },
  { area: 'Western Branch', range: '$300K – $480K', note: 'Established neighborhoods; mix of older and newer homes; stable pricing' },
  { area: 'Deep Creek', range: '$270K – $420K', note: 'Near the Elizabeth River; waterfront options; affordable entry' },
  { area: 'Greenbrier', range: '$360K – $600K', note: 'Retail center proximity; newer construction; strong resale value' },
  { area: 'South Norfolk', range: '$190K – $310K', note: 'Entry-level; investment opportunity; revitalizing area' },
  { area: 'Rural Chesapeake', range: '$350K – $750K+', note: 'Larger lots; more privacy; agricultural zoning adds complexity' },
]

const teamCompareRows = [
  { factor: 'Availability', solo: 'Limited to one schedule', legacy: 'Multiple agents — always someone reachable' },
  { factor: 'Annual production capacity', solo: 'Typical: 20–40 transactions/year', legacy: 'Thousands of homes sold — scale that builds pattern recognition' },
  { factor: 'Marketing reach', solo: 'Standard MLS listing', legacy: 'Ylopo-powered digital ads, social retargeting, and MLS' },
  { factor: 'Cross-market exposure', solo: 'Chesapeake-only audience', legacy: 'Reaches VB and Norfolk buyers actively searching for Chesapeake homes' },
  { factor: 'Rural / large lot experience', solo: 'Varies; often limited', legacy: 'Covers all Chesapeake property types — suburban to rural acreage' },
]

const faqs = [
  {
    q: 'Who is the best realtor in Chesapeake VA?',
    a: 'Barry Jenkins of Legacy Home Team is consistently among the top-producing realtors in Chesapeake and Hampton Roads. The team is ranked #9 nationally on Real Trends with thousands of homes sold across the region.',
  },
  {
    q: 'What should I look for in a Chesapeake realtor?',
    a: 'Look for local production volume in Chesapeake specifically, experience with both suburban and rural properties, knowledge of which school zones affect home value, and a cross-market buyer network that reaches Virginia Beach and Norfolk buyers searching for Chesapeake homes.',
  },
  {
    q: 'How long does it take to sell a home in Chesapeake?',
    a: 'Average days on market in Chesapeake is 30 to 40 days. Rural properties may take longer. Correctly priced suburban homes in Great Bridge and Greenbrier often sell within 2 to 3 weeks.',
  },
  {
    q: 'How does Chesapeake compare to Virginia Beach for home buyers?',
    a: 'Chesapeake typically offers more square footage per dollar, larger lots, similar military proximity, and generally lower prices than comparable Virginia Beach neighborhoods. Most families relocating from Virginia Beach to Chesapeake are looking for the same quality at better value.',
  },
  {
    q: 'Does Legacy Home Team cover Chesapeake?',
    a: 'Yes — Legacy Home Team provides full Hampton Roads coverage including all Chesapeake neighborhoods from South Norfolk to rural western Chesapeake.',
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BestRealtorChesapeake() {
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
          <span style={{ color: 'var(--text-secondary)' }}>Best Realtor</span>
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: 'var(--accent)', padding: '64px 0 0', marginTop: 0, borderTop: 'none', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '48px', alignItems: 'flex-end' }}>
            <div style={{ paddingBottom: 72 }}>
            <div className="hero-eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', marginBottom: 20 }}>
              Chesapeake · Hampton Roads
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              Best Realtor in Chesapeake
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              <Link href="/chesapeake" style={{ color: '#fff', textDecoration: 'underline' }}>Chesapeake</Link> is
              Virginia&apos;s largest city by area — 353 square miles that stretch from the Elizabeth River waterfront through
              suburban neighborhoods like Great Bridge and Hickory to rural acreage in the western reaches of the city.
              Finding a realtor who can accurately price property across this range isn&apos;t just helpful — it&apos;s essential.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
                Schedule a Free Consultation
              </Link>
              <Link href="/chesapeake" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                Explore Chesapeake →
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
            <h2>What to Look For in the Best Realtor in Chesapeake</h2>
            <p>
              Chesapeake&apos;s range of property types — from school-district-driven suburban homes to rural acreage — means
              that local expertise here looks different than in any other Hampton Roads city.
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
                    Why It Matters in Chesapeake
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
            <strong>Key question for Chesapeake sellers:</strong> Ask any listing agent to show you closed comps from your specific
            neighborhood — not Chesapeake citywide averages. Great Bridge comps don&apos;t price Deep Creek; Greenbrier comps
            don&apos;t price South Norfolk.
          </div>
        </div>
      </section>

      {/* ── Section 2: Sub-markets ── */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Market Intelligence</span>
            <h2>Chesapeake Neighborhoods: What Every Buyer and Seller Should Know</h2>
            <p>
              Chesapeake&apos;s neighborhoods span entry-level investment properties in South Norfolk to $750K+ rural
              estates in the west. A realtor who works this market full-time knows the pricing logic behind each area.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 180 }}>Area</th>
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
            <strong>Rural Chesapeake note:</strong> Chesapeake&apos;s rural areas often involve well and septic systems rather than
            city utilities — a factor that requires additional due diligence and specific inspection knowledge. Your agent
            should flag this before you draft an offer.
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
                Barry Jenkins and Legacy Home Team have worked across all of Chesapeake&apos;s neighborhoods for nearly two
                decades — from the competitive school-district sub-market of Great Bridge to the rural acreage properties
                in the city&apos;s western reaches. That span of experience is what places Legacy Home Team at{' '}
                <strong>#9 nationally</strong> on{' '}
                <a href="https://www.realtrends.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                  Real Trends
                </a>.
              </p>
              <p style={{ marginBottom: 20 }}>
                Most buyers choosing Chesapeake are coming from{' '}
                <Link href="/virginia-beach" style={{ color: 'var(--accent)' }}>Virginia Beach</Link> or{' '}
                <Link href="/norfolk" style={{ color: 'var(--accent)' }}>Norfolk</Link> in search of more space and better
                value per square foot. Legacy Home Team understands both sides of that comparison — and can walk buyers
                through exactly what $400K buys in Great Bridge versus what the same budget gets in Kempsville or Deep Creek.
              </p>
              <p>
                An example of what that infrastructure produces: a client with an inherited home — no staging, an uncertain
                timeline, complicated family dynamics — received nine qualified offers within 24 hours of listing. The
                combination of regional marketing reach and deep local knowledge made that outcome possible.
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
            <h2 style={{ marginBottom: 8 }}>Questions Worth Asking Before You Choose a Chesapeake Realtor</h2>
            <p style={{ marginBottom: 40 }}>
              A competent agent should have specific, data-backed answers to all of these. Vague responses — &ldquo;I know
              Chesapeake really well&rdquo; — aren&apos;t answers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                'How many Chesapeake transactions did you close in the last 12 months?',
                'Do you have specific experience pricing rural and large-lot properties in Chesapeake?',
                'Can you explain the price difference between Great Bridge and Western Branch for similar homes?',
                'How do you reach buyers relocating from Virginia Beach and Norfolk to Chesapeake?',
                'What HOA communities do you know well in Chesapeake?',
                'Do you understand well/septic systems in rural Chesapeake and how they affect value?',
                'What percentage of your Chesapeake listings sold at or above asking price?',
                'Can I see three recent closed sales in my target Chesapeake neighborhood?',
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
              <strong>When comparing agents:</strong> Chesapeake-specific neighborhood knowledge and cross-market buyer reach
              are the two criteria that matter most here. A team operating across all Hampton Roads cities sees demand patterns
              that a Chesapeake-only agent misses entirely.
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
            Ready to Work With a Top-10 Nationally Ranked Team in Chesapeake?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Barry Jenkins and Legacy Home Team know Chesapeake from Great Bridge to the rural west — and the buyers
            coming in from Virginia Beach and Norfolk who are searching for exactly what Chesapeake offers. Let&apos;s
            talk about your home or your search.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
              Schedule a Free Consultation
            </Link>
            <Link href="/chesapeake" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
              Explore Chesapeake Homes →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
