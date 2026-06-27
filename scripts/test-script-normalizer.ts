/**
 * scripts/test-script-normalizer.ts
 *
 * Manual test harness for lib/script-normalizer.ts. Runs each fixture
 * through normalizeScriptForSpeech and prints input + output side-by-side,
 * plus an assertion check for expected substrings in the output.
 *
 * Run: `npx tsx scripts/test-script-normalizer.ts`
 *
 * Requires ANTHROPIC_API_KEY in the environment (load from .env.local
 * manually if running outside Next.js).
 */

import { normalizeScriptForSpeech } from '../lib/script-normalizer'

interface Fixture {
  label: string
  input: string
  /** Substrings we expect to find in the output. */
  expect: string[]
  /** Substrings that must NOT appear in the output. */
  forbid?: string[]
}

const FIXTURES: Fixture[] = [
  // ── YEARS ──
  {
    label: '1. Year in 1900s',
    input: 'The house was built in 1950.',
    expect: ['nineteen fifty'],
    forbid: ['1950'],
  },
  {
    label: '2. Year ending in 99',
    input: 'Records from 1999 show a different market.',
    expect: ['nineteen ninety-nine'],
    forbid: ['1999'],
  },
  {
    label: '3. Early 2000s year',
    input: 'Back in 2005, prices were much lower.',
    expect: ['two thousand five'],
    forbid: ['2005'],
  },
  {
    label: '4. Recent year (2024)',
    input: 'Throughout 2024, inventory stayed tight.',
    expect: ['twenty twenty-four'],
    forbid: ['2024'],
  },
  {
    label: '5. Current year (2026)',
    input: 'The June 2026 Fed decision is here.',
    expect: ['twenty twenty-six'],
    forbid: [' 2026'],
  },

  // ── MONEY ──
  {
    label: '6. Large dollar amount with commas',
    input: 'The home sold for $1,500,000 last week.',
    expect: ['one million five hundred thousand dollars'],
    forbid: ['$1,500,000'],
  },
  {
    label: '7. K shorthand',
    input: 'A typical down payment is $50K.',
    expect: ['fifty thousand dollars'],
    forbid: ['$50K'],
  },
  {
    label: '8. M shorthand with decimal',
    input: 'Listing at $1.5M, well above asking.',
    expect: ['one point five million dollars'],
    forbid: ['$1.5M'],
  },
  {
    label: '9. Mid-range price',
    input: 'Most starter homes here run $450K.',
    expect: ['four hundred fifty thousand dollars'],
    forbid: ['$450K'],
  },

  // ── PERCENTAGES ──
  {
    label: '10. Whole percent',
    input: 'Mortgage rates climbed to 7%.',
    expect: ['seven percent'],
    forbid: ['7%'],
  },
  {
    label: '11. Decimal percent',
    input: 'The Fed funds rate is now 3.5%.',
    expect: ['three point five percent'],
    forbid: ['3.5%'],
  },
  {
    label: '12. Two-decimal percent',
    input: 'A typical 30-year fixed is around 6.75% today.',
    expect: ['six point seven five percent'],
    forbid: ['6.75%'],
  },

  // ── SQUARE FOOTAGE ──
  {
    label: '13. Comma-separated sq ft',
    input: 'This 2,400 sq ft ranch has room to spread out.',
    expect: ['square feet'],
    forbid: ['2,400 sq ft'],
  },
  {
    label: '14. Smaller sq ft',
    input: 'A cozy 1,250 sq ft condo.',
    expect: ['square feet'],
    forbid: ['1,250 sq ft'],
  },

  // ── ACRES / MEASUREMENTS ──
  {
    label: '15. Decimal acres',
    input: 'Sitting on 0.25 acres in Summerlin.',
    expect: ['zero point two five acres'],
    forbid: ['0.25 acres'],
  },

  // ── PHONE / ZIP / DIGITS ──
  {
    label: '16. Emergency number',
    input: 'When in doubt, call 911 first.',
    expect: ['nine one one'],
    forbid: [' 911'],
  },
  {
    label: '17. Zip code',
    input: 'Properties in 90210 hold their value.',
    expect: ['nine zero two one zero'],
    forbid: ['90210'],
  },

  // ── RANGES ──
  {
    label: '18. Range with hyphen',
    input: 'Plan on 5-7 minutes from the freeway.',
    expect: ['five to seven minutes'],
    forbid: ['5-7'],
  },
  {
    label: '19. Range with en-dash',
    input: 'Closing usually takes 30–45 days.',
    expect: ['thirty to forty-five days'],
    forbid: ['30–45'],
  },

  // ── BEDS / BATHS ──
  {
    label: '20. Beds and baths slash',
    input: 'A clean 2 bed / 2 bath layout.',
    expect: ['two bed', 'two bath'],
    forbid: ['2 bed', '2 bath'],
  },
  {
    label: '21. BR/BA shorthand',
    input: 'Looking for a 3BR/2BA in Henderson.',
    expect: ['three bedroom', 'two bath'],
    forbid: ['3BR', '2BA'],
  },

  // ── PRESERVATION OF NON-NUMERIC TOKENS ──
  {
    label: '22. Preserve URL',
    input: 'Visit https://legacyhometeamlpt.com for the full guide.',
    expect: ['https://legacyhometeamlpt.com'],
  },
  {
    label: '23. Preserve hashtag',
    input: 'Follow #hamptonroads for more updates.',
    expect: ['#hamptonroads'],
  },
  {
    label: '24. Preserve handle',
    input: 'Send a DM to @barryjenkinsrealtor.',
    expect: ['@barryjenkinsrealtor'],
  },

  // ── COMBINED ──
  {
    label: '25. Combined real-world script',
    input:
      'Welcome back. The Fed just held rates steady at 5.25%, and Hampton Roads home prices climbed to a median of $425K in 2026. A typical 3BR/2BA at 1,800 sq ft on 0.15 acres now closes in 30–45 days.',
    expect: [
      'five point two five percent',
      'four hundred twenty-five thousand dollars',
      'twenty twenty-six',
      'three bedroom',
      'two bath',
      'square feet',
      'zero point one five acres',
      'thirty to forty-five days',
    ],
    forbid: ['5.25%', '$425K', ' 2026', '3BR', '2BA', '1,800 sq ft', '0.15 acres', '30–45'],
  },

  // ── NEW: ADDITIONAL YEARS ──
  {
    label: '26. Year 1976 (bicentennial)',
    input: 'The neighborhood was founded in 1976.',
    expect: ['nineteen seventy-six'],
    forbid: ['1976'],
  },
  {
    label: '27. Year 2001',
    input: 'Records from 2001 show the first big spike.',
    expect: ['two thousand one'],
    forbid: ['2001'],
  },
  {
    label: '28. Year 2010',
    input: 'By 2010, the market had fully recovered.',
    expect: ['twenty ten'],
    forbid: [' 2010'],
  },

  // ── NEW: WRITTEN-OUT MILLIONS / BILLIONS ──
  {
    label: '29. $28 million (with word "million")',
    input: 'The complex sold for $28 million last quarter.',
    expect: ['twenty-eight million dollars'],
    forbid: ['$28 million'],
  },
  {
    label: '30. $2.4 billion',
    input: 'The portfolio is now valued at $2.4 billion.',
    expect: ['two point four billion dollars'],
    forbid: ['$2.4 billion'],
  },
  {
    label: '31. $3,500,000 (comma format)',
    input: 'Howard Hughes paid $3,500,000 for the land.',
    expect: ['three million five hundred thousand dollars'],
    forbid: ['$3,500,000'],
  },

  // ── NEW: LARGE NON-CURRENCY NUMBERS ──
  {
    label: '32. 25,000 acres (large round number)',
    input: 'He purchased 25,000 acres outside the city.',
    expect: ['twenty-five thousand acres'],
    forbid: ['25,000'],
  },
  {
    label: '33. 1,250 (mid four-digit number)',
    input: 'The HOA serves 1,250 households.',
    expect: ['one thousand two hundred fifty'],
    forbid: ['1,250'],
  },
  {
    label: '34. 7,500,000 (large seven-digit number)',
    input: 'The development plan covers 7,500,000 square feet of mixed use.',
    expect: ['seven million five hundred thousand'],
    forbid: ['7,500,000'],
  },

  // ── NEW: DATES ──
  {
    label: '35. Full date with year (July 4, 2026)',
    input: 'The grand opening is July 4, 2026.',
    expect: ['July fourth, twenty twenty-six'],
    forbid: ['July 4, 2026', '7/4'],
  },
  {
    label: '36. Date without year (December 25)',
    input: 'Listings tend to slow down around December 25.',
    expect: ['December twenty-fifth'],
    forbid: ['December 25'],
  },
  {
    label: '37. Date with ordinal suffix (October 15th)',
    input: 'The escrow closed on October 15th.',
    expect: ['October fifteenth'],
    forbid: ['October 15th', 'October 15.'],
  },

  // ── NEW: TIMES ──
  {
    label: '38. AM time with minutes',
    input: 'The open house starts at 7:30 AM.',
    expect: ['seven thirty'],
    forbid: ['7:30 AM', '7:30'],
  },
  {
    label: '39. Noon (12:00 PM)',
    input: 'Showings run until 12:00 PM on Sundays.',
    expect: ['noon'],
    forbid: ['12:00 PM', '12:00'],
  },
  {
    label: '40. Midnight (12:00 AM)',
    input: 'The application deadline is 12:00 AM Friday.',
    expect: ['midnight'],
    forbid: ['12:00 AM', '12:00'],
  },

  // ── NEW: MEASUREMENTS (written-out unit) ──
  {
    label: '41. Acres (no comma, "acres" already spelled out)',
    input: 'The lot is 5 acres of usable land.',
    expect: ['five acres'],
    forbid: ['5 acres'],
  },
  {
    label: '42. Miles with decimal',
    input: 'The drive is 2.5 miles each way.',
    expect: ['two point five miles'],
    forbid: ['2.5 miles'],
  },
  {
    label: '43. Square feet ("square feet" written out)',
    input: 'A 3,400 square feet home in the foothills.',
    expect: ['three thousand four hundred square feet'],
    forbid: ['3,400 square feet'],
  },

  // ── NEW: ORDINALS ──
  {
    label: '44. Ordinal 1st',
    input: 'This is the 1st quarter of strong sales.',
    expect: ['first'],
    forbid: ['1st'],
  },
  {
    label: '45. Ordinal 25th',
    input: 'The 25th anniversary of the brokerage was last month.',
    expect: ['twenty-fifth'],
    forbid: ['25th'],
  },
  {
    label: '46. Large ordinal 250th',
    input: 'We just closed our 250th transaction of the year.',
    expect: ['two hundred fiftieth'],
    forbid: ['250th'],
  },

  // ── NEW: THE HOWARD HUGHES EXAMPLE (operator-supplied gold standard) ──
  {
    label: '47. Howard Hughes — gold standard combined example',
    input:
      'Howard Hughes purchased 25,000 acres in 1950 for $3,500,000. By 2026, homes in the area were selling for over $1,500,000.',
    expect: [
      'twenty-five thousand acres',
      'nineteen fifty',
      'three million five hundred thousand dollars',
      'twenty twenty-six',
      'one million five hundred thousand dollars',
    ],
    forbid: ['25,000', ' 1950', '$3,500,000', ' 2026', '$1,500,000'],
  },
]

// ── Runner ──────────────────────────────────────────────────────────────────

async function run(): Promise<void> {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Missing ANTHROPIC_API_KEY. Source .env.local first:')
    console.error('  set -a; source .env.local; set +a; npx tsx scripts/test-script-normalizer.ts')
    process.exit(1)
  }

  console.log(`\nRunning ${FIXTURES.length} fixtures through normalizeScriptForSpeech…\n`)

  let pass = 0
  let fail = 0
  const failures: Array<{ label: string; reason: string; output: string }> = []

  for (const fx of FIXTURES) {
    const output = await normalizeScriptForSpeech(fx.input)

    const missing = fx.expect.filter((s) => !output.toLowerCase().includes(s.toLowerCase()))
    const leaked = (fx.forbid ?? []).filter((s) => output.includes(s))

    const ok = missing.length === 0 && leaked.length === 0
    if (ok) {
      pass++
      console.log(`✓ ${fx.label}`)
    } else {
      fail++
      const reason = [
        missing.length > 0 ? `missing: ${missing.map((s) => `"${s}"`).join(', ')}` : null,
        leaked.length > 0 ? `should not contain: ${leaked.map((s) => `"${s}"`).join(', ')}` : null,
      ]
        .filter(Boolean)
        .join('; ')
      console.log(`✗ ${fx.label}`)
      console.log(`  in:  ${fx.input}`)
      console.log(`  out: ${output}`)
      console.log(`  ${reason}`)
      failures.push({ label: fx.label, reason, output })
    }
  }

  console.log(`\n──────────────────────────`)
  console.log(`${pass} passed · ${fail} failed`)
  console.log(`──────────────────────────\n`)

  if (failures.length > 0) {
    console.log('Failures (for prompt tuning):')
    for (const f of failures) {
      console.log(`  - ${f.label}: ${f.reason}`)
    }
    process.exit(1)
  }
}

run().catch((err) => {
  console.error('Test runner crashed:', err)
  process.exit(1)
})
