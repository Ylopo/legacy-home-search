import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Best Waterfront Realtor in Hampton VA | Legacy Home Team',
  description:
    'Buying or selling waterfront property in Hampton, VA? Legacy Home Team knows Hampton\'s waterfront from Buckroe Beach to Fort Monroe to Hampton Harbor. Ranked #9 nationally.',
  alternates: {
    canonical: 'https://legacyhometeamlpt.com/hampton/best-waterfront-realtor',
  },
  openGraph: {
    title: 'Best Waterfront Realtor in Hampton VA | Legacy Home Team',
    description:
      'Ranked #9 nationally. Flood zone analysis, Fort Monroe leasehold knowledge, dock/riparian verification — Legacy Home Team handles Hampton waterfront from end to end.',
    type: 'website',
    url: 'https://legacyhometeamlpt.com/hampton/best-waterfront-realtor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Waterfront Realtor in Hampton VA | Legacy Home Team',
    description:
      'Ranked #9 nationally. Fort Monroe, Buckroe Beach, Hampton Harbor — Legacy Home Team handles every Hampton waterfront property type.',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description:
    'Legacy Home Team, led by Barry Jenkins, is ranked #9 nationally (Real Trends) and specializes in Hampton waterfront real estate — including Fort Monroe leasehold properties, Buckroe Beach, Hampton Harbor, and Fox Hill river access homes.',
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
    { '@type': 'City', name: 'Hampton' },
    { '@type': 'City', name: 'Virginia Beach' },
    { '@type': 'City', name: 'Norfolk' },
    { '@type': 'City', name: 'Chesapeake' },
    { '@type': 'City', name: 'Newport News' },
    { '@type': 'City', name: 'Suffolk' },
  ],
  knowsAbout: [
    'waterfront real estate', 'flood zones', 'riparian rights', 'dock inspections',
    'Fort Monroe leasehold', 'Buckroe Beach', 'Hampton Harbor', 'Hampton Roads waterfront market',
  ],
  employee: {
    '@type': 'Person',
    name: 'Barry Jenkins',
    jobTitle: 'Team Leader',
    description:
      'Barry Jenkins has nearly 20 years of Hampton Roads real estate experience and is ranked among the top team leaders in the United States. Specializes in waterfront properties and military relocation.',
  },
}

const schemaFAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Who is the best waterfront realtor in Hampton VA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Barry Jenkins of Legacy Home Team is ranked #9 nationally (Real Trends) and has specific experience in Fort Monroe leasehold waterfront transactions, Buckroe Beach, Hampton Harbor, and Fox Hill river access properties.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the best waterfront neighborhoods in Hampton?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The best waterfront area in Hampton depends on your goal: Buckroe Beach for beach lifestyle, Hampton Harbor for harbor views and marina access, Fort Monroe for historic architecture with Chesapeake Bay views, Fox Hill for river access and affordability, and Salt Ponds for canal boating community access.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need special inspections for waterfront property in Hampton?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — at minimum: a standard home inspection, FEMA flood zone verification, bulkhead/seawall condition inspection, and for properties with docks, a dock structural assessment. For Fort Monroe properties, review of the Army Ground Lease is essential before making any offer.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Fort Monroe and how does buying waterfront property there work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fort Monroe is a former U.S. Army fort converted to civilian housing. The Army retains ownership of the land; buyers purchase only the structures through a Ground Lease. Properties offer exceptional Chesapeake Bay views and unique historic military architecture. The leasehold structure has specific rules about modifications, subletting, and resale that require an experienced agent to navigate.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Legacy Home Team handle waterfront transactions in Hampton?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — with specific experience in FEMA flood zone analysis, dock and riparian rights verification, and Fort Monroe leasehold transactions across all Hampton waterfront areas.',
      },
    },
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Hampton', item: 'https://legacyhometeamlpt.com/hampton' },
    { '@type': 'ListItem', position: 3, name: 'Best Waterfront Realtor', item: 'https://legacyhometeamlpt.com/hampton/best-waterfront-realtor' },
  ],
}

const criteriaRows = [
  { criteria: 'FEMA flood zone expertise', why: 'Nearly all waterfront Hampton properties are in designated flood zones; the difference between AE and VE zone designation can mean $3,000–$5,000+ per year in insurance' },
  { criteria: 'Dock and riparian rights verification', why: 'Not all Hampton waterfront has dock access; your agent must verify riparian rights, VMRC permits, water depth, and dock condition before you offer' },
  { criteria: 'Fort Monroe leasehold knowledge', why: 'Fort Monroe waterfront has a unique land ownership structure — Army owns the land, buyers purchase structures; most buyers\' agents have never encountered this' },
  { criteria: 'Tidal fluctuation awareness', why: 'Hampton River and some Chesapeake Bay-adjacent areas have tidal ranges that affect dock usability and flood frequency; not all waterfront is equal' },
  { criteria: 'View and access type premiums', why: 'Harbor views vs. bay views vs. river access vs. creek canal — each is priced and marketed differently; your agent must understand what each is worth' },
]

const waterfrontRows = [
  { area: 'Hampton Harbor', range: '$385K–$780K+', type: 'Protected harbor; marina slips; newer construction; Hampton Roads harbor views' },
  { area: 'Fort Monroe waterfront', range: '$305K–$720K', type: 'Chesapeake Bay and harbor views; leasehold property; historic architecture; some of the best water views in Hampton Roads' },
  { area: 'Buckroe Beach', range: '$255K–$510K', type: 'Chesapeake Bay beach frontage; rental potential; most affordable direct beach access in Hampton Roads' },
  { area: 'Fox Hill / Hampton River', range: '$285K–$500K', type: 'River access and Back River; dock-friendly; working waterfront character; more affordable than harbor properties' },
  { area: 'Wythe Waterfront', range: '$305K–$570K', type: 'Hampton Roads harbor views; established neighborhood; historic character; deepwater access in some areas' },
  { area: 'Salt Ponds / Colony area', range: '$225K–$415K', type: 'Canal and lagoon access; boating community; lower-cost entry to Hampton waterfront market' },
]

const teamCompareRows = [
  { factor: 'Flood zone analysis', solo: 'Varies — often done post-offer', legacy: 'Standard pre-offer process on all Hampton waterfront' },
  { factor: 'Fort Monroe experience', solo: 'Rare — most agents haven\'t closed one', legacy: 'Closed leasehold transactions; familiar with Army Ground Lease' },
  { factor: 'Dock/riparian verification', solo: 'Sometimes requested', legacy: 'Standard step before any Hampton waterfront offer' },
  { factor: 'Cross-market waterfront comparison', solo: 'Limited to one area', legacy: 'Compares Hampton vs. Norfolk vs. Virginia Beach waterfront accurately' },
  { factor: 'Marketing waterfront listings', solo: 'MLS only', legacy: 'Drone coverage, targeted digital ads to qualified waterfront buyers' },
]

const faqs = [
  {
    q: 'Who is the best waterfront realtor in Hampton VA?',
    a: 'Barry Jenkins of Legacy Home Team is ranked #9 nationally (Real Trends) with specific experience in Fort Monroe leasehold transactions, Buckroe Beach, Hampton Harbor, and Fox Hill river access properties.',
  },
  {
    q: 'What are the best waterfront neighborhoods in Hampton?',
    a: 'It depends on your goal: Buckroe Beach for Chesapeake Bay beach lifestyle, Hampton Harbor for protected harbor views and marina slips, Fort Monroe for historic architecture and bay views, Fox Hill for river access at more affordable prices, and Salt Ponds for canal boating community access.',
  },
  {
    q: 'Do I need special inspections for waterfront property in Hampton?',
    a: 'Yes — at minimum: a standard home inspection, FEMA flood zone verification, bulkhead/seawall condition assessment, and for properties with docks, a dock structural inspection. For Fort Monroe, a careful review of the Army Ground Lease is essential before you make any offer.',
  },
  {
    q: 'What is Fort Monroe and how does buying waterfront property there work?',
    a: 'Fort Monroe is a former U.S. Army fort now converted to civilian housing. The Army retains land ownership; buyers purchase the structures through a Ground Lease. Properties offer exceptional Chesapeake Bay views and unique historic architecture. The leasehold structure has specific rules about modifications, subletting, and resale that require an experienced agent.',
  },
  {
    q: 'Does Legacy Home Team handle waterfront transactions in Hampton?',
    a: 'Yes — with specific experience in flood zone analysis, dock and riparian rights verification, and Fort Monroe leasehold transactions across Buckroe Beach, Hampton Harbor, Fox Hill, and the Hampton River corridor.',
  },
]

export default function BestWaterfrontRealtorHampton() {
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
          <Link href="/hampton" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Hampton</Link>
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
              Hampton Waterfront · Hampton Roads
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              Best Waterfront Realtor in Hampton
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              Hampton sits at the confluence of the Hampton Roads harbor, the Chesapeake Bay, and the Hampton River — making it one of the most varied waterfront markets in the region. Bay views, harbor access, marina berths, and direct beach frontage all come with different pricing models, different risks, and different complications that a specialist learns by closing transactions in each.
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
                Schedule a Free Consultation
              </Link>
              <Link href="/hampton" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                Explore Hampton →
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

      {/* Section 1: Why Waterfront Needs a Specialist */}
      <section>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Waterfront Buyer &amp; Seller Guide</span>
            <h2>Why Hampton Waterfront Needs a Specialist</h2>
            <p>
              Waterfront property in Hampton is not a single category — it&apos;s five different ones, each with distinct insurance requirements, legal structures, and due diligence steps. Here&apos;s what to look for in a waterfront specialist.
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
                    Why It Matters for Hampton Waterfront
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
            <strong>Before making any offer on Hampton waterfront property:</strong> Confirm the FEMA flood zone designation, verify dock and riparian rights independently (not just from listing agent claims), and order a bulkhead inspection if applicable. These steps protect your investment from day one.
          </div>
        </div>
      </section>

      {/* Section 2: Waterfront Areas */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <span className="section-label">Market Intelligence</span>
            <h2>Hampton Waterfront Areas: Prices, Access Types, and Key Considerations</h2>
            <p>
              Each Hampton waterfront area has a different access type, different price tier, and different buyer profile. Knowing which area fits your goal is the first step.
            </p>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 200 }}>Area</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', minWidth: 140 }}>Price Range</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Waterfront Type</th>
                </tr>
              </thead>
              <tbody>
                {waterfrontRows.map((row, i) => (
                  <tr key={row.area} style={{ background: i % 2 === 0 ? 'var(--white)' : 'var(--off-white)', borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)', verticalAlign: 'top' }}>{row.area}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--accent)', fontWeight: 600, verticalAlign: 'top', whiteSpace: 'nowrap' }}>{row.range}</td>
                    <td style={{ padding: '14px 20px', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{row.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)' }}>
            <strong>Fort Monroe specifically:</strong> The Army Ground Lease governing all Fort Monroe property has specific rules about property modifications, subletting, and what happens when you sell. Read it before you make an offer, not after. Your agent should have experience walking buyers through it.
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
                Legacy Home Team has closed waterfront transactions across every category Hampton offers — from Chesapeake Bay beach properties at Buckroe to the unique leasehold waterfront at{' '}
                <a href="https://fortmonroe.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Fort Monroe</a>{' '}
                to marina-access homes along Hampton Harbor. That breadth means clients get specific guidance for each property type rather than generic waterfront advice.
              </p>
              <p style={{ marginBottom: 20 }}>
                Flood zone considerations are particularly important in Hampton. Nearly all waterfront properties — and many that simply sit in low-lying areas — require flood insurance. Legacy Home Team routinely analyzes FEMA flood maps before offers are made, so buyers understand their insurance exposure from the start rather than discovering it at closing.
              </p>
              <p>
                The team&apos;s marketing infrastructure matters for waterfront sellers too. One illustration: a client came to us with an inherited home, no staging budget, and an uncertain timeline. Nine qualified offers arrived within 24 hours of listing. Drone photography, Ylopo-powered digital targeting, and deep local market knowledge combined to reach the right buyers quickly — a result a solo agent with standard MLS exposure rarely achieves.
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
            <h2 style={{ marginBottom: 8 }}>8 Questions for Hampton Waterfront Buyers and Sellers</h2>
            <p style={{ marginBottom: 40 }}>
              A waterfront specialist should have precise answers to all of these. Vague responses signal a generalist, not a specialist.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                'How many Hampton waterfront transactions did you close in the last 24 months?',
                'Have you closed a Fort Monroe leasehold transaction?',
                'How do you verify riparian rights and dock access before an offer?',
                'What flood zone is this property in, and what does that mean for insurance costs?',
                'What\'s the tidal range at this location, and how does it affect dock usability?',
                'How do you compare Hampton waterfront pricing against Virginia Beach and Norfolk waterfront?',
                'What does a bulkhead inspection cover, and when do you recommend one?',
                'What should a Hampton waterfront seller do before listing to maximize value?',
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
              <strong>Flood insurance detail:</strong> In Hampton, the difference between an AE and VE flood zone designation on a FEMA map can swing your annual flood insurance cost by $3,000–$5,000 or more. This is not a detail to discover at closing — verify it before you submit an offer.
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
            Legacy Home Team · Hampton Waterfront
          </span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', margin: '16px 0 20px' }}>
            Ready to Work With Hampton&apos;s Waterfront Specialist?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            Legacy Home Team has closed waterfront transactions from Buckroe Beach to Fort Monroe to Hampton Harbor. Whether you&apos;re buying or selling, we bring flood zone analysis, dock verification, and Fort Monroe leasehold expertise to every transaction.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
              Schedule a Free Consultation
            </Link>
            <Link href="/hampton" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
              Explore Hampton Homes →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
