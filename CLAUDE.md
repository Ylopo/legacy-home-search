# Legacy Home Search — Project Rules

## What This Project Is
A branded real estate website for a new client. Built on the same Next.js + Sanity CMS stack as chris-nevada-next, but with a light modern design (white/cream backgrounds, Inter font, blue accent color) rather than the dark luxury style.

## Key Facts
- **Project name**: legacy-home-search
- **Sanity project ID**: `2nr7n3lm`
- **Sanity dataset**: `production`
- **Design theme**: Light modern — white/cream backgrounds, `#2563eb` blue accent, clean typography
- **Tech stack**: Next.js 16, Sanity CMS, Anthropic Claude, Vercel Cron, Upstash Redis, Resend email

## Sanity Configuration
All Sanity reads use project ID `2nr7n3lm` (not `r3saenct` which is the Chris Nevada project).

- `sanity/client.ts` — read client (CDN)
- `lib/sanity-write.ts` — write client (Editor token)
- `sanity.config.ts` — Studio config, title: "Legacy Home Search"

## Design System
CSS variables defined in `app/globals.css`:
- `--accent: #2563eb` (blue, not gold)
- `--off-white: #f8f7f4`
- `--text: #1a1a1a`
- Font: Inter (Google Fonts)
- Maps: See `MAPS.md` for all Mapbox configuration (style, pitch, slots, city coordinates)

## Community Pages
All 6 community pages are live: `/virginia-beach`, `/chesapeake`, `/norfolk`, `/suffolk`, `/hampton`, `/newport-news`. Each page has a `CommunityBlogSection` that shows a scrollable Recent Posts carousel and a Most Popular pinned tab (see BLOG_PIPELINE.md → Community ↔ Blog Integration).

Update the `COMMUNITY_PAGES` array in `lib/assistant-tools.ts` if the AI Content Assistant needs to reference these pages.

## Blog Pipeline
Automated daily blog pipeline via Vercel Cron. Full details in `BLOG_PIPELINE.md`.
- 6:00 AM PT: researches Virginia Beach / Hampton Roads articles only, email digest sent
- Operator picks 1–5 articles at `/admin/blog-picker/[date]?secret=ADMIN_SECRET`
- Claude writes posts, Gemini generates custom hero images (DALL-E fallback), posts published to Sanity
- Live at `/blog` within 60 seconds (ISR revalidation)

## Market Reports Pipeline
Shelved — code is intact but not in active use. Will be rebuilt around direct Altos Research data access (not manual PDF uploads) when that data becomes available.

## AI Content Assistant
Available at `/admin/assistant` (password-protected). Same architecture as chris-nevada-next. Update `COMMUNITY_PAGES` in `lib/assistant-tools.ts` as pages are added.

## Current Status (May 2026)
- Full homepage live: hero with tab switcher, Barry bio, Altos market trends, interactive map, testimonials, contact
- `/communities` landing page with interactive HamptonRoadsMap (all 6 cities) and card grid
- All 6 community pages live: `/virginia-beach`, `/chesapeake`, `/norfolk`, `/suffolk`, `/hampton`, `/newport-news`
- Blog pipeline active — daily posts at `/blog`
- Community ↔ blog linking live: blog posts auto-link city names to community pages; community pages show `CommunityBlogSection` with recent posts carousel and pinnable Most Popular tab
- `PortableText.tsx` auto-links 50+ named institutions (schools, universities, parks, military) to their official sites on first mention in any blog post
- Content refresh subsystem live — weekly cron (Monday 10 AM PT), admin UI at `/admin/refresh-queue`, Claude rewrites posts in-place
- Market reports pipeline shelved (awaiting Altos data access)
- All Mapbox maps updated to Standard style (3D buildings, POI, roads)
- Domain: `legacyhometeamlpt.com` → Vercel (GoDaddy A record + CNAME configured)
- Mobile-optimized: hero tabs, Barry photo layout, contact form, buttons

## What's Next
- Add community pages to `COMMUNITY_PAGES` in `lib/assistant-tools.ts` (AI Content Assistant)
- Add team member profiles at `/team`
- YLOPO integration (when client provides domain)
- Expand `INSTITUTION_LINKS` in `components/PortableText.tsx` as more local businesses, golf courses, and venues come up in blog posts

## Environment Variables
See `.env.local.example` for full list. All same as chris-nevada-next except:
- `NEXT_PUBLIC_SANITY_PROJECT_ID=2nr7n3lm` (different Sanity project)

## Maintenance Instructions
After every significant change, update this file to reflect:
- New features or components added
- Decisions made and why
- Current status and what's next
- Any new conventions established
