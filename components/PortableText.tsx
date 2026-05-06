import { PortableText as SanityPortableText } from 'next-sanity'

// Internal community pages — longest entries first prevents "Norfolk" matching before "Norfolk Academy"
const COMMUNITY_LINKS: Record<string, string> = {
  'Newport News': '/newport-news',
  'Virginia Beach': '/virginia-beach',
  'Chesapeake': '/chesapeake',
  'Norfolk': '/norfolk',
  'Suffolk': '/suffolk',
  'Hampton': '/hampton',
}

// External institution links injected on first mention in any blog post
const INSTITUTION_LINKS: Record<string, string> = {
  // Universities & colleges
  'Old Dominion University': 'https://www.odu.edu',
  'Regent University': 'https://www.regent.edu',
  'Virginia Wesleyan University': 'https://www.vwu.edu',
  'Norfolk State University': 'https://www.nsu.edu',
  'Tidewater Community College': 'https://www.tcc.edu',
  'Hampton University': 'https://www.hamptonu.edu',
  'Christopher Newport University': 'https://www.cnu.edu',
  'College of William & Mary': 'https://www.wm.edu',
  'William & Mary': 'https://www.wm.edu',
  // School districts
  'Virginia Beach City Public Schools': 'https://www.vbschools.com',
  'Chesapeake Public Schools': 'https://www.cpschools.com',
  'Norfolk Public Schools': 'https://www.npsk12.com',
  'Hampton City Schools': 'https://www.hampton.k12.va.us',
  'Newport News Public Schools': 'https://www.nnschools.org',
  // Private schools
  'Cape Henry Collegiate': 'https://www.capehenrycollegiate.org',
  'Norfolk Academy': 'https://www.norfolkacademy.org',
  'Nansemond-Suffolk Academy': 'https://nsapanthers.org',
  // Public high schools — linked to district homepage
  'Princess Anne High School': 'https://www.vbschools.com',
  'First Colonial High School': 'https://www.vbschools.com',
  'Ocean Lakes High School': 'https://www.vbschools.com',
  'Tallwood High School': 'https://www.vbschools.com',
  'Kellam High School': 'https://www.vbschools.com',
  'Great Bridge High School': 'https://www.cpschools.com',
  'Oscar Smith High School': 'https://www.cpschools.com',
  'Grassfield High School': 'https://www.cpschools.com',
  // Virginia state parks
  'First Landing State Park': 'https://www.dcr.virginia.gov/state-parks/first-landing',
  'False Cape State Park': 'https://www.dcr.virginia.gov/state-parks/false-cape',
  'Seashore State Park': 'https://www.dcr.virginia.gov/state-parks/first-landing',
  // National parks & refuges
  'Back Bay National Wildlife Refuge': 'https://www.fws.gov/refuge/back-bay',
  // Military installations
  'Naval Air Station Oceana': 'https://www.cnic.navy.mil/regions/cnrma/installations/nas_oceana.html',
  'NAS Oceana': 'https://www.cnic.navy.mil/regions/cnrma/installations/nas_oceana.html',
  'JEB Little Creek-Fort Story': 'https://www.cnic.navy.mil/regions/cnrma/installations/jeb_little_creek_fort_story.html',
  'JEB Little Creek': 'https://www.cnic.navy.mil/regions/cnrma/installations/jeb_little_creek_fort_story.html',
  'Joint Base Langley-Eustis': 'https://www.jble.af.mil',
  'Langley Air Force Base': 'https://www.jble.af.mil',
  'Naval Station Norfolk': 'https://www.cnic.navy.mil/regions/cnrma/installations/nsa_hampton_roads.html',
  'NSA Hampton Roads': 'https://www.cnic.navy.mil/regions/cnrma/installations/nsa_hampton_roads.html',
  // Research
  'NASA Langley Research Center': 'https://www.nasa.gov/langley',
  'NASA Langley': 'https://www.nasa.gov/langley',
  // Attractions & venues
  'Norfolk Botanical Garden': 'https://norfolkbotanicalgarden.org',
  "The Mariners' Museum": 'https://www.marinersmuseum.org',
  "Mariners' Museum": 'https://www.marinersmuseum.org',
  'Chesapeake Bay Bridge-Tunnel': 'https://www.cbbt.com',
  'Virginia Aquarium & Marine Science Center': 'https://www.virginiaaquarium.com',
  'Virginia Aquarium': 'https://www.virginiaaquarium.com',
  'Nauticus': 'https://nauticus.org',
}

// Sorted by name length descending so longer names match before shorter prefixes
const ALL_LINKS = Object.entries({ ...INSTITUTION_LINKS, ...COMMUNITY_LINKS })
  .sort((a, b) => b[0].length - a[0].length)

// Processes a plain text span recursively, handling three injection passes:
//   1. Parse raw [text](url) markdown — existing posts may have these as literal text
//   2. Inject community page links on first mention
//   3. Inject institution links on first mention
function processSpanText(
  text: string,
  newMarkDefs: any[],
  seq: { n: number },
  linked: Set<string>,
): any[] {
  const mk = () => `pt${seq.n++}`
  if (!text) return []

  // Pass 1: parse raw markdown link [text](url)
  const mdMatch = /\[([^\]]+)\]\(([^)\s]+)\)/.exec(text)
  if (mdMatch) {
    const result: any[] = []
    const before = text.slice(0, mdMatch.index)
    if (before) result.push(...processSpanText(before, newMarkDefs, seq, linked))

    // If the link text contains a community/institution name, mark it as linked
    for (const [name] of ALL_LINKS) {
      if (mdMatch[1].includes(name)) linked.add(name)
    }
    const linkKey = mk()
    newMarkDefs.push({ _type: 'link', _key: linkKey, href: mdMatch[2] })
    result.push({ _type: 'span', _key: mk(), text: mdMatch[1], marks: [linkKey] })

    const tail = text.slice(mdMatch.index + mdMatch[0].length)
    if (tail) result.push(...processSpanText(tail, newMarkDefs, seq, linked))
    return result
  }

  // Pass 2 & 3: inject community + institution links on first unlinked occurrence
  for (const [name, href] of ALL_LINKS) {
    if (linked.has(name)) continue
    const idx = text.indexOf(name)
    if (idx !== -1) {
      linked.add(name)
      const linkKey = mk()
      newMarkDefs.push({ _type: 'link', _key: linkKey, href })
      const result: any[] = []
      if (idx > 0) result.push(...processSpanText(text.slice(0, idx), newMarkDefs, seq, linked))
      result.push({ _type: 'span', _key: mk(), text: name, marks: [linkKey] })
      const tail = text.slice(idx + name.length)
      if (tail) result.push(...processSpanText(tail, newMarkDefs, seq, linked))
      return result
    }
  }

  // No matches — return unchanged as a single plain span
  return [{ _type: 'span', _key: mk(), text, marks: [] }]
}

function enrichBlocks(blocks: any[]): any[] {
  const linked = new Set<string>()
  const seq = { n: 0 }

  return blocks.map((block) => {
    if (block._type !== 'block') return block

    let modified = false
    const newMarkDefs = [...(block.markDefs ?? [])]
    const newChildren: any[] = []

    for (const child of block.children ?? []) {
      // Skip spans that already have explicit marks (don't double-link)
      if (child._type !== 'span' || (child.marks ?? []).length > 0) {
        newChildren.push(child)
        continue
      }
      const replaced = processSpanText(child.text ?? '', newMarkDefs, seq, linked)
      const unchanged =
        replaced.length === 1 &&
        replaced[0].text === child.text &&
        (replaced[0].marks ?? []).length === 0
      if (unchanged) {
        newChildren.push(child)
      } else {
        newChildren.push(...replaced)
        modified = true
      }
    }

    if (!modified) return block
    return { ...block, markDefs: newMarkDefs, children: newChildren }
  })
}

const components = {
  block: {
    normal: ({ children }: any) => (
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '20px' }}>
        {children}
      </p>
    ),
    h2: ({ children }: any) => (
      <h2 style={{ color: 'var(--text)', marginBottom: '16px', marginTop: '32px' }}>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 style={{ color: 'var(--text)', marginBottom: '12px', marginTop: '24px' }}>
        {children}
      </h3>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong style={{ color: 'var(--text)', fontWeight: 600 }}>{children}</strong>,
    em: ({ children }: any) => <em style={{ color: 'var(--accent)' }}>{children}</em>,
    link: ({ children, value }: any) => {
      const href = value?.href ?? ''
      const isExternal = href.startsWith('http')
      return (
        <a
          href={href}
          style={{ color: 'var(--accent)', textDecoration: 'underline' }}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    },
  },
}

export default function PortableText({ value }: { value: any[] }) {
  return <SanityPortableText value={enrichBlocks(value)} components={components} />
}
