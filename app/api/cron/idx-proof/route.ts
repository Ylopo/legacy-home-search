import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { fetchIdxClickData } from '@/lib/ga4'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

// One-time proof-of-life email for IDX attribution tracking.
// Scheduled for May 22, 2026 at 9:00 UTC (5 AM EDT).
// Guard ensures it silently skips if cron is somehow still active in future years.
const TARGET_MONTH = 5  // May
const TARGET_DAY   = 22

export async function GET(request: Request) {
  // Auth check (Vercel cron sends this header; also accepts ?secret= for manual testing)
  const cronSecret = process.env.CRON_SECRET
  const { searchParams } = new URL(request.url)
  const authHeader = request.headers.get('authorization')

  const isCronCall   = cronSecret && authHeader === `Bearer ${cronSecret}`
  const isManualCall = cronSecret && searchParams.get('secret') === cronSecret
  const isLegacyCall = !cronSecret // no secret configured — allow (matches existing cron pattern)

  if (!isCronCall && !isManualCall && !isLegacyCall) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Date guard — skip silently outside the target date (prevents future-year accidental runs)
  const now = new Date()
  const isForced = searchParams.get('force') === '1'
  if (!isForced) {
    const utcMonth = now.getUTCMonth() + 1
    const utcDay   = now.getUTCDate()
    if (utcMonth !== TARGET_MONTH || utcDay !== TARGET_DAY) {
      return NextResponse.json({ skipped: true, reason: `Not the target date (target: ${TARGET_MONTH}/${TARGET_DAY}, today: ${utcMonth}/${utcDay} UTC)` })
    }
  }

  const resendKey  = process.env.RESEND_API_KEY
  const fromEmail  = process.env.FROM_EMAIL
  if (!resendKey || !fromEmail) {
    return NextResponse.json({ error: 'Missing RESEND_API_KEY or FROM_EMAIL' }, { status: 500 })
  }

  // Fetch IDX data for last 7 days (deployment was May 15 — we have up to 7 days of data)
  const idx = await fetchIdxClickData(7)

  const resend = new Resend(resendKey)
  const html   = buildEmail(idx, now)

  const { error } = await resend.emails.send({
    from: fromEmail,
    to:   'kiwi@ylopo.com',
    subject: `IDX Tracking Proof Report — Legacy Home Team (${formatDate(now)})`,
    html,
  })

  if (error) {
    console.error('[idx-proof] Resend error:', error)
    return NextResponse.json({ ok: false, error }, { status: 500 })
  }

  console.log('[idx-proof] Proof email sent to kiwi@ylopo.com')
  return NextResponse.json({ ok: true, totalClicks: idx?.totalClicks ?? 0, sentAt: now.toISOString() })
}

// ── Email builder ────────────────────────────────────────────────────────────

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' })
}

function buildEmail(
  idx: Awaited<ReturnType<typeof fetchIdxClickData>>,
  now: Date
): string {
  const hasClicks = idx && idx.totalClicks > 0
  const dateStr   = formatDate(now)

  const statusBanner = hasClicks
    ? `<td style="background:#dcfce7;border-left:4px solid #16a34a;padding:16px 20px;border-radius:6px;">
        <span style="font-size:18px;">✅</span>
        <strong style="color:#15803d;font-size:15px;margin-left:8px;">Tracking is live and collecting data</strong>
        <p style="margin:8px 0 0;font-size:13px;color:#166534;">
          The <code style="background:#f0fdf4;padding:2px 6px;border-radius:3px;">idx_property_click</code> event
          has fired ${idx.totalClicks} time${idx.totalClicks === 1 ? '' : 's'} in the past 7 days.
          Attribution is working.
        </p>
       </td>`
    : `<td style="background:#fef9c3;border-left:4px solid #ca8a04;padding:16px 20px;border-radius:6px;">
        <span style="font-size:18px;">⏳</span>
        <strong style="color:#92400e;font-size:15px;margin-left:8px;">Tracking deployed — awaiting first clicks or GA4 processing</strong>
        <p style="margin:8px 0 0;font-size:13px;color:#713f12;">
          No <code style="background:#fefce8;padding:2px 6px;border-radius:3px;">idx_property_click</code> events
          in GA4 yet. This is normal if: (a) the site hasn't had listing clicks since May 15,
          or (b) GA4 is still processing events (24–48 hr delay is normal).
          The tracking code is deployed and ready.
        </p>
       </td>`

  const clicksTable = hasClicks
    ? `
    <tr><td style="padding-top:24px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td colspan="3" style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.08em;padding-bottom:10px;">
            TOP PAGES BY IDX CLICKS (last 7 days)
          </td>
        </tr>
        <tr style="background:#f8fafc;">
          <th style="text-align:left;font-size:12px;font-weight:600;color:#475569;padding:8px 12px;border:1px solid #e2e8f0;">Page</th>
          <th style="text-align:right;font-size:12px;font-weight:600;color:#475569;padding:8px 12px;border:1px solid #e2e8f0;">Clicks</th>
          <th style="text-align:right;font-size:12px;font-weight:600;color:#475569;padding:8px 12px;border:1px solid #e2e8f0;">CTR</th>
        </tr>
        ${idx.topPages.slice(0, 10).map(p => `
        <tr>
          <td style="font-size:13px;color:#1a1a1a;padding:8px 12px;border:1px solid #e2e8f0;font-family:monospace;">${p.page || '/'}</td>
          <td style="font-size:13px;font-weight:700;color:#0891b2;text-align:right;padding:8px 12px;border:1px solid #e2e8f0;">${p.clicks}</td>
          <td style="font-size:13px;color:#64748b;text-align:right;padding:8px 12px;border:1px solid #e2e8f0;">${p.ctr}%</td>
        </tr>`).join('')}
      </table>
    </td></tr>`
    : ''

  const trendTable = hasClicks && idx.trend.length > 0
    ? `
    <tr><td style="padding-top:24px;">
      <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.08em;padding-bottom:10px;">
        DAILY CLICK TREND (last 7 days)
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr style="background:#f8fafc;">
          <th style="text-align:left;font-size:12px;font-weight:600;color:#475569;padding:8px 12px;border:1px solid #e2e8f0;">Date</th>
          <th style="text-align:right;font-size:12px;font-weight:600;color:#475569;padding:8px 12px;border:1px solid #e2e8f0;">Clicks</th>
        </tr>
        ${idx.trend.map(t => `
        <tr>
          <td style="font-size:13px;color:#475569;padding:8px 12px;border:1px solid #e2e8f0;">${t.date}</td>
          <td style="font-size:13px;font-weight:700;color:#0891b2;text-align:right;padding:8px 12px;border:1px solid #e2e8f0;">${t.clicks}</td>
        </tr>`).join('')}
      </table>
    </td></tr>`
    : ''

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:Inter,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">

  <!-- Header -->
  <tr>
    <td style="background:#0f172a;padding:24px 32px;">
      <div style="font-size:11px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px;">
        Legacy Home Team · IDX Attribution
      </div>
      <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-.02em;">
        IDX Tracking Proof Report
      </h1>
      <div style="font-size:13px;color:#94a3b8;margin-top:6px;">${dateStr} · legacyhometeamlpt.com</div>
    </td>
  </tr>

  <!-- Body -->
  <tr><td style="padding:28px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0">

      <!-- Status banner -->
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0"><tr>${statusBanner}</tr></table>
      </td></tr>

      <!-- What is being tracked -->
      <tr><td style="padding-top:28px;">
        <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;">
          WHAT THE TRACKING CAPTURES
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${[
            ['Event name', 'idx_property_click'],
            ['Trigger', 'Click on any YLOPO /search/detail/ listing link'],
            ['Source pages tracked', 'All 6 community pages + blog posts + team pages'],
            ['YLOPO domains covered', 'search.buyingva.com + all 6 agent subdomains'],
            ['listing_id', 'Property ID extracted from URL'],
            ['source_page', 'Page on legacyhometeamlpt.com where click happened'],
            ['source_market', 'H1 text of the originating page (e.g. "Virginia Beach Homes For Sale")'],
            ['widget_type', 'results-widget or embedded'],
            ['link_domain', 'YLOPO domain clicked into'],
            ['UTM params appended', 'utm_source=website, utm_medium=idx, utm_campaign=<page-slug>'],
          ].map(([k, v]) => `
          <tr>
            <td style="font-size:12px;color:#64748b;padding:7px 12px;border:1px solid #e2e8f0;background:#f8fafc;width:45%;font-weight:600;">${k}</td>
            <td style="font-size:12px;color:#1a1a1a;padding:7px 12px;border:1px solid #e2e8f0;font-family:monospace;">${v}</td>
          </tr>`).join('')}
        </table>
      </td></tr>

      <!-- Total clicks KPI -->
      <tr><td style="padding-top:28px;">
        <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;">
          LAST 7 DAYS
        </div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:20px 24px;text-align:center;">
              <div style="font-size:42px;font-weight:800;color:#0891b2;line-height:1;">${idx?.totalClicks ?? 0}</div>
              <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-top:6px;">
                idx_property_click events
              </div>
              <div style="font-size:12px;color:#94a3b8;margin-top:4px;">
                May 15 – ${dateStr}
              </div>
            </td>
          </tr>
        </table>
      </td></tr>

      ${clicksTable}
      ${trendTable}

      <!-- How to verify -->
      <tr><td style="padding-top:28px;padding-bottom:4px;">
        <div style="font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px;">
          HOW TO VERIFY YOURSELF
        </div>
        <div style="background:#f8fafc;border-radius:8px;padding:16px 20px;font-size:13px;color:#475569;line-height:1.7;">
          <strong style="color:#1a1a1a;">In GA4:</strong> Go to Reports → Engagement → Events.
          Look for <code style="background:#e2e8f0;padding:1px 5px;border-radius:3px;font-size:12px;">idx_property_click</code> in the event list.<br><br>
          <strong style="color:#1a1a1a;">In browser:</strong> Open any community page on the site,
          open DevTools → Console, click a listing card, then run
          <code style="background:#e2e8f0;padding:1px 5px;border-radius:3px;font-size:12px;">window.dataLayer</code>
          — you should see the event with all parameters.<br><br>
          <strong style="color:#1a1a1a;">Admin dashboard:</strong>
          Visit <a href="https://legacyhometeamlpt.com/admin/blog-dashboard" style="color:#2563eb;">legacyhometeamlpt.com/admin/blog-dashboard</a>.
        </div>
      </td></tr>

    </table>
  </td></tr>

  <!-- Footer -->
  <tr>
    <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 32px;text-align:center;">
      <div style="font-size:11px;color:#94a3b8;">
        Legacy Home Search Content Machine · Auto-report sent ${dateStr}
      </div>
      <div style="font-size:11px;color:#cbd5e1;margin-top:4px;">
        This cron can be removed from vercel.json after you've confirmed tracking is working.
      </div>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body></html>`
}
