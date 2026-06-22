import { NextResponse } from 'next/server'
import { runFedRateUpdate } from '@/lib/fed-research'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Vercel cron: GET with Bearer CRON_SECRET
// Scheduled to fire 90 min after each FOMC press release (see vercel.json)
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return runFedJob()
}

// Manual trigger: POST with ?secret=ADMIN_SECRET
// Optional body: { overrideDate: 'YYYY-MM-DD' } — re-run on a different date
// (e.g. if the Fed reschedules or you want to test against a meeting in
// FOMC_MEETINGS without waiting for that day)
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const body = await request.json().catch(() => ({}))
  const overrideDate = typeof body.overrideDate === 'string' ? body.overrideDate : undefined
  return runFedJob(overrideDate)
}

async function runFedJob(overrideDate?: string) {
  try {
    const result = await runFedRateUpdate(overrideDate)

    if (result.postCreated && result.postTitle) {
      await sendNotificationEmail(result.meetingLabel, result.postTitle)
    }

    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    console.error('[fed-rate-update] Error:', err instanceof Error ? err.message : err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    )
  }
}

async function sendNotificationEmail(meetingLabel: string, title: string) {
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.FROM_EMAIL
  const operatorEmail = process.env.OPERATOR_EMAIL
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.trim())
    ? process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/+$/, '')
    : 'https://www.legacyhometeamlpt.com'
  const secret = process.env.ADMIN_SECRET

  if (!resendKey || !fromEmail || !operatorEmail) return

  const resend = new Resend(resendKey)
  const queueUrl = `${appUrl}/admin/va-queue?secret=${secret}`

  await resend.emails.send({
    from: fromEmail,
    to: operatorEmail,
    subject: `Fed rate decision post ready — ${meetingLabel}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;background:#fff;">
        <div style="background:#1E3A5F;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:18px;color:#fff;font-weight:600;">📊 Fed Rate Post Ready — ${meetingLabel}</h1>
        </div>
        <div style="background:#f8f7f4;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e5e3de;border-top:none;">
          <p style="font-size:15px;color:#333;margin:0 0 12px;">
            The same-day Federal Reserve rate decision post for <strong>${meetingLabel}</strong> is in the VA queue, waiting for a thumbnail and video.
          </p>
          <p style="font-size:14px;color:#1a1a1a;margin:0 0 20px;padding:12px 16px;background:#fff;border-left:3px solid #2563eb;border-radius:4px;">
            <strong>${title}</strong>
          </p>
          <a href="${queueUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:600;">Open VA Queue →</a>
        </div>
      </div>`,
  })
}
