'use client'

import { useEffect, useState } from 'react'
import type { GSCOverview } from '@/lib/gsc-client'
import { useUrlSecret } from '@/hooks/useUrlSecret'

type Data = {
  gsc: GSCOverview | null
  stats: { total: number; gscConnected: boolean }
}

function StatCard({ label, value, sub, accent = '#1a1a1a' }: {
  label: string; value: string | number; sub?: string; accent?: string
}) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 22px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: accent, lineHeight: 1, marginBottom: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#94a3b8' }}>{sub}</div>}
    </div>
  )
}

function TrendChart({ trend }: { trend: { date: string; clicks: number; impressions: number }[] }) {
  const maxClicks = Math.max(...trend.map(t => t.clicks), 1)
  const maxImpressions = Math.max(...trend.map(t => t.impressions), 1)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 80 }}>
        {trend.map((t, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, height: '100%', justifyContent: 'flex-end' }}>
            <div title={`${t.date}: ${t.impressions.toLocaleString()} impressions`}
              style={{ width: '100%', background: '#bfdbfe', borderRadius: '2px 2px 0 0', height: `${(t.impressions / maxImpressions) * 70}px`, minHeight: t.impressions > 0 ? 2 : 0 }} />
            <div title={`${t.date}: ${t.clicks} clicks`}
              style={{ width: '100%', background: '#2563eb', borderRadius: '2px 2px 0 0', position: 'absolute', height: `${(t.clicks / maxClicks) * 70}px`, minHeight: t.clicks > 0 ? 2 : 0 }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#94a3b8' }}>
        <span>{trend[0]?.date}</span>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#2563eb', borderRadius: 2, marginRight: 4 }} />Clicks</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, background: '#bfdbfe', borderRadius: 2, marginRight: 4 }} />Impressions</span>
        </div>
        <span>{trend[trend.length - 1]?.date}</span>
      </div>
    </div>
  )
}

const SL = { fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#64748b', marginBottom: 12 }

export default function GoogleSearchPage() {
  const secret = useUrlSecret()

  const [data, setData]       = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!secret) return
    fetch(`/api/social-dashboard?secret=${encodeURIComponent(secret)}`)
      .then(r => r.ok ? r.json() : Promise.reject('Unauthorized'))
      .then(setData)
      .catch(() => setError('Failed to load'))
      .finally(() => setLoading(false))
  }, [secret])

  if (loading) return <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>Loading…</div>
  if (error || !data) return <div style={{ color: '#dc2626', textAlign: 'center', padding: 40 }}>{error || 'No data'}</div>

  const { gsc, stats } = data

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
          🔍 Google Search
        </h1>
        <div style={{ fontSize: 13, color: '#64748b' }}>Organic search performance — last 28 days</div>
      </div>

      {!stats.gscConnected ? (
        <div style={{ background: '#fff', border: '1.5px dashed #cbd5e1', borderRadius: 16, padding: '48px 32px', textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Connect Google Search Console</div>
          <div style={{ fontSize: 14, color: '#64748b', maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Once connected, you'll see organic clicks, impressions, CTR, average position, top keywords, top pages, device breakdown, and daily trends.
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 10, padding: '16px 20px', textAlign: 'left', display: 'inline-block' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 8 }}>Add to Vercel environment variables:</div>
            <div style={{ fontFamily: 'monospace', fontSize: 12, lineHeight: 2 }}>
              <div><span style={{ color: '#2563eb' }}>GSC_SERVICE_ACCOUNT_JSON</span>={'<paste JSON key>'}</div>
              <div><span style={{ color: '#2563eb' }}>GSC_SITE_URL</span>=sc-domain:legacyhometeamlpt.com</div>
            </div>
          </div>
        </div>
      ) : !gsc ? (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, padding: 20, fontSize: 13, color: '#991b1b' }}>
          GSC credentials are set but the API returned an error. Check that the service account has been added as a user in Search Console → Settings → Users and permissions.
        </div>
      ) : (
        <>
          {/* Overview stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            <StatCard label="Total Clicks"    value={gsc.clicks.toLocaleString()}        sub="organic search" accent="#2563eb" />
            <StatCard label="Impressions"     value={gsc.impressions.toLocaleString()}   sub="search appearances" />
            <StatCard label="CTR"             value={`${(gsc.ctr * 100).toFixed(2)}%`}  sub="click-through rate" accent={gsc.ctr >= 0.05 ? '#16a34a' : '#d97706'} />
            <StatCard label="Avg Position"    value={gsc.position.toFixed(1)}            sub="lower = better" accent={gsc.position <= 10 ? '#16a34a' : gsc.position <= 20 ? '#d97706' : '#dc2626'} />
          </div>

          {/* Trend chart */}
          {gsc.trend.length > 0 && (
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Daily Performance — Last 28 Days</div>
              <TrendChart trend={gsc.trend} />
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>

            {/* Top queries */}
            {gsc.topQueries.length > 0 && (
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', fontSize: 13, fontWeight: 700 }}>
                  Top Search Queries
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '8px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Query</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 10, textTransform: 'uppercase' }}>Clicks</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: 10, textTransform: 'uppercase' }}>Pos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gsc.topQueries.map((q, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 16px', color: '#1a1a1a', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.query}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>{q.clicks}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', color: '#64748b' }}>{q.position.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Right column: devices + countries */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {gsc.devices.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 18px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Device Breakdown</div>
                  {gsc.devices.map((d, i) => {
                    const total = gsc.devices.reduce((s, x) => s + x.clicks, 0)
                    const w = total ? `${Math.max(4, (d.clicks / total) * 100)}%` : '4%'
                    const icon = d.device === 'mobile' ? '📱' : d.device === 'desktop' ? '💻' : '📟'
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 13, width: 20, textAlign: 'center' }}>{icon}</span>
                        <span style={{ fontSize: 12, color: '#475569', width: 60, textTransform: 'capitalize' }}>{d.device}</span>
                        <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 99, height: 7, overflow: 'hidden' }}>
                          <div style={{ width: w, background: '#2563eb', height: '100%', borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', width: 32, textAlign: 'right' }}>{d.clicks}</span>
                        <span style={{ fontSize: 11, color: '#94a3b8', width: 32, textAlign: 'right' }}>
                          {total ? `${Math.round((d.clicks / total) * 100)}%` : '—'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              {gsc.countries.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 18px' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Top Countries</div>
                  {gsc.countries.slice(0, 5).map((c, i) => {
                    const total = gsc.countries.reduce((s, x) => s + x.clicks, 0)
                    const w = total ? `${Math.max(4, (c.clicks / total) * 100)}%` : '4%'
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: '#475569', width: 80, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.country}</span>
                        <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 99, height: 7, overflow: 'hidden' }}>
                          <div style={{ width: w, background: '#16a34a', height: '100%', borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', width: 32, textAlign: 'right' }}>{c.clicks}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Top pages */}
          {gsc.topPages.length > 0 && (
            <>
              <div style={SL}>Top Pages by Clicks</div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Page', 'Clicks', 'Impressions', 'CTR', 'Avg Position'].map((h, i) => (
                        <th key={h} style={{ padding: '9px 16px', textAlign: i === 0 ? 'left' : 'right', color: '#64748b', fontWeight: 600, fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {gsc.topPages.map((row, i) => {
                      const slug = row.page.replace(/^https?:\/\/[^/]+/, '') || '/'
                      return (
                        <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px 16px', maxWidth: 380 }}>
                            <a href={row.page} target="_blank" rel="noopener noreferrer"
                              style={{ color: '#2563eb', textDecoration: 'none', fontSize: 12, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {slug}
                            </a>
                          </td>
                          <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 700, color: '#1a1a1a' }}>{row.clicks}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'right', color: '#475569' }}>{row.impressions.toLocaleString()}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'right', color: '#475569' }}>{(row.ctr * 100).toFixed(2)}%</td>
                          <td style={{ padding: '10px 16px', textAlign: 'right', color: row.position <= 10 ? '#16a34a' : '#475569' }}>{row.position.toFixed(1)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
