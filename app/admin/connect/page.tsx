'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUrlSecret } from '@/hooks/useUrlSecret'

// ─── Types ────────────────────────────────────────────────────────────────────

type PlatformStatus = {
  connected: boolean
  connectedAt?: string | null
  [key: string]: any
}

type AllStatus = {
  tiktok:    PlatformStatus & { username: string | null }
  youtube:   PlatformStatus & { channelId: string | null; channelName: string | null }
  facebook:  PlatformStatus & { pageId: string | null; pageName: string | null }
  instagram: PlatformStatus & { businessAccountId: string | null; username: string | null }
  linkedin:  PlatformStatus & { organizationId: string | null; orgName: string | null; tokenExpiring: boolean; tokenAgeDays: number | null }
  ga4:       PlatformStatus & { propertyId: string | null }
  gsc:       PlatformStatus & { siteUrl: string | null }
}

type TestResult = {
  success?: boolean
  error?: string
  detail?: string
  envVars?: { key: string; value: string }[]
  envVar?: { key: string; value: string }
  [key: string]: any
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(iso: string | null | undefined) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StatusDot({ connected, warning }: { connected: boolean; warning?: boolean }) {
  const color = warning ? '#f59e0b' : connected ? '#10b981' : '#e2e8f0'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600,
      color: warning ? '#92400e' : connected ? '#065f46' : '#94a3b8',
      background: warning ? '#fef3c7' : connected ? '#d1fae5' : '#f1f5f9',
      padding: '3px 9px', borderRadius: 99,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {warning ? 'Expiring soon' : connected ? 'Connected' : 'Not connected'}
    </span>
  )
}

function Steps({ steps }: { steps: string[] }) {
  return (
    <ol style={{ margin: '0 0 16px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {steps.map((step, i) => (
        <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{
            width: 22, height: 22, borderRadius: '50%', background: '#f1f5f9',
            border: '1.5px solid #e2e8f0', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#475569', marginTop: 1,
          }}>{i + 1}</span>
          <span style={{ fontSize: 13, color: '#334155', lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: step }} />
        </li>
      ))}
    </ol>
  )
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 12px', marginBottom: 16 }}>
      <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
      <span style={{ fontSize: 12, color: '#166534', lineHeight: 1.55 }}>{children}</span>
    </div>
  )
}

function ChatGPTTip({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }
  return (
    <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '12px 14px', marginTop: 18, marginBottom: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 15 }}>🔥</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#c2410c' }}>Hot tip — struggling to connect?</span>
        </div>
        <button
          onClick={copy}
          style={{
            padding: '4px 12px', borderRadius: 6, border: '1px solid #fdba74',
            background: copied ? '#16a34a' : '#fff', color: copied ? '#fff' : '#c2410c',
            fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          {copied ? '✓ Copied!' : 'Copy prompt'}
        </button>
      </div>
      <p style={{ fontSize: 12, color: '#7c2d12', margin: '0 0 8px', lineHeight: 1.5 }}>
        Copy this prompt and paste it into <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer" style={{ color: '#c2410c', fontWeight: 700 }}>ChatGPT</a> — it will walk you through every step interactively.
      </p>
      <div style={{
        background: '#fff', border: '1px solid #fed7aa', borderRadius: 7,
        padding: '10px 12px', fontSize: 12, color: '#431407',
        fontStyle: 'italic', lineHeight: 1.6, maxHeight: 80, overflow: 'hidden',
        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
      }}>
        {prompt}
      </div>
    </div>
  )
}

function Example({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#1e40af', wordBreak: 'break-all' }}>{value}</div>
    </div>
  )
}

function EnvVarBox({ vars }: { vars: { key: string; value: string }[] }) {
  return (
    <div style={{ marginTop: 14, background: '#0f172a', borderRadius: 8, padding: '12px 14px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
        Add to Vercel → Environment Variables
      </div>
      {vars.map(v => (
        <div key={v.key} style={{ display: 'flex', gap: 8, marginBottom: 6, fontFamily: 'monospace', fontSize: 12 }}>
          <span style={{ color: '#7dd3fc', flexShrink: 0 }}>{v.key}</span>
          <span style={{ color: '#475569' }}>=</span>
          <span style={{ color: '#e2e8f0', wordBreak: 'break-all', background: '#1e293b', borderRadius: 4, padding: '1px 6px', flex: 1 }}>{v.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Platform Card ────────────────────────────────────────────────────────────

function PlatformCard({
  icon, name, color, subtitle, status, children,
}: {
  icon: string; name: string; color: string; subtitle: string
  status: PlatformStatus & { tokenExpiring?: boolean }
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(!status.connected)

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${status.connected ? '#d1fae5' : status.tokenExpiring ? '#fcd34d' : '#e2e8f0'}`,
      borderRadius: 14, overflow: 'hidden',
    }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', cursor: 'pointer', borderBottom: open ? '1px solid #f1f5f9' : 'none' }}
      >
        <div style={{
          width: 42, height: 42, borderRadius: 10, background: color, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{subtitle}</div>
        </div>
        <StatusDot connected={status.connected} warning={status.tokenExpiring} />
        <span style={{ color: '#94a3b8', fontSize: 11, marginLeft: 8 }}>{open ? '▲' : '▼'}</span>
      </div>

      {open && (
        <div style={{ padding: '20px 22px' }}>
          {status.connected && status.connectedAt && !status.tokenExpiring && (
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14, padding: '8px 12px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0' }}>
              ✓ Connected and verified · Last tested {fmt(status.connectedAt)}
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ConnectPage() {
  const secret = useUrlSecret()

  const [status, setStatus]   = useState<AllStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const [tiktokUsername,  setTiktokUsername]  = useState('')
  const [youtubeChannelId, setYoutubeChannelId] = useState('')
  const [fbUserToken,     setFbUserToken]     = useState('')
  const [fbPageId,        setFbPageId]        = useState('')
  const [liToken,         setLiToken]         = useState('')
  const [liOrgId,         setLiOrgId]         = useState('')

  const [results, setResults] = useState<Record<string, TestResult | null>>({})
  const [testing, setTesting] = useState<Record<string, boolean>>({})
  const [errors,  setErrors]  = useState<Record<string, string>>({})

  const loadStatus = useCallback(() => {
    if (!secret) return
    setLoading(true)
    fetch(`/api/admin/connect/status?secret=${encodeURIComponent(secret)}`)
      .then(r => r.json()).then(setStatus).finally(() => setLoading(false))
  }, [secret])

  useEffect(() => { loadStatus() }, [loadStatus])

  async function testPlatform(platform: string, body: Record<string, string>) {
    setTesting(t => ({ ...t, [platform]: true }))
    setResults(r => ({ ...r, [platform]: null }))
    setErrors(e => ({ ...e, [platform]: '' }))
    try {
      const res  = await fetch(`/api/admin/connect/${platform}?secret=${encodeURIComponent(secret)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      const json = await res.json()
      if (json.error) {
        setErrors(e => ({ ...e, [platform]: json.error + (json.fix ? `\n\n✅ Fix: ${json.fix}` : '') + (json.detail ? `\n\n${json.detail}` : '') }))
      } else {
        setResults(r => ({ ...r, [platform]: json }))
        loadStatus()
      }
    } catch (e) {
      setErrors(p => ({ ...p, [platform]: String(e) }))
    } finally {
      setTesting(t => ({ ...t, [platform]: false }))
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 80, color: '#94a3b8' }}>Loading…</div>
  if (!status) return <div style={{ textAlign: 'center', padding: 80, color: '#dc2626' }}>Failed to load status</div>

  const connected = Object.values(status).filter(s => s.connected).length
  const total     = Object.keys(status).length

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '32px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>Platform Connections</h1>
        <div style={{ fontSize: 14, color: '#64748b' }}>
          Follow the steps for each platform. Click <strong>Test & Save</strong> when you have the info ready — the wizard will confirm it works.
        </div>
        <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 16px', fontSize: 13 }}>
          <span style={{ fontWeight: 700 }}>{connected} / {total}</span>
          <span style={{ color: '#64748b' }}>platforms connected</span>
          <div style={{ height: 4, width: 120, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(connected / total) * 100}%`, background: '#10b981', borderRadius: 99, transition: 'width 0.4s' }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* ── TikTok ── */}
        <PlatformCard icon="🎵" name="TikTok" color="#000" subtitle="Just need your TikTok username" status={status.tiktok}>
          {status.tiktok.connected
            ? <div style={{ fontSize: 13, color: '#065f46', marginBottom: 12 }}>✓ @{status.tiktok.username}</div>
            : <>
                <Steps steps={[
                  'Open <strong>TikTok</strong> on your phone (or go to <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" style="color:#2563eb">tiktok.com</a> on your computer)',
                  'Tap your <strong>profile picture</strong> in the bottom right corner',
                  'Your username is the name that starts with <strong>@</strong> — it\'s shown right below your profile photo',
                  'Type that name in the box below — <strong>do not include the @</strong>',
                ]} />
                <Example label="What to enter — example" value="legacyhometeam" />
                <Tip>Not sure of your username? Your TikTok profile URL looks like: tiktok.com/@<strong>legacyhometeam</strong> — the part after the @ is your username.</Tip>
                <ChatGPTTip prompt={`I need help finding my TikTok username so I can connect my TikTok account to a marketing dashboard. I'm not very tech-savvy, so please walk me through it step by step like I've never done this before.\n\nHere's what I need to do:\n1. Open TikTok on my phone\n2. Find my username (the @name on my profile)\n3. I need to copy just the username without the @ symbol\n\nCan you walk me through exactly where to find it on the app, with very simple instructions? If there are any common mistakes people make, please warn me about those too.`} />
              </>
          }
          {results.tiktok && <div style={{ fontSize: 13, color: '#065f46', background: '#d1fae5', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>✓ @{results.tiktok.username} — {(results.tiktok.followers ?? 0).toLocaleString()} followers<EnvVarBox vars={[results.tiktok.envVar!]} /></div>}
          {errors.tiktok && <ErrorBox msg={errors.tiktok} />}
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={tiktokUsername} onChange={e => setTiktokUsername(e.target.value)} placeholder="e.g. legacyhometeam" style={inputStyle} />
            <Btn onClick={() => testPlatform('tiktok', { username: tiktokUsername })} loading={testing.tiktok} disabled={!tiktokUsername} />
          </div>
        </PlatformCard>

        {/* ── YouTube ── */}
        <PlatformCard icon="▶️" name="YouTube" color="#ff0000" subtitle="Need your YouTube Channel ID" status={status.youtube}>
          {status.youtube.connected
            ? <div style={{ fontSize: 13, color: '#065f46', marginBottom: 12 }}>✓ {status.youtube.channelName}</div>
            : <>
                <Steps steps={[
                  'Go to <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style="color:#2563eb">youtube.com</a> and make sure you\'re signed in',
                  'Click your <strong>profile picture</strong> in the top-right corner of the page',
                  'Click <strong>"Your channel"</strong> from the menu that appears',
                  'Look at the <strong>address bar</strong> at the top of your browser — you\'ll see a web address',
                  'Copy <strong>everything after "channel/"</strong> — that long code starting with UC is your Channel ID',
                  'Paste it in the box below and click <strong>Test & Save</strong>',
                ]} />
                <Example label="What the address bar looks like" value="youtube.com/channel/UCaBcDeFgHiJkLmNoPqRsTuV" />
                <Example label="What to copy and paste" value="UCaBcDeFgHiJkLmNoPqRsTuV" />
                <Tip>Can't find it? You can also paste the full YouTube channel URL — the wizard will extract the ID for you automatically.</Tip>
                <ChatGPTTip prompt={`I need help finding my YouTube Channel ID so I can connect my YouTube account to a marketing analytics dashboard. I'm not very tech-savvy, so please explain this in very simple steps.\n\nHere's what I know:\n- My Channel ID starts with the letters "UC" followed by a long string of letters and numbers\n- It can be found in my YouTube channel's web address (URL)\n- It looks something like: youtube.com/channel/UCxxxxxxxxxxxxxxxxxx\n\nCan you walk me through exactly how to find my Channel ID on YouTube, step by step? Please tell me where to click, what to look for, and what to copy. Also let me know if there are any common places people get confused.`} />
              </>
          }
          {results.youtube && <div style={{ fontSize: 13, color: '#065f46', background: '#d1fae5', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>✓ {results.youtube.channelName} — {(results.youtube.subscribers ?? 0).toLocaleString()} subscribers<EnvVarBox vars={[results.youtube.envVar!]} /></div>}
          {errors.youtube && <ErrorBox msg={errors.youtube} />}
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={youtubeChannelId} onChange={e => setYoutubeChannelId(e.target.value)} placeholder="UCxxxxxxxxxxxxxxxxxxxxxxxxxx  or paste channel URL" style={inputStyle} />
            <Btn onClick={() => testPlatform('youtube', { channelId: youtubeChannelId })} loading={testing.youtube} disabled={!youtubeChannelId} />
          </div>
        </PlatformCard>

        {/* ── Facebook ── */}
        <PlatformCard icon="📘" name="Facebook" color="#1877f2" subtitle="Connects your Facebook Page for analytics" status={status.facebook}>
          {status.facebook.connected
            ? <div style={{ fontSize: 13, color: '#065f46', marginBottom: 12 }}>✓ {status.facebook.pageName} · Page ID: {status.facebook.pageId}</div>
            : <>
                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#1e40af', lineHeight: 1.6 }}>
                  <strong>Before you start:</strong> Make sure <code>FACEBOOK_APP_ID</code> and <code>FACEBOOK_APP_SECRET</code> are already set in Vercel. These come from your Meta developer app.
                </div>
                <p style={{ fontSize: 13, color: '#475569', margin: '0 0 12px', fontWeight: 600 }}>Step 1 — Get a temporary token from Facebook</p>
                <Steps steps={[
                  'Go to <a href="https://developers.facebook.com/tools/explorer" target="_blank" rel="noopener noreferrer" style="color:#2563eb">developers.facebook.com/tools/explorer</a>',
                  'In the top-right dropdown, select your <strong>Meta app</strong>',
                  'Click the blue <strong>"Generate Access Token"</strong> button',
                  'A pop-up will appear asking for permissions — check these three boxes: <strong>pages_show_list</strong>, <strong>pages_read_engagement</strong>, <strong>read_insights</strong>',
                  'Click <strong>Continue</strong> then <strong>Done</strong>',
                  'Copy the long code that appears in the "Access Token" box — paste it below',
                ]} />
                <p style={{ fontSize: 13, color: '#475569', margin: '0 0 12px', fontWeight: 600 }}>Step 2 — Find your Facebook Page ID</p>
                <Steps steps={[
                  'Go to your Facebook Page',
                  'Click <strong>About</strong> in the left sidebar',
                  'Scroll all the way to the bottom — you\'ll see <strong>"Page ID"</strong> followed by a long number',
                  'Copy that number and paste it in the second box below',
                ]} />
                <Tip>The wizard automatically converts the temporary token into a permanent one that never expires — you won't need to do this again.</Tip>
                <ChatGPTTip prompt={`I need help connecting my Facebook Page to a marketing analytics dashboard. There are two things I need to do, and I'm not very tech-savvy, so please walk me through each one step by step.\n\nTask 1 — Get a temporary access token from Facebook:\n- I need to go to developers.facebook.com/tools/explorer\n- Select my Meta app\n- Click "Generate Access Token"\n- Enable these three permissions: pages_show_list, pages_read_engagement, read_insights\n- Copy the token\n\nTask 2 — Find my Facebook Page ID:\n- It's a long number found in my Facebook Page's About section\n\nPlease walk me through both tasks with very simple, clear instructions. Tell me exactly what to click and where to look. Warn me about anything that commonly confuses people.`} />
              </>
          }
          {results.facebook && <div style={{ fontSize: 13, color: '#065f46', background: '#d1fae5', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>✓ Connected as: {results.facebook.pageName}<EnvVarBox vars={results.facebook.envVars!} /></div>}
          {errors.facebook && <ErrorBox msg={errors.facebook} />}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input value={fbUserToken} onChange={e => setFbUserToken(e.target.value)} placeholder="Paste the Access Token from Graph Explorer" style={inputStyle} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={fbPageId} onChange={e => setFbPageId(e.target.value)} placeholder="Facebook Page ID  (e.g. 1101893253009079)" style={inputStyle} />
              <Btn onClick={() => testPlatform('facebook', { userToken: fbUserToken, pageId: fbPageId })} loading={testing.facebook} disabled={!fbUserToken || !fbPageId} />
            </div>
          </div>
        </PlatformCard>

        {/* ── Instagram ── */}
        <PlatformCard icon="📸" name="Instagram" color="linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" subtitle="Automatically found from your Facebook connection" status={status.instagram}>
          {status.instagram.connected
            ? <div style={{ fontSize: 13, color: '#065f46', marginBottom: 12 }}>✓ @{status.instagram.username}</div>
            : <>
                {!status.facebook.connected
                  ? <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: '#92400e' }}>
                      ⚠️ <strong>Connect Facebook first</strong> — Instagram is discovered automatically from your Facebook Page. Scroll up and complete the Facebook step, then come back here.
                    </div>
                  : <>
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: '#166534' }}>
                        ✓ Facebook is connected. Click the button below — the wizard will automatically find your Instagram account. No extra login needed.
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', margin: '0 0 12px' }}>If this doesn't work — your Instagram needs to be linked to your Facebook Page first:</p>
                      <Steps steps={[
                        'On your Facebook Page, click <strong>Settings</strong> (gear icon or top-right menu)',
                        'Look for <strong>"Linked Accounts"</strong> or <strong>"Instagram"</strong> in the left sidebar',
                        'Click <strong>"Connect account"</strong> and sign in with your Instagram',
                        'Make sure your Instagram is set to a <strong>Professional account</strong> (Business or Creator — not Personal)',
                        'Come back here and click the button below',
                      ]} />
                      <Tip>Not sure if your Instagram is Professional? Open Instagram → Profile → Settings → Account → you'll see "Switch to Professional Account" if it's still personal.</Tip>
                      <ChatGPTTip prompt={`I need help linking my Instagram account to my Facebook Page so I can connect it to a marketing dashboard. I'm getting an error that says "No Instagram Business Account linked to this Facebook Page." I'm not very tech-savvy, so please explain this simply.\n\nHere's what needs to happen:\n1. My Instagram account needs to be a Professional account (Business or Creator — not Personal)\n2. My Instagram account needs to be linked to my Facebook Page\n\nCan you walk me through how to:\n- Check if my Instagram is a Professional account, and how to switch it if it isn't\n- Link my Instagram account to my Facebook Page (either through Facebook Page Settings, Meta Business Suite, or the Instagram app)\n\nPlease give me step-by-step instructions for each part, as if I've never done this before.`} />
                    </>
                }
              </>
          }
          {results.instagram && <div style={{ fontSize: 13, color: '#065f46', background: '#d1fae5', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>✓ @{results.instagram.username} — {(results.instagram.followers ?? 0).toLocaleString()} followers<EnvVarBox vars={results.instagram.envVars!} /></div>}
          {errors.instagram && <ErrorBox msg={errors.instagram} />}
          <button
            onClick={() => testPlatform('instagram', { pageId: status.facebook.pageId ?? '' })}
            disabled={!status.facebook.connected || testing.instagram}
            style={{ ...btnStyle(!status.facebook.connected || testing.instagram), width: '100%', justifyContent: 'center' }}
          >
            {testing.instagram ? 'Finding your Instagram…' : '🔗 Auto-connect Instagram from Facebook'}
          </button>
        </PlatformCard>

        {/* ── LinkedIn ── */}
        <PlatformCard icon="💼" name="LinkedIn" color="#0a66c2" subtitle="Connects your LinkedIn company page" status={status.linkedin}>
          {status.linkedin.connected && !status.linkedin.tokenExpiring && (
            <div style={{ fontSize: 13, color: '#065f46', marginBottom: 12 }}>✓ {status.linkedin.orgName}</div>
          )}
          {status.linkedin.tokenExpiring && (
            <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#92400e' }}>
              ⚠️ Your LinkedIn token is {Math.round(status.linkedin.tokenAgeDays ?? 0)} days old and expires at 60 days. Follow the steps below to generate a new one and paste it in.
            </div>
          )}
          {!status.linkedin.connected && (
            <>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#1e40af', lineHeight: 1.5 }}>
                <strong>Note:</strong> LinkedIn requires a developer account. This takes about 5 minutes the first time. The token needs to be refreshed every 60 days.
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', margin: '0 0 12px' }}>Step 1 — Create a LinkedIn app</p>
              <Steps steps={[
                'Go to <a href="https://developers.linkedin.com" target="_blank" rel="noopener noreferrer" style="color:#2563eb">developers.linkedin.com</a> and sign in',
                'Click <strong>"Create App"</strong> in the top right',
                'Fill in App Name (e.g. "Legacy Home Analytics"), your company page, and a logo',
                'Click <strong>"Create App"</strong>',
              ]} />
              <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', margin: '0 0 12px' }}>Step 2 — Enable analytics access</p>
              <Steps steps={[
                'Inside your new app, click the <strong>"Products"</strong> tab',
                'Find <strong>"Marketing Developer Platform"</strong> and click <strong>"Request access"</strong>',
                'It usually approves instantly for business accounts',
              ]} />
              <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', margin: '0 0 12px' }}>Step 3 — Get your access token</p>
              <Steps steps={[
                'Click the <strong>"Auth"</strong> tab in your app',
                'Scroll down to <strong>"OAuth 2.0 Tools"</strong> and click it',
                'Under "Select scopes", check <strong>r_organization_social</strong>',
                'Click <strong>"Request access token"</strong> — copy the token that appears',
              ]} />
              <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', margin: '0 0 12px' }}>Step 4 — Find your Organization ID</p>
              <Steps steps={[
                'Go to your LinkedIn company page',
                'Look at the web address — it will show something like: <strong>linkedin.com/company/12345678</strong>',
                'The number at the end is your Organization ID',
              ]} />
              <Example label="What the address looks like" value="linkedin.com/company/98765432" />
              <Example label="What to copy (Organization ID)" value="98765432" />
              <ChatGPTTip prompt={`I need help connecting my LinkedIn company page to a marketing analytics dashboard. I need to do four things and I'm not very tech-savvy, so please walk me through each step very simply.\n\nHere's what I need to do:\n1. Go to developers.linkedin.com and create a LinkedIn developer app\n2. Add the "Marketing Developer Platform" product to my app (so I can access analytics)\n3. Generate an OAuth access token with the "r_organization_social" permission\n4. Find my LinkedIn Organization ID (the number in my company page URL)\n\nPlease walk me through all four steps as if I've never done anything like this before. Tell me exactly what to click, what to fill in, and what to copy. Also let me know that the token expires every 60 days and I'll need to repeat step 3 at that point.`} />
            </>
          )}
          {results.linkedin && <div style={{ fontSize: 13, color: '#065f46', background: '#d1fae5', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>✓ {results.linkedin.orgName} — {(results.linkedin.followers ?? 0).toLocaleString()} followers<EnvVarBox vars={results.linkedin.envVars!} /><div style={{ marginTop: 8, fontSize: 11, color: '#dc2626', fontWeight: 600 }}>⚠️ Set a reminder to refresh this token in 50 days.</div></div>}
          {errors.linkedin && <ErrorBox msg={errors.linkedin} />}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input value={liToken} onChange={e => setLiToken(e.target.value)} placeholder="Paste your LinkedIn Access Token" style={inputStyle} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={liOrgId} onChange={e => setLiOrgId(e.target.value)} placeholder="Organization ID  (e.g. 98765432)" style={inputStyle} />
              <Btn onClick={() => testPlatform('linkedin', { accessToken: liToken, organizationId: liOrgId })} loading={testing.linkedin} disabled={!liToken || !liOrgId} />
            </div>
          </div>
        </PlatformCard>

        {/* ── Google Analytics 4 ── */}
        <PlatformCard icon="📊" name="Google Analytics 4" color="#e37400" subtitle="Shows website traffic, top pages, and content performance" status={status.ga4}>
          {status.ga4.connected
            ? <div style={{ fontSize: 13, color: '#065f46', marginBottom: 12 }}>✓ Property ID: {status.ga4.propertyId} · Connected {fmt(status.ga4.connectedAt)}</div>
            : <>
                <Steps steps={[
                  'Go to <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" style="color:#2563eb">analytics.google.com</a> and open the client\'s property',
                  'Click <strong>Admin</strong> (gear icon, bottom left) → <strong>Property Settings</strong> → copy the <strong>Property ID</strong> (a number like 398765432)',
                  'Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" style="color:#2563eb">console.cloud.google.com</a> → create or select a project',
                  'Search for <strong>"Google Analytics Data API"</strong> and enable it',
                  'Go to <strong>IAM & Admin → Service Accounts → Create Service Account</strong> — name it "analytics-reader"',
                  'Once created, click it → <strong>Keys → Add Key → JSON</strong> — this downloads a file',
                  'Back in GA4: Admin → <strong>Property Access Management → Add user</strong> — paste the service account email (from the JSON file, it ends in .iam.gserviceaccount.com) → give it <strong>Viewer</strong> role',
                  'Open the downloaded JSON file in a text editor, copy everything, and paste it as one line into the <code>GA4_SERVICE_ACCOUNT_JSON</code> env var in Vercel',
                ]} />
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
                  <strong>Env vars to set in Vercel:</strong>
                  <div style={{ fontFamily: 'monospace', marginTop: 6, color: '#1e40af' }}>GA4_PROPERTY_ID=398765432</div>
                  <div style={{ fontFamily: 'monospace', color: '#1e40af' }}>GA4_SERVICE_ACCOUNT_JSON={'{"type":"service_account",...}'}</div>
                  <div style={{ fontFamily: 'monospace', color: '#1e40af' }}>NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX</div>
                </div>
                <ChatGPTTip prompt={`I need help connecting Google Analytics 4 to a marketing dashboard. I need to create a Service Account and give it access to my GA4 property. I'm not very tech-savvy so please walk me through everything step by step.\n\nHere's what I need to do:\n1. Find my GA4 Property ID (a number found in GA4 → Admin → Property Settings)\n2. Go to Google Cloud Console and enable the "Google Analytics Data API"\n3. Create a Service Account called "analytics-reader"\n4. Download the JSON credentials file for that service account\n5. Add the service account email as a Viewer on my GA4 property\n6. Minify the JSON file contents to one line so I can paste it into an environment variable\n\nPlease walk me through every single step with clear, simple instructions. I'll be working in both Google Analytics (analytics.google.com) and Google Cloud Console (console.cloud.google.com).`} />
              </>
          }
        </PlatformCard>

        {/* ── Google Search Console ── */}
        <PlatformCard icon="🔍" name="Google Search Console" color="#4285f4" subtitle="Shows which Google searches are bringing people to your site" status={status.gsc}>
          {status.gsc.connected
            ? <div style={{ fontSize: 13, color: '#065f46', marginBottom: 12 }}>✓ {status.gsc.siteUrl} · Connected {fmt(status.gsc.connectedAt)}</div>
            : <>
                <Steps steps={[
                  'Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" style="color:#2563eb">console.cloud.google.com</a> → select your project',
                  'Search for <strong>"Google Search Console API"</strong> and enable it',
                  'Go to <strong>APIs & Services → Credentials → Create Credentials → OAuth Client ID</strong>',
                  'Choose <strong>"Web Application"</strong> — under Authorized redirect URIs, add: <code>https://developers.google.com/oauthplayground</code>',
                  'Copy the <strong>Client ID</strong> and <strong>Client Secret</strong>',
                  'Go to <a href="https://developers.google.com/oauthplayground" target="_blank" rel="noopener noreferrer" style="color:#2563eb">OAuth 2.0 Playground</a> → click the gear icon → check "Use your own OAuth credentials" → paste your Client ID and Secret',
                  'In the left panel, find <strong>"Search Console API v3"</strong> → select <code>https://www.googleapis.com/auth/webmasters.readonly</code> → click <strong>Authorize APIs</strong>',
                  'Click <strong>Exchange authorization code for tokens</strong> → copy the <strong>Refresh Token</strong>',
                ]} />
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
                  <strong>Env vars to set in Vercel:</strong>
                  <div style={{ fontFamily: 'monospace', marginTop: 6, color: '#1e40af' }}>GSC_CLIENT_ID=000000000.apps.googleusercontent.com</div>
                  <div style={{ fontFamily: 'monospace', color: '#1e40af' }}>GSC_CLIENT_SECRET=GOCSPX-xxxxx</div>
                  <div style={{ fontFamily: 'monospace', color: '#1e40af' }}>GSC_REFRESH_TOKEN=1//0xxxx</div>
                  <div style={{ fontFamily: 'monospace', color: '#1e40af' }}>GSC_SITE_URL=sc-domain:legacyhometeamlpt.com</div>
                </div>
                <ChatGPTTip prompt={`I need help connecting Google Search Console to a marketing dashboard using OAuth credentials. I'm not very tech-savvy so please walk me through every step simply and clearly.\n\nHere's what I need to do:\n1. Go to Google Cloud Console and enable the "Google Search Console API"\n2. Create OAuth 2.0 credentials (type: Web Application) and add this redirect URI: https://developers.google.com/oauthplayground\n3. Copy the Client ID and Client Secret\n4. Go to the OAuth 2.0 Playground (developers.google.com/oauthplayground), use my own credentials, select the Search Console readonly scope, and get a Refresh Token\n5. Note my site URL in the format: sc-domain:mywebsite.com\n\nPlease walk me through every single step — what to click, what to fill in, what to copy. Treat me like someone who has never done anything like this before.`} />
              </>
          }
        </PlatformCard>

      </div>

      <div style={{ marginTop: 28, fontSize: 12, color: '#94a3b8', textAlign: 'center', lineHeight: 1.6 }}>
        X / Twitter and Threads publish via Blotato but have no analytics API.
        Use <a href="https://analytics.twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>Twitter Analytics</a> and Meta Business Suite for those platforms.
      </div>

    </div>
  )
}

// ─── Shared components ────────────────────────────────────────────────────────

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div style={{ fontSize: 12, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 12, whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>
      {msg}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  flex: 1, padding: '10px 12px', fontSize: 13,
  border: '1px solid #e2e8f0', borderRadius: 8,
  fontFamily: 'inherit', outline: 'none', background: '#fafafa',
}

const btnStyle = (disabled: boolean): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '10px 18px', borderRadius: 8, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
  background: disabled ? '#e2e8f0' : '#1a1a1a', color: disabled ? '#94a3b8' : '#fff',
  fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
})

function Btn({ onClick, loading, disabled }: { onClick: () => void; loading?: boolean; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled || loading} style={btnStyle(!!(disabled || loading))}>
      {loading ? 'Testing…' : 'Test & Save'}
    </button>
  )
}
