import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Listing Agent in Norfolk (2026) | Legacy Home Team',
  description: 'Norfolk\'s best listing agent: Barry Jenkins, ranked #9 nationally (Real Trends). Avg DOM 18–38 days. Sell for top dollar across Ghent, Wards Corner & more. Call today.',
  alternates: { canonical: 'https://legacyhometeamlpt.com/norfolk/best-listing-agent' },
  openGraph: {
    title: 'Best Listing Agent in Norfolk (2026) | Legacy Home Team',
    description: 'Norfolk\'s #9-ranked listing team. Expert pricing for Ghent, Wards Corner & Naval Station buyers. Sell smarter with Legacy Home Team.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/norfolk/best-listing-agent',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Listing Agent in Norfolk (2026) | Legacy Home Team',
    description: 'Norfolk\'s #9-ranked listing team. Expert pricing for Ghent, Wards Corner & Naval Station buyers. Sell smarter with Legacy Home Team.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description: 'Legacy Home Team, led by Barry Jenkins (ranked #9 nationally by Real Trends), is Norfolk\'s expert listing team specializing in pricing, marketing, and multi-buyer-pool strategy across Hampton Roads.',
  url: 'https://legacyhometeamlpt.com',
  telephone: '(757) 816-4037',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '5224 Indian River Rd',
    addressLocality: 'Norfolk',
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
      name: 'Who is the best listing agent in Norfolk?',
      acceptedAnswer: { '@type': 'Answer', text: 'Barry Jenkins and Legacy Home Team are ranked #9 nationally among all U.S. real estate teams by Real Trends, with thousands of Hampton Roads homes sold. We specialize in Norfolk\'s unique multi-buyer-pool dynamics across Ghent, Wards Corner, Ocean View, and beyond.' },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to sell a home in Norfolk?',
      acceptedAnswer: { '@type': 'Answer', text: 'Norfolk\'s average days on market in 2025 ran roughly 18–38 days depending on neighborhood and price band. Ghent and Larchmont listings often move faster with competing offers, while Ocean View timelines depend heavily on flood zone designation.' },
    },
    {
      '@type': 'Question',
      name: 'Does flood zone affect my Norfolk home\'s sale price?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes — properties in AE flood zones require flood insurance that materially changes a buyer\'s monthly payment, which shrinks the qualified buyer pool. We price and market AE-zone homes differently than X-zone homes to protect your net proceeds.' },
    },
    {
      '@type': 'Question',
      name: 'How do you market Norfolk homes to military buyers?',
      acceptedAnswer: { '@type': 'Answer', text: 'Through Ylopo\'s AI-driven targeting we reach active-duty families researching PCS moves to Naval Station Norfolk months before they arrive. Roughly 30% of Norfolk buyers cite the base as a primary factor, so this audience is non-negotiable.' },
    },
    {
      '@type': 'Question',
      name: 'What commission does Legacy Home Team charge in Norfolk?',
      acceptedAnswer: { '@type': 'Answer', text: 'Commission is negotiable and depends on the specific marketing package, price point, and services. We\'ll walk you through exactly what\'s included in a free listing consultation — no pressure, no obligation.' },
    },
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Norfolk', item: 'https://legacyhometeamlpt.com/norfolk' },
    { '@type': 'ListItem', position: 3, name: 'Best Listing Agent in Norfolk', item: 'https://legacyhometeamlpt.com/norfolk/best-listing-agent' },
  ],
}

const criteriaRows = [
  { criteria: 'Flood Zone Fluency', why: 'AE vs X zone designations directly change your buyer pool size and disclosed insurance costs — mispricing this kills deals mid-contract.' },
  { criteria: 'Military Buyer Reach', why: 'Roughly 30% of Norfolk buyers cite Naval Station proximity as a top factor; your agent needs VA loan expertise and PCS-timing marketing.' },
  { criteria: 'Sub-Market Pricing Data', why: 'Ghent, Wards Corner, Larchmont, and Ocean View trade on completely different comps — a citywide average is useless.' },
  { criteria: 'Digital Marketing Infrastructure', why: 'With DOM ranging 18–38 days, listings that don\'t hit every buyer pool in week one often sit into a price reduction.' },
  { criteria: 'Local Track Record', why: 'Norfolk buyers and their agents respond to listing agents they recognize — reputation moves offers faster than any flyer.' },
]

const submarketsRows = [
  { area: 'Ghent', range: '$425K–$750K', note: 'Historic urban professional demand; well-prepped listings routinely see multiple offers within the first weekend.' },
  { area: 'Wards Corner', range: '$180K–$310K', note: 'Investor-heavy pool alongside first-time buyers — condition and cash-flow math both matter here.' },
  { area: 'Larchmont / Edgewater', range: '$450K–$900K', note: 'ODU faculty and established professionals; waterfront and lot size drive premium pricing.' },
  { area: 'Ocean View', range: '$260K–$550K', note: 'Flood zone status (X vs AE) creates two distinct buyer conversations on nearly identical homes.' },
  { area: 'Downtown / Freemason', range: '$300K–$625K', note: 'Condo and townhome heavy; walkability and Naval Station commute drive urban buyers.' },
  { area: 'East Beach / Willoughby', range: '$500K–$1.2M', note: 'Coastal buyer pool with strong out-of-state and relocating military officer demand.' },
]

const teamCompareRows = [
  { factor: 'Availability', solo: 'Limited to one schedule', legacy: 'Multiple agents — always someone reachable' },
  { factor: 'Annual production', solo: 'Typical: 20–40 transactions/year', legacy: 'Thousands of homes sold — scale that builds pattern recognition' },
  { factor: 'Marketing reach', solo: 'Standard MLS listing', legacy: 'Ylopo-powered digital ads, social retargeting, and MLS' },
  { factor: 'Negotiation approach', solo: 'One perspective', legacy: 'Team-reviewed, market-tested strategy' },
  { factor: 'Military PCS experience', solo: 'Varies', legacy: 'Established process — tight timelines handled routinely' },
]

const faqs = [
  { q: 'Who is the best listing agent in Norfolk?', a: 'Barry Jenkins and Legacy Home Team are ranked #9 nationally among all U.S. real estate teams by Real Trends, with thousands of Hampton Roads homes sold. We specialize in Norfolk\'s unique multi-buyer-pool dynamics across Ghent, Wards Corner, Ocean View, and beyond.' },
  { q: 'How long does it take to sell a home in Norfolk?', a: 'Norfolk\'s average days on market in 2025 ran roughly 18–38 days depending on neighborhood and price band. Ghent and Larchmont listings often move faster with competing offers, while Ocean View timelines depend heavily on flood zone designation.' },
  { q: 'Does flood zone affect my Norfolk home\'s sale price?', a: 'Yes — properties in AE flood zones require flood insurance that materially changes a buyer\'s monthly payment, which shrinks the qualified buyer pool. We price and market AE-zone homes differently than X-zone homes to protect your net proceeds.' },
  { q: 'How do you market Norfolk homes to military buyers?', a: 'Through Ylopo\'s AI-driven targeting we reach active-duty families researching PCS moves to Naval Station Norfolk months before they arrive. Roughly 30% of Norfolk buyers cite the base as a primary factor, so this audience is non-negotiable.' },
  { q: 'What commission does Legacy Home Team charge in Norfolk?', a: 'Commission is negotiable and depends on the specific marketing package, price point, and services. We\'ll walk you through exactly what\'s included in a free listing consultation — no pressure, no obligation.' },
]

export default function BestListingAgentNorfolk() {
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
          <Link href="/norfolk" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Norfolk</Link>
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
              Norfolk · Hampton Roads
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              Best Listing Agent in Norfolk
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Norfolk isn't a one-buyer market. Between active-duty families relocating to Naval Station Norfolk, ODU faculty and grad buyers, and urban professionals priced out of Ghent, your listing needs to reach three very different pools at once — and our team is built to do exactly that.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
                Schedule a Free Consultation
              </Link>
              <Link href="/norfolk" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                Explore Norfolk Homes →
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
            <h2>What to Look For in a Norfolk Listing Agent</h2>
            <p>Not every agent understands how Norfolk's flood zones, military PCS cycles, and neighborhood pricing tiers move a listing. Here are the five criteria we tell every seller to vet before signing.</p>
          </div>
          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>What to Look For</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Why It Matters in Norfolk</th>
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
            <strong>Pro tip:</strong> Ask any agent to pull the last 12 months of their closed listings inside Norfolk city limits — not Hampton Roads broadly. If they can't, they're not the specialist your home needs.
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <h2>Why Norfolk Requires a Listing Specialist</h2>
            <p>Norfolk's neighborhoods don't behave like Virginia Beach or Chesapeake — they're older, denser, and priced by block. Here's how we break the city down when we build a listing strategy.</p>
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
            <strong>Pro tip:</strong> Pull your parcel's assessment directly from the City of Norfolk (norfolk.gov/1870/Real-Estate-Assessments) before listing — we cross-check assessed value against real-time comps to justify list price to appraisers.
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
              <p style={{ marginBottom: 20 }}>Barry Jenkins leads Legacy Home Team and is ranked #9 nationally among all U.S. real estate teams by Real Trends. Over nearly 20 years he's sold thousands of homes across Hampton Roads and now runs three teams spanning Norfolk, Virginia Beach, Chesapeake, Suffolk, Hampton, and Newport News — so we understand exactly how Norfolk buyers behave compared to the rest of the region.</p>
              <p style={{ marginBottom: 20 }}>Barry also serves as Head Realtor in Residence at Ylopo and CMO at Better Homes and Gardens Native American Group. That means your Norfolk listing gets marketed through AI-driven buyer targeting most local agents don't have access to — we can put your home in front of relocating military families, Ghent professionals, and investor buyers simultaneously, not sequentially.</p>
              <p>We've listed and sold across every Norfolk sub-market, from Ghent brownstones to Ocean View flood-zone properties. That volume gives us live pricing data no algorithm can replicate.</p>
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
            <h2 style={{ marginBottom: 8 }}>Questions to Ask Before Choosing a Norfolk Listing Agent</h2>
            <p style={{ marginBottom: 40 }}>A competent agent should have specific, data-backed answers to all of these. Vague responses are not answers.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
        'How many homes have you sold inside Norfolk city limits in the past 12 months?',
        'How do you price a home in an AE flood zone versus an X zone?',
        'What\'s your specific marketing plan to reach relocating Naval Station Norfolk buyers?',
        'Can you show me your average list-to-sale price ratio in my ZIP code?',
        'What\'s your average days on market for Norfolk listings compared to the city average of 18–38?',
        'How do you handle multiple-offer situations in Ghent or Larchmont?',
        'What\'s your strategy if the home doesn\'t get an offer in the first 14 days?',
        'Who exactly on your team will be handling my listing day-to-day?',
              ].map((q, i) => (
                <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>{q}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)', marginTop: 24 }}>
              <strong>Pro tip:</strong> If an agent can't answer question 1 or 4 with specific numbers on the spot, they're guessing on your biggest financial transaction. Our team walks in with the data printed.
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
            Legacy Home Team · Norfolk
          </span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', margin: '16px 0 20px' }}>
            List Your Norfolk Home With the #9 Team in America
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Whether you're in Ghent, Ocean View, Larchmont, or Wards Corner, our team knows how to price, position, and sell your home to the right buyer pool. Schedule a free listing consultation with Legacy Home Team and get a data-backed strategy before you go to market.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
              Schedule a Free Consultation
            </Link>
            <Link href="/norfolk" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
              Explore Norfolk Homes →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
