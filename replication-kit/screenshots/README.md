# Screenshot Capture Guide

Capture these 9 screenshots from a working source instance (legacy-home-search production or local dev). Drop them in this folder with the **exact filenames** below — the kit's prompt references them by name.

**Why this matters:** Claude Code uses these as visual targets when rebuilding the admin UI for a new client. Match the layout, status badges, status colors, and information density.

---

## Capture environment

- Use a desktop browser at **1440px or wider** so the UI isn't responsive-mobile-collapsed
- Light mode (the admin UI doesn't ship dark mode — confirm the source default)
- Sign in with the operator `ADMIN_SECRET` so every UI element is visible
- For best clarity, capture the **full page** (not just the viewport). Tools: Chrome DevTools → ⋮ → "Capture full size screenshot", or macOS `Shift+Cmd+5` → window mode
- PNG format, 72 DPI is fine. Don't exceed ~3MB per file (PNG-8 compression if needed)

---

## The 9 screenshots

### 01-idea-review.png — Scored idea queue

**URL:** `/admin/idea-review?secret=…`
**State:** Page with at least 5 ideas visible. Mix of scores (75+ top pick, 55+ eligible). Multiple categories represented.
**Highlight:** Show the full vertical scroll — header with category filter chips, the score chips on each card, the audience tags (Buyer/Seller/Homeowner), the approve / skip / defer buttons.

### 02-idea-review-detail.png — Expanded idea card OR post-approval state

**URL:** `/admin/idea-review?secret=…` (same page)
**State:** Either click into one idea to show its expanded detail (sourceUrl, sourceTitle, why-it-matters, full angle), OR show the toast/feedback after approving an idea (so future Claude Code can see what happens on approval).
**Highlight:** Show how ideas surface their underlying research, and the visual feedback when one is approved.

### 03-va-queue-grid.png — Post staging grid

**URL:** `/admin/va-queue?secret=…`
**State:** At least 4 posts visible across different `workflowStatus` values:
  - 1+ `media_pending` (orange badge, "Media Pending")
  - 1+ `media_ready` (green badge)
  - 1+ post with `vaQueuePriority: 100` (red 🔥 PRIORITY ribbon — a Fed rate post is the easiest way to get this)
  - Ideally 1 `publish_failed` so the red border state is documented
**Highlight:** Show the priority pinning at the top, the status badge variety, the FH Review/Hold badges where present, the thumbnail vs. no-thumbnail placeholder states.

### 04-va-queue-post-detail.png — Full post detail page

**URL:** `/admin/va-queue/[postId]?secret=…`
**State:** Open any post that is **still in `media_pending`** with no thumbnail yet — this way every editor section is visible (not collapsed because already done).
**Highlight:** The full vertical layout end-to-end:
  - Top header (back, title, status badge, FH badge, delete button)
  - Body preview / blog content
  - Thumbnail upload section
  - Social copy textarea
  - Video script textarea
  - HeyGen generation panel
  - Video upload section
  - Video thumbnail upload
  - Publish panel with the "Pressing Publish will…" bullet list + platform status rows

This is the most important screenshot. It's the single most-referenced visual in the replication. **Take this one in full-page mode.**

### 05-va-queue-thumbnail-upload.png — Thumbnail editor (zoomed)

**URL:** `/admin/va-queue/[postId]?secret=…` (zoomed in on the thumbnail section)
**State:** Show the thumbnail upload UI in its empty state — the "Upload thumbnail" button + the AI-generate option + the preview placeholder.
**Highlight:** The drag-and-drop area, the "Generate with AI" button if present, the size/format hints.

### 06-va-queue-heygen.png — HeyGen video script + generation (zoomed)

**URL:** `/admin/va-queue/[postId]?secret=…` (zoomed in on the script + HeyGen sections)
**State:** Show:
  - The video script textarea (with example script text from an existing post)
  - The "Generate script" button
  - The HeyGen generation panel with avatar ID + voice ID fields
  - The "Generate HeyGen video" button
  - Ideally also the polling state where it shows "HeyGen processing…"
**Highlight:** The full HeyGen kickoff flow. This is the part most VAs spend time on.

### 07-va-queue-publish.png — Publish panel (zoomed)

**URL:** `/admin/va-queue/[postId]?secret=…` (zoomed in on the publish panel at the bottom)
**State:** Show the publish panel for a post that:
  - Has been published already (so the platform status rows show statuses), OR
  - Has just been hit with publish (showing the polling state)
**Highlight:**
  - The "Pressing Publish will…" bullet list (Website, Facebook, FB Reel, YouTube, TikTok, Instagram — **no LinkedIn or X**)
  - The platform status rows with icons + states (Waiting / Polling / Published / Failed)
  - The "View Facebook post" / "View YouTube video" links that appear when published

### 08-blog-dashboard.png — Analytics dashboard

**URL:** `/admin/blog-dashboard?secret=…`
**State:** Live dashboard with real numbers. Make sure these are all visible:
  - Header with brand label
  - "The Content Engine, at a glance" headline (Newsreader italic accent)
  - 4 KPI cards (Posts Published, Total Reach, Top Performer, Hours Saved)
  - "Always Climbing" cumulative growth charts (sessions + posts)
  - Momentum chart (12-week posts)
  - "Across the Network" 4-platform cards (FB, IG, YT, TT)
  - Top Performing Posts table
**Highlight:** Full-page capture. This is the operator's daily heartbeat view — Claude Code needs to recreate every section's visual treatment.

### 09-refresh-queue.png — Content refresh approval

**URL:** `/admin/refresh-queue?secret=…` (4th tab in the admin nav)
**State:** Ideally at least 3 posts with refresh recommendations (full-refresh, light-refresh, review-only, do-not-touch) so all tier badges + action chips are visible. **If the site is new and no posts qualify yet, an empty-state screenshot is also fine** — Claude Code still uses it as a layout reference for typography, header treatment, and the admin nav bar.
**Highlight:** The 4-tab admin nav at the top with "Refresh Queue" as the active tab, the page header, the recommendation chip per card, the action buttons (Approve / Skip / Exclude), the tier badges, the last-refreshed-on date.
**Pro tip:** If the queue is empty, trigger the eval cron first to populate it:
```bash
curl -sX POST "https://<DOMAIN>/api/cron/refresh-evaluation?secret=$ADMIN_SECRET"
```

---

## Optional bonus screenshots

If you have time and want the kit to be even sharper:

### 10-idea-digest-email.png — Operator email
Open the daily idea digest email (Resend → look in your inbox). Capture the rendered HTML.

### 11-fh-violation-alert.png — Fair Housing alert
If you've ever received an FH violation alert email, capture that too. It shows what the operator sees when Claude Haiku flags an issue.

### 12-va-queue-published-state.png — Post after publishing
The VA Queue card for a fully-published post — green border, "Published" badge, link to live post.

---

## Filename rules

- All lowercase
- Hyphens between words
- Two-digit number prefix matching the list above
- `.png` extension
- No spaces, no special characters

Examples (correct):
- `01-idea-review.png` ✓
- `04-va-queue-post-detail.png` ✓

Examples (wrong):
- `Idea Review.png` ✗
- `va_queue_post_detail.PNG` ✗
- `4-va-queue.png` ✗ (missing leading zero)

---

## When you're done

Open this folder and verify:
- [ ] At least the 9 required PNGs are present
- [ ] All filenames match exactly
- [ ] Each file is < 3MB
- [ ] No screenshots show real personal info (operator emails, real client phone numbers in the UI)

Then proceed to fill out [`../customization-template.md`](../customization-template.md).
