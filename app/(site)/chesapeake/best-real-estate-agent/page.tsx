import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Real Estate Agent in Chesapeake (2026) | Legacy Home Team',
  description: 'Looking for the best real estate agent in Chesapeake? Barry Jenkins leads the #9 U.S. team (Real Trends), covering Great Bridge to Deep Creek. Call today.',
  alternates: { canonical: 'https://legacyhometeamlpt.com/chesapeake/best-real-estate-agent' },
  openGraph: {
    title: 'Best Real Estate Agent in Chesapeake (2026) | Legacy Home Team',
    description: 'Chesapeake\'s 353 sq miles has four different markets. Barry Jenkins and Legacy Home Team read all of them.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/chesapeake/best-real-estate-agent',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Real Estate Agent in Chesapeake (2026) | Legacy Home Team',
    description: 'Chesapeake\'s 353 sq miles has four different markets. Barry Jenkins and Legacy Home Team read all of them.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description: 'Legacy Home Team, led by Barry Jenkins, is a top-ranked Hampton Roads real estate team (#9 nationally per Real Trends) serving Chesapeake, Virginia Beach, Norfolk, and Suffolk.',
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
      acceptedAnswer: { '@type': 'Answer', text: 'Barry Jenkins and Legacy Home Team are consistently ranked among the top real estate teams in Chesapeake and Hampton Roads. Legacy Home Team is ranked #9 nationally among all U.S. real estate teams by Real Trends, with nearly 20 years of local experience and thousands of homes sold across Chesapeake, Virginia Beach, Norfolk, and Suffolk.' },
    },
    {
      '@type': 'Question',
      name: 'What is the median home price in Chesapeake in 2025?',
      acceptedAnswer: { '@type': 'Answer', text: 'Chesapeake\'s median home price in 2025 runs roughly $360K–$480K depending on sub-market. Great Bridge and Hickory trend higher, while Deep Creek and parts of South Norfolk sit at the lower end of the range.' },
    },
    {
      '@type': 'Question',
      name: 'Which Chesapeake neighborhood has the best schools?',
      acceptedAnswer: { '@type': 'Answer', text: 'Great Bridge is consistently rated the top school zone in Chesapeake and drives the strongest family demand in the city. That school premium is a major factor in why Great Bridge holds its price-per-square-foot better than most Hampton Roads sub-markets.' },
    },
    {
      '@type': 'Question',
      name: 'Is Chesapeake a good place to buy a home in 2026?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes — Chesapeake offers strong value relative to Virginia Beach and Norfolk, with more space, competitive schools, and steady appreciation. The key is choosing the right sub-market for your budget and lifestyle, which is exactly where a specialist agent matters.' },
    },
    {
      '@type': 'Question',
      name: 'How is Chesapeake different from Virginia Beach or Norfolk for buyers?',
      acceptedAnswer: { '@type': 'Answer', text: 'Chesapeake is Virginia\'s second-largest city by land area (353 sq miles) and offers more land, newer construction, and lower density than Virginia Beach or Norfolk. Buyers typically get more square footage and yard for the same price point, especially in Hickory and Western Branch.' },
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
  { criteria: 'Sub-market fluency', why: 'An agent who works mostly in Virginia Beach oceanfront won\'t read Hickory land value or Great Bridge school premiums correctly.' },
  { criteria: 'Recent Chesapeake transactions', why: 'With prices moving in the $360K–$480K median range in 2025, comps older than 90 days can mislead pricing by 5–8%.' },
  { criteria: 'Military and relocation experience', why: 'Western Branch and much of Chesapeake serve Norfolk-based military families — VA loan fluency and PCS timing matter.' },
  { criteria: 'New construction knowledge', why: 'Hickory has active builder inventory, and buyers need an agent who negotiates incentives, not just base price.' },
  { criteria: 'Marketing reach beyond MLS', why: 'Chesapeake buyers come from Norfolk, Suffolk, and out-of-state — your agent\'s digital reach directly affects your sale price.' },
]

const submarketsRows = [
  { area: 'Great Bridge', range: '$420K–$650K', note: 'Top-rated schools drive family demand and support the city\'s strongest price-per-square-foot.' },
  { area: 'Hickory', range: '$450K–$750K+', note: 'Rural feel, larger lots, and active new construction — buyers here want acreage, not walkability.' },
  { area: 'Western Branch', range: '$320K–$475K', note: 'Norfolk commuter belt with strong military demand; VA loan offers move fast here.' },
  { area: 'Deep Creek', range: '$260K–$380K', note: 'Industrial waterfront and working-class stability — steady turnover and reliable rental yield.' },
  { area: 'Greenbrier', range: '$350K–$525K', note: 'Central Chesapeake with retail and commuter access to Norfolk and Virginia Beach.' },
  { area: 'South Norfolk', range: '$240K–$360K', note: 'Historic pockets and investor-friendly inventory bordering Norfolk city limits.' },
]

const teamCompareRows = [
  { factor: 'Availability', solo: 'Limited to one schedule', legacy: 'Multiple agents — always someone reachable' },
  { factor: 'Annual production', solo: 'Typical: 20–40 transactions/year', legacy: 'Thousands of homes sold — scale that builds pattern recognition' },
  { factor: 'Marketing reach', solo: 'Standard MLS listing', legacy: 'Ylopo-powered digital ads, social retargeting, and MLS' },
  { factor: 'Negotiation approach', solo: 'One perspective', legacy: 'Team-reviewed, market-tested strategy' },
  { factor: 'Military PCS experience', solo: 'Varies', legacy: 'Established process — tight timelines handled routinely' },
]

const faqs = [
  { q: 'Who is the best real estate agent in Chesapeake?', a: 'Barry Jenkins and Legacy Home Team are consistently ranked among the top real estate teams in Chesapeake and Hampton Roads. Legacy Home Team is ranked #9 nationally among all U.S. real estate teams by Real Trends, with nearly 20 years of local experience and thousands of homes sold across Chesapeake, Virginia Beach, Norfolk, and Suffolk.' },
  { q: 'What is the median home price in Chesapeake in 2025?', a: 'Chesapeake\'s median home price in 2025 runs roughly $360K–$480K depending on sub-market. Great Bridge and Hickory trend higher, while Deep Creek and parts of South Norfolk sit at the lower end of the range.' },
  { q: 'Which Chesapeake neighborhood has the best schools?', a: 'Great Bridge is consistently rated the top school zone in Chesapeake and drives the strongest family demand in the city. That school premium is a major factor in why Great Bridge holds its price-per-square-foot better than most Hampton Roads sub-markets.' },
  { q: 'Is Chesapeake a good place to buy a home in 2026?', a: 'Yes — Chesapeake offers strong value relative to Virginia Beach and Norfolk, with more space, competitive schools, and steady appreciation. The key is choosing the right sub-market for your budget and lifestyle, which is exactly where a specialist agent matters.' },
  { q: 'How is Chesapeake different from Virginia Beach or Norfolk for buyers?', a: 'Chesapeake is Virginia\'s second-largest city by land area (353 sq miles) and offers more land, newer construction, and lower density than Virginia Beach or Norfolk. Buyers typically get more square footage and yard for the same price point, especially in Hickory and Western Branch.' },
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
              Chesapeake is Virginia's second-largest city by land area at 353 square miles, and Great Bridge, Hickory, Western Branch, and Deep Creek behave like four separate markets. The best agent in Chesapeake isn't the one with the biggest sign radius — it's the one who prices Great Bridge differently than Deep Creek and knows exactly why. That's the work we do every day.
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
            <span className="section-label">Agent Selection Guide</span>
            <h2>What to Look for in a Real Estate Agent in Chesapeake</h2>
            <p>Chesapeake rewards specificity. Here are the five criteria we tell every buyer and seller to weigh before signing with any agent in this city.</p>
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
            <strong>Pro tip:</strong> Ask any agent to name the last three homes they closed in your specific Chesapeake sub-market. If they can't, they're guessing on your price.
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <h2>Why Chesapeake Requires a Specialist, Not a Generalist</h2>
            <p>Chesapeake's four dominant sub-markets each have distinct buyers, price ceilings, and days-on-market patterns. Here's how we read them.</p>
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
            <strong>Pro tip:</strong> Never price a Hickory home off Deep Creek comps — or vice versa. We build separate comp sets for each sub-market, and the Hampton Roads Realtors Association (hrra.com) data confirms these markets diverge year over year.
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
              <p style={{ marginBottom: 20 }}>Barry Jenkins has spent nearly 20 years selling homes across Hampton Roads and leads Legacy Home Team, ranked #9 nationally among all U.S. real estate teams by Real Trends. Barry runs three teams across the region and has personally overseen thousands of transactions from Chesapeake to Newport News. When Chesapeake sellers ask who to trust with a $500K Great Bridge listing or a Hickory new-build negotiation, that track record is the answer.</p>
              <p style={{ marginBottom: 20 }}>Barry also serves as Head Realtor in Residence at Ylopo and CMO at Better Homes and Gardens NAGR, which means our Chesapeake listings get marketing technology most local teams simply can't access. We target buyers from Norfolk, Suffolk, and out-of-state relocation pipelines the same day your home hits the market — not a week later.</p>
              <p>Chesapeake is core territory for us, not a satellite market. We close homes in Great Bridge, Hickory, Western Branch, and Deep Creek every month, and our team knows which streets sell in seven days and which need staging first.</p>
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
            <h2 style={{ marginBottom: 8 }}>Questions to Ask Before Choosing a Real Estate Agent in Chesapeake</h2>
            <p style={{ marginBottom: 40 }}>A competent agent should have specific, data-backed answers to all of these. Vague responses are not answers.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
        'How many homes have you closed in my specific Chesapeake sub-market in the last 12 months?',
        'What\'s your average list-to-sale price ratio in Chesapeake?',
        'How do you price differently between Great Bridge, Hickory, Western Branch, and Deep Creek?',
        'What\'s your marketing plan for reaching Norfolk and out-of-state buyers?',
        'Do you have direct experience with VA loans and military PCS timelines?',
        'How do you handle new construction negotiations in Hickory?',
        'What\'s your average days-on-market compared to the Chesapeake city average?',
        'Who exactly on your team will be handling my transaction from contract to close?',
              ].map((q, i) => (
                <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>{q}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)', marginTop: 24 }}>
              <strong>Pro tip:</strong> If an agent can't answer questions 1 and 3 with specific numbers on the spot, they're not a Chesapeake specialist. Real experience produces real data.
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
            Work With Chesapeake's Top-Ranked Real Estate Team
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Whether you're buying in Great Bridge, selling in Hickory, or navigating a PCS move through Western Branch, Legacy Home Team knows exactly how your sub-market behaves. Reach out today and we'll build a plan specific to your street, your price point, and your timeline.
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
