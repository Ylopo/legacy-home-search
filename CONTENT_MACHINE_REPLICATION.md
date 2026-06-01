# Content Machine — Replication Guide

This document is the complete playbook for replicating the full AI content pipeline on a new real estate client site. It covers what the system does, every customization point, all required credentials, and ends with a ready-to-paste Claude Code prompt you can use to start implementation in a new project.

**Reference implementation:** `/Users/kiwi/Desktop/Cowork/Branded Sites/legacy-home-search/`
**First replication target:** Shana Gates — `shanasells.com` — Coachella Valley, California

---

## 1. What This System Does

The content machine is a fully automated real estate content pipeline that runs on Next.js + Sanity + Upstash Redis + Vercel Cron. It does the following with zero daily intervention once running:

1. **Researches** the local real estate market daily using Tavily — scores articles by local relevance, timeliness, novelty, SEO potential
2. **Emails** the operator a digest of top ideas and waits for approval
3. **Writes** a full blog post per approved idea using Claude Sonnet, with Fair Housing rules injected at the prompt level
4. **Checks** every post for Fair Housing Act compliance using Claude Haiku before saving — flags violations and alerts the operator
5. **Queues** posts in Sanity (`workflowStatus: 'media_pending'`) for the VA to handle media
6. **VA Queue** — operator adds a thumbnail (AI-generated or uploaded), generates a talking-head video via HeyGen, writes platform-specific social captions via Claude
7. **Publishes** the post to the website (Next.js + Sanity) and all connected social platforms simultaneously via Blotato (Facebook, YouTube Shorts, TikTok, LinkedIn, X, Threads)
8. **Reviews performance** bi-weekly — measures which content categories get the most traffic, adjusts idea scoring weights automatically, emails a report to the operator
9. **Refreshes** evergreen content weekly — identifies posts that have aged or been superseded, rewrites them in-place with current data

The system is fully replicable. All client-specific details live in a small set of injection points — prompts, env vars, Redis key prefixes, and a LEARNINGS.md seed file.

---

## 2. Architecture Decisions for New Clients

### Sanity (CMS) — Add It Back If Missing

The entire pipeline depends on Sanity. Every blog post is a Sanity `blogPost` document. The `workflowStatus` field on that document is the state machine that drives the VA Queue, publish flow, and social dashboard. Admin pages read from Sanity. Thumbnails and video URLs are stored on the doc.

Without Sanity you'd need an alternative database for state management — that adds complexity with zero benefit. The Sanity free tier (Starter) handles everything this system needs:

- Free for 1 project (no credit card required)
- 200k API requests/month (generous for a content machine)
- Sanity Studio deploys for free to `<project>.sanity.studio`
- Setup time: 30–60 minutes

**If Sanity was previously removed from a project:** Create a new project at sanity.io, copy the `sanity/` folder from legacy-home-search, generate tokens, set env vars. See Section 5, Step 1–3.

### Redis (Upstash) — New Database Per Client

Each client needs a **separate** Upstash database. The free tier (10k requests/day) is sufficient for the pipeline.

The Redis key prefix must change per client to avoid collisions if you ever share one instance. Current prefix for Barry's site: `lhs:`. Prefix for Shana: `sgs:`. Change every hardcoded prefix string across `lib/idea-store.ts`, `lib/store.ts`, `lib/fair-housing.ts`, `lib/research.ts`.

### Blotato — Per-Account IDs

Each client's social accounts need to be connected to Blotato separately. After connecting Shana's Facebook, YouTube, TikTok, LinkedIn, X, and Threads accounts in the Blotato dashboard, copy the account IDs shown for each platform into the env vars.

The Blotato API key itself is shared — only the account/page IDs change per client.

### HeyGen — Per-Client Avatar + Voice

Each client needs their own HeyGen avatar. `HEYGEN_AVATAR_LOOK_ID` and `HEYGEN_VOICE_ID` are the two env vars to update. Both can be found in the HeyGen dashboard under "Avatars."

Shana's avatar ID: `d08dfce8949b4db884351ea1afb81966` (already confirmed and in use).

### Fair Housing — State-Specific Classes

The `FAIR_HOUSING_RULES` constant and `checkFairHousing()` prompt in `lib/fair-housing.ts` must reflect the new state's protected classes:

| State | Additional classes beyond federal 7 |
|---|---|
| **Virginia** (current) | Marital status, sexual orientation, gender identity, source of income |
| **California** (Shana) | All of the above + **age**, **citizenship/immigration status** |

Update both the `FAIR_HOUSING_RULES` constant (injected into writing prompts) and the compliance checker prompt inside `checkFairHousing()`. Also update `FAIR_HOUSING.md` for the new client with CA-specific violation examples.

### Platform Connection Wizard — `/admin/connect`

After the first deploy, all social and analytics platform credentials are set up through a guided wizard rather than manual token hunting. The wizard is at `/admin/connect?secret=ADMIN_SECRET`.

**How it works:**
- Each platform card shows current connection status (green = confirmed, grey = not set)
- Operator pastes a credential → wizard calls the platform API to validate it → shows the exact Vercel env var to copy
- Facebook token exchange is automatic: paste a short-lived Graph Explorer token and the wizard converts it to a never-expiring page token
- Instagram is auto-discovered: one click after Facebook is connected (uses the same token, no new credentials)
- Connection metadata (platform names, IDs, timestamps) is saved to a `platformCredentials` Sanity singleton — secrets stay in Vercel env vars

**Key files:**
- `app/admin/connect/page.tsx` — the wizard UI with step-by-step instructions per platform + ChatGPT prompts for stuck clients
- `app/api/admin/connect/` — 6 validation routes: `facebook`, `instagram`, `youtube`, `tiktok`, `linkedin`, `status`
- `sanity/schema/platformCredentials.ts` — singleton Sanity document storing connection metadata

**Companion doc:** `PLATFORM_CONNECTIONS.md` has per-platform step-by-step instructions including where to find each credential, what OAuth scopes are needed, and how to troubleshoot the most common errors (especially the Instagram "not linked to Facebook Page" error).

**LinkedIn token expiry:** LinkedIn OAuth tokens expire every 60 days. Set `LINKEDIN_TOKEN_ISSUED_AT` to the ISO date when you generate the token — the wizard shows a warning banner when it's within 10 days of expiry. Set a calendar reminder every 50 days to regenerate.

### Refresh Pipeline — Weekly Evergreen Content Updates

A weekly cron (Monday 10 AM PT) automatically evaluates published blog posts for staleness and queues them for rewriting. Operator approves or skips at `/admin/refresh-queue`.

**How it works:**
1. `lib/refresh-engine.ts` scores every published post for staleness (data age, superseded events, seasonal relevance)
2. Posts above the threshold are added to a Redis refresh queue
3. Operator reviews at `/admin/refresh-queue` — one click to approve a rewrite
4. `lib/refresh-writer.ts` rewrites approved posts in-place using Claude, preserving the slug and SEO structure
5. `lib/refresh-store.ts` manages the Redis queue state

**Redis prefix:** The refresh queue uses `lhs:refresh:` — this must be updated per client (e.g. `sgs:refresh:`) along with the other prefixes.

**No action needed at setup** — the cron fires automatically once the site is live. The first refresh cycle runs in the first Monday after launch.

### Instagram & LinkedIn Analytics Clients

Two analytics clients were added alongside the Platform Connection Wizard:

**`lib/instagram-client.ts`** — Fetches Instagram profile stats and per-post insights (reach, impressions, saves) via the Instagram Graph API. Uses the same `INSTAGRAM_ACCESS_TOKEN` as the Facebook Page token — no new OAuth needed. Requires `INSTAGRAM_BUSINESS_ACCOUNT_ID` (auto-discovered via the wizard).

**`lib/linkedin-client.ts`** — Fetches LinkedIn org follower count and post engagement stats (impressions, clicks, reactions). Uses `LINKEDIN_ACCESS_TOKEN` which expires every 60 days. The `LINKEDIN_TOKEN_ISSUED_AT` env var enables the expiry warning in the wizard dashboard.

Both clients are wired into `/admin/social-dashboard/instagram` and `/admin/social-dashboard/linkedin` — those pages show live data when credentials are set, and show a "not connected" prompt (with a link to the wizard) when they're missing.

---

## 3. Customization Checklist

Every item below must be updated when setting up a new client. Grouped by file/area.

### Identity & Voice

- [ ] **Agent name** — replace "Barry Jenkins" throughout prompts in `lib/idea-writer.ts`, `lib/writer.ts`
- [ ] **Market** — replace "Hampton Roads, Virginia" / "Virginia Beach" with the new market
- [ ] **Community names** — update the community link rule in `lib/idea-writer.ts` and `lib/writer.ts`
- [ ] **Production URL** — update `NEXT_PUBLIC_APP_URL` env var
- [ ] **SELLER_URL** — update the home valuation/contact URL in `lib/idea-writer.ts` (line with `const SELLER_URL`)
- [ ] **LEARNINGS.md** — seed with new client's market context (see below for Shana's seed content)

### Research (`lib/research.ts` + `lib/events-research.ts`)

- [ ] **Pinned daily queries** — replace with client market queries (see Shana queries below)
- [ ] **Rotating query pool** — replace Hampton Roads topics with local market topics
- [ ] **End-of-month event queries in `lib/research.ts`** — update city names (days 22–31 get event-focused queries injected)
- [ ] **`lib/events-research.ts`** — this file fires on the 25th of each month and generates next-month event post ideas. Replace all Hampton Roads city names, venue names, and event types with the new client's market equivalents

**Shana Gates / Coachella Valley queries to use:**
```
Pinned daily:
  'Coachella Valley real estate market 2026'
  'Palm Desert Palm Springs housing market trends 2026'
  'Coachella Valley community development news projects 2026'

End-of-month events (days 22–31):
  'Coachella Valley Palm Desert events festivals things to do next month'
  'Palm Springs Rancho Mirage La Quinta community events upcoming month'
  'Coachella Valley concerts festivals calendar activities'

Rotating topics to include:
  'Palm Desert home prices 2026'
  'Palm Springs luxury real estate market'
  'Rancho Mirage La Quinta homes for sale'
  'Indian Wells real estate trends'
  'Coachella Valley vacation rental regulations 2026'
  'snowbird real estate Coachella Valley season'
  'desert living Palm Desert California'
  'vacation home investment Coachella Valley'
  'Coachella Valley HOA golf course communities'
  'Palm Springs short-term rental ordinance 2026'
  'desert landscaping water conservation California'
  'California property tax Proposition 19 home buyers'
  'California first-time buyer programs down payment assistance 2026'
  'Coachella Valley flood insurance earthquake risk'
  'Coachella Valley rental market investment returns'
  'new construction developments Palm Desert Indio 2026'
```

### Required Evergreen Topics (`lib/required-topics.ts`)

- [ ] Replace Virginia military/flood topics with Coachella Valley equivalents:

**Shana's required evergreen topics:**
```
'What Does It Cost to Buy a Home in [City]?' — all 8 CV cities
'What Does It Cost to Sell a Home in [City]?' — all 8 CV cities
'HOA Rules and Golf Course Communities in [City]'
'Vacation Rental Rules and Short-Term Rental Ordinances in [City]'
'[City A] vs [City B]: Which Is Better for Buyers in 2026?'
'Is 2026 a Good Time to Buy in [City]?'
'What Happens After Your Offer Is Accepted in California?'
'Snowbird Guide: Buying a Second Home in the Coachella Valley'
```

### Writing Prompts (`lib/idea-writer.ts`, `lib/writer.ts`)

- [ ] **Agent persona** — update system prompt opening:
  ```
  "You are Shana Gates, writing for the Shana Sells blog in the Coachella Valley.
  Shana has been a Coachella Valley real estate agent for [X] years, her family lives here,
  she knows the desert communities intimately..."
  ```
- [ ] **Local color** — replace military/PCS angle with Coachella Valley equivalents:
  - Military/PCS → Snowbird/seasonal buyers, vacation home investors
  - Flood zones → Desert heat, water conservation, earthquake risk
  - Virginia Beach oceanfront → Palm Springs mid-century modern, golf course communities
- [ ] **Community link rule** — replace VA communities with CV cities:
  ```
  [Palm Desert](/palm-desert), [Palm Springs](/palm-springs), [Rancho Mirage](/rancho-mirage),
  [La Quinta](/la-quinta), [Indian Wells](/indian-wells), [Cathedral City](/cathedral-city),
  [Desert Hot Springs](/desert-hot-springs), [Indio](/indio)
  ```

### Fair Housing (`lib/fair-housing.ts`)

- [ ] **Add California protected classes** to `FAIR_HOUSING_RULES` constant:
  ```
  CALIFORNIA ADDS: Age, citizenship/immigration status — in addition to the federal 7
  and marital status, sexual orientation, gender identity, source of income
  ```
- [ ] **Update `checkFairHousing()` prompt** to list California protected classes
- [ ] **Update Redis key prefix** from `lhs:fh:` to `sgs:fh:`

### Redis Key Prefixes

- [ ] `lib/idea-store.ts` — `lhs:ideas:` → `sgs:ideas:`
- [ ] `lib/store.ts` — `lhs:articles:` → `sgs:articles:`
- [ ] `lib/fair-housing.ts` — `lhs:fh:` → `sgs:fh:`
- [ ] `lib/research.ts` — any `lhs:strategy:` keys → `sgs:strategy:`
- [ ] `lib/refresh-store.ts` — `lhs:refresh:` → `sgs:refresh:`
- [ ] Search the entire `lib/` directory for `lhs:` to catch any remaining prefixes

### Email Templates (`lib/email.ts`)

- [ ] Replace "Legacy Home Search" with client name in all HTML templates
- [ ] Replace "Legacy Home Team LPT" with Shana's branding
- [ ] Update `pickerUrl` base domain in `sendDigestEmail()`

### LEARNINGS.md Seed Content (Shana)

**Important:** LEARNINGS.md is seeded manually at setup, but it auto-updates itself. A Wednesday cron (`/api/cron/learnings-update`) runs weekly and pulls GA4 traffic data + operator approval/skip decisions from Redis to populate the "what's working" sections automatically. This means after week 1 of live traffic, LEARNINGS.md will begin self-updating — the seed content you provide at setup only needs to cover voice, market context, and mandatory angles. The performance data section fills in on its own.

**Do not manually edit** the "Top Performing Categories" or "What Drives Engagement" sections — those are owned by the cron. Everything else (Voice Principles, Market Context, Mandatory Angles) is safe to edit manually.

Replace the Hampton Roads content in LEARNINGS.md with:
```markdown
# Shana Sells — Content Intelligence

## Voice Principles
- Shana is a trusted local expert, not a salesperson. Posts help Coachella Valley buyers,
  sellers, and second-home owners make smart decisions.
- Open with the most specific, locally-grounded fact available. Skip national statistics unless
  they directly impact the Coachella Valley.
- The snowbird/seasonal buyer angle is the Coachella Valley's equivalent of the military/PCS
  angle in Hampton Roads — mention it wherever it genuinely fits.
- Desert lifestyle details (golf communities, HOA rules, short-term rental ordinances,
  water-efficient landscaping) are authentically local — lean into them.

## Market Context
- Peak buying season: October–March (snowbird season, cooler weather)
- Off-season: June–September (extreme heat, lower inventory, motivated sellers)
- Vacation home / investment property buyers are a significant audience segment
- Palm Springs has strict short-term rental regulations; La Quinta and Desert Hot Springs are more permissive
- Many communities are gated with HOAs — HOA rules are a top buyer concern
- Mid-century modern architecture (Palm Springs) is a major draw for a certain buyer segment

## Community Priority
Palm Desert > Palm Springs > Rancho Mirage > La Quinta > Indian Wells > Cathedral City > Desert Hot Springs > Indio

## Mandatory Angles to Include When Relevant
- Snowbird/seasonal buyer perspective (October–March buying window)
- Investment property / vacation rental income potential
- HOA rules and golf course community expectations
- Water conservation and desert landscaping requirements
- California-specific buyer protections (AB 1482, Prop 19, etc.)
```

---

## 4. Environment Variables Reference

Every env var the pipeline requires, what it controls, and whether it can be reused across clients or needs a new value.

| Variable | Service | Reuse? | Notes |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Anthropic Claude | ✅ Same | One account, reuse across clients |
| `TAVILY_API_KEY` | Tavily | ✅ Same | Reuse across clients |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity | ❌ New | New project per client |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity | ✅ Same | Always `production` |
| `SANITY_API_TOKEN` | Sanity | ❌ New | Read token from new project |
| `SANITY_WRITE_TOKEN` | Sanity | ❌ New | Write token from new project |
| `UPSTASH_REDIS_REST_URL` | Upstash | ❌ New | New database per client |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash | ❌ New | New database per client |
| `RESEND_API_KEY` | Resend | ✅ Same | Reuse across clients |
| `FROM_EMAIL` | Resend | ❌ New | Client-specific sender address |
| `OPERATOR_EMAIL` | Resend | ✅ Same | `kiwi@ylopo.com` for all clients |
| `BARRY_EMAIL` / `CLIENT_EMAIL` | Resend | ❌ New | Client's personal email for reminders |
| `HEYGEN_API_KEY` | HeyGen | ✅ Same | Reuse across clients |
| `HEYGEN_AVATAR_LOOK_ID` | HeyGen | ❌ New | Client-specific avatar (Shana: `d08dfce8949b4db884351ea1afb81966`) |
| `HEYGEN_VOICE_ID` | HeyGen | ❌ New | Client-specific voice ID |
| `BLOTATO_KEY` | Blotato | ✅ Same | Reuse across clients |
| `BLOTATO_FACEBOOK_ACCOUNT_ID` | Blotato | ❌ New | Connect client's FB → note account ID |
| `BLOTATO_FACEBOOK_PAGE_ID` | Blotato | ❌ New | Client's FB page ID |
| `BLOTATO_YOUTUBE_ACCOUNT_ID` | Blotato | ❌ New | Connect client's YT → note account ID |
| `BLOTATO_TIKTOK_ACCOUNT_ID` | Blotato | ❌ New | Connect client's TT → note account ID |
| `BLOTATO_LINKEDIN_ACCOUNT_ID` | Blotato | ❌ New | Connect client's LI → note account ID |
| `BLOTATO_X_ACCOUNT_ID` | Blotato | ❌ New | Connect client's X → note account ID |
| `BLOTATO_THREADS_ACCOUNT_ID` | Blotato | ❌ New | Connect client's Threads → note account ID |
| `BLOTATO_INSTAGRAM_ACCOUNT_ID` | Blotato | ❌ New | Connect client's Instagram → note account ID |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 | ❌ New | Client's GA4 property measurement ID |
| `GA4_PROPERTY_ID` | GA4 | ❌ New | Client's GA4 numeric property ID |
| `GA4_SERVICE_ACCOUNT_JSON` | GA4 | ❌ New | Service account JSON (one-line stringified) |
| `YOUTUBE_API_KEY` | YouTube | ✅ Same | Reuse across clients |
| `YOUTUBE_CHANNEL_ID` | YouTube | ❌ New | Client's YouTube channel ID |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Facebook | ❌ New | Never-expiring page token — wizard generates from short-lived token |
| `FACEBOOK_PAGE_ID` | Facebook | ❌ New | Client's Facebook page ID |
| `FACEBOOK_APP_ID` | Facebook | ✅ Same | Meta app ID (needed for wizard token exchange — set once, reuse) |
| `FACEBOOK_APP_SECRET` | Facebook | ✅ Same | Meta app secret (same — set once, reuse) |
| `INSTAGRAM_ACCESS_TOKEN` | Instagram | ❌ New | Same value as FACEBOOK_PAGE_ACCESS_TOKEN |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | Instagram | ❌ New | Auto-discovered via /admin/connect wizard after Facebook is connected |
| `LINKEDIN_ACCESS_TOKEN` | LinkedIn | ❌ New | OAuth token — expires every 60 days; regenerate via LinkedIn developer portal |
| `LINKEDIN_ORGANIZATION_ID` | LinkedIn | ❌ New | Numeric org ID from company page URL |
| `LINKEDIN_TOKEN_ISSUED_AT` | LinkedIn | ❌ New | ISO date when token was issued — enables wizard expiry warning banner |
| `GSC_CLIENT_ID` | Google Search Console | ❌ New | OAuth client ID from Google Cloud Console |
| `GSC_CLIENT_SECRET` | Google Search Console | ❌ New | OAuth client secret |
| `GSC_REFRESH_TOKEN` | Google Search Console | ❌ New | Long-lived refresh token from OAuth Playground |
| `GSC_SITE_URL` | Google Search Console | ❌ New | e.g. `sc-domain:legacyhometeamlpt.com` |
| `TIKTOK_USERNAME` | TikTok | ❌ New | Client's TikTok handle without @ (e.g. `legacyhometeam`) |
| `TIKTOK_TOTAL_VIEWS` | TikTok | ❌ Optional | Manual override for total views if scraper fails |
| `ADMIN_SECRET` | App | ❌ New | Random string — generate fresh per client |
| `CRON_SECRET` | App | ❌ New | Random string — generate fresh per client |
| `NEXT_PUBLIC_APP_URL` | App | ❌ New | Client's production URL |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob | ❌ New | For thumbnail + video uploads |
| `GITHUB_TOKEN` | GitHub | ✅ Optional | For auto-committing LEARNINGS.md |

---

## 5. Step-by-Step Setup Sequence

Do these in order — later steps depend on earlier ones.

**External accounts (do first, before touching code):**

1. **Sanity** — Create new project at sanity.io (free tier). Note: project ID, dataset (`production`). Generate a read-only API token and a write-access API token (call them "Read" and "Editor" in the dashboard).

2. **Sanity schema** — Copy `sanity/` folder from legacy-home-search into the new project. Run `npx sanity deploy` to publish the Studio. Run `npx sanity schema push` if needed.

3. **Upstash Redis** — Create a new database at upstash.com (free tier, Serverless Redis). Note: REST URL and REST token.

4. **Blotato** — Connect the client's social accounts one by one in the Blotato dashboard. After connecting each account, note the numeric account ID shown in the sidebar or URL. You'll need IDs for: Facebook page, YouTube, TikTok, LinkedIn, X, Threads.

5. **GA4** — Create (or locate) the GA4 property for the client's domain. Note: measurement ID (G-XXXXXXXX) and numeric property ID. Create a service account in Google Cloud Console with "Viewer" access to the property — download the credentials JSON.

6. **YouTube Data API** — Enable "YouTube Data API v3" in Google Cloud Console for the same service account project. Note the client's YouTube channel ID (from their channel URL or dashboard).

7. **Analytics connections — use the Platform Connection Wizard** — After deploying the project, visit `/admin/connect?secret=ADMIN_SECRET`. Connect platforms in this order:
   - **TikTok**: paste the client's @username — wizard tests it and saves
   - **YouTube**: paste the channel URL — wizard fetches channel name and ID
   - **Facebook**: paste a short-lived Graph Explorer token + Page ID — wizard exchanges it for a never-expiring token automatically
   - **Instagram**: click "Auto-connect from Facebook" — wizard discovers the Business Account ID from the FB token (no new credentials needed)
   - **LinkedIn**: paste an OAuth access token + org ID — wizard validates and saves; token expires every 60 days
   - **GA4** and **GSC**: follow the guided instructions shown on the wizard page
   
   After each successful test, the wizard shows the exact env vars to copy into Vercel. Each platform also shows current connection status — green dot = confirmed working.

7a. **Confirm wizard saved connection metadata** — In the Sanity Studio, check that a `platformCredentials` document was created (it's a singleton). If it doesn't appear, the wizard API routes may not have `SANITY_WRITE_TOKEN` set yet — set it and reconnect each platform.

8. **HeyGen** — Confirm the avatar ID and voice ID for the client. For Shana: avatar `d08dfce8949b4db884351ea1afb81966`.

**Code setup:**

9. **Copy the pipeline** — Either fork legacy-home-search or copy the relevant lib/ files, API routes, and admin pages into the new project. See Section 6 for the Claude prompt that automates this.

10. **Update all client-specific strings** — Work through the checklist in Section 3. Start with the agent persona, market, and community names in the writing prompts.

11. **Update Redis key prefixes** — Search `lib/` for `lhs:` and replace all with the new client prefix (e.g., `sgs:`).

12. **Update Fair Housing rules** — Add the state's protected classes to `lib/fair-housing.ts`.

13. **Seed LEARNINGS.md** — Replace Hampton Roads content with the new client's market context. See Section 3 for Shana's seed content.

14. **Set env vars** — Add all values to `.env.local` for local dev and to Vercel dashboard for production.

15. **Configure `vercel.json`** — Copy the cron schedule from legacy-home-search. All cron timing works the same for any client.

**Testing (before going live):**

16. **Test research:** Trigger `/api/cron/research?secret=ADMIN_SECRET` manually. Confirm ideas appear in Redis. Check the email digest arrives.

17. **Test idea approval:** Approve one idea at `/admin/idea-review`. Confirm the post appears in the VA Queue. Confirm the Fair Housing check runs (check Redis for the `sgs:fh:{postId}` key).

18. **Test media flow:** On the queued post — generate a thumbnail, generate a HeyGen video script, generate a video. Confirm all three save correctly to Sanity.

19. **Test publish:** Click Publish on the post. Confirm it goes live on the website and all connected Blotato platforms receive the post.

20. **Test performance review:** Trigger `/api/cron/performance-review?secret=ADMIN_SECRET`. Confirm the email arrives with category data.

---

## 6. The Claude Code Prompt (Paste This Into a New Session)

Use this prompt when opening Claude Code in the Shana Gates project folder for the first time. It gives Claude everything it needs to understand what to build and where to find the reference implementation.

---

```
I want to add the full AI content pipeline to this project ([CLIENT_SITE] — [AGENT_NAME], [MARKET], [STATE]).

The pipeline to replicate, in order:
1. Daily research cron — Tavily searches [MARKET] real estate news, scores articles, saves ideas to Redis
2. End-of-month events cron — fires on the 25th of each month, generates next-month event post ideas specific to [MARKET]
3. Idea review — operator (kiwi@ylopo.com) receives email digest, approves ideas at /admin/idea-review
4. AI writing — Claude Sonnet 4.6 writes a full blog post per approved idea (Fair Housing rules injected at prompt level for [STATE])
5. Fair Housing check — Claude Haiku 4.5 checks every post before saving to Sanity; VA Queue shows FH Hold/Review badges; violations trigger an alert email
6. Sanity CMS — posts saved as blogPost documents with a workflowStatus state machine (media_pending → media_ready → scheduled → published)
7. VA Queue — /admin/va-queue shows posts needing thumbnail, video, and captions before publishing
8. Thumbnail — Claude generates an image prompt → image API generates the cover image → saved to Sanity
9. Video script — Claude Haiku generates a short talking-points script from the blog body
10. HeyGen video — HeyGen API generates a vertical (720×1280) avatar video from the script; VA downloads and edits; final video uploaded to Vercel Blob
11. Social captions — Claude Haiku generates platform-specific captions (Facebook, YouTube, TikTok, LinkedIn, X, Threads, Instagram) in one call
12. Publish — Blotato posts to all connected social platforms; website posts live via Sanity + Next.js ISR revalidation
13. Bi-weekly performance review — cron on 1st & 15th of each month; emails category performance table, AI insights, adjusted weights
14. Content refresh — weekly Monday 10 AM PT cron evaluates evergreen posts for staleness; operator approves rewrites at /admin/refresh-queue
15. LEARNINGS.md auto-update — Wednesday cron pulls GA4 traffic data + operator decisions from Redis to update content intelligence file
16. Platform Connection Wizard — /admin/connect provides a guided UI to connect all 7 social/analytics platforms with real-time credential validation

Reference implementation (read EVERYTHING in this directory before writing any code):
/Users/kiwi/Desktop/Cowork/Branded Sites/legacy-home-search/

Critical documents to read first:
- CONTENT_MACHINE_REPLICATION.md — full customization checklist, env vars, setup sequence
- BLOG_PIPELINE.md — detailed pipeline operations guide
- PLATFORM_CONNECTIONS.md — per-platform credential setup instructions with troubleshooting
- FAIR_HOUSING.md — compliance rules, violation examples, badge system

Key lib/ files to read and copy (understanding each before replicating):
Core pipeline:
  lib/research.ts, lib/events-research.ts, lib/idea-store.ts, lib/scoring.ts
  lib/idea-writer.ts, lib/writer.ts, lib/fair-housing.ts
  lib/publish-service.ts, lib/heygen-client.ts, lib/blotato-client.ts
  lib/sanity-write.ts, lib/store.ts, lib/email.ts, lib/types.ts

Analytics clients (all need env vars set via the wizard):
  lib/facebook-client.ts, lib/instagram-client.ts, lib/linkedin-client.ts
  lib/youtube-client.ts, lib/tiktok-client.ts, lib/ga4.ts, lib/gsc-client.ts

Refresh pipeline:
  lib/refresh-engine.ts, lib/refresh-writer.ts, lib/refresh-store.ts, lib/refresh-config.ts

Supporting:
  lib/learnings.ts, lib/required-topics.ts, lib/source-rules.ts
  lib/thumbnail-prompt.ts, lib/content-workflow.ts, lib/setup-state.ts

Platform Connection Wizard (copy entire directories):
  app/admin/connect/          — wizard UI with step-by-step instructions
  app/api/admin/connect/      — 6 validation routes (facebook, instagram, youtube, tiktok, linkedin, status)
  sanity/schema/platformCredentials.ts   — singleton Sanity doc for connection metadata

Sanity schema (copy entire sanity/ folder):
  sanity/schema/blogPost.ts, sanity/schema/platformCredentials.ts, sanity/schema/index.ts

Client-specific details for [AGENT_NAME]:
- Agent: [AGENT_NAME]
- Site: [CLIENT_SITE]
- Market: [MARKET], [STATE]
- Cities: [CITY_LIST]
- Operator email: kiwi@ylopo.com
- HeyGen avatar ID: [HEYGEN_AVATAR_ID]
- Fair Housing: [STATE] protected classes — update FAIR_HOUSING_RULES in lib/fair-housing.ts
- Sanity: [HAS_SANITY_OR_NEEDS_SETUP]
- Redis key prefix: use '[CLIENT_PREFIX]:' (not 'lhs:' which is the Barry Jenkins site)
  Prefixes to update: [CLIENT_PREFIX]:ideas:, [CLIENT_PREFIX]:articles:, [CLIENT_PREFIX]:fh:, [CLIENT_PREFIX]:strategy:, [CLIENT_PREFIX]:refresh:
- Blotato account IDs: [TO_BE_PROVIDED]

Please start by:
1. Reading ALL critical documents listed above from the reference implementation
2. Reading the current state of this project (what's already here, what tech stack it uses, what's missing)
3. Checking whether the Platform Connection Wizard files (app/admin/connect/ and app/api/admin/connect/) are present in this project — if not, they need to be added
4. Then tell me:
   (a) What you found in the reference implementation that needs to be replicated
   (b) What already exists in this project that can be reused vs. what needs to be built
   (c) All env vars you'll need me to provide before you can start (Sanity project ID, Blotato account IDs, HeyGen avatar ID, Redis credentials, etc.)
   (d) Any state-specific Fair Housing classes you need confirmed for [STATE]
   (e) The exact order in which you plan to build things, with each step's verification test

Do NOT start writing any code until I have confirmed the information in step 4.
```

---

*Last updated: June 2026 — reference implementation: legacyhometeamlpt.com*

---

## Changelog

| Date | What was added |
|---|---|
| June 2026 | Platform Connection Wizard, Instagram/LinkedIn analytics, Refresh Pipeline, events-research.ts, GSC env vars, TIKTOK_USERNAME/TIKTOK_TOTAL_VIEWS, LEARNINGS.md auto-update note, lhs:refresh: Redis prefix, updated Claude Code prompt with all new files |
| May 2026 | Initial guide — core pipeline, Sanity, Redis, Blotato, HeyGen, Fair Housing |
