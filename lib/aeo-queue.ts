export interface AEOQueueEntry {
  city: string         // URL slug, e.g. 'virginia-beach'
  cityName: string     // Display name, e.g. 'Virginia Beach'
  cityHref: string     // e.g. '/virginia-beach'
  slug: string         // URL segment, e.g. 'best-listing-agent'
  h1: string           // Exact-match H1
  intent: string       // guides Claude content angle
  topicContext: string // 2-3 sentence guide for Claude
  localContext: string // City/topic facts for Claude to draw on
  extLinks?: Array<{ text: string; url: string }>
}

// 8 rounds × 6 cities = 48 pages
// round r → entries[r * 6] through entries[r * 6 + 5]
export const AEO_QUEUE: AEOQueueEntry[] = [

  // ── Round 0 — Listing agent (VB) + General agent (all others) ─────────────

  {
    city: 'virginia-beach', cityName: 'Virginia Beach', cityHref: '/virginia-beach',
    slug: 'best-listing-agent', h1: 'Best Listing Agent in Virginia Beach',
    intent: 'seller',
    topicContext: 'Sellers in Virginia Beach need a listing agent who can price accurately across 7 distinct sub-markets, deploy Ylopo-powered digital advertising to reach buyers before they reach Zillow, and manage multiple-offer situations on tight military PCS timelines.',
    localContext: 'VB median days on market: 21–45 days. Resort Strip moves on vacation-rental income analysis; Great Neck moves on school district; Kempsville moves on military proximity. Flood zone disclosure affects pricing by $15K–$40K. Average list price 2025: $385K–$550K by neighborhood.',
    extLinks: [{ text: 'Hampton Roads REALTORS Association', url: 'https://www.hrra.com' }],
  },
  {
    city: 'chesapeake', cityName: 'Chesapeake', cityHref: '/chesapeake',
    slug: 'best-real-estate-agent', h1: 'Best Real Estate Agent in Chesapeake',
    intent: 'general',
    topicContext: 'Chesapeake is Virginia\'s second-largest city by land area (353 sq miles) with dramatically different sub-markets — Great Bridge, Hickory, Western Branch, and Deep Creek all behave independently. The right agent reads all of them.',
    localContext: 'Chesapeake median home price 2025: $360K–$480K. Great Bridge: top-rated schools, family demand. Hickory: rural feel, larger lots, new construction. Western Branch: Norfolk commuter belt, military-adjacent. Deep Creek: industrial waterfront, working-class stability.',
    extLinks: [{ text: 'Hampton Roads REALTORS Association', url: 'https://www.hrra.com' }],
  },
  {
    city: 'norfolk', cityName: 'Norfolk', cityHref: '/norfolk',
    slug: 'best-real-estate-agent', h1: 'Best Real Estate Agent in Norfolk',
    intent: 'general',
    topicContext: 'Norfolk is Hampton Roads\' urban core — home to the world\'s largest naval station, a growing downtown medical district, and diverse neighborhoods from Ghent\'s walkable arts district to Ocean View\'s beach access. The right agent navigates all of it.',
    localContext: 'Norfolk median price 2025: $285K–$450K. Ghent/Larchmont: walkable, premium. Talbot Park/Colony: mid-range family. Ocean View: beach access, gentrifying. Colonial Place: craftsman homes, price stability. Wards Corner: investor-friendly entry price.',
    extLinks: [{ text: 'Naval Station Norfolk', url: 'https://www.cnic.navy.mil/regions/cnrma/installations/nsa_norfolk.html' }],
  },
  {
    city: 'suffolk', cityName: 'Suffolk', cityHref: '/suffolk',
    slug: 'best-real-estate-agent', h1: 'Best Real Estate Agent in Suffolk',
    intent: 'general',
    topicContext: 'Suffolk spans 400+ sq miles — the largest city in Virginia by land area — mixing suburban Harbour View with rural acreage, riverfront estates, and agricultural land. An agent who knows only one zone will cost buyers money in another.',
    localContext: 'Suffolk median price 2025: $310K–$500K. Harbour View: fastest-growing, new construction, waterway access. Downtown Suffolk: historic, affordable. Northern Suffolk: rural acreage, well+septic common. Nansemond River frontage commands $50K–$150K premiums.',
    extLinks: [{ text: 'Hampton Roads REALTORS Association', url: 'https://www.hrra.com' }],
  },
  {
    city: 'hampton', cityName: 'Hampton', cityHref: '/hampton',
    slug: 'best-real-estate-agent', h1: 'Best Real Estate Agent in Hampton',
    intent: 'general',
    topicContext: 'Hampton has some of the most unique property types in Hampton Roads — Fort Monroe leaseholds where buyers purchase structures on Army-owned land, Buckroe Beach cottages, Phoebus arts district rowhouses, and Langley AFB military housing adjacency. Generalist agents miss the details.',
    localContext: 'Hampton median price 2025: $260K–$380K. Buckroe Beach: affordable waterfront, vacation rental zoning. Fort Monroe: Army Ground Lease — buyers own structure, not land. Phoebus: historic arts district, small lots. Langley AFB corridor: strong military PCS demand.',
    extLinks: [{ text: 'Fort Monroe National Monument', url: 'https://fortmonroe.org' }],
  },
  {
    city: 'newport-news', cityName: 'Newport News', cityHref: '/newport-news',
    slug: 'best-real-estate-agent', h1: 'Best Real Estate Agent in Newport News',
    intent: 'general',
    topicContext: 'Newport News is anchored by Huntington Ingalls Industries (largest shipbuilder in the Western Hemisphere) and Joint Base Langley-Eustis. The city\'s north-to-south price gradient is steep — Denbigh can run $20K–$40K above Southeast on identical homes. An agent who knows the spread earns their commission.',
    localContext: 'Newport News median price 2025: $250K–$370K. Denbigh: top schools, family demand, highest prices. Hilton Village: first planned community in America (1918), historic. Kiln Creek: golf community, HOA. Southeast: affordable, HII/shipyard proximity, investor demand.',
    extLinks: [{ text: 'Joint Base Langley-Eustis', url: 'https://www.jble.af.mil' }],
  },

  // ── Round 1 — Buyer\'s agents ───────────────────────────────────────────────

  {
    city: 'virginia-beach', cityName: 'Virginia Beach', cityHref: '/virginia-beach',
    slug: 'best-buyers-agent', h1: 'Best Buyer\'s Agent in Virginia Beach',
    intent: 'buyer',
    topicContext: 'Virginia Beach\'s competitive market — active military PCS buyers, VA loan financing, and multiple-offer situations in Great Neck and Kempsville — demands a buyer\'s agent who does more than show homes.',
    localContext: 'VB average competing offers 2025: 2–4 on well-priced homes. VA loan market share: ~35%. Cash buyers: ~18%. Escalation clauses common on $350K–$550K range. Appraisal gaps a real risk. First-look networks via Ylopo give buyers 24–48 hour advantage.',
    extLinks: [{ text: 'Virginia Beach City Schools', url: 'https://www.vbschools.com' }],
  },
  {
    city: 'chesapeake', cityName: 'Chesapeake', cityHref: '/chesapeake',
    slug: 'best-buyers-agent', h1: 'Best Buyer\'s Agent in Chesapeake',
    intent: 'buyer',
    topicContext: 'Chesapeake buyers navigating Great Bridge school districts, new construction negotiations in Hickory, and rural well+septic due diligence need a buyer\'s agent who knows when to escalate and when the builder\'s price has room.',
    localContext: 'Chesapeake new construction share 2025: ~22% of sales. Builder incentive negotiation: $10K–$30K typical. School zone premium between Great Bridge and other zones: 8–12%. VA loan widely used due to JBLE proximity. HOA-governed subdivisions dominant in new build areas.',
    extLinks: [{ text: 'Chesapeake Public Schools', url: 'https://www.cpschools.com' }],
  },
  {
    city: 'norfolk', cityName: 'Norfolk', cityHref: '/norfolk',
    slug: 'best-listing-agent', h1: 'Best Listing Agent in Norfolk',
    intent: 'seller',
    topicContext: 'Norfolk sellers face a uniquely diverse buyer pool — active-duty military relocating from Naval Station Norfolk, ODU students and faculty, and urban buyers migrating from Ghent\'s premium to adjacent neighborhoods. The listing strategy must reach all three.',
    localContext: 'Norfolk average DOM 2025: 18–38 days. Ghent listings attract urban professional buyers and see bidding; Wards Corner attracts investors. Flood zone designations (X vs AE) affect buyer pool size and insurance cost visibility. Naval Station Norfolk proximity is a selling point for ~30% of buyers.',
    extLinks: [{ text: 'City of Norfolk Real Estate Assessor', url: 'https://www.norfolk.gov/1870/Real-Estate-Assessments' }],
  },
  {
    city: 'suffolk', cityName: 'Suffolk', cityHref: '/suffolk',
    slug: 'best-buyers-agent', h1: 'Best Buyer\'s Agent in Suffolk',
    intent: 'buyer',
    topicContext: 'Suffolk buyers choose between suburban Harbour View new construction, rural acreage lots requiring well+septic knowledge, and waterfront Nansemond River properties — three completely different due diligence playbooks in one city.',
    localContext: 'Suffolk rural lot purchases: zoning classification, perc test, HRSD sewer availability critical. Harbour View new construction: builder contracts require experienced negotiation. Nansemond River waterfront: riparian rights, VMRC permits for docks. VA and conventional both widely used.',
    extLinks: [{ text: 'Hampton Roads REALTORS Association', url: 'https://www.hrra.com' }],
  },
  {
    city: 'hampton', cityName: 'Hampton', cityHref: '/hampton',
    slug: 'best-listing-agent', h1: 'Best Listing Agent in Hampton',
    intent: 'seller',
    topicContext: 'Hampton sellers — whether listing a Buckroe Beach cottage, a Fort Monroe structure, or a standard Phoebus rowhouse — need a listing agent who understands each property type\'s unique buyer pool, pricing method, and disclosure requirement.',
    localContext: 'Hampton average DOM 2025: 22–42 days. Buckroe Beach attracts vacation rental investors (price by income analysis). Fort Monroe requires Army Ground Lease disclosure. Langley AFB corridor has reliable military PCS buyer demand. Median sale price $265K–$340K by neighborhood.',
    extLinks: [{ text: 'Langley Air Force Base', url: 'https://www.langley.af.mil' }],
  },
  {
    city: 'newport-news', cityName: 'Newport News', cityHref: '/newport-news',
    slug: 'best-buyers-agent', h1: 'Best Buyer\'s Agent in Newport News',
    intent: 'buyer',
    topicContext: 'Newport News buyers — especially those relocating for JBLE or Huntington Ingalls — need a buyer\'s agent who knows the Denbigh-to-Southeast price gradient, understands the Hilton Village historic district restrictions, and can navigate the city\'s competitive Kiln Creek golf community market.',
    localContext: 'Newport News buyer competition 2025: moderate — 1.5–2.5 offers on Denbigh listings, fewer in Southeast. VA loans dominant: ~40% of purchases. Hilton Village: historic district = renovation restrictions, no generic updates. HII shift workers value Southeast proximity over school zone.',
    extLinks: [{ text: 'Huntington Ingalls Industries', url: 'https://huntingtoningalls.com' }],
  },

  // ── Round 2 — Waterfront specialists ──────────────────────────────────────

  {
    city: 'virginia-beach', cityName: 'Virginia Beach', cityHref: '/virginia-beach',
    slug: 'best-waterfront-realtor', h1: 'Best Waterfront Realtor in Virginia Beach',
    intent: 'waterfront',
    topicContext: 'Virginia Beach waterfront means five distinct water types — Chesapeake Bay beaches, Lynnhaven Inlet canals, Back Bay creeks, oceanfront resort strip, and Linkhorn Bay — each with different flood zone classifications, insurance implications, and buyer demand profiles.',
    localContext: 'VB waterfront price premium: $80K–$350K depending on water type. AE flood zone: $2,400–$4,000/yr insurance typical. VE (velocity) zone: $4,500–$7,000/yr. Canal lots need bulkhead inspection. Riparian rights to Lynnhaven Inlet require VMRC permit for docks. Back Bay protected — limited development.',
    extLinks: [{ text: 'FEMA Flood Map Service Center', url: 'https://msc.fema.gov' }],
  },
  {
    city: 'chesapeake', cityName: 'Chesapeake', cityHref: '/chesapeake',
    slug: 'best-waterfront-realtor', h1: 'Best Waterfront Realtor in Chesapeake',
    intent: 'waterfront',
    topicContext: 'Chesapeake waterfront includes Northwest River frontage, Deep Creek\'s working waterway, inland lake communities, and Chesapeake Bay access properties — each with radically different flood insurance, dock permit, and buyer pool considerations.',
    localContext: 'Chesapeake waterfront: Northwest River most premium, $450K–$900K. Deep Creek industrial waterway — lower flood risk, lower premium. Lake communities: HOA restrictions on motorized watercraft affect value. All waterfront: VMRC dock permits, bulkhead condition critical, flood elevation certificate.',
    extLinks: [{ text: 'Virginia Marine Resources Commission', url: 'https://mrc.virginia.gov' }],
  },
  {
    city: 'norfolk', cityName: 'Norfolk', cityHref: '/norfolk',
    slug: 'best-waterfront-realtor', h1: 'Best Waterfront Realtor in Norfolk',
    intent: 'waterfront',
    topicContext: 'Norfolk\'s waterfront properties face some of the most complex flood risk in Hampton Roads — the city is actively managing sea level rise, with neighborhoods like Ocean View and Larchmont seeing periodic tidal flooding. A waterfront specialist here needs to know FEMA maps, elevation certificates, and flood mitigation programs.',
    localContext: 'Norfolk waterfront: Elizabeth River — premium, downtown adjacency. Lafayette River: residential with flood history, elevation critical. Talbot Park: limited waterfront, high demand. Ocean View: beach access, AE and VE zones mixed. Norfolk\'s FIRM (flood map) was updated 2021 — affects insurance cost significantly.',
    extLinks: [{ text: 'City of Norfolk Resilience', url: 'https://www.norfolk.gov/3205/Vision-2100' }],
  },
  {
    city: 'suffolk', cityName: 'Suffolk', cityHref: '/suffolk',
    slug: 'best-waterfront-realtor', h1: 'Best Waterfront Realtor in Suffolk',
    intent: 'waterfront',
    topicContext: 'Suffolk waterfront means Nansemond River, Bennett\'s Creek, and Sleepy Hole frontage — tidal rivers with navigable access, dock permit requirements from VMRC, and riparian rights that few agents in Hampton Roads fully understand.',
    localContext: 'Suffolk waterfront: Nansemond River premium $50K–$150K. Bennett\'s Creek — more protected, lower wave action, dock easier. Sleepy Hole: marina access, boat ramp community. Tidal fluctuation affects dock design requirements. VMRC permits: 3–6 month timeline. Riparian rights include mean-low-water mark.',
    extLinks: [{ text: 'Virginia Marine Resources Commission', url: 'https://mrc.virginia.gov' }],
  },
  {
    city: 'hampton', cityName: 'Hampton', cityHref: '/hampton',
    slug: 'best-buyers-agent', h1: 'Best Buyer\'s Agent in Hampton',
    intent: 'buyer',
    topicContext: 'Hampton buyers face unique challenges — Fort Monroe Ground Lease structures require specialized purchase contracts, Buckroe Beach vacation-rental properties are valued differently from primary residences, and Langley AFB PCS timelines compress the entire process into 30 days.',
    localContext: 'Hampton buyer profile 2025: ~35% military (Langley/Fort Eustis). Fort Monroe: Army Ground Lease — bank financing more complex, fewer lenders. Buckroe Beach: vacation rental zoning confirmation essential before purchase. VA loans dominant citywide. Average buyer budget: $250K–$350K.',
    extLinks: [{ text: 'Langley Air Force Base', url: 'https://www.langley.af.mil' }],
  },
  {
    city: 'newport-news', cityName: 'Newport News', cityHref: '/newport-news',
    slug: 'best-military-relocation-realtor', h1: 'Best Military Relocation Realtor in Newport News',
    intent: 'military',
    topicContext: 'Newport News is home to Joint Base Langley-Eustis (JBLE), combining Air Force and Army operations. Military families PCSing to JBLE face the same compressed timelines and VA loan requirements as any Hampton Roads base — but also the unique geographic split between the Langley side (Hampton) and Eustis side (Newport News).',
    localContext: 'JBLE: ~16,000 service members. Eustis-side (Fort Eustis): Army — Newport News proximity preferred. Langley-side: Air Force — Hampton proximity preferred. Cross-base housing search common. VA loan: zero down, no PMI — huge advantage in Newport News price range. BAH at Newport News rates: ~$1,800–$2,400/mo depending on rank.',
    extLinks: [{ text: 'Joint Base Langley-Eustis', url: 'https://www.jble.af.mil' }],
  },

  // ── Round 3 — Military relocation specialists ──────────────────────────────

  {
    city: 'virginia-beach', cityName: 'Virginia Beach', cityHref: '/virginia-beach',
    slug: 'best-military-relocation-realtor', h1: 'Best Military Relocation Realtor in Virginia Beach',
    intent: 'military',
    topicContext: 'Virginia Beach is home to Naval Air Station Oceana and JEB Little Creek–Fort Story, serving tens of thousands of active-duty and veteran families. Military relocation here requires VA loan expertise, PCS timeline management, and knowledge of which neighborhoods are most practical for each installation.',
    localContext: 'NAS Oceana: Navy aviation — Kempsville, Princess Anne corridor most practical. JEB Little Creek–Fort Story: Navy amphibious — Ocean View, Shore Drive neighborhoods preferred. BAH (Virginia Beach rate): E-5 with deps ~$2,100/mo; O-3 with deps ~$2,700/mo. VA loans: ~35% of all VB purchases.',
    extLinks: [
      { text: 'NAS Oceana Housing Office', url: 'https://www.cnic.navy.mil/regions/cnrma/installations/nas_oceana.html' },
      { text: 'JEB Little Creek–Fort Story', url: 'https://www.cnic.navy.mil/regions/cnrma/installations/jeb_little_creek_fort_story.html' },
    ],
  },
  {
    city: 'chesapeake', cityName: 'Chesapeake', cityHref: '/chesapeake',
    slug: 'best-military-relocation-realtor', h1: 'Best Military Relocation Realtor in Chesapeake',
    intent: 'military',
    topicContext: 'Chesapeake is a preferred landing zone for military families PCSing to Naval Station Norfolk, Naval Medical Center Portsmouth, and NSB Little Creek. Its Great Bridge school district, lower price points than Virginia Beach, and suburban character make it a top choice for families with children.',
    localContext: 'Chesapeake military profile: ~25% of home purchases by military/veteran buyers. Great Bridge schools = top-tier, major draw for families. Distance to NSN: 15–25 min. Naval Medical Center Portsmouth: 20 min. VA loans common. BAH offset for Norfolk/Chesapeake command areas: E-5 ~$1,950/mo, O-3 ~$2,500/mo.',
    extLinks: [{ text: 'Naval Station Norfolk', url: 'https://www.cnic.navy.mil/regions/cnrma/installations/nsa_norfolk.html' }],
  },
  {
    city: 'norfolk', cityName: 'Norfolk', cityHref: '/norfolk',
    slug: 'best-military-relocation-realtor', h1: 'Best Military Relocation Realtor in Norfolk',
    intent: 'military',
    topicContext: 'Norfolk hosts the world\'s largest naval station. Military families PCSing to Naval Station Norfolk, NSB Little Creek, or any of the 12+ tenant commands need a relocation specialist who can compress a 45-day homebuying process, navigate VA loans, and know which neighborhoods put them 10 minutes from base gates.',
    localContext: 'Naval Station Norfolk: ~75,000 personnel. Most practical neighborhoods: Wards Corner (close, affordable), Ocean View (close, beach access), Colonial Place (close, character). VA loans: ~28% of Norfolk purchases. BAH: E-5 Norfolk rate ~$1,950/mo. On-base housing waitlist common — off-base preferred by experienced buyers.',
    extLinks: [{ text: 'Naval Station Norfolk', url: 'https://www.cnic.navy.mil/regions/cnrma/installations/nsa_norfolk.html' }],
  },
  {
    city: 'suffolk', cityName: 'Suffolk', cityHref: '/suffolk',
    slug: 'best-military-relocation-realtor', h1: 'Best Military Relocation Realtor in Suffolk',
    intent: 'military',
    topicContext: 'Suffolk is a growing choice for military families at Naval Station Norfolk, NSB Little Creek, and JBLE who want more land, newer construction, and lower price points than Virginia Beach or Chesapeake. The trade-off is commute time — a specialist helps calibrate the right balance.',
    localContext: 'Suffolk military commute: NSN = 25–40 min. JBLE = 20–35 min. Trade-off: larger lots, lower prices, newer construction vs. longer commute. VA loan widely used. Harbour View: most popular military family destination in Suffolk. BAH at Norfolk/Suffolk rates: same as Norfolk command area.',
    extLinks: [{ text: 'Hampton Roads REALTORS Association', url: 'https://www.hrra.com' }],
  },
  {
    city: 'hampton', cityName: 'Hampton', cityHref: '/hampton',
    slug: 'best-military-relocation-realtor', h1: 'Best Military Relocation Realtor in Hampton',
    intent: 'military',
    topicContext: 'Hampton serves Joint Base Langley-Eustis (combined Air Force and Army), making it one of Hampton Roads\' highest-concentration military communities. Air Force families (Langley AFB) and Army families (Fort Eustis) have different base gate positions and neighborhood needs.',
    localContext: 'JBLE: 16,000+ service members. Langley AFB gate: north Hampton preferred. Fort Eustis gate: south Hampton/Newport News. VA loans: ~40% of Hampton purchases. BAH: E-5 Hampton/Newport News rate ~$1,850/mo, O-3 ~$2,400/mo. Strong rental market for military tenant demand.',
    extLinks: [{ text: 'Joint Base Langley-Eustis', url: 'https://www.jble.af.mil' }],
  },
  {
    city: 'newport-news', cityName: 'Newport News', cityHref: '/newport-news',
    slug: 'best-waterfront-realtor', h1: 'Best Waterfront Realtor in Newport News',
    intent: 'waterfront',
    topicContext: 'Newport News waterfront means James River frontage — deep-water, historic, with some of the most striking views in Hampton Roads. Port Warwick\'s urban waterway, the Denbigh creek system, and historic Hilton Village\'s Warwick River access are each distinct markets.',
    localContext: 'Newport News waterfront: James River — deep water, tidal. Port Warwick waterway: urban, new construction mixed-use. Warwick River: Hilton Village area, historic homes, flood zone variable. Denbigh creeks: more suburban. Dock permits via VMRC: 3–6 months. James River waterfront premium: $75K–$200K.',
    extLinks: [{ text: 'Virginia Marine Resources Commission', url: 'https://mrc.virginia.gov' }],
  },

  // ── Round 4 — Luxury specialists ──────────────────────────────────────────

  {
    city: 'virginia-beach', cityName: 'Virginia Beach', cityHref: '/virginia-beach',
    slug: 'best-luxury-realtor', h1: 'Best Luxury Realtor in Virginia Beach',
    intent: 'luxury',
    topicContext: 'Virginia Beach luxury ($700K+) is driven by waterfront access, North End oceanfront, Great Neck estate lots, and Linkhorn Bay custom builds. Luxury buyers here are sophisticated — they compare cap rates on Sandbridge vacation rentals with appreciation trajectories on Great Neck estates.',
    localContext: 'VB luxury price points: North End oceanfront $1.2M–$3M+. Linkhorn Bay estate $800K–$2M. Great Neck waterfront $900K–$2.5M. Sandbridge $600K–$2M (income-producing). Non-waterfront luxury: $700K–$1.1M. Luxury DOM: 45–90 days. Off-market listings common — network matters.',
    extLinks: [{ text: 'Real Trends 1000', url: 'https://www.realtrends.com/rankings/real-trends-500/' }],
  },
  {
    city: 'chesapeake', cityName: 'Chesapeake', cityHref: '/chesapeake',
    slug: 'best-luxury-realtor', h1: 'Best Luxury Realtor in Chesapeake',
    intent: 'luxury',
    topicContext: 'Chesapeake luxury is quieter than Virginia Beach but emerging strongly in waterfront Great Bridge Estates, custom-build Northwest River frontage, and large-lot Hickory area properties. Buyers want privacy, land, and water — things Virginia Beach\'s dense submarkets can\'t offer at price.',
    localContext: 'Chesapeake luxury: Northwest River frontage $700K–$1.5M. Great Bridge Estates custom builds $600K–$1M. Large-lot Hickory: $500K–$800K. Custom spec builds: longer DOM, 60–90 days. Luxury buyers often cross-shopping VB waterfront vs. Chesapeake estate — different lifestyle tradeoff.',
    extLinks: [{ text: 'Hampton Roads REALTORS Association', url: 'https://www.hrra.com' }],
  },
  {
    city: 'norfolk', cityName: 'Norfolk', cityHref: '/norfolk',
    slug: 'best-luxury-realtor', h1: 'Best Luxury Realtor in Norfolk',
    intent: 'luxury',
    topicContext: 'Norfolk luxury centers on Ghent and Larchmont\'s historic character and Talbot Park\'s estate lots — a different kind of luxury than Virginia Beach. Buyers value walkability, architecture, and neighborhood prestige over oceanfront.',
    localContext: 'Norfolk luxury: Larchmont $600K–$1.2M, Lafayette River frontage $700K–$1.5M. Ghent historic district: $500K–$900K. Talbot Park estate lots: $550K–$950K. Luxury buyers often dual-income professionals or senior military officers. Norfolk luxury DOM: 35–65 days. Renovation potential valued by discerning buyers.',
    extLinks: [{ text: 'City of Norfolk', url: 'https://www.norfolk.gov' }],
  },
  {
    city: 'suffolk', cityName: 'Suffolk', cityHref: '/suffolk',
    slug: 'best-luxury-realtor', h1: 'Best Luxury Realtor in Suffolk',
    intent: 'luxury',
    topicContext: 'Suffolk luxury is defined by Harbour View waterway-front custom builds and Nansemond River estate properties — buyers who want land, water, and privacy at price points below what equivalent waterfront costs in Virginia Beach.',
    localContext: 'Suffolk luxury: Harbour View waterway-front $550K–$1M. Nansemond River estate: $600K–$1.3M. Custom acre+ lots northern Suffolk: $450K–$700K. Value proposition: same land and water access as VB at 30–40% lower price. Buyers typically ages 45+, often downsizing from VB or upsizing from Chesapeake.',
    extLinks: [{ text: 'Hampton Roads REALTORS Association', url: 'https://www.hrra.com' }],
  },
  {
    city: 'hampton', cityName: 'Hampton', cityHref: '/hampton',
    slug: 'best-luxury-realtor', h1: 'Best Luxury Realtor in Hampton',
    intent: 'luxury',
    topicContext: 'Hampton luxury occupies a niche that few agents serve: Fort Monroe historic properties (unique architecture, waterfront, Army Ground Lease), Buckroe Beach premium waterfront, and waterfront custom builds on the Hampton Roads harbor.',
    localContext: 'Hampton luxury: Fort Monroe historic structures $500K–$1.2M (Army leasehold). Buckroe Beach premium waterfront: $450K–$800K. Harbor-front custom: $600K–$1.1M. Note: Fort Monroe luxury buyers must understand Army Ground Lease — no standard buyer representation works. DOM longer: 60–100 days for unique product.',
    extLinks: [{ text: 'Fort Monroe Authority', url: 'https://fortmonroe.org' }],
  },
  {
    city: 'newport-news', cityName: 'Newport News', cityHref: '/newport-news',
    slug: 'best-luxury-realtor', h1: 'Best Luxury Realtor in Newport News',
    intent: 'luxury',
    topicContext: 'Newport News luxury clusters in Kiln Creek\'s golf-course community, Hidenwood\'s established estate lots, and Port Warwick\'s new-urbanism premium development. Buyers are typically HII executives, senior military officers, and Riverside Health System leadership.',
    localContext: 'Newport News luxury: Kiln Creek $450K–$750K (golf community, HOA). Hidenwood $500K–$850K (established, tree-lined). Port Warwick $550K–$900K (new-urbanism, walkable). Buyer profile: dual-income professional, HII/Riverside executive, retiring O-5/O-6. DOM 40–70 days. Smaller luxury market than VB — off-market relationships matter.',
    extLinks: [{ text: 'Port Warwick', url: 'https://www.portwarwick.com' }],
  },

  // ── Round 5 — First-time homebuyer specialists ─────────────────────────────

  {
    city: 'virginia-beach', cityName: 'Virginia Beach', cityHref: '/virginia-beach',
    slug: 'best-first-time-homebuyer-realtor', h1: 'Best First-Time Homebuyer Realtor in Virginia Beach',
    intent: 'firsttime',
    topicContext: 'First-time buyers in Virginia Beach face a competitive market, flood zone complexity, and multiple financing options (VHDA, VA, FHA) that require an agent who is a financial educator as much as a deal-finder.',
    localContext: 'VHDA (Virginia Housing) programs: down payment assistance up to $10K-$20K for qualified buyers. VA loan: 0 down for eligible military. FHA 3.5% down. Entry-level VB: $250K–$350K in Kempsville, Bayside, Princess Anne. First-time buyer average age in VB: 32. Common mistakes: underestimating flood insurance, skipping inspection.',
    extLinks: [{ text: 'Virginia Housing (VHDA)', url: 'https://www.vhda.com' }],
  },
  {
    city: 'chesapeake', cityName: 'Chesapeake', cityHref: '/chesapeake',
    slug: 'best-first-time-homebuyer-realtor', h1: 'Best First-Time Homebuyer Realtor in Chesapeake',
    intent: 'firsttime',
    topicContext: 'Chesapeake is one of Hampton Roads\' most practical first-time buyer markets — more affordable than Virginia Beach, with excellent Great Bridge schools, lower flood risk in most neighborhoods, and strong value in Western Branch for commuters to Norfolk.',
    localContext: 'Chesapeake entry-level 2025: $280K–$370K. Most affordable: Deep Creek, portions of Western Branch. Great Bridge entry-level: $310K–$390K. First-time buyers: VHDA programs widely used. Inspection importance: HOA documents, well/septic in rural areas. No city income tax (vs. other VA cities) = effective savings.',
    extLinks: [{ text: 'Virginia Housing (VHDA)', url: 'https://www.vhda.com' }],
  },
  {
    city: 'norfolk', cityName: 'Norfolk', cityHref: '/norfolk',
    slug: 'best-first-time-homebuyer-realtor', h1: 'Best First-Time Homebuyer Realtor in Norfolk',
    intent: 'firsttime',
    topicContext: 'Norfolk has some of the most affordable entry-level inventory in Hampton Roads, and city-specific programs like Norfolk Redevelopment and Housing Authority grants for qualifying neighborhoods. First-time buyers here find opportunity — but flood zone complexity and aging housing stock require an agent who does thorough due diligence.',
    localContext: 'Norfolk entry-level 2025: $220K–$320K. Most affordable: Wards Corner, Campostella, East Beach areas. Flood risk: critical variable — some affordable neighborhoods in flood zone AE. City programs: NRHA homeownership assistance available. ODU proximity: rental demand support. Older housing stock: inspection critical.',
    extLinks: [{ text: 'Norfolk Redevelopment and Housing Authority', url: 'https://www.nrha.us' }],
  },
  {
    city: 'suffolk', cityName: 'Suffolk', cityHref: '/suffolk',
    slug: 'best-first-time-homebuyer-realtor', h1: 'Best First-Time Homebuyer Realtor in Suffolk',
    intent: 'firsttime',
    topicContext: 'Suffolk offers the most affordable path to homeownership in Hampton Roads for first-time buyers willing to commute — with entry-level homes 10–15% below Chesapeake prices and a quieter market with less competition.',
    localContext: 'Suffolk entry-level 2025: $260K–$340K. Most affordable: downtown Suffolk historic, eastern rural areas. Western Branch equivalent to Chesapeake pricing. Rural areas: well+septic = lower price but more maintenance. VHDA programs apply. Slower market = more negotiating room for first-time buyers. Commute trade-off: 25–40 min to Norfolk employment centers.',
    extLinks: [{ text: 'Virginia Housing (VHDA)', url: 'https://www.vhda.com' }],
  },
  {
    city: 'hampton', cityName: 'Hampton', cityHref: '/hampton',
    slug: 'best-first-time-homebuyer-realtor', h1: 'Best First-Time Homebuyer Realtor in Hampton',
    intent: 'firsttime',
    topicContext: 'Hampton is one of the most underrated first-time buyer markets in Hampton Roads — affordable entry points in Buckroe Beach adjacent areas, reliable military tenant demand supporting home values, and VHDA programs available for qualified buyers.',
    localContext: 'Hampton entry-level 2025: $220K–$310K. Most affordable: Phoebus, Newmarket, portions of Wythe. Buckroe Beach adjacent: $240K–$320K. Fort Monroe structures: complex, not for first-time buyers. Strong military rental market = good investment fallback if buyer moves. JBLE proximity keeps demand stable.',
    extLinks: [{ text: 'Virginia Housing (VHDA)', url: 'https://www.vhda.com' }],
  },
  {
    city: 'newport-news', cityName: 'Newport News', cityHref: '/newport-news',
    slug: 'best-first-time-homebuyer-realtor', h1: 'Best First-Time Homebuyer Realtor in Newport News',
    intent: 'firsttime',
    topicContext: 'Newport News\'s Southeast neighborhoods offer some of Hampton Roads\' most accessible homeownership entry points, with strong Huntington Ingalls employment anchoring home values and VA loans widely available for military first-time buyers at JBLE.',
    localContext: 'Newport News entry-level 2025: $210K–$300K. Southeast NN: $210K–$270K, high HII worker demand, rental market strong. Denbigh entry-level: $270K–$320K (better schools). VA loan: 40% of purchases citywide. Hilton Village: historic restrictions make it complex for first-timers. VHDA programs available.',
    extLinks: [{ text: 'Virginia Housing (VHDA)', url: 'https://www.vhda.com' }],
  },

  // ── Round 6 — Condo, New Construction, specialty ──────────────────────────

  {
    city: 'virginia-beach', cityName: 'Virginia Beach', cityHref: '/virginia-beach',
    slug: 'best-condo-realtor', h1: 'Best Condo Realtor in Virginia Beach',
    intent: 'condo',
    topicContext: 'Virginia Beach condos span oceanfront resort strip high-rises, Town Center urban flats, and inland HOA communities — each with distinct HOA financial health, special assessment risk, FHA/VA approval status, and rental restriction profiles.',
    localContext: 'VB condo market: oceanfront high-rise $200K–$600K, strong vacation rental income. Town Center urban $180K–$380K, owner-occupant focus. VA condo approval: only ~40% of condo associations are VA-approved — limits buyer pool significantly. FHA approval: similarly restricted. HOA reserves: underfunded associations = special assessment risk.',
    extLinks: [{ text: 'VA Condo Approvals List', url: 'https://www.benefits.va.gov/homeloans/condominiums.asp' }],
  },
  {
    city: 'chesapeake', cityName: 'Chesapeake', cityHref: '/chesapeake',
    slug: 'best-new-construction-realtor', h1: 'Best New Construction Realtor in Chesapeake',
    intent: 'newconstruction',
    topicContext: 'Chesapeake is Hampton Roads\' primary new construction market, with the Centerville Turnpike corridor, Hickory\'s growth zone, and Harbour View-adjacent Chesapeake neighborhoods adding hundreds of new units annually. Builder contracts are not standard purchase agreements — they need an agent who reads them.',
    localContext: 'Chesapeake new construction 2025: ~1,200 new homes/year. Dominant builders: Ryan Homes, D.R. Horton, NVR. Incentive negotiation: $10K–$30K in closing costs typical. Builder pre-approval requirement: agent must attend first visit or lose representation rights. HOA formation: new communities, documents critical.',
    extLinks: [{ text: 'Hampton Roads REALTORS Association', url: 'https://www.hrra.com' }],
  },
  {
    city: 'norfolk', cityName: 'Norfolk', cityHref: '/norfolk',
    slug: 'best-buyers-agent', h1: 'Best Buyer\'s Agent in Norfolk',
    intent: 'buyer',
    topicContext: 'Norfolk buyers compete across a uniquely diverse market — Ghent\'s bidding wars, Ocean View\'s revitalization opportunity, and Wards Corner\'s investor activity require an agent who can switch strategies by zip code.',
    localContext: 'Norfolk buyer competition: Ghent 2–5 offers typical on $400K–$600K. Ocean View: strong renovation potential, buyer education needed on flood risk. Wards Corner: cash investor competition. VA loans: 28% of purchases. Condo market active: FHA/VA condo approval varies. Key: first-look network and speed of offer preparation.',
    extLinks: [{ text: 'City of Norfolk', url: 'https://www.norfolk.gov' }],
  },
  {
    city: 'suffolk', cityName: 'Suffolk', cityHref: '/suffolk',
    slug: 'best-new-construction-realtor', h1: 'Best New Construction Realtor in Suffolk',
    intent: 'newconstruction',
    topicContext: 'Suffolk\'s Harbour View corridor and emerging northern growth zones are active new construction markets. Builder contracts, HOA formation documents, and construction loan financing all behave differently from resale purchases — a specialist matters.',
    localContext: 'Suffolk new construction: Harbour View dominant — waterway lots, community amenities. Builders: Ryan Homes, Eagle Construction active. Incentive window: typically better at quarter-end. Phase pricing: buy in Phase 1 for best lot selection at lowest price. HOA formation period = undefined rules, higher risk.',
    extLinks: [{ text: 'Hampton Roads REALTORS Association', url: 'https://www.hrra.com' }],
  },
  {
    city: 'hampton', cityName: 'Hampton', cityHref: '/hampton',
    slug: 'best-condo-realtor', h1: 'Best Condo Realtor in Hampton',
    intent: 'condo',
    topicContext: 'Hampton\'s condo market includes downtown waterfront units, Phoebus arts district flats, and military-adjacent complexes popular with junior officers and enlisted families. HOA financial health and VA/FHA approval status are the make-or-break variables.',
    localContext: 'Hampton condo market: downtown waterfront $180K–$350K. Phoebus: $130K–$220K. Military-adjacent complexes: strong VA loan demand, but VA approval varies. HOA assessment risk: older buildings, deferred maintenance common. Key due diligence: 2 years HOA meeting minutes, reserve study, master insurance certificate.',
    extLinks: [{ text: 'VA Condo Approvals', url: 'https://www.benefits.va.gov/homeloans/condominiums.asp' }],
  },
  {
    city: 'newport-news', cityName: 'Newport News', cityHref: '/newport-news',
    slug: 'best-new-construction-realtor', h1: 'Best New Construction Realtor in Newport News',
    intent: 'newconstruction',
    topicContext: 'Newport News new construction is concentrated in Port Warwick\'s mixed-use development, Oyster Point business corridor adjacency, and emerging Denbigh growth areas. Builder contract representation requires a specialist — standard buyer\'s agency skills are not enough.',
    localContext: 'Newport News new construction 2025: Port Warwick (urban, mixed-use, premium pricing $450K–$700K). Oyster Point adjacent: professional/medical district, strong demand. Denbigh growth: affordable new construction $300K–$420K. Builders: HHHunt active in Newport News. Builder lender vs. outside financing: incentive trade-offs negotiable.',
    extLinks: [{ text: 'Port Warwick', url: 'https://www.portwarwick.com' }],
  },

  // ── Round 7 — Investment property specialists ─────────────────────────────

  {
    city: 'virginia-beach', cityName: 'Virginia Beach', cityHref: '/virginia-beach',
    slug: 'best-investment-property-realtor', h1: 'Best Investment Property Realtor in Virginia Beach',
    intent: 'investment',
    topicContext: 'Virginia Beach investment real estate spans vacation rental properties on the oceanfront (high gross income, high management cost), military-adjacent SFR rentals in Kempsville and Bayside (stable long-term tenants), and multi-family in the Oceanfront corridor.',
    localContext: 'VB vacation rental: gross rents $40K–$120K/yr for oceanfront. Net cap rate after management: 4–7%. STR regulations: Resort Strip permitted, most residential zones restricted. Long-term military rental: cap rate 5–8%, 98% occupancy. Off-market acquisition: Ylopo data identifies distress before listing. Due diligence: HOA rental restrictions, STR permit requirements.',
    extLinks: [{ text: 'Virginia Beach Short-Term Rental Rules', url: 'https://www.vbgov.com/government/departments/planning/areaplans/Pages/resort.aspx' }],
  },
  {
    city: 'chesapeake', cityName: 'Chesapeake', cityHref: '/chesapeake',
    slug: 'best-investment-property-realtor', h1: 'Best Investment Property Realtor in Chesapeake',
    intent: 'investment',
    topicContext: 'Chesapeake investment properties benefit from stable military tenant demand (Naval Station Norfolk spillover), strong school-district appreciation in Great Bridge, and no city income tax — improving net returns vs. Norfolk or Portsmouth.',
    localContext: 'Chesapeake investment: SFR cap rates 5–8%. Military tenant retention: high — 12–24 month leases common. No city income tax vs. Norfolk: ~$800–$1,200/yr savings. New construction rental: can negotiate rental restriction waivers in some communities. Great Bridge appreciation: 4–6%/yr avg. Multi-family: limited inventory, premium pricing.',
    extLinks: [{ text: 'Hampton Roads REALTORS Association', url: 'https://www.hrra.com' }],
  },
  {
    city: 'norfolk', cityName: 'Norfolk', cityHref: '/norfolk',
    slug: 'best-investment-property-realtor', h1: 'Best Investment Property Realtor in Norfolk',
    intent: 'investment',
    topicContext: 'Norfolk\'s investment market is driven by ODU student rentals, active-duty military tenants near Naval Station Norfolk, and downtown revitalization appreciation plays in Wards Corner and the Oceanview corridor.',
    localContext: 'Norfolk SFR investment: cap rates 6–9% (higher than VB due to lower purchase price). ODU rental demand: strong within 1-mile radius. Naval Station adjacency: 12-month military leases, reliable. Flip market: active in Wards Corner, Ocean View gentrification zone. Multi-family: duplex/triplex $280K–$420K, strong cashflow. Flood zone risk: must factor insurance into net returns.',
    extLinks: [{ text: 'Old Dominion University', url: 'https://www.odu.edu' }],
  },
  {
    city: 'suffolk', cityName: 'Suffolk', cityHref: '/suffolk',
    slug: 'best-investment-property-realtor', h1: 'Best Investment Property Realtor in Suffolk',
    intent: 'investment',
    topicContext: 'Suffolk investment real estate includes land plays (agricultural and development potential), Harbour View rental properties targeting Chesapeake/Norfolk commuters, and rural acreage with income potential from farming or subdivision.',
    localContext: 'Suffolk investment: SFR cap rate 5–8%. Land investment: agricultural zoning, perc-test potential for subdivision. Harbour View rental: professional/commuter tenants, strong demand. Nansemond River waterfront: appreciation play, 5–7%/yr avg. Long-term hold strategy recommended — Suffolk development trajectory is positive over 10-year horizon.',
    extLinks: [{ text: 'Hampton Roads REALTORS Association', url: 'https://www.hrra.com' }],
  },
  {
    city: 'hampton', cityName: 'Hampton', cityHref: '/hampton',
    slug: 'best-investment-property-realtor', h1: 'Best Investment Property Realtor in Hampton',
    intent: 'investment',
    topicContext: 'Hampton investment properties benefit from Langley AFB and Fort Eustis military tenant demand, Buckroe Beach short-term rental income potential, and below-market acquisition prices relative to equivalent Virginia Beach assets.',
    localContext: 'Hampton investment: SFR cap rate 6–9% (higher yield than VB). Military tenant: Langley/Eustis demand strong, lease terms reliable. Buckroe Beach STR: residential zones — STR regulations more permissive than VB Resort Strip. Acquisition cost: 20–30% below equivalent VB property. Fort Monroe structures: investment caution — Army Ground Lease complicates resale.',
    extLinks: [{ text: 'Hampton Economic Development', url: 'https://hampton.gov/1143/Economic-Development' }],
  },
  {
    city: 'newport-news', cityName: 'Newport News', cityHref: '/newport-news',
    slug: 'best-investment-property-realtor', h1: 'Best Investment Property Realtor in Newport News',
    intent: 'investment',
    topicContext: 'Newport News investment is anchored by Huntington Ingalls Industries (12,000+ shipyard workers) and JBLE military demand — two of the most stable tenant bases in Hampton Roads. Southeast Newport News in particular offers high-yield acquisition prices with reliable HII workforce tenant demand.',
    localContext: 'Newport News investment: SFR cap rate 7–10% in Southeast (highest in region). HII shipyard workers: long-term stable tenants, 2nd and 3rd shifts make flexible tenant types. JBLE military rental: reliable 12-month leases. Multi-family: limited but strong returns. Flip market: active in Southeast NN — $50K–$80K renovation plays exist. Port Warwick: appreciation play, luxury rental demand.',
    extLinks: [{ text: 'Huntington Ingalls Industries', url: 'https://huntingtoningalls.com' }],
  },
]

export const TOTAL_ROUNDS = 8
export const CITIES_PER_ROUND = 6
