import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Waterfront Realtor in Chesapeake (2026) | Legacy Home Team',
  description: 'Top-ranked Chesapeake waterfront realtor. #9 nationally per Real Trends. Northwest River, Deep Creek, lake communities — dock permits, flood certs handled. Call today.',
  alternates: { canonical: 'https://legacyhometeamlpt.com/chesapeake/best-waterfront-realtor' },
  openGraph: {
    title: 'Best Waterfront Realtor in Chesapeake (2026) | Legacy Home Team',
    description: 'Chesapeake waterfront specialists. Northwest River to Deep Creek — we handle VMRC permits, flood certs, and bulkhead due diligence.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/chesapeake/best-waterfront-realtor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Waterfront Realtor in Chesapeake (2026) | Legacy Home Team',
    description: 'Chesapeake waterfront specialists. Northwest River to Deep Creek — we handle VMRC permits, flood certs, and bulkhead due diligence.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description: 'Legacy Home Team, led by Barry Jenkins, is a top-ranked Hampton Roads brokerage specializing in Chesapeake waterfront properties including Northwest River, Deep Creek, and lake community homes.',
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
      name: 'Who is the best waterfront realtor in Chesapeake?',
      acceptedAnswer: { '@type': 'Answer', text: 'Barry Jenkins and Legacy Home Team are ranked #9 nationally among all U.S. real estate teams by Real Trends, with thousands of Hampton Roads homes sold over roughly 20 years. Our team specializes in Chesapeake waterfront across Northwest River, Deep Creek, lake communities, and Bay-access submarkets.' },
    },
    {
      '@type': 'Question',
      name: 'What is the price range for waterfront homes in Chesapeake?',
      acceptedAnswer: { '@type': 'Answer', text: 'Most Chesapeake waterfront trades between $280K and $950K+. Northwest River frontage runs $450K-$900K, Deep Creek waterway homes $320K-$550K, lake communities $280K-$475K, and Bay-access properties $525K-$950K and up.' },
    },
    {
      '@type': 'Question',
      name: 'Do I need a special permit for a dock in Chesapeake?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Most Chesapeake waterfront docks require a Virginia Marine Resources Commission (VMRC) permit, which you can verify at mrc.virginia.gov. We pull permit history on every waterfront property before our clients write an offer.' },
    },
    {
      '@type': 'Question',
      name: 'How much is flood insurance on Chesapeake waterfront?',
      acceptedAnswer: { '@type': 'Answer', text: 'It depends entirely on flood zone and elevation certificate. We see annual premiums range from under $1,000 in X zones to $5,000-$8,000+ in VE zones near Northwest River and Bay-access properties. Always pull the elevation certificate before making an offer.' },
    },
    {
      '@type': 'Question',
      name: 'Are lake community homes a good investment in Chesapeake?',
      acceptedAnswer: { '@type': 'Answer', text: 'They can be, but HOA restrictions on motorized watercraft directly affect resale value — often by 8-12%. We review HOA covenants on every lake community transaction so buyers understand the resale pool before they buy.' },
    },
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Chesapeake', item: 'https://legacyhometeamlpt.com/chesapeake' },
    { '@type': 'ListItem', position: 3, name: 'Best Waterfront Realtor in Chesapeake', item: 'https://legacyhometeamlpt.com/chesapeake/best-waterfront-realtor' },
  ],
}

const criteriaRows = [
  { criteria: 'VMRC dock permit fluency', why: 'Northwest River and Bay-access docks require Virginia Marine Resources Commission permits — improper paperwork delays closings 30-60 days.' },
  { criteria: 'Flood elevation certificate review', why: 'Chesapeake\'s mix of AE, VE, and X zones can swing annual insurance premiums by $3K-$8K on otherwise comparable homes.' },
  { criteria: 'Bulkhead and shoreline assessment', why: 'Failing bulkheads on Northwest River frontage routinely cost $40K-$120K to replace and are often missed on standard inspections.' },
  { criteria: 'Sub-market pricing data', why: 'Deep Creek and Northwest River trade at very different per-foot premiums; using countywide comps misprices listings by 10-20%.' },
  { criteria: 'HOA watercraft restriction knowledge', why: 'Lake community HOAs that ban gas motors materially reduce buyer pool and resale value — most agents never check the covenants.' },
]

const submarketsRows = [
  { area: 'Northwest River frontage', range: '$450K-$900K', note: 'The premium tier — deep water, private docks, and the strictest VMRC and bulkhead scrutiny.' },
  { area: 'Deep Creek waterway', range: '$320K-$550K', note: 'Industrial/working waterway with lower flood premiums but commercial traffic that filters the buyer pool.' },
  { area: 'Lake Drummond / inland lakes', range: '$280K-$475K', note: 'HOA-governed motorized watercraft rules can cut resale value 8-12% versus unrestricted lots.' },
  { area: 'Western Branch waterfront', range: '$400K-$725K', note: 'Mixed creek and river access with variable flood zones — elevation certificate is non-negotiable.' },
  { area: 'Bay-access communities', range: '$525K-$950K+', note: 'Highest insurance costs in the city, but strongest appreciation tied to Virginia Beach and Norfolk waterfront comps.' },
  { area: 'Great Bridge canal homes', range: '$375K-$625K', note: 'Lock-controlled water levels make dock condition and lift specs more important than bulkhead height.' },
]

const teamCompareRows = [
  { factor: 'Availability', solo: 'Limited to one schedule', legacy: 'Multiple agents — always someone reachable' },
  { factor: 'Annual production', solo: 'Typical: 20–40 transactions/year', legacy: 'Thousands of homes sold — scale that builds pattern recognition' },
  { factor: 'Marketing reach', solo: 'Standard MLS listing', legacy: 'Ylopo-powered digital ads, social retargeting, and MLS' },
  { factor: 'Negotiation approach', solo: 'One perspective', legacy: 'Team-reviewed, market-tested strategy' },
  { factor: 'Military PCS experience', solo: 'Varies', legacy: 'Established process — tight timelines handled routinely' },
]

const faqs = [
  { q: 'Who is the best waterfront realtor in Chesapeake?', a: 'Barry Jenkins and Legacy Home Team are ranked #9 nationally among all U.S. real estate teams by Real Trends, with thousands of Hampton Roads homes sold over roughly 20 years. Our team specializes in Chesapeake waterfront across Northwest River, Deep Creek, lake communities, and Bay-access submarkets.' },
  { q: 'What is the price range for waterfront homes in Chesapeake?', a: 'Most Chesapeake waterfront trades between $280K and $950K+. Northwest River frontage runs $450K-$900K, Deep Creek waterway homes $320K-$550K, lake communities $280K-$475K, and Bay-access properties $525K-$950K and up.' },
  { q: 'Do I need a special permit for a dock in Chesapeake?', a: 'Yes. Most Chesapeake waterfront docks require a Virginia Marine Resources Commission (VMRC) permit, which you can verify at mrc.virginia.gov. We pull permit history on every waterfront property before our clients write an offer.' },
  { q: 'How much is flood insurance on Chesapeake waterfront?', a: 'It depends entirely on flood zone and elevation certificate. We see annual premiums range from under $1,000 in X zones to $5,000-$8,000+ in VE zones near Northwest River and Bay-access properties. Always pull the elevation certificate before making an offer.' },
  { q: 'Are lake community homes a good investment in Chesapeake?', a: 'They can be, but HOA restrictions on motorized watercraft directly affect resale value — often by 8-12%. We review HOA covenants on every lake community transaction so buyers understand the resale pool before they buy.' },
]

export default function BestWaterfrontRealtorChesapeake() {
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
          <span style={{ color: 'var(--text-secondary)' }}>Best Waterfront Realtor</span>
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
              Best Waterfront Realtor in Chesapeake
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Chesapeake waterfront is not one market — it's at least four. Northwest River frontage, Deep Creek's industrial waterway, inland lake communities with HOA watercraft rules, and Bay-access properties each carry radically different flood insurance costs, dock permit pathways, and resale pools. Our team underwrites every waterfront listing and offer against those specific realities.
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
            <span className="section-label">Waterfront Buyer Guide</span>
            <h2>What to Look For in a Chesapeake Waterfront Realtor</h2>
            <p>Waterfront in Chesapeake punishes generalists. Here is the criteria checklist we coach every client through before they sign with any agent.</p>
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
            <strong>Pro tip:</strong> Ask any agent to pull a sample elevation certificate and explain the BFE number. If they can't, they shouldn't be writing your waterfront offer.
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <h2>Why Chesapeake Waterfront Requires a True Specialist</h2>
            <p>Chesapeake's waterfront submarkets share a zip code and almost nothing else. Here is how we segment them.</p>
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
            <strong>Pro tip:</strong> Always pull the VMRC permit history on the property before writing an offer — see mrc.virginia.gov. Unpermitted docks are a closing-table problem we see at least once a quarter.
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
              <p style={{ marginBottom: 20 }}>Barry Jenkins leads Legacy Home Team and is ranked #9 nationally among all U.S. real estate teams by Real Trends, with roughly 20 years of experience and thousands of Hampton Roads homes sold. Our team has closed waterfront transactions across every Chesapeake submarket — Northwest River, Deep Creek, the lake communities, and Bay-access — which means we have first-hand reps on the permit, flood, and bulkhead landmines.</p>
              <p style={{ marginBottom: 20 }}>As Head Realtor in Residence at Ylopo and CMO at Better Homes and Gardens NAGR, Barry built the lead and marketing infrastructure most agents only read about. For waterfront sellers that translates into targeted buyer reach across Virginia Beach, Norfolk, and out-of-market relocation pipelines — typically the buyers actually willing to pay the waterfront premium.</p>
              <p>We run three teams across Hampton Roads and Chesapeake is core territory, not a side market. That local density is why we can comp a Northwest River dock home against the right three properties instead of the wrong thirty.</p>
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
            <h2 style={{ marginBottom: 8 }}>Questions to Ask Before Choosing a Chesapeake Waterfront Realtor</h2>
            <p style={{ marginBottom: 40 }}>A competent agent should have specific, data-backed answers to all of these. Vague responses are not answers.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
        'How many waterfront transactions have you personally closed in Chesapeake in the last 24 months?',
        'Can you walk me through a VMRC dock permit application from start to finish?',
        'What is the flood zone on this property and what will the annual premium actually be?',
        'How do you evaluate bulkhead condition and remaining useful life?',
        'What is the HOA\'s policy on motorized watercraft and how does that affect resale?',
        'How do you comp Northwest River versus Deep Creek versus lake community properties?',
        'What out-of-area buyer pools do you market waterfront listings to?',
        'Who handles the elevation certificate and survey coordination before closing?',
              ].map((q, i) => (
                <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>{q}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)', marginTop: 24 }}>
              <strong>Pro tip:</strong> If an agent can't answer the first three questions cold, they are learning on your transaction. Waterfront is not the place for on-the-job training.
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
            Ready to Buy or Sell Chesapeake Waterfront the Right Way?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Whether you are eyeing Northwest River frontage, listing a Deep Creek property, or navigating lake community HOA rules, our team brings the permit, flood, and pricing expertise the transaction actually requires. Let's talk through your specific property and submarket before you make a move.
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
