# Customization Template

**You no longer fill most of this by hand.** When you run the kit prompt, Claude Code's **Phase 0** reads the client's already-built site (same repo) and auto-fills the client-identity fields — Sections 1, 2, 5, the Sanity + GA rows of Section 3, the agent-contact rows of Section 4 — and drafts Sections 6–7. It then shows them to you to confirm or correct.

**What you actually provide** are the net-new authority-engine credentials: the service IDs in Section 3 (OneUp, HeyGen, Upstash), the Resend + GitHub PAT in Section 4, and the Redis prefix. Those accounts don't exist on the site, so Claude can't derive them — they're the same set as the Section 8 checklist.

Claude treats the confirmed values here as the source of truth.

---

## Section 1 — Client identity
_Auto-derived in Phase 0 from the built site — confirm._

| Field | Example (Legacy Home Search) | Your value |
|---|---|---|
| **Client name** | Legacy Home Team | |
| **Agent name** | Barry Jenkins | |
| **Agent positioning** (NOT "real estate agent" — frame as local resident, parent, investor) | Long-time Hampton Roads resident, parent, investor | |
| **Years in market** | 20+ | |
| **Market name** | Hampton Roads, Virginia | |
| **State** | Virginia | |
| **Primary communities** (5–7) | Virginia Beach, Chesapeake, Norfolk, Suffolk, Hampton, Newport News | |
| **Market context** (military base, coastal, mountain, college town, urban, etc.) | Military/PCS-heavy, coastal flood-zone, multiple military bases | |
| **Domain** | legacyhometeamlpt.com | |

---

## Section 2 — Find/replace strings (global)
_Auto-derived in Phase 0 once Section 1 + brand colors are known — confirm._

Apply these substitutions everywhere in the new repo. The kit prompt has Claude Code do this automatically — this table is your reference + a way to verify nothing was missed.

| Find (in source) | Replace with (your value) |
|---|---|
| `Hampton Roads` | _Your market name_ |
| `Virginia Beach` | _Your primary city_ |
| `Chesapeake` | _Your 2nd community_ |
| `Norfolk` | _Your 3rd community_ |
| `Suffolk` | _Your 4th community_ |
| `Hampton` | _Your 5th community_ |
| `Newport News` | _Your 6th community_ |
| `Barry Jenkins` | _Agent name_ |
| `Barry` (standalone) | _Agent first name_ |
| `Legacy Home Team` | _Client name_ |
| `Legacy Home Search` | _Same as client name_ |
| `legacyhometeamlpt.com` | _Domain_ |
| `legacyhometeamlpt` | _Domain root (no TLD)_ |
| `lhs:` (Redis prefix) | _Your 3–4 letter prefix + colon, e.g. `srlv:`_ |
| `2nr7n3lm` (Sanity project ID) | _Your Sanity project ID_ |
| `#1E3A5F` (brand navy) | _Your brand primary color_ |
| `#2563eb` (brand blue) | _Your brand accent color_ |
| `Inter` (body font) | _Body font_ |
| `Newsreader` (display italic) | _Display italic font_ |
| `Virginia` (state name) | _Your state_ |
| `VA` (state abbreviation in addresses) | _Your state abbreviation_ |
| `757` (area code) | _Local area code_ |

---

## Section 3 — Tech stack identifiers
_Sanity rows + GA rows: auto-derived in Phase 0. OneUp / HeyGen / Upstash / Redis prefix: **you provide** (net-new accounts)._

| Service | Example value | Your value | Notes |
|---|---|---|---|
| **Sanity project ID** | `2nr7n3lm` | | Create at sanity.io/manage |
| **Sanity dataset** | `production` | | Usually keep as `production` |
| **Sanity studio title** | `Legacy Home Search` | | Goes in `sanity.config.ts` |
| **Redis key prefix** | `lhs:` | | 3–4 letters + colon. Pick something distinctive — e.g. `srlv:` for Scofield Realty Las Vegas, `shg:` for Shana Gates |
| **OneUp category ID** | `179358` | | Created in OneUp dashboard (one category per client) |
| **OneUp Facebook account ID** | (Page ID) | | From OneUp dashboard after connecting Facebook |
| **OneUp Instagram account ID** | (17841…) | | From OneUp dashboard |
| **OneUp YouTube channel ID** | (UC…) | | From OneUp dashboard |
| **OneUp TikTok account ID** | (_000…) | | From OneUp dashboard |
| **HeyGen avatar ID** | `906086aa80874ad798b256b5bbc41c70` | | Generated when you create the agent's avatar in HeyGen |
| **HeyGen voice ID** | (per-agent) | | Cloned voice or chosen library voice |
| **GA4 property ID** (9-digit) | | | From GA4 → Admin → Property Settings |
| **GA4 measurement ID** | `G-SRPJW2SEG2` | | Starts with `G-` |
| **GTM container ID** (optional) | `GTM-T3VB2GG` | | If using Google Tag Manager |

---

## Section 4 — Operator + brand
_Agent public email / phone / office address: auto-derived in Phase 0. Operator email, Resend from-email, GitHub repo + PAT: **you provide**._

| Field | Example | Your value |
|---|---|---|
| **Operator email** | kiwi@ylopo.com | |
| **From email** (Resend, must be verified domain) | (verified sender) | |
| **Agent's public email** | barry@yourfriendlyagent.net | |
| **Agent's public phone** | (757) 816-4037 | |
| **Office address** | 1545 Crossways Blvd, Ste 250, Chesapeake, VA 23320 | |
| **GitHub repo** | Ylopo/legacy-home-search | |
| **GitHub PAT** (for cron commits to LEARNINGS.md) | (classic PAT with repo scope) | |

---

## Section 5 — Brand colors + typography
_Auto-derived in Phase 0 from `app/globals.css` + the font setup — confirm._

| Field | Example (Legacy) | Your value |
|---|---|---|
| **Brand primary (navy/dark)** | `#1E3A5F` | |
| **Brand accent (blue)** | `#2563eb` | |
| **Off-white / cream** | `#f8f7f4` | |
| **Body text color** | `#1a1a1a` | |
| **Headline font** | Inter | |
| **Body font** | Inter | |
| **Italic display font** | Newsreader (Google Fonts) | |

---

## Section 6 — State-specific customizations
_Claude drafts these in Phase 0 from the client's state — **verify the legal specifics** (closing process, transfer tax, closing-cost ballpark)._

| Item | Default (Virginia) | Your state |
|---|---|---|
| **Fair Housing protected classes** (in `lib/fair-housing.ts`) | Race, color, religion, national origin, sex, disability, familial status, marital status, sexual orientation, gender identity, source of income | _List any additional classes your state adds_ |
| **Closing process** | Attorney-state (closings done by attorneys) | _Attorney state, escrow state, or other?_ |
| **Transfer tax** | No state-level transfer tax | _Your state's transfer tax rules_ |
| **Major military bases** | Naval Station Norfolk, JEB Little Creek, JEB Fort Story, Langley AFB, JB Langley-Eustis, NAS Oceana | _Or N/A if non-military market_ |
| **Disaster risks worth covering** | Hurricane, flood zones, coastal erosion | _Wildfire, earthquake, tornado, etc._ |
| **Closing cost ballpark** (in `lib/idea-writer.ts` post template) | ~3% of purchase price | _Verify your state_ |

---

## Section 7 — Special content angles
_Claude drafts these in Phase 0 from the market + existing site content — refine._

What angles should the content machine emphasize for this client? These shape the Tavily queries in `lib/research.ts` and the writing prompt in `lib/idea-writer.ts`.

Examples for Hampton Roads:
- Military / PCS / VA loan angles
- Flood insurance + coastal living
- Hurricane preparation
- Naval base + military spouse considerations
- Year-round outdoor lifestyle

| Your client's angles (5–10) |
|---|
| 1. |
| 2. |
| 3. |
| 4. |
| 5. |
| 6. |
| 7. |
| 8. |

---

## Section 8 — Done?

Before you paste the Claude Code prompt, verify:

- [ ] Every "Your value" cell above is filled (or explicitly marked N/A)
- [ ] Sanity project exists and you have its project ID
- [ ] Upstash Redis database exists and you have URL + token
- [ ] OneUp client category created and you have its ID
- [ ] All 6 OneUp social accounts connected in that category (FB, IG, YT, TikTok — NOT LinkedIn or X)
- [ ] HeyGen avatar created (or chosen from library) and you have avatar ID + voice ID
- [ ] Resend domain verified and you have the API key
- [ ] GA4 property created with service account access enabled
- [ ] All 9 screenshots dropped into `replication-kit/screenshots/` with the correct filenames
- [ ] You have absolute paths for `<SOURCE_PATH>` and `<KIT_PATH>` ready to paste

When every box is ticked, paste the prompt from [`README.md`](./README.md).
