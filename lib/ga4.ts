import { google } from 'googleapis'

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
