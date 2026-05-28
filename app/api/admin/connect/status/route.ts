/**
 * GET /api/admin/connect/status
 *
 * Returns connection status for all platforms by checking:
 *   1. Whether required env vars are set
 *   2. Saved metadata from the platformCredentials Sanity document
 *
 * Used by the Platform Connection Wizard at /admin/connect.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@sanity/client'

export const dynamic = 'force-dynamic'

function sanity() {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '2nr7n3lm',
    dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    token:     process.env.SANITY_WRITE_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Load saved metadata from Sanity
  let creds: Record<string, any> = {}
  try {
    const doc = await sanity().fetch(`*[_type == "platformCredentials" && _id == "platformCredentials"][0]`)
    creds = doc ?? {}
  } catch {}

  const now = Date.now()
  const daysSince = (isoDate: string | undefined) =>
    isoDate ? (now - new Date(isoDate).getTime()) / (1000 * 60 * 60 * 24) : null

  const liIssuedDays = daysSince(creds.linkedin?.tokenIssuedAt)

  return NextResponse.json({
    tiktok: {
      connected:    !!process.env.TIKTOK_USERNAME || !!creds.tiktok?.username,
      username:     process.env.TIKTOK_USERNAME || creds.tiktok?.username || null,
      connectedAt:  creds.tiktok?.connectedAt || null,
    },
    youtube: {
      connected:    !!process.env.YOUTUBE_CHANNEL_ID || !!creds.youtube?.channelId,
      channelId:    process.env.YOUTUBE_CHANNEL_ID || creds.youtube?.channelId || null,
      channelName:  creds.youtube?.channelName || null,
      connectedAt:  creds.youtube?.connectedAt || null,
    },
    facebook: {
      connected:    !!process.env.FACEBOOK_PAGE_ACCESS_TOKEN && !!process.env.FACEBOOK_PAGE_ID,
      pageId:       process.env.FACEBOOK_PAGE_ID || creds.facebook?.pageId || null,
      pageName:     creds.facebook?.pageName || null,
      connectedAt:  creds.facebook?.connectedAt || null,
    },
    instagram: {
      connected:          !!process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || !!creds.instagram?.businessAccountId,
      businessAccountId:  process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || creds.instagram?.businessAccountId || null,
      username:           creds.instagram?.username || null,
      connectedAt:        creds.instagram?.connectedAt || null,
    },
    linkedin: {
      connected:      !!process.env.LINKEDIN_ACCESS_TOKEN && !!process.env.LINKEDIN_ORGANIZATION_ID,
      organizationId: process.env.LINKEDIN_ORGANIZATION_ID || creds.linkedin?.organizationId || null,
      orgName:        creds.linkedin?.orgName || null,
      connectedAt:    creds.linkedin?.connectedAt || null,
      tokenIssuedAt:  creds.linkedin?.tokenIssuedAt || null,
      tokenAgeDays:   liIssuedDays,
      tokenExpiring:  liIssuedDays !== null && liIssuedDays > 50,
    },
    ga4: {
      connected:   !!process.env.GA4_PROPERTY_ID && !!process.env.GA4_SERVICE_ACCOUNT_JSON,
      propertyId:  process.env.GA4_PROPERTY_ID || creds.ga4?.propertyId || null,
      connectedAt: creds.ga4?.connectedAt || null,
    },
    gsc: {
      connected:   !!process.env.GSC_REFRESH_TOKEN && !!process.env.GSC_SITE_URL,
      siteUrl:     process.env.GSC_SITE_URL || creds.gsc?.siteUrl || null,
      connectedAt: creds.gsc?.connectedAt || null,
    },
  })
}
