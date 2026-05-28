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
  const label = warning ? 'Expiring soon' : connected ? 'Connected' : 'Not connected'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600, color: warning ? '#92400e' : connected ? '#065f46' : '#94a3b8',
      background: warning ? '#fef3c7' : connected ? '#d1fae5' : '#f1f5f9',
      padding: '3px 9px', borderRadius: 99,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {label}
    </span>
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
          <span style={{
            color: '#e2e8f0', wordBreak: 'break-all',
            background: '#1e293b', borderRadius: 4, padding: '1px 6px', flex: 1,
          }}>{v.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Platform Cards ───────────────────────────────────────────────────────────

function PlatformCard({
  icon, name, color, subtitle, status, children,
}: {
  icon: string; name: string; color: string; subtitle: string
  status: PlatformStatus & { tokenExpiring?: boolean }
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{
      background: '#fff', border: `1px solid ${status.connected ? '#d1fae5' : '#e2e8f0'}`,
      borderRadius: 14, overflow: 'hidden',
    }}>
      {/* Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '16px 20px', cursor: 'pointer',
          borderBottom: open ? '1px solid #f1f5f9' : 'none',
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 10, background: color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{name}</div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{subtitle}</div>
        </div>
        <StatusDot connected={status.connected} warning={status.tokenExpiring} />
        <span style={{ color: '#94a3b8', fontSize: 12, marginLeft: 8 }}>{open ? '▲' : '▼'}</span>
      </div>

      {/* Body */}
      {open && (
        <div style={{ padding: '18px 20px' }}>
          {status.connected && status.connectedAt && (
            <div style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
              ✓ Last verified {fmt(status.connectedAt)}
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

  // Form state
  const [tiktokUsername, setTiktokUsername] = useState('')
  const [youtubeChannelId, setYoutubeChannelId] = useState('')
  const [fbUserToken, setFbUserToken]   = useState('')
  const [fbPageId, setFbPageId]         = useState('')
  const [liToken, setLiToken]           = useState('')
  const [liOrgId, setLiOrgId]           = useState('')

  // Result state per platform
  const [results, setResults]   = useState<Record<string, TestResult | null>>({})
  const [testing, setTesting]   = useState<Record<string, boolean>>({})
  const [errors, setErrors]     = useState<Record<string, string>>({})

  const loadStatus = useCallback(() => {
    if (!secret) return
    setLoading(true)
    fetch(`/api/admin/connect/status?secret=${encodeURIComponent(secret)}`)
      .then(r => r.json())
      .then(setStatus)
      .finally(() => setLoading(false))
  }, [secret])

  useEffect(() => { loadStatus() }, [loadStatus])

  async function testPlatform(platform: string, body: Record<string, string>) {
    setTesting(t => ({ ...t, [platform]: true }))
    setResults(r => ({ ...r, [platform]: null }))
    setErrors(e => ({ ...e, [platform]: '' }))
    try {
      const res  = await fetch(`/api/admin/connect/${platform}?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (json.error) {
        setErrors(e => ({ ...e, [platform]: json.error + (json.detail ? `\n\n${json.detail}` : '') }))
      } else {
        setResults(r => ({ ...r, [platform]: json }))
        loadStatus()
      }
    } catch (e) {
      setErrors(prev => ({ ...prev, [platform]: String(e) }))
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
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          Platform Connections
        </h1>
        <div style={{ fontSize: 14, color: '#64748b' }}>
          Test credentials and save connection metadata. Add env vars to Vercel after each successful test.
        </div>
        <div style={{
          marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 10,
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
          padding: '8px 16px', fontSize: 13,
        }}>
          <span style={{ fontWeight: 700 }}>{connected} / {total}</span>
          <span style={{ color: '#64748b' }}>platforms configured</span>
          <div style={{ height: 4, width: 120, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(connected / total) * 100}%`, background: '#10b981', borderRadius: 99 }} />
          </div>
        </div>
      </div>

      {/* Platform cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* TikTok */}
        <PlatformCard icon="🎵" name="TikTok" color="#000" subtitle="Public scraper — just paste a username" status={status.tiktok}>
          {status.tiktok.connected && (
            <div style={{ fontSize: 13, color: '#065f46', marginBottom: 12 }}>
              @{status.tiktok.username}
            </div>
          )}
          {results.tiktok && (
            <div style={{ fontSize: 13, color: '#065f46', background: '#d1fae5', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
              ✓ @{results.tiktok.username} — {(results.tiktok.followers ?? 0).toLocaleString()} followers
              <EnvVarBox vars={[results.tiktok.envVar!]} />
            </div>
          )}
          {errors.tiktok && <div style={{ fontSize: 12, color: '#dc2626', background: '#fef2f2', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>{errors.tiktok}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={tiktokUsername}
              onChange={e => setTiktokUsername(e.target.value)}
              placeholder="@legacyhometeam"
              style={inputStyle}
            />
            <button
              onClick={() => testPlatform('tiktok', { username: tiktokUsername })}
              disabled={!tiktokUsername || testing.tiktok}
              style={btnStyle(testing.tiktok)}
            >
              {testing.tiktok ? 'Testing…' : 'Test & Save'}
            </button>
          </div>
        </PlatformCard>

        {/* YouTube */}
        <PlatformCard icon="▶️" name="YouTube" color="#ff0000" subtitle="Paste channel ID or youtube.com/channel/... URL" status={status.youtube}>
          {status.youtube.connected && (
            <div style={{ fontSize: 13, color: '#065f46', marginBottom: 12 }}>
              {status.youtube.channelName} · {status.youtube.channelId}
            </div>
          )}
          {results.youtube && (
            <div style={{ fontSize: 13, color: '#065f46', background: '#d1fae5', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
              ✓ {results.youtube.channelName} — {(results.youtube.subscribers ?? 0).toLocaleString()} subscribers
              <EnvVarBox vars={[results.youtube.envVar!]} />
            </div>
          )}
          {errors.youtube && <div style={{ fontSize: 12, color: '#dc2626', background: '#fef2f2', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>{errors.youtube}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={youtubeChannelId}
              onChange={e => setYoutubeChannelId(e.target.value)}
              placeholder="UCxxxxxxxxxxxxxxxxxxxxxxxxxx"
              style={inputStyle}
            />
            <button
              onClick={() => testPlatform('youtube', { channelId: youtubeChannelId })}
              disabled={!youtubeChannelId || testing.youtube}
              style={btnStyle(testing.youtube)}
            >
              {testing.youtube ? 'Testing…' : 'Test & Save'}
            </button>
          </div>
        </PlatformCard>

        {/* Facebook */}
        <PlatformCard icon="📘" name="Facebook" color="#1877f2" subtitle="Short-lived token → wizard exchanges to never-expiring page token" status={status.facebook}>
          {status.facebook.connected && (
            <div style={{ fontSize: 13, color: '#065f46', marginBottom: 12 }}>
              {status.facebook.pageName} · Page ID: {status.facebook.pageId}
            </div>
          )}
          {results.facebook && (
            <div style={{ fontSize: 13, color: '#065f46', background: '#d1fae5', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
              ✓ Connected as: {results.facebook.pageName}
              <EnvVarBox vars={results.facebook.envVars!} />
            </div>
          )}
          {errors.facebook && <div style={{ fontSize: 12, color: '#dc2626', background: '#fef2f2', borderRadius: 8, padding: '10px 14px', marginBottom: 12, whiteSpace: 'pre-wrap' }}>{errors.facebook}</div>}
          <div style={{ fontSize: 12, color: '#475569', background: '#f8fafc', borderRadius: 8, padding: '10px 14px', marginBottom: 12, lineHeight: 1.6 }}>
            <strong>How to get the short-lived token:</strong><br />
            1. Go to <a href="https://developers.facebook.com/tools/explorer" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>developers.facebook.com/tools/explorer</a><br />
            2. Select your app → click "Generate Access Token"<br />
            3. Grant: <code>pages_show_list, pages_read_engagement, read_insights</code><br />
            4. Copy the token and your Page ID (from your Facebook Page URL)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input value={fbUserToken} onChange={e => setFbUserToken(e.target.value)} placeholder="Short-lived User Access Token" style={inputStyle} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={fbPageId} onChange={e => setFbPageId(e.target.value)} placeholder="Facebook Page ID (e.g. 1101893253009079)" style={inputStyle} />
              <button
                onClick={() => testPlatform('facebook', { userToken: fbUserToken, pageId: fbPageId })}
                disabled={!fbUserToken || !fbPageId || testing.facebook}
                style={btnStyle(testing.facebook)}
              >
                {testing.facebook ? 'Testing…' : 'Test & Save'}
              </button>
            </div>
          </div>
        </PlatformCard>

        {/* Instagram */}
        <PlatformCard
          icon="📸"
          name="Instagram"
          color="linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)"
          subtitle="Auto-discovered from Facebook — connect Facebook first"
          status={status.instagram}
        >
          {status.instagram.connected && (
            <div style={{ fontSize: 13, color: '#065f46', marginBottom: 12 }}>
              @{status.instagram.username} · ID: {status.instagram.businessAccountId}
            </div>
          )}
          {results.instagram && (
            <div style={{ fontSize: 13, color: '#065f46', background: '#d1fae5', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
              ✓ @{results.instagram.username} — {(results.instagram.followers ?? 0).toLocaleString()} followers
              <EnvVarBox vars={results.instagram.envVars!} />
            </div>
          )}
          {errors.instagram && <div style={{ fontSize: 12, color: '#dc2626', background: '#fef2f2', borderRadius: 8, padding: '10px 14px', marginBottom: 12, whiteSpace: 'pre-wrap' }}>{errors.instagram}</div>}
          {!status.facebook.connected && (
            <div style={{ fontSize: 12, color: '#92400e', background: '#fef3c7', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
              Connect Facebook first — Instagram is discovered from your Facebook Page token.
            </div>
          )}
          <button
            onClick={() => testPlatform('instagram', { pageId: status.facebook.pageId ?? '' })}
            disabled={!status.facebook.connected || testing.instagram}
            style={btnStyle(testing.instagram || !status.facebook.connected)}
          >
            {testing.instagram ? 'Discovering…' : 'Auto-connect from Facebook'}
          </button>
        </PlatformCard>

        {/* LinkedIn */}
        <PlatformCard icon="💼" name="LinkedIn" color="#0a66c2" subtitle="OAuth token required — expires every 60 days" status={status.linkedin}>
          {status.linkedin.connected && !status.linkedin.tokenExpiring && (
            <div style={{ fontSize: 13, color: '#065f46', marginBottom: 12 }}>
              {status.linkedin.orgName} · Org ID: {status.linkedin.organizationId}
            </div>
          )}
          {status.linkedin.tokenExpiring && (
            <div style={{ fontSize: 12, color: '#92400e', background: '#fef3c7', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
              ⚠️ LinkedIn token is {Math.round(status.linkedin.tokenAgeDays ?? 0)} days old (expires at 60). Generate a new token and paste it below.
            </div>
          )}
          {results.linkedin && (
            <div style={{ fontSize: 13, color: '#065f46', background: '#d1fae5', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
              ✓ {results.linkedin.orgName} — {(results.linkedin.followers ?? 0).toLocaleString()} followers
              <EnvVarBox vars={results.linkedin.envVars!} />
              <div style={{ marginTop: 10, fontSize: 11, color: '#dc2626' }}>⚠️ {results.linkedin.warning}</div>
            </div>
          )}
          {errors.linkedin && <div style={{ fontSize: 12, color: '#dc2626', background: '#fef2f2', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>{errors.linkedin}</div>}
          <div style={{ fontSize: 12, color: '#475569', background: '#f8fafc', borderRadius: 8, padding: '10px 14px', marginBottom: 12, lineHeight: 1.6 }}>
            <strong>How to get a LinkedIn token:</strong><br />
            1. Go to <a href="https://developers.linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>developers.linkedin.com</a> → Create App<br />
            2. Add product: <strong>Marketing Developer Platform</strong><br />
            3. Under Auth → OAuth 2.0 → generate token with <code>r_organization_social</code> scope<br />
            4. Your Org ID is the number in your LinkedIn company page URL
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input value={liToken} onChange={e => setLiToken(e.target.value)} placeholder="LinkedIn OAuth Access Token" style={inputStyle} />
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={liOrgId} onChange={e => setLiOrgId(e.target.value)} placeholder="Organization ID (e.g. 12345678)" style={inputStyle} />
              <button
                onClick={() => testPlatform('linkedin', { accessToken: liToken, organizationId: liOrgId })}
                disabled={!liToken || !liOrgId || testing.linkedin}
                style={btnStyle(testing.linkedin)}
              >
                {testing.linkedin ? 'Testing…' : 'Test & Save'}
              </button>
            </div>
          </div>
        </PlatformCard>

        {/* Google Analytics */}
        <PlatformCard icon="📊" name="Google Analytics 4" color="#e37400" subtitle="Service account JSON + Property ID" status={status.ga4}>
          {status.ga4.connected ? (
            <div style={{ fontSize: 13, color: '#065f46', marginBottom: 12 }}>
              Property ID: {status.ga4.propertyId} · Connected {fmt(status.ga4.connectedAt)}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: '#475569', background: '#f8fafc', borderRadius: 8, padding: '10px 14px', lineHeight: 1.6 }}>
              <strong>Setup:</strong><br />
              1. Go to Google Analytics → Admin → Property → Service Accounts<br />
              2. Create a service account, download the JSON key, add as a Viewer<br />
              3. Add to Vercel: <code>GA4_PROPERTY_ID</code> and <code>GA4_SERVICE_ACCOUNT_JSON</code> (paste the full JSON)<br />
              <a href="https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>Full setup guide →</a>
            </div>
          )}
        </PlatformCard>

        {/* Google Search Console */}
        <PlatformCard icon="🔍" name="Google Search Console" color="#4285f4" subtitle="OAuth credentials + site URL" status={status.gsc}>
          {status.gsc.connected ? (
            <div style={{ fontSize: 13, color: '#065f46', marginBottom: 12 }}>
              {status.gsc.siteUrl} · Connected {fmt(status.gsc.connectedAt)}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: '#475569', background: '#f8fafc', borderRadius: 8, padding: '10px 14px', lineHeight: 1.6 }}>
              <strong>Setup:</strong><br />
              1. Create OAuth 2.0 credentials in Google Cloud Console (type: Web Application)<br />
              2. Authorize the redirect URI, then exchange for a refresh token<br />
              3. Add to Vercel: <code>GSC_CLIENT_ID</code>, <code>GSC_CLIENT_SECRET</code>, <code>GSC_REFRESH_TOKEN</code>, <code>GSC_SITE_URL</code>
            </div>
          )}
        </PlatformCard>

      </div>

      {/* Footer note */}
      <div style={{ marginTop: 28, fontSize: 12, color: '#94a3b8', textAlign: 'center', lineHeight: 1.6 }}>
        X / Twitter and Threads have no analytics API. Use{' '}
        <a href="https://analytics.twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>Twitter Analytics</a>{' '}
        and Meta Business Suite for those platforms.
      </div>

    </div>
  )
}

// ─── Shared styles ─────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  flex: 1, padding: '9px 12px', fontSize: 13,
  border: '1px solid #e2e8f0', borderRadius: 8,
  fontFamily: 'inherit', outline: 'none', background: '#fafafa',
}

const btnStyle = (disabled: boolean): React.CSSProperties => ({
  padding: '9px 18px', borderRadius: 8, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
  background: disabled ? '#e2e8f0' : '#1a1a1a', color: disabled ? '#94a3b8' : '#fff',
  fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
})
