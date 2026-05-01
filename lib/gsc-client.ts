/**
 * Google Search Console API client
 *
 * Requires env vars:
 *   GSC_SERVICE_ACCOUNT_JSON  — full JSON string of service account credentials
 *   GSC_SITE_URL              — e.g. "sc-domain:legacyhometeamlpt.com"
 *                               or "https://www.legacyhometeamlpt.com/"
 */

import { google } from 'googleapis'

export type GSCOverview = {
  clicks: number
  impressions: number
  ctr: number
  position: number
  trend: { date: string; clicks: number; impressions: number }[]
  topPages: { page: string; clicks: number; impressions: number; ctr: number; position: number }[]
}

function getClient() {
  const json = process.env.GSC_SERVICE_ACCOUNT_JSON
  if (!json) return null
  try {
    const credentials = JSON.parse(json)
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    })
    return google.searchconsole({ version: 'v1', auth })
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

  try {
    const [summaryRes, trendRes, topPagesRes] = await Promise.all([
      // Overall totals
      sc.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: fmt(startDate),
          endDate: fmt(endDate),
          dimensions: [],
          rowLimit: 1,
        },
      }),
      // Daily trend
      sc.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: fmt(startDate),
          endDate: fmt(endDate),
          dimensions: ['date'],
          rowLimit: 90,
        },
      }),
      // Top pages by clicks (sorted client-side — orderBy not in this SDK version)
      sc.searchanalytics.query({
        siteUrl,
        requestBody: {
          startDate: fmt(startDate),
          endDate: fmt(endDate),
          dimensions: ['page'],
          rowLimit: 50,
        },
      }),
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

    return {
      clicks: summary?.clicks ?? 0,
      impressions: summary?.impressions ?? 0,
      ctr: summary?.ctr ?? 0,
      position: summary?.position ?? 0,
      trend,
      topPages,
    }
  } catch (err) {
    console.error('[gsc-client]', err)
    return null
  }
}
