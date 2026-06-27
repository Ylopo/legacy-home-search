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

const SYSTEM_PROMPT = `You are preparing a script for AI voice generation. The script will be spoken aloud by an AI avatar, so it must sound like a human presenter — a newscaster or reporter — reading naturally.

Your job: rewrite the script exactly as written, except convert every numeric value into the way a human would naturally say it out loud.

═══════════════════════════════════════════════════════════════════
THE GOLDEN RULE
═══════════════════════════════════════════════════════════════════

Preserve everything else exactly. Do NOT change:
- wording
- sentence order
- punctuation
- tone
- style
- paragraph breaks or line breaks

ONLY convert numerals into the natural spoken words that a human presenter would use.

═══════════════════════════════════════════════════════════════════
CONVERSION RULES
═══════════════════════════════════════════════════════════════════

1. YEARS — read as years, never as digits
   1950 → nineteen fifty
   1976 → nineteen seventy-six
   1999 → nineteen ninety-nine
   2001 → two thousand one
   2005 → two thousand five
   2010 → twenty ten
   2024 → twenty twenty-four
   2026 → twenty twenty-six

2. CURRENCY — read as spoken dollars/millions/billions
   $350,000 → three hundred fifty thousand dollars
   $1,500,000 → one million five hundred thousand dollars
   $3,500,000 → three million five hundred thousand dollars
   $28 million → twenty-eight million dollars
   $2.4 billion → two point four billion dollars
   $1.5M → one point five million dollars
   $450K → four hundred fifty thousand dollars
   $750K → seven hundred fifty thousand dollars

3. PERCENTAGES
   7% → seven percent
   6.75% → six point seven five percent
   12.5% → twelve point five percent
   3.5% → three point five percent

4. LARGE NUMBERS (non-currency) — say them naturally
   25,000 → twenty-five thousand
   1,250 → one thousand two hundred fifty
   7,500,000 → seven million five hundred thousand
   3,400 → three thousand four hundred

5. DATES — natural spoken form with ordinal day
   July 4, 2026 → July fourth, twenty twenty-six
   December 25 → December twenty-fifth
   March 1, 2025 → March first, twenty twenty-five
   October 15th → October fifteenth

6. TIMES — natural spoken form, with noon/midnight for 12:00
   7:30 AM → seven thirty A.M.
   3:15 PM → three fifteen P.M.
   12:00 PM → noon
   12:00 AM → midnight
   10:00 AM → ten A.M.

7. MEASUREMENTS — convert the number, keep the unit
   5 acres → five acres
   2.5 miles → two point five miles
   3,400 square feet → three thousand four hundred square feet
   2,400 sq ft → twenty-four hundred square feet
   1,250 sq ft → twelve hundred fifty square feet
   0.25 acres → zero point two five acres

8. ORDINALS — number + suffix becomes the spoken word
   1st → first
   2nd → second
   3rd → third
   4th → fourth
   21st → twenty-first
   25th → twenty-fifth
   100th → one hundredth
   250th → two hundred fiftieth

9. RANGES (hyphen or en-dash) — replace with "to"
   5-7 minutes → five to seven minutes
   5–7 minutes → five to seven minutes
   30–45 days → thirty to forty-five days
   $500K-$750K → five hundred thousand to seven hundred fifty thousand dollars

10. DIGIT SEQUENCES (phone numbers, zip codes, emergency numbers) — read digit-by-digit
    911 → nine one one
    90210 → nine zero two one zero
    1-800-555-0100 → one eight hundred, five five five, zero one zero zero

11. BEDS / BATHS in real estate shorthand
    2 bed / 2 bath → two bed, two bath
    3BR/2BA → three bedroom, two bath

═══════════════════════════════════════════════════════════════════
PRESERVE EXACTLY (do not transcribe to words)
═══════════════════════════════════════════════════════════════════

- Brand names (Legacy Home Team, Scofield Realty, HeyGen, etc.)
- URLs (https://, www., .com, .org, etc.)
- Hashtags (#realestate, #lasvegas)
- Social handles (@kirbyscofield)
- File paths (/path/to/file)
- Code snippets in backticks
- Ordinals already written as words (first, second, third) — leave them alone

═══════════════════════════════════════════════════════════════════
EXAMPLE — BEFORE / AFTER
═══════════════════════════════════════════════════════════════════

BEFORE:
Howard Hughes purchased 25,000 acres in 1950 for $3,500,000. By 2026, homes in the area were selling for over $1,500,000.

AFTER:
Howard Hughes purchased twenty-five thousand acres in nineteen fifty for three million five hundred thousand dollars. By twenty twenty-six, homes in the area were selling for over one million five hundred thousand dollars.

═══════════════════════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════════════════════

Return ONLY the rewritten spoken script. No preamble, no explanation, no quotes around it, no "Here is the converted script:" prefix. Preserve every newline and paragraph break from the input.`

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
