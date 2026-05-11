/**
 * lib/idea-writer.ts
 *
 * Unified writer: turns an approved IdeaCandidate into a publishable BlogPostDraft.
 * Called only after a reviewer approves an idea on /admin/idea-review.
 *
 * Works for both source types:
 *  - daily-research: uses article snippet + proposed angle
 *  - renick-pattern: uses Tavily research + pattern context
 */

import Anthropic from '@anthropic-ai/sdk'
import type { IdeaCandidate, BlogPostDraft, PortableTextBlock, PortableTextSpan } from './types'
import { FAIR_HOUSING_RULES } from './fair-housing'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const SELLER_URL = 'https://listings.legacyhomesearch.com/seller'

// ─── Portable text helpers ────────────────────────────────────────────────────

function makeKey(): string {
  return Math.random().toString(36).slice(2, 10)
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

function lineToBlock(line: string): PortableTextBlock {
  const trimmed = line.trim()
  let style: PortableTextBlock['style'] = 'normal'
  let content = trimmed

  if (trimmed.startsWith('## '))       { style = 'h2';         content = trimmed.slice(3) }
  else if (trimmed.startsWith('### ')) { style = 'h3';         content = trimmed.slice(4) }
  else if (trimmed.startsWith('> '))   { style = 'blockquote'; content = trimmed.slice(2) }

  // Non-paragraph blocks: no inline link processing
  if (style !== 'normal') {
    return {
      _type: 'block', _key: makeKey(), style, markDefs: [],
      children: [{ _type: 'span', _key: makeKey(), text: content, marks: [] }],
    }
  }

  // Expand [SELLER_CTA: text] macros → standard markdown links, then parse all [text](url)
  const expanded = content.replace(/\[SELLER_CTA:\s*([^\]]+)\]/g, (_, t) => `[${t.trim()}](${SELLER_URL})`)
  const mdLinks = [...expanded.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)]

  if (mdLinks.length === 0) {
    return {
      _type: 'block', _key: makeKey(), style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: makeKey(), text: content, marks: [] }],
    }
  }

  const markDefs: Array<{ _type: 'link'; _key: string; href: string }> = []
  const children: PortableTextSpan[] = []
  let cursor = 0

  for (const m of mdLinks) {
    const before = expanded.slice(cursor, m.index!)
    if (before) children.push({ _type: 'span', _key: makeKey(), text: before, marks: [] })
    const linkKey = makeKey()
    markDefs.push({ _type: 'link', _key: linkKey, href: m[2] })
    children.push({ _type: 'span', _key: makeKey(), text: m[1], marks: [linkKey] })
    cursor = m.index! + m[0].length
  }
  const tail = expanded.slice(cursor)
  if (tail) children.push({ _type: 'span', _key: makeKey(), text: tail, marks: [] })

  return {
    _type: 'block', _key: makeKey(), style: 'normal',
    markDefs,
    children,
  }
}

function bodyTextToBlocks(bodyText: string): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = []
  for (const line of bodyText.split('\n').filter((l) => l.trim())) {
    const trimmed = line.trim()
    if (trimmed.startsWith('- ')) {
      blocks.push(lineToBlock('• ' + trimmed.slice(2)))
    } else {
      blocks.push(lineToBlock(trimmed))
    }
  }
  return blocks
}

// ─── Main writer ──────────────────────────────────────────────────────────────

export async function writePostFromIdea(
  idea: IdeaCandidate,
  learningsContext: string,
): Promise<BlogPostDraft> {
  const cityFocus = idea.cityTarget ?? 'Virginia Beach'
  const keyword   = idea.targetKeyword ?? idea.title

  const renickContext = idea.renickTitle
    ? `\nThis idea is inspired by a Renick blog post — "${idea.renickTitle}" — which drove ${idea.renickLift} traffic lift in a comparable market. Match that post's format and intent, translated to Hampton Roads.`
    : ''

  const researchSection = idea.researchData
    ? `\nRESEARCH / SOURCE MATERIAL:\n${idea.researchData.slice(0, 5000)}`
    : ''

  const isLocalHistory = idea.contentType === 'Local History'

  const writingRules = isLocalHistory ? `WRITING RULES (LOCAL HISTORY — STORYTELLING FORMAT):
- Voice: vivid, narrative, journalistic. Barry is a lifelong Hampton Roads resident who genuinely loves the area's history. Write like you're telling a story over coffee, not like a Wikipedia article.
- Open with the most dramatic or surprising fact — a scene, a date, a specific detail that makes the reader say "wait, what?" Examples: "November 22, 1718. A naval officer sailed into Hampton harbor with a severed head hanging from his bow." Drop readers into the moment before explaining who, what, where.
- NEVER start with "Did you know..." — that's overused. Start with the scene or fact itself.
- Structure: dramatic opening hook → historical context (who, what, when, where) → 2–3 ## sections going deeper → ## Why It Still Matters Today (connect history to living in Hampton Roads now) → ## Frequently Asked Questions
- 600–900 words — this format earns longer reads because the story is genuinely interesting
- No Seller CTA for local history posts — this content is for community authority, not lead gen
- Tie the history back to the specific neighborhood, park, landmark, or military base buyers and locals recognize today
- Use real names, dates, and specific details — precision builds credibility
- Avoid: vague generalities, "Hampton Roads has a rich history", "You might be surprised to learn"

SEO RULES (required):
1. Target keyword is: ${keyword} — use it naturally in the opening paragraph, in at least one ## heading, and 2–3 times in the body. Never forced.
2. End with ## Frequently Asked Questions — exactly 3 questions as ### headings, each with a 2–3 sentence answer. Choose questions a local resident or visitor would actually search for related to "${keyword}".
3. Add 1 internal link to a relevant page (e.g., /virginia-beach, /norfolk, /hampton, /communities). Use markdown link syntax.
4. COMMUNITY LINK RULE: On the FIRST mention of any Hampton Roads community by name in the post body, format it as a markdown link: [Virginia Beach](/virginia-beach), [Chesapeake](/chesapeake), [Norfolk](/norfolk), [Suffolk](/suffolk), [Hampton](/hampton), [Newport News](/newport-news). Only the first mention of each.` : `WRITING RULES:
- Voice: knowledgeable, warm, direct. Feels like advice from a trusted neighbor who knows the market cold — not a pitch.
- Open with 1–2 sentences that directly answer the reader's most likely question — short, factual, Hampton Roads-specific. Example: "Closing costs in Virginia Beach typically run 2–5% of the purchase price." This is the featured snippet hook.
- Always tie insights back to what they mean for Hampton Roads buyers/sellers/homeowners specifically
- Include a military/PCS angle where it naturally fits
- Structure: intro (with direct answer) → 2–3 body sections with ## headings → ## What This Means For You (3–4 bullet points) → brief closing → ## Frequently Asked Questions
- 400–500 words total
- SELLER CTA RULE: where the post mentions sellers, homeowners with equity, or what a home is worth, end that sentence with [SELLER_CTA: Find out what your home is worth →] inline. Max 2 times per post, only where it genuinely fits.
- Avoid: salesy language, generic "tips", "as a real estate agent I recommend", excessive CTAs

SEO RULES (required):
1. Target keyword is: ${keyword} — use it naturally in the opening paragraph, in at least one ## heading, and 2–3 times in the body. Never forced.
2. End with ## Frequently Asked Questions — exactly 3 questions as ### headings, each with a 2–3 sentence answer. Choose questions a Hampton Roads buyer, seller, or homeowner would actually search for related to "${keyword}".
3. Add 1 internal link to a relevant page on the site where it genuinely helps the reader (e.g., /blog, /communities, /virginia-beach, /chesapeake). Use markdown link syntax.
4. COMMUNITY LINK RULE: On the FIRST mention of any Hampton Roads community by name in the post body, format it as a markdown link to its community page: [Virginia Beach](/virginia-beach), [Chesapeake](/chesapeake), [Norfolk](/norfolk), [Suffolk](/suffolk), [Hampton](/hampton), [Newport News](/newport-news). Only the first mention of each community — leave all later mentions as plain text.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 6000,
    messages: [{
      role: 'user',
      content: `You are Barry Jenkins, writing for the Legacy Home Search blog in Virginia Beach. Barry has been a Hampton Roads real estate agent for 20+ years, his family lives here, he's sold thousands of homes. He writes to genuinely inform local buyers, sellers, homeowners, and investors — not to sell, but to help them make smarter decisions.

POST BRIEF:
- Title/Angle: ${idea.title}
- Editorial framing: ${idea.angle}
- Why it matters to Hampton Roads residents: ${idea.whyItMatters}
- Category: ${idea.category}
- Content type: ${idea.contentType}
- Primary city focus: ${cityFocus}
- Target keyword: ${keyword}
- Primary audiences: ${idea.audiences.join(', ')}
${renickContext}

BLOG LEARNINGS & STYLE GUIDE (follow all active instructions):
${learningsContext.slice(0, 4000)}
${researchSection}

${FAIR_HOUSING_RULES}
${writingRules}

Return a JSON object with EXACTLY these fields:
{
  "title": "Final polished headline (optimize for keyword: ${keyword})",
  "slug": "url-slug",
  "excerpt": "2–3 sentence summary for blog listing page",
  "metaTitle": "SEO title under 60 chars",
  "metaDescription": "SEO description 120–160 chars",
  "body": "Full post in plain text. Use ## for h2, ### for h3, - for bullets. Must include FAQ section at end."
}

Return ONLY valid JSON, no markdown fences.`,
    }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text.trim() : '{}'

  let raw: Record<string, string>
  try {
    raw = JSON.parse(text)
  } catch {
    // Try extracting a partial JSON object — catches truncation edge cases
    const match = text.match(/\{[\s\S]*"title"\s*:\s*"([^"]+)"/)
    if (!match) throw new Error(`Failed to parse post JSON (stop_reason: ${response.stop_reason}). Try approving again.`)
    throw new Error(`Post generation was cut off mid-response (stop_reason: ${response.stop_reason}). This idea may be too complex — try again.`)
  }

  const blocks = bodyTextToBlocks(raw.body ?? '')

  // Append source credit if we have a source URL
  if (idea.sourceUrls.length > 0) {
    const sourceUrl = idea.sourceUrls[0]
    const sourceName = idea.sourceDomains[0] ?? sourceUrl
    const linkKey = makeKey()
    blocks.push({
      _type: 'block', _key: makeKey(), style: 'normal',
      markDefs: [{ _type: 'link', _key: linkKey, href: sourceUrl }],
      children: [{ _type: 'span', _key: makeKey(), text: `Source: ${sourceName}`, marks: [linkKey] }],
    })
  }

  return {
    title:           raw.title ?? idea.title,
    slug:            raw.slug  ?? slugify(raw.title ?? idea.title),
    excerpt:         raw.excerpt ?? '',
    category:        idea.category,
    metaTitle:       raw.metaTitle ?? '',
    metaDescription: raw.metaDescription ?? '',
    body:            blocks,
    sourceUrl:       idea.sourceUrls[0] ?? '',
    sourceTitle:     idea.renickTitle ?? idea.title,
  }
}
