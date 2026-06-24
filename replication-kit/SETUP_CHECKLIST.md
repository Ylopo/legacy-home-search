# Setup Checklist

Compact verification — one page. For deep technical context on any step, see [`../CONTENT_MACHINE_REPLICATION.md`](../CONTENT_MACHINE_REPLICATION.md).

---

## Phase 1 — Provision accounts (~45 min)

- [ ] **Sanity** — Create new project at sanity.io/manage. Note the project ID.
- [ ] **Sanity API token** — Settings → API → Tokens → "+ Add API Token" → Editor scope. Save the token (only shown once).
- [ ] **Upstash Redis** — Create new database at upstash.com. Note REST URL + REST token.
- [ ] **OneUp category** — In OneUp dashboard, create a new category for this client. Connect Facebook, Instagram, YouTube, TikTok accounts (skip LinkedIn + X unless the client explicitly wants them). Note the category ID + each social_network_id.
- [ ] **HeyGen avatar + voice** — Create or upload the agent's avatar in HeyGen. Generate or clone the voice. Note the avatar ID + voice ID.
- [ ] **Resend** — Verify the agent's domain (or use the operator's existing Resend account). Note the API key.
- [ ] **GA4 property** — Create at analytics.google.com. Enable the Data API. Create a service account in GCP, download the JSON. Note the property ID (9-digit) + measurement ID (`G-`).
- [ ] **Tavily** — Free tier (1k searches/mo) is enough. Note the API key.
- [ ] **Anthropic** — Use the existing API key (shared across clients) or create a new one. Confirm it has access to Sonnet, Haiku, and Opus.

---

## Phase 2 — Capture screenshots (~10 min)

- [ ] Open the source admin pages with your `ADMIN_SECRET` from the source's `.env.local`
- [ ] Capture all 9 screenshots per [`screenshots/README.md`](./screenshots/README.md)
- [ ] Save them in `replication-kit/screenshots/` with the exact filenames listed in that guide

---

## Phase 3 — Fill the template (~15 min)

- [ ] Open [`customization-template.md`](./customization-template.md)
- [ ] Fill every field in all 8 sections
- [ ] Verify Section 8 checklist at the bottom of the template

---

## Phase 4 — Run the prompt (~20 min interactive)

- [ ] Create the new client's Next.js project (or empty repo) in the location you want
- [ ] Open Claude Code in that project directory
- [ ] Copy the **Prompt** section from [`README.md`](./README.md) — substitute `<SOURCE_PATH>` and `<KIT_PATH>` with absolute paths
- [ ] Paste the prompt
- [ ] When Claude Code confirms "Read the source. Pipeline is X → Y → Z…", review the find/replace map BEFORE allowing it to write code
- [ ] Approve and let Claude Code apply the changes

---

## Phase 5 — Sanity studio (~10 min)

- [ ] Run `npx sanity@latest init` if not done by Claude Code (or verify it already did)
- [ ] Verify `sanity.config.ts` has the new project ID + new studio title
- [ ] Run `npx sanity@latest deploy` to publish the studio
- [ ] Open the studio URL and confirm the `blogPost`, `siteSettings`, `communityPage` schemas appear

---

## Phase 6 — Vercel + env vars (~15 min)

- [ ] Push the new repo to GitHub (or wherever the team hosts code)
- [ ] Connect to Vercel
- [ ] Add all env vars from `.env.local.example`. Cross-check every one:
  - [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` (new client's)
  - [ ] `SANITY_WRITE_TOKEN` (new client's)
  - [ ] `ANTHROPIC_API_KEY`
  - [ ] `OPENAI_API_KEY` (for thumbnails)
  - [ ] `TAVILY_API_KEY`
  - [ ] `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
  - [ ] `RESEND_API_KEY` + `FROM_EMAIL` + `OPERATOR_EMAIL`
  - [ ] `ADMIN_SECRET` (generate with `openssl rand -hex 32`)
  - [ ] `CRON_SECRET` (generate with `openssl rand -hex 32`)
  - [ ] `NEXT_PUBLIC_APP_URL` (new domain)
  - [ ] `ONEUP_API_KEY` (shared agency key)
  - [ ] `ONEUP_CATEGORY_ID` (new client's category)
  - [ ] `ONEUP_FACEBOOK_ACCOUNT_ID`, `ONEUP_INSTAGRAM_ACCOUNT_ID`, `ONEUP_YOUTUBE_CHANNEL_ID`, `ONEUP_TIKTOK_ACCOUNT_ID`
  - [ ] `HEYGEN_API_KEY` + `HEYGEN_AVATAR_LOOK_ID` + `HEYGEN_VOICE_ID`
  - [ ] `GOOGLE_ANALYTICS_PROPERTY_ID` + `GOOGLE_SERVICE_ACCOUNT_JSON` + `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  - [ ] `GITHUB_TOKEN` (PAT with repo scope, for LEARNINGS commits)
- [ ] Deploy
- [ ] Verify cron schedules registered (Vercel → Project → Settings → Cron Jobs)

---

## Phase 7 — Smoke tests (~20 min)

Replace `<DOMAIN>` with the new client's production URL. Use the new `ADMIN_SECRET`.

- [ ] **Research cron** runs:
  ```
  curl -sX POST "https://<DOMAIN>/api/cron/research?secret=<ADMIN_SECRET>" | head -c 400
  ```
  Expected: JSON with ideas pushed to Redis queue.
- [ ] **Idea review page renders:**
  ```
  https://<DOMAIN>/admin/idea-review?secret=<ADMIN_SECRET>
  ```
  Expected: list of ~5–30 scored ideas.
- [ ] **Approve one idea** (click in UI or POST to `/api/content/ideas/approve`). Expected: post lands in Sanity as `media_pending`, FH check runs and saves result to Redis, operator email arrives.
- [ ] **VA queue renders:**
  ```
  https://<DOMAIN>/admin/va-queue?secret=<ADMIN_SECRET>
  ```
  Expected: the new post visible with `media_pending` badge.
- [ ] **Fed cron** runs against last FOMC meeting:
  ```
  curl -sX POST "https://<DOMAIN>/api/cron/fed-rate-update?secret=<ADMIN_SECRET>" \
    -H "Content-Type: application/json" \
    -d '{"overrideDate":"<YYYY-MM-DD of last FOMC>"}'
  ```
  Expected: post created with `vaQueuePriority: 100`, pinned to top of VA queue with red 🔥 PRIORITY ribbon.
- [ ] **Dashboard renders** (will show 0 data on day 1):
  ```
  https://<DOMAIN>/admin/blog-dashboard?secret=<ADMIN_SECRET>
  ```
  Expected: dashboard loads without errors.
- [ ] **Full publish flow**: in VA queue, manually upload a thumbnail to one post, mark ready, hit publish.
  Expected: `ok: true` response with submission IDs for `facebook`, `facebookReel` (if video), `youtube` (if video), `tiktok` (if video), `instagram`. **No `linkedin` or `twitter` fields.**

---

## Phase 8 — Operator hand-off

- [ ] Bookmark the 3 admin URLs (with the secret embedded in the URL — the secret-link auth pattern):
  - `https://<DOMAIN>/admin/idea-review?secret=<ADMIN_SECRET>`
  - `https://<DOMAIN>/admin/va-queue?secret=<ADMIN_SECRET>`
  - `https://<DOMAIN>/admin/blog-dashboard?secret=<ADMIN_SECRET>`
- [ ] Send the operator a kickoff email with:
  - All three URLs
  - Sanity Studio URL
  - Vercel project URL
  - First-week expectations (operator approves daily, VA picks up posts in 24h)
- [ ] Schedule a 30-min walk-through with the operator + VA in week 1
- [ ] Schedule the first bi-weekly performance review for the 15th of next month

---

## Phase 9 — Post-launch (day 7)

- [ ] Verify ideas are accumulating in the queue daily
- [ ] Verify the operator is approving ~1 idea/day
- [ ] Verify the VA is publishing ~1 post/day
- [ ] Check `LEARNINGS.md` was rewritten by the Wednesday cron (commits to GitHub)
- [ ] Confirm GA4 is receiving page views from the new domain
- [ ] Confirm Resend has not bounced any operator emails

If any of these are 0, debug before proceeding. See `CONTENT_MACHINE_REPLICATION.md` Common Issues + Fixes.

---

**Total expected setup time:** 3–4 hours of active work (excluding waiting for Sanity deploy, Vercel deploy, DNS propagation, etc.).
