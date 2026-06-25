# Content Machine Replication Kit

A turn-key kit for cloning the Legacy Home Search content machine to a new real-estate client. Pick the right prompt based on what the client already has, paste it into a fresh Claude Code session in their repo, and the system builds itself.

---

## What This Kit Does

The content machine is a daily, mostly-automated content pipeline. Each morning, a cron researches the market via Tavily, scores and queues ~30 ideas, and emails the operator. The operator approves the day's pick at `/admin/idea-review`; Claude Sonnet writes a 400–900 word post, Claude Haiku runs a Fair Housing check, and the post lands in the VA Queue at `/admin/va-queue`. A virtual assistant adds a thumbnail, generates a HeyGen avatar video, fills the captions, and hits publish — the post goes live on the site and to Facebook, Instagram, YouTube, and TikTok via OneUp. Analytics roll up nightly into `/admin/blog-dashboard`. Content refreshes (rewriting older posts in-place to keep SEO authority compounding) live at `/admin/refresh-queue`.

That whole loop is what this kit replicates onto any new client.

---

## Which Prompt Do I Use?

This decision tree picks itself in one question — what tech stack is the client's marketing site on?

| Client's marketing site is… | Use | Why |
|---|---|---|
| **Next.js + Sanity already** (built fresh from day one, or already migrated) | [`PROMPT_1_NEXTJS_SITE.md`](./PROMPT_1_NEXTJS_SITE.md) | Direct content-machine bolt-on. ~2-3 hours. |
| **Static HTML, WordPress, Webflow, Squarespace, anything else** | [`PROMPT_2_HTML_TO_NEXTJS.md`](./PROMPT_2_HTML_TO_NEXTJS.md) first, then `PROMPT_1` | Convert the site to Next.js + Sanity first, then bolt on. ~5-7 hours migration + 2-3 hours content machine = ~8-10 hours total. |

**Going forward**, every new client site should be built on Next.js + Sanity from day one — so most future replications use PROMPT_1 only. PROMPT_2 exists for legacy clients who already have a non-Next.js site and want to upgrade.

---

## How To Use This Kit

Total time: 2-3 hours for Prompt 1, 5-7 additional hours for Prompt 2 if needed. All assumes accounts are provisioned in advance.

1. **Decide which prompt** using the table above.
2. **Provision accounts** in advance (Sanity, Upstash Redis, OneUp client category, HeyGen avatar + voice, Resend, GA4). The full account table is in [`../CONTENT_MACHINE_REPLICATION.md`](../CONTENT_MACHINE_REPLICATION.md) section **Required Accounts**.
3. **For PROMPT_1 only — capture the 9 screenshots** listed in [`screenshots/README.md`](./screenshots/README.md) from a working source instance (e.g. `legacyhometeamlpt.com/admin/*`). Drop the PNGs in `screenshots/` with the exact filenames specified.
4. **Open Claude Code** in the new client's repo. Paste the chosen prompt with placeholders replaced (each prompt file explains exactly which placeholders).
5. **Work the checklist** at [`SETUP_CHECKLIST.md`](./SETUP_CHECKLIST.md). Verify each phase before moving to the next.

The customization template at [`customization-template.md`](./customization-template.md) is mostly auto-filled by Claude in Phase 0 of PROMPT_1, so you usually only manually fill in the net-new credentials section. PROMPT_2 doesn't use it — the migration discovers the client identity from the existing site.

---

## Files Claude Code Will Read (Quick Reference)

The prompts list these in their Phase 1 — duplicated here for easy scanning if you want to grep for anything before pasting.

### Master playbooks (must-read in order)
| File | Why |
|---|---|
| `CLAUDE.md` | Project facts, current status, sanity config |
| `CONTENT_MACHINE_REPLICATION.md` | Deep technical reference — accounts, env vars, find/replace, full setup sequence, known issues |
| `BLOG_PIPELINE.md` | Day-to-day operational guide — phases, cron schedule, VA workflow |
| `FAIR_HOUSING.md` | Compliance — protected classes, violations table, alert workflow |
| `ONEUP.md` | OneUp API quirks, account setup, analytics |

### Core lib files (copy as-is or with find/replace)
`lib/research.ts`, `lib/idea-writer.ts`, `lib/idea-store.ts`, `lib/scoring.ts`, `lib/source-rules.ts`, `lib/publish-service.ts`, `lib/oneup-client.ts`, `lib/oneup-analytics.ts`, `lib/heygen-client.ts`, `lib/fair-housing.ts`, `lib/required-topics.ts`, `lib/required-topics-coverage.ts`, `lib/fed-research.ts`, `lib/events-research.ts`, `lib/refresh-engine.ts`, `lib/refresh-writer.ts`, `lib/refresh-store.ts`, `lib/refresh-config.ts`, `lib/sanity-write.ts`, `lib/types.ts`, `lib/portable-text-utils.ts`, `lib/email.ts`, `lib/content-workflow.ts`, `lib/learnings.ts`, `lib/ga4.ts`, `lib/thumbnail-prompt.ts`, `lib/thumbnail-asset-resolver.ts`, `lib/image-gen-market-report.ts`, `lib/market-report-writer.ts`, `lib/renick-pipeline.ts`, `lib/aeo-queue.ts`, `lib/aeo-generator.ts`

### Sanity (copy as-is)
`sanity/schema/blogPost.ts`, `sanity/schema/communityPage.ts`, `sanity/schema/marketReport.ts`, `sanity/schema/siteSettings.ts`, `sanity/schema/teamMember.ts`, `sanity/schema/index.ts`, `sanity/queries.ts`, `sanity/client.ts`, `sanity.config.ts`

### Admin UI (copy then customize colors/labels)
`app/admin/idea-review/page.tsx`, `app/admin/va-queue/page.tsx`, `app/admin/va-queue/[postId]/page.tsx`, `app/admin/blog-dashboard/page.tsx`, `app/admin/refresh-queue/page.tsx`, `app/admin/blog-picker/[date]/page.tsx`, `app/admin/thumbnail-review/page.tsx`, `components/AdminNav.tsx`

### Cron routes (copy as-is)
`app/api/cron/research/route.ts`, `app/api/cron/fed-rate-update/route.ts`, `app/api/cron/events-research/route.ts`, `app/api/cron/learnings-update/route.ts`, `app/api/cron/performance-review/route.ts`, `app/api/cron/refresh-evaluation/route.ts`, `app/api/cron/required-topics-coverage/route.ts`, `app/api/cron/renick-pipeline/route.ts`, `app/api/cron/scheduled-publish/route.ts`, `app/api/cron/aeo-pages/route.ts`

### Content API routes (copy as-is)
Everything under `app/api/content/*`

### Config
`vercel.json`, `.env.local.example`, `package.json`, `tsconfig.json`, `next.config.ts`

---

## What Gets Skipped (Don't Copy)

### Marketing site
- `app/(site)/*` — Barry's homepage, community pages, team profiles, AEO landing pages, contact pages. The new client builds their own marketing site (or it's converted via PROMPT_2).
- `app/team/*`, `app/communities/*`, `app/virginia-beach/*`, etc.
- `components/HamptonRoadsMap.tsx`, `components/BarryBio.tsx`, etc. — anything Barry/Hampton Roads-specific.
- `public/community-photos/*` and other client-specific images.

### Deprecated infrastructure
- `lib/blotato-client.ts` — replaced by OneUp.
- `lib/facebook-client.ts`, `lib/youtube-client.ts`, `lib/tiktok-client.ts`, `lib/instagram-client.ts`, `lib/linkedin-client.ts` — replaced by OneUp.
- Any code path that references LinkedIn or X publishing. The source removed these; the new client starts without them.

### Disabled features
- Market reports pipeline (`lib/market-report-writer.ts`, `app/admin/market-reports/*`) — shelved pending Altos Research data access. Skip for now.

---

## Customization Touchpoints (Detailed)

| File | What changes |
|---|---|
| `lib/research.ts` | All Tavily query strings — swap city names, regions, market context |
| `lib/idea-writer.ts` | System prompt: agent identity, market framing, voice principles |
| `lib/required-topics.ts` | Per-city evergreen topic registry — full rewrite for new market |
| `lib/fair-housing.ts` | State-specific protected classes (Virginia is default) |
| `lib/idea-store.ts` | Redis prefix — replace `lhs:` everywhere |
| `lib/refresh-store.ts` | Same — Redis prefix |
| `lib/email.ts` | From/to addresses, brand color in templates |
| `lib/heygen-client.ts` | Default avatar ID + voice ID (per-client) |
| `lib/oneup-client.ts` | Per-client `CATEGORY_ID` env var |
| `sanity.config.ts` | Project ID + studio title |
| `app/admin/blog-dashboard/page.tsx` | Brand label, brand colors, agent name in header |
| `app/admin/idea-review/page.tsx` | Brand colors only |
| `app/admin/va-queue/page.tsx` + `[postId]` | Brand colors only |
| `vercel.json` | FOMC dates for current year |
| `CLAUDE.md` | Project facts |
| `LEARNINGS.md` | Voice + market context seed |
| All env vars | Per-client values (see customization-template.md) |

---

## Verification Checklist

The compact checklist lives at [`SETUP_CHECKLIST.md`](./SETUP_CHECKLIST.md). Don't mark the project shipped until every box is ticked.

---

## Folder Contents

```
replication-kit/
├── README.md                     ← this file: index + decision tree + reference tables
├── PROMPT_1_NEXTJS_SITE.md       ← prompt for Next.js + Sanity sites (most common)
├── PROMPT_2_HTML_TO_NEXTJS.md    ← prompt for legacy HTML/WordPress/Webflow sites
├── customization-template.md     ← per-client identity table (used by PROMPT_1's Phase 0)
├── SETUP_CHECKLIST.md            ← phase-by-phase verification
└── screenshots/
    ├── README.md                  ← capture guide for the 9 admin UI screenshots
    └── (9 PNGs — operator captures from a working source instance)
```

---

## Maintaining This Kit

When you discover a question the kit doesn't answer (during a real replication), patch the kit. Specifically:
- If Claude Code asks something obvious during PROMPT_1, add the answer to the relevant phase in PROMPT_1.
- If PROMPT_2's migration trips up on a new pattern (a third-party widget, a non-standard CSS framework, etc.), document it in PROMPT_2.
- If the screenshot guide is unclear, edit `screenshots/README.md`.
- If a new customization touchpoint appears, add it to the table above.

The kit gets better with every client.
