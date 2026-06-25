/**
 * lib/script-normalizer.ts
 *
 * Converts numerals, prices, years, percentages, decimals, ranges, and
 * measurements in a voiceover script into natural spoken English so the
 * HeyGen avatar reads them like a human (not "two zero two six" for 2026).
 *
 * Backed by Claude Haiku — chosen over regex because the natural-speech
 * rules are context-dependent (years vs prices vs digit sequences), and
 * preserving brand names / URLs / hashtags / handles requires entity
 * awareness that regex can't do reliably.
 *
 * Failure mode is FAIL-SAFE: if the API key is missing, the LLM call
 * errors, or the response is empty, the original script is returned
 * unchanged. Better to ship awkward "two zero two six" than to drop
 * the entire video generation.
 */

import Anthropic from '@anthropic-ai/sdk'

const SYSTEM_PROMPT = `You are a text normalizer for AI voiceover scripts. Your job is to convert all numerals, prices, dates, years, percentages, decimals, large numbers, ranges, and measurements into natural spoken English so an AI avatar reads them like a real person.

RULES:
1. Preserve meaning exactly. Do not add, remove, or paraphrase content.
2. Preserve punctuation, paragraph breaks, line breaks, and sentence structure.
3. Convert numerals into how a human would naturally say them out loud.
4. YEARS are read as years:
   - 1950 → nineteen fifty
   - 1999 → nineteen ninety-nine
   - 2005 → two thousand five
   - 2024 → twenty twenty-four
   - 2026 → twenty twenty-six
5. MONEY in spoken real estate language:
   - $1,500,000 → one million five hundred thousand dollars
   - $1.5M → one point five million dollars
   - $450K → four hundred fifty thousand dollars
   - $750,000 → seven hundred fifty thousand dollars
6. PERCENTAGES:
   - 6.75% → six point seven five percent
   - 3.5% → three point five percent
7. MEASUREMENTS:
   - 2,400 sq ft → twenty-four hundred square feet
   - 1,250 sq ft → twelve hundred fifty square feet
   - 0.25 acres → zero point two five acres
8. RANGES with hyphens or en-dashes:
   - 5-7 minutes → five to seven minutes
   - 5–7 minutes → five to seven minutes
   - $500K-$750K → five hundred thousand to seven hundred fifty thousand dollars
9. DIGIT SEQUENCES (phone numbers, zip codes, addresses) are read digit-by-digit:
   - 911 → nine one one
   - 90210 → nine zero two one zero
   - 1-800-555-0100 → one eight hundred, five five five, zero one zero zero
10. BEDS / BATHS:
    - 2 bed / 2 bath → two bed, two bath
    - 3BR/2BA → three bedroom, two bath
11. PRESERVE EXACTLY (do not transcribe to words):
    - Brand names (Legacy Home Team, Scofield Realty, HeyGen, etc.)
    - URLs (https://, www., .com, .org, etc.)
    - Hashtags (#realestate, #lasvegas)
    - Social handles (@kirbyscofield)
    - File paths (/path/to/file)
    - Code snippets in backticks
    - Ordinals like "first", "second", "third" — leave as words if already words; convert "1st" → "first", "2nd" → "second"

OUTPUT FORMAT:
- Return ONLY the cleaned spoken script.
- No preamble, no explanation, no quotes around it.
- No "Here is the normalized script:" or similar.
- Preserve every newline and paragraph break from the input.`

const HAIKU_MODEL = 'claude-haiku-4-5-20251001'

export interface NormalizeOptions {
  /** Override the model. Default: Claude Haiku 4.5 */
  model?: string
  /** If true, log the input and output to console for debugging. */
  debug?: boolean
}

/**
 * Normalize a voiceover script for AI speech synthesis.
 *
 * @param script - The raw script text that may contain numerals, prices, etc.
 * @returns The same script with numerals expanded to spoken English.
 *          On any failure, returns the original script unchanged (fail-safe).
 *
 * @example
 * await normalizeScriptForSpeech("Hampton Roads home prices hit $1.5M in 2026.")
 * // → "Hampton Roads home prices hit one point five million dollars in twenty twenty-six."
 */
export async function normalizeScriptForSpeech(
  script: string,
  options: NormalizeOptions = {},
): Promise<string> {
  if (!script || script.trim().length === 0) return script

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.warn('[script-normalizer] ANTHROPIC_API_KEY not set — returning script unchanged')
    return script
  }

  const anthropic = new Anthropic({ apiKey })

  try {
    const response = await anthropic.messages.create({
      model: options.model ?? HAIKU_MODEL,
      max_tokens: Math.max(2000, script.length * 3),
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Normalize this script for spoken delivery:\n\n${script}`,
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    const normalized = text || script

    if (options.debug) {
      console.log('[script-normalizer] INPUT:\n' + script)
      console.log('[script-normalizer] OUTPUT:\n' + normalized)
    }

    return normalized
  } catch (err) {
    console.error('[script-normalizer] Normalization failed, returning original:', err instanceof Error ? err.message : err)
    return script
  }
}
