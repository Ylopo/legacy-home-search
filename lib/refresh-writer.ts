/**
 * lib/refresh-writer.ts
 *
 * Executes a content refresh: fetches the existing post, optionally runs a
 * Tavily search for fresh data, then calls Claude to rewrite the post in-place.
 *
 * The post stays published and goes live immediately after writing
 * (ISR revalidates within 60 seconds).
 */

import Anthropic from '@anthropic-ai/sdk'
import { getRefreshablePost } from '../sanity/queries'
import { getSanityWriteClient } from './sanity-write'
import { portableTextToMarkdown, markdownToPortableText } from './portable-text-utils'
import { saveRefreshLog } from './refresh-store'
import type { RefreshAction } from './refresh-config'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const TAVILY_API = 'https://api.tavily.com/search'

// ─── Tavily search (optional fresh-data step) ─────────────────────────────────

async function fetchFreshContext(title: string): Promise<string> {
  const key = process.env.TAVILY_API_KEY
  if (!key) return ''

  try {
    const res = await fetch(TAVILY_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: key,
        query: `${title} Hampton Roads Virginia Beach 2026`,
        search_depth: 'basic',
        max_results: 3,
        include_answer: false,
      }),
    })
    if (!res.ok) return ''
    const data = await res.json()
    const snippets: string[] = (data.results ?? []).map(
      (r: { title: string; content: string; url: string }) =>
        `Source: ${r.title}\n${r.content.slice(0, 400)}`
    )
    return snippets.join('\n\n')
  } catch {
    return ''
  }
}

// ─── Main refresh function ────────────────────────────────────────────────────

interface RefreshResult {
  success: boolean
  slug?: string
  title?: string
  error?: string
}

export async function refreshPost(
  postId: string,
  playbook: string[],
  action: RefreshAction,
  refreshTier: string,
): Promise<RefreshResult> {
  // 1. Fetch full post from Sanity
  const post = await getRefreshablePost(postId)
  if (!post) {
    return { success: false, error: 'Post not found in Sanity' }
  }

  // 2. Convert existing body to markdown for Claude context
  const existingBodyMarkdown = post.body ? portableTextToMarkdown(post.body) : ''

  // 3. Optionally fetch fresh context via Tavily for high-priority refreshes
  let researchContext = ''
  if (
    action === 'full-refresh' &&
    (refreshTier === 'fast-changing' ||
      refreshTier === 'competitive' ||
      refreshTier === 'news-trend')
  ) {
    researchContext = await fetchFreshContext(post.title)
  }

  const today = new Date().toISOString().slice(0, 10)
  const playbookText = playbook.map((item, i) => `${i + 1}. ${item}`).join('\n')

  const researchSection = researchContext
    ? `\nFRESH RESEARCH (use for updated facts/data):\n${researchContext}\n`
    : ''

  // 4. Call Claude to rewrite the post
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 6000,
    messages: [
      {
        role: 'user',
        content: `You are Barry Jenkins, writing for the Legacy Home Search blog in Virginia Beach. Barry has 20+ years of Hampton Roads real estate experience. He writes to genuinely inform local buyers, sellers, homeowners, and investors — not to sell.

Today's date: ${today}

TASK: Refresh the following published blog post. Keep what's working, update what's stale, and follow the refresh playbook exactly.

EXISTING POST:
Title: ${post.title}
Category: ${post.category}
Excerpt: ${post.excerpt ?? '(none)'}
Published: ${post.publishedAt?.slice(0, 10) ?? 'unknown'}
SEO Title: ${post.metaTitle ?? ''}
SEO Description: ${post.metaDescription ?? ''}

Body:
${existingBodyMarkdown}
${researchSection}
REFRESH PLAYBOOK (follow each item):
${playbookText}

WRITING VOICE & STRUCTURE:
- Voice: knowledgeable, warm, direct — trusted neighbor who knows the market
- Open with 1–2 sentences that directly answer the reader's most likely question — short, factual, Hampton Roads-specific. This is the featured snippet hook Google looks for.
- Always tie insights back to Hampton Roads buyers/sellers/homeowners specifically
- Structure: intro (with direct answer) → 2–3 body sections with ## headings → ## What This Means For You (3–4 bullets) → brief closing → ## Frequently Asked Questions
- 400–500 words
- SELLER CTA RULE: where the post mentions sellers, homeowners with equity, or home valuations, end that sentence with [SELLER_CTA: Find out what your home is worth →] inline. Max 2 times, only where it genuinely fits.
- Preserve all existing internal links where they still make sense; add 1 more if a new relevant page fits
- Do not add salesy language or excessive CTAs

SEO RULES (required):
1. Keep the post's primary keyword (derived from the title) in the opening paragraph, at least one ## heading, and 2–3 times in the body naturally.
2. If the existing post has a ## Frequently Asked Questions section, refresh the Q&A with updated answers. If it does not have one, add it at the end: exactly 3 questions as ### headings, each with a 2–3 sentence answer relevant to Hampton Roads.

Return a JSON object with EXACTLY these fields:
{
  "title": "Refreshed headline (keep keyword-optimized, update year if present)",
  "excerpt": "Updated 2–3 sentence summary",
  "metaTitle": "SEO title under 60 chars",
  "metaDescription": "SEO description 120–160 chars",
  "body": "Full refreshed post in plain text. Use ## for h2, ### for h3, - for bullets. Must include FAQ section at end."
}

Return ONLY valid JSON, no markdown fences.`,
      },
    ],
  })

  const rawText =
    response.content[0].type === 'text' ? response.content[0].text.trim() : '{}'

  let parsed: Record<string, string>
  try {
    parsed = JSON.parse(rawText)
  } catch {
    return { success: false, error: 'Claude returned invalid JSON — try refreshing again' }
  }

  // 5. Convert body markdown → PortableText
  const newBody = markdownToPortableText(parsed.body ?? existingBodyMarkdown)

  // 6. Patch Sanity
  const writeClient = getSanityWriteClient()
  await writeClient
    .patch(postId)
    .set({
      title:              parsed.title ?? post.title,
      excerpt:            parsed.excerpt ?? post.excerpt,
      body:               newBody,
      metaTitle:          parsed.metaTitle ?? post.metaTitle,
      metaDescription:    parsed.metaDescription ?? post.metaDescription,
      lastRefreshedAt:    new Date().toISOString(),
      refreshCount:       (post.refreshCount ?? 0) + 1,
    })
    .commit()

  // 7. Save audit log
  await saveRefreshLog({
    postId,
    postTitle: parsed.title ?? post.title,
    refreshedAt: new Date().toISOString(),
    action,
    playbook,
    claudeModel: 'claude-sonnet-4-6',
  })

  return {
    success: true,
    slug: post.slug,
    title: parsed.title ?? post.title,
  }
}
