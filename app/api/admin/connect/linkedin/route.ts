/**
 * POST /api/admin/connect/linkedin
 * Body: { accessToken: string, organizationId: string }
 *
 * Validates by fetching org name and follower count from LinkedIn API,
 * then saves metadata to Sanity platformCredentials.
 *
 * Returns org details for the operator to confirm, plus env var instructions.
 * NOTE: LinkedIn tokens expire every 60 days — remind operators to refresh.
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

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body           = await request.json().catch(() => ({}))
  const accessToken    = String(body.accessToken ?? '').trim()
  const organizationId = String(body.organizationId ?? '').replace(/\D/g, '')
  if (!accessToken)    return NextResponse.json({ error: 'accessToken is required' }, { status: 400 })
  if (!organizationId) return NextResponse.json({ error: 'organizationId is required (numeric ID from company page URL)' }, { status: 400 })

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'LinkedIn-Version': '202401',
    'X-Restli-Protocol-Version': '2.0.0',
  }

  // Validate: fetch org name
  const orgRes  = await fetch(`https://api.linkedin.com/v2/organizations/${organizationId}?fields=localizedName`, { headers })
  if (!orgRes.ok) {
    const body = await orgRes.text().catch(() => '')
    return NextResponse.json({
      error: `LinkedIn API error (${orgRes.status}). Check that the access token is valid and has r_organization_social scope.`,
      detail: body.slice(0, 300),
    }, { status: 400 })
  }
  const orgJson = await orgRes.json()
  const orgName = orgJson.localizedName ?? 'Unknown'

  // Fetch follower count
  const orgUrn     = encodeURIComponent(`urn:li:organization:${organizationId}`)
  const followRes  = await fetch(
    `https://api.linkedin.com/v2/networkSizes/${orgUrn}?edgeType=CompanyFollowedByMember`,
    { headers }
  )
  const followJson = followRes.ok ? await followRes.json() : {}
  const followers  = followJson.firstDegreeSize ?? 0

  const now = new Date().toISOString()

  // Save to Sanity
  await sanity().patch('platformCredentials')
    .setIfMissing({ _type: 'platformCredentials', _id: 'platformCredentials' })
    .set({
      'linkedin.organizationId': organizationId,
      'linkedin.orgName':        orgName,
      'linkedin.tokenIssuedAt':  now,
      'linkedin.connectedAt':    now,
    })
    .commit()
    .catch(() => sanity().createOrReplace({
      _type: 'platformCredentials', _id: 'platformCredentials',
      linkedin: { organizationId, orgName, tokenIssuedAt: now, connectedAt: now },
    }))

  return NextResponse.json({
    success:        true,
    organizationId,
    orgName,
    followers,
    tokenIssuedAt:  now,
    envVars: [
      { key: 'LINKEDIN_ACCESS_TOKEN',    value: accessToken },
      { key: 'LINKEDIN_ORGANIZATION_ID', value: organizationId },
      { key: 'LINKEDIN_TOKEN_ISSUED_AT', value: now },
    ],
    warning: 'LinkedIn tokens expire after 60 days. Set a reminder to refresh before then.',
  })
}
