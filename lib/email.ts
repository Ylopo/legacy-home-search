import { Resend } from 'resend'
import type { ScoredArticle } from './types'
import type { RefreshCandidate } from './refresh-engine'
import type { PerformanceWeights } from './idea-store'
import type { FHCheckResult } from './fair-housing'

export type PerformanceReviewData = {
  periodStart: string
  periodEnd: string
  postsPublishedCount: number
  estimatedReach: number
  weights: PerformanceWeights
  youtubeViews: number
  facebookReach: number
  analyticsUrl: string
}

const CATEGORY_LABELS: Record<string, string> = {
  'market-update': 'Market Update',
  'buying-tips': 'Buying Tips',
  'selling-tips': 'Selling Tips',
  'community-spotlight': 'Community Spotlight',
  investment: 'Investment',
  news: 'News',
}

const CATEGORY_COLORS: Record<string, string> = {
  'market-update': '#2563eb',
  'buying-tips': '#4CAF50',
  'selling-tips': '#2196F3',
  'community-spotlight': '#9C27B0',
  investment: '#FF9800',
  news: '#607D8B',
}

function articleCard(article: ScoredArticle, index: number): string {
  const color = CATEGORY_COLORS[article.category] ?? '#2563eb'
  const label = CATEGORY_LABELS[article.category] ?? article.category
  return `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #e5e3de;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width: 28px; vertical-align: top; padding-top: 2px;">
              <span style="color: #2563eb; font-size: 18px; font-weight: 700;">${index + 1}</span>
            </td>
            <td style="padding-left: 12px;">
              <span style="display: inline-block; background: ${color}22; color: ${color}; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; padding: 2px 8px; border-radius: 3px; margin-bottom: 6px;">${label}</span>
              <div style="font-size: 15px; font-weight: 600; color: #1a1a1a; margin-bottom: 6px; line-height: 1.4;">${article.title}</div>
              <div style="font-size: 13px; color: #555550; line-height: 1.6; margin-bottom: 8px;">${article.whyItMatters}</div>
              <div style="font-size: 12px; color: #888884;">
                ${article.source ?? ''} ${article.publishedDate ? '· ' + new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                · Score: <strong style="color: #2563eb;">${article.relevanceScore}/10</strong>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>`
}

export async function sendDigestEmail(articles: ScoredArticle[], date: string): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL
  const operatorEmail = process.env.OPERATOR_EMAIL
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.trim())
    ? process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/+$/, '')
    : 'https://www.legacyhometeamlpt.com'
  const adminSecret = process.env.ADMIN_SECRET

  if (!resendKey || !fromEmail || !operatorEmail) {
    throw new Error('Missing email configuration (RESEND_API_KEY, FROM_EMAIL, or OPERATOR_EMAIL)')
  }

  const pickerUrl = `${appUrl}/admin/blog-picker/${date}?secret=${adminSecret}`
  const dateFormatted = new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:Inter,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;border:1px solid #e0ddd8;">

        <!-- Header -->
        <tr>
          <td style="padding: 32px 32px 24px; border-bottom: 1px solid #e0ddd8;">
            <div style="font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #2563eb; margin-bottom: 8px;">Legacy Home Search · Daily Blog Digest</div>
            <div style="font-size: 22px; font-weight: 700; color: #1a1a1a;">${dateFormatted}</div>
            <div style="font-size: 14px; color: #888884; margin-top: 4px;">${articles.length} articles found · Pick 1–5 to publish</div>
          </td>
        </tr>

        <!-- Articles -->
        <tr>
          <td style="padding: 8px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${articles.map((a, i) => articleCard(a, i)).join('')}
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding: 32px;">
            <a href="${pickerUrl}" style="display:block;text-align:center;background:#2563eb;color:#ffffff;font-weight:700;font-size:15px;letter-spacing:0.05em;padding:16px 32px;border-radius:8px;text-decoration:none;">
              Pick Articles to Publish →
            </a>
            <div style="font-size: 11px; color: #888884; text-align: center; margin-top: 12px;">
              This link expires in 48 hours. Only you have access.
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding: 24px 32px; border-top: 1px solid #e0ddd8;">
            <div style="font-size: 11px; color: #888884; text-align: center;">
              Legacy Home Search · Automated Blog Pipeline
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  const resend = new Resend(resendKey)
  await resend.emails.send({
    from: fromEmail,
    to: operatorEmail,
    subject: `Virginia Beach Blog Digest — ${articles.length} articles ready to publish (${dateFormatted})`,
    html,
  })
}

// ─── Market Report Ready Email ────────────────────────────────────────────────

export async function sendMarketReportReadyEmail(
  communityName: string,
  reportPeriod: string,
  draftId: string
): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL
  const operatorEmail = process.env.OPERATOR_EMAIL
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.trim())
    ? process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/+$/, '')
    : 'https://www.legacyhometeamlpt.com'
  const adminSecret = process.env.ADMIN_SECRET

  if (!resendKey || !fromEmail || !operatorEmail) return

  const reviewUrl = `${appUrl}/admin/market-reports/review/${draftId}?secret=${adminSecret}`

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:Inter,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;border:1px solid #e0ddd8;">
        <tr>
          <td style="padding:32px 32px 24px;border-bottom:1px solid #e0ddd8;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#2563eb;margin-bottom:8px;">Legacy Home Search · Market Reports</div>
            <div style="font-size:22px;font-weight:700;color:#1a1a1a;">${communityName} — ${reportPeriod}</div>
            <div style="font-size:14px;color:#888884;margin-top:4px;">Your market report is ready to review and publish.</div>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px;">
            <p style="font-size:15px;color:#1a1a1a;margin:0 0 20px;">Claude has processed your Altos data and written a complete market report for <strong>${communityName}</strong> covering ${reportPeriod}. The report includes sections for buyers, sellers, and investors.</p>
            <p style="font-size:14px;color:#555550;margin:0 0 28px;">Review the draft, make any edits, and publish with one click. It will be live on the site within 60 seconds.</p>
            <a href="${reviewUrl}" style="display:block;text-align:center;background:#2563eb;color:#ffffff;font-weight:700;font-size:15px;padding:16px 32px;border-radius:8px;text-decoration:none;">Review &amp; Publish Report →</a>
            <div style="font-size:11px;color:#888884;text-align:center;margin-top:12px;">This link is private — only you have access.</div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #e0ddd8;">
            <div style="font-size:11px;color:#888884;text-align:center;">Legacy Home Search · Automated Market Reports</div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const resend = new Resend(resendKey)
  await resend.emails.send({
    from: fromEmail,
    to: operatorEmail,
    subject: `${communityName} Market Report Ready — ${reportPeriod}`,
    html,
  })
}

// ─── Monthly Altos Upload Reminder Email (sent to Barry on the 1st) ───────────

export async function sendAltosUploadReminderEmail(monthName: string, year: number): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL
  const barryEmail = process.env.BARRY_EMAIL ?? 'barry@yourfriendlyagent.net'
  if (!resendKey || !fromEmail) return

  const communities = [
    'Virginia Beach', 'Chesapeake', 'Norfolk', 'Suffolk', 'Hampton', 'Newport News',
  ]

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:Inter,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:12px;border:1px solid #e0ddd8;">

        <!-- Header -->
        <tr>
          <td style="padding:32px 32px 24px;border-bottom:1px solid #e0ddd8;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#2563eb;margin-bottom:8px;">Legacy Home Search · Market Reports</div>
            <div style="font-size:22px;font-weight:700;color:#1a1a1a;margin-bottom:4px;">Time to upload your ${monthName} market reports</div>
            <div style="font-size:14px;color:#888884;">Your monthly Altos Research PDFs are ready to download.</div>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">

            <p style="font-size:15px;color:#1a1a1a;margin:0 0 24px;line-height:1.7;">
              Hey Barry — it's the 1st of the month, which means it's time to grab this month's Altos reports and get them live on the site.
            </p>

            <!-- Step 1 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td style="width:32px;vertical-align:top;padding-top:1px;">
                  <div style="width:24px;height:24px;background:#2563eb;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;color:#fff;">1</div>
                </td>
                <td style="padding-left:14px;">
                  <div style="font-size:14px;font-weight:700;color:#1a1a1a;margin-bottom:4px;">Download the PDFs from Altos Research</div>
                  <div style="font-size:13px;color:#555550;line-height:1.6;margin-bottom:8px;">Log in, open each city's report, and save as PDF. Name each file with the city name so it uploads correctly.</div>
                  <a href="https://altos.re/" style="display:inline-block;background:#f0f4ff;color:#2563eb;font-size:13px;font-weight:600;padding:8px 16px;border-radius:6px;text-decoration:none;border:1px solid #bfdbfe;">
                    Open Altos Research →
                  </a>
                </td>
              </tr>
            </table>

            <!-- Communities list -->
            <div style="margin:16px 0 24px 46px;padding:16px;background:#f8f7f4;border-radius:8px;border:1px solid #e0ddd8;">
              <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#888884;margin-bottom:10px;">Download reports for these 6 cities</div>
              ${communities.map((c) => `<div style="font-size:14px;color:#1a1a1a;padding:4px 0;border-bottom:1px solid #ece9e3;">&#10003;&nbsp; ${c}</div>`).join('')}
            </div>

            <!-- Step 2 -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr>
                <td style="width:32px;vertical-align:top;padding-top:1px;">
                  <div style="width:24px;height:24px;background:#2563eb;border-radius:50%;text-align:center;line-height:24px;font-size:12px;font-weight:700;color:#fff;">2</div>
                </td>
                <td style="padding-left:14px;">
                  <div style="font-size:14px;font-weight:700;color:#1a1a1a;margin-bottom:4px;">Upload all 6 PDFs at once</div>
                  <div style="font-size:13px;color:#555550;line-height:1.6;margin-bottom:8px;">Drop all the files on the upload page at the same time. Claude reads each one and publishes the reports automatically — takes about 90 seconds per city.</div>
                  <div style="font-size:13px;color:#555550;margin-bottom:12px;">
                    Password: <strong style="color:#1a1a1a;background:#f0f4ff;padding:2px 8px;border-radius:4px;font-family:monospace;">4037</strong>
                  </div>
                  <a href="https://www.legacyhometeamlpt.com/upload" style="display:inline-block;background:#2563eb;color:#ffffff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:8px;text-decoration:none;">
                    Go to Upload Page →
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #e0ddd8;">
            <div style="font-size:11px;color:#aaa9a4;text-align:center;">
              Legacy Home Search · Automated monthly reminder · ${monthName} ${year}
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  const resend = new Resend(resendKey)
  await resend.emails.send({
    from: fromEmail,
    to: barryEmail,
    subject: `Upload your ${monthName} ${year} Altos market reports`,
    html,
  })
}

// ─── Content Refresh Digest Email ─────────────────────────────────────────────

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  'full-refresh':   { label: 'Full Refresh',   color: '#dc2626' },
  'light-refresh':  { label: 'Light Refresh',  color: '#d97706' },
  'review-only':    { label: 'Review Only',    color: '#2563eb' },
}

const TIER_COLORS: Record<string, string> = {
  'fast-changing': '#dc2626',
  'news-trend':    '#f59e0b',
  'competitive':   '#7c3aed',
  'money-page':    '#059669',
  'pillar':        '#2563eb',
  'seasonal':      '#0891b2',
  'evergreen':     '#16a34a',
}

function refreshCandidateRow(c: RefreshCandidate, index: number): string {
  const action = ACTION_LABELS[c.recommendedAction] ?? { label: c.recommendedAction, color: '#555' }
  const tierColor = TIER_COLORS[c.refreshTier] ?? '#555'
  const ageLabel = c.ageInDays >= 365
    ? `${Math.floor(c.ageInDays / 365)}y ${Math.floor((c.ageInDays % 365) / 30)}m old`
    : `${Math.floor(c.ageInDays / 30)}m old`
  const overdueLabel = c.isOverdue
    ? `${Math.abs(c.daysUntilDue)}d overdue`
    : `due in ${c.daysUntilDue}d`
  const topReason = c.refreshReasons[0] ?? ''

  return `
    <tr>
      <td style="padding: 14px 0; border-bottom: 1px solid #e5e3de;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width: 24px; vertical-align: top; padding-top: 2px;">
              <span style="color: #2563eb; font-size: 16px; font-weight: 700;">${index + 1}</span>
            </td>
            <td style="padding-left: 10px;">
              <div style="margin-bottom: 5px;">
                <span style="display:inline-block;background:${tierColor}22;color:${tierColor};font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:2px 7px;border-radius:3px;margin-right:6px;">${c.refreshTier}</span>
                <span style="display:inline-block;background:${action.color}22;color:${action.color};font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:2px 7px;border-radius:3px;">${action.label}</span>
              </div>
              <div style="font-size:14px;font-weight:600;color:#1a1a1a;line-height:1.4;margin-bottom:4px;">${c.title}</div>
              <div style="font-size:12px;color:#888884;">${ageLabel} · ${overdueLabel} · Score: <strong style="color:#2563eb;">${c.priorityScore}/100</strong></div>
              ${topReason ? `<div style="font-size:12px;color:#555550;margin-top:3px;">${topReason}</div>` : ''}
            </td>
          </tr>
        </table>
      </td>
    </tr>`
}

export async function sendRefreshDigest(
  candidates: RefreshCandidate[],
  queueUrl: string,
): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL
  const operatorEmail = process.env.OPERATOR_EMAIL
  if (!resendKey || !fromEmail || !operatorEmail) return

  const top10 = candidates.slice(0, 10)
  const fullCount = candidates.length
  const overdueCount = candidates.filter((c) => c.isOverdue).length
  const fullRefreshCount = candidates.filter((c) => c.recommendedAction === 'full-refresh').length

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:Inter,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;border:1px solid #e0ddd8;">

        <!-- Header -->
        <tr>
          <td style="padding:32px 32px 24px;border-bottom:1px solid #e0ddd8;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#2563eb;margin-bottom:8px;">Legacy Home Search · Content Refresh Queue</div>
            <div style="font-size:22px;font-weight:700;color:#1a1a1a;">${fullCount} post${fullCount === 1 ? '' : 's'} ready for review</div>
            <div style="font-size:14px;color:#888884;margin-top:4px;">${overdueCount} overdue · ${fullRefreshCount} need full refresh</div>
          </td>
        </tr>

        <!-- Candidates -->
        <tr>
          <td style="padding:8px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${top10.map((c, i) => refreshCandidateRow(c, i)).join('')}
            </table>
            ${fullCount > 10 ? `<p style="font-size:13px;color:#888884;text-align:center;margin:12px 0;">+ ${fullCount - 10} more in the queue</p>` : ''}
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:32px;">
            <a href="${queueUrl}" style="display:block;text-align:center;background:#2563eb;color:#ffffff;font-weight:700;font-size:15px;letter-spacing:0.05em;padding:16px 32px;border-radius:8px;text-decoration:none;">
              Review Refresh Queue →
            </a>
            <div style="font-size:11px;color:#888884;text-align:center;margin-top:12px;">
              Approve to rewrite with Claude · Skip to defer 30 days · Exclude to remove permanently
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 32px;border-top:1px solid #e0ddd8;">
            <div style="font-size:11px;color:#888884;text-align:center;">
              Legacy Home Search · Automated Content Refresh Pipeline
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  const resend = new Resend(resendKey)
  await resend.emails.send({
    from: fromEmail,
    to: operatorEmail,
    subject: `Content Refresh Queue — ${fullCount} post${fullCount === 1 ? '' : 's'} ready for review`,
    html,
  })
}

// ─── Market Report Safety-Net Reminder Email ──────────────────────────────────

export async function sendMarketReportMissingEmail(missingCities: string[]): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL
  const operatorEmail = process.env.OPERATOR_EMAIL
  if (!resendKey || !fromEmail || !operatorEmail) return

  const resend = new Resend(resendKey)
  await resend.emails.send({
    from: fromEmail,
    to: operatorEmail,
    subject: `Market reports missing for: ${missingCities.join(', ')}`,
    html: `<p style="font-family:Inter,sans-serif;font-size:15px;">No Altos market report email was received this month for: <strong>${missingCities.join(', ')}</strong>.</p><p style="font-family:Inter,sans-serif;font-size:14px;color:#555;">Check your Altos campaign settings to make sure the campaigns are set to deliver to your inbound address.</p>`,
  })
}

// ─── Fair Housing Alert Email ─────────────────────────────────────────────────

export async function sendFairHousingAlertEmail(opts: {
  postId: string
  postTitle: string
  vaQueueUrl: string
  result: FHCheckResult
}): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL
  const operatorEmail = process.env.OPERATOR_EMAIL
  if (!resendKey || !fromEmail || !operatorEmail) return

  const { postTitle, vaQueueUrl, result } = opts
  const violationRows = result.violations.map((v) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #fee2e2;vertical-align:top;">
        <div style="font-size:12px;font-weight:700;color:${v.severity === 'violation' ? '#dc2626' : '#d97706'};letter-spacing:0.06em;text-transform:uppercase;margin-bottom:4px;">${v.severity}</div>
        <div style="font-size:14px;color:#1a1a1a;background:#fef2f2;border-radius:6px;padding:8px 12px;margin-bottom:6px;font-style:italic;">"${v.excerpt}"</div>
        <div style="font-size:13px;color:#374151;margin-bottom:4px;"><strong>Why:</strong> ${v.reason}</div>
        <div style="font-size:13px;color:#059669;"><strong>Use instead:</strong> ${v.suggestion}</div>
      </td>
    </tr>
  `).join('')

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:Inter,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;border:2px solid #fca5a5;">

        <!-- Header -->
        <tr>
          <td style="padding:28px 32px 20px;border-bottom:1px solid #fca5a5;background:#fef2f2;border-radius:12px 12px 0 0;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#dc2626;margin-bottom:8px;">Fair Housing — Post Held</div>
            <div style="font-size:20px;font-weight:700;color:#1a1a1a;line-height:1.4;">${postTitle}</div>
            <div style="font-size:14px;color:#7f1d1d;margin-top:6px;">This post has been saved as a draft. It will not publish until you review and clear the hold.</div>
          </td>
        </tr>

        <!-- What was flagged -->
        <tr>
          <td style="padding:24px 32px 0;">
            <div style="font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#1a1a1a;margin-bottom:12px;">
              ${result.violations.length} issue${result.violations.length !== 1 ? 's' : ''} found
            </div>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${violationRows}
            </table>
          </td>
        </tr>

        <!-- What to do -->
        <tr>
          <td style="padding:20px 32px 0;">
            <div style="font-size:13px;color:#374151;line-height:1.7;background:#f8f7f4;border-radius:8px;padding:14px 16px;border-left:3px solid #dc2626;">
              <strong>Next steps:</strong> Open the VA Queue editor, edit the flagged text in Sanity Studio if needed, then click "Mark as Reviewed" to clear the hold and proceed with thumbnail, social copy, and publishing.
            </div>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:28px 32px;">
            <a href="${vaQueueUrl}" style="display:block;text-align:center;background:#dc2626;color:#ffffff;font-weight:700;font-size:15px;letter-spacing:0.05em;padding:16px 32px;border-radius:8px;text-decoration:none;">
              Review Post →
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #e0ddd8;">
            <div style="font-size:11px;color:#888884;text-align:center;">
              Legacy Home Search · Fair Housing Compliance · Automated Alert
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  const resend = new Resend(resendKey)
  await resend.emails.send({
    from: fromEmail,
    to: operatorEmail,
    subject: `Fair Housing Hold — "${postTitle}" needs review`,
    html,
  })
}

// ─── Bi-Weekly Performance Review Email ───────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function trendArrow(multiplier: number): string {
  if (multiplier >= 1.3) return '<span style="color:#059669;font-weight:700;">↑↑</span>'
  if (multiplier >= 1.1) return '<span style="color:#059669;font-weight:700;">↑</span>'
  if (multiplier <= 0.75) return '<span style="color:#dc2626;font-weight:700;">↓↓</span>'
  if (multiplier <= 0.9) return '<span style="color:#dc2626;font-weight:700;">↓</span>'
  return '<span style="color:#888884;">→</span>'
}

function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    'market-update': 'Market Update',
    'buying-tips': 'Buying Tips',
    'selling-tips': 'Selling Tips',
    'community-spotlight': 'Community Spotlight',
    'investment': 'Investment',
    'news': 'News',
    'cost-breakdown': 'Cost Breakdown',
    'flood-and-risk': 'Flood & Risk',
    'local-history': 'Local History',
    'local-interest': 'Local Interest',
  }
  return map[cat] ?? cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export async function sendPerformanceReviewEmail(data: PerformanceReviewData): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL
  const operatorEmail = process.env.OPERATOR_EMAIL
  if (!resendKey || !fromEmail || !operatorEmail) return

  const { periodStart, periodEnd, postsPublishedCount, estimatedReach, weights, youtubeViews, facebookReach, analyticsUrl } = data

  const focusLabels = weights.nextPeriodFocus.map(categoryLabel).join(', ') || 'no clear leaders yet'
  const deprioritized = weights.categoryBreakdown
    .filter((e) => e.weightMultiplier <= 0.85)
    .map((e) => categoryLabel(e.category))
    .slice(0, 2)

  const categoryRows = weights.categoryBreakdown
    .slice(0, 8)
    .map((e) => `
      <tr>
        <td style="padding:8px 12px;font-size:13px;color:#1a1a1a;border-bottom:1px solid #f0ede8;">${categoryLabel(e.category)}</td>
        <td style="padding:8px 12px;font-size:13px;color:#1a1a1a;border-bottom:1px solid #f0ede8;text-align:right;">${e.avgPageViews.toLocaleString()}</td>
        <td style="padding:8px 12px;font-size:13px;border-bottom:1px solid #f0ede8;text-align:right;">${trendArrow(e.weightMultiplier)} ${e.weightMultiplier.toFixed(1)}x</td>
        <td style="padding:8px 12px;font-size:12px;color:#888884;border-bottom:1px solid #f0ede8;text-align:right;">${e.postsAnalyzed} posts</td>
      </tr>
    `).join('')

  const topPostRows = weights.topPosts.slice(0, 3).map((p, i) => `
    <tr>
      <td style="padding:8px 0;width:24px;vertical-align:top;">
        <span style="color:#2563eb;font-size:16px;font-weight:700;">${i + 1}</span>
      </td>
      <td style="padding:8px 0 8px 10px;border-bottom:1px solid #f0ede8;">
        <div style="font-size:13px;font-weight:600;color:#1a1a1a;line-height:1.4;">${p.title}</div>
        <div style="font-size:11px;color:#888884;margin-top:2px;">${categoryLabel(p.category)} · ${p.pageViews.toLocaleString()} views</div>
      </td>
    </tr>
  `).join('')

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f8f7f4;font-family:Inter,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f7f4;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;border:1px solid #e0ddd8;">

        <!-- Header -->
        <tr>
          <td style="padding:32px 32px 24px;border-bottom:1px solid #e0ddd8;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#2563eb;margin-bottom:8px;">Legacy Home Search · Bi-Weekly Performance Review</div>
            <div style="font-size:22px;font-weight:700;color:#1a1a1a;">${formatDate(periodStart)} — ${formatDate(periodEnd)}</div>
            <div style="font-size:14px;color:#888884;margin-top:4px;">Here's what the content machine did, what worked, and what's changing.</div>
          </td>
        </tr>

        <!-- Summary stats row -->
        <tr>
          <td style="padding:24px 32px;border-bottom:1px solid #e0ddd8;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:33%;text-align:center;padding:0 8px;">
                  <div style="font-size:28px;font-weight:700;color:#1a1a1a;">${postsPublishedCount}</div>
                  <div style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#888884;margin-top:4px;">Posts Published</div>
                </td>
                <td style="width:33%;text-align:center;padding:0 8px;border-left:1px solid #e0ddd8;border-right:1px solid #e0ddd8;">
                  <div style="font-size:28px;font-weight:700;color:#1a1a1a;">${estimatedReach > 0 ? estimatedReach.toLocaleString() : '—'}</div>
                  <div style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#888884;margin-top:4px;">Est. Reach</div>
                </td>
                <td style="width:33%;text-align:center;padding:0 8px;">
                  <div style="font-size:28px;font-weight:700;color:#1a1a1a;">${youtubeViews > 0 ? youtubeViews.toLocaleString() : '—'}</div>
                  <div style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#888884;margin-top:4px;">YouTube Views</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Category performance table -->
        <tr>
          <td style="padding:24px 32px 0;">
            <div style="font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#1a1a1a;margin-bottom:12px;">Content Performance by Category</div>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e0ddd8;border-radius:8px;overflow:hidden;">
              <tr style="background:#f8f7f4;">
                <th style="padding:8px 12px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888884;text-align:left;">Category</th>
                <th style="padding:8px 12px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888884;text-align:right;">Avg Views</th>
                <th style="padding:8px 12px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888884;text-align:right;">vs Baseline</th>
                <th style="padding:8px 12px;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#888884;text-align:right;">Posts</th>
              </tr>
              ${categoryRows || '<tr><td colspan="4" style="padding:16px;font-size:13px;color:#888884;text-align:center;">Insufficient data for this period</td></tr>'}
            </table>
          </td>
        </tr>

        <!-- Top posts -->
        ${topPostRows ? `
        <tr>
          <td style="padding:24px 32px 0;">
            <div style="font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#1a1a1a;margin-bottom:12px;">Top Posts This Period</div>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${topPostRows}
            </table>
          </td>
        </tr>` : ''}

        <!-- AI Insights -->
        <tr>
          <td style="padding:24px 32px 0;">
            <div style="font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#1a1a1a;margin-bottom:10px;">Analysis</div>
            <div style="font-size:14px;color:#374151;line-height:1.7;background:#f8f7f4;border-radius:8px;padding:16px;border-left:3px solid #2563eb;">
              ${weights.insights}
            </div>
          </td>
        </tr>

        <!-- What changes next period -->
        <tr>
          <td style="padding:24px 32px 0;">
            <div style="font-size:13px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#1a1a1a;margin-bottom:10px;">What Changes Next Period</div>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:10px 14px;background:#f0fdf4;border-radius:6px;border:1px solid #bbf7d0;margin-bottom:8px;">
                  <span style="font-size:12px;font-weight:700;color:#059669;letter-spacing:0.06em;text-transform:uppercase;">Prioritizing more of</span><br>
                  <span style="font-size:14px;color:#1a1a1a;">${focusLabels}</span>
                </td>
              </tr>
              ${deprioritized.length > 0 ? `
              <tr>
                <td style="padding:10px 14px;background:#fef2f2;border-radius:6px;border:1px solid #fecaca;margin-top:8px;">
                  <span style="font-size:12px;font-weight:700;color:#dc2626;letter-spacing:0.06em;text-transform:uppercase;">Pulling back on</span><br>
                  <span style="font-size:14px;color:#1a1a1a;">${deprioritized.join(', ')}</span>
                </td>
              </tr>` : ''}
            </table>
            <div style="font-size:12px;color:#888884;margin-top:10px;">These weights are applied automatically to idea scoring. You can override them any time on the Idea Review page by approving or skipping ideas.</div>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:32px;">
            <a href="${analyticsUrl}" style="display:block;text-align:center;background:#2563eb;color:#ffffff;font-weight:700;font-size:15px;letter-spacing:0.05em;padding:16px 32px;border-radius:8px;text-decoration:none;">
              View Full Analytics Dashboard →
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 32px;border-top:1px solid #e0ddd8;">
            <div style="font-size:11px;color:#888884;text-align:center;">
              Legacy Home Search · Bi-Weekly Performance Review · Automated
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  const resend = new Resend(resendKey)
  await resend.emails.send({
    from: fromEmail,
    to: operatorEmail,
    subject: `Content Performance Review — ${formatDate(periodStart)} to ${formatDate(periodEnd)}`,
    html,
  })
}
