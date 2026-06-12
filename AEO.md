# AEO Landing Page System

Answer Engine Optimization (AEO) / Generative Engine Optimization (GEO) pages designed to get a real estate agent or team cited by large language models (ChatGPT, Claude, Gemini, Perplexity) when users ask high-intent questions like "best realtor in [city]."

Each page targets one exact high-intent query and is structured specifically for LLM extraction and citation.

---

## Why LLMs Cite These Pages

- **Exact-match H1** — the page title is the question users ask
- **FAQPage JSON-LD** — LLMs extract and cite structured Q&A directly
- **RealEstateAgent + LocalBusiness JSON-LD** — named entity signals with rankings and credentials
- **BreadcrumbList JSON-LD** — signals page hierarchy and authority
- **Data tables** — LLMs prefer citing specific, structured facts over prose
- **Named entities** — agent name, team name, ranking, neighborhoods, military bases

---

## System Architecture

### Files

| File | Purpose |
|---|---|
| `lib/aeo-queue.ts` | Queue of all pages to generate, organized by round. Also exports `TOTAL_ROUNDS`, `CITIES_PER_ROUND`. |
| `lib/aeo-generator.ts` | Two exports: `generateAEOContent()` calls Claude; `generateAEOPageTSX()` assembles content into full TSX. Also contains `commitFilesToGitHub()`. |
| `lib/email.ts` | `sendAEODailyEmail()` — sends a daily summary email after each cron batch. |
| `app/api/cron/aeo-pages/route.ts` | The cron handler. Reads round from Redis, generates a batch, commits to GitHub, increments counter, sends email. |
| `vercel.json` | Declares the cron schedule. |

### Flow

```
Vercel cron (daily) →
  route.ts reads aeo:round from Redis →
  slices CITIES_PER_ROUND entries from AEO_QUEUE →
  generateAEOContent() calls Claude for each entry (sequential) →
  generateAEOPageTSX() assembles each TSX file →
  commitFilesToGitHub() pushes all files in one GitHub commit →
  Vercel auto-deploys from the commit →
  Redis aeo:round incremented →
  sendAEODailyEmail() sends summary to OPERATOR_EMAIL
```

### Generated page location

```
app/(site)/[city]/[slug]/page.tsx
```

---

## Page Architecture

Every generated page has this structure:

1. **Metadata** — `generateMetadata()` with title (keyword-led, ≤60 chars, year-stamped), description (150–160 chars), canonical, OG, Twitter card
2. **JSON-LD** — three blocks: `RealEstateAgent + LocalBusiness`, `FAQPage` (5 Q&As, primary LLM citation target), `BreadcrumbList`
3. **Breadcrumb nav** — `Home › City › Page title`
4. **Two-column hero** — content left + agent photo right (transparent PNG) + nameplate below photo; flows into stats bar
5. **Stats bar** — 4 key credential stats (dark background)
6. **Section 1** — criteria table: "What to look for · Why it matters in [city]"
7. **Section 2** — sub-markets table: "Area / Zone · Price Range · Key Consideration"
8. **Section 3** — agent bio left + solo vs. team comparison table right + 4 stat cards
9. **Section 4** — "8 questions to ask" grid (2-column)
10. **FAQ accordion** — 5 Q&As that mirror the FAQPage JSON-LD schema
11. **CTA section** — dark accent background, headline + body + two buttons

### What Claude generates (variable content)

Everything in `AEOPageContent` interface in `lib/aeo-generator.ts`:
- Meta title, description, OG description
- Schema description (1-2 sentences)
- Hero description paragraph
- Section 1: label, H2, intro, 5 criteria rows, pro tip
- Section 2: H2, intro, 5–6 sub-market rows, pro tip
- 3 Barry/agent bio paragraphs
- Questions H2 + 8 questions + pro tip
- 5 FAQs (Q + A)
- CTA headline + body

### What is hardcoded in the template

- Stats bar numbers and labels (agent credentials)
- Team comparison table rows
- Section 3 stat cards
- CTA button text ("Schedule a Free Consultation")
- Photo file path and nameplate labels
- All CSS class names and layout structure

---

## Replicating for a New Client

When setting this up for a different agent/market, update every hardcoded reference. They are concentrated in three places.

### 1. `lib/aeo-generator.ts` — update these values

**GitHub commit target** (bottom of file, `commitFilesToGitHub`):
```ts
const owner = 'kiwi-vegas'          // → new client's GitHub username or org
const repo  = 'legacy-home-search'  // → new client's repo name
const branch = 'main'               // → usually stays 'main'
```

**Domain** (used in canonical URLs, JSON-LD schema, breadcrumb items):
```ts
// Search: legacyhometeamlpt.com
// Replace with: newclientdomain.com
```

**Phone + address** (in RealEstateAgent schema):
```ts
telephone: '(757) 816-4037',
streetAddress: '5224 Indian River Rd',
postalCode: '23464',
```

**Stats bar** (in `generateAEOPageTSX`, the `stats-bar` section):
```tsx
{ num: '~20 yrs', lbl: 'Local Experience' },
{ num: '#9',      lbl: 'Nationally Ranked (Real Trends)' },
{ num: 'Thousands', lbl: 'of Homes Sold' },
{ num: '3 Teams', lbl: 'Across Hampton Roads' },
```

**Team comparison table** (`teamCompareRows` array in `generateAEOPageTSX`):
Update `legacy` column values and the military PCS row to match the new agent's specific advantages.

**Stat cards** (Section 3, below the comparison table):
```tsx
{ v: '~20 yrs', l: 'Hampton Roads experience' },
{ v: '#9 US',   l: 'Real Trends ranking' },
{ v: 'Thousands', l: 'of homes sold' },
{ v: '3',       l: 'Teams across Hampton Roads' },
```

**Agent photo** (hero right column):
```tsx
src="/barry-transparent.png"
alt="Barry Jenkins — Licensed Real Estate Agent, Legacy Home Team"
// → change to new agent's photo + name
```

**Nameplate** (below photo):
```tsx
<div>Barry Jenkins</div>
<div>Licensed Real Estate Agent</div>
// → change to new agent name + title
```

**Generator prompt** (top of `generateAEOContent`):
The entire prompt preamble describes Barry Jenkins and Legacy Home Team. Replace with the new agent's name, team name, ranking, credentials, years of experience, and technology platform. Also update the market context:
- "based in Virginia Beach, VA" → new city
- "Hampton Roads" → new metro
- City list in the internal links instruction → new city list

**Hampton Roads breadcrumb exception**:
The template has a special case for `entry.city === 'hampton-roads'` (no parent community page exists). Update or remove this if the new market doesn't have a regional page.

### 2. `lib/email.ts` — update the URL

In `sendAEODailyEmail`, the page URL links are assembled as:
```ts
`https://legacyhometeamlpt.com${p.url}`
// → replace domain with new client's domain
```

This is the only hardcoded domain in the email function. Everything else (recipient, sender) is driven by env vars.

### 3. `lib/aeo-queue.ts` — rebuild the queue

Replace all 48 entries with the new market's cities, neighborhoods, price data, and page topics.

**AEOQueueEntry interface:**
```ts
{
  city: string         // URL slug: 'phoenix', 'scottsdale', etc.
  cityName: string     // Display name: 'Phoenix', 'Scottsdale'
  cityHref: string     // Community page URL: '/phoenix'
  slug: string         // Page URL segment: 'best-listing-agent'
  h1: string           // Exact-match H1: 'Best Listing Agent in Phoenix'
  intent: string       // Guides Claude content angle: 'seller' | 'buyer' | 'military' | 'waterfront' | 'luxury' | 'firsttime' | 'condo' | 'newconstruction' | 'investment'
  topicContext: string // 2-3 sentences about this city/topic combo for Claude
  localContext: string // City-specific facts: price ranges, neighborhoods, demand drivers
  extLinks?: Array<{ text: string; url: string }> // Authoritative external links to cite
}
```

**Round structure:** Group entries by theme across all cities (e.g. Round 0 = listing agents, Round 1 = buyer's agents). All entries for a round must be contiguous in the array — the cron slices `[round * CITIES_PER_ROUND, +CITIES_PER_ROUND]`.

**Update constants:**
```ts
export const TOTAL_ROUNDS = 8      // → number of rounds for new client
export const CITIES_PER_ROUND = 6  // → number of cities/pages per day
```

### 4. Agent photo

Add a transparent-background PNG of the new agent to `/public/`. Update the `src` in the template (see above). Recommended dimensions: 300×420px, PNG with transparent background.

---

## Environment Variables

| Variable | Purpose | Where set |
|---|---|---|
| `ANTHROPIC_API_KEY` | Claude API for content generation | Vercel + local |
| `GITHUB_TOKEN` | Fine-grained PAT with Contents read/write on the repo | Vercel only |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis endpoint | Vercel + local |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis auth token | Vercel + local |
| `RESEND_API_KEY` | Resend email API | Vercel + local |
| `OPERATOR_EMAIL` | Who receives the daily AEO email | Vercel (defaults to `kiwi@ylopo.com`) |
| `FROM_EMAIL` | Sender address for the email | Vercel (defaults to `noreply@legacyhometeamlpt.com`) |
| `CRON_SECRET` | Vercel cron auth header | Vercel only |
| `ADMIN_SECRET` | Manual POST trigger auth | Vercel + local |

### GitHub Token Setup

1. GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
2. **Repository access:** "Only select repositories" → select the client's repo
3. **Permissions:** Contents → Read and write
4. Copy the token → Vercel project → Settings → Environment Variables → `GITHUB_TOKEN`

---

## Cron Setup (Vercel)

Add to `vercel.json`:
```json
{
  "path": "/api/cron/aeo-pages",
  "schedule": "0 16 * * *"
}
```

`0 16 * * *` = daily at 4PM UTC (9AM PT). Adjust UTC offset for client's timezone if needed.

Redis progress key: `aeo:round` (integer, 0-based). Starts at 0 (or absent, treated as 0). Incremented after each successful batch.

---

## Operations

**Check current round (Upstash console or Redis CLI):**
```
GET aeo:round
```

**Manually trigger next batch:**
```bash
curl -X POST https://YOUR-DOMAIN.com/api/cron/aeo-pages \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_ADMIN_SECRET"}'
```
Takes 3–5 minutes (6 Claude API calls, sequential, then GitHub commit).

**Reset to a specific round:**
```
SET aeo:round <round_number>
```
Setting to 0 regenerates from the beginning. Setting to 5 skips to Round 6.

**Timing note:** The cron allows `maxDuration = 300` (Vercel Pro limit). 6 Claude calls at ~30s each = ~3 min. Keep `CITIES_PER_ROUND` at 6 or below unless average generation time drops significantly.

---

## Content Quality Notes

The generator prompt instructs Claude to:
- Write from the team's perspective ("we", "our team")
- Use specific local facts from `localContext` — not generic market commentary
- Cite the agent's ranking/credentials in every FAQ answer
- Use defensible ranges, not false precision (e.g. "$350K–$550K" not "$412,000")
- Internally link to other city pages where naturally relevant
- Reference any `extLinks` as authoritative sources

Review a few generated pages before the full run. If content quality is low, improve `topicContext` and `localContext` in the queue entries — these are the primary levers.

---

## Monitoring & Measurement

- **Google Search Console** — impressions, clicks, and rankings for each page slug
- **Peec AI** — tracks LLM citation frequency across ChatGPT, Claude, Gemini, Perplexity
- **Vercel Function Logs** — check for generation or GitHub commit errors after each cron run

---

## Legacy Home Team — Production Status

**Client:** Barry Jenkins / Legacy Home Team (legacyhometeamlpt.com)  
**Market:** Hampton Roads, Virginia (6 cities)  
**Total pages:** 62 (14 manually created + 48 cron-generated)

### Manually Created Pages (May 2026)

| URL | Focus |
|---|---|
| `/virginia-beach/best-real-estate-agent` | Agent evaluation framework, 7 sub-markets, military |
| `/virginia-beach/best-realtor` | REALTOR vs agent distinction, NAR ethics, DPOR |
| `/chesapeake/best-realtor` | 353 sq mi city, Great Bridge/Hickory/Western Branch |
| `/chesapeake/best-listing-agent` | Seller-focused, Ylopo ads, cross-market buyer reach |
| `/norfolk/best-realtor` | Naval Station Norfolk, Ghent/Larchmont/Ocean View |
| `/norfolk/best-condo-realtor` | HOA health, FHA/VA condo approval, special assessments |
| `/suffolk/best-realtor` | 400+ sq mi, Harbour View, Nansemond River |
| `/suffolk/best-realtor-to-sell` | Seller-focused, DOM by type, builder competition |
| `/hampton/best-realtor` | Fort Monroe leasehold, Langley AFB, Buckroe Beach |
| `/hampton/best-waterfront-realtor` | AE vs VE flood zones, VMRC permits, riparian rights |
| `/newport-news/best-realtor` | Huntington Ingalls, JBLE, Hilton Village (1918) |
| `/newport-news/best-listing-agent` | Military PCS buyers, Denbigh-to-Southeast pricing |
| `/hampton-roads/best-realtor` | Regional — 6-city comparison table |
| `/hampton-roads/best-real-estate-agent` | Regional — agent evaluation framework |

### Cron-Generated Pages (Rounds 0–7)

| Round | Date | Pages |
|---|---|---|
| Round 0 | TBD | VB: best-listing-agent · CHK: best-real-estate-agent · NFK: best-real-estate-agent · SUF: best-real-estate-agent · HAM: best-real-estate-agent · NN: best-real-estate-agent |
| Round 1 | TBD | VB: best-buyers-agent · CHK: best-buyers-agent · NFK: best-listing-agent · SUF: best-buyers-agent · HAM: best-listing-agent · NN: best-buyers-agent |
| Round 2 | TBD | Waterfront — VB, CHK, NFK, SUF + HAM buyers + NN military relocation |
| Round 3 | TBD | Military relocation — VB, CHK, NFK, SUF, HAM + NN waterfront |
| Round 4 | TBD | Luxury specialists — all 6 cities |
| Round 5 | TBD | First-time homebuyer specialists — all 6 cities |
| Round 6 | TBD | Condo (VB, HAM) + New construction (CHK, SUF, NN) + NFK buyers |
| Round 7 | TBD | Investment property specialists — all 6 cities |

### Legacy Home Team — Hardcoded Values Reference

| Value | Current | File |
|---|---|---|
| GitHub owner | `kiwi-vegas` | `lib/aeo-generator.ts` |
| GitHub repo | `legacy-home-search` | `lib/aeo-generator.ts` |
| Domain | `legacyhometeamlpt.com` | `lib/aeo-generator.ts`, `lib/email.ts` |
| Phone | `(757) 816-4037` | `lib/aeo-generator.ts` |
| Address | `5224 Indian River Rd, 23464` | `lib/aeo-generator.ts` |
| Agent photo | `/barry-transparent.png` | `lib/aeo-generator.ts` |
| Cron schedule | `0 16 * * *` (4PM UTC / 9AM PT) | `vercel.json` |
| Operator email | `kiwi@ylopo.com` | Vercel `OPERATOR_EMAIL` env var |
| Redis round key | `aeo:round` | `app/api/cron/aeo-pages/route.ts` |
