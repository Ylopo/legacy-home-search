import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// ── Skill: keyword-research ───────────────────────────────────────────────────
// Primary:   "best realtor in Suffolk VA" (~500/mo, difficulty 35)
// Secondary: "best real estate agent Suffolk Virginia" · "top realtor Suffolk"
// GEO-first queries answered inline: "who is the best realtor in Suffolk VA",
//   "is Suffolk VA a good place to buy", "best neighborhoods in Suffolk to buy"
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Best Realtor in Suffolk VA (2026) | Legacy Home Team',
  description:
    'Looking for the best realtor in Suffolk, VA? Legacy Home Team is ranked #9 in the U.S. with thousands of homes sold. Barry Jenkins knows Suffolk\'s neighborhoods and rural character.',
  alternates: {
    canonical: 'https://legacyhometeamlpt.com/suffolk/best-realtor',
  },
  openGraph: {
    title: 'Best Realtor in Suffolk VA (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally with thousands of homes sold. Barry Jenkins and Legacy Home Team — Harbour View to the Nansemond River, the full range of Suffolk real estate.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/suffolk/best-realtor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Realtor in Suffolk VA (2026) | Legacy Home Team',
    description:
      'Ranked #9 nationally with thousands of homes sold. Barry Jenkins covers all of Suffolk — Harbour View to rural riverfront.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description:
    'Legacy Home Team, led by Barry Jenkins, is ranked #9 in the United States among all real estate teams (Real Trends). Serving the Suffolk, VA market with expertise across Harbour View, Kings Fork, Nansemond River waterfront, and rural Suffolk acreage.',
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
    { '@type': 'City', name: 'Suffolk' },
    { '@type': 'City', name: 'Virginia Beach' },
    { '@type': 'City', name: 'Chesapeake' },
    { '@type': 'City', name: 'Norfolk' },
    { '@type': 'City', name: 'Hampton' },
    { '@type': 'City', name: 'Newport News' },
  ],
  knowsAbout: [
    'real estate', 'home buying', 'home selling', 'rural property',
    'waterfront property', 'new construction', 'Suffolk neighborhoods', 'Hampton Roads market',
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
      name: 'Who is the best realtor in Suffolk VA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barry Jenkins of Legacy Home Team is ranked #9 nationally among all U.S. real estate teams (Real Trends), with thousands of homes sold across Hampton Roads including deep coverage of Suffolk from Harbour View to rural acreage on the Nansemond River.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is Suffolk VA a good place to buy real estate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — Suffolk is one of the fastest-growing cities in Hampton Roads, offering significantly more space and land per dollar than Virginia Beach or Chesapeake. Harbour View especially has seen strong appreciation as the corridor develops, and rural areas offer privacy and acreage at prices unavailable elsewhere in the region.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the best neighborhoods in Suffolk to buy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Depends on lifestyle: Harbour View for suburban amenities and access to new construction, rural areas for space and privacy on large lots, Downtown Suffolk for historic character and investment opportunity, and Nansemond River waterfront for premium riverfront living with dock potential.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to sell a home in Suffolk?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Average days on market in Suffolk runs 35–50 days citywide. Suburban homes in Harbour View and Kings Fork often sell in 3–4 weeks when priced correctly. Rural acreage properties typically take longer due to a smaller buyer pool — plan for 60–90 days for unique parcels.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Legacy Home Team serve Suffolk?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — full Hampton Roads coverage including all Suffolk neighborhoods from Harbour View and Kings Fork suburban corridors to the rural western reaches of the city and Nansemond River waterfront properties.',
      },
    },
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Suffolk', item: 'https://legacyhometeamlpt.com/suffolk' },
    { '@type': 'ListItem', position: 3, name: 'Best Realtor', item: 'https://legacyhometeamlpt.com/suffolk/best-realtor' },
  ],
}

const criteriaRows = [
  { criteria: 'Large lot and acreage pricing experience', why: 'Suffolk has more rural and agricultural properties than any Hampton Roads city; pricing land requires different comps and methodology than suburban single-family homes' },
  { criteria: 'Nansemond River waterfront knowledge', why: 'Riverfront properties command 20–40% premiums; your agent must verify riparian rights, VMRC permits, and buildable area before you offer' },
  { criteria: 'New construction expertise', why: 'Suffolk\'s Harbour View and Kings Fork corridors are active new construction zones; builder negotiations differ significantly from resale transactions' },
  { criteria: 'Commuting corridor awareness', why: 'Most Suffolk buyers work in Norfolk, Chesapeake, or Virginia Beach; your agent should understand commute patterns and infrastructure plans' },
  { criteria: 'Rural zoning knowledge', why: 'Agricultural and wetland designations affect what buyers can build on a Suffolk lot; this surprises buyers relocating from urban Hampton Roads markets' },
]

const areaRows = [
  { area: 'Harbour View', range: '$385K–$720K', note: 'Premier Suffolk corridor; new construction; HOA communities; retail and dining amenities' },
  { area: 'Kings Fork', range: '$315K–$560K', note: 'Growing; well-regarded schools; mix of resales and new construction' },
  { area: 'Downtown Suffolk / Prentis Park', range: '$225K–$390K', note: 'Historic character; revitalizing; investment and first-time buyer opportunity' },
  { area: 'Nansemond River waterfront', range: '$460K–$960K+', note: 'Dock potential; river access; premium pricing; limited inventory; natural beauty' },
  { area: 'Rural Suffolk (north and west)', range: '$285K–$620K', note: 'Acreage lots; agricultural; privacy; well/septic systems common' },
  { area: 'Lake Meade / Bridgewater area', range: '$295K–$490K', note: 'Lakes and ponds communities; family neighborhoods; solid value' },
]

const teamCompareRows = [
  { factor: 'Availability', solo: 'Limited to one schedule', legacy: 'Multiple agents — always someone reachable' },
  { factor: 'Annual production capacity', solo: 'Typical: 20–40 transactions/year', legacy: 'Thousands of homes sold — scale that builds pattern recognition' },
  { factor: 'Marketing reach', solo: 'Standard MLS listing', legacy: 'Ylopo-powered digital ads, social retargeting, and MLS' },
  { factor: 'Cross-market buyer access', solo: 'Suffolk-focused buyer pool', legacy: 'Active buyers from VA Beach, Chesapeake, and Norfolk pipelines' },
  { factor: 'Rural and acreage experience', solo: 'Varies', legacy: 'Pricing methodology for large lots, waterfront, and agricultural land' },
]

const faqs = [
  {
    q: 'Who is the best realtor in Suffolk VA?',
    a: 'Barry Jenkins of Legacy Home Team is ranked #9 nationally among all U.S. real estate teams (Real Trends), with thousands of homes sold and nearly two decades of Hampton Roads experience including deep coverage across all Suffolk neighborhoods.',
  },
  {
    q: 'Is Suffolk VA a good place to buy real estate?',
    a: 'Yes — Suffolk is one of the fastest-growing cities in Hampton Roads, offering significantly more space and land per dollar than Virginia Beach or Chesapeake. Harbour View has seen strong appreciation as the corridor matures, and rural areas offer privacy and acreage at prices unavailable elsewhere in the region.',
  },
  {
    q: 'What are the best neighborhoods in Suffolk to buy?',
    a: 'Depends on lifestyle: Harbour View for suburban amenities and new construction, rural Suffolk for space and privacy on large lots, Downtown Suffolk for historic character and investment opportunity, and the Nansemond River waterfront for premium riverfront living with dock potential.',
  },
  {
    q: 'How long does it take to sell a home in Suffolk?',
    a: 'Average days on market in Suffolk runs 35–50 days citywide. Suburban homes in Harbour View and Kings Fork often sell in 3–4 weeks when correctly priced. Rural acreage properties typically take longer — plan for 60–90 days for unique parcels.',
  },
  {
    q: 'Does Legacy Home Team serve Suffolk?',
    a: 'Yes — full Hampton Roads coverage including all Suffolk neighborhoods from the Harbour View suburban corridor to rural acreage on the western reaches of the city and Nansemond River waterfront properties.',
  },
]

export default function BestRealtorSuffolk() {
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
          <Link href="/suffolk" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Suffolk</Link>
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
              Suffolk · Hampton Roads
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              Best Realtor in Suffolk
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Suffolk covers more than 400 square miles — one of the largest cities by area in the Eastern United States. From the suburban growth corridors of Harbour View and Kings Fork to rural acreage along the Nansemond River, <Link href="/suffolk" style={{ color: '#fff', fontWeight: 700 }}>Suffolk</Link> is a market that rewards working with a realtor who understands both sides of that range.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
                Schedule a Free Consultation
              </Link>
              <Link href="/suffolk" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                Explore Suffolk →
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
            <h2>What to Look For in a Suffolk Realtor</h2>
            <p>
              Suffolk&apos;s range — from master-planned suburban corridors to rural riverfront acreage — demands a realtor with genuine breadth. Here&apos;s what matters when evaluating agents for this specific market.
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
                    Why It Matters in Suffolk
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
            <strong>Unique to Suffolk:</strong> many rural properties involve well and septic systems rather than city utilities — and some agricultural land has wetland designations that restrict development. Ask your agent to confirm utilities and zoning before making any offer on rural Suffolk property.
          </div>
        </div>
      </section>

      {/* ── Section 2: Suffolk areas ── */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Market Intelligence</span>
            <h2>Suffolk Areas: What Every Buyer and Seller Should Know</h2>
            <p>
              Suffolk&apos;s size means dramatically different markets exist within the same city limits. Each area has its own pricing drivers, buyer profile, and considerations.
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
                {areaRows.map((row, i) => (
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
            <strong>Harbour View is worth a direct comparison:</strong> comparable suburban amenities to{' '}
            <Link href="/chesapeake" style={{ color: 'var(--accent)', fontWeight: 600 }}>Chesapeake</Link>&apos;s Great Bridge area but with new construction product still available. For buyers priced out of{' '}
            <Link href="/virginia-beach" style={{ color: 'var(--accent)', fontWeight: 600 }}>Virginia Beach</Link>{' '}
            or Chesapeake, Harbour View delivers the same lifestyle corridor at a meaningful discount.
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
                Legacy Home Team has worked across all of Suffolk&apos;s neighborhoods — from the new construction communities of Harbour View to rural riverfront acreage on the Nansemond. For nearly two decades, Barry Jenkins has helped buyers and sellers navigate what is arguably the most varied real estate market in Hampton Roads. That perspective, combined with a{' '}
                <strong style={{ color: 'var(--text)' }}>#9 national ranking</strong> on{' '}
                <a href="https://www.realtrends.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Real Trends</a>,
                {' '}means clients get both local depth and cross-market data.
              </p>
              <p style={{ marginBottom: 20 }}>
                Most Suffolk buyers are making a trade — less urbanity for more space and better value per square foot. They&apos;re often comparing Suffolk directly against{' '}
                <Link href="/chesapeake" style={{ color: 'var(--accent)' }}>Chesapeake</Link>{' '}
                or western{' '}
                <Link href="/virginia-beach" style={{ color: 'var(--accent)' }}>Virginia Beach</Link>,
                {' '}and they need an agent who can translate that comparison accurately. Legacy Home Team operates across all three markets and can give buyers a grounded perspective on what each community delivers for the price.
              </p>
              <p>
                A recent example of what that infrastructure delivers: a client came to us with an inherited home, no staging budget, and an uncertain timeline — nine qualified offers arrived within 24 hours of listing. That outcome requires both the local knowledge to price correctly and the digital reach to find the right buyers fast.
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
            <h2 style={{ marginBottom: 8 }}>Questions Worth Asking Before You Choose a Suffolk Realtor</h2>
            <p style={{ marginBottom: 40 }}>
              A competent agent should have specific, data-backed answers to all of these. Vague responses — &ldquo;I know this market&rdquo; or &ldquo;I work all of Hampton Roads&rdquo; — aren&apos;t enough.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                'How many Suffolk transactions did you close in the last 12 months?',
                'Do you have experience pricing rural and large-lot Suffolk properties?',
                'Can you explain what riparian rights mean for a Nansemond River waterfront purchase?',
                'How do you handle new construction builder negotiations in Harbour View?',
                'What\'s the commute reality from Harbour View to Norfolk or Virginia Beach?',
                'Do you understand well and septic systems and how they affect value in rural Suffolk?',
                'How does Suffolk pricing compare to similar-sized properties in Chesapeake?',
                'Can you show me recent closed sales in my target Suffolk neighborhood?',
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
              <strong>When comparing agents:</strong> ask each agent specifically how many Suffolk transactions — not Hampton Roads broadly — they closed last year. A generalist who works everywhere rarely has the granular knowledge of Harbour View builder pricing or Nansemond River riparian rights that Suffolk buyers need.
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
            Legacy Home Team · Suffolk
          </span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', margin: '16px 0 20px' }}>
            Ready to Work With a Top-10 Nationally Ranked Team in Suffolk?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Barry Jenkins and Legacy Home Team bring nearly 20 years of Hampton Roads experience to every Suffolk transaction — from Harbour View new construction to Nansemond River waterfront. Whether you&apos;re buying, selling, or comparing Suffolk against other markets, we can give you a grounded picture.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
              Schedule a Free Consultation
            </Link>
            <Link href="/suffolk" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
              Explore Suffolk Homes →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
