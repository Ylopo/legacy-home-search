import { client } from './client'

// ─── Types ──────────────────────────────────────────────────────────────────

export type SanityHomepage = {
  heroHeadline?: string
  heroSubheadline?: string
  ctaStripHeadline?: string
  ctaStripBody?: string
  trustStats?: Array<{ value: string; label: string; isStatic?: boolean }>
}

export type SanityCommunityPage = {
  name?: string
  heroHeadline?: string
  heroSubheadline?: string
  overviewTitle?: string
  overviewBody?: any[]
  metaTitle?: string
  metaDescription?: string
  quickStats?: Array<{ key: string; value: string }>
  heroImage?: any
  heroImageUrl?: string
  sectionImages?: Array<{ role: string; image: any; imageUrl?: string }>
}

export type SanityReview = {
  _id: string
  platform: 'google' | 'zillow'
  reviewerName: string
  reviewText: string
}

export type SanitySiteSettings = {
  agentName?: string
  phone?: string
  email?: string
  licenseNumber?: string
  address?: string
  brokerage?: string
  tagline?: string
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function getHomepage(): Promise<SanityHomepage | null> {
  return client.fetch(
    `*[_type == "homepage" && _id == "homepage"][0]{
      heroHeadline, heroSubheadline, ctaStripHeadline, ctaStripBody,
      trustStats[]{ value, label, isStatic }
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getFeaturedReviews(): Promise<SanityReview[]> {
  return client.fetch(
    `*[_type == "review" && featured == true] | order(sortOrder asc){
      _id, platform, reviewerName, reviewText
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getCommunityPage(slug: string): Promise<SanityCommunityPage | null> {
  return client.fetch(
    `*[_type == "communityPage" && slug.current == $slug][0]{
      name, heroHeadline, heroSubheadline,
      overviewTitle, overviewBody,
      metaTitle, metaDescription,
      quickStats[]{ key, value },
      heroImage,
      "heroImageUrl": heroImage.asset->url,
      sectionImages[]{ role, image, "imageUrl": image.asset->url }
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  return client.fetch(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]{
      agentName, phone, email, licenseNumber, address, brokerage, tagline
    }`,
    {},
    { next: { revalidate: 300 } }
  )
}

// ─── Team Members ─────────────────────────────────────────────────────────────

export type SanityTeamMember = {
  _id: string
  name: string
  slug: string
  title?: string
  phone?: string
  email?: string
  photoUrl?: string
  photoPath?: string
  subdomain?: string
  bio?: string[]
  specialties?: string[]
  years?: string | null
  transactions?: string | null
  sortOrder?: number
  active?: boolean
}

export async function getTeamMembers(): Promise<SanityTeamMember[]> {
  return client.fetch(
    `*[_type == "teamMember" && active != false] | order(sortOrder asc, name asc){
      _id, name, "slug": slug.current, title, phone, email,
      "photoUrl": photo.asset->url, photoPath,
      subdomain, bio, specialties, years, transactions, sortOrder, active
    }`,
    {},
    { next: { revalidate: 60 } }
  )
}

export async function getAllTeamMemberSlugs(): Promise<string[]> {
  const results = await client.fetch<Array<{ slug: string }>>(
    `*[_type == "teamMember"]{ "slug": slug.current }`,
    {},
    { next: { revalidate: 60 } }
  )
  return results.map((r) => r.slug)
}

export async function getTeamMember(slug: string): Promise<SanityTeamMember | null> {
  return client.fetch(
    `*[_type == "teamMember" && slug.current == $slug][0]{
      _id, name, "slug": slug.current, title, phone, email,
      "photoUrl": photo.asset->url, photoPath,
      subdomain, bio, specialties, years, transactions, sortOrder, active
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export type SanityBlogPost = {
  _id: string
  title: string
  slug: string
  publishedAt: string
  lastRefreshedAt?: string
  category: string
  excerpt?: string
  coverImage?: any
  heroBannerImage?: any
  body?: any[]
  metaTitle?: string
  metaDescription?: string
  aiGenerated?: boolean
  sourceUrl?: string
  pinnedForCommunities?: string[]
  // Workflow fields (new posts only)
  workflowStatus?: WorkflowStatus
  blotatoPostSubmissionId?: string
  blotatoPublishStatus?: string
  blotatoPublishedAt?: string
  facebookPostUrl?: string
  socialCopy?: string
  socialDeclined?: boolean
  videoScript?: string
  videoUrl?: string
  videoThumbnailUrl?: string
  youtubePostSubmissionId?: string
  tiktokPostSubmissionId?: string
  facebookReelSubmissionId?: string
  youtubePostUrl?: string
  tiktokPostUrl?: string
  linkedinPostSubmissionId?: string
  twitterPostSubmissionId?: string
  threadsPostSubmissionId?: string
  instagramPostSubmissionId?: string
  scheduledPublishAt?: string
}

export type WorkflowStatus =
  | 'media_pending'
  | 'media_ready'
  | 'publish_pending'
  | 'publishing'
  | 'scheduled'
  | 'published'
  | 'publish_failed'

// Backwards-compatible public filter: shows old posts (status=published or undefined) AND
// new workflow posts (workflowStatus=published). Hides anything in-progress.
const PUBLIC_FILTER = `(
  (!defined(workflowStatus) && (!defined(status) || status == "published")) ||
  workflowStatus == "published"
)`

export async function getBlogPosts(limit = 20): Promise<SanityBlogPost[]> {
  return client.fetch(
    `*[_type == "blogPost" && ${PUBLIC_FILTER}] | order(publishedAt desc)[0...$limit]{
      _id, title, "slug": slug.current, publishedAt,
      category, excerpt, coverImage, aiGenerated
    }`,
    { limit: limit - 1 },
    { next: { revalidate: 60 } }
  )
}

export async function getBlogPostsPaginated(opts: {
  page?: number
  perPage?: number
  search?: string
  category?: string
}): Promise<{ posts: SanityBlogPost[]; total: number }> {
  const { page = 1, perPage = 25, search = '', category = '' } = opts
  const offset = (page - 1) * perPage
  const end    = offset + perPage - 1
  const q      = search ? `*${search.trim()}*` : ''

  const filter = `
    _type == "blogPost" &&
    ${PUBLIC_FILTER} &&
    ($q == "" || title match $q || excerpt match $q) &&
    ($category == "" || category == $category)
  `

  const [posts, total] = await Promise.all([
    client.fetch(
      `*[${filter}] | order(publishedAt desc)[$offset..$end]{
        _id, title, "slug": slug.current, publishedAt,
        category, excerpt, coverImage, aiGenerated
      }`,
      { q, category, offset, end },
      { next: { revalidate: 60 } }
    ),
    client.fetch(`count(*[${filter}])`, { q, category }, { next: { revalidate: 60 } }),
  ])

  return { posts, total: total as number }
}

export async function getBlogPost(slug: string): Promise<SanityBlogPost | null> {
  return client.fetch(
    `*[_type == "blogPost" && slug.current == $slug && ${PUBLIC_FILTER}][0]{
      _id, title, "slug": slug.current, publishedAt, lastRefreshedAt,
      category, excerpt, coverImage, heroBannerImage, body, metaTitle, metaDescription, aiGenerated
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}

export async function getVAQueue(): Promise<SanityBlogPost[]> {
  // Active (non-published) posts — all of them
  const active = await client.fetch(
    `*[_type == "blogPost" && workflowStatus in ["media_pending", "media_ready", "publish_pending", "publishing", "scheduled", "publish_failed"]] | order(publishedAt desc){
      _id, title, "slug": slug.current, publishedAt, category, excerpt,
      coverImage, workflowStatus, blotatoPublishStatus, facebookPostUrl, socialCopy, scheduledPublishAt
    }`,
    {},
    { next: { revalidate: 0 } }
  )
  // Published posts — most recent 30 so past posts are reachable for video replacement
  const published = await client.fetch(
    `*[_type == "blogPost" && workflowStatus == "published"] | order(publishedAt desc)[0...30]{
      _id, title, "slug": slug.current, publishedAt, category, excerpt,
      coverImage, workflowStatus, blotatoPublishStatus, facebookPostUrl, socialCopy, scheduledPublishAt
    }`,
    {},
    { next: { revalidate: 0 } }
  )
  return [...active, ...published]
}

// Posts published to the blog but not yet posted to Facebook (last 21 days)
export async function getSocialQueue(): Promise<SanityBlogPost[]> {
  const cutoff = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
  return client.fetch(
    `*[
      _type == "blogPost" &&
      (
        (!defined(workflowStatus) && (!defined(status) || status == "published")) ||
        workflowStatus == "published"
      ) &&
      !defined(facebookPostUrl) &&
      socialDeclined != true &&
      publishedAt > $cutoff
    ] | order(publishedAt desc)[0...30]{
      _id, title, "slug": slug.current, publishedAt, category, excerpt,
      coverImage, workflowStatus, blotatoPublishStatus, facebookPostUrl, socialDeclined, socialCopy
    }`,
    { cutoff },
    { next: { revalidate: 0 } }
  )
}

export async function getMonthlyPublishStats(): Promise<{ totalPosts: number; videoPosts: number }> {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const posts: { videoUrl?: string }[] = await client.fetch(
    `*[_type == "blogPost" && workflowStatus == "published" && publishedAt >= $startOfMonth]{ videoUrl }`,
    { startOfMonth },
    { next: { revalidate: 0 } }
  )
  const videoPosts = posts.filter(p => !!p.videoUrl).length
  return { totalPosts: posts.length, videoPosts }
}

export async function getVAQueuePost(id: string): Promise<SanityBlogPost | null> {
  return client.fetch(
    `*[_type == "blogPost" && _id == $id][0]{
      _id, title, "slug": slug.current, publishedAt, category, excerpt,
      coverImage, heroBannerImage, body, metaTitle, metaDescription,
      workflowStatus, blotatoPostSubmissionId, blotatoPublishStatus,
      blotatoPublishedAt, facebookPostUrl, socialCopy, videoScript,
      videoUrl, videoThumbnailUrl, youtubePostSubmissionId, tiktokPostSubmissionId,
      youtubePostUrl, tiktokPostUrl, facebookReelSubmissionId,
      linkedinPostSubmissionId, twitterPostSubmissionId, threadsPostSubmissionId, instagramPostSubmissionId, scheduledPublishAt
    }`,
    { id },
    { next: { revalidate: 0 } }
  )
}

export async function getScheduledPostsDue(now: string): Promise<SanityBlogPost[]> {
  return client.fetch(
    `*[_type == "blogPost" && workflowStatus == "scheduled" && scheduledPublishAt <= $now]{
      _id, title, "slug": slug.current, publishedAt, category,
      workflowStatus, scheduledPublishAt
    }`,
    { now },
    { next: { revalidate: 0 } }
  )
}

// ─── Community Blog Posts ─────────────────────────────────────────────────────

export type CommunityPost = {
  _id: string
  title: string
  slug: string
  publishedAt: string
  coverImage?: any
  coverImageUrl?: string
  excerpt?: string
  category?: string
}

export async function getBlogPostsByCommunity(_communityName: string, limit = 5): Promise<CommunityPost[]> {
  return client.fetch(
    `*[_type == "blogPost" && ${PUBLIC_FILTER}]
     | order(publishedAt desc) [0...$limit]{
       _id, title, "slug": slug.current, publishedAt,
       coverImage, "coverImageUrl": coverImage.asset->url,
       excerpt, category
     }`,
    { limit: limit - 1 },
    { next: { revalidate: 3600 } }
  )
}

export async function getFeaturedPostsForCommunity(communitySlug: string): Promise<CommunityPost[]> {
  return client.fetch(
    `*[_type == "blogPost" && ${PUBLIC_FILTER}
       && $slug in pinnedForCommunities]
     | order(publishedAt desc){
       _id, title, "slug": slug.current, publishedAt,
       coverImage, "coverImageUrl": coverImage.asset->url,
       excerpt, category
     }`,
    { slug: communitySlug },
    { next: { revalidate: 3600 } }
  )
}

export type SocialDashboardPost = {
  _id: string
  title: string
  slug: string
  category: string
  publishedAt: string
  hasFacebook: boolean
  hasFacebookReel: boolean
  hasYouTube: boolean
  hasTikTok: boolean
  hasLinkedIn: boolean
  hasTwitter: boolean
  hasThreads: boolean
  hasInstagram: boolean
  facebookPostUrl?: string
}

export async function getSocialDashboardPosts(): Promise<SocialDashboardPost[]> {
  const raw = await client.fetch(
    `*[_type == "blogPost" && (workflowStatus == "published" || status == "published")] | order(publishedAt desc)[0...200]{
      _id, title, "slug": slug.current, category, publishedAt,
      blotatoPublishStatus, facebookPostUrl,
      facebookReelSubmissionId,
      youtubePostSubmissionId,
      tiktokPostSubmissionId,
      linkedinPostSubmissionId,
      twitterPostSubmissionId,
      threadsPostSubmissionId,
      instagramPostSubmissionId,
    }`,
    {},
    { next: { revalidate: 0 } }
  )
  return raw.map((p: any) => ({
    _id: p._id,
    title: p.title,
    slug: p.slug,
    category: p.category,
    publishedAt: p.publishedAt,
    hasFacebook: p.blotatoPublishStatus === 'published' || !!p.facebookPostUrl,
    hasFacebookReel: !!p.facebookReelSubmissionId,
    hasYouTube: !!p.youtubePostSubmissionId,
    hasTikTok: !!p.tiktokPostSubmissionId,
    hasLinkedIn: !!p.linkedinPostSubmissionId,
    hasTwitter: !!p.twitterPostSubmissionId,
    hasThreads: !!p.threadsPostSubmissionId,
    hasInstagram: !!p.instagramPostSubmissionId,
    facebookPostUrl: p.facebookPostUrl,
  }))
}

// ─── Content Refresh ──────────────────────────────────────────────────────────

export type RefreshPostSummary = {
  _id: string
  title: string
  slug: string
  category: string
  publishedAt: string
  lastRefreshedAt?: string
  refreshTier?: string
  refreshExcluded?: boolean
  refreshCount?: number
}

export async function getPublishedPostsForRefresh(): Promise<RefreshPostSummary[]> {
  return client.fetch(
    `*[_type == "blogPost" && (workflowStatus == "published" || status == "published")] | order(publishedAt asc){
      _id, title, "slug": slug.current, category, publishedAt,
      lastRefreshedAt, refreshTier, refreshExcluded, refreshCount
    }`,
    {},
    { next: { revalidate: 0 } }
  )
}

export type RefreshablePost = {
  _id: string
  title: string
  slug: string
  category: string
  publishedAt: string
  excerpt?: string
  body?: any[]
  metaTitle?: string
  metaDescription?: string
  lastRefreshedAt?: string
  refreshTier?: string
  refreshCount?: number
}

export async function getRefreshablePost(id: string): Promise<RefreshablePost | null> {
  return client.fetch(
    `*[_type == "blogPost" && _id == $id][0]{
      _id, title, "slug": slug.current, category, publishedAt,
      excerpt, body, metaTitle, metaDescription,
      lastRefreshedAt, refreshTier, refreshCount
    }`,
    { id },
    { next: { revalidate: 0 } }
  )
}

export async function getQueueCounts(): Promise<{ media_pending: number; media_ready: number }> {
  const counts = await client.fetch(
    `{
      "media_pending": count(*[_type == "blogPost" && workflowStatus == "media_pending"]),
      "media_ready":   count(*[_type == "blogPost" && workflowStatus == "media_ready"])
    }`,
    {},
    { next: { revalidate: 0 } }
  )
  return counts
}

// ─── Market Reports ───────────────────────────────────────────────────────────

export type SanityMarketReport = {
  _id: string
  community: string
  communityName: string
  reportPeriod: string
  slug: string
  publishedAt?: string
  medianListPrice?: string
  medianPriceChange?: string
  daysOnMarket?: string
  activeInventory?: string
  inventoryChange?: string
  priceReductions?: string
  marketSummary?: string
  buyerSection?: string
  sellerSection?: string
  investorSection?: string
  barrysTake?: string
  coverImage?: any
  metaTitle?: string
  metaDescription?: string
}

export async function getMarketReports(limit = 24): Promise<SanityMarketReport[]> {
  return client.fetch(
    `*[_type == "marketReport" && published == true] | order(publishedAt desc)[0...$limit]{
      _id, community, communityName, reportPeriod, "slug": slug.current,
      publishedAt, medianListPrice, medianPriceChange, marketSummary, coverImage
    }`,
    { limit: limit - 1 },
    { next: { revalidate: 60 } }
  )
}

export async function getMarketReport(slug: string): Promise<SanityMarketReport | null> {
  return client.fetch(
    `*[_type == "marketReport" && slug.current == $slug && published == true][0]{
      _id, community, communityName, reportPeriod, "slug": slug.current, publishedAt,
      medianListPrice, medianPriceChange, daysOnMarket, activeInventory,
      inventoryChange, priceReductions, marketSummary, buyerSection,
      sellerSection, investorSection, barrysTake, coverImage,
      metaTitle, metaDescription
    }`,
    { slug },
    { next: { revalidate: 60 } }
  )
}

export async function getLatestMarketReport(community: string): Promise<SanityMarketReport | null> {
  return client.fetch(
    `*[_type == "marketReport" && community == $community && published == true] | order(publishedAt desc)[0]{
      _id, community, communityName, reportPeriod, "slug": slug.current,
      publishedAt, medianListPrice, medianPriceChange, marketSummary
    }`,
    { community },
    { next: { revalidate: 60 } }
  )
}
