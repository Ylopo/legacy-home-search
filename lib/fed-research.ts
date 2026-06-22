/**
 * Federal Reserve rate decision cron pipeline.
 *
 * Runs same-day at 3:30 PM ET on each FOMC decision day (4–8x per year). Searches
 * federalreserve.gov + financial press for that day's announcement, then writes a
 * single combined post covering Hampton Roads buyers, sellers, homeowners, and
 * military/PCS buyers. Lands in Sanity as workflowStatus: 'media_pending' for the
 * VA queue — bypasses the idea-review step because timeliness > approval delay.
 *
 * Maintenance: when the Fed publishes next year's meeting schedule, update
 * FOMC_MEETINGS below and add matching cron entries to vercel.json.
 */

import Anthropic from '@anthropic-ai/sdk'
import { publishBlogPost } from './sanity-write'
import { markdownToPortableText } from './portable-text-utils'
import { FAIR_HOUSING_RULES, checkFairHousing, saveFHResult } from './fair-housing'
import { sendFairHousingAlertEmail } from './email'
import type { BlogPostDraft } from './types'

// ─── FOMC schedule ────────────────────────────────────────────────────────────

export interface FOMCMeeting {
  date: string         // YYYY-MM-DD — the rate decision day (last day of the meeting)
  label: string        // human-facing label, e.g. "July 2026"
  meetingDates: string // full meeting window, e.g. "July 28–29"
}

// All 2026 meetings. Update annually when Fed publishes next year's schedule.
// Past meetings remain in the list so they can be replayed via the manual
// overrideDate trigger — the daily cron only fires on dates declared in vercel.json.
export const FOMC_MEETINGS: FOMCMeeting[] = [
  { date: '2026-06-10', label: 'June 2026',      meetingDates: 'June 9–10' },
  { date: '2026-07-29', label: 'July 2026',      meetingDates: 'July 28–29' },
  { date: '2026-09-16', label: 'September 2026', meetingDates: 'September 15–16' },
  { date: '2026-10-28', label: 'October 2026',   meetingDates: 'October 27–28' },
  { date: '2026-12-09', label: 'December 2026',  meetingDates: 'December 8–9' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripJsonFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 96)
}

/** Today's date in America/New_York (FOMC announcements are in ET). */
function todayInET(): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const lookup: Record<string, string> = {}
  for (const p of parts) lookup[p.type] = p.value
  return `${lookup.year}-${lookup.month}-${lookup.day}`
}

export function getCurrentFedMeeting(overrideDate?: string): FOMCMeeting | null {
  const today = overrideDate ?? todayInET()
  return FOMC_MEETINGS.find((m) => m.date === today) ?? null
}

// ─── Tavily search ────────────────────────────────────────────────────────────

interface RawResult {
  title: string
  url: string
  content: string
  source: string
}

async function fetchFedAnnouncement(meeting: FOMCMeeting): Promise<RawResult[]> {
  const apiKey = process.env.TAVILY_API_KEY
  if (!apiKey) throw new Error('TAVILY_API_KEY is not set')

  const queries = [
    `Federal Reserve FOMC statement ${meeting.label} rate decision`,
    `FOMC ${meeting.meetingDates} ${meeting.label.split(' ')[1]} press release`,
    `Federal Reserve interest rate decision ${meeting.label} mortgage rates`,
    `Powell press conference ${meeting.label} federal funds rate`,
  ]

  const results: RawResult[] = []
  const seenUrls = new Set<string>()

  for (const query of queries) {
    try {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          query,
          search_depth: 'advanced',
          max_results: 8,
          include_answer: false,
          include_domains: [
            'federalreserve.gov',
            'reuters.com',
            'wsj.com',
            'cnbc.com',
            'bloomberg.com',
            'apnews.com',
          ],
        }),
      })
      if (!res.ok) continue
      const data = await res.json()
      for (const r of data.results ?? []) {
        if (!seenUrls.has(r.url)) {
          seenUrls.add(r.url)
          results.push({
            title: r.title,
            url: r.url,
            content: r.content ?? '',
            source: new URL(r.url).hostname.replace('www.', ''),
          })
        }
      }
    } catch {
      // skip failed query
    }
  }

  return results
}

// ─── Post writing ─────────────────────────────────────────────────────────────

async function writeFedPost(meeting: FOMCMeeting, results: RawResult[]): Promise<BlogPostDraft> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  // Find the official Fed press release URL if present in the results
  const fedSource = results.find((r) => r.source.includes('federalreserve.gov'))
  const sourceUrl = fedSource?.url ?? 'https://www.federalreserve.gov/newsevents/pressreleases.htm'

  const researchText = results
    .slice(0, 12)
    .map((r) => `SOURCE: ${r.source}\nTITLE: ${r.title}\nURL: ${r.url}\nCONTENT: ${r.content.slice(0, 600)}`)
    .join('\n\n---\n\n')

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    messages: [
      {
        role: 'user',
        content: `You are writing a same-day blog post for Barry Jenkins (Legacy Home Team, Hampton Roads VA). The Federal Reserve just announced its rate decision for ${meeting.label} (the meeting on ${meeting.meetingDates}). Read the research below and write a post that explains what just happened and what it means for Hampton Roads buyers, sellers, and homeowners.

${FAIR_HOUSING_RULES}

WRITING RULES:
- Voice: knowledgeable, warm, direct. Barry has watched the Hampton Roads market through multiple rate cycles. He is NOT a financial advisor — he speaks plainly about what typical market dynamics suggest.
- Open with what the Fed just did (raised / cut / held) and the new federal funds rate range. First sentence states the news plainly. No "Did you know" openers. No "In a move that surprised markets" filler.
- DO NOT predict future Fed moves. DO NOT give specific buy/sell advice ("you should buy now"). Use historical framing: "historically when the Fed holds steady, mortgage rates tend to..."
- DO NOT conflate the federal funds rate with 30-year mortgage rates. They are correlated but not identical — explain this clearly in plain English.
- Use real numbers from the research: actual new rate range, actual change in basis points, vote count if mentioned.

STRUCTURE (~600–800 words):
1. Opening paragraph (2–3 sentences): What the Fed did, new range, why today matters for Hampton Roads
2. ## What This Means for Mortgage Rates — explain federal funds vs 30-year mortgage rates, the typical lag, what mortgage rates have been doing recently per the research
3. ## For Hampton Roads Buyers — monthly payment math on a representative price point (~$400K is typical). Mention that roughly a 0.25% mortgage rate shift moves the payment ~$60–70/month on a 30-year loan at this price
4. ## For Hampton Roads Sellers & Homeowners — what it means for buyer demand, and if rates are dropping, when a refinance starts to make sense (rule of thumb: ~0.75–1% drop from your current rate)
5. ## For Military Families & PCS Buyers — VA loan angle, how rate moves affect BAH math, considerations for buyers expecting orders
6. ## What This Means For You — 3–4 bullet points, mixed audience, observational not commanding
7. ## Frequently Asked Questions — exactly 3 questions as ### headings:
   - "Will mortgage rates drop now that the Fed [acted]?"
   - "Should I lock my rate?"
   - "How does this affect VA loans in Hampton Roads?"
   Each answer: 2–3 sentences.

KEYWORDS: Use "Hampton Roads mortgage rates" once, "Virginia Beach home buyer" once, and the meeting label (${meeting.label}) once. Don't force.

INTERNAL LINKS: 1 link to /blog, 1 link to a Hampton Roads community page (pick one: /virginia-beach, /chesapeake, /norfolk, /suffolk, /hampton, /newport-news). Format markdown: [Anchor Text](/path)

COMMUNITY LINK RULE: First mention of any Hampton Roads city by name → markdown link to its page.

The title and slug must reflect what the Fed actually did. Examples for different scenarios:
- Held rates: "Fed Holds Rates Steady — What It Means for Hampton Roads Buyers and Homeowners (${meeting.label})"
- Cut rates: "Fed Cuts Rates [Xbps] — What Hampton Roads Buyers Need to Know (${meeting.label})"
- Raised rates: "Fed Raises Rates [Xbps] — Here's What That Means for Hampton Roads (${meeting.label})"

OUTPUT JSON (no markdown fences, just JSON):
{
  "title": "see title examples above — fill in based on actual decision",
  "slug": "url-slug-version-of-title",
  "excerpt": "2–3 sentence summary for blog listing page",
  "metaTitle": "SEO title under 60 chars",
  "metaDescription": "120–160 chars for search preview",
  "body": "full post body — use ## for h2, ### for h3, - for bullets. Must end with the FAQ section."
}

RESEARCH:
${researchText}`,
      },
    ],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : '{}'
  const data = JSON.parse(stripJsonFences(raw))

  return {
    title: data.title,
    slug: slugify(data.slug || data.title),
    excerpt: data.excerpt,
    category: 'financing',
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    body: markdownToPortableText(data.body),
    sourceUrl,
    sourceTitle: `FOMC Statement — ${meeting.label}`,
    // Pin to top of VA queue — Fed posts must publish same-day
    vaQueuePriority: 100,
  }
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export interface FedResearchResult {
  postCreated: boolean
  meetingLabel: string
  postTitle?: string
  reason?: string
}

export async function runFedRateUpdate(overrideDate?: string): Promise<FedResearchResult> {
  const meeting = getCurrentFedMeeting(overrideDate)
  if (!meeting) {
    const today = overrideDate ?? todayInET()
    console.log(`[fed-research] No FOMC meeting matches today (${today}) — skipping`)
    return { postCreated: false, meetingLabel: today, reason: 'no matching meeting' }
  }

  console.log(`[fed-research] Starting Fed rate post for ${meeting.label} (${meeting.date})`)

  const results = await fetchFedAnnouncement(meeting)
  console.log(`[fed-research] Tavily returned ${results.length} results for ${meeting.label}`)

  // Don't generate a low-quality post if research came up empty
  if (results.length < 3) {
    console.error(`[fed-research] Insufficient research (${results.length} results) — bailing`)
    return {
      postCreated: false,
      meetingLabel: meeting.label,
      reason: `insufficient research (${results.length} results)`,
    }
  }

  const draft = await writeFedPost(meeting, results)
  const postId = await publishBlogPost(draft)

  // Fair Housing post-generation check (same pattern as ideas/approve)
  try {
    const fhContent = [draft.title, draft.excerpt, ...draft.body.map((b) =>
      b.children?.map((c) => c.text ?? '').join('') ?? ''
    )].filter(Boolean).join('\n')

    const fhResult = await checkFairHousing(fhContent, 'blog-post')
    await saveFHResult(postId, fhResult)

    if (fhResult.severity === 'violation') {
      const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://legacyhometeamlpt.com').replace(/\/+$/, '')
      const adminSecret = process.env.ADMIN_SECRET ?? ''
      await sendFairHousingAlertEmail({
        postId,
        postTitle: draft.title,
        vaQueueUrl: `${appUrl}/admin/va-queue/${postId}?secret=${encodeURIComponent(adminSecret)}`,
        result: fhResult,
      }).catch((e: { message?: string }) => console.error('[fed-research] FH alert email failed:', e?.message))
    }
  } catch (e) {
    console.error('[fed-research] FH check failed:', e instanceof Error ? e.message : e)
  }

  console.log(`[fed-research] Done — published "${draft.title}"`)
  return { postCreated: true, meetingLabel: meeting.label, postTitle: draft.title }
}
