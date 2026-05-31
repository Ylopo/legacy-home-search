import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Newport News Waterfront Realtor (2026) | Legacy Home Team',
  description: 'Looking for the best waterfront realtor in Newport News? Barry Jenkins (#9 nationally, Real Trends) and Legacy Home Team know James River deep water. Call today.',
  alternates: { canonical: 'https://legacyhometeamlpt.com/newport-news/best-waterfront-realtor' },
  openGraph: {
    title: 'Best Newport News Waterfront Realtor (2026) | Legacy Home Team',
    description: 'James River, Port Warwick, Warwick River, Denbigh creeks — Legacy Home Team sells Newport News waterfront with expert precision.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/newport-news/best-waterfront-realtor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Newport News Waterfront Realtor (2026) | Legacy Home Team',
    description: 'James River, Port Warwick, Warwick River, Denbigh creeks — Legacy Home Team sells Newport News waterfront with expert precision.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description: 'Legacy Home Team, led by Barry Jenkins (#9 nationally per Real Trends), specializes in Newport News waterfront real estate across the James River, Warwick River, and Denbigh creek system.',
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
      name: 'Who is the best waterfront realtor in Newport News?',
      acceptedAnswer: { '@type': 'Answer', text: 'Barry Jenkins and Legacy Home Team are widely recognized as the leading waterfront specialists in Newport News and across Hampton Roads. Barry\'s team is ranked #9 nationally by Real Trends, with thousands of homes sold over ~20 years — including extensive James River, Port Warwick, and Warwick River experience.' },
    },
    {
      '@type': 'Question',
      name: 'What is the price premium for James River waterfront in Newport News?',
      acceptedAnswer: { '@type': 'Answer', text: 'James River deep-water frontage typically carries a $75K–$200K premium over comparable inland homes, depending on view corridor, lot width, dock condition, and bulkhead status. We price each property against recent waterfront comps, not generic neighborhood averages.' },
    },
    {
      '@type': 'Question',
      name: 'How long does a VMRC dock permit take in Newport News?',
      acceptedAnswer: { '@type': 'Answer', text: 'Virginia Marine Resources Commission dock and pier permits typically run 3–6 months from submission to approval. You can review the process directly at https://mrc.virginia.gov — and we always check whether an existing permit transfers with the sale before you commit.' },
    },
    {
      '@type': 'Question',
      name: 'Is the Warwick River in Hilton Village in a flood zone?',
      acceptedAnswer: { '@type': 'Answer', text: 'Flood zones along the Warwick River and Hilton Village vary significantly block by block, and elevation certificates can shift insurance premiums by thousands per year. We pull elevation and FEMA zone data before negotiation, not after.' },
    },
    {
      '@type': 'Question',
      name: 'Do you also handle waterfront in Virginia Beach, Norfolk, and Chesapeake?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. Legacy Home Team runs three teams across Hampton Roads, covering waterfront from Newport News and Hampton through Norfolk, Virginia Beach, Chesapeake, and Suffolk. That regional footprint is how we source the right buyer for high-end James River listings.' },
    },
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Newport News', item: 'https://legacyhometeamlpt.com/newport-news' },
    { '@type': 'ListItem', position: 3, name: 'Best Waterfront Realtor in Newport News', item: 'https://legacyhometeamlpt.com/newport-news/best-waterfront-realtor' },
  ],
}

const criteriaRows = [
  { criteria: 'James River Deep-Water Experience', why: 'Deep-water frontage commands a $75K–$200K premium here; an agent who has not closed multiple James River deals will mis-price the dock and bulkhead value.' },
  { criteria: 'VMRC Dock Permit Knowledge', why: 'Virginia Marine Resources Commission permits run 3–6 months; the right realtor knows what is transferable and what triggers a fresh application.' },
  { criteria: 'Flood Zone & Insurance Fluency', why: 'Warwick River and Hilton Village flood zones vary block by block — premiums can swing thousands annually based on elevation certificates.' },
  { criteria: 'Bulkhead & Erosion History', why: 'James River tidal action and Denbigh creek shoreline movement are real cost centers; we pull permit and repair history before you write an offer.' },
  { criteria: 'Local Hampton Roads Network', why: 'The strongest Newport News waterfront buyers often come from Virginia Beach, Norfolk, and Chesapeake — you need an agent with reach across all of Hampton Roads.' },
]

const submarketsRows = [
  { area: 'James River Frontage (Riverside / Huntington Heights)', range: '$650K–$1.8M+', note: 'Deep-water, panoramic views, and the strongest waterfront premium in the city.' },
  { area: 'Port Warwick Waterway', range: '$450K–$900K', note: 'Urban mixed-use waterway lifestyle with newer construction and walkable amenities.' },
  { area: 'Hilton Village (Warwick River)', range: '$425K–$850K', note: 'Historic 1918 homes with river access — charm-heavy but flood zones vary lot by lot.' },
  { area: 'Denbigh Creek System', range: '$325K–$575K', note: 'Suburban creekfront with private docks, more affordable entry to waterfront living.' },
  { area: 'Menchville / Deep Creek', range: '$375K–$700K', note: 'Working waterfront heritage with deeper protected moorage near the marina.' },
  { area: 'Lee Hall / Skiffes Creek', range: '$300K–$525K', note: 'Quiet upper James tributaries — strong value play for buyers priced out of Riverside.' },
]

const teamCompareRows = [
  { factor: 'Availability', solo: 'Limited to one schedule', legacy: 'Multiple agents — always someone reachable' },
  { factor: 'Annual production', solo: 'Typical: 20–40 transactions/year', legacy: 'Thousands of homes sold — scale that builds pattern recognition' },
  { factor: 'Marketing reach', solo: 'Standard MLS listing', legacy: 'Ylopo-powered digital ads, social retargeting, and MLS' },
  { factor: 'Negotiation approach', solo: 'One perspective', legacy: 'Team-reviewed, market-tested strategy' },
  { factor: 'Military PCS experience', solo: 'Varies', legacy: 'Established process — tight timelines handled routinely' },
]

const faqs = [
  { q: 'Who is the best waterfront realtor in Newport News?', a: 'Barry Jenkins and Legacy Home Team are widely recognized as the leading waterfront specialists in Newport News and across Hampton Roads. Barry\'s team is ranked #9 nationally by Real Trends, with thousands of homes sold over ~20 years — including extensive James River, Port Warwick, and Warwick River experience.' },
  { q: 'What is the price premium for James River waterfront in Newport News?', a: 'James River deep-water frontage typically carries a $75K–$200K premium over comparable inland homes, depending on view corridor, lot width, dock condition, and bulkhead status. We price each property against recent waterfront comps, not generic neighborhood averages.' },
  { q: 'How long does a VMRC dock permit take in Newport News?', a: 'Virginia Marine Resources Commission dock and pier permits typically run 3–6 months from submission to approval. You can review the process directly at https://mrc.virginia.gov — and we always check whether an existing permit transfers with the sale before you commit.' },
  { q: 'Is the Warwick River in Hilton Village in a flood zone?', a: 'Flood zones along the Warwick River and Hilton Village vary significantly block by block, and elevation certificates can shift insurance premiums by thousands per year. We pull elevation and FEMA zone data before negotiation, not after.' },
  { q: 'Do you also handle waterfront in Virginia Beach, Norfolk, and Chesapeake?', a: 'Yes. Legacy Home Team runs three teams across Hampton Roads, covering waterfront from Newport News and Hampton through Norfolk, Virginia Beach, Chesapeake, and Suffolk. That regional footprint is how we source the right buyer for high-end James River listings.' },
]

export default function BestWaterfrontRealtorNewportNews() {
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
          <span style={{ color: 'var(--text-secondary)' }}>Best Waterfront Realtor</span>
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
              Best Waterfront Realtor in Newport News
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Newport News waterfront isn't one market — it's the deep-water James River, Port Warwick's urban waterway, historic Hilton Village along the Warwick River, and the suburban Denbigh creeks. Each carries different premiums, permitting realities, and flood exposure. Our team has spent two decades navigating those differences for buyers and sellers across Hampton Roads.
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
            <span className="section-label">Waterfront Buyer Guide</span>
            <h2>What to Look for in a Waterfront Realtor in Newport News</h2>
            <p>Waterfront in Newport News rewards specialists and punishes generalists. Here is the checklist we tell every client to apply before signing with any agent.</p>
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
            <strong>Pro tip:</strong> Ask any agent to show you their last three waterfront closings in Newport News specifically — not Hampton, not Yorktown. If they cannot, keep looking.
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <h2>Why Newport News Waterfront Requires a Specialist</h2>
            <p>Each Newport News waterfront submarket has its own buyer profile, price ceiling, and risk picture. Here is how we segment them when pricing or shopping.</p>
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
            <strong>Pro tip:</strong> If you are buying on the Warwick or in Denbigh, get the elevation certificate before you negotiate price — not after inspections. We pull these proactively.
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
              <p style={{ marginBottom: 20 }}>Barry Jenkins leads Legacy Home Team and is ranked #9 nationally among all U.S. real estate teams by Real Trends. With roughly 20 years in Hampton Roads and thousands of homes sold, Barry and our team have closed waterfront across every James River and tributary submarket in Newport News.</p>
              <p style={{ marginBottom: 20 }}>As Head Realtor in Residence at Ylopo and CMO at Better Homes and Gardens NAGR, Barry runs the marketing technology that puts your waterfront listing in front of qualified out-of-market buyers — the Northern Virginia, DC, and relocating military families who drive top-of-market James River pricing.</p>
              <p>We run three teams across Hampton Roads, which means our Newport News waterfront sellers tap directly into buyer pipelines from Virginia Beach, Norfolk, Chesapeake, Suffolk, and Hampton. That cross-market reach is how James River homes hit their premium ceiling.</p>
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
            <h2 style={{ marginBottom: 8 }}>Questions to Ask Before Choosing a Waterfront Realtor in Newport News</h2>
            <p style={{ marginBottom: 40 }}>A competent agent should have specific, data-backed answers to all of these. Vague responses are not answers.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
        'How many James River waterfront homes have you personally closed in the last 24 months?',
        'Do you know the difference in permitting between a Warwick River dock and a James River pier?',
        'Can you pull VMRC permit history and explain what transfers with the sale?',
        'What is your process for verifying flood zone and elevation before we make an offer?',
        'How do you market a waterfront listing to out-of-area buyers from Northern Virginia and DC?',
        'What is your network like in the rest of Hampton Roads — Virginia Beach, Norfolk, Chesapeake?',
        'Have you handled bulkhead, erosion, or shoreline repair negotiations during inspections?',
        'What waterfront-specific contingencies do you write into purchase agreements?',
              ].map((q, i) => (
                <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>{q}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)', marginTop: 24 }}>
              <strong>Pro tip:</strong> The right answers are specific, not general. If an agent talks about waterfront in vague terms, they have not closed enough of it to protect you.
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
            Ready to Buy or Sell Newport News Waterfront? Let's Talk.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Whether you are pricing a James River estate, navigating Warwick River flood zones, or hunting for a Denbigh creek dock, our team has closed it before. Reach out to Barry Jenkins and Legacy Home Team for a direct, no-fluff conversation about your Newport News waterfront move.
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
