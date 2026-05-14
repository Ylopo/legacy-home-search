import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Listing Agent in Newport News VA | Legacy Home Team',
  description:
    'Selling your home in Newport News? Legacy Home Team is ranked #9 in the U.S. with thousands of homes sold. Deep Newport News market knowledge, pricing accuracy, and cross-market buyer reach.',
  alternates: {
    canonical: 'https://legacyhometeamlpt.com/newport-news/best-listing-agent',
  },
  openGraph: {
    title: 'Best Listing Agent in Newport News VA | Legacy Home Team',
    description:
      'Ranked #9 nationally. Sell your Newport News home with Legacy Home Team — neighborhood-accurate pricing, military buyer network, and Ylopo-powered cross-market reach.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/newport-news/best-listing-agent',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Listing Agent in Newport News VA | Legacy Home Team',
    description:
      'Ranked #9 nationally. Legacy Home Team — neighborhood-accurate pricing and cross-market buyer reach for Newport News sellers.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description:
    'Legacy Home Team, led by Barry Jenkins, is ranked #9 nationally (Real Trends). Specializing in Newport News home sales — neighborhood-accurate pricing, military buyer networks, and Ylopo-powered digital advertising.',
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
    { '@type': 'City', name: 'Newport News' },
    { '@type': 'City', name: 'Hampton' },
    { '@type': 'City', name: 'Virginia Beach' },
    { '@type': 'City', name: 'Chesapeake' },
    { '@type': 'City', name: 'Norfolk' },
    { '@type': 'City', name: 'Suffolk' },
  ],
  knowsAbout: [
    'home selling', 'listing agent', 'Newport News real estate', 'Denbigh', 'Hilton Village',
    'military buyer network', 'Ylopo advertising', 'Hampton Roads market',
  ],
  employee: {
    '@type': 'Person',
    name: 'Barry Jenkins',
    jobTitle: 'Team Leader',
    description:
      'Barry Jenkins has nearly 20 years of Hampton Roads real estate experience and is ranked among the top team leaders in the United States. Serves Newport News sellers with cross-market buyer reach and neighborhood-accurate pricing.',
  },
}

const schemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is the best listing agent in Newport News VA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barry Jenkins of Legacy Home Team is ranked #9 nationally among all U.S. real estate teams (Real Trends), with thousands of homes sold across Hampton Roads including specific Newport News listing experience.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I sell my home fast in Newport News?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Correct pricing for your specific neighborhood (not citywide averages), professional photography, cross-market buyer reach across all Hampton Roads cities, and military buyer outreach through agent networks are the four most impactful factors for a fast Newport News sale.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is my Newport News home worth?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Value varies significantly by neighborhood — Denbigh and Hilton Village homes command premiums over comparable Southeast Newport News properties. A current CMA using neighborhood-specific closed sales (not citywide averages) gives the most accurate picture.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does a listing agent charge in Newport News?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Seller\'s side typically 2.5–3% of sale price. Full commission 5–6% split between listing and buyer\'s agents, negotiated since the 2024 NAR settlement. Rates vary by agent and transaction complexity.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Legacy Home Team list homes in Newport News?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — full Hampton Roads coverage including all Newport News neighborhoods from Denbigh and Hilton Village to Southeast Newport News.',
      },
    },
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Newport News', item: 'https://legacyhometeamlpt.com/newport-news' },
    { '@type': 'ListItem', position: 3, name: 'Best Listing Agent', item: 'https://legacyhometeamlpt.com/newport-news/best-listing-agent' },
  ],
}

const criteriaRows = [
  { criteria: 'Denbigh-to-Southeast pricing expertise', why: 'These are two different Newport News markets; conflating them costs sellers $20,000–$40,000 in pricing accuracy — citywide averages are not a substitute for neighborhood comps' },
  { criteria: 'Military buyer network', why: 'JBLE PCS buyers are often pre-approved and ready to move fast; a connected agent can match your listing to a buyer before MLS entry' },
  { criteria: 'Professional photography', why: 'Newport News competes with Virginia Beach and Hampton for buyers on the same budget; listing photos determine who schedules a showing' },
  { criteria: 'Digital and cross-market reach', why: 'Many Newport News buyers are relocating from out of the region; Zillow and targeted digital ads reach them before local word-of-mouth does' },
  { criteria: 'Closing timeline flexibility', why: 'Military buyers often need 30-day closes or leaseback arrangements; a listing agent who can structure this expands your buyer pool significantly' },
]

const sellerRows = [
  { neighborhood: 'Denbigh', dom: '22–35 days', note: 'Strong family demand; school zone premium worth emphasizing in listing; competing with some new construction' },
  { neighborhood: 'Oyster Point', dom: '20–32 days', note: 'Professional buyer profile; condition and updates matter most; proximity to employment is a selling point' },
  { neighborhood: 'Hilton Village', dom: '28–42 days', note: 'Historic buyers pay premium for original character; updated interiors with preserved exterior details perform best' },
  { neighborhood: 'Newmarket / Central', dom: '35–52 days', note: 'Military buyer pool; competitive pricing most important factor; VA loan-friendly presentation helps' },
  { neighborhood: 'Southeast NN', dom: '40–62 days', note: 'Cash investor activity; clean and priced at or below market closes fast; condition less critical than price' },
]

const teamCompareRows = [
  { factor: 'Pricing accuracy', solo: 'Citywide comps only', legacy: 'Neighborhood-specific — Denbigh vs. SE NN analysis' },
  { factor: 'Marketing reach', solo: 'Standard MLS listing', legacy: 'Ylopo-powered digital ads reaching buyers across all Hampton Roads cities' },
  { factor: 'Military buyer pipeline', solo: 'Depends on who shows up', legacy: 'Active JBLE buyer network — pre-approved buyers often waiting' },
  { factor: 'Photography and presentation', solo: 'Varies by budget', legacy: 'Professional photography standard on all listings' },
  { factor: 'Cross-market exposure', solo: 'Newport News buyers only', legacy: 'Virginia Beach, Hampton, Chesapeake buyers see your listing' },
]

const faqs = [
  {
    q: 'Who is the best listing agent in Newport News VA?',
    a: 'Barry Jenkins of Legacy Home Team is ranked #9 nationally (Real Trends), with thousands of homes sold across Hampton Roads. Legacy Home Team brings neighborhood-accurate pricing, military buyer networks, and cross-market digital reach to every Newport News listing.',
  },
  {
    q: 'How do I sell my home fast in Newport News?',
    a: 'Correct pricing for your specific neighborhood (not citywide averages), professional photography, cross-market buyer reach across all Hampton Roads cities, and military buyer outreach are the four most impactful factors for a fast Newport News sale.',
  },
  {
    q: 'What is my Newport News home worth?',
    a: 'Value varies significantly by neighborhood — Denbigh and Hilton Village homes command premiums over comparable Southeast Newport News properties. A current CMA using neighborhood-specific closed sales (not citywide averages) gives the most accurate picture.',
  },
  {
    q: 'How much does a listing agent charge in Newport News?',
    a: 'Seller\'s side typically 2.5–3% of sale price. Full commission 5–6% split between listing and buyer\'s agents, negotiated since the 2024 NAR settlement.',
  },
  {
    q: 'Does Legacy Home Team list homes in Newport News?',
    a: 'Yes — full Hampton Roads coverage including all Newport News neighborhoods from Denbigh and Hilton Village to Southeast Newport News.',
  },
]

export default function BestListingAgentNewportNews() {
  return (
    <>
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
          <Link href="/newport-news" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Newport News</Link>
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
              Newport News Sellers · Hampton Roads
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              Best Listing Agent in Newport News
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Selling a home in Newport News means understanding your buyer pool before your sign goes in the yard. Military PCS families, Huntington Ingalls employees, Christopher Newport University connections, and an active corps of investors are all searching Newport News — but they&apos;re searching different neighborhoods and at different price points. Your listing agent prices for the right buyer, not the averages.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
                Schedule a Free Consultation
              </Link>
              <Link href="/newport-news" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                Explore Newport News →
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

      {/* Section 1: What Makes a Great Listing Agent */}
      <section>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Seller&apos;s Guide</span>
            <h2>What Makes a Great Listing Agent for Newport News Sellers?</h2>
            <p>
              Newport News sellers compete across multiple buyer profiles. The right listing agent knows which levers to pull for your specific neighborhood and price point.
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
                    Why It Matters for Newport News Sellers
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
            <strong>For Newport News sellers competing with Denbigh new construction:</strong> Updated kitchens, fresh paint, and professional photos are more important than price alone. Buyers choosing between a resale and a new build need a compelling reason — condition and presentation create that reason.
          </div>
        </div>
      </section>

      {/* Section 2: Seller Market by Neighborhood */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Market Intelligence</span>
            <h2>Newport News Seller Market by Neighborhood</h2>
            <p>
              Days on market and buyer profiles differ significantly by area. Here&apos;s what sellers in each Newport News neighborhood should understand before listing.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 180 }}>Neighborhood</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 130 }}>Average DOM</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Key Selling Consideration</th>
                </tr>
              </thead>
              <tbody>
                {sellerRows.map((row, i) => (
                  <tr key={row.neighborhood} style={{ background: i % 2 === 0 ? 'var(--white)' : 'var(--off-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)', verticalAlign: 'top' }}>{row.neighborhood}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--accent)', fontWeight: 600, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{row.dom}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)' }}>
            <strong>Hilton Village sellers:</strong> Buyers who want Hilton Village often want it specifically — not just &quot;Newport News&quot; generically. If you price it correctly and present the historic character well, you have a motivated, qualified buyer pool that isn&apos;t price-shopping the whole city.
          </div>
        </div>
      </section>

      {/* Section 3: Barry Jenkins */}
      <section>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>

            <div>
              <span className="section-label">About Legacy Home Team</span>
              <h2 style={{ marginBottom: 20 }}>Barry Jenkins &amp; Legacy Home Team</h2>

              <p style={{ marginBottom: 20 }}>
                For Newport News sellers, Legacy Home Team&apos;s advantage is cross-market buyer reach. Operating 3 active teams across Hampton Roads means your Newport News listing reaches active buyers in{' '}
                <Link href="/virginia-beach" style={{ color: 'var(--accent)' }}>Virginia Beach</Link>,{' '}
                <Link href="/hampton" style={{ color: 'var(--accent)' }}>Hampton</Link>, and{' '}
                <Link href="/chesapeake" style={{ color: 'var(--accent)' }}>Chesapeake</Link>{' '}
                — buyers who may be considering Newport News as an affordable alternative to more expensive markets. A single-agent practice operating only in Newport News misses this pipeline entirely.
              </p>
              <p style={{ marginBottom: 20 }}>
                Ylopo-powered digital advertising means Legacy Home Team listings follow buyers across the internet — showing your property to people actively searching for homes across Hampton Roads, even before they&apos;ve narrowed their search to Newport News specifically. That proactive reach generates showings from buyers who wouldn&apos;t have found your listing through standard MLS channels.
              </p>
              <p>
                One illustration: a client came to us with an inherited home, no staging budget, an uncertain timeline, and complicated family dynamics. Nine qualified offers arrived within 24 hours of listing. Marketing infrastructure and deep local market knowledge combined to deliver that result — a standard outcome for a well-resourced listing operation.
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

      {/* Section 4: Questions */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <span className="section-label">Due Diligence</span>
            <h2 style={{ marginBottom: 8 }}>8 Questions Worth Asking Before You Choose a Newport News Listing Agent</h2>
            <p style={{ marginBottom: 40 }}>
              A good listing agent should have specific, data-backed answers to all of these. Vague claims about &quot;experience&quot; aren&apos;t answers.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                'How many Newport News listings did you sell in the last 12 months?',
                'What\'s your list-to-sale price ratio for Newport News homes?',
                'How do you market my Newport News listing to buyers searching in Virginia Beach and Hampton?',
                'Do you have pre-approved military buyers currently searching in Newport News?',
                'What\'s your average days on market for Newport News listings?',
                'How do you handle pricing strategy if we\'re near new construction competition in Denbigh?',
                'What does your pre-listing process look like?',
                'Can you show me current active competition my listing will face?',
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
              <strong>List-to-sale ratio matters:</strong> A listing agent who consistently sells at 98–101% of list price in Newport News isn&apos;t lucky — they&apos;re pricing accurately and marketing effectively. Ask for this number, by neighborhood, for the last 12 months. It&apos;s the single most verifiable performance metric a listing agent can provide.
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

      {/* CTA */}
      <section style={{ background: 'var(--accent)', borderTop: 'none' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Legacy Home Team · Newport News Sellers
          </span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', margin: '16px 0 20px' }}>
            Ready to Sell Your Newport News Home?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Legacy Home Team brings cross-market buyer reach, neighborhood-accurate pricing, and military buyer networks to every Newport News listing. Let&apos;s talk about what your home is worth and what a sale looks like in your neighborhood.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
              Schedule a Free Consultation
            </Link>
            <Link href="/newport-news" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
              Explore Newport News →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
