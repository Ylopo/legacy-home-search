# Prompt 1 — Add Content Machine to an Existing Next.js + Sanity Site

**Use this when:** the new client's marketing site is **already built on Next.js + Sanity** (the same stack as Barry's). The content machine gets bolted into the existing project — admin pages, lib files, cron routes, Sanity schema additions. One Vercel project, one domain, one repo.

**Don't use this when:** the client's site is static HTML, WordPress, Webflow, or any other non-Next.js stack. For those, use [`PROMPT_2_HTML_TO_NEXTJS.md`](./PROMPT_2_HTML_TO_NEXTJS.md) first to convert the site, then come back and run this prompt.

---

## Before pasting

1. **Fill out [`customization-template.md`](./customization-template.md)** — or let Phase 0 auto-derive it from the existing site (recommended; faster and more accurate)
2. **Capture the 9 screenshots** per [`screenshots/README.md`](./screenshots/README.md) and drop them into `screenshots/`
3. **Provision the new client's accounts** — Sanity, Upstash Redis, OneUp category, HeyGen avatar + voice. See `../CONTENT_MACHINE_REPLICATION.md` for the full account checklist.
4. **Substitute the two placeholders** below before pasting:
   - `<SOURCE_PATH>` → absolute path to a copy of the Legacy Home Search repo (read-only reference)
   - `<KIT_PATH>` → absolute path to this `replication-kit/` folder (so Claude Code can read the template + screenshots)

Open Claude Code in the **new client's empty repo**, then paste everything between the horizontal rules.

---

> You are setting up the content machine for a new real-estate client. The source system is a Next.js 16 + Sanity + Vercel + Upstash Redis + OneUp + HeyGen + Anthropic content pipeline built for Legacy Home Search (Barry Jenkins, Hampton Roads VA). You're replicating it for a different agent in a different market.
>
> **Source repo (READ-ONLY):** `<SOURCE_PATH>`
> **Replication kit (READ-ONLY):** `<KIT_PATH>`
> **New client repo (your current working directory):** the client's already-built marketing site, built on this same Next.js + Sanity stack. It already contains the client's identity, communities, team, contact info, brand colors, fonts, and Sanity config. You will ADD the authority engine into it — and you'll mine it for the customization values in Phase 0.
>
> ### Phase 0 — Auto-derive client identity from the existing site
>
> The operator has NOT hand-filled most of `<KIT_PATH>/customization-template.md`. Derive it yourself from the current working directory (the built site), then present it for a quick confirm. Read:
>
> - `app/globals.css` — brand colors (CSS variables), off-white/cream, body text color → Section 5 + the color rows in Section 2
> - the font setup (`app/layout.tsx` / `next/font` imports) → headline / body / italic display fonts
> - `sanity/client.ts` + `sanity.config.ts` → Sanity project ID, dataset, studio title (Section 3)
> - `app/layout.tsx` or the analytics component → GA4 measurement ID (`G-…`) + GTM container ID
> - Sanity `siteSettings` + `teamMember` docs and the bio/contact/footer components → client name, agent name, years in market, positioning, public phone, public email, office address (Sections 1 + 4)
> - community page routes + Sanity `communityPage` docs + the site nav → primary communities, market name, state (Section 1)
> - the existing blog + community content → draft the special content angles (Section 7) and the state-specific items (Section 6)
> - site config / live domain → Section 1 domain; derive the local area code from the phone number
>
> Fill EVERY field in Sections 1, 2, 5, the Sanity + GA rows of Section 3, the site-derived rows of Section 4 (agent email / phone / address), and draft Sections 6 + 7. Then show the operator the completed template plus the find/replace map and ask them to confirm or correct.
>
> Then ask the operator ONLY for the net-new authority-engine credentials that do not exist on the site yet (these are the accounts provisioned specifically for the content machine):
>
> - Upstash Redis URL + token (and pick a 3–4 letter Redis prefix)
> - OneUp category ID + the 4 social account IDs (FB / IG / YT / TikTok)
> - HeyGen avatar ID + voice ID
> - Resend API key + verified from-email
> - GA4 property ID (9-digit) + service-account access
> - GitHub repo (company org) + a PAT with repo scope
>
> Do not proceed to Phase 1 until the auto-derived values are confirmed and the net-new credentials are provided.
>
> ### Phase 1 — Read the source
>
> Open these files in order. Don't skim; this is the foundation.
>
> **Master playbooks:**
> 1. `<SOURCE_PATH>/CLAUDE.md`
> 2. `<SOURCE_PATH>/CONTENT_MACHINE_REPLICATION.md` ← deep technical reference
> 3. `<SOURCE_PATH>/BLOG_PIPELINE.md`
> 4. `<SOURCE_PATH>/FAIR_HOUSING.md`
> 5. `<SOURCE_PATH>/ONEUP.md`
>
> **Source code to mirror:**
> 6. `<SOURCE_PATH>/lib/research.ts` — Tavily query templates (highly market-specific)
> 7. `<SOURCE_PATH>/lib/idea-writer.ts` — Claude Sonnet writing prompt (agent identity, voice, structure)
> 8. `<SOURCE_PATH>/lib/idea-store.ts` — Redis idea queue
> 9. `<SOURCE_PATH>/lib/publish-service.ts` — publish orchestrator
> 10. `<SOURCE_PATH>/lib/oneup-client.ts` — OneUp API wrapper
> 11. `<SOURCE_PATH>/lib/heygen-client.ts` — HeyGen V5 / Avatar IV video generation
> 12. `<SOURCE_PATH>/lib/fair-housing.ts` — protected-class rules + post-generation check
> 13. `<SOURCE_PATH>/lib/required-topics.ts` — per-city evergreen topic registry
> 14. `<SOURCE_PATH>/lib/fed-research.ts` — Federal Reserve same-day post cron
> 15. `<SOURCE_PATH>/lib/events-research.ts` — monthly events cron
> 16. `<SOURCE_PATH>/lib/sanity-write.ts` — Sanity create/update helpers
> 17. `<SOURCE_PATH>/lib/types.ts` — shared TS types
> 18. `<SOURCE_PATH>/lib/portable-text-utils.ts` — markdown ↔ portable text
> 19. `<SOURCE_PATH>/lib/email.ts` — Resend transactional templates
> 20. `<SOURCE_PATH>/sanity/schema/blogPost.ts` — the central document
> 21. `<SOURCE_PATH>/sanity/queries.ts` — VA queue, dashboard queries, sort order
>
> **Admin UI to mirror (match the screenshots in `<KIT_PATH>/screenshots/`):**
> 22. `<SOURCE_PATH>/app/admin/idea-review/page.tsx`
> 23. `<SOURCE_PATH>/app/admin/va-queue/page.tsx`
> 24. `<SOURCE_PATH>/app/admin/va-queue/[postId]/page.tsx`
> 25. `<SOURCE_PATH>/app/admin/blog-dashboard/page.tsx`
> 26. `<SOURCE_PATH>/app/admin/refresh-queue/page.tsx`
> 27. `<SOURCE_PATH>/app/admin/blog-picker/[date]/page.tsx`
> 28. `<SOURCE_PATH>/components/AdminNav.tsx`
>
> **Key API routes:**
> 29. `<SOURCE_PATH>/app/api/cron/research/route.ts`
> 30. `<SOURCE_PATH>/app/api/cron/fed-rate-update/route.ts`
> 31. `<SOURCE_PATH>/app/api/cron/events-research/route.ts`
> 32. `<SOURCE_PATH>/app/api/content/ideas/approve/route.ts`
> 33. `<SOURCE_PATH>/app/api/content/publish/route.ts`
> 34. `<SOURCE_PATH>/app/api/content/generate-heygen-video/route.ts`
> 35. `<SOURCE_PATH>/app/api/content/generate-script/route.ts`
> 36. `<SOURCE_PATH>/vercel.json`
>
> **Visual targets:** Open every PNG in `<KIT_PATH>/screenshots/` — these are the target admin UI. Match layout, badges, status colors, info density.
>
> **Identity:** Read `<KIT_PATH>/customization-template.md`. The operator has filled it in. Treat those values as the source of truth.
>
> Once read, confirm back to me:
> *"Read the source. Pipeline is [X → Y → Z]. Admin UI has N pages. Here's the find/replace map I'll apply for [Client Name]…"*
> List every find/replace pair you'll use BEFORE writing any code.
>
> ### Phase 2 — Hard rules (non-negotiable)
>
> - **Source is read-only.** Do not modify any file in `<SOURCE_PATH>`.
> - **LinkedIn and X are NOT in the publish flow by default.** Only Facebook, Instagram, YouTube, TikTok. The source recently removed LinkedIn/X — keep them out. If the new client connects them later, they can be added back via the same pattern.
> - **No Blotato code.** OneUp replaces it entirely. If you see `lib/blotato-client.ts` in the source, ignore it.
> - **Redis prefix is client-specific.** The source uses `lhs:` — every Redis key in the new client must use the prefix from `customization-template.md` (e.g. `srlv:` for Scofield, `shg:` for Shana).
> - **Sanity is per-client.** Never reuse Barry's project ID `2nr7n3lm`. Use the new client's Sanity project ID from the template.
> - **HeyGen avatar is per-client.** Each client needs their own HeyGen avatar UUID + voice ID. Don't reuse Barry's.
> - **OneUp category is per-client.** Each client gets their own OneUp category ID. Don't reuse Barry's `179358`.
> - **Fair Housing rules are state-specific.** Virginia is the default in `lib/fair-housing.ts`. If the new client is in a different state, update protected-class wording to match that state's fair housing law. Nevada and California have additional protected classes Virginia doesn't.
> - **VA queue priority pinning** (`vaQueuePriority: 100`) is built-in for Fed posts and breaking news. Preserve this behavior — the field is on `blogPost` schema, the sort is in `sanity/queries.ts getVAQueue()`, and the badge is in the VA queue post card.
> - **FOMC dates in vercel.json are 2026-specific.** Update them to the current year's Fed meeting schedule.
> - **Don't ship community pages or marketing pages.** Barry's `app/(site)/*` routes (community pages, team profiles, AEO pages, hero, etc.) are highly customized. Skip those entirely — the new client builds their own marketing site separately. This kit replicates ONLY the admin/content pipeline.
> - **Don't ship deprecated platform clients.** Skip `lib/facebook-client.ts`, `lib/youtube-client.ts`, `lib/tiktok-client.ts`, `lib/instagram-client.ts`, `lib/linkedin-client.ts`, `lib/blotato-client.ts`. OneUp handles publishing for all platforms.
> - **AdminNav has exactly 4 tabs and must render on every admin page.** In order: `Blog Picker` (→ `/admin/idea-review`), `Media Review` (→ `/admin/va-queue`), `Analytics` (→ `/admin/blog-dashboard`), `Refresh Queue` (→ `/admin/refresh-queue`). Every page under `app/admin/*` must include `<AdminNav />` as the first child of its root container — no exceptions. The Refresh Queue page is real, fully functional, and high-value — never orphan it from the nav.
>
> ### Phase 3 — Apply the find/replace + per-file customizations
>
> Use the table in `<KIT_PATH>/customization-template.md` Section 2 (Find/Replace strings). Apply globally across all copied files.
>
> Files that need MORE than find/replace (re-read and rewrite the market-specific content):
>
> - **`lib/research.ts`** — replace the Tavily query templates with the new market's cities, regions, and special context (military base, coastal, mountain, urban, etc.).
> - **`lib/idea-writer.ts`** — rewrite the agent identity paragraph in the system prompt to match the new agent's positioning (years in market, frame as local resident not realtor).
> - **`lib/required-topics.ts`** — rebuild the per-city evergreen topic registry for the new market's communities.
> - **`lib/fair-housing.ts`** — if a different state, update protected-class list per that state's fair housing law.
> - **`LEARNINGS.md`** — start with a fresh seed: voice principles + market context for the new client. The Wednesday cron will rewrite it weekly once live data accumulates.
> - **`CLAUDE.md`** — fresh project facts for the new client.
> - **`vercel.json`** — keep all the cron routes, but verify FOMC dates are current.
>
> ### Phase 4 — Sanity setup
>
> 1. Create or use the new client's Sanity project (the operator should have provisioned it).
> 2. Copy `<SOURCE_PATH>/sanity/schema/*.ts` and `<SOURCE_PATH>/sanity.config.ts`.
> 3. Update `sanity.config.ts` with the new project ID and the new studio title.
> 4. Run `npx sanity@latest deploy` in the new repo to publish the studio.
>
> ### Phase 5 — Deploy + cron
>
> 1. Push the new repo to GitHub.
> 2. Connect to Vercel (operator provides the team account).
> 3. Set every env var from `<SOURCE_PATH>/.env.local.example` in Vercel — values come from the customization template + the operator's provisioned accounts.
> 4. Vercel auto-detects `vercel.json` and registers all crons.
> 5. Deploy.
>
> ### Phase 6 — Smoke tests
>
> Use the operator's `ADMIN_SECRET` from the env vars. Run each in order:
>
> ```bash
> # Idea research (should populate Redis queue)
> curl -sX POST "https://<NEW_DOMAIN>/api/cron/research?secret=$ADMIN_SECRET" | head -c 400
>
> # Manually approve the top idea (should produce a Sanity draft)
> # First fetch ideas, copy the top _id, then:
> curl -sX POST "https://<NEW_DOMAIN>/api/content/ideas/approve?secret=$ADMIN_SECRET" \
>   -H "Content-Type: application/json" \
>   -d '{"ideaId":"<id>"}'
>
> # Check the post lands in Sanity media_pending
> # (verify in Sanity Studio under blogPost docs)
>
> # Fed cron — manual replay against the last FOMC meeting date
> curl -sX POST "https://<NEW_DOMAIN>/api/cron/fed-rate-update?secret=$ADMIN_SECRET" \
>   -H "Content-Type: application/json" \
>   -d '{"overrideDate":"<YYYY-MM-DD of last FOMC>"}'
>
> # Verify VA queue renders
> # Open: https://<NEW_DOMAIN>/admin/va-queue?secret=$ADMIN_SECRET
> # Fed post should be at the top with red 🔥 PRIORITY ribbon
>
> # Verify dashboard renders (will show 0 data on day 1)
> # Open: https://<NEW_DOMAIN>/admin/blog-dashboard?secret=$ADMIN_SECRET
> ```
>
> Once a real post is in `media_ready` with a thumbnail and video, hit the publish endpoint to verify OneUp wiring:
>
> ```bash
> curl -sX POST "https://<NEW_DOMAIN>/api/content/publish?secret=$ADMIN_SECRET" \
>   -H "Content-Type: application/json" \
>   -d '{"postId":"<sanity-post-id>"}'
> ```
>
> Expected response: `ok: true` with submission IDs for `facebook`, `facebookReel` (if video), `youtube` (if video), `tiktok` (if video), `instagram`. **No `linkedin` or `twitter` fields.**
>
> ### Phase 7 — Hand-off
>
> Report back with:
>
> - Sanity Studio URL
> - Vercel production deployment URL
> - Admin URLs with secret-link auth (so the operator can bookmark them):
>   - `https://<NEW_DOMAIN>/admin/idea-review?secret=<ADMIN_SECRET>`
>   - `https://<NEW_DOMAIN>/admin/va-queue?secret=<ADMIN_SECRET>`
>   - `https://<NEW_DOMAIN>/admin/blog-dashboard?secret=<ADMIN_SECRET>`
> - OneUp category ID
> - HeyGen avatar ID + voice ID
> - GA4 property ID + measurement ID
> - Any divergences from the source (e.g. "Nevada FH list expanded with sexual-orientation language")
> - Any issues to flag for the operator

---

## After this prompt finishes

Use [`SETUP_CHECKLIST.md`](./SETUP_CHECKLIST.md) to verify every phase end-to-end before handing off to the operator.
