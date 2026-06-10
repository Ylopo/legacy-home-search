import Anthropic from '@anthropic-ai/sdk'
import type { AEOQueueEntry } from './aeo-queue'

export interface AEOPageContent {
  metaTitle: string
  metaDescription: string
  ogDescription: string
  schemaDesc: string
  heroDescription: string
  s1Label: string
  s1H2: string
  s1Intro: string
  criteriaRows: Array<{ criteria: string; why: string }>
  proTip1: string
  s2H2: string
  s2Intro: string
  submarketsRows: Array<{ area: string; range: string; note: string }>
  proTip2: string
  barryP1: string
  barryP2: string
  barryP3: string
  questionsH2: string
  questions: string[]
  proTip3: string
  faqs: Array<{ q: string; a: string }>
  ctaHeadline: string
  ctaBody: string
}

export async function generateAEOContent(entry: AEOQueueEntry): Promise<AEOPageContent> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const prompt = `You are writing content for a real estate landing page for Legacy Home Team, led by Barry Jenkins, based in Virginia Beach, VA. Barry Jenkins is ranked #9 nationally among all U.S. real estate teams (Real Trends), has sold thousands of homes across Hampton Roads over his career, runs 3 teams, has ~20 years of experience, serves as Head Realtor in Residence at Ylopo, and is also CMO at Better Homes and Gardens NAGR. The tone is expert, direct, and locally specific — written from Legacy Home Team's perspective ("our team", "we"). No generic fluff.

Generate content for this landing page:
- City: ${entry.cityName}
- URL: /${entry.city}/${entry.slug}
- H1: "${entry.h1}"
- Intent: ${entry.intent}
- Topic context: ${entry.topicContext}
- Local facts to use: ${entry.localContext}
${entry.extLinks ? `- Authoritative external links to reference: ${entry.extLinks.map(l => l.url).join(', ')}` : ''}

Return ONLY a valid JSON object (no markdown, no preamble) with these exact keys:

{
  "metaTitle": "55-char max, keyword-led title tag with (2026) and | Legacy Home Team",
  "metaDescription": "150-160 char meta description with keyword, stat, CTA",
  "ogDescription": "120-130 char OG description",
  "schemaDesc": "1-2 sentence business description for JSON-LD schema",
  "heroDescription": "2-3 sentences, locally specific, explaining why this topic matters specifically in ${entry.cityName}",
  "s1Label": "3-5 word section eyebrow label (e.g. Buyer Guide, Seller Strategy)",
  "s1H2": "H2 for section 1 (what to look for in a ${entry.h1.toLowerCase().replace('best ', '').replace(' in ' + entry.cityName, '')})",
  "s1Intro": "2 sentence intro for the criteria table",
  "criteriaRows": [
    {"criteria": "criterion name", "why": "why it matters specifically in ${entry.cityName}"},
    (5 rows total)
  ],
  "proTip1": "1-2 sentence pro tip ending section 1",
  "s2H2": "H2 for section 2 (why ${entry.cityName} requires a specialist for ${entry.intent})",
  "s2Intro": "2 sentence intro for the local context / sub-markets table",
  "submarketsRows": [
    {"area": "neighborhood or zone name", "range": "price range e.g. $280K-$420K", "note": "1 sentence about this area's specific characteristic"},
    (5-6 rows)
  ],
  "proTip2": "1-2 sentence pro tip ending section 2",
  "barryP1": "2-3 sentences about Barry Jenkins and Legacy Home Team's qualifications for this specific topic/intent",
  "barryP2": "2-3 sentences about Ylopo technology advantage or specific result relevant to this topic",
  "barryP3": "2 sentences connecting Legacy Home Team's track record to ${entry.cityName} specifically",
  "questionsH2": "H2 for questions section (questions to ask before choosing a ${entry.h1.toLowerCase().replace('best ', '')})",
  "questions": [
    "question 1",
    "question 2",
    "question 3",
    "question 4",
    "question 5",
    "question 6",
    "question 7",
    "question 8"
  ],
  "proTip3": "1-2 sentence pro tip for questions section",
  "faqs": [
    {"q": "Who is the ${entry.h1.toLowerCase().replace('best ', '')}?", "a": "2-3 sentence answer naming Barry Jenkins and Legacy Home Team with the #9 Real Trends ranking stat"},
    {"q": "question 2", "a": "answer 2"},
    {"q": "question 3", "a": "answer 3"},
    {"q": "question 4", "a": "answer 4"},
    {"q": "question 5", "a": "answer 5"}
  ],
  "ctaHeadline": "CTA section headline (8-12 words, action-oriented)",
  "ctaBody": "2-3 sentence CTA body connecting Legacy Home Team's strengths to the reader's specific situation"
}

Important rules:
- Use double quotes for JSON strings. Apostrophes in text are fine.
- No backticks anywhere in the output.
- All numbers and stats must be defensible (use ranges, not false precision).
- Barry Jenkins stats: ~20 years, #9 nationally (Real Trends), thousands of homes sold, 3 teams across Hampton Roads.
- Write from Legacy Home Team's perspective using "we/our" when appropriate.
- Internal links: naturally mention other Hampton Roads cities (Virginia Beach, Chesapeake, Norfolk, Suffolk, Hampton, Newport News) where relevant.`

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 3000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''

  // Extract JSON from response (handle any markdown wrapping)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error(`No JSON in Claude response for ${entry.city}/${entry.slug}`)

  return JSON.parse(jsonMatch[0]) as AEOPageContent
}

function toComponentName(city: string, slug: string): string {
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  return slug.split('-').map(cap).join('') + city.split('-').map(cap).join('')
}

function escapeForJSString(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ')
}

function escapeForJSX(s: string): string {
  // Text that goes into JSX must have < > escaped; apostrophes are fine
  return s.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function generateAEOPageTSX(entry: AEOQueueEntry, c: AEOPageContent): string {
  const comp = toComponentName(entry.city, entry.slug)
  const canonicalUrl = `https://legacyhometeamlpt.com/${entry.city}/${entry.slug}`
  const esc = escapeForJSString
  const jsx = escapeForJSX

  const criteriaRowsCode = c.criteriaRows
    .map(r => `  { criteria: '${esc(r.criteria)}', why: '${esc(r.why)}' },`)
    .join('\n')

  const submarketsRowsCode = c.submarketsRows
    .map(r => `  { area: '${esc(r.area)}', range: '${esc(r.range)}', note: '${esc(r.note)}' },`)
    .join('\n')

  const faqSchemaCode = c.faqs.map(f => `    {
      '@type': 'Question',
      name: '${esc(f.q)}',
      acceptedAnswer: { '@type': 'Answer', text: '${esc(f.a)}' },
    },`).join('\n')

  const faqsCode = c.faqs.map(f => `  { q: '${esc(f.q)}', a: '${esc(f.a)}' },`).join('\n')

  const questionsCode = c.questions.map(q => `        '${esc(q)}',`).join('\n')

  // Breadcrumb: city page exists for all 6 cities; Hampton Roads has no parent page
  const breadcrumbItems = entry.city === 'hampton-roads'
    ? `    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: 'Hampton Roads', item: canonicalUrl },`
    : `    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://legacyhometeamlpt.com' },
    { '@type': 'ListItem', position: 2, name: '${entry.cityName}', item: 'https://legacyhometeamlpt.com${entry.cityHref}' },
    { '@type': 'ListItem', position: 3, name: '${jsx(entry.h1)}', item: '${canonicalUrl}' },`

  const breadcrumbJSX = entry.city === 'hampton-roads'
    ? `          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px', opacity: 0.4 }}>›</span>
          <span style={{ color: 'var(--text-secondary)' }}>${jsx(entry.cityName)}</span>`
    : `          <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 8px', opacity: 0.4 }}>›</span>
          <Link href="${entry.cityHref}" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>${jsx(entry.cityName)}</Link>
          <span style={{ margin: '0 8px', opacity: 0.4 }}>›</span>
          <span style={{ color: 'var(--text-secondary)' }}>${jsx(entry.h1.replace(`in ${entry.cityName}`, '').trim())}</span>`

  const heroExploreButton = entry.city === 'hampton-roads'
    ? `<Link href="/communities" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                Explore Hampton Roads →
              </Link>`
    : `<Link href="${entry.cityHref}" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
                Explore ${jsx(entry.cityName)} Homes →
              </Link>`

  const ctaExploreButton = entry.city === 'hampton-roads'
    ? `<Link href="/communities" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
              Explore Hampton Roads Communities →
            </Link>`
    : `<Link href="${entry.cityHref}" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.35)', color: '#fff' }}>
              Explore ${jsx(entry.cityName)} Homes →
            </Link>`

  return `import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '${esc(c.metaTitle)}',
  description: '${esc(c.metaDescription)}',
  alternates: { canonical: '${canonicalUrl}' },
  openGraph: {
    title: '${esc(c.metaTitle)}',
    description: '${esc(c.ogDescription)}',
    type: 'website',
    url: '${canonicalUrl}',
  },
  twitter: {
    card: 'summary_large_image',
    title: '${esc(c.metaTitle)}',
    description: '${esc(c.ogDescription)}',
  },
}

const schemaRealEstateAgent = {
  '@context': 'https://schema.org',
  '@type': ['RealEstateAgent', 'LocalBusiness'],
  name: 'Legacy Home Team — Barry Jenkins',
  description: '${esc(c.schemaDesc)}',
  url: 'https://legacyhometeamlpt.com',
  telephone: '(757) 816-4037',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '5224 Indian River Rd',
    addressLocality: '${entry.cityName}',
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
${faqSchemaCode}
  ],
}

const schemaBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
${breadcrumbItems}
  ],
}

const criteriaRows = [
${criteriaRowsCode}
]

const submarketsRows = [
${submarketsRowsCode}
]

const teamCompareRows = [
  { factor: 'Availability', solo: 'Limited to one schedule', legacy: 'Multiple agents — always someone reachable' },
  { factor: 'Annual production', solo: 'Typical: 20–40 transactions/year', legacy: 'Thousands of homes sold — scale that builds pattern recognition' },
  { factor: 'Marketing reach', solo: 'Standard MLS listing', legacy: 'Ylopo-powered digital ads, social retargeting, and MLS' },
  { factor: 'Negotiation approach', solo: 'One perspective', legacy: 'Team-reviewed, market-tested strategy' },
  { factor: 'Military PCS experience', solo: 'Varies', legacy: 'Established process — tight timelines handled routinely' },
]

const faqs = [
${faqsCode}
]

export default function ${comp}() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaRealEstateAgent) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />

      {/* Breadcrumb */}
      <div style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--border-light)', paddingTop: 'var(--nav-h)' }}>
        <div className="container" style={{ padding: '14px 24px', fontSize: 13, color: 'var(--text-muted)' }}>
${breadcrumbJSX}
        </div>
      </div>

      {/* Hero */}
      <section style={{ background: 'var(--accent)', padding: '64px 0 0', marginTop: 0, borderTop: 'none', overflow: 'hidden' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '48px', alignItems: 'flex-end' }}>
            <div style={{ paddingBottom: 72 }}>
            <div className="hero-eyebrow" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', marginBottom: 20 }}>
              ${jsx(entry.cityName)} · Hampton Roads
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              ${jsx(entry.h1)}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 17, lineHeight: 1.75, maxWidth: 640, marginBottom: 36 }}>
              ${jsx(c.heroDescription)}
            </p>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
                Schedule a Free Consultation
              </Link>
              ${heroExploreButton}
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
            <span className="section-label">${jsx(c.s1Label)}</span>
            <h2>${jsx(c.s1H2)}</h2>
            <p>${jsx(c.s1Intro)}</p>
          </div>
          <div style={{ overflowX: 'auto', marginBottom: 32 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: 'var(--accent)', color: '#fff' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>What to Look For</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Why It Matters in ${jsx(entry.cityName)}</th>
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
            <strong>Pro tip:</strong> ${jsx(c.proTip1)}
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section style={{ background: 'var(--off-white)' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'left', maxWidth: 720, margin: '0 0 40px' }}>
            <h2>${jsx(c.s2H2)}</h2>
            <p>${jsx(c.s2Intro)}</p>
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
            <strong>Pro tip:</strong> ${jsx(c.proTip2)}
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
              <p style={{ marginBottom: 20 }}>${jsx(c.barryP1)}</p>
              <p style={{ marginBottom: 20 }}>${jsx(c.barryP2)}</p>
              <p>${jsx(c.barryP3)}</p>
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
            <h2 style={{ marginBottom: 8 }}>${jsx(c.questionsH2)}</h2>
            <p style={{ marginBottom: 40 }}>A competent agent should have specific, data-backed answers to all of these. Vague responses are not answers.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
${questionsCode}
              ].map((q, i) => (
                <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>{q}</p>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--accent-light)', border: '1px solid #dbe4f0', borderRadius: 'var(--radius-lg)', padding: '18px 24px', fontSize: 14, color: 'var(--accent)', marginTop: 24 }}>
              <strong>Pro tip:</strong> ${jsx(c.proTip3)}
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
            Legacy Home Team · ${jsx(entry.cityName)}
          </span>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 3vw, 2.5rem)', margin: '16px 0 20px' }}>
            ${jsx(c.ctaHeadline)}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 16, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.75 }}>
            ${jsx(c.ctaBody)}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--accent)' }}>
              Schedule a Free Consultation
            </Link>
            ${ctaExploreButton}
          </div>
        </div>
      </section>
    </>
  )
}
`
}

// ── GitHub API: commit files in a single batch ───────────────────────────────

interface GitHubFile {
  path: string
  content: string // raw file content (will be base64-encoded)
}

export async function commitFilesToGitHub(files: GitHubFile[], commitMessage: string): Promise<void> {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN not set')

  const owner = 'Ylopo'
  const repo = 'legacy-home-search'
  const branch = 'main'
  const api = (path: string) => `https://api.github.com/repos/${owner}/${repo}${path}`
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  // 1. Get current branch SHA
  const refRes = await fetch(api(`/git/refs/heads/${branch}`), { headers })
  if (!refRes.ok) throw new Error(`GitHub ref fetch failed: ${refRes.status}`)
  const refData = await refRes.json()
  const latestCommitSha: string = refData.object.sha

  // 2. Get base tree SHA
  const commitRes = await fetch(api(`/git/commits/${latestCommitSha}`), { headers })
  if (!commitRes.ok) throw new Error(`GitHub commit fetch failed: ${commitRes.status}`)
  const commitData = await commitRes.json()
  const baseTreeSha: string = commitData.tree.sha

  // 3. Create blobs for each file
  const treeItems = await Promise.all(files.map(async (f) => {
    const blobRes = await fetch(api('/git/blobs'), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        content: Buffer.from(f.content, 'utf8').toString('base64'),
        encoding: 'base64',
      }),
    })
    if (!blobRes.ok) throw new Error(`Blob creation failed for ${f.path}: ${blobRes.status}`)
    const blob = await blobRes.json()
    return { path: f.path, mode: '100644', type: 'blob', sha: blob.sha }
  }))

  // 4. Create new tree
  const treeRes = await fetch(api('/git/trees'), {
    method: 'POST',
    headers,
    body: JSON.stringify({ base_tree: baseTreeSha, tree: treeItems }),
  })
  if (!treeRes.ok) throw new Error(`Tree creation failed: ${treeRes.status}`)
  const newTree = await treeRes.json()

  // 5. Create commit
  const newCommitRes = await fetch(api('/git/commits'), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message: commitMessage,
      tree: newTree.sha,
      parents: [latestCommitSha],
    }),
  })
  if (!newCommitRes.ok) throw new Error(`Commit creation failed: ${newCommitRes.status}`)
  const newCommit = await newCommitRes.json()

  // 6. Update branch ref
  const updateRes = await fetch(api(`/git/refs/heads/${branch}`), {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ sha: newCommit.sha }),
  })
  if (!updateRes.ok) throw new Error(`Ref update failed: ${updateRes.status}`)
}
