# Fair Housing Compliance — Content Operations Guide

## Why This Matters

Under the Fair Housing Act (42 U.S.C. § 3604), publishing content that expresses a preference for or against any protected class is a federal violation. This includes blog posts, social media captions, video scripts, and all other marketing materials.

**Civil penalties (2024 rates):**
- First violation: up to **$25,597**
- Violation within 5 years: up to **$63,991**
- Two or more violations within 7 years: up to **$127,983**
- Plus actual damages, punitive damages, and attorney fees

**Broker vicarious liability:** The brokerage is legally liable for agent content even if the broker never reviewed it.

**Intent is irrelevant.** The legal standard is the **"ordinary reader test"** — if a reasonable person could interpret the content as expressing a preference related to a protected class, it's a violation. This means content that was written with good intentions still violates the law if the language suggests who should or shouldn't live somewhere.

---

## Protected Classes

### Federal (7 classes — Fair Housing Act)
1. Race
2. Color
3. Religion
4. National Origin
5. Sex (including gender identity and sexual orientation in many jurisdictions)
6. Disability
7. Familial Status (presence of children under 18, pregnancy, intent to adopt)

### Virginia adds:
- Marital status
- Sexual orientation
- Gender identity
- Source of income (since July 1, 2020)

---

## Hard Violations — Never Use These

These are direct violations. The AI system is configured to never generate them, and the compliance checker will flag them as **violations** requiring human review before publishing.

### Familial Status Violations
| ❌ Never | ✅ Instead |
|---|---|
| "Family-friendly" | "Near parks and recreational facilities" |
| "Perfect for families" | Describe the yard, nearby amenities, school district name |
| "Great for growing families" | "3 bedrooms + bonus room" |
| "Perfect for empty nesters" | "Low-maintenance one-level floor plan" |
| "Great for retirees" | "Single-story, minimal yard maintenance" |
| "Adult community" | Only for legally designated 55+ communities |
| "Not suitable for children" | Never use |

### Religion Violations
| ❌ Never | ✅ Instead |
|---|---|
| "Walking distance to St. Mary's Church" | "Convenient to local houses of worship" |
| "Steps from Temple Beth Shalom" | "Central location near religious institutions" |
| "Close to Masjid Al-Noor" | Omit or use generic "place of worship" |
| Any reference to a specific religious institution by name as a selling point | |

### Sex / Gender Violations
| ❌ Never | ✅ Instead |
|---|---|
| "Master bedroom" | "Primary bedroom" or "Owner's suite" |
| "Man cave" | "Entertainment room" or "Media room" |
| "Wife's dream kitchen" | "Fully renovated chef's kitchen" |
| "Bachelor pad" | "Modern studio" or describe the features |

### National Origin / Race Violations
| ❌ Never | ✅ Instead |
|---|---|
| "Heart of Little Italy" | Name the neighborhood by its official name |
| "Close-knit ethnic community" | Describe actual amenities |
| Any reference to neighborhood demographics by race or ethnicity | |
| "Diverse neighborhood" (as a selling point suggesting who lives there) | Describe the amenities and location |

### Coded / Implicit Violations
These phrases seem neutral but the FHA applies the ordinary reader test:

| ❌ Avoid | Why | ✅ Instead |
|---|---|---|
| "Safe neighborhood" | Subjective; often coded for race/demographics | "Crime rate 40% below city average (City of VB data)" |
| "Established neighborhood" | Often implies racial exclusivity | Describe when it was built, architecture style |
| "Up-and-coming area" | Often racial/demographic code | "Neighborhood with $X in recent development investment" |
| "Good schools" | Must be objective | "[School Name], rated 8/10 by GreatSchools (2024)" |
| "Sought-after neighborhood" | Vague; implies exclusivity | Describe what makes it desirable specifically |
| "Quiet neighborhood" | Can imply no families/children | "Low-traffic residential street" |
| "Young professional" | Age + sex discrimination | Describe the property features |

### Disability Violations
| ❌ Never | ✅ Instead |
|---|---|
| "Perfect for active families" (implies mobility requirement) | Describe the amenities |
| "Requires mobility" | Never qualify who is appropriate for a property |
| "Not wheelchair accessible" | State the factual feature: "No elevator, stairs required to access unit" |
| "Handicapped accessible" as a marketing phrase | "ADA-accessible features include..." |

---

## Always Safe Language

Focus on the **property** and **objective facts**. Never describe the ideal resident.

**Physical features:**
- "Primary bedroom" (never "master")
- "3 bedrooms, 2.5 bathrooms"
- "1,850 sq ft"
- "Renovated kitchen with quartz countertops"
- "Private backyard with privacy fence"
- "Single-story floor plan"

**Location — objective measurements:**
- "0.4 miles from Town Center Mall"
- "8 minutes from Naval Station Norfolk"
- "Adjacent to First Landing State Park"
- "Convenient to I-264"

**Schools — with citations:**
- "[School Name], rated 8/10 by GreatSchools.org (2024)"
- "Served by [School District Name]" (without opinion)

**Amenities — factual:**
- "Community pool and fitness center"
- "Gated community"
- "On-site parking"
- "Energy Star certified"

**Market data — sourced:**
- "Median sale price $375,000 (Zillow, Q1 2024)"
- "Inventory down 12% year-over-year (REIN MLS)"

---

## The Steering Rule

**Steering** is directing a buyer toward or away from a neighborhood based on a protected characteristic. It is illegal regardless of intent.

Examples of illegal steering:
- Directing a buyer with children toward a specific neighborhood because you think it's "better for families"
- Mentioning nearby churches, mosques, or synagogues when the buyer mentioned their religion
- Showing a buyer with a disability only first-floor units without being asked
- Suggesting someone "wouldn't fit in" anywhere

**The content risk:** Blog posts and social media can constitute steering if they describe neighborhoods in ways that signal who belongs there. The content system is configured to never attribute neighborhood character to demographic composition.

---

## How the Automated Compliance System Works

Every piece of AI-generated content passes through two layers before being saved or published:

### Layer 1: Prevention (Prompt Level)
Fair Housing rules are embedded directly in every Claude writing prompt. The AI is instructed to never generate violating language in the first place.

### Layer 2: Verification (Post-Generation Check)
After content is generated — but before it is saved to Sanity or published — a compliance check runs automatically using Claude with FH-specific instructions.

**Results:**

| Status | Meaning | What happens |
|---|---|---|
| **Clear** ✅ | No issues detected | Post proceeds normally |
| **Warning** ⚠️ | Contextually flagged language | Post proceeds, badge shown in VA Queue for operator awareness |
| **Violation** 🚨 | Hard violation detected | Post is held; operator gets an alert email with the specific issue and suggested fix |

### VA Queue Badges
Every post in the VA Queue shows its Fair Housing status. A yellow "FH Review" badge means the checker flagged something for your awareness. A red "FH Hold" badge means a hard violation was detected and the post needs human review before proceeding.

The "Mark as Reviewed" button on the post editor clears the hold once you've reviewed and confirmed the content is compliant (or edited it to fix the issue).

---

## What to Do When a Post Is Held

1. Open the VA Queue and click the post with the red "FH Hold" badge
2. Read the Fair Housing panel at the top — it shows the flagged text, which rule it triggers, and a suggested alternative
3. Edit the blog post body in Sanity Studio if needed (or ask the operator to regenerate)
4. Once satisfied, click "Mark as Reviewed" to clear the hold
5. Proceed with thumbnail, social copy, and publishing normally

---

## Adapting for a New Client

When onboarding a client in a new state:
1. Check that state's protected classes beyond the federal 7 — add them to the FH checker prompt in `lib/fair-housing.ts`
2. Review any municipal fair housing ordinances for the metro area
3. Update the `FAIR_HOUSING_RULES` constant in `lib/fair-housing.ts` with state-specific additions

**California adds:** Sexual orientation, gender identity, age, source of income, marital status, citizenship/immigration status — these are already covered in the Shana Gates implementation.

---

## Key Files

| File | Purpose |
|---|---|
| `FAIR_HOUSING.md` | This document — operator guide + onboarding reference |
| `lib/fair-housing.ts` | `checkFairHousing()`, `saveFHResult()`, `getFHResult()`, `FAIR_HOUSING_RULES` constant |
| `lib/idea-writer.ts` | FH rules injected into blog post writing prompt |
| `lib/writer.ts` | FH rules injected into blog picker writing prompt |
| `lib/publish-service.ts` | FH rules injected into social caption prompts |
| `app/api/content/ideas/approve/route.ts` | FH check runs after post generation |
| `app/api/blog/publish/route.ts` | FH check runs after each post generation |

---

*Last updated: May 2026. Legal information here is for operational guidance only — consult your brokerage's legal counsel for specific compliance questions.*
