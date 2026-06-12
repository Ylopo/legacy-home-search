import { NextResponse } from 'next/server'
import { getVAQueuePost } from '@/sanity/queries'
import { getSanityWriteClient } from '@/lib/sanity-write'
import { publishToFacebookReel, publishToYouTube, publishToTikTok, publishToLinkedIn, publishToX } from '@/lib/oneup-client'
import { generatePlatformCaptions, buildTikTokCaption, buildLinkedInCaption, buildXCaption } from '@/lib/publish-service'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Republishes video to all video-capable platforms for an already-published post.
// Use this when replacing a video with a corrected version — the website and
// Facebook text post are untouched; only the video platforms are updated.
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('secret') !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { postId, videoUrl, videoThumbnailUrl } = await request.json() as {
    postId: string
    videoUrl: string
    videoThumbnailUrl?: string
  }

  if (!postId) return NextResponse.json({ error: 'postId is required' }, { status: 400 })
  if (!videoUrl) return NextResponse.json({ error: 'videoUrl is required' }, { status: 400 })

  const post = await getVAQueuePost(postId)
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  // Save the new video URL to Sanity before publishing
  const client = getSanityWriteClient()
  const patch: Record<string, string> = { videoUrl }
  if (videoThumbnailUrl) patch.videoThumbnailUrl = videoThumbnailUrl
  await client.patch(postId).set(patch).commit()

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.legacyhometeamlpt.com').replace(/\/+$/, '')
  const articleUrl = `${appUrl}/blog/${post.slug}`

  const captions = post.socialCopy
    ? { facebook: post.socialCopy, linkedin: post.socialCopy, twitter: post.socialCopy, tiktok: post.socialCopy, youtube: post.socialCopy }
    : await generatePlatformCaptions(post)

  const fbCopy       = `${captions.facebook}\n\n${articleUrl}`
  const liCopy       = buildLinkedInCaption(captions.linkedin, post.category, articleUrl)
  const twitterCopy  = buildXCaption(captions.twitter, post.category, articleUrl)
  const ytDesc       = `${captions.youtube}\n\n${articleUrl}`
  const tiktokCaption = buildTikTokCaption(captions.tiktok, post.category, articleUrl)

  const [reelOutcome, ytOutcome, ttOutcome, liOutcome, twOutcome] = await Promise.allSettled([
    publishToFacebookReel(fbCopy, videoUrl),
    publishToYouTube(post.title, ytDesc, videoUrl, videoThumbnailUrl),
    publishToTikTok(tiktokCaption, videoUrl),
    publishToLinkedIn(liCopy, videoUrl),
    publishToX(twitterCopy, videoUrl),
  ])

  const facebookReel = reelOutcome.status === 'fulfilled'
    ? { postSubmissionId: reelOutcome.value.postSubmissionId }
    : { error: reelOutcome.reason instanceof Error ? reelOutcome.reason.message : 'Facebook Reel failed' }

  const youtube = ytOutcome.status === 'fulfilled'
    ? { postSubmissionId: ytOutcome.value.postSubmissionId }
    : { error: ytOutcome.reason instanceof Error ? ytOutcome.reason.message : 'YouTube failed' }

  const tiktok = ttOutcome.status === 'fulfilled'
    ? { postSubmissionId: ttOutcome.value.postSubmissionId }
    : { error: ttOutcome.reason instanceof Error ? ttOutcome.reason.message : 'TikTok failed' }

  const linkedin = liOutcome.status === 'fulfilled'
    ? { postSubmissionId: liOutcome.value.postSubmissionId }
    : { error: liOutcome.reason instanceof Error ? liOutcome.reason.message : 'LinkedIn failed' }

  const twitter = twOutcome.status === 'fulfilled'
    ? { postSubmissionId: twOutcome.value.postSubmissionId }
    : { error: twOutcome.reason instanceof Error ? twOutcome.reason.message : 'X failed' }

  // Update Sanity submission IDs for the new videos
  const idPatch: Record<string, string> = {}
  if ('postSubmissionId' in facebookReel && facebookReel.postSubmissionId) idPatch.facebookReelSubmissionId   = facebookReel.postSubmissionId
  if ('postSubmissionId' in youtube     && youtube.postSubmissionId)        idPatch.youtubePostSubmissionId    = youtube.postSubmissionId
  if ('postSubmissionId' in tiktok      && tiktok.postSubmissionId)         idPatch.tiktokPostSubmissionId     = tiktok.postSubmissionId
  if ('postSubmissionId' in linkedin    && linkedin.postSubmissionId)       idPatch.linkedinPostSubmissionId   = linkedin.postSubmissionId
  if ('postSubmissionId' in twitter     && twitter.postSubmissionId)        idPatch.twitterPostSubmissionId    = twitter.postSubmissionId
  if (Object.keys(idPatch).length) await client.patch(postId).set(idPatch).commit()

  return NextResponse.json({ ok: true, facebookReel, youtube, tiktok, linkedin, twitter })
}
