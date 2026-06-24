# Content Machine — Replication Guide

> **New client setup?** Start with `replication-kit/README.md` — the visual-first turn-key kit with the paste-ready Claude Code prompt + screenshot-based UI walkthrough. This file is the deep technical reference the kit points to for accounts, env vars, and troubleshooting.

The complete playbook for cloning the Legacy Home Search content engine onto a new real estate client site. This is the working blueprint — everything Barry Jenkins's pipeline does, this document tells you how to set up for a new agent in a new market.

**Reference implementation:** `/Users/kiwi/Desktop/Cowork/Branded Sites/legacy-home-search/`
**Production URL:** `https://www.legacyhometeamlpt.com`
**Companion docs:**
- `ONEUP.md` — OneUp social publish + analytics setup, end-to-end
- `BLOG_PIPELINE.md` — operational guide for the day-to-day pipeline
- `FAIR_HOUSING.md` — compliance rules + alert system
- `AEO.md` — AI Engine Optimization landing-page generator

**Workflow for a new client:** copy this file into the new project's repo root, then open Claude Code in that project and paste the prompt at the very bottom. Claude will do the heavy lifting.

---

## What This System Does

A fully automated real estate content pipeline. Once it's set up, the operator's job is approving ideas; everything else runs on cron.

```
Tavily research  ─┐
Renick patterns  ─┼─→  Scored ideas in Redis  →  /admin/idea-review
Events research  ─┘                                     │
                                                  approve ↓
                                          Claude Sonnet writes post
                                                        │
                                          Fair Housing check (Haiku)
                                                        │
                                          Sanity: workflowStatus = media_pending
                                                        │
                                                  /admin/va-queue
                                                  ├─ AI thumbnail
                                                  ├─ HeyGen V5 video
                                                  └─ Claude-generated platform captions
                                                        │
                                                    Publish
                                                        │
                              ┌────────────────────────┼────────────────────────┐
                              ↓                        ↓                        ↓
                           Website                  OneUp                   Analytics
                       (Next.js + Sanity)    Facebook · YouTube ·     /admin/blog-dashboard
                                              TikTok · Instagram ·    (GA4 + OneUp + Sanity)
                                              LinkedIn · X
```

Six big features the system delivers:

1. **Daily research** — Tavily searches scored against a 100-point model (local relevance, timeliness, format fit, audience value, source credibility, novelty, SEO potential, plus an end-of-month events boost)
2. **One-click VA publishing** — operator clicks Publish in `/admin/va-queue` and the post fans out to the website + 6 social platforms with platform-specific captions and a HeyGen V5 avatar video
3. **Fair Housing compliance** — every post is checked by Claude Haiku for protected-class language before it goes live, with operator alerts and a visual badge system
4. **Bi-weekly auto-tuning** — performance review cron measures category performance and adjusts the idea scoring weights so winning categories surface higher
5. **Weekly content refresh** — evergreen posts get rewritten on a schedule with fresh data; declining posts get prioritized
6. **Live analytics dashboard** — `/admin/blog-dashboard` pulls real numbers from GA4 + OneUp's analyze API and surfaces a cumulative "Always Climbing" view that tells the long-term growth story (not just last 30 days)

All client-specific details live in a small set of injection points — env vars, prompts, Redis key prefix, LEARNINGS.md seed, and a per-client community list. Everything else is portable.

---

## Required Accounts Before You Start

These need to exist before the new project boots. Most are free or have a free tier.

| Account | Cost | What it's for |
|---|---|---|
| **GitHub** | Free | Source of truth. The new client gets its own repo. |
| **Vercel** | Free → Pro | Hosting + cron + serverless functions. Pro tier ($20/mo) needed for `maxDuration > 60s` on certain crons. |
| **Sanity** | Free | CMS for blog posts. Free tier covers everything (200k req/mo, 3 users). |
| **Upstash Redis** | Free | Idea queue + state machine. Free tier (10k req/day) is plenty. |
| **OneUp (Intermediate+ plan)** | ~$15/mo | Cross-platform social publish + analytics. Plan must be Intermediate or higher for analytics API access. |
| **Anthropic Console** | Pay-as-you-go | Claude Sonnet (writing), Haiku (FH check + captions), Opus (LEARNINGS), Opus-4-7 (AEO). |
| **OpenAI Platform** | Pay-as-you-go | gpt-image-1 (thumbnail generation), DALL-E 3 (market report covers, fallback). |
| **Google AI Studio** | Pay-as-you-go | Gemini image generation (community background scenes). |
| **Tavily** | Free → Pro | News research API (1k searches/mo free). |
| **Resend** | Free → Pro | Transactional emails (digests, performance reviews, alerts). Free tier: 3k emails/mo. |
| **Google Cloud + GA4** | Free | Site analytics via service-account JSON. |
| **HeyGen** | $39/mo+ | AI avatar video generation. Needs Avatar IV (V5) eligible plan. |
| **Vercel Blob** | Free → metered | Storage for generated videos. |

**Client-owned accounts** (the new client's own logins, not the agency's):
- Their Facebook Page (account_type: 1)
- Their YouTube channel (with analytics scope grant during OAuth)
- Their TikTok creator account
- Their Instagram business account (linked to FB Page)
- Their LinkedIn personal or company page
- Their X/Twitter account

If the client owns their own social accounts and won't share OAuth, OneUp's connect flow can be done on a screen share — the connection persists thereafter.

---

## Per-Client Customizations

These are the things that change for every new client. Everything else is portable code.

### Identity Table

Build this table for the new client first, then refer to it throughout setup.

| Field | Barry (reference) | New client (fill in) |
|---|---|---|
| Agent name | Barry Jenkins | (e.g. Sarah Martinez) |
| Brand/team | Legacy Home Team LPT | (e.g. Vegas Home Group) |
| Market label | Hampton Roads | (e.g. Las Vegas Valley) |
| Production domain | legacyhometeamlpt.com | (e.g. vegashomegroup.com) |
| Cities served | Virginia Beach, Chesapeake, Norfolk, Suffolk, Hampton, Newport News | (e.g. Las Vegas, Henderson, North Las Vegas, Summerlin, Spring Valley, Sunrise Manor) |
| Phone | (757) 816-4037 | |
| Office address | 5224 Indian River Rd | |
| Years in market | 20 | |
| State (for Fair Housing) | Virginia | (e.g. Nevada — adds state-specific protected classes) |
| Agency OneUp category ID | 179358 | (created at app.oneupapp.io) |
| Sanity project ID | 2nr7n3lm | (created at sanity.io) |
| Redis key prefix | `lhs:` | (e.g. `vhg:` — must be unique vs other clients) |

### Find/Replace Across the Codebase

Once you've copied legacy-home-search to the new project, these are the literal strings to find and replace.

| Find | Replace with | Files |
|---|---|---|
| `legacyhometeamlpt.com` | `<new-domain>.com` | global |
| `Legacy Home Team LPT` | `<new brand>` | global |
| `Barry Jenkins` | `<new agent name>` | global |
| `Hampton Roads` | `<new market label>` | global (~50+ hits in prompts, copy, schema) |
| `Virginia Beach` | `<primary city>` | global (especially `lib/research.ts`, prompts) |
| `Norfolk`, `Chesapeake`, `Suffolk`, `Hampton`, `Newport News` | client's other cities | global |
| `lhs:` | `<new prefix>:` | `lib/idea-store.ts`, `lib/store.ts`, `lib/fair-housing.ts`, `lib/research.ts`, `lib/tiktok-client.ts` |
| `2nr7n3lm` | new Sanity project ID | `sanity/client.ts`, `sanity.config.ts`, `CLAUDE.md` |
| `barry-transparent.png` | new agent photo filename | `public/`, references in components, AEO templates |
| `Virginia` (state name in Fair Housing) | new state | `lib/fair-housing.ts` |

### LEARNINGS.md Seed

The new project needs a `LEARNINGS.md` at repo root with the client's brand voice principles, market context, city priorities, and mandatory angles. The `learnings-update` cron rewrites this weekly based on what's working — but the seed determines voice from day one.

Use Barry's `LEARNINGS.md` as the structural template, but rewrite every paragraph for the new market. Don't ship Barry's voice principles to a Las Vegas agent.

### Required Evergreen Topics

`lib/required-topics.ts` lists the post templates that must exist for every city (e.g. "What Does It Cost to Buy a Home in [City]?"). Rebuild the city list and the city/audience matrix for the new market. The monthly cron seeds gaps into the idea queue.

---

## File Inventory

### Copy verbatim (portable infrastructure)

These work as-is — just don't touch them per-client.

```
lib/oneup-client.ts                   ← OneUp publish wrapper
lib/oneup-analytics.ts                ← OneUp analytics wrapper
lib/heygen-client.ts                  ← HeyGen V5 video generation
lib/ga4.ts                            ← GA4 Data API client
lib/sanity-write.ts                   ← Sanity write client
lib/content-workflow.ts               ← Workflow state machine
lib/portable-text-utils.ts            ← Markdown → Portable Text converter
lib/scoring.ts                        ← Idea scoring helpers
lib/source-rules.ts                   ← Domain credibility scoring
lib/types.ts                          ← Shared TypeScript types
lib/idea-store.ts                     ← Redis idea queue (change prefix only)
lib/store.ts                          ← Redis article cache (change prefix only)
lib/refresh-engine.ts                 ← Content refresh scoring
lib/refresh-config.ts                 ← Refresh tier definitions
lib/refresh-store.ts                  ← Refresh queue persistence
lib/refresh-writer.ts                 ← Refresh execution

app/admin/idea-review/                ← Operator idea review UI
app/admin/va-queue/                   ← VA media + publish UI
app/admin/blog-dashboard/             ← The Shana-style analytics dashboard
app/admin/refresh-queue/              ← Refresh approval UI
app/admin/blog-picker/                ← Fast-track daily news picker
app/admin/thumbnail-review/           ← Legacy thumbnail upload
components/AdminNav.tsx               ← 3-tab admin nav

app/api/cron/research/                ← Daily Tavily research
app/api/cron/events-research/         ← Monthly events research (25th)
app/api/cron/required-topics-coverage/ ← Monthly evergreen gap fill (3rd)
app/api/cron/renick-pipeline/         ← Renick pattern extraction
app/api/cron/learnings-update/        ← Weekly LEARNINGS.md update
app/api/cron/performance-review/      ← Bi-weekly scoring auto-tune
app/api/cron/refresh-evaluation/      ← Weekly refresh queue build
app/api/cron/idea-digest/             ← Weekly idea email
app/api/cron/scheduled-publish/       ← Every-30-min scheduled-post fire

app/api/content/publish/              ← Publish API (calls OneUp)
app/api/content/publish-video/        ← Video-only republish (post-publish fix-ups)
app/api/content/publish-social/       ← Social-only publish (for already-published posts)
app/api/content/blotato-status/       ← Status polling (name kept — calls OneUp now)
app/api/content/generate-script/      ← Video script generation
app/api/content/generate-heygen-video/ ← HeyGen video generation kickoff
app/api/content/heygen-status/        ← HeyGen status polling
app/api/content/generate-thumbnail/   ← AI thumbnail composition
app/api/content/generate-caption/     ← Per-platform caption generator
app/api/content/upload-video/         ← Vercel Blob upload handler
app/api/content/ideas/                ← Idea approve/skip/defer endpoints
app/api/content/refresh-*/            ← Refresh approve/skip/exclude

sanity/                               ← Entire Sanity schema + client (change project ID only)
```

### Copy + customize

```
lib/research.ts                       ← Search queries (~50 strings need market swap)
lib/events-research.ts                ← Events query templates
lib/idea-writer.ts                    ← Post writing prompt (agent identity, market)
lib/writer.ts                         ← Legacy writer prompt (same)
lib/fair-housing.ts                   ← Rules object — adjust state-specific rules
lib/required-topics.ts                ← Per-city evergreen registry
lib/aeo-queue.ts                      ← AEO landing pages (rebuild for new market)
lib/aeo-generator.ts                  ← Agent identity in prompt, stats, address
lib/email.ts                          ← Email templates (brand colours, agent name)
lib/assistant-tools.ts                ← AI Content Assistant — COMMUNITY_PAGES list

app/api/content/generate-script/route.ts  ← Persona framing (local resident, not agent)
app/api/cron/aeo-pages/route.ts       ← AEO daily generator
components/PortableText.tsx           ← Institution links (50+ local entities to add)

CLAUDE.md                             ← Project facts (Sanity ID, brand theme, status)
LEARNINGS.md                          ← Voice + style seed
AEO.md                                ← Customise the agent details section
BLOG_PIPELINE.md                      ← Update the city list
FAIR_HOUSING.md                       ← State-specific class additions
```

### Don't copy (Barry-specific)

```
lib/blotato-client.ts                 ← Old publish provider — DO NOT include. OneUp replaces it entirely.
app/(site)/                           ← Marketing site — rebuild from the new client's branding
public/community-photos/              ← City photo manifest — populate from client's local photos
public/barry-*.png                    ← Agent portrait assets — replace with new agent's photos
```

### New per-client assets to create

- `public/<agent>-transparent.png` — 300×420px transparent-background PNG for thumbnail composition
- `public/community-photos/<city>/` — 6+ city background photos per community (used in thumbnails)
- `lib/required-topics.ts` updates — city list + topic matrix
- LEARNINGS.md seed
- 6 community pages (one per primary city served) — see `app/(site)/virginia-beach/page.tsx` as template

---

## Environment Variables (Complete Reference)

Set all of these in Vercel → Project Settings → Environment Variables. Check **Production**, **Preview**, **Development** for each.

### Required

```bash
# Anthropic Claude (writing, FH checks, captions, scripts)
ANTHROPIC_API_KEY="sk-ant-api03-…"

# OpenAI (thumbnail generation — gpt-image-1)
OPENAI_API_KEY="sk-proj-…"

# Google AI (Gemini image generation for community backgrounds)
GOOGLE_API_KEY="AIza…"

# Tavily (news research)
TAVILY_API_KEY="tvly-…"

# Upstash Redis (idea queue + state machine)
UPSTASH_REDIS_REST_URL="https://<id>.upstash.io"
UPSTASH_REDIS_REST_TOKEN="<token>"

# Resend (transactional emails)
RESEND_API_KEY="re_…"
FROM_EMAIL="noreply@<client-domain>.com"   # must be a verified sender
OPERATOR_EMAIL="kiwi@ylopo.com"             # where digests go

# Vercel Blob (video storage)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_…"

# Sanity (CMS)
NEXT_PUBLIC_SANITY_PROJECT_ID="<new-project-id>"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_WRITE_TOKEN="sk…"

# OneUp (social publish + analytics)
ONEUP_API_KEY="fa0ab47bd8f8c2f5e55c"                     # agency-level — same key for all clients
ONEUP_CATEGORY_ID="<numeric category id>"                # client-specific
ONEUP_FACEBOOK_ACCOUNT_ID="<page id>"
ONEUP_YOUTUBE_CHANNEL_ID="UC…"
ONEUP_TIKTOK_ACCOUNT_ID="_000…"
ONEUP_INSTAGRAM_ACCOUNT_ID="<numeric>"
ONEUP_LINKEDIN_ACCOUNT_ID="urn:li:person:… OR urn:li:organization:…"
ONEUP_X_ACCOUNT_ID="<handle>_twitter"

# HeyGen (V5 / Avatar IV)
HEYGEN_API_KEY="sk_V2_…"
HEYGEN_AVATAR_LOOK_ID="<from HeyGen dashboard>"          # client-specific avatar
HEYGEN_VOICE_ID="<from HeyGen dashboard>"                # client-specific voice

# GA4 (analytics dashboard)
GOOGLE_ANALYTICS_PROPERTY_ID="<9-digit number>"
GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account",…}'   # full JSON, single line
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"              # for the gtag pixel

# GitHub (used by LEARNINGS + AEO crons that commit back to repo)
GITHUB_TOKEN="ghp_… OR github_pat_…"                     # contents: write on this repo

# Auth
CRON_SECRET="<openssl rand -hex 32>"                     # Vercel cron auth
ADMIN_SECRET="<openssl rand -hex 32>"                    # /admin secret-link auth
NEXT_PUBLIC_APP_URL="https://<client-domain>.com"

# Optional — site marketing tags
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"                         # Google Tag Manager
# Freshpaint and similar tags are hardcoded in app/layout.tsx; swap per client.
```

### Optional (depending on client features)

```bash
# Google Search Console (for the search-visibility tile if you add it)
GSC_REFRESH_TOKEN="…"
GSC_CLIENT_ID="…"
GSC_CLIENT_SECRET="…"
GSC_SITE_URL="sc-domain:<client-domain>.com"

# Sentry, Linear, Slack, etc. — only if used
```

---

## Setup Sequence

These are the steps in order. Estimated wall-clock time: a focused day to set up; another day to verify and tune.

### Step 1 — Provision external accounts (1–2 hours)

Create accounts in this order:

1. **Sanity** — new project at sanity.io. Note the project ID. Generate an API write token.
2. **Upstash Redis** — new database (free tier). Copy `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`.
3. **OneUp** — log into the agency account at app.oneupapp.io. Create a new category named after the client. Connect their Facebook Page, YouTube channel (⚠️ tick the analytics OAuth box during Google's flow), TikTok, Instagram (via FB Business), LinkedIn, X. Run `listcategoryaccount` per `ONEUP.md` section 1.3 to capture `social_network_id`s. Email Davis at OneUp (`davis@oneupapp.io`) using the template in `ONEUP.md` section 1.4 to enable analytics on the new category.
4. **HeyGen** — create an avatar for the new client. Note the `avatar_look_id` and `voice_id`.
5. **Anthropic / OpenAI / Google AI / Tavily / Resend** — generate API keys.
6. **Google Cloud project + service account** for GA4 — see `ONEUP.md` section 2 for the exact steps (same flow for any GA4-driven dashboard).
7. **Vercel project** — create empty project pointed at the new client's GitHub repo (created in Step 3).

### Step 2 — Create the new GitHub repo (15 min)

1. Create new repo under the agency org or your personal account. Name it after the brand (e.g. `vegas-home-group`).
2. Clone empty.
3. Copy this entire `legacy-home-search` directory into the new repo, except:
   - `.next/`, `node_modules/`, `.env.local` — ignored by `.gitignore`
   - `public/community-photos/<existing-cities>/` — replace
   - `public/barry-*.png` — replace
   - The `app/(site)/` marketing site — needs rebuilding for the new client's brand

4. Run `npm install`, verify it builds with `npm run build` (fixing any obvious config issues — Sanity project ID etc).
5. Commit + push the initial state.

### Step 3 — Per-client customisation pass (4–6 hours)

Work through the Find/Replace table above. Then:

1. **Sanity schema** — confirm `sanity/client.ts` and `sanity.config.ts` point at the new project ID.
2. **Redis prefix** — global find/replace `lhs:` → `<new-prefix>:`. About 5 files.
3. **`lib/research.ts`** — rewrite all `PINNED_QUERIES` and `ROTATING_QUERIES` for the new market. Keep the structure; swap the proper nouns and topics. Roughly 50+ strings.
4. **`lib/events-research.ts`** — same exercise on the event query templates.
5. **`lib/required-topics.ts`** — replace the cities + the per-city audience matrix.
6. **`lib/aeo-queue.ts`** — replace the 48-entry AEO topic queue with new-market topics.
7. **`lib/aeo-generator.ts`** — update the agent persona, stats, address, phone in the prompt + the JSX template.
8. **`lib/idea-writer.ts`** — replace the "I'm Barry Jenkins, real estate agent at Legacy Home Team in Virginia Beach" framing with the new agent's identity. Same for `lib/writer.ts` if present.
9. **`app/api/content/generate-script/route.ts`** — the video script prompt frames the agent as a *local resident, parent, and investor* (not as a real estate agent). Update the city, school district mention, and "investment properties in [market]" detail to match.
10. **`lib/fair-housing.ts`** — add any state-specific protected classes (sexual orientation, gender identity, etc — varies by state).
11. **`LEARNINGS.md`** — write a new seed file matching the agent's voice and the market's specifics.
12. **`CLAUDE.md`** — update with the new project's facts (Sanity ID, market, brand).
13. **`app/(site)/`** — replace the marketing pages with the new client's branding. The community pages (one per city) are the main lift — see `app/(site)/virginia-beach/page.tsx` for the template.
14. **`public/community-photos/<city>/`** — add 6+ background photos per community for thumbnail composition. Update the manifest in `lib/thumbnail-asset-resolver.ts`.
15. **Agent photo** — add `public/<agent>-transparent.png` (300×420 PNG, transparent). Update the references in components and the AEO template.
16. **Email templates** — update `lib/email.ts` brand colours, agent name, signature.

### Step 4 — Deploy to Vercel (30 min)

1. In the Vercel project settings, connect the GitHub repo.
2. Paste all env vars from the Required block above.
3. Trigger first deploy. Watch the build log for missing imports or env errors.
4. Once green, set up the custom domain (`<client-domain>.com`).
5. Verify the public site renders.

### Step 5 — Cron schedule (already in `vercel.json` — verify)

The crons are declared in `vercel.json`. After the first deploy, confirm they appear in Vercel → Project → Cron. Times below are UTC; adjust if the client isn't Pacific.

| Cron path | Schedule | Purpose |
|---|---|---|
| `/api/cron/research` | `0 13 * * *` | Daily 6 AM PT research |
| `/api/cron/renick-pipeline` | `5 15 * * 2` | Weekly Tuesday Renick pattern extract |
| `/api/cron/learnings-update` | `0 14 * * 3` | Weekly Wednesday LEARNINGS.md commit |
| `/api/cron/required-topics-coverage` | `0 16 3 * *` | Monthly 3rd evergreen gap fill |
| `/api/cron/refresh-evaluation` | `0 17 * * 1` | Weekly Monday refresh queue |
| `/api/cron/events-research` | `0 16 25 * *` | Monthly 25th events research |
| `/api/cron/idea-digest` | `0 15 * * 4` | Weekly Thursday operator digest |
| `/api/cron/performance-review` | `0 14 1,15 * *` | Bi-weekly performance review |
| `/api/cron/aeo-pages` | `0 16 * * *` | Daily AEO landing page generator |
| `/api/cron/scheduled-publish` | `0,30 * * * *` | Every 30 min — fires scheduled posts |

### Step 6 — Smoke test (1 hour)

Run these in order. Each failure has a known cause documented below or in the companion docs.

| # | Test | Pass criteria |
|---|---|---|
| 1 | Open `https://<client>.com/admin/idea-review?secret=<ADMIN_SECRET>` | Page loads, no auth redirect |
| 2 | Click Media Queue, then Analytics | All tabs load |
| 3 | Open `/admin/blog-dashboard` | Real GA4 sessions appear, OneUp platform cards say `LIVE · ONEUP` |
| 4 | `curl -X POST https://<client>.com/api/cron/research -H "Content-Type: application/json" -d '{"secret":"<ADMIN_SECRET>"}'` | Returns `success: true, ideasQueued: N` |
| 5 | After research, hit `/admin/idea-review` | Real scored ideas appear |
| 6 | Approve one idea | Post writes successfully, lands in `/admin/va-queue` with `media_pending` |
| 7 | Add a thumbnail (AI-generate or upload) to the queue post | Cover image saves |
| 8 | Generate a HeyGen video on that post | Video processes in HeyGen — confirm it's Avatar IV / V5, not V3 |
| 9 | Upload the final video back, then click Publish | Post goes to OneUp; check `https://www.oneupapp.io/api/getpublishedposts?apiKey=<ONEUP_API_KEY>` for the 6 platform entries |
| 10 | YouTube title check | The published YouTube video has a real title, not "invalid or empty" — confirms `title` param is wired (not `video_title`) |
| 11 | Watch the publish status badges in `/admin/va-queue/[postId]` | All 6 platforms turn green within 5 minutes |
| 12 | Email arrives at `OPERATOR_EMAIL` confirming publish | Resend is wired correctly |
| 13 | Refresh `/admin/blog-dashboard` | The Hours Saved card shows ≥ 2 hours; cumulative posts chart shows the new post |

### Step 7 — Hand-off (30 min)

Brief the operator and VA on the changes:
- 3-tab admin nav: Idea Review · Media Queue · Analytics
- Dashboard shows cumulative growth (the "Always Climbing" section is the long-term story)
- Hours Saved card communicates time-back-to-client value
- VA workflow is unchanged from previous client (same Media Queue, same publish button)

---

## Architecture Decisions (Worth Knowing)

### Why OneUp (and not Blotato anymore)

OneUp wins for analytics — `analyze.oneupapp.io` returns unified period-over-period metrics for YouTube, Facebook, TikTok, Instagram in one consistent shape. Blotato had no analytics and required per-platform direct API integrations (which broke when tokens expired). OneUp lost us Threads support; in exchange we got a single dashboard and one vendor.

### Why HeyGen V5 / Avatar IV

The flag is `use_avatar_iv_model: true` at the root of the request body (NOT inside `character.avatar_settings`). Without it the API defaults to V3 and someone has to manually upgrade each video in the HeyGen dashboard. V5 produces significantly better lip-sync and natural movement.

### Why the script frames the agent as a "local resident, not a real estate agent"

In `app/api/content/generate-script/route.ts` the prompt explicitly forbids the words "real estate agent", "realtor", and the brand name in the spoken script. The agent is positioned as a long-time local resident, parent of kids in local schools, and a local investor. This dramatically increases engagement — viewers respond to a neighbour, not a salesperson. The CTA points to "the link in the description" pointing at the blog post, never a phone call.

### Why we calculate Hours Saved at 2 hours per post

Realistic estimate: research (15 min) + outline (10 min) + first draft (40 min) + edit (20 min) + image find (10 min) + schedule + publish (15 min) = ~110 minutes. Round to 2 hours. The Hours Saved card on `/admin/blog-dashboard` shows the current week's value plus the all-time accumulation — communicates the time-back-to-the-client story that real estate agents universally respond to (they hate writing).

### Why the dashboard has an "Always Climbing" cumulative section

30-day windowed numbers wobble. A slow week makes "vs prior 30 days" go red even when the underlying business is healthy. The cumulative section shows that every published post stays indexed and keeps driving traffic — the totals only go up. When a client gets nervous about a red KPI, scroll down one section.

### Why image transforms use JPG quality 80

X / Twitter rejects images larger than 5 MB. Sanity's default URL preserves the source PNG, which at width 1200 can hit 2–8 MB on detailed thumbnails. Adding `.quality(80).format('jpg')` to the image URL builder reliably keeps publishes under 5 MB while looking identical at social-feed display sizes.

### Branch protection / production hygiene

Don't enforce 2-reviewer branch protection on a single-developer agency project — it adds friction without value. If the client's org demands it, get the automation token (used by the LEARNINGS and AEO crons) added to the bypass list before turning protection on, or the crons will silently fail on commit.

---

## Common Issues + Fixes

### "Account not found or does not belong to the authenticated user" from OneUp analytics

OneUp analytics needs to be explicitly enabled per category by their support. Even with a paid plan it's not automatic. Email Davis (`davis@oneupapp.io`) with the template in `ONEUP.md` section 1.4. Took a few hours on our setup.

### YouTube videos publish with "invalid or empty video title"

OneUp's title param is `title` (NOT `video_title`). Already fixed in `lib/oneup-client.ts`. If a fork or a refactor breaks it, the symptom is YouTube rejecting the post even though OneUp's schedule call succeeded.

### HeyGen videos start at V3 instead of V5

`use_avatar_iv_model: true` must sit at the root of the request body (sibling to `video_inputs` and `dimension`), not inside `character.avatar_settings`. If V3 keeps happening, check that this flag is actually being sent and not being dropped by an old request template.

### Posts publish to Facebook but X errors with "Image size should be less than 5MB"

The image URL needs `.quality(80).format('jpg')` transforms in `getSanityImageUrl()`. Source PNG over 5 MB? Now under 1 MB.

### `/admin/blog-dashboard` shows "—" for cumulative website sessions

GA4 hasn't accumulated enough daily trend data yet, OR the GA4 service account isn't authorized on the property, OR `GOOGLE_ANALYTICS_PROPERTY_ID` is the measurement ID (`G-XXX`) instead of the 9-digit numeric property ID. Re-check `ONEUP.md` section 2.

### Admin nav shows the wrong analytics tab

`components/AdminNav.tsx` points to `/admin/blog-dashboard`. If a previous version pointed at `/admin/analytics` (the old multi-section page that was deleted), the build will succeed but clicking Analytics 404s. The fix is a single string in AdminNav.

### Cron commits to GitHub return 404

`GITHUB_TOKEN` either expired (PATs default to 30/60/90 days — set to 1 year or no expiration) or doesn't have `Contents: Read and write` on the repo. The LEARNINGS-update and AEO-pages crons depend on this.

### Sanity image URLs return huge PNGs that break X

`getSanityImageUrl()` in `lib/publish-service.ts` must include `.quality(80).format('jpg')` for every social-publish image.

---

## The Claude Code Prompt

Paste this into a Claude Code session in the new client's empty repo. Claude will use it as the brief and start executing.

```
You are setting up the full content machine pipeline for a new real estate client.
The reference implementation is the Legacy Home Search project (Barry Jenkins,
Hampton Roads, Virginia). The full replication guide is in CONTENT_MACHINE_REPLICATION.md
at the root of this repo. Read it before you do anything.

This new client is:
- Agent: <full name>
- Brand: <brand>
- Market: Las Vegas Valley, Nevada
- Primary cities served: Las Vegas, Henderson, North Las Vegas, Summerlin,
  Spring Valley, Sunrise Manor (confirm with the operator before relying on this list)
- State for Fair Housing rules: Nevada
- Production domain: <domain>.com
- Sanity project ID: <id>
- Redis key prefix: <prefix>:
- OneUp category ID: <id>

Your job, in order:

1. Read CONTENT_MACHINE_REPLICATION.md end-to-end. Then read ONEUP.md, BLOG_PIPELINE.md,
   FAIR_HOUSING.md, and AEO.md so you understand the whole system.

2. Compare what's in this repo against the "File Inventory" section in the replication
   guide. List which portable files are present, which customisable files need editing,
   and which Barry-specific files were never copied (and shouldn't be).

3. Walk through Section "Per-Client Customizations". For each find/replace, scan the
   codebase for the string, propose the per-file changes, and only apply them after
   showing the operator a summary of how many files will be touched.

4. Verify all environment variables in Vercel match the "Environment Variables" reference.
   List any that are missing. DO NOT generate or fabricate values — ask the operator.

5. Run the smoke-test checklist in Section "Setup Sequence — Step 6". Run them in order.
   Report any failures with the exact error and the section of "Common Issues + Fixes"
   that addresses it.

6. Once smoke tests pass: ping the operator with a summary of what's live, what's
   scheduled, what's pending, and which screens to review.

Critical rules:
- Do NOT introduce Blotato code into this project. OneUp is the only social publisher.
- Threads is NOT supported by OneUp — drop it from any captions or publish logic.
- HeyGen videos must use Avatar IV / V5 — the flag `use_avatar_iv_model: true` goes
  at the root of the /v2/video/generate request body.
- The video script generator MUST frame the agent as a local resident / parent /
  investor — explicitly forbid "real estate agent", "realtor", or the brand name in
  the spoken script. CTA points to the blog post link in the description.
- Image URLs from Sanity must include .quality(80).format('jpg') to stay under X's 5MB cap.
- Analytics dashboard lives at /admin/blog-dashboard. Do not rebuild /admin/analytics.
- The "Hours Saved" KPI is 2 hours per post — this is the user-facing time-savings story.
- The admin nav has exactly 3 tabs: Idea Review, Media Queue, Analytics.

If anything in the replication guide conflicts with what you find in the codebase,
trust the codebase as ground truth and flag the doc inconsistency back to the operator
so we can update it. Don't silently work around it.
```

---

## Changelog

- **2026-06 (current):** Migrated publish + analytics from Blotato to OneUp. Dropped Threads. Added HeyGen V5 / Avatar IV. Rewrote video script prompt for local-resident framing. Consolidated admin to 3 tabs. New `/admin/blog-dashboard` with Always Climbing cumulative section + Hours Saved KPI. Newsreader Italic in vivid blue for headline emphasis. Sanity image transforms for X 5MB cap.
- **2026-04:** Initial Shana Gates replication setup.
- **2026-03:** Pipeline went live for Barry Jenkins / Legacy Home Team LPT.
