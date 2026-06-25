# Prompt 2 — Migrate a Static HTML Site to Next.js + Sanity

**Use this when:** the new client's marketing site is **static HTML** (or WordPress export, Webflow export, Squarespace, etc.) — anything that's not already Next.js. This prompt converts the marketing site to Next.js with pixel-perfect parity, preserves all URLs via 301 redirects, and leaves the project structured so the content machine can be bolted on next.

**Don't use this when:** the site is already Next.js + Sanity. Skip straight to [`PROMPT_1_NEXTJS_SITE.md`](./PROMPT_1_NEXTJS_SITE.md).

**Battle-tested on:** Kirby Scofield Group (Las Vegas) — converted 152 static HTML files + 63 legacy blog posts to a unified Next.js + Sanity site.

---

## Workflow overview

This prompt handles the **migration only** — converting the static site to Next.js, preserving its design and URLs. The content machine is a separate step that runs **after** this migration completes:

```
Static HTML site  ─►  PROMPT_2 (this file)  ─►  Next.js + Sanity site  ─►  PROMPT_1  ─►  + content machine
```

Total time: 5-7 hours of active work for a typical small real-estate site (50-200 HTML files). Plan across 2-3 sessions.

---

## Before pasting

The operator must fill in these placeholders. The prompt will stop and ask for any that are blank.

| Placeholder | What it is | Example |
|---|---|---|
| `SITE_REPO_PATH` | Absolute path to the current static-site repo | `/Users/teammate/clients/example-realty` |
| `CLIENT_NAME` | Agent or brokerage name | `Example Realty Group` |
| `AGENT_NAME` | Lead agent name | `Jane Smith` |
| `CLIENT_DOMAIN` | Live production domain | `examplerealty.com` |
| `SANITY_PROJECT_ID` | Existing Sanity project ID (if used) | `ab12cdef` (leave blank if no Sanity yet) |
| `MARKET` | City or region | `Austin, Texas` |

Open Claude Code in the **client's current static-site repo** (or a sibling directory if doing a fresh-repo migration). Paste everything between the horizontal rules.

---

> STATIC HTML → NEXT.JS MIGRATION PROMPT
>
> You are migrating a real-estate marketing site from static HTML to Next.js + Sanity so a blog automation system (the "content machine") can be added later. The content machine is its own playbook — this prompt covers ONLY the migration phase. After migration completes, the team will run `PROMPT_1_NEXTJS_SITE.md` to add the blog admin tools on top.
>
> ### Context to establish before starting
>
> The operator must fill in these placeholders. Stop and ask for any that are blank.
>
> - **SITE_REPO_PATH** — absolute path to the current static-site repo
> - **CLIENT_NAME** — the agent/brokerage name
> - **AGENT_NAME** — the lead agent name
> - **CLIENT_DOMAIN** — the live production domain
> - **SANITY_PROJECT_ID** — existing Sanity project ID (or blank if none)
> - **MARKET** — city or region
>
> If the operator hasn't provided these, STOP and ask. Do not assume.
>
> ### Why this migration matters
>
> A static HTML site cannot host the Next.js content machine (admin UI, scheduled cron jobs, serverless writes to Sanity, OneUp publish orchestration). Without migration, the content machine would have to live on a different Vercel project at a different URL — split between subdomains. That splits SEO authority and confuses operators. Unifying everything under one Next.js project at the main domain is the correct long-term architecture.
>
> ### Hard rules (non-negotiable)
>
> - **READ-ONLY on the live production site** until the explicit cutover step (Phase 4). Do not modify anything in `SITE_REPO_PATH` during Phases 0-3.
> - **Pixel-perfect visual parity.** The migrated Next.js site must look identical to the static site after migration. No redesigns, no "while we're in here" improvements.
> - **Every existing URL must keep working.** URLs that change get a 301 redirect from old to new — never a 404.
> - **The live site stays up the entire migration.** Cutover happens via Vercel domain swap (claim `CLIENT_DOMAIN` on the new Next.js project, remove it from the old static project). Old project stays alive 2 weeks post-cutover for rollback safety, then is deleted.
> - Do not touch `SANITY_PROJECT_ID` schemas in Phase 0-3 except read-only inspection. Schema changes happen during the content machine setup, AFTER this migration.
> - The Next.js project structure must leave room for `/admin/*` and `/api/cron/*` and `/api/content/*` routes to be added later by the content machine setup. Use route groups: `(marketing)` for the static site content, plus reserve `/admin` and `/api` at the root.
>
> ---
>
> ### PHASE 0 — Audit & decision points (READ-ONLY, ~30 min)
>
> Walk `SITE_REPO_PATH` and produce a structured report covering all 11 areas below. **ZERO file changes in this phase.** The output is a single readable report the operator reviews before any conversion work begins.
>
> **1. FILE CENSUS**
> - Total file count broken down by extension (.html, .css, .js, image formats, fonts, pdfs)
> - Total disk size
> - Anything that looks like build artifacts, .map files, or non-source content — flag it
> - Identify any serverless function files (commonly `site/api/*.js`, `api/*.ts`, or `/pages/api/*.js`)
>
> **2. PAGE INVENTORY**
> - Every `.html` file: path, purpose (homepage, agent profile, community page, listings, contact, blog post, legal), approximate line count, dynamic features (forms, embedded widgets, JS that fetches data)
> - Group by category and report counts
> - Estimate complexity per page: simple, medium, complex
>
> **3. SHARED LAYOUT PATTERNS**
> - Read the homepage AND 2 representative pages from each category. Identify HTML snippets that repeat (header, footer, nav, social icons)
> - Report exactly which snippets are duplicated — they become Next.js shared components
> - Flag pages with unique layouts that need their own Next.js page treatment
>
> **4. CSS ARCHITECTURE**
> - How many `.css` files? Where?
> - CSS variables — list ALL declared variables (especially brand colors)
> - Utility classes? Atomic CSS? Tailwind? Bootstrap?
> - External CSS from CDN?
> - Font loading strategy. List every font family in use.
>
> **5. JAVASCRIPT INVENTORY**
> - Every `.js` file outside of `node_modules`: path and purpose
> - Inline `<script>` blocks in HTML files — which pages, what they do
> - External `<script src="…">` tags: every URL and what it provides
> - Whether any JS does dynamic page rendering or is purely event handlers
>
> **6. THIRD-PARTY INTEGRATIONS**
> For each external service the site uses, document: which pages use it, exactly how it's embedded, any visible API keys or property IDs:
> - Analytics (GA4, GTM, others)
> - Maps (Mapbox, Google Maps)
> - Property listings / IDX (provider, source domain)
> - Video embeds (Vimeo, YouTube)
> - Chat widgets, lead capture tools
> - Anything else found
>
> **7. SERVERLESS FUNCTIONS**
> Read every API function end-to-end. For each:
> - Full signature and dependencies
> - HTTP methods handled
> - Destination services
> - Environment variables read
> - Return shape and error handling
>
> **8. VERCEL CONFIG**
> - Read every `vercel.json` and Vercel-related config
> - Document routing rules, redirects, rewrites, function configs, headers, cron jobs, env vars
>
> **9. SANITY INTEGRATION (if any)**
> - How is the site currently using Sanity? (Direct API fetch? Client-side? Build-time?)
> - What document types exist in `SANITY_PROJECT_ID`? Probe read-only via Sanity CLI or fetch
> - List existing schema if a `sanity/schema/` or studio config is in the repo
> - Flag any patterns we'd need to preserve when migrating
>
> **10. PROPOSED NEXT.JS ROUTE STRUCTURE**
> Based on findings 1-9, propose the App Router structure. Example:
>
>     app/
>     ├── (marketing)/         ← all converted static-site content
>     │   ├── page.tsx          ← homepage
>     │   ├── agents/[slug]/    ← if agent profiles exist
>     │   ├── communities/[slug]/
>     │   ├── blog/[slug]/      ← if blog posts exist
>     │   ├── contact/
>     │   └── ...
>     ├── admin/               ← reserved for content machine (added later)
>     ├── api/                 ← reserved for content machine API routes
>     ├── api/lead/route.ts    ← ported from existing lead-capture function
>     └── globals.css
>
> List every Next.js page file and the source HTML file it corresponds to.
>
> **11. RISKS & SURPRISES**
> - Anything in `SITE_REPO_PATH` that doesn't fit the "plain HTML + CSS + vanilla JS" model
> - Third-party widgets tricky to integrate with Next.js App Router + React 19
> - Auth-required APIs where credentials might be hardcoded in source
> - Authoring-tool exports (Webflow, Wix, Squarespace) with proprietary structure
> - Estimated total Phase 2 (page conversion) work in hours
>
> ---
>
> ### DECISION POINTS — Ask the operator
>
> After delivering the audit report, ask the operator to make these decisions BEFORE proceeding. Do not start Phase 1 until all are answered.
>
> **D1. REPO STRATEGY**
> - (a) **Convert in-place** — `SITE_REPO_PATH` gets the Next.js scaffolding added to it. Existing static files stay until Phase 4 cutover, then deleted.
> - (b) New repo — fresh Next.js project at a sibling path. Static files copied over as Next.js pages.
> - **Recommended: (a)** unless they want a clean git history
>
> **D2. CUTOVER STRATEGY**
> - (a) **Vercel domain swap** — claim `CLIENT_DOMAIN` on new Next.js project, remove from old. Near-instant.
> - (b) DNS cutover — change DNS records. Up to 48hr propagation.
> - **Recommended: (a)**
>
> **D3. BLOG CONTENT** (only if existing blog posts found in Phase 0)
> - (a) **Migrate into Sanity.** Render `/blog/[slug]` dynamically. Old dated URLs get 301 redirects. New machine-written posts appear automatically once content machine is added.
> - (b) Keep as static Next.js pages, separate from content-machine posts.
> - **Recommended: (a)** — option (b) leaves a permanent gap that defeats the content machine's purpose
>
> **D4. CONTENT MACHINE TIMING**
> - (a) **Migration only.** Content machine added later via `PROMPT_1_NEXTJS_SITE.md` in a separate session.
> - (b) Migration + content machine in one giant session.
> - **Recommended: (a)** — clean migration, verified production, THEN bolt on content machine
>
> **D5. SANITY STUDIO LOCATION**
> - (a) **Embedded `/studio` route inside the new Next.js project**
> - (b) Separate Sanity-hosted studio at `PROJECT.sanity.studio`
> - (c) Existing studio location elsewhere (operator specifies)
> - **Recommended: (a)** for new projects, or whatever already exists
>
> Wait for the operator's answers before continuing. Print each decision and the chosen option clearly so the operator can verify.
>
> ---
>
> ### PHASE 1 — Scaffold the unified structure (~30 min)
>
> Based on D1, either add Next.js scaffolding to `SITE_REPO_PATH` or create a new sibling repo. The scaffolding:
> - Next.js 16+ with App Router and TypeScript
> - React 19
> - Tailwind CSS if the static site uses utility classes, otherwise plain CSS via globals.css
> - `@sanity/client` for Sanity reads
> - All font families found in Phase 0 audit, loaded via `next/font`
> - Route groups per Phase 0 Section 10
> - `globals.css` with all CSS variables from Phase 0 Section 4
> - `next.config.ts` with redirects (will be populated in Phase 2)
> - Initial homepage placeholder so `npm run dev` works
>
> Verify: `npm run dev` succeeds and `localhost:3000` renders something. Report back.
>
> ---
>
> ### PHASE 2 — Convert pages in batches (~3-5 hours)
>
> Convert in this order, with operator visual confirmation between each:
>
> 1. **Shared chrome** (Header, Footer, Nav, social icons) → reusable components
> 2. **Homepage** → `app/(marketing)/page.tsx`
> 3. **The biggest repeated category** (typically agent profiles or community pages) → dynamic route, data-driven if templatized
> 4. **Other static pages** (contact, about, legal)
> 5. **Blog** (per D3 decision)
> 6. **Sitemap.xml** generation for all migrated pages
>
> For each page:
> - Read the source HTML carefully — preserve every visual element, ID, class, data attribute that affects layout or widget binding
> - Convert to JSX with appropriate component breakdown
> - Wire third-party scripts via `next/script` (afterInteractive for analytics, beforeInteractive for things like Mapbox)
> - IDX widgets, video embeds, maps: each gets a small wrapper component if needed for proper Next.js mounting
> - Test in browser at `localhost:3000` BEFORE moving to next page
>
> Forms (lead capture): leave HTML structure identical; form action posts to the same path as before (which gets re-implemented in Phase 3 as a Next.js API route).
>
> After every checkpoint, take a screenshot or note any visual divergence and report to operator.
>
> ---
>
> ### PHASE 3 — Port serverless functions (~30-60 min)
>
> For each function found in Phase 0 Section 7:
> - Convert to `app/api/<name>/route.ts`
> - Preserve the original URL path (so existing form actions and external integrations don't break)
> - Same env vars, same destination services, same response shape
> - Test by submitting the form on `localhost:3000` and verifying the destination service receives the data
>
> ---
>
> ### PHASE 4 — Domain swap + verification (~30 min + 2 week watch)
>
> **WARNING:** Production cutover. Don't run until everything in Phase 2 and 3 has been visually verified by the operator.
>
> 1. Deploy the new Next.js project to Vercel under a new project name (e.g. `CLIENT-NEXTJS`)
> 2. Operator verifies on the temporary `vercel.app` URL — every page, every form, every link
> 3. When operator approves: in Vercel dashboard, add `CLIENT_DOMAIN` to the new project, then remove it from the old static-site project. Vercel handles SSL re-issue automatically.
> 4. Wait 5 minutes, then test `CLIENT_DOMAIN` in an incognito window. Confirm it serves the new Next.js site.
> 5. Test 3-5 random deep URLs (specific agent profiles, blog posts, community pages) — confirm they all resolve. If any URL changed structure, confirm the 301 redirect fires.
> 6. The old Vercel project STAYS ALIVE for 2 weeks. Do not delete it. If anything breaks, the operator can re-add `CLIENT_DOMAIN` to the old project and roll back in seconds.
>
> ---
>
> ### PHASE 5 — Hand-off note (~10 min)
>
> After Phase 4 succeeds:
>
> 1. Update or create `CLAUDE.md` in the new repo documenting:
>    - This was migrated from static HTML on `YYYY-MM-DD`
>    - The new repo structure
>    - Third-party integrations and their config
>    - The remaining old Vercel project (for rollback) and its scheduled deletion date
>
> 2. Add a TODO note: "Content machine to be added via `PROMPT_1_NEXTJS_SITE.md` in the replication kit when ready."
>
> 3. Report final status:
>    - Live URL (`CLIENT_DOMAIN`)
>    - New Vercel project ID
>    - Old Vercel project ID (still alive for rollback, scheduled deletion date)
>    - Total pages migrated
>    - Any deferred items flagged for operator review
>    - Total time spent across all phases
>
> End the session by telling the operator: **"Migration complete. The site is unified on Next.js + Sanity. Ready for the content machine to be added via `PROMPT_1_NEXTJS_SITE.md` when you're ready."**
>
> ---
>
> **START PHASE 0 NOW.** Walk `SITE_REPO_PATH` and produce the audit report. Do not write any files. After the report, ask the operator the 5 decision points before continuing.

---

## After this prompt finishes

The site is now Next.js + Sanity, deployed to `CLIENT_DOMAIN`, with the old static project on standby for rollback. To add the content machine:

1. Wait at least a week for the new live site to bake in (catch any production bugs)
2. Provision the content-machine accounts (Upstash Redis, OneUp category, HeyGen avatar, etc.) — see `../CONTENT_MACHINE_REPLICATION.md`
3. Capture the 9 admin screenshots per `screenshots/README.md`
4. Run [`PROMPT_1_NEXTJS_SITE.md`](./PROMPT_1_NEXTJS_SITE.md) in the same repo to bolt on the content machine

That's the full path from "static HTML site" → "Next.js site with full content machine."
