import { NextRequest, NextResponse } from 'next/server'
import { saveIdea } from '@/lib/idea-store'
import type { IdeaCandidate } from '@/lib/types'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'

const TODAY = '2026-05-09'

const HISTORICAL_IDEAS: Omit<IdeaCandidate, 'id' | 'weekId' | 'createdAt'>[] = [
  {
    source: 'internal',
    title: 'The 34-Foot Sea Monster on Our Beach: The Story Behind King Neptune',
    angle: 'Most locals have walked past him a hundred times without knowing the whole story — cast in China in 120 days, shipped across the ocean, planted at the edge of the Atlantic.',
    whyItMatters: 'King Neptune at 31st Street is one of the most-photographed spots in Virginia Beach. Local buyers want to live near iconic landmarks — connecting history to neighborhood identity builds authority and generates shareable content.',
    category: 'local-history',
    audiences: ['buyer', 'local'],
    contentType: 'Local History',
    urgency: 'evergreen',
    score: { total: 82, localRelevance: 22, timeliness: 12, formatFit: 14, audienceValue: 13, sourceCredibility: 8, novelty: 8, seoPotential: 5 },
    sourceUrls: ['https://www.vbgov.com/government/departments/parks-recreation/parks-trails/pages/neptune-park.aspx'],
    sourceDomains: ['vbgov.com'],
    sourceLabels: ['Government'],
    researchData: `King Neptune statue at 31st Street, Virginia Beach:
- 34 feet tall (24 ft statue + 10 ft base)
- Created by sculptor Paul DiPasquale (Richmond, VA)
- Cast in Nanjing, China — completed in 120 days
- Unveiled April 2005, cost $500,000
- Made of cast bronze, weighs several tons
- Trident is 22 feet long
- Located at the Virginia Beach Boardwalk at 31st Street
- Has become the unofficial symbol of the VB oceanfront
- Annual Neptune Festival named after him (September)
- Installed after the 1990s boardwalk revitalization project
TikTok angle: "Most locals don't know this about the King Neptune statue on the VB boardwalk..."`,
    targetKeyword: 'King Neptune statue Virginia Beach',
    cityTarget: 'Virginia Beach',
    status: 'pending',
  },
  {
    source: 'internal',
    title: "Blackbeard's Head Hung on a Pole: The Pirate History Hidden in Hampton Roads",
    angle: "The final chapter of Edward Teach (Blackbeard) didn't happen in the Caribbean — it happened right here. The spot where his severed head was displayed still has a name today.",
    whyItMatters: "Hampton Roads history is a massive differentiator for agents — buyers relocating here from out of state are fascinated by the depth of local lore. 'Blackbeard's Point' in Hampton is still on maps.",
    category: 'local-history',
    audiences: ['buyer', 'local'],
    contentType: 'Local History',
    urgency: 'evergreen',
    score: { total: 79, localRelevance: 20, timeliness: 10, formatFit: 14, audienceValue: 12, sourceCredibility: 9, novelty: 9, seoPotential: 5 },
    sourceUrls: ['https://www.history.com/topics/colonial-america/blackbeard'],
    sourceDomains: ['history.com'],
    sourceLabels: ['Historical Record'],
    researchData: `Blackbeard's final battle and Hampton connection:
- Blackbeard (Edward Teach) killed November 22, 1718 at Ocracoke Inlet, NC
- Battle led by Lt. Robert Maynard of HMS Pearl, stationed at Hampton
- After battle, Maynard sailed back to Hampton with Blackbeard's severed head hung from the bowsprit
- Head displayed on a pole at the entrance to the Hampton River as a warning to pirates
- The spot became known as "Blackbeard's Point" — the name persists on Hampton maps today
- Body thrown overboard — legend says it swam around the ship three times before sinking
- Governor Spotswood of Virginia ordered the mission from Williamsburg
- Teach's treasure was never found — rumored to be buried somewhere in the Chesapeake region
- Blackbeard used the Outer Banks and Hampton Roads as his base of operations 1716-1718
TikTok angle: "There's a spot in Hampton, VA where Blackbeard's severed head was displayed on a pole..."`,
    targetKeyword: 'Blackbeard Hampton Virginia history',
    cityTarget: 'Hampton',
    status: 'pending',
  },
  {
    source: 'internal',
    title: 'The Day Two Iron Ships Changed Naval Warfare Forever — 5 Miles from Downtown Norfolk',
    angle: "March 8-9, 1862. Two iron ships faced off in Hampton Roads and made every wooden navy on Earth obsolete overnight. The wreck of the Monitor was found — 16 miles off Cape Hatteras.",
    whyItMatters: "The Battle of Hampton Roads is one of the most pivotal moments in American military history — and it happened right here. Naval Station Norfolk buyers especially connect with this history.",
    category: 'local-history',
    audiences: ['buyer', 'local'],
    contentType: 'Local History',
    urgency: 'evergreen',
    score: { total: 85, localRelevance: 24, timeliness: 10, formatFit: 14, audienceValue: 12, sourceCredibility: 10, novelty: 8, seoPotential: 7 },
    sourceUrls: ['https://www.nps.gov/hamp/learn/historyculture/battle-of-hampton-roads.htm'],
    sourceDomains: ['nps.gov'],
    sourceLabels: ['National Park Service'],
    researchData: `Battle of Hampton Roads — CSS Virginia vs. USS Monitor:
- March 8, 1862: CSS Virginia (rebuilt from USS Merrimack) attacks Union blockade fleet in Hampton Roads
- Day 1: Virginia sinks USS Cumberland and USS Congress, runs USS Minnesota aground — worst Union naval disaster of the war
- Night of March 8-9: USS Monitor arrives from New York (just commissioned Feb 25)
- March 9, 1862: 4-hour battle between the two ironclads — first in naval history
- Neither ship sinks the other; battle ends inconclusively but Virginia retreats
- The Monitor's revolving turret design is considered a turning point in naval architecture
- CSS Virginia was scuttled May 11, 1862 by Confederates when evacuating Norfolk
- USS Monitor sank in a storm December 31, 1862 off Cape Hatteras
- Monitor wreck discovered 1973, now a National Marine Sanctuary
- Hampton Roads Naval Museum in downtown Norfolk has extensive exhibits
TikTok angle: "In 1862, two iron ships fought 5 miles from downtown Norfolk and made every wooden warship on Earth obsolete in a single morning..."`,
    targetKeyword: 'Battle of Hampton Roads Monitor Merrimack history',
    cityTarget: 'Norfolk',
    status: 'pending',
  },
  {
    source: 'internal',
    title: "First Landing State Park: The Day England First Touched America (Then Got Shot At)",
    angle: "April 26, 1607. English colonists landed at the tip of what is now Virginia Beach. They planted a cross. Then the Chesapeake tribe attacked with arrows. They almost turned back. They didn't.",
    whyItMatters: "First Landing State Park is a major selling point for the Cape Henry area of Virginia Beach — buyers near this neighborhood are buying into 400+ years of American history. Enormous SEO value for 'living near First Landing State Park'.",
    category: 'local-history',
    audiences: ['buyer', 'local'],
    contentType: 'Local History',
    urgency: 'evergreen',
    score: { total: 88, localRelevance: 25, timeliness: 10, formatFit: 14, audienceValue: 13, sourceCredibility: 10, novelty: 9, seoPotential: 7 },
    sourceUrls: ['https://www.dcr.virginia.gov/state-parks/first-landing'],
    sourceDomains: ['dcr.virginia.gov'],
    sourceLabels: ['Government', 'State Park'],
    researchData: `First Landing — Cape Henry, Virginia Beach:
- April 26, 1607: 104 English colonists aboard Susan Constant, Godspeed, Discovery land at Cape Henry
- First thing that happened: they planted a cross on the beach
- Second thing: they were attacked by Chesapeake Indians with arrows — two men wounded
- They spent the night debating whether to continue or return to England
- They continued — and 13 days later founded Jamestown on May 14, 1607
- Cape Henry Lighthouse (1792) is the first public works project authorized by the U.S. Congress
- The site is now First Landing State Park — 2,888 acres, most visited state park in Virginia
- The Landing Cross Monument marks the approximate landing site (installed 1935)
- The Chesapeake Bay, Atlantic Ocean, and Lynnhaven River all converge here
- "First Landing" name was given to the site in the 20th century — colonists called it "Cape Henry" after Henry, Prince of Wales
TikTok angle: "April 26, 1607. England first touched American soil right here in Virginia Beach. Within hours, they were under attack with arrows..."`,
    targetKeyword: 'First Landing State Park Virginia Beach history',
    cityTarget: 'Virginia Beach',
    status: 'pending',
  },
  {
    source: 'internal',
    title: 'World War II Came to the Virginia Beach Shoreline — And Vacationers Watched It Happen',
    angle: "Summer 1942. Vacationers on Virginia Beach watched tankers burn offshore while the U.S. Navy was powerless to stop German U-boats operating in plain sight of the East Coast.",
    whyItMatters: "This story connects Virginia Beach to one of the most visceral chapters of WWII — and it's almost completely unknown. Perfect for the 'hidden history' format and for buyers interested in the area's military heritage.",
    category: 'local-history',
    audiences: ['buyer', 'local'],
    contentType: 'Local History',
    urgency: 'evergreen',
    score: { total: 84, localRelevance: 22, timeliness: 10, formatFit: 14, audienceValue: 12, sourceCredibility: 10, novelty: 10, seoPotential: 6 },
    sourceUrls: ['https://www.history.com/news/german-u-boats-american-east-coast-world-war-ii'],
    sourceDomains: ['history.com'],
    sourceLabels: ['Historical Record'],
    researchData: `Operation Drumbeat — U-boats off Virginia Beach, 1942:
- January–July 1942: Operation Paukenschlag (Drumbeat) — German U-boat offensive targeting US East Coast shipping
- Virginia Beach / Hampton Roads was one of the heaviest-hit areas
- Ships were silhouetted at night against the lit shoreline (US refused to dim lights for months)
- June 1942: Multiple tankers torpedoed within sight of Virginia Beach — beach-goers watched the fires
- The U.S. lost more ships in these 7 months than in any comparable period of the war
- Bodies and oil washed up on Virginia Beach shore
- German U-boat commanders called it "The Happy Time" — easy targets, minimal opposition
- The US Navy was initially unprepared — had no convoy system, few depth charges
- Fort Story (now Joint Expeditionary Base Little Creek-Fort Story) was active during this period
- Eventually defeated by convoy escorts, air patrols, and improved radar by summer 1942
- Multiple wreck sites sit just offshore — popular with divers today
TikTok angle: "In 1942, Virginia Beach vacationers watched ships burn offshore while German submarines prowled the Atlantic just miles away..."`,
    targetKeyword: 'World War 2 Virginia Beach U-boats history',
    cityTarget: 'Virginia Beach',
    status: 'pending',
  },
  {
    source: 'internal',
    title: 'Naval Station Norfolk: The Largest Naval Base on Earth Was Built in 6 Months on a World\'s Fair Site',
    angle: "In 1917, the U.S. needed a naval base — fast. They took a 1907 World's Fair exhibition site and turned it into the largest naval installation on the planet in under 6 months.",
    whyItMatters: "Naval Station Norfolk is the single biggest driver of the Hampton Roads economy and military buyer market. This origin story is gold for connecting with military families relocating here.",
    category: 'local-history',
    audiences: ['buyer', 'local'],
    contentType: 'Local History',
    urgency: 'evergreen',
    score: { total: 80, localRelevance: 21, timeliness: 10, formatFit: 13, audienceValue: 14, sourceCredibility: 9, novelty: 8, seoPotential: 5 },
    sourceUrls: ['https://www.cnic.navy.mil/regions/cnrma/installations/ns_norfolk.html'],
    sourceDomains: ['navy.mil'],
    sourceLabels: ['Military', 'Government'],
    researchData: `Naval Station Norfolk origin story:
- 1907: Jamestown Exposition held on Sewell's Point in Norfolk — celebrating 300th anniversary of Jamestown
- 44 states built exhibition buildings; the event attracted 1 million visitors
- After the expo, the buildings were abandoned on the 400-acre site
- April 1917: US enters WWI; the Navy needed a major East Coast base immediately
- The abandoned expo site was acquired; construction began within weeks
- Built in under 6 months — soldiers, sailors, and workers transformed the site
- Several original Exposition buildings still stand today (used as officers' quarters)
- Today: Naval Station Norfolk covers 4,393 acres, houses 75+ ships and 130+ aircraft
- Largest naval station in the world — 80,000+ military and civilian workers
- Home to US Fleet Forces Command, NATO Allied Command Transformation
- The base's Hampton Boulevard gate sits just minutes from downtown Norfolk and ORF airport
TikTok angle: "The largest naval base on Earth started as a World's Fair site. Here's how Norfolk built it in 6 months in 1917..."`,
    targetKeyword: 'Naval Station Norfolk history origin',
    cityTarget: 'Norfolk',
    status: 'pending',
  },
]

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const saved: { id: string; title: string }[] = []

  for (const partial of HISTORICAL_IDEAS) {
    const idea: IdeaCandidate = {
      ...partial,
      id: randomUUID(),
      weekId: TODAY,
      createdAt: new Date().toISOString(),
    }
    await saveIdea(idea)
    saved.push({ id: idea.id, title: idea.title })
  }

  return NextResponse.json({ ok: true, count: saved.length, ideas: saved })
}
