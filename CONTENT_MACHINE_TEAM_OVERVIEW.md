# Content Machine — Team Overview

**What this document is:** A plain-English guide for anyone building a new client site with the content machine. Read this first. Then open `CONTENT_MACHINE_REPLICATION.md` for the detailed setup instructions.

---

## What Is the Content Machine?

The content machine is an AI-powered marketing system that runs on a real estate agent's website. Once it's set up — which takes a few hours the first time — it runs itself every day without the agent doing anything.

**What it produces every single day, automatically:**
- 2–3 SEO-optimized blog posts researched and written by AI in the agent's voice
- AI-generated cover images (thumbnails) for every post
- AI avatar videos (the agent's face and voice, cloned from 2–3 recordings) for every post
- Posts distributed to 7 social platforms simultaneously: Facebook, Instagram, TikTok, YouTube, LinkedIn, X, Threads
- Each platform gets a unique caption — not the same copy everywhere

**What the client (agent) does — only 3 things, ever:**
1. A 1-hour onboarding call to capture their voice, market, and brand
2. Record 2–3 short videos on camera so HeyGen can clone their avatar
3. Connect their social accounts to Blotato once

**Everything else is done by the system.**

---

## What CONTENT_MACHINE_REPLICATION.md Is

This file is the master setup playbook. It was written specifically so that any team member can pick it up, follow it step-by-step, and stand up a fully working content machine for a new client without needing to ask anyone for context.

**The file has 6 sections:**

| Section | What it covers |
|---|---|
| **1. What This System Does** | The full 16-step pipeline — what runs, when, and why |
| **2. Architecture Decisions** | Why Sanity, Redis, the Platform Wizard, and the refresh pipeline work the way they do |
| **3. Customization Checklist** | Every single thing that must change per client: agent name, market, queries, prompts, Fair Housing rules, Redis prefixes |
| **4. Environment Variables** | Every API key and credential the system needs — which ones are shared vs. which need a new one per client |
| **5. Step-by-Step Setup** | 20 ordered steps from "create Sanity project" to "test the publish flow" |
| **6. The Claude Code Prompt** | A ready-to-paste prompt for Claude Code that sets up the entire pipeline automatically in a new project folder |

**How to use it:**
1. Read Sections 1 and 2 to understand what you're building
2. Use Section 3 to identify every client-specific customization before touching code
3. Collect all the credentials listed in Section 4 before starting
4. Follow Section 5 in order — don't skip steps, later ones depend on earlier ones
5. Paste Section 6 into a Claude Code session on the new project — it does most of the heavy lifting

---

## The Full Pipeline — How It Works

```
Every day at 6 AM:
  Tavily searches 70+ local real estate queries → Claude scores and ranks articles
                      ↓
  Operator gets an email digest and approves ideas at /admin/idea-review
                      ↓
  Claude Sonnet writes a ~1,000-word blog post in the agent's voice
  Claude Haiku runs a Fair Housing compliance check → alerts operator if any violation
                      ↓
  Post lands in the VA Queue (/admin/va-queue) — status: media_pending
                      ↓
  VA/Operator: generates thumbnail (DALL-E), generates video script (Claude),
               submits to HeyGen for avatar video, uploads final video
                      ↓
  One click: post goes live on website (Sanity → Next.js)
  One click: Blotato posts to all 7 social platforms simultaneously
```

**Also running on schedule:**
- Every Monday: Refresh cron scans older posts for staleness, queues rewrites at `/admin/refresh-queue`
- Every Wednesday: LEARNINGS.md auto-updates based on GA4 traffic data
- Every 1st & 15th: Bi-weekly performance review — adjusts which topics get prioritized
- Every 25th: Events cron generates community event post ideas for next month

---

## All Third-Party Accounts & Connections

This is the complete list of every external service the machine connects to. Organized by whether the same account works for all clients or whether each client needs a new one.

### ✅ SHARED — One account, use across all clients

| Service | What it does | Where to get it | Cost |
|---|---|---|---|
| **Anthropic Claude** | Writes all blog posts, captions, video scripts, scores ideas, Fair Housing checks | anthropic.com | ~$15–30/mo per client in usage |
| **Tavily** | Daily AI-powered news research | tavily.com | ~$10–15/mo |
| **HeyGen** | Generates avatar videos (agent's face + voice) | heygen.com | ~$89/mo (negotiate enterprise at 10+ clients) |
| **Blotato** | Publishes to all 7 social platforms | blotato.com | ~$49/mo (agency plan reduces this) |
| **Resend** | Sends operator digest emails and alerts | resend.com | ~$5/mo |
| **YouTube Data API key** | Reads YouTube channel analytics | Google Cloud Console | Free (shared key) |
| **Facebook App ID + Secret** | Powers the Platform Connection Wizard's automatic token exchange | developers.facebook.com | Free (one app for all clients) |
| **OpenAI** | Generates blog post thumbnail images via DALL-E 3 | openai.com | ~$3–5/mo |

---

### ❌ PER CLIENT — Each new client needs their own

#### Infrastructure (create new for every client)

| Service | What it does | Where to set up | Cost |
|---|---|---|---|
| **Vercel project** | Hosts the website + runs all cron jobs | vercel.com | ~$20/mo |
| **Sanity CMS project** | Stores all blog posts, workflow status, media URLs | sanity.io | ~$15/mo (free tier works to start) |
| **Upstash Redis database** | Stores idea queue, workflow state, refresh queue, performance weights | upstash.com | ~$5–10/mo (free tier covers early stage) |
| **Vercel Blob** | Stores and delivers thumbnail images and videos via CDN | Vercel dashboard | ~$3–8/mo |
| **GitHub repo** | Code repository + triggers Vercel auto-deploys | github.com | Free |

#### Social Accounts (client provides access, you connect)

| Platform | What you need from the client | How to connect |
|---|---|---|
| **Facebook Page** | Short-lived Graph Explorer token + Page ID | Platform Connection Wizard auto-exchanges → permanent token |
| **Instagram** | Nothing extra after Facebook — auto-discovered | One click in the wizard after Facebook is connected |
| **YouTube** | Channel ID (from their YouTube URL) | Paste into wizard |
| **TikTok** | Username | Paste into wizard |
| **LinkedIn** | OAuth token + Organization ID | Wizard validates; token expires every 60 days — set a reminder |
| **X / Twitter** | Connected in Blotato | Get account ID from Blotato after connecting |
| **Threads** | Connected in Blotato | Get account ID from Blotato after connecting |

**How to connect all platforms:** Use the Platform Connection Wizard at `/admin/connect?secret=YOUR_ADMIN_SECRET`. It walks through each platform step by step, tests the credential, and tells you exactly what to paste into Vercel. See `PLATFORM_CONNECTIONS.md` for detailed instructions per platform — including screenshots, where to find each credential, and ChatGPT prompts the client can use if they get stuck.

#### Analytics (so dashboards show data)

| Service | What it shows | What you need | Notes |
|---|---|---|---|
| **Google Analytics 4** | Website traffic, top posts, engagement | GA4 Property ID + Service Account JSON | Service account is a one-time setup; the JSON file gets pasted as one line in Vercel |
| **Google Search Console** | Which Google searches drive traffic | 4 OAuth credentials + site URL | Set up via OAuth Playground — see `PLATFORM_CONNECTIONS.md` |
| **Facebook Graph API** | Page reach, engagement, video views | Set up via Platform Wizard | Uses the same Facebook token — no extra setup |
| **Instagram Graph API** | Followers, post reach, impressions | Set up via Platform Wizard | Auto-discovered from Facebook |
| **YouTube Data API** | Video views, subscribers, top videos | Channel ID only (API key is shared) | Just paste the channel ID in the wizard |
| **TikTok** | Followers, video play counts | Username only | Public scraper — no login needed |
| **LinkedIn** | Org followers, post impressions | OAuth token | Expires every 60 days — document when you set it |

#### Client-specific AI config

| Item | What it controls | Where to get it |
|---|---|---|
| **HeyGen Avatar ID** | Which avatar face to use for videos | HeyGen dashboard → Avatars → copy Look ID |
| **HeyGen Voice ID** | Which cloned voice to use | HeyGen dashboard → Voices → copy Voice ID |

---

## What's Working Right Now (Barry Jenkins / legacyhometeamlpt.com)

This is the live reference implementation. Everything below is built, tested, and running in production:

- ✅ Full 6-city website (Virginia Beach, Chesapeake, Norfolk, Suffolk, Hampton, Newport News)
- ✅ Daily research → idea scoring → operator email digest → approval → AI writing → publish
- ✅ Fair Housing compliance check on every post before it saves
- ✅ HeyGen avatar videos on every post → uploaded to Vercel Blob
- ✅ 7-platform social publishing via Blotato with unique captions per platform
- ✅ Platform Connection Wizard at `/admin/connect` (TikTok, YouTube, Facebook, Instagram, LinkedIn, GA4, GSC)
- ✅ Instagram and LinkedIn analytics dashboards (live data)
- ✅ Bi-weekly performance review cron → auto-adjusts topic scoring weights
- ✅ Weekly content refresh cron → rewrites evergreen posts that have aged
- ✅ LEARNINGS.md weekly auto-update from GA4 traffic data
- ✅ End-of-month events cron → generates community event post ideas every 25th
- ✅ Blog page with pagination (25 posts/page) and search
- ✅ AEO/GEO landing pages (structured to get cited by ChatGPT, Perplexity, Gemini)

**To see everything in action:** log in at `legacyhometeamlpt.com/admin?secret=[ask Aaron]`

---

## What Needs to Be Set Up for Each New Client

When you start a new client, here is the full checklist of things that need to happen before the machine is running:

**Accounts to create (before touching code):**
- [ ] New Sanity project (sanity.io → New Project)
- [ ] New Upstash Redis database (upstash.com → Create Database)
- [ ] New Vercel project (connect to GitHub repo)
- [ ] New GitHub repo (fork from legacy-home-search)

**Credentials to collect from or for the client:**
- [ ] HeyGen avatar ID and voice ID (after client records their 2–3 videos)
- [ ] Blotato account IDs for each platform (after connecting client's social accounts)
- [ ] Facebook Page ID (from their Facebook Page → About)
- [ ] TikTok username
- [ ] YouTube channel ID (from their channel URL)
- [ ] LinkedIn company page URL (to extract organization ID)

**Code customizations before deploy (Section 3 of the replication guide):**
- [ ] Agent name, market, and community names throughout all prompts
- [ ] Research query pool (pinned daily + rotating + events)
- [ ] Events cron city names in `lib/events-research.ts`
- [ ] Fair Housing rules for the new state
- [ ] Redis key prefix (e.g. `lhs:` → `sgs:`)
- [ ] LEARNINGS.md seed content

**Platform connections after first deploy (using the wizard):**
- [ ] TikTok, YouTube, Facebook, Instagram (auto), LinkedIn
- [ ] GA4 and Google Search Console
- [ ] Copy all env vars shown by the wizard into Vercel

**Testing before go-live (Section 5, steps 16–20 of the replication guide):**
- [ ] Trigger research cron manually and confirm email digest arrives
- [ ] Approve one idea and confirm it appears in VA Queue
- [ ] Generate thumbnail, video, and publish one test post
- [ ] Confirm post appears live on the website and all social platforms

---

## Key Files to Know About

| File | What it is |
|---|---|
| `CONTENT_MACHINE_REPLICATION.md` | Master setup playbook — read this for everything |
| `PLATFORM_CONNECTIONS.md` | Step-by-step per-platform credential guide |
| `BLOG_PIPELINE.md` | Full operational guide to the daily pipeline |
| `FAIR_HOUSING.md` | Fair Housing compliance rules, violation examples, state-specific classes |
| `LEARNINGS.md` | Living content intelligence file — auto-updated weekly |

---

## Questions? Stuck?

- **Reference site:** `legacyhometeamlpt.com/admin` (ask Aaron for the secret)
- **Platform connection issues:** See `PLATFORM_CONNECTIONS.md` — every platform has a troubleshooting section and a pre-written ChatGPT prompt you can use to get unstuck
- **Something isn't working:** Check the Vercel function logs first (Vercel dashboard → your project → Functions) — almost every error shows up there
