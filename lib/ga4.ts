import { google } from 'googleapis'

export type SiteGA4Overview = {
  sessions: number
  pageViews: number
  activeUsers: number
  avgEngagementSec: number
  channels: { channel: string; sessions: number; pageViews: number }[]
  trend: { date: string; sessions: number; pageViews: number }[]
}

function getAuth(rawJson: string) {
  const credentials = JSON.parse(rawJson)
  return new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  })
}

// Returns site-wide traffic overview for the last N days.
export async function fetchSiteGA4Overview(days = 28): Promise<SiteGA4Overview | null> {
  const propertyId = process.env.GA4_PROPERTY_ID
  const rawJson = process.env.GA4_SERVICE_ACCOUNT_JSON
  if (!propertyId || !rawJson) return null

  try {
    const auth = getAuth(rawJson)
    const analyticsdata = google.analyticsdata({ version: 'v1beta', auth })
    const range = { startDate: `${days}daysAgo`, endDate: 'today' }

    const [summaryRes, channelRes, trendRes] = await Promise.all([
      // Overall totals
      analyticsdata.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [range],
          metrics: [
            { name: 'sessions' },
            { name: 'screenPageViews' },
            { name: 'activeUsers' },
            { name: 'averageSessionDuration' },
          ],
        },
      }) as any,
      // Channel breakdown
      analyticsdata.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [range],
          dimensions: [{ name: 'sessionDefaultChannelGrouping' }],
          metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: '10',
        },
      }) as any,
      // Daily trend
      analyticsdata.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [range],
          dimensions: [{ name: 'date' }],
          metrics: [{ name: 'sessions' }, { name: 'screenPageViews' }],
          orderBys: [{ dimension: { dimensionName: 'date' } }],
        },
      }) as any,
    ])

    const s = summaryRes.data?.rows?.[0]
    const sessions         = parseInt(s?.metricValues?.[0]?.value ?? '0', 10)
    const pageViews        = parseInt(s?.metricValues?.[1]?.value ?? '0', 10)
    const activeUsers      = parseInt(s?.metricValues?.[2]?.value ?? '0', 10)
    const avgEngagementSec = Math.round(parseFloat(s?.metricValues?.[3]?.value ?? '0'))

    const channels = (channelRes.data?.rows ?? []).map((r: any) => ({
      channel:  r.dimensionValues?.[0]?.value ?? 'Unknown',
      sessions: parseInt(r.metricValues?.[0]?.value ?? '0', 10),
      pageViews: parseInt(r.metricValues?.[1]?.value ?? '0', 10),
    }))

    const trend = (trendRes.data?.rows ?? []).map((r: any) => {
      const raw = r.dimensionValues?.[0]?.value ?? ''
      // GA4 returns YYYYMMDD — convert to YYYY-MM-DD
      const date = raw.length === 8 ? `${raw.slice(0,4)}-${raw.slice(4,6)}-${raw.slice(6,8)}` : raw
      return {
        date,
        sessions:  parseInt(r.metricValues?.[0]?.value ?? '0', 10),
        pageViews: parseInt(r.metricValues?.[1]?.value ?? '0', 10),
      }
    })

    return { sessions, pageViews, activeUsers, avgEngagementSec, channels, trend }
  } catch (err) {
    console.error('[GA4] fetchSiteGA4Overview failed:', err)
    return null
  }
}

export type PostGA4Stats = {
  pageViews: number
  sessions: number
  activeUsers: number
  avgEngagementSec: number
}

// Returns a map of blog slug → GA4 stats for the last 90 days.
// Returns an empty map (gracefully) if credentials are missing or the API call fails.
export async function fetchBlogGA4Data(): Promise<Map<string, PostGA4Stats>> {
  const propertyId = process.env.GA4_PROPERTY_ID
  const rawJson = process.env.GA4_SERVICE_ACCOUNT_JSON
  if (!propertyId || !rawJson) return new Map()

  let credentials: object
  try {
    credentials = JSON.parse(rawJson)
  } catch {
    console.error('[GA4] Failed to parse GA4_SERVICE_ACCOUNT_JSON')
    return new Map()
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    })

    const analyticsdata = google.analyticsdata({ version: 'v1beta', auth })

    const res = await analyticsdata.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: '90daysAgo', endDate: 'today' }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'activeUsers' },
          { name: 'averageSessionDuration' },
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'pagePath',
            stringFilter: { matchType: 'BEGINS_WITH', value: '/blog/' },
          },
        },
        limit: '1000',
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any

    const map = new Map<string, PostGA4Stats>()
    for (const row of (res.data?.rows ?? []) as Array<{ dimensionValues?: Array<{ value?: string }>; metricValues?: Array<{ value?: string }> }>) {
      const path = row.dimensionValues?.[0]?.value ?? ''
      const slug = path.replace(/^\/blog\//, '').replace(/\/+$/, '')
      if (!slug) continue
      map.set(slug, {
        pageViews:        parseInt(row.metricValues?.[0]?.value ?? '0', 10),
        sessions:         parseInt(row.metricValues?.[1]?.value ?? '0', 10),
        activeUsers:      parseInt(row.metricValues?.[2]?.value ?? '0', 10),
        avgEngagementSec: Math.round(parseFloat(row.metricValues?.[3]?.value ?? '0')),
      })
    }
    return map
  } catch (err) {
    console.error('[GA4] API call failed:', err)
    return new Map()
  }
}

export type IdxClickData = {
  totalClicks: number
  trend: { date: string; clicks: number }[]
  topPages: { page: string; clicks: number; sessions: number; ctr: number }[]
}

// Returns IDX pass-through click data from idx_property_click custom events.
export async function fetchIdxClickData(days = 28): Promise<IdxClickData | null> {
  const propertyId = process.env.GA4_PROPERTY_ID
  const rawJson = process.env.GA4_SERVICE_ACCOUNT_JSON
  if (!propertyId || !rawJson) return null

  try {
    const auth = getAuth(rawJson)
    const analyticsdata = google.analyticsdata({ version: 'v1beta', auth })
    const range = { startDate: `${days}daysAgo`, endDate: 'today' }
    const idxFilter = {
      filter: {
        fieldName: 'eventName',
        stringFilter: { matchType: 'EXACT' as const, value: 'idx_property_click' },
      },
    }

    const [totalsRes, trendRes, pagesClickRes, pagesSessionRes] = await Promise.all([
      analyticsdata.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: { dateRanges: [range], metrics: [{ name: 'eventCount' }], dimensionFilter: idxFilter },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any,
      analyticsdata.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [range],
          dimensions: [{ name: 'date' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: idxFilter,
          orderBys: [{ dimension: { dimensionName: 'date' } }],
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any,
      analyticsdata.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [range],
          dimensions: [{ name: 'pagePath' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: idxFilter,
          orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
          limit: '20',
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any,
      analyticsdata.properties.runReport({
        property: `properties/${propertyId}`,
        requestBody: {
          dateRanges: [range],
          dimensions: [{ name: 'pagePath' }],
          metrics: [{ name: 'sessions' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: '100',
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any,
    ])

    const totalClicks = parseInt(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (totalsRes.data?.rows as any)?.[0]?.metricValues?.[0]?.value ?? '0', 10
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const trend = ((trendRes.data?.rows ?? []) as any[]).map((r: any) => {
      const raw = r.dimensionValues?.[0]?.value ?? ''
      const date = raw.length === 8
        ? `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
        : raw
      return { date, clicks: parseInt(r.metricValues?.[0]?.value ?? '0', 10) }
    })

    const sessionsMap = new Map<string, number>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const row of (pagesSessionRes.data?.rows ?? []) as any[]) {
      const path = row.dimensionValues?.[0]?.value ?? ''
      sessionsMap.set(path, parseInt(row.metricValues?.[0]?.value ?? '0', 10))
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const topPages = ((pagesClickRes.data?.rows ?? []) as any[]).map((r: any) => {
      const page = r.dimensionValues?.[0]?.value ?? ''
      const clicks = parseInt(r.metricValues?.[0]?.value ?? '0', 10)
      const sessions = sessionsMap.get(page) ?? 0
      const ctr = sessions > 0 ? Math.round((clicks / sessions) * 1000) / 10 : 0
      return { page, clicks, sessions, ctr }
    })

    return { totalClicks, trend, topPages }
  } catch (err) {
    console.error('[GA4] fetchIdxClickData failed:', err)
    return null
  }
}
