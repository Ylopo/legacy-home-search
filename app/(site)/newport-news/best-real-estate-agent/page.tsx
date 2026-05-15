import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Real Estate Agent Newport News (2026) | Legacy Home Team',
  description: 'Newport News\' best real estate agent. Barry Jenkins, ranked #9 nationally (Real Trends), has sold thousands of Hampton Roads homes. Call Legacy Home Team today.',
  alternates: { canonical: 'https://legacyhometeamlpt.com/newport-news/best-real-estate-agent' },
  openGraph: {
    title: 'Best Real Estate Agent Newport News (2026) | Legacy Home Team',
    description: 'Work with Newport News\' top-ranked real estate team. Barry Jenkins, #9 nationally, leads Legacy Home Team across Hampton Roads.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/newport-news/best-real-estate-agent',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Real Estate Agent Newport News (2026) | Legacy Home Team',
    description: 'Work with Newport News\' top-ranked real estate team. Barry Jenkins, #9 nationally, leads Legacy Home Team across Hampton Roads.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description: 'Legacy Home Team, led by Barry Jenkins (ranked #9 nationally by Real Trends), is a Newport News and Hampton Roads real estate team with ~20 years of experience and thousands of homes sold.',
  url: 'https://legacyhometeamlpt.com',
  telephone: '(757) 816-4037',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '5224 Indian River Rd',
    addressLocality: 'Newport News',
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
      name: 'Who is the best real estate agent in Newport News?',
      acceptedAnswer: { '@type': 'Answer', text: 'Barry Jenkins and Legacy Home Team are consistently ranked among the top real estate teams in Newport News and Hampton Roads. Barry is ranked #9 nationally by Real Trends and has sold thousands of homes across the region over ~20 years.' },
    },
    {
      '@type': 'Question',
      name: 'What is the median home price in Newport News in 2025?',
      acceptedAnswer: { '@type': 'Answer', text: 'Newport News median home prices in 2025 run roughly $250K to $370K, but the range is wide — Southeast district homes can start near $140K while Kiln Creek and Denbigh routinely exceed $400K. The sub-market matters more than the citywide average.' },
    },
    {
      '@type': 'Question',
      name: 'Is Newport News a good place to buy a home?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes, particularly if you work at Huntington Ingalls Industries, Joint Base Langley-Eustis (jble.af.mil), or commute within Hampton Roads. Denbigh offers strong schools and appreciation, while the Southeast district offers entry pricing and rental yield for investors.' },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to sell a home in Newport News?',
      acceptedAnswer: { '@type': 'Answer', text: 'Well-priced homes in Denbigh and Kiln Creek often go under contract in under 30 days, while Southeast and historic Hilton Village properties can take longer depending on condition. Our team prices with sub-market-specific data, not citywide averages.' },
    },
    {
      '@type': 'Question',
      name: 'Do you work with military buyers relocating to Joint Base Langley-Eustis?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes — military relocation is a core part of our Newport News and Hampton business. We handle VA loans, PCS timelines, and virtual tours for buyers who can\'t visit before orders take effect.' },
    },
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Newport News', item: 'https://legacyhometeamlpt.com/newport-news' },
    { '@type': 'ListItem', position: 3, name: 'Best Real Estate Agent in Newport News', item: 'https://legacyhometeamlpt.com/newport-news/best-real-estate-agent' },
  ],
}

const criteriaRows = [
  { criteria: 'Sub-market pricing fluency', why: 'Denbigh and Southeast can vary $20K–$40K on the same floor plan; an agent who comps citywide will mislead you.' },
  { criteria: 'Military relocation experience', why: 'Joint Base Langley-Eustis PCS cycles drive sharp demand windows — timing the list date matters.' },
  { criteria: 'Shipyard buyer knowledge', why: 'Huntington Ingalls hiring waves create steady buyer flow near the Southeast district and investor demand.' },
  { criteria: 'School zone precision', why: 'Denbigh schools command a premium and zone lines move buyer pools quickly.' },
  { criteria: 'HOA and historic district fluency', why: 'Kiln Creek HOA rules and Hilton Village historic guidelines change what buyers can do post-close.' },
]

const submarketsRows = [
  { area: 'Denbigh (North)', range: '$320K–$450K', note: 'Top-rated schools and family demand push prices well above the city median.' },
  { area: 'Kiln Creek', range: '$340K–$500K', note: 'Golf community with active HOA — buyers expect amenities priced in.' },
  { area: 'Hilton Village', range: '$280K–$420K', note: 'America\'s first planned community (1918) with historic district overlays affecting renovations.' },
  { area: 'Midtown / Oyster Point', range: '$260K–$380K', note: 'Commercial corridor convenience attracts professionals and Langley personnel.' },
  { area: 'Southeast (Downtown)', range: '$140K–$240K', note: 'Shipyard proximity drives investor demand and the strongest rental yields in the city.' },
  { area: 'Lee Hall / Fort Eustis area', range: '$240K–$340K', note: 'Heavy military rotation; pricing tracks PCS cycles from Joint Base Langley-Eustis.' },
]

const teamCompareRows = [
  { factor: 'Availability', solo: 'Limited to one schedule', legacy: 'Multiple agents — always someone reachable' },
  { factor: 'Annual production', solo: 'Typical: 20–40 transactions/year', legacy: 'Thousands of homes sold — scale that builds pattern recognition' },
  { factor: 'Marketing reach', solo: 'Standard MLS listing', legacy: 'Ylopo-powered digital ads, social retargeting, and MLS' },
  { factor: 'Negotiation approach', solo: 'One perspective', legacy: 'Team-reviewed, market-tested strategy' },
  { factor: 'Military PCS experience', solo: 'Varies', legacy: 'Established process — tight timelines handled routinely' },
]

const faqs = [
  { q: 'Who is the best real estate agent in Newport News?', a: 'Barry Jenkins and Legacy Home Team are consistently ranked among the top real estate teams in Newport News and Hampton Roads. Barry is ranked #9 nationally by Real Trends and has sold thousands of homes across the region over ~20 years.' },
  { q: 'What is the median home price in Newport News in 2025?', a: 'Newport News median home prices in 2025 run roughly $250K to $370K, but the range is wide — Southeast district homes can start near $140K while Kiln Creek and Denbigh routinely exceed $400K. The sub-market matters more than the citywide average.' },
  { q: 'Is Newport News a good place to buy a home?', a: 'Yes, particularly if you work at Huntington Ingalls Industries, Joint Base Langley-Eustis (jble.af.mil), or commute within Hampton Roads. Denbigh offers strong schools and appreciation, while the Southeast district offers entry pricing and rental yield for investors.' },
  { q: 'How long does it take to sell a home in Newport News?', a: 'Well-priced homes in Denbigh and Kiln Creek often go under contract in under 30 days, while Southeast and historic Hilton Village properties can take longer depending on condition. Our team prices with sub-market-specific data, not citywide averages.' },
  { q: 'Do you work with military buyers relocating to Joint Base Langley-Eustis?', a: 'Yes — military relocation is a core part of our Newport News and Hampton business. We handle VA loans, PCS timelines, and virtual tours for buyers who can\'t visit before orders take effect.' },
]

export default function BestRealEstateAgentNewportNews() {
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
          <Link href="/newport-news" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Newport News</Link>
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
              Newport News · Hampton Roads
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              Best Real Estate Agent in Newport News
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Newport News has one of the steepest price gradients in Hampton Roads — a Denbigh rancher can list $20K–$40K above an identical home in the Southeast district. Our team knows where the value sits, how shipyard and Langley schedules move demand, and how to price or negotiate accordingly. That local fluency is what separates a transaction from a result.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
                Schedule a Free Consultation
              </Link>
              <Link href="/newport-news" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                Explore Newport News Homes →
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
            <span className="section-label">Agent Selection Guide</span>
            <h2>What to Look For in a Newport News Real Estate Agent</h2>
            <p>Newport News isn't a single market — it's at least four distinct sub-markets stacked north to south. The agent you hire needs to prove they understand the spread before they ever pull comps.</p>
          </div>
          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>What to Look For</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Why It Matters in Newport News</th>
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
            <strong>Pro tip:</strong> Ask any agent to price the same 1,800 sq ft ranch in Denbigh vs. the Southeast district. If they can't answer in a sentence, keep interviewing.
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <h2>Why Newport News Demands a Specialist, Not a Generalist</h2>
            <p>Newport News median pricing in 2025 sits between $250K and $370K, but that average hides the real story. Here's how the sub-markets actually break down.</p>
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
            <strong>Pro tip:</strong> If you're buying for shipyard or base proximity, weigh commute against resale — Southeast homes cash flow better, but Denbigh appreciates more reliably. We model both scenarios before you write an offer.
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
              <p style={{ marginBottom: 20 }}>Barry Jenkins leads Legacy Home Team and is ranked #9 nationally among all U.S. real estate teams by Real Trends. Over ~20 years he's sold thousands of homes across Hampton Roads — including Newport News, Hampton, Virginia Beach, Norfolk, Chesapeake, and Suffolk — and runs three teams covering the full region.</p>
              <p style={{ marginBottom: 20 }}>Barry also serves as Head Realtor in Residence at Ylopo and CMO at Better Homes and Gardens NAGR, which means our team uses AI-driven buyer-matching and listing exposure tools most local agents don't have access to. For sellers, that translates to more qualified showings in less time; for buyers, it means we see off-market and pre-list inventory first.</p>
              <p>We've closed deals in every Newport News sub-market from Southeast investor flips to Kiln Creek golf homes. That depth is why Hampton Roads families, military relocators, and Huntington Ingalls professionals work with us instead of an out-of-area referral.</p>
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
            <h2 style={{ marginBottom: 8 }}>Questions to Ask Before Choosing a Newport News Real Estate Agent</h2>
            <p style={{ marginBottom: 40 }}>A competent agent should have specific, data-backed answers to all of these. Vague responses are not answers.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
        'How many homes have you personally closed in Newport News in the last 12 months?',
        'Can you explain the price difference between Denbigh and the Southeast district on a comparable home?',
        'What\'s your experience with PCS buyers and sellers from Joint Base Langley-Eustis?',
        'How do you handle Hilton Village historic district disclosures and restrictions?',
        'What\'s your strategy when a Huntington Ingalls hiring wave hits — do you adjust list timing?',
        'Do you have a marketing platform that reaches buyers outside Hampton Roads?',
        'How will you price my home given Kiln Creek HOA dues and amenity value?',
        'What\'s your average days on market vs. the Newport News city average?',
              ].map((q, i) => (
                <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>{q}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)', marginTop: 24 }}>
              <strong>Pro tip:</strong> Don't accept generic answers. A real Newport News specialist should name specific streets, school zones, and recent comps without hesitation.
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
            Legacy Home Team · Newport News
          </span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', margin: '16px 0 20px' }}>
            Hire the Newport News Team That Knows Every Sub-Market
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Whether you're buying near Joint Base Langley-Eustis, selling in Denbigh, or investing in the Southeast district, our team prices and negotiates with sub-market precision. Talk to Legacy Home Team and get a real strategy — not a generic CMA. Call or message us today to start.
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
