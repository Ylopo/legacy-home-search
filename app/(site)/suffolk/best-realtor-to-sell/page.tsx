import type { Metadata } from 'next'
import Link from 'next/link'

// ── Skill: keyword-research ───────────────────────────────────────────────────
// Primary:   "best realtor to sell my home in Suffolk VA" (~300/mo, difficulty 30)
// Secondary: "sell my house Suffolk VA" · "listing agent Suffolk Virginia"
// GEO-first queries answered inline: "who should I use to sell my home in Suffolk",
//   "how long to sell a home in Suffolk VA", "what to do before listing in Suffolk"
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Best Realtor to Sell Your Home in Suffolk VA | Legacy Home Team',
  description:
    'Ready to sell your home in Suffolk, VA? Legacy Home Team is ranked #9 in the U.S. with thousands of homes sold. Get the right pricing strategy and cross-market buyer reach.',
  alternates: {
    canonical: 'https://legacyhometeamlpt.com/suffolk/best-realtor-to-sell',
  },
  openGraph: {
    title: 'Best Realtor to Sell Your Home in Suffolk VA | Legacy Home Team',
    description:
      'Ranked #9 nationally with thousands of homes sold. Barry Jenkins and Legacy Home Team — cross-market buyer reach and proven pricing strategy for Suffolk sellers.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/suffolk/best-realtor-to-sell',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Realtor to Sell Your Home in Suffolk VA | Legacy Home Team',
    description:
      'Ranked #9 nationally. Barry Jenkins and Legacy Home Team — the right listing agent for Suffolk home sellers.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description:
    'Legacy Home Team, led by Barry Jenkins, is ranked #9 in the United States among all real estate teams (Real Trends). Specializing in selling homes across all of Suffolk, VA — from Harbour View suburban listings to Nansemond River waterfront properties and rural acreage.',
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
    'home selling', 'listing agent', 'pricing strategy', 'cross-market marketing',
    'Suffolk sellers', 'new construction competition', 'rural property marketing', 'Hampton Roads market',
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
      name: 'Who is the best realtor to sell my home in Suffolk VA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barry Jenkins of Legacy Home Team is ranked #9 nationally among all U.S. real estate teams (Real Trends), with thousands of homes sold and cross-market buyer reach across Virginia Beach, Chesapeake, and Norfolk — the markets where most Suffolk buyers originate.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I price my home correctly in Suffolk?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Work with an agent who uses neighborhood-specific comps, not citywide Suffolk averages. Harbour View pricing doesn\'t transfer to Kings Fork. Rural acreage needs land-value methodology that differs entirely from suburban single-family comps. An agent who knows your specific corridor will price more accurately than one relying on broad Suffolk data.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long will it take to sell my Suffolk home?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Suffolk averages 35–50 days on market. Correctly priced suburban homes in Harbour View and Kings Fork often sell within 3–4 weeks. Rural properties and unique acreage parcels may take 60–90 days due to a smaller buyer pool. Pricing accurately on day one is more important than any marketing tactic.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I do before listing my home in Suffolk?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Address visible deferred maintenance, declutter and clean, and boost curb appeal. For rural properties, ensure the driveway and lot are clearly accessible and that drones can capture the full parcel. Ask your agent which improvements return value in your specific price range — not all repairs translate to dollar-for-dollar return.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Legacy Home Team list and sell homes in Suffolk?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — full Hampton Roads coverage including new construction buyer competition in Harbour View, rural acreage listings, Downtown Suffolk investment properties, and Nansemond River waterfront homes.',
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
    { '@type': 'ListItem', position: 3, name: 'Best Realtor to Sell', item: 'https://legacyhometeamlpt.com/suffolk/best-realtor-to-sell' },
  ],
}

const listingAgentRows = [
  { criteria: 'Cross-market buyer reach', why: 'Many Suffolk buyers are relocating from Virginia Beach or Chesapeake; your listing must appear in their searches across all three markets' },
  { criteria: 'Rural and acreage marketing expertise', why: 'Suburban photography doesn\'t sell rural Suffolk properties — drone coverage and land surveys are essential marketing tools for acreage listings' },
  { criteria: 'Accurate days-on-market expectations', why: 'Suffolk DOM averages 35–50 days; sellers who price optimistically on day one often end up with less on day 90 than a correct price on day one would have earned' },
  { criteria: 'Network of active buyers', why: 'A regional team with thousands of past clients often has active buyers in your price range right now — before you ever hit the MLS' },
  { criteria: 'Builder pricing context', why: 'In Harbour View, resale sellers compete with new construction — your agent needs to understand that dynamic and price accordingly' },
]

const propertyTypeRows = [
  { type: 'Suburban SFR — Harbour View', dom: '20–32 days', pricing: 'Price at market; well-positioned homes here move fast; competing with new construction requires honest condition assessment' },
  { type: 'Suburban SFR — Kings Fork', dom: '28–42 days', pricing: 'Comp-driven; condition and updates matter; school zone reputation supports pricing' },
  { type: 'Rural / Acreage', dom: '45–90 days', pricing: 'Broader comp pool needed; land value varies significantly by buildability and utilities' },
  { type: 'Nansemond River Waterfront', dom: '35–65 days', pricing: 'View, dock access, and flood zone drive pricing more than square footage' },
  { type: 'Downtown Suffolk', dom: '30–55 days', pricing: 'Investor and first-timer mix; pricing sensitive to condition; historic character is a genuine selling point' },
]

const teamCompareRows = [
  { factor: 'Buyer pipeline', solo: 'Current clients only', legacy: 'Thousands of past clients across VA Beach, Chesapeake, Norfolk — active buyers right now' },
  { factor: 'Digital advertising', solo: 'Standard MLS and maybe Zillow', legacy: 'Ylopo-powered campaigns that follow buyers across the internet, not just on listing portals' },
  { factor: 'Drone and aerial marketing', solo: 'Varies; often skipped to save cost', legacy: 'Standard for rural and acreage properties — essential for Suffolk land sales' },
  { factor: 'New construction context', solo: 'May not track builder pricing', legacy: 'Monitors active Harbour View builder incentives; prices resales accordingly' },
  { factor: 'Annual production', solo: 'Typical: 20–40 transactions/year', legacy: 'Thousands of homes sold — pricing pattern recognition across every Suffolk market type' },
]

const faqs = [
  {
    q: 'Who is the best realtor to sell my home in Suffolk VA?',
    a: 'Barry Jenkins of Legacy Home Team is ranked #9 nationally among all U.S. real estate teams (Real Trends), with thousands of homes sold and the cross-market buyer reach that Suffolk sellers need — active buyers from Virginia Beach, Chesapeake, and Norfolk, not just Suffolk.',
  },
  {
    q: 'How do I price my home correctly in Suffolk?',
    a: 'Work with an agent who uses neighborhood-specific comps, not citywide Suffolk averages. Harbour View pricing doesn\'t transfer to Kings Fork. Rural acreage requires land-value methodology entirely different from suburban single-family comps. An agent who knows your specific corridor will price more accurately.',
  },
  {
    q: 'How long will it take to sell my Suffolk home?',
    a: 'Suffolk averages 35–50 days on market citywide. Correctly priced suburban homes in Harbour View and Kings Fork often sell in 3–4 weeks. Rural properties and unique acreage parcels may take 60–90 days. Pricing accurately on day one is more valuable than any marketing tactic.',
  },
  {
    q: 'What should I do before listing my home in Suffolk?',
    a: 'Address visible deferred maintenance, declutter and clean, boost curb appeal. For rural properties, ensure the driveway and lot are clearly accessible and that drones can capture the full parcel. Ask your agent which improvements return value in your price range — not all repairs translate to dollar-for-dollar gains.',
  },
  {
    q: 'Does Legacy Home Team list and sell homes in Suffolk?',
    a: 'Yes — full Hampton Roads coverage including new construction buyer competition in Harbour View, rural acreage listings, Downtown Suffolk investment properties, and Nansemond River waterfront homes.',
  },
]

export default function BestRealtorToSellSuffolk() {
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
          <span style={{ color: 'var(--text-secondary)' }}>Best Realtor to Sell</span>
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: 'var(--accent)', padding: '64px 0 72px', marginTop: 0, borderTop: 'none' }}>
        <div className="container">
          <div style={{ maxWidth: 760 }}>
            <div className="hero-eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', marginBottom: 20 }}>
              Suffolk Home Sellers · Hampton Roads
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              Best Realtor to Sell My Home in Suffolk
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Selling a home in <Link href="/suffolk" style={{ color: '#fff', fontWeight: 700 }}>Suffolk</Link> requires understanding who your buyer is and where they&apos;re searching. Most serious Suffolk buyers are comparing your home against similar properties in{' '}
              <Link href="/chesapeake" style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Chesapeake</Link>{' '}
              and western{' '}
              <Link href="/virginia-beach" style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>Virginia Beach</Link>{' '}
              — and they&apos;re doing that comparison on Zillow before they ever call an agent. Your listing agent must reach those buyers before a competitor&apos;s listing does.
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

      {/* ── Section 1: What makes a great listing agent ── */}
      <section>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Seller Guide</span>
            <h2>What Makes a Great Listing Agent for Suffolk Sellers</h2>
            <p>
              Not all listing agents are equal — and in Suffolk, the specific capabilities that matter for sellers are different from what you&apos;d prioritize in a buyer&apos;s agent. Here&apos;s what actually moves the needle.
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
                    Why It Matters for Suffolk Sellers
                  </th>
                </tr>
              </thead>
              <tbody>
                {listingAgentRows.map((row, i) => (
                  <tr key={row.criteria} style={{ background: i % 2 === 0 ? 'var(--white)' : 'var(--off-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)', verticalAlign: 'top', minWidth: 220 }}>{row.criteria}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{row.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)' }}>
            <strong>Timing matters in Suffolk.</strong> Spring (April–June) is the strongest selling season — families want to close before school starts. Sellers who list in March sell for more than identical homes listed in August. Ask your agent about seasonal pricing patterns in your specific neighborhood.
          </div>
        </div>
      </section>

      {/* ── Section 2: Suffolk seller market by property type ── */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Market Intelligence</span>
            <h2>Suffolk Seller Market by Property Type</h2>
            <p>
              Average days on market and pricing strategy vary significantly by property type in Suffolk. Know where your home fits before you set expectations.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 200 }}>Property Type</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 120 }}>Average DOM</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Key Pricing Consideration</th>
                </tr>
              </thead>
              <tbody>
                {propertyTypeRows.map((row, i) => (
                  <tr key={row.type} style={{ background: i % 2 === 0 ? 'var(--white)' : 'var(--off-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)', verticalAlign: 'top' }}>{row.type}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--accent)', fontWeight: 600, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{row.dom}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{row.pricing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)' }}>
            <strong>For rural Suffolk sellers:</strong> drone photography isn&apos;t optional — it&apos;s how buyers evaluate acreage properties. An aerial shot that shows the lot layout, tree line, water features, and proximity to cleared land tells buyers what 47 ground-level photos cannot.
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
                For Suffolk sellers, Legacy Home Team&apos;s advantage is reach. Running 3 active teams across Hampton Roads means your Suffolk listing gets exposure to buyers searching in{' '}
                <Link href="/chesapeake" style={{ color: 'var(--accent)' }}>Chesapeake</Link>,{' '}
                <Link href="/norfolk" style={{ color: 'var(--accent)' }}>Norfolk</Link>, and{' '}
                <Link href="/virginia-beach" style={{ color: 'var(--accent)' }}>Virginia Beach</Link>{' '}
                — markets where many Suffolk buyers originate. Most single-agent Suffolk practices simply don&apos;t have that cross-market buyer pipeline. Legacy Home Team is ranked{' '}
                <strong style={{ color: 'var(--text)' }}>#9 nationally</strong> on{' '}
                <a href="https://www.realtrends.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Real Trends</a>.
              </p>
              <p style={{ marginBottom: 20 }}>
                On the technology side, Barry&apos;s role at Ylopo means Suffolk listings get digital advertising that follows active buyers across the internet — showing your property to people searching for homes across Hampton Roads before they even think to search Suffolk specifically. That proactive reach generates showings from buyers your listing would never find otherwise through MLS alone.
              </p>
              <p>
                A direct example: a client came to us with an inherited home, no staging budget, and an uncertain timeline — nine qualified offers arrived within 24 hours of listing. The right marketing infrastructure combined with deep local knowledge made that outcome possible. Suffolk sellers benefit from that same system.
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
            <h2 style={{ marginBottom: 8 }}>Questions to Ask a Suffolk Listing Agent</h2>
            <p style={{ marginBottom: 40 }}>
              Before signing a listing agreement, make sure your agent has specific answers — not generalities — to all of these questions.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                'How many Suffolk listings did you sell in the last 12 months?',
                'What\'s your list-to-sale price ratio in Suffolk?',
                'How do you market my Suffolk listing to buyers searching in Chesapeake and Virginia Beach?',
                'Do you use drone photography for acreage and rural Suffolk properties?',
                'How do you handle pricing strategy if we\'re competing against new construction in Harbour View?',
                'What does your pre-listing process look like?',
                'What\'s your average days on market for Suffolk listings?',
                'How do seasonal patterns in Suffolk affect the best time to list?',
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
              <strong>The most important question for Suffolk sellers:</strong> How do you reach buyers who are currently searching in Chesapeake and Virginia Beach? If your agent&apos;s answer is &ldquo;we list on MLS and Zillow,&rdquo; that&apos;s not a strategy — that&apos;s a minimum. Ask specifically how they proactively market to cross-market buyers.
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
            Legacy Home Team · Suffolk Sellers
          </span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', margin: '16px 0 20px' }}>
            Ready to List Your Suffolk Home?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Legacy Home Team brings cross-market buyer reach, Ylopo-powered digital advertising, and nearly 20 years of Hampton Roads pricing experience to every Suffolk listing. Whether you&apos;re in Harbour View, on the Nansemond River, or selling rural acreage, we&apos;d like to walk you through what a well-executed Suffolk listing looks like.
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
