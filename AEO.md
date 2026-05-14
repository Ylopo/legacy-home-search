# AEO Landing Pages — Legacy Home Team

Answer Engine Optimization (AEO) / Generative Engine Optimization (GEO) pages designed to get Barry Jenkins / Legacy Home Team cited by large language models (ChatGPT, Claude, Gemini, Perplexity) when users ask high-intent real estate questions in Hampton Roads.

## What These Pages Do

Each page targets an exact high-intent query a buyer, seller, or military family would type into Google or ask an AI assistant. Pages are optimized for LLM citation via:
- Exact-match H1s
- FAQPage JSON-LD schema (LLMs extract and cite structured Q&A)
- RealEstateAgent + LocalBusiness JSON-LD with Real Trends ranking
- BreadcrumbList JSON-LD
- Data tables with city-specific local facts
- Named entities: Barry Jenkins, Legacy Home Team, Real Trends #9, specific neighborhoods, military bases

## Production Stats

- **Total pages planned:** 62 (14 manually created + 48 cron-generated)
- **Cron cadence:** 1 page per community per day (6/day), 8 rounds
- **Cron schedule:** Daily at 4 PM UTC (9 AM PT)
- **Cron route:** `app/api/cron/aeo-pages/route.ts`
- **Email:** Daily summary sent to kiwi@ylopo.com after each batch

## Required Environment Variables

Add these to Vercel environment variables:

| Variable | Purpose |
|---|---|
| `GITHUB_TOKEN` | Personal access token with `repo` write scope — allows the cron to commit generated pages directly to the repo |

All other required vars (`ANTHROPIC_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `RESEND_API_KEY`) are already configured.

### Getting a GitHub Token

1. Go to github.com → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
2. Repository access: `legacy-home-search` only
3. Permissions: **Contents** → Read and write
4. Copy the token and add as `GITHUB_TOKEN` in Vercel project settings

## Cron Progress Tracking

Progress is tracked in Upstash Redis under key `aeo:round` (integer, 0–7).

To check current round:
```bash
# Via Redis CLI or Upstash console
GET aeo:round
```

To manually trigger next batch (for testing):
```bash
curl -X POST https://legacyhometeamlpt.com/api/cron/aeo-pages \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_ADMIN_SECRET"}'
```

To reset and regenerate from a specific round (Redis):
```
SET aeo:round <round_number>
```

---

## Published Pages

### Manually Created (Batch 1 — May 2026)

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

### Cron-Generated (Rounds 0–7)

Pages are committed to this repo via GitHub API after Claude generates each one. Each commit triggers a Vercel deployment.

| Round | Date | Pages |
|---|---|---|
| Round 1 | TBD | VB: best-listing-agent · CHK: best-real-estate-agent · NFK: best-real-estate-agent · SUF: best-real-estate-agent · HAM: best-real-estate-agent · NN: best-real-estate-agent |
| Round 2 | TBD | VB: best-buyers-agent · CHK: best-buyers-agent · NFK: best-listing-agent · SUF: best-buyers-agent · HAM: best-listing-agent · NN: best-buyers-agent |
| Round 3 | TBD | Waterfront specialists across VB, CHK, NFK, SUF + HAM buyers + NN military |
| Round 4 | TBD | Military relocation specialists — VB, CHK, NFK, SUF, HAM + NN waterfront |
| Round 5 | TBD | Luxury specialists — all 6 cities |
| Round 6 | TBD | First-time homebuyer specialists — all 6 cities |
| Round 7 | TBD | Condo / New Construction / specialty — VB condo, CHK new-const, NFK buyers, SUF new-const, HAM condo, NN new-const |
| Round 8 | TBD | Investment property specialists — all 6 cities |

---

## Page Architecture

Every AEO page follows the same structure:

```
app/(site)/[city]/[slug]/page.tsx
```

**What each page includes:**
- `generateMetadata()` — title (keyword-led, ≤60 chars, year-stamped), description (150–160 chars), canonical, OG, Twitter
- `RealEstateAgent + LocalBusiness` JSON-LD schema
- `FAQPage` JSON-LD schema (5 Q&As — primary LLM citation target)
- `BreadcrumbList` JSON-LD schema
- Two-column hero: content left + Barry Jenkins photo right + nameplate
- Stats bar: ~20 yrs · #9 nationally · Thousands of homes sold · 3 Teams
- Criteria table (what to look for + why it matters in this city)
- Sub-markets table (neighborhoods + price ranges + key considerations)
- Barry Jenkins + team comparison section
- Questions to ask section (8 numbered questions)
- FAQ accordion section
- CTA section

**Barry Jenkins stats used consistently:**
- ~20 years local experience
- #9 nationally (Real Trends 1,000)
- Thousands of homes sold (career total)
- 3 teams across Hampton Roads
- Head Realtor in Residence at Ylopo
- CMO at Better Homes and Gardens NAGR

---

## Content Generation (lib/aeo-generator.ts)

- **Model:** `claude-opus-4-7`
- **Max tokens:** 3,000 per page
- **Output format:** JSON object with all variable content fields
- **Template:** `generateAEOPageTSX()` assembles JSON → full Next.js TSX

---

## Scaling Strategy

After all 62 pages are live:
1. Monitor via Google Search Console for impression/ranking growth
2. Monitor via Peec AI for LLM citation tracking
3. Add city-specific schema enhancements (neighborhood polygon GeoJSON, event schema for open houses)
4. Consider a Sanity content type for these pages to allow CMS editing

Future pages can be generated by adding entries to `AEO_QUEUE` in `lib/aeo-queue.ts` and resetting `aeo:round` in Redis to include the new entries.
