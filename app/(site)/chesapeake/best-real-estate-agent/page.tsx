import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Real Estate Agent in Chesapeake VA (2026) | Legacy Home Team',
  description: 'Looking for the best real estate agent in Chesapeake? Barry Jenkins\' team ranks #9 nationally (Real Trends). Median $360K-$480K. Get a strategy call today.',
  alternates: { canonical: 'https://legacyhometeamlpt.com/chesapeake/best-real-estate-agent' },
  openGraph: {
    title: 'Best Real Estate Agent in Chesapeake VA (2026) | Legacy Home Team',
    description: 'Chesapeake\'s sub-markets behave independently. Legacy Home Team, ranked #9 in the U.S., reads all four with precision.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/chesapeake/best-real-estate-agent',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Real Estate Agent in Chesapeake VA (2026) | Legacy Home Team',
    description: 'Chesapeake\'s sub-markets behave independently. Legacy Home Team, ranked #9 in the U.S., reads all four with precision.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description: 'Legacy Home Team, led by Barry Jenkins, is a top-ranked Hampton Roads real estate group serving Chesapeake, VA. Ranked #9 nationally by Real Trends with thousands of homes sold across the region.',
  url: 'https://legacyhometeamlpt.com',
  telephone: '(757) 816-4037',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '5224 Indian River Rd',
    addressLocality: 'Chesapeake',
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
      name: 'Who is the best real estate agent in Chesapeake?',
      acceptedAnswer: { '@type': 'Answer', text: 'Barry Jenkins and Legacy Home Team are ranked #9 nationally among all U.S. real estate teams by Real Trends. With nearly 20 years of experience and thousands of homes sold across Hampton Roads, our team covers every Chesapeake sub-market from Great Bridge to Deep Creek.' },
    },
    {
      '@type': 'Question',
      name: 'What is the median home price in Chesapeake in 2025?',
      acceptedAnswer: { '@type': 'Answer', text: 'The Chesapeake median home price runs $360K-$480K in 2025, but that range hides significant variation. Hickory and Great Bridge often trade well above the median, while Deep Creek and parts of South Norfolk offer entry points closer to $260K-$350K.' },
    },
    {
      '@type': 'Question',
      name: 'Which Chesapeake neighborhood is best for families?',
      acceptedAnswer: { '@type': 'Answer', text: 'Great Bridge is the most consistently requested area for families, driven by top-rated schools and steady resale demand. Hickory is a strong second choice for families who want larger lots and newer construction.' },
    },
    {
      '@type': 'Question',
      name: 'Is Chesapeake a good place to buy for military families?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes — Western Branch in particular is popular with military and civilian shipyard workers because of its commute to Norfolk Naval Shipyard and NSA Hampton Roads. Our team handles VA loans and PCS timelines constantly and coordinates with the Hampton Roads Realtors Association standards (hrra.com).' },
    },
    {
      '@type': 'Question',
      name: 'How is Chesapeake different from Virginia Beach or Norfolk for buyers?',
      acceptedAnswer: { '@type': 'Answer', text: 'Chesapeake is larger, more spread out, and generally offers more house per dollar than Virginia Beach or Norfolk — but the sub-markets vary dramatically. Buyers moving from Virginia Beach are often surprised how differently Hickory prices compared to Great Bridge, even inside the same city.' },
    },
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Chesapeake', item: 'https://legacyhometeamlpt.com/chesapeake' },
    { '@type': 'ListItem', position: 3, name: 'Best Real Estate Agent in Chesapeake', item: 'https://legacyhometeamlpt.com/chesapeake/best-real-estate-agent' },
  ],
}

const criteriaRows = [
  { criteria: 'Sub-market fluency', why: 'Great Bridge, Hickory, Western Branch, and Deep Creek each price and sell on different logic. One-size pricing loses money.' },
  { criteria: 'Military & PCS experience', why: 'Western Branch and areas near Norfolk NSY see constant military moves. Timelines and VA loan nuances have to be handled cleanly.' },
  { criteria: 'New construction knowledge', why: 'Hickory has active builder inventory. Buyers need someone who negotiates against builder contracts, not just resale.' },
  { criteria: 'School-zone data command', why: 'Great Bridge families pay a premium for specific school assignments. An agent who can\'t map boundaries costs you the sale.' },
  { criteria: 'Regional pricing data', why: 'Chesapeake\'s $360K-$480K median hides huge swings. The right agent shows you comps by sub-market, not city-wide averages.' },
]

const submarketsRows = [
  { area: 'Great Bridge', range: '$420K-$650K', note: 'Top-rated schools drive consistent family demand and shorter days on market.' },
  { area: 'Hickory', range: '$450K-$750K', note: 'Rural feel, larger lots, and active new construction — buyers here compete with builder inventory.' },
  { area: 'Western Branch', range: '$320K-$475K', note: 'Norfolk commuter belt with heavy military-adjacent demand and steady turnover.' },
  { area: 'Deep Creek', range: '$260K-$380K', note: 'Industrial waterfront and working-class stability — value plays and investor interest.' },
  { area: 'Greenbrier', range: '$350K-$525K', note: 'Central location near retail and highways; strong resale liquidity.' },
  { area: 'South Norfolk', range: '$240K-$360K', note: 'Historic pockets and renovation opportunity; appraisals require careful comp selection.' },
]

const teamCompareRows = [
  { factor: 'Availability', solo: 'Limited to one schedule', legacy: 'Multiple agents — always someone reachable' },
  { factor: 'Annual production', solo: 'Typical: 20–40 transactions/year', legacy: 'Thousands of homes sold — scale that builds pattern recognition' },
  { factor: 'Marketing reach', solo: 'Standard MLS listing', legacy: 'Ylopo-powered digital ads, social retargeting, and MLS' },
  { factor: 'Negotiation approach', solo: 'One perspective', legacy: 'Team-reviewed, market-tested strategy' },
  { factor: 'Military PCS experience', solo: 'Varies', legacy: 'Established process — tight timelines handled routinely' },
]

const faqs = [
  { q: 'Who is the best real estate agent in Chesapeake?', a: 'Barry Jenkins and Legacy Home Team are ranked #9 nationally among all U.S. real estate teams by Real Trends. With nearly 20 years of experience and thousands of homes sold across Hampton Roads, our team covers every Chesapeake sub-market from Great Bridge to Deep Creek.' },
  { q: 'What is the median home price in Chesapeake in 2025?', a: 'The Chesapeake median home price runs $360K-$480K in 2025, but that range hides significant variation. Hickory and Great Bridge often trade well above the median, while Deep Creek and parts of South Norfolk offer entry points closer to $260K-$350K.' },
  { q: 'Which Chesapeake neighborhood is best for families?', a: 'Great Bridge is the most consistently requested area for families, driven by top-rated schools and steady resale demand. Hickory is a strong second choice for families who want larger lots and newer construction.' },
  { q: 'Is Chesapeake a good place to buy for military families?', a: 'Yes — Western Branch in particular is popular with military and civilian shipyard workers because of its commute to Norfolk Naval Shipyard and NSA Hampton Roads. Our team handles VA loans and PCS timelines constantly and coordinates with the Hampton Roads Realtors Association standards (hrra.com).' },
  { q: 'How is Chesapeake different from Virginia Beach or Norfolk for buyers?', a: 'Chesapeake is larger, more spread out, and generally offers more house per dollar than Virginia Beach or Norfolk — but the sub-markets vary dramatically. Buyers moving from Virginia Beach are often surprised how differently Hickory prices compared to Great Bridge, even inside the same city.' },
]

export default function BestRealEstateAgentChesapeake() {
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
          <Link href="/chesapeake" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Chesapeake</Link>
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
              Chesapeake · Hampton Roads
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              Best Real Estate Agent in Chesapeake
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Chesapeake covers 353 square miles and four totally different housing markets. Great Bridge doesn't behave like Deep Creek, and Hickory doesn't price like Western Branch. Our team reads all of them — because pricing a home wrong in Chesapeake usually means you priced it against the wrong neighborhood.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
                Schedule a Free Consultation
              </Link>
              <Link href="/chesapeake" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                Explore Chesapeake Homes →
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
            <span className="section-label">Buyer & Seller Guide</span>
            <h2>What to Look For in a Chesapeake Real Estate Agent</h2>
            <p>The best agent in Chesapeake isn't the one with the biggest sign — it's the one who can tell you why a house in Hickory appraises differently than one two zip codes away. Here's what actually matters when you're vetting representation.</p>
          </div>
          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>What to Look For</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Why It Matters in Chesapeake</th>
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
            <strong>Pro tip:</strong> Ask any agent to name the last three homes they sold in your specific sub-market — not just Chesapeake. If they can't, they're guessing on your pricing.
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <h2>Why Chesapeake Requires a Specialist, Not a Generalist</h2>
            <p>Chesapeake is Virginia's second-largest city by land area — bigger than Virginia Beach, Norfolk, and Suffolk in footprint. That size masks four distinct micro-markets that trade on their own supply, demand, and buyer profile.</p>
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
            <strong>Pro tip:</strong> If you're relocating from Virginia Beach or Norfolk, don't assume Chesapeake pricing tracks with what you know. It doesn't — and the sub-market you pick matters more than the city line.
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
              <p style={{ marginBottom: 20 }}>Barry Jenkins has spent nearly 20 years selling real estate across Hampton Roads and leads three teams covering Virginia Beach, Chesapeake, Norfolk, Suffolk, Hampton, and Newport News. Real Trends ranks Legacy Home Team #9 nationally out of every real estate team in the U.S. — a ranking built on thousands of closed transactions, not marketing spend.</p>
              <p style={{ marginBottom: 20 }}>Barry also serves as Head Realtor in Residence at Ylopo and CMO at Better Homes and Gardens NAGR, which means our Chesapeake clients get access to buyer-matching and listing-exposure technology that most local agents simply don't have. When a Great Bridge listing hits the market with us, it reaches the exact buyer profile shopping that school zone — not a generic MLS blast.</p>
              <p>We've closed in every Chesapeake sub-market from Deep Creek to Hickory, and our agents live and work across Hampton Roads so we know how buyers move between Chesapeake, Virginia Beach, and Norfolk. That regional view is what lets us price and position homes accurately in a city where the wrong comp can cost you $30K.</p>
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
            <h2 style={{ marginBottom: 8 }}>Questions to Ask Before Choosing a Chesapeake Real Estate Agent</h2>
            <p style={{ marginBottom: 40 }}>A competent agent should have specific, data-backed answers to all of these. Vague responses are not answers.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
        'How many homes have you personally closed in Chesapeake in the last 12 months?',
        'Can you walk me through the pricing differences between Great Bridge, Hickory, Western Branch, and Deep Creek?',
        'What\'s your experience with VA loans and military PCS timelines?',
        'How do you handle new construction negotiations versus resale offers?',
        'What marketing technology do you use to reach out-of-market buyers?',
        'How do you decide which comps to use in a 353-square-mile city?',
        'What\'s your team structure — will I be working with you or handed off?',
        'Can you share references from clients in my specific sub-market?',
              ].map((q, i) => (
                <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>{q}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)', marginTop: 24 }}>
              <strong>Pro tip:</strong> Any agent worth hiring should welcome these questions. If they get defensive or vague on sub-market comps, keep interviewing — Chesapeake is not a city where you want someone learning on your file.
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
            Legacy Home Team · Chesapeake
          </span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', margin: '16px 0 20px' }}>
            Get a Real Chesapeake Strategy From the #9 Team in America
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Whether you're buying in Great Bridge, selling in Hickory, or relocating into Western Branch, you deserve an agent who knows the difference. Book a call with Legacy Home Team and we'll show you the exact comps, sub-market data, and pricing strategy that fits your situation — no pressure, just clarity.
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
