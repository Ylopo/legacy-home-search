# IDX Pass-Through Attribution

This document covers the YLOPO click tracking implementation — what changed, where tracking lives, how attribution works, what to configure in GA4, and how to validate it.

---

## What changed

| File | Change |
|---|---|
| `components/YlopoTrack.tsx` | New component — delegated click handler for all YLOPO listing detail links |
| `app/layout.tsx` | Added `<YlopoTrack />` to root layout (wires all pages at once) |
| `lib/ga4.ts` | Added `fetchIdxClickData()` — queries GA4 Data API for `idx_property_click` events |
| `app/api/analytics/overview/route.ts` | Added `idx` and `idxError` fields to the analytics overview response |
| `app/admin/analytics/page.tsx` | Added "IDX Pass-Through Traffic" section between Website Performance and Search Visibility |

---

## Where the tracking lives

All tracking logic is in `components/YlopoTrack.tsx`. It is a React client component with no render output — `return null`. It attaches a single delegated click listener to `document` in capture phase via `useEffect`.

Because it is mounted in the root layout, it runs on every page. No per-page changes were needed.

---

## How attribution works

### Click detection

The handler intercepts all clicks on `<a>` tags whose `href` contains `/search/detail/`. This matches YLOPO property detail URLs across all YLOPO domains:

- `search.buyingva.com/search/detail/{id}` (main site default)
- `listings.legacyhomesearch.com/search/detail/{id}` (Barry Jenkins team page)
- `tanya.legacyhomesearch.com/search/detail/{id}` (Tanya Thompson)
- `chris.legacyhomesearch.com/search/detail/{id}` (Chris August)
- `matt.legacyhomesearch.com/search/detail/{id}` (Matt Moubray)
- `jon.legacyhomesearch.com/search/detail/{id}` (Jon Mironchik)
- `julz.legacyhomesearch.com/search/detail/{id}` (Julz Gat)

### GA4 event fired

```
Event name: idx_property_click

Parameters:
  listing_id     — ID extracted from /search/detail/{id}
  listing_url    — Full destination URL
  source_page    — window.location.pathname (e.g. /virginia-beach)
  source_title   — document.title
  source_market  — Text of the first <h1> on the page (e.g. "Virginia Beach Homes For Sale")
  widget_type    — "results-widget" if inside .YLOPO_resultsWidget, else "embedded"
  link_domain    — Hostname of the destination (e.g. search.buyingva.com)
  link_path      — Pathname of the destination (e.g. /search/detail/12345)
```

### dataLayer push (GTM-compatible)

The same fields are pushed to `window.dataLayer` as `{ event: 'idx_property_click', ...params }` for forward GTM compatibility.

### Outbound URL decoration

Before navigation, the following query params are appended to the YLOPO URL (skipped if `utm_source` already present):

```
utm_source=website
utm_medium=idx
utm_campaign=<normalized-page-slug>  (e.g. virginia-beach, blog-post-title)
utm_content=ylopo-widget
src_page=<window.location.pathname>
src_title=<document.title>
src_market=<h1 text>
```

These land in the YLOPO/buyingva.com session and can be seen in that platform's analytics. The `utm_campaign` value is normalized: lowercase, non-alphanumeric runs replaced with hyphens, `.html` stripped.

### Duplicate-click guard

A module-level guard prevents the same `href` from firing more than once within 500 ms. This handles accidental double-clicks or re-entrancy.

---

## GA4 custom dimensions to register

These parameters are sent with every `idx_property_click` event. To make them queryable in GA4 Explorations and Reports, register them as **custom dimensions** under Admin → Custom Definitions → Custom Dimensions:

| Parameter name | Scope | Display name suggestion |
|---|---|---|
| `source_page` | Event | IDX Source Page |
| `source_title` | Event | IDX Source Title |
| `source_market` | Event | IDX Source Market |
| `widget_type` | Event | IDX Widget Type |
| `listing_id` | Event | IDX Listing ID |
| `link_domain` | Event | IDX Link Domain |
| `link_path` | Event | IDX Link Path |

Until these are registered, GA4 will still count the events and their totals, but you cannot segment or filter by the custom parameters in Explorations.

---

## How to validate the implementation

### Browser console check (development or production)

1. Open any community page (e.g. `/virginia-beach`)
2. Wait for YLOPO widgets to render (property cards appear)
3. Open DevTools → Console and run:
   ```js
   window.dataLayer
   ```
4. Click any listing card
5. A new object should appear in `window.dataLayer` with `event: "idx_property_click"` and all parameter fields

### GA4 DebugView (production)

1. Install the GA4 DebugView Chrome extension (or add `?_gl=...debug=1` to URL)
2. Navigate to a community page and click a listing
3. In GA4 → Admin → DebugView, the `idx_property_click` event should appear within seconds with all parameters

### URL inspection

After clicking a listing card, inspect the URL you land on in the YLOPO search tab. It should contain:
```
?utm_source=website&utm_medium=idx&utm_campaign=virginia-beach&utm_content=ylopo-widget&src_page=...
```

### Pages without widgets

Load `/blog` or `/team`. Open console. Clicking non-YLOPO links should produce no `idx_property_click` events and no errors.

---

## GA4 reports to use

### See total IDX clicks

GA4 → Reports → Engagement → Events → click `idx_property_click` row

### Which pages generate the most clicks

GA4 → Explore → Free Form
- Dimension: Page path
- Metric: Event count
- Segment: Event name = `idx_property_click`

### Compare site traffic vs IDX pass-through

GA4 → Reports → Overview
- Sessions (overall)
- Cross-reference with `idx_property_click` event count to compute click-through rate

### Internal admin dashboard

Visit `/admin/analytics?secret=<ADMIN_SECRET>`

The **IDX Pass-Through Traffic** section shows:
- Total IDX clicks for the selected period (28 or 90 days)
- Site-wide CTR (IDX clicks / sessions)
- Top source page by clicks and CTR
- Daily trend sparkline
- Top pages table with clicks and CTR per page

Data appears 24–48 hours after the first real click (GA4 processing delay). The section shows a "No IDX clicks tracked yet" placeholder until then.

---

## Cross-domain measurement (legacyhometeamlpt.com → search.buyingva.com)

YLOPO detail pages live on a separate root domain (`search.buyingva.com`) that Legacy Home Team does not control. GA4 cross-domain linking requires both domains to share the same GA4 property and both sites to include the gtag snippet with `linker` configured.

Since `search.buyingva.com` is owned by YLOPO, cross-domain linking cannot be configured unilaterally. What we can do:

1. **From our side**: The `src_page` and `src_market` URL params we append are readable by YLOPO's analytics team if they want to surface them.
2. **In GA4**: The `idx_property_click` event on our property captures that a user clicked to YLOPO. We know they left; we just cannot see what they did after.
3. **UTM params**: If YLOPO's own GA4 (if any) reads our `utm_source=website` / `utm_campaign=virginia-beach` params, those show as referral/campaign sessions in their analytics — proving our site drives their traffic.

The implementation here captures our side fully. For YLOPO-side visibility, contact your YLOPO rep to ask if they surface inbound UTM data in their reporting portal.

---

## Limitations

- **YLOPO rendering changes**: If YLOPO changes from rendering `<a href="/search/detail/...">` anchor tags to using `window.open()` or click handlers that don't set `href`, the current implementation will not fire. Monitor after any YLOPO widget script update.
- **Widget in shadow DOM**: If YLOPO ever renders inside a Shadow DOM, `anchor.closest('.YLOPO_resultsWidget')` will not traverse the shadow boundary. The event would still fire (the click bubbles through the shadow host to `document`), but `widget_type` would read `'embedded'` instead of `'results-widget'`.
- **GA4 custom dimension lag**: New custom dimensions can take 24–72 hours to backfill in Explorations after registration.
- **Ad blockers**: Users with GA4 blocked (uBlock Origin, Brave) will not generate events. The UTM append still runs in-browser, but the event never reaches GA4.
