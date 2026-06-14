import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { title, excerpt, category } = await request.json()
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })

  const prompt = `You are writing a video script for Barry Jenkins. Barry is a long-time Hampton Roads resident who lives in Virginia Beach, has kids in local schools, and owns several investment properties around the area. He happens to also be a real estate agent — but on camera he speaks first as a neighbor, dad, and local investor. He is NOT here in an agent-pitch capacity.

Barry will record a short video (60–90 seconds) to post on social media alongside a blog article. The script should feel natural and conversational — like Barry is talking to another local at a kids' soccer game, not reading a press release.

ARTICLE TITLE: ${title}
EXCERPT: ${excerpt ?? 'No excerpt provided.'}
CATEGORY: ${category ?? 'general'}

Write a video script Barry can read straight from this page. Format it exactly like this:

---

[HOOK — 1 sentence to grab attention]

[2–3 TALKING POINTS — the key things people in Hampton Roads need to know about this topic, in plain English. Each point is 1–2 sentences. Barry speaks from his perspective as a long-time local resident, parent, and investor — not as a real estate agent. He can reference raising kids here, his investment properties, local schools, neighborhoods he's lived in, etc.]

[HOUSING PRICE IMPACT — Barry gives his honest take as someone who owns property in the area: does this topic have a POSITIVE effect on home values in Hampton Roads, a NEGATIVE effect, or NO DIRECT EFFECT on pricing? One clear sentence stating the verdict, then 1–2 sentences explaining why.]

[CALL TO ACTION — 1 sentence inviting viewers to click over and read the full blog post for the deeper breakdown. The blog post is the destination, not a phone call. Phrase it naturally — "I wrote a full breakdown on the blog, the link's in the description / right below this", "Full story on the blog — link's below", "I dove into the numbers on the blog post — give it a read", etc. Vary it so it doesn't sound canned across videos.]

---

Rules:
- Write in first person as Barry ("I", "we", "my kids", "my rentals")
- Do NOT refer to Barry as a real estate agent or realtor in the script. Do not mention Legacy Home Team. He's a local with skin in the game, not a salesperson.
- Do NOT use bullet points or numbered lists — this is spoken word, write it as flowing sentences
- Do NOT include stage directions like [PAUSE] or [SMILE] — just the words Barry says
- Do NOT include the section labels (like "[HOOK]") in the final script — write it as one continuous script
- LENGTH: Match the content — don't pad, don't cut. If the topic is simple and can be said clearly in 30–40 seconds (roughly 75–100 words), keep it that short. If the topic is complex and genuinely needs more explanation, go up to 90 seconds (roughly 200 words). Never exceed 90 seconds. Never pad with filler just to hit a word count.
- Barry's tone: confident, straightforward, genuinely helpful — like a neighbor sharing what he's noticed, not corporate, not salesy

Return ONLY the script text. No intro, no explanation, no markdown formatting.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const script = (message.content[0] as { type: string; text: string }).text.trim()
    return NextResponse.json({ script })
  } catch (err) {
    console.error('[generate-script]', err)
    return NextResponse.json({ error: 'Failed to generate script' }, { status: 500 })
  }
}
