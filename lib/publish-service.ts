/**
 * Publish service — orchestrates website + social publish in one action.
 *
 * Always publishes to Facebook (requires cover image).
 * Publishes to YouTube + TikTok only when post.videoUrl is set.
 */

import Anthropic from '@anthropic-ai/sdk'
import imageUrlBuilder from '@sanity/image-url'
import { FAIR_HOUSING_RULES } from './fair-housing'
import { createClient } from '@sanity/client'
import { publishToFacebook, publishToFacebookReel, publishToYouTube, publishToTikTok, publishToLinkedIn, publishToX, publishToInstagram, publishToInstagramReel } from './oneup-client'
import { markPublishing, markPublished, markPublishFailed, patchSocialSubmission } from './content-workflow'
import { getSanityWriteClient } from './sanity-write'
import type { SanityBlogPost } from '../sanity/queries'

// ─── Per-platform hashtags ────────────────────────────────────────────────────

const TIKTOK_BASE_HASHTAGS = [
  '#hamptonroads', '#virginiabeach', '#realestate', '#realtor',
  '#norfolk', '#chesapeake', '#suffolk', '#portsmouth',
  '#barryjenkinsrealtor', '#legacyhometeam',
]

const TIKTOK_CATEGORY_HASHTAGS: Record<string, string[]> = {
  'market-update':       ['#realestatemarket', '#housingmarket', '#marketupdate', '#homeprices'],
  'buying-tips':         ['#homebuyer', '#firsttimehomebuyer', '#buyingahome', '#homebuyingtips'],
  'selling-tips':        ['#homeseller', '#sellingyourhome', '#listingagent', '#homesellingtips'],
  'community-spotlight': ['#hamptonroadsliving', '#virginiabeachliving', '#movingtovirginia'],
  'investment':          ['#realestateinvesting', '#investmentproperty', '#rentalincome'],
  'news':                ['#realestatenews', '#housingmarket', '#mortgagerates'],
  'cost-breakdown':      ['#closingcosts', '#homebuying', '#realestatetips'],
  'flood-and-risk':      ['#floodinsurance', '#coastalliving', '#hamptonroads'],
}

const LINKEDIN_CATEGORY_HASHTAGS: Record<string, string[]> = {
  'market-update':       ['#HousingMarket', '#RealEstateMarket', '#MarketUpdate'],
  'buying-tips':         ['#HomeBuying', '#HomeBuyer', '#FirstTimeHomeBuyer'],
  'selling-tips':        ['#HomeSelling', '#ListingAgent', '#HomeValue'],
  'community-spotlight': ['#VirginiaBeachLiving', '#HamptonRoadsLiving', '#CommunityLife'],
  'investment':          ['#RealEstateInvesting', '#InvestmentProperty', '#PassiveIncome'],
  'news':                ['#HousingNews', '#MortgageRates', '#RealEstateNews'],
  'cost-breakdown':      ['#ClosingCosts', '#HomeBuyingTips', '#RealEstateFinance'],
  'flood-and-risk':      ['#FloodInsurance', '#CoastalRealEstate', '#RiskManagement'],
}

const X_CATEGORY_HASHTAGS: Record<string, string> = {
  'market-update':       '#realestate #housingmarket',
  'buying-tips':         '#homebuying #realestate',
  'selling-tips':        '#homeseller #realestate',
  'community-spotlight': '#virginiabeach #hamptonroads',
  'investment':          '#realestate #investing',
  'news':                '#realestate #housingmarket',
  'cost-breakdown':      '#homebuying #closingcosts',
  'flood-and-risk':      '#realestate #floodinsurance',
}

export function buildTikTokCaption(copy: string, category: string | undefined, articleUrl: string): string {
  const categoryTags = TIKTOK_CATEGORY_HASHTAGS[category ?? ''] ?? []
  const allTags = [...TIKTOK_BASE_HASHTAGS, ...categoryTags]
  return `${copy}\n\n${articleUrl}\n\n${allTags.join(' ')}`
}

export function buildLinkedInCaption(copy: string, category: string | undefined, articleUrl: string): string {
  const categoryTags = LINKEDIN_CATEGORY_HASHTAGS[category ?? ''] ?? []
  const baseTags = ['#RealEstate', '#HamptonRoads', '#VirginiaBeach']
  const allTags = [...baseTags, ...categoryTags]
  return `${copy}\n\n${articleUrl}\n\n${allTags.join(' ')}`
}

export function buildXCaption(copy: string, category: string | undefined, articleUrl: string): string {
  const tags = X_CATEGORY_HASHTAGS[category ?? ''] ?? '#realestate'
  // X: keep total under 280 chars — copy + url (23) + tags
  const suffix = `\n\n${articleUrl} ${tags}`
  const maxCopy = 280 - suffix.length - 3
  const safeCopy = copy.length > maxCopy ? copy.slice(0, maxCopy) + '...' : copy
  return `${safeCopy}${suffix}`
}

export function buildInstagramCaption(copy: string, category: string | undefined, articleUrl: string): string {
  const tagMap: Record<string, string> = {
    'market-update':       '#HamptonRoads #RealEstate #HamptonRoadsRealEstate #VirginiaBeach #RealEstateMarket',
    'buying-tips':         '#HomeBuying #HamptonRoads #RealEstate #FirstTimeHomeBuyer #VirginiaBeach',
    'selling-tips':        '#HomeSelling #HamptonRoads #RealEstate #SellingYourHome #VirginiaBeach',
    'community-spotlight': '#HamptonRoads #VirginiaBeach #Community #LivingInVB #CoastalLiving',
    'investment':          '#RealEstateInvesting #HamptonRoads #InvestmentProperty #RealEstate',
    'news':                '#HamptonRoads #RealEstate #RealEstateNews #VirginiaBeach',
    'cost-breakdown':      '#HomeBuying #RealEstate #HamptonRoads #HomeCosts #VirginiaBeach',
    'flood-and-risk':      '#HamptonRoads #FloodInsurance #CoastalLiving #RealEstate #VirginiaBeach',
  }
  const tags = tagMap[category ?? ''] ?? '#HamptonRoads #RealEstate #VirginiaBeach'
  return `${copy}\n\n${tags}\n\n${articleUrl}`
}

// ─── Platform captions ────────────────────────────────────────────────────────

export interface PlatformCaptions {
  facebook: string
  linkedin: string
  twitter: string
  tiktok: string
  youtube: string
  instagram: string
}

export async function generatePlatformCaptions(
  post: Pick<SanityBlogPost, 'title' | 'excerpt' | 'category'>,
): Promise<PlatformCaptions> {
  const categoryLabels: Record<string, string> = {
    'market-update': 'market update', 'buying-tips': 'home buying tips',
    'selling-tips': 'home selling tips', 'community-spotlight': 'community spotlight',
    'investment': 'real estate investment', 'news': 'real estate news',
    'cost-breakdown': 'cost breakdown', 'flood-and-risk': 'flood and risk',
  }

  const fallback: PlatformCaptions = {
    facebook: `I've been watching the Hampton Roads market for over 20 years — ${post.title.toLowerCase()} is something every local homeowner and buyer should understand right now.`,
    linkedin: `New insights for Hampton Roads real estate clients: ${post.title}. Read the full analysis on the Legacy Home Search blog.`,
    twitter: `${post.title} — what this means for Hampton Roads buyers and sellers.`,
    tiktok: post.excerpt ?? post.title,
    youtube: post.excerpt ?? `${post.title} — insights from Barry Jenkins at Legacy Home Team in Virginia Beach.`,
    instagram: post.excerpt ?? `${post.title} — new on the Legacy Home Search blog.`,
  }

  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `Write 6 unique social media captions for the same Hampton Roads real estate blog post by Barry Jenkins. Same core message, different delivery for each platform.

Article:
Title: ${post.title}
Category: ${categoryLabels[post.category ?? ''] ?? post.category ?? 'real estate'}
Excerpt: ${post.excerpt ?? ''}

${FAIR_HOUSING_RULES}

Return a JSON object with EXACTLY these 6 fields. No markdown fences.

{
  "facebook": "2–3 sentences. First person as Barry. Teaser that makes someone stop scrolling. Pick ONE hook: surprising fact, question, local angle, myth-busting, direct value, or client story. Conversational and warm. No hashtags. Natural CTA.",
  "linkedin": "2–3 professional sentences. Informative, industry-relevant. Barry's expertise + Hampton Roads market context. No hashtags (those are appended separately). Under 300 chars.",
  "twitter": "1 punchy sentence under 180 characters. Direct and surprising. No hashtags (appended separately). Create genuine curiosity.",
  "tiktok": "1–2 short casual sentences. Hook-first. Very conversational. No hashtags (appended separately).",
  "youtube": "2–3 sentences describing what viewers will learn. Informative. Mention Hampton Roads specifically. No hashtags.",
  "instagram": "2–3 visually evocative sentences. Lifestyle + local angle. First person as Barry. Warm and personal. No hashtags (those are appended separately)."
}`,
      }],
    })

    const raw = response.content[0].type === 'text' ? response.content[0].text.trim() : ''
    const parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim())

    return {
      facebook:  parsed.facebook  || fallback.facebook,
      linkedin:  parsed.linkedin  || fallback.linkedin,
      twitter:   parsed.twitter   || fallback.twitter,
      tiktok:    parsed.tiktok    || fallback.tiktok,
      youtube:   parsed.youtube   || fallback.youtube,
      instagram: parsed.instagram || fallback.instagram,
    }
  } catch {
    return fallback
  }
}

// Keep for backward compatibility (used in generate-caption API route)
export async function generateSocialCopy(post: Pick<SanityBlogPost, 'title' | 'excerpt' | 'category'>): Promise<string> {
  const caps = await generatePlatformCaptions(post)
  return caps.facebook
}

// ─── Image URL resolver ───────────────────────────────────────────────────────

function getSanityImageUrl(coverImage: any): string | null {
  if (!coverImage?.asset?._ref) return null

  const readClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '2nr7n3lm',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
  })

  const builder = imageUrlBuilder(readClient)
  // Force JPEG @ quality 80 to keep files under platform limits.
  // X (Twitter) rejects images >5MB; Sanity's default (preserving source PNG)
  // can blow past that on detailed thumbnails. 1200×*, JPG 80 typically
  // lands well under 1MB and looks visually identical to higher-quality
  // PNGs at social-feed display sizes.
  return builder.image(coverImage).width(1200).quality(80).format('jpg').url()
}

// ─── Publish result types ─────────────────────────────────────────────────────

export type PlatformResult = { postSubmissionId: string } | { error: string } | null

export type PublishResult =
  | {
      ok: true
      facebook: PlatformResult
      facebookReel: PlatformResult
      youtube: PlatformResult
      tiktok: PlatformResult
      linkedin: PlatformResult
      twitter: PlatformResult
      instagram: PlatformResult
    }
  | { ok: false; error: string }

// ─── Social-only (for already-published posts) ────────────────────────────────

export async function publishSocialOnly(
  post: SanityBlogPost,
  socialCopy?: string,
): Promise<PublishResult> {
  const postId = post._id
  try {
    const captions = socialCopy
      ? {
          facebook: socialCopy,
          linkedin: socialCopy,
          twitter: socialCopy,
          tiktok: socialCopy,
          youtube: socialCopy,
          instagram: socialCopy,
        }
      : await generatePlatformCaptions(post)

    const imageUrl = getSanityImageUrl(post.coverImage)
    if (!imageUrl) {
      return { ok: false, error: 'No cover image — cannot post without an image.' }
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.trim())
      ? process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/+$/, '')
      : 'https://www.legacyhometeamlpt.com'
    const articleUrl = `${appUrl}/blog/${post.slug}`

    const fbCopy      = `${captions.facebook}\n\n${articleUrl}`
    const liCopy      = buildLinkedInCaption(captions.linkedin, post.category, articleUrl)
    const twitterCopy = buildXCaption(captions.twitter, post.category, articleUrl)
    const igCopy      = buildInstagramCaption(captions.instagram, post.category, articleUrl)

    const [fbRes, liRes, twRes, igRes] = await Promise.allSettled([
      publishToFacebook(fbCopy, imageUrl),
      publishToLinkedIn(liCopy, imageUrl),
      publishToX(twitterCopy, imageUrl),
      post.videoUrl
        ? publishToInstagramReel(igCopy, post.videoUrl)
        : publishToInstagram(igCopy, imageUrl),
    ])

    const fbResult: PlatformResult = fbRes.status === 'fulfilled'
      ? { postSubmissionId: fbRes.value.postSubmissionId }
      : { error: fbRes.reason instanceof Error ? fbRes.reason.message : 'Facebook publish failed' }

    const liResult: PlatformResult = liRes.status === 'fulfilled'
      ? { postSubmissionId: liRes.value.postSubmissionId }
      : { error: liRes.reason instanceof Error ? liRes.reason.message : 'LinkedIn publish failed' }

    const twResult: PlatformResult = twRes.status === 'fulfilled'
      ? { postSubmissionId: twRes.value.postSubmissionId }
      : { error: twRes.reason instanceof Error ? twRes.reason.message : 'X publish failed' }

    const igResult: PlatformResult = igRes.status === 'fulfilled'
      ? { postSubmissionId: igRes.value.postSubmissionId }
      : { error: igRes.reason instanceof Error ? igRes.reason.message : 'Instagram publish failed' }

    // Use Facebook submission ID as the primary one for patchSocialSubmission
    const primaryId = fbResult && 'postSubmissionId' in fbResult ? fbResult.postSubmissionId : ''
    await patchSocialSubmission(postId, primaryId, captions.facebook)

    // Patch LinkedIn, X, and Instagram submission IDs separately
    const writeClient = getSanityWriteClient()
    const extraPatch: Record<string, string> = {}
    if (liResult && 'postSubmissionId' in liResult) extraPatch.linkedinPostSubmissionId = liResult.postSubmissionId
    if (twResult && 'postSubmissionId' in twResult) extraPatch.twitterPostSubmissionId = twResult.postSubmissionId
    if (igResult && 'postSubmissionId' in igResult) extraPatch.instagramPostSubmissionId = igResult.postSubmissionId
    if (Object.keys(extraPatch).length > 0) {
      await writeClient.patch(postId).set(extraPatch).commit()
    }

    return { ok: true, facebook: fbResult, facebookReel: null, youtube: null, tiktok: null, linkedin: liResult, twitter: twResult, instagram: igResult }
  } catch (err) {
    console.error('[publish-service] Social-only publish error:', err instanceof Error ? err.message : err)
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown publish error' }
  }
}

// ─── Full publish (website + all social platforms) ────────────────────────────

async function tryVideoThenImage(
  publishFn: (text: string, url: string) => Promise<{ postSubmissionId: string }>,
  text: string,
  videoUrl: string,
  imageUrl: string,
  platformLabel: string,
): Promise<PlatformResult> {
  try {
    const r = await publishFn(text, videoUrl)
    return { postSubmissionId: r.postSubmissionId }
  } catch (videoErr) {
    console.warn(`[publish-service] ${platformLabel} video rejected, falling back to image:`, videoErr instanceof Error ? videoErr.message : videoErr)
    try {
      const r = await publishFn(text, imageUrl)
      return { postSubmissionId: r.postSubmissionId }
    } catch (imgErr) {
      const msg = imgErr instanceof Error ? imgErr.message : `${platformLabel} publish failed`
      console.error(`[publish-service] ${platformLabel} fallback image also failed:`, msg)
      return { error: msg }
    }
  }
}

export async function publishPostToAll(
  post: SanityBlogPost,
  socialCopy?: string,
  publishedAtOverride?: string,
): Promise<PublishResult> {
  const postId = post._id

  try {
    await markPublishing(postId)

    const captions = socialCopy
      ? { facebook: socialCopy, linkedin: socialCopy, twitter: socialCopy, tiktok: socialCopy, youtube: socialCopy, instagram: socialCopy }
      : await generatePlatformCaptions(post)

    const imageUrl = getSanityImageUrl(post.coverImage)
    if (!imageUrl) {
      await markPublishFailed(postId)
      return { ok: false, error: 'No cover image set — cannot publish without an image.' }
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.trim())
      ? process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/+$/, '')
      : 'https://www.legacyhometeamlpt.com'
    const articleUrl = `${appUrl}/blog/${post.slug}`

    const fbCopy      = `${captions.facebook}\n\n${articleUrl}`
    const liCopy      = buildLinkedInCaption(captions.linkedin, post.category, articleUrl)
    const twitterCopy = buildXCaption(captions.twitter, post.category, articleUrl)
    const igCopy      = buildInstagramCaption(captions.instagram, post.category, articleUrl)

    // Always publish to Facebook (image post)
    const fbResult = await publishToFacebook(fbCopy, imageUrl)

    let reelResult: PlatformResult = null
    let ytResult: PlatformResult = null
    let ttResult: PlatformResult = null
    let liResult: PlatformResult = null
    let twResult: PlatformResult = null
    let igResult: PlatformResult = null

    if (post.videoUrl) {
      const videoDescription  = `${captions.youtube}\n\n${articleUrl}`
      const tiktokCaption     = buildTikTokCaption(captions.tiktok, post.category, articleUrl)

      const [reelOutcome, ytOutcome, ttOutcome, liOutcome, twOutcome, igOutcome] = await Promise.allSettled([
        publishToFacebookReel(fbCopy, post.videoUrl),
        publishToYouTube(post.title, videoDescription, post.videoUrl, post.videoThumbnailUrl),
        publishToTikTok(tiktokCaption, post.videoUrl),
        // LinkedIn, X: try video, fall back to image on rejection
        tryVideoThenImage(publishToLinkedIn, liCopy, post.videoUrl, imageUrl, 'LinkedIn'),
        tryVideoThenImage(publishToX, twitterCopy, post.videoUrl, imageUrl, 'X'),
        // Instagram: try reel, fall back to image
        tryVideoThenImage(publishToInstagramReel, igCopy, post.videoUrl, imageUrl, 'Instagram'),
      ])

      reelResult = reelOutcome.status === 'fulfilled'
        ? { postSubmissionId: reelOutcome.value.postSubmissionId }
        : { error: reelOutcome.reason instanceof Error ? reelOutcome.reason.message : 'Facebook Reel publish failed' }
      if ('error' in (reelResult ?? {})) console.error('[publish-service] Facebook Reel error:', (reelResult as { error: string }).error)

      ytResult = ytOutcome.status === 'fulfilled'
        ? { postSubmissionId: ytOutcome.value.postSubmissionId }
        : { error: ytOutcome.reason instanceof Error ? ytOutcome.reason.message : 'YouTube publish failed' }
      if ('error' in (ytResult ?? {})) console.error('[publish-service] YouTube error:', (ytResult as { error: string }).error)

      ttResult = ttOutcome.status === 'fulfilled'
        ? { postSubmissionId: ttOutcome.value.postSubmissionId }
        : { error: ttOutcome.reason instanceof Error ? ttOutcome.reason.message : 'TikTok publish failed' }
      if ('error' in (ttResult ?? {})) console.error('[publish-service] TikTok error:', (ttResult as { error: string }).error)

      liResult = liOutcome.status === 'fulfilled' ? liOutcome.value : { error: liOutcome.reason instanceof Error ? liOutcome.reason.message : 'LinkedIn publish failed' }
      twResult = twOutcome.status === 'fulfilled' ? twOutcome.value : { error: twOutcome.reason instanceof Error ? twOutcome.reason.message : 'X publish failed' }
      igResult = igOutcome.status === 'fulfilled' ? igOutcome.value : { error: igOutcome.reason instanceof Error ? igOutcome.reason.message : 'Instagram publish failed' }
    } else {
      // No video — LinkedIn, X, and Instagram get image posts
      const [liOutcome, twOutcome, igOutcome] = await Promise.allSettled([
        publishToLinkedIn(liCopy, imageUrl),
        publishToX(twitterCopy, imageUrl),
        publishToInstagram(igCopy, imageUrl),
      ])
      liResult = liOutcome.status === 'fulfilled'
        ? { postSubmissionId: liOutcome.value.postSubmissionId }
        : { error: liOutcome.reason instanceof Error ? liOutcome.reason.message : 'LinkedIn publish failed' }
      twResult = twOutcome.status === 'fulfilled'
        ? { postSubmissionId: twOutcome.value.postSubmissionId }
        : { error: twOutcome.reason instanceof Error ? twOutcome.reason.message : 'X publish failed' }
      igResult = igOutcome.status === 'fulfilled'
        ? { postSubmissionId: igOutcome.value.postSubmissionId }
        : { error: igOutcome.reason instanceof Error ? igOutcome.reason.message : 'Instagram publish failed' }
      if (igResult && 'error' in igResult) console.error('[publish-service] Instagram error:', igResult.error)
    }

    await markPublished(
      postId,
      fbResult.postSubmissionId,
      ytResult    && 'postSubmissionId' in ytResult    ? (ytResult    as { postSubmissionId: string }).postSubmissionId : undefined,
      ttResult    && 'postSubmissionId' in ttResult    ? (ttResult    as { postSubmissionId: string }).postSubmissionId : undefined,
      reelResult  && 'postSubmissionId' in reelResult  ? (reelResult  as { postSubmissionId: string }).postSubmissionId : undefined,
      liResult    && 'postSubmissionId' in liResult    ? (liResult    as { postSubmissionId: string }).postSubmissionId : undefined,
      twResult    && 'postSubmissionId' in twResult    ? (twResult    as { postSubmissionId: string }).postSubmissionId : undefined,
      igResult    && 'postSubmissionId' in igResult    ? (igResult    as { postSubmissionId: string }).postSubmissionId : undefined,
      publishedAtOverride,
    )

    if (!socialCopy) {
      const writeClient = getSanityWriteClient()
      await writeClient.patch(postId).set({ socialCopy: captions.facebook }).commit()
    }

    return {
      ok: true,
      facebook: { postSubmissionId: fbResult.postSubmissionId },
      facebookReel: reelResult,
      youtube: ytResult,
      tiktok: ttResult,
      linkedin: liResult,
      twitter: twResult,
      instagram: igResult,
    }
  } catch (err) {
    console.error('[publish-service] Publish error:', err instanceof Error ? err.message : err)
    try { await markPublishFailed(postId) } catch { /* ignore secondary error */ }
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown publish error' }
  }
}
