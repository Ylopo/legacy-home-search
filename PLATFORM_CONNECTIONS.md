# Platform Connections Guide

Setup instructions for every social and analytics platform connected to the content machine. One page to bookmark — covers credentials, where to find them, what to set in Vercel, and what to do when tokens expire.

**The wizard lives at:** `/admin/connect?secret=YOUR_ADMIN_SECRET`

Connect platforms in this order — each one takes 1–10 minutes:

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
3. Click **Test & Save**
4. The wizard confirms the profile exists and shows follower count
5. Set the env var shown in Vercel → Environment Variables

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

**Note:** `YOUTUBE_API_KEY` is shared across all clients — it's already set. Only the channel ID changes per client.

**Analytics available:** Subscriber count, total views, recent video performance (views, likes, comments), top videos by view count.

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

**Pre-requisite env vars (shared, set once):**
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

Both of these are Meta configuration steps in the client's accounts, not code changes. See the fix steps below if the auto-connect fails.

**Steps:**
1. In `/admin/connect`, click **Auto-connect from Facebook** under Instagram
2. The wizard calls the Facebook Graph API to discover the linked Instagram Business Account ID
3. It shows the Instagram @username and follower count to confirm it's the right account
4. Set the two env vars shown in Vercel

**Env vars:**
```
INSTAGRAM_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxx...  (same value as FACEBOOK_PAGE_ACCESS_TOKEN)
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841400000000000
```

---

### "No Instagram Business Account linked to this Facebook Page" — how to fix

This error means Meta doesn't see an Instagram account connected to the Facebook Page. Fix it in **one** of these ways (try them in order):

**Option A — From the Facebook Page (quickest)**
1. Go to the client's Facebook Page
2. Click **Edit Page** or the **Settings** icon (top right on the page)
3. Look for **Linked Accounts** or **Instagram** in the left sidebar
4. Click **Connect account** → log in with the client's Instagram credentials
5. Make sure it's set as a **Business** or **Creator** account when prompted

**Option B — From Meta Business Suite**
1. Go to [business.facebook.com](https://business.facebook.com)
2. Settings (gear icon, bottom left) → **Accounts** → **Instagram Accounts**
3. Click **Add** → log in with the client's Instagram credentials
4. Assign it to the correct Facebook Page

**Option C — From the Instagram app** (if the client handles their own login)
1. Open Instagram → Profile → hamburger menu (top right) → **Settings**
2. **Account** → **Linked accounts** → Facebook
3. Log in and link to the correct Facebook Page
4. Then go to **Account** → **Switch to Professional Account** if not already done

After completing any of these steps, go back to `/admin/connect` and click **Auto-connect from Facebook** again — it should find the account this time.

---

**Analytics available:** Follower count, post count, per-post reach/impressions/likes/comments/saves, top posts by reach.

---

## 5 — LinkedIn

**What you need:** An OAuth 2.0 access token + the numeric Organization ID

⚠️ **LinkedIn tokens expire every 60 days.** Set a calendar reminder to refresh before day 60. The wizard stores the issue date and shows a warning banner when the token is within 10 days of expiry.

### Getting the access token

1. Go to [developers.linkedin.com](https://developers.linkedin.com) → **Create App**
2. App name: `[Client Name] Analytics` — Associate with the client's company page (you must be a page admin)
3. Under **Products**, request access to **Marketing Developer Platform**
   - This may require a brief review by LinkedIn (usually instant for business accounts)
4. Once approved, go to **Auth** → OAuth 2.0 tools
5. Click **Create Token** with these scopes:
   - `r_organization_social` — read org posts and engagement
   - `rw_organization_admin` — read follower counts
6. Copy the access token

### Getting the Organization ID

The Organization ID is the number in your company page URL:
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
LINKEDIN_TOKEN_ISSUED_AT=2026-05-28T00:00:00.000Z  (set to today's date)
```

### Refreshing the token (every 60 days)

1. Return to the LinkedIn developer portal → your app → Auth → OAuth 2.0 tools
2. Generate a new token (same scopes)
3. In Vercel → Environment Variables, update `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_TOKEN_ISSUED_AT`
4. Redeploy (or trigger a redeploy from the Vercel dashboard)

**Analytics available:** Follower count, post impressions, clicks, reactions, shares per post, engagement rate.

---

## 6 — Google Analytics 4

**What you need:** The GA4 Property ID + a Service Account JSON key

### Steps

1. In [Google Analytics](https://analytics.google.com), go to the client's property → Admin → Property Settings → copy the **Property ID** (numeric, e.g. `398765432`)
2. In [Google Cloud Console](https://console.cloud.google.com):
   - Create or select a project
   - Enable the **Google Analytics Data API**
   - Go to IAM → Service Accounts → Create service account
   - Name it `analytics-reader` — no special roles needed at this step
   - After creating, click the account → Keys → Add Key → JSON → download the file
3. Back in GA4 Admin → Property Access Management → add the service account email (e.g. `analytics-reader@project.iam.gserviceaccount.com`) as a **Viewer**
4. Open the downloaded JSON file — it looks like:
   ```json
   { "type": "service_account", "project_id": "...", "private_key": "-----BEGIN RSA PRIVATE KEY-----\n...", ... }
   ```
5. Minify it to one line (use [jsonformatter.org](https://jsonformatter.org) → Minify)

**Env vars:**
```
GA4_PROPERTY_ID=398765432
GA4_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...","private_key":"-----BEGIN RSA PRIVATE KEY-----\n..."}
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

The measurement ID (`G-XXXXXX`) is found in GA4 → Admin → Data Streams → Web → Measurement ID.

**Analytics available:** Sessions, pageviews, active users, engagement time, traffic by channel (organic/direct/social/referral), top pages, daily trend.

---

## 7 — Google Search Console

**What you need:** OAuth 2.0 credentials for the client's verified GSC property

### Steps

1. Confirm the client's domain is verified in [Search Console](https://search.google.com/search-console)
2. In [Google Cloud Console](https://console.cloud.google.com):
   - Enable the **Google Search Console API**
   - Go to APIs & Services → Credentials → Create Credentials → OAuth Client ID
   - Type: **Web Application**
   - Add authorized redirect URI: `https://developers.google.com/oauthplayground`
   - Copy the **Client ID** and **Client Secret**
3. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground):
   - Click the gear icon → check "Use your own OAuth credentials" → paste your Client ID + Secret
   - Scroll to "Search Console API v3" → select `https://www.googleapis.com/auth/webmasters.readonly`
   - Click Authorize → Exchange authorization code for tokens
   - Copy the **Refresh Token**
4. The site URL format: use `sc-domain:yourdomain.com` (for domain-wide properties) or the full URL

**Env vars:**
```
GSC_CLIENT_ID=000000000000-xxxxxxxxxxxxxxxx.apps.googleusercontent.com
GSC_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxx
GSC_REFRESH_TOKEN=1//0xxxxxxxxxxxxxxx-Lxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GSC_SITE_URL=sc-domain:legacyhometeamlpt.com
```

**Analytics available:** Total clicks, impressions, CTR, average position, daily trend, top 10 pages by clicks, top 25 search queries, device breakdown, country breakdown.

---

## Platforms with no analytics API

| Platform | Publishing | Analytics |
|---|---|---|
| **X / Twitter** | Via Blotato | Manual only — [analytics.twitter.com](https://analytics.twitter.com) |
| **Threads** | Via Blotato | No API available |

These two platforms publish fine via Blotato — they just don't have programmatic analytics access. Use the native dashboards for performance data.

---

## Quick reference — all env vars by platform

```bash
# TikTok
TIKTOK_USERNAME=

# YouTube
YOUTUBE_CHANNEL_ID=
YOUTUBE_API_KEY=                          # shared across clients

# Facebook
FACEBOOK_PAGE_ACCESS_TOKEN=              # never expires
FACEBOOK_PAGE_ID=
FACEBOOK_APP_ID=                          # shared across clients
FACEBOOK_APP_SECRET=                      # shared across clients

# Instagram
INSTAGRAM_ACCESS_TOKEN=                  # same as FACEBOOK_PAGE_ACCESS_TOKEN
INSTAGRAM_BUSINESS_ACCOUNT_ID=

# LinkedIn
LINKEDIN_ACCESS_TOKEN=                   # expires every 60 days
LINKEDIN_ORGANIZATION_ID=
LINKEDIN_TOKEN_ISSUED_AT=                # ISO date — enables expiry warning

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
| LinkedIn Access Token | **60 days** | Regenerate in LinkedIn developer portal → update Vercel → redeploy |
| GA4 Service Account | Never | One-time setup |
| GSC Refresh Token | Very long-lived | Rarely expires; if it does, re-run OAuth Playground |

**Recommendation for LinkedIn:** add a recurring calendar event every 50 days titled "Refresh LinkedIn tokens for [client]."
