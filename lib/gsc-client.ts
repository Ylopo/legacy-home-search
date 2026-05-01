/**
 * Google Search Console API client (OAuth2)
 *
 * Requires env vars:
 *   GSC_CLIENT_ID      — OAuth 2.0 Client ID from Google Cloud
 *   GSC_CLIENT_SECRET  — OAuth 2.0 Client Secret
 *   GSC_REFRESH_TOKEN  — Refresh token (one-time grant via OAuth Playground)
 *   GSC_SITE_URL       — e.g. "sc-domain:legacyhometeamlpt.com"
 *                         or "https://www.legacyhometeamlpt.com/"
 */

import { google } from 'googleapis'

export type GSCOverview = {
  clicks: number
  impressions: number
  ctr: number
  position: number
  trend: { date: string; clicks: number; impressions: number }[]
  topPages: { page: string; clicks: number; impressions: number; ctr: number; position: number }[]
  topQueries: { query: string; clicks: number; impressions: number; ctr: number; position: number }[]
  devices: { device: string; clicks: number; impressions: number; ctr: number }[]
  countries: { country: string; clicks: number; impressions: number }[]
}

function getClient() {
  const clientId     = process.env.GSC_CLIENT_ID
  const clientSecret = process.env.GSC_CLIENT_SECRET
  const refreshToken = process.env.GSC_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) return null

  try {
    const oauth2 = new google.auth.OAuth2(clientId, clientSecret)
    oauth2.setCredentials({ refresh_token: refreshToken })
    return google.searchconsole({ version: 'v1', auth: oauth2 })
  } catch {
    return null
  }
}

export async function getGSCOverview(days = 28): Promise<GSCOverview | null> {
  const sc = getClient()
  if (!sc) return null

  const siteUrl = process.env.GSC_SITE_URL
  if (!siteUrl) return null

  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - days)
  const fmt = (d: Date) => d.toISOString().split('T')[0]
  const base = { startDate: fmt(startDate), endDate: fmt(endDate) }

  const [summaryRes, trendRes, topPagesRes, topQueriesRes, devicesRes, countriesRes] = await Promise.all([
      sc.searchanalytics.query({ siteUrl, requestBody: { ...base, dimensions: [], rowLimit: 1 } }),
      sc.searchanalytics.query({ siteUrl, requestBody: { ...base, dimensions: ['date'], rowLimit: 90 } }),
      sc.searchanalytics.query({ siteUrl, requestBody: { ...base, dimensions: ['page'], rowLimit: 50 } }),
      sc.searchanalytics.query({ siteUrl, requestBody: { ...base, dimensions: ['query'], rowLimit: 25 } }),
      sc.searchanalytics.query({ siteUrl, requestBody: { ...base, dimensions: ['device'], rowLimit: 10 } }),
      sc.searchanalytics.query({ siteUrl, requestBody: { ...base, dimensions: ['country'], rowLimit: 10 } }),
    ])

    const summary = summaryRes.data.rows?.[0]

    const trend = (trendRes.data.rows ?? []).map((r: any) => ({
      date: r.keys[0],
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
    }))

    const topPages = (topPagesRes.data.rows ?? [])
      .map((r: any) => ({
        page: r.keys[0] as string,
        clicks: r.clicks ?? 0,
        impressions: r.impressions ?? 0,
        ctr: r.ctr ?? 0,
        position: r.position ?? 0,
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)

    const topQueries = (topQueriesRes.data.rows ?? [])
      .map((r: any) => ({
        query: r.keys[0] as string,
        clicks: r.clicks ?? 0,
        impressions: r.impressions ?? 0,
        ctr: r.ctr ?? 0,
        position: r.position ?? 0,
      }))
      .sort((a, b) => b.clicks - a.clicks)

    const devices = (devicesRes.data.rows ?? []).map((r: any) => ({
      device: (r.keys[0] as string).toLowerCase(),
      clicks: r.clicks ?? 0,
      impressions: r.impressions ?? 0,
      ctr: r.ctr ?? 0,
    }))

    const countries = (countriesRes.data.rows ?? [])
      .map((r: any) => ({
        country: r.keys[0] as string,
        clicks: r.clicks ?? 0,
        impressions: r.impressions ?? 0,
      }))
      .sort((a, b) => b.clicks - a.clicks)

    return {
      clicks: summary?.clicks ?? 0,
      impressions: summary?.impressions ?? 0,
      ctr: summary?.ctr ?? 0,
      position: summary?.position ?? 0,
      trend,
      topPages,
    topQueries,
    devices,
    countries,
  }
}
