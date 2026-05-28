# Platform Connections Guide

Setup instructions for every social and analytics platform connected to the content machine. One page to bookmark — covers credentials, where to find them, what to set in Vercel, and what to do when tokens expire.

**The wizard lives at:** `/admin/connect?secret=YOUR_ADMIN_SECRET`

---

## Replicating on a New Client Site

### If the site was built using CONTENT_MACHINE_REPLICATION.md (Next.js stack)

The wizard is already in the `legacy-home-search` main branch. Any site forked or copied from that branch after May 2026 has it automatically. If the site was set up earlier, copy these files over manually:

**New files to add:**
```
lib/instagram-client.ts
lib/linkedin-client.ts
sanity/schema/platformCredentials.ts
app/admin/connect/layout.tsx
app/admin/connect/page.tsx
app/api/admin/connect/status/route.ts
app/api/admin/connect/facebook/route.ts
app/api/admin/connect/instagram/route.ts
app/api/admin/connect/youtube/route.ts
app/api/admin/connect/tiktok/route.ts
app/api/admin/connect/linkedin/route.ts
```

**Files to update (merge the changes in):**
```
sanity/schema/index.ts               ← add: import platformCredentials + add to schemaTypes
app/api/analytics/overview/route.ts  ← add: Instagram + LinkedIn to Promise.all + estimatedReach
app/admin/social-dashboard/instagram/page.tsx  ← replace setup guide with live data page
app/admin/social-dashboard/linkedin/page.tsx   ← replace setup guide with live data page
components/AdminNav.tsx              ← add: "Connect Platforms" to PIPELINE array
                                       add: Instagram + LinkedIn to REPORTING_ITEMS
```

**Shared env vars already set (no change needed):**
```
FACEBOOK_APP_ID        — Meta app ID (same across all clients)
FACEBOOK_APP_SECRET    — Meta app secret (same across all clients)
YOUTUBE_API_KEY        — YouTube Data API key (same across all clients)
```

Once files are in place, deploy and visit `/admin/connect?secret=ADMIN_SECRET` to connect all platforms.

---

### If the site uses a different stack (static HTML + Vercel API routes)

The wizard (`app/admin/connect/page.tsx`) uses React hooks and Next.js App Router — it **cannot be copied directly** to a static HTML site.

**For Shana Gates (`shanasells.com`) specifically:**

Shana's current site (`/Cowork/Branded Sites/Shana Gates/`) is a static HTML site with Vercel TypeScript API routes — not the Next.js stack described in `CONTENT_MACHINE_REPLICATION.md`. Two paths:

**Path A — Migrate to Next.js (recommended long-term)**
Follow `CONTENT_MACHINE_REPLICATION.md` from scratch. This gives Shana the full wizard, live analytics dashboards, Sanity CMS, and everything else. Setup time: ~4 hours.

**Path B — Build a static HTML connect page**
Create `admin/connect/index.html` in Shana's project that mirrors the wizard UI using vanilla JS + the same Vercel API routes. The API routes (`api/admin/connect/*.ts`) can be ported directly since they're plain TypeScript with no Next.js dependencies. This is faster but gives Shana a simpler experience. See the API route files in `legacy-home-search/app/api/admin/connect/` — they use only `fetch` and Sanity client, which port easily.

For now, Shana can use the **PLATFORM_CONNECTIONS.md guide below** directly — the steps are the same regardless of the wizard UI. The wizard just automates the token exchange and saves the metadata; the credentials themselves are identical.

---

## How the Wizard Works

The wizard at `/admin/connect` does three things per platform:
1. **Validates** the credential by calling the platform's API and confirming it returns real data
2. **Saves metadata** (display name, IDs, timestamps) to a `platformCredentials` Sanity document — no secrets stored, just connection state
3. **Shows the env vars** to copy into Vercel after a successful test

Each platform card in the wizard auto-opens when not connected, shows numbered step-by-step instructions, and includes a **🔥 Hot tip** box with a pre-written ChatGPT prompt the client can copy and paste if they get stuck. The prompt is pre-loaded with all the context ChatGPT needs to walk them through that platform's specific steps interactively.

---

## Connect Platforms In This Order

| # | Platform | Time | Auth type | Expires? |
|---|---|---|---|---|
| 1 | TikTok | 1 min | None (public) | Never |
| 2 | YouTube | 1 min | None (public API key) | Never |
| 3 | Facebook | 3 min | Short-lived token → wizard exchanges it | Never |
| 4 | Instagram | 10 sec | Auto from Facebook | Never |
| 5 | LinkedIn | 5 min | OAuth 2.0 | **60 days** |
| 6 | Google Analytics 4 | 10 min | Service account JSON | Never |
| 7 | Google Search Console | 5 min | OAuth refresh token | Long-lived |

---

## 1 — TikTok

**What you need:** the client's TikTok @username (public profile, no login required)

**Steps:**
1. Go to `/admin/connect`
2. Under TikTok, type the username without the @
3. Click **Test & Save** — wizard confirms the profile exists and shows follower count
4. Set the env var shown in Vercel → Environment Variables

**Env var:**
```
TIKTOK_USERNAME=legacyhometeam
```

**If it fails:** Username might have changed or the account might be private. Confirm by visiting `tiktok.com/@username` directly.

**Analytics available:** Follower count, total likes/views, recent video performance (play count, likes, comments, shares). Uses a public scraper — no API key needed.

---

## 2 — YouTube

**What you need:** the client's YouTube Channel ID (starts with `UC`)

**Steps:**
1. Go to the client's YouTube channel
2. Click their profile → Settings → Advanced settings → copy the Channel ID (`UCxxxxxxxxxxxxxxxxx`)
   - Alternatively: the URL `youtube.com/channel/UCxxxxx` contains it directly
3. In `/admin/connect`, paste the channel ID or the full URL
4. Click **Test & Save** — wizard fetches channel name and subscriber count
5. Set the env var shown in Vercel

**Env var:**
```
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Note:** `YOUTUBE_API_KEY` is shared across all clients — already set. Only the channel ID changes per client.

**Analytics available:** Subscriber count, total views, recent video performance, top videos by view count.

---

## 3 — Facebook

**What you need:** a short-lived User Access Token + the Facebook Page ID

**Steps:**
1. Go to [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
2. Select your Meta app from the dropdown (top right)
3. Click **Generate Access Token** and grant these permissions:
   - `pages_show_list`
   - `pages_read_engagement`
   - `read_insights`
4. Copy the token shown (it expires in ~1 hour — use it immediately)
5. Find the Page ID: go to the client's Facebook Page → About → scroll to bottom → "Page ID"
6. In `/admin/connect`, paste both the token and the Page ID
7. Click **Test & Save** — wizard exchanges the short-lived token for a **never-expiring** Page Access Token automatically
8. Set the two env vars shown in Vercel

**Env vars:**
```
FACEBOOK_PAGE_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxx...  (never expires)
FACEBOOK_PAGE_ID=1101893253009079
```

**Pre-requisite env vars (shared, set once across all clients):**
```
FACEBOOK_APP_ID=your_meta_app_id
FACEBOOK_APP_SECRET=your_meta_app_secret
```
These come from [developers.facebook.com](https://developers.facebook.com) → your app → Settings → Basic.

**Analytics available:** Page reach (28d), engagements, video views, page views, fan/follower count, reactions breakdown, per-post reach/clicks/reactions/shares.

---

## 4 — Instagram

**What you need:** Facebook already connected (above). Instagram uses the same token — no new credentials.

**Two requirements before the auto-connect will work:**
1. The Instagram account must be a **Professional account** (Creator or Business) — not a personal account
2. The Instagram account must be **linked to the Facebook Page** in Meta's system

**Steps:**
1. In `/admin/connect`, click **Auto-connect Instagram from Facebook**
2. The wizard calls the Facebook Graph API to discover the linked Instagram Business Account ID
3. It shows the Instagram @username and follower count to confirm it's the right account
4. Set the two env vars shown in Vercel

**Env vars:**
```
INSTAGRAM_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxx...  (same value as FACEBOOK_PAGE_ACCESS_TOKEN)
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841400000000000
```

### "No Instagram Business Account linked" — how to fix

Fix it in **one** of these ways (try them in order):

**Option A — From the Facebook Page**
1. Go to the client's Facebook Page
2. Click Settings → **Linked Accounts** or **Instagram** in the left sidebar
3. Click **Connect account** → log in with the client's Instagram credentials
4. Make sure it's set as Business or Creator when prompted

**Option B — From Meta Business Suite**
1. Go to [business.facebook.com](https://business.facebook.com)
2. Settings → **Accounts** → **Instagram Accounts** → **Add**
3. Log in with the client's Instagram → assign it to the correct Facebook Page

**Option C — From the Instagram app**
1. Open Instagram → Profile → hamburger menu → Settings
2. **Account** → **Linked accounts** → Facebook → connect to the correct Page
3. Then Settings → Account → **Switch to Professional Account** if still personal

After any of these, retry the wizard.

**Analytics available:** Follower count, post count, per-post reach/impressions/likes/comments/saves, top posts by reach.

---

## 5 — LinkedIn

**What you need:** An OAuth 2.0 access token + the numeric Organization ID

⚠️ **LinkedIn tokens expire every 60 days.** Set a calendar reminder to refresh before day 60. The wizard stores the issue date and shows a warning banner when the token is within 10 days of expiry.

### Getting the access token

1. Go to [developers.linkedin.com](https://developers.linkedin.com) → **Create App**
2. App name: `[Client Name] Analytics` — Associate with the client's company page (you must be a page admin)
3. Under **Products**, request access to **Marketing Developer Platform**
4. Once approved, go to **Auth** → OAuth 2.0 tools
5. Click **Create Token** with these scopes: `r_organization_social`, `rw_organization_admin`
6. Copy the access token

### Getting the Organization ID

The number in your company page URL:
```
linkedin.com/company/12345678  →  Organization ID is 12345678
```

### Setting up in the wizard

1. In `/admin/connect`, paste the access token and the Organization ID
2. Click **Test & Save** — wizard fetches org name and follower count to confirm
3. Set the three env vars shown in Vercel

**Env vars:**
```
LINKEDIN_ACCESS_TOKEN=AQVxxxxxxxxxxxxxxxxxx...
LINKEDIN_ORGANIZATION_ID=12345678
LINKEDIN_TOKEN_ISSUED_AT=2026-05-28T00:00:00.000Z  (set to today's ISO date)
```

### Refreshing the token every 60 days

1. LinkedIn developer portal → your app → Auth → OAuth 2.0 tools → generate new token
2. In Vercel → Environment Variables, update `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_TOKEN_ISSUED_AT`
3. Redeploy (or trigger from Vercel dashboard)

**Recommendation:** add a recurring calendar event every 50 days titled "Refresh LinkedIn token for [client]."

**Analytics available:** Follower count, post impressions, clicks, reactions, shares per post, engagement rate.

---

## 6 — Google Analytics 4

**What you need:** The GA4 Property ID + a Service Account JSON key

**Steps:**
1. In [Google Analytics](https://analytics.google.com), go to Admin → Property Settings → copy the **Property ID** (a number like `398765432`)
2. In [Google Cloud Console](https://console.cloud.google.com):
   - Enable the **Google Analytics Data API**
   - IAM → Service Accounts → Create → name it `analytics-reader`
   - After creating: Keys → Add Key → JSON → download the file
3. Back in GA4: Admin → Property Access Management → add the service account email as **Viewer**
4. Minify the downloaded JSON to one line ([jsonformatter.org/json-minify](https://jsonformatter.org/json-minify))

**Env vars:**
```
GA4_PROPERTY_ID=398765432
GA4_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}  (one line)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

The measurement ID (`G-XXXXXX`) is in GA4 → Admin → Data Streams → Web → Measurement ID.

**Analytics available:** Sessions, pageviews, active users, engagement time, traffic by channel, top pages, daily trend.

---

## 7 — Google Search Console

**What you need:** OAuth 2.0 credentials for the client's verified GSC property

**Steps:**
1. Confirm the client's domain is verified in [Search Console](https://search.google.com/search-console)
2. In [Google Cloud Console](https://console.cloud.google.com):
   - Enable the **Google Search Console API**
   - APIs & Services → Credentials → Create Credentials → OAuth Client ID → **Web Application**
   - Add authorized redirect URI: `https://developers.google.com/oauthplayground`
   - Copy the **Client ID** and **Client Secret**
3. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground):
   - Gear icon → "Use your own OAuth credentials" → paste Client ID + Secret
   - Scroll to "Search Console API v3" → select `https://www.googleapis.com/auth/webmasters.readonly`
   - Authorize → Exchange authorization code for tokens → copy the **Refresh Token**

**Env vars:**
```
GSC_CLIENT_ID=000000000000-xxxxxxxxxxxxxxxx.apps.googleusercontent.com
GSC_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxx
GSC_REFRESH_TOKEN=1//0xxxxxxxxxxxxxxx
GSC_SITE_URL=sc-domain:legacyhometeamlpt.com
```

**Analytics available:** Total clicks, impressions, CTR, average position, daily trend, top pages, top search queries, device + country breakdown.

---

## Platforms with no analytics API

| Platform | Publishing | Analytics |
|---|---|---|
| **X / Twitter** | Via Blotato | Manual only — [analytics.twitter.com](https://analytics.twitter.com) |
| **Threads** | Via Blotato | No API available |

---

## Quick reference — all env vars by platform

```bash
# TikTok
TIKTOK_USERNAME=

# YouTube
YOUTUBE_CHANNEL_ID=
YOUTUBE_API_KEY=                          # shared across clients — set once

# Facebook
FACEBOOK_PAGE_ACCESS_TOKEN=              # never expires
FACEBOOK_PAGE_ID=
FACEBOOK_APP_ID=                          # shared across clients — set once
FACEBOOK_APP_SECRET=                      # shared across clients — set once

# Instagram
INSTAGRAM_ACCESS_TOKEN=                  # same as FACEBOOK_PAGE_ACCESS_TOKEN
INSTAGRAM_BUSINESS_ACCOUNT_ID=

# LinkedIn
LINKEDIN_ACCESS_TOKEN=                   # expires every 60 days
LINKEDIN_ORGANIZATION_ID=
LINKEDIN_TOKEN_ISSUED_AT=                # ISO date — enables expiry warning in wizard

# Google Analytics 4
GA4_PROPERTY_ID=
GA4_SERVICE_ACCOUNT_JSON=               # one-line minified JSON
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# Google Search Console
GSC_CLIENT_ID=
GSC_CLIENT_SECRET=
GSC_REFRESH_TOKEN=
GSC_SITE_URL=
```

---

## Token expiry schedule

| Platform | Expires | Action |
|---|---|---|
| Facebook Page Token | Never | Set once, done |
| Instagram Token | Never (same as FB) | Set once, done |
| YouTube API Key | Never | Shared, no action needed |
| TikTok | N/A (public scraper) | No token |
| LinkedIn Access Token | **60 days** | Regenerate → update Vercel → redeploy |
| GA4 Service Account | Never | One-time setup |
| GSC Refresh Token | Very long-lived | Rarely expires; re-run OAuth Playground if it does |

---

## Files that make up the wizard

For reference when replicating or debugging:

| File | Purpose |
|---|---|
| `lib/instagram-client.ts` | Instagram Graph API — profile stats + per-post insights |
| `lib/linkedin-client.ts` | LinkedIn Marketing API — org followers + post stats |
| `sanity/schema/platformCredentials.ts` | Singleton Sanity doc — stores IDs and timestamps (no secrets) |
| `app/admin/connect/page.tsx` | The wizard UI — step-by-step instructions + Test & Save per platform |
| `app/admin/connect/layout.tsx` | Layout wrapper with AdminNav |
| `app/api/admin/connect/status/route.ts` | GET — returns connection status for all platforms |
| `app/api/admin/connect/tiktok/route.ts` | POST — validates TikTok username |
| `app/api/admin/connect/youtube/route.ts` | POST — validates YouTube channel ID |
| `app/api/admin/connect/facebook/route.ts` | POST — exchanges short-lived token → never-expiring page token |
| `app/api/admin/connect/instagram/route.ts` | POST — auto-discovers Instagram Business Account ID from FB token |
| `app/api/admin/connect/linkedin/route.ts` | POST — validates LinkedIn token + org ID |
