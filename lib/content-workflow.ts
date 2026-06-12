/**
 * Content workflow state transitions and helpers.
 *
 * All state lives in Sanity on the blogPost document (workflowStatus field).
 * This module provides typed helpers so API routes don't deal with raw GROQ.
 */

import { getSanityWriteClient } from './sanity-write'
import type { WorkflowStatus } from '../sanity/queries'

export type { WorkflowStatus }

export const ACTIVE_QUEUE_STATUSES: WorkflowStatus[] = [
  'media_pending',
  'media_ready',
  'publish_pending',
  'publishing',
  'scheduled',
  'publish_failed',
]

// ─── State transitions ────────────────────────────────────────────────────────

export async function transitionStatus(
  postId: string,
  newStatus: WorkflowStatus,
): Promise<void> {
  const client = getSanityWriteClient()
  await client.patch(postId).set({ workflowStatus: newStatus }).commit()
}

export async function markMediaReady(
  postId: string,
  coverImageRef: { _type: 'reference'; _ref: string },
  socialCopy: string,
  videoScript?: string,
  videoUrl?: string,
  videoThumbnailUrl?: string,
): Promise<void> {
  const client = getSanityWriteClient()
  const patch: Record<string, unknown> = {
    coverImage: { _type: 'image', asset: coverImageRef },
    socialCopy,
    workflowStatus: 'media_ready' as WorkflowStatus,
  }
  if (videoScript) patch.videoScript = videoScript
  if (videoUrl) patch.videoUrl = videoUrl
  if (videoThumbnailUrl) patch.videoThumbnailUrl = videoThumbnailUrl
  await client.patch(postId).set(patch).commit()
}

export async function markPublishing(postId: string): Promise<void> {
  await transitionStatus(postId, 'publishing')
}

export async function markScheduled(postId: string, scheduledPublishAt: string): Promise<void> {
  const client = getSanityWriteClient()
  await client.patch(postId).set({ workflowStatus: 'scheduled' as WorkflowStatus, scheduledPublishAt }).commit()
}

export async function cancelScheduled(postId: string): Promise<void> {
  const client = getSanityWriteClient()
  await client.patch(postId).set({ workflowStatus: 'media_ready' as WorkflowStatus }).unset(['scheduledPublishAt']).commit()
}

// NOTE: `blotatoPostSubmissionId` field name is kept for Sanity schema
// compatibility, but now stores OneUp post IDs (the publish provider was
// migrated from Blotato to OneUp). Threads is no longer supported because
// OneUp doesn't expose it.
export async function markPublished(
  postId: string,
  blotatoPostSubmissionId: string,
  youtubePostSubmissionId?: string,
  tiktokPostSubmissionId?: string,
  facebookReelSubmissionId?: string,
  linkedinPostSubmissionId?: string,
  twitterPostSubmissionId?: string,
  instagramPostSubmissionId?: string,
  publishedAtOverride?: string,
): Promise<void> {
  const client = getSanityWriteClient()
  const patch: Record<string, unknown> = {
    workflowStatus: 'published' as WorkflowStatus,
    publishedAt: publishedAtOverride ?? new Date().toISOString(),
    blotatoPostSubmissionId,
    blotatoPublishStatus: 'pending',
  }
  if (youtubePostSubmissionId) patch.youtubePostSubmissionId = youtubePostSubmissionId
  if (tiktokPostSubmissionId) patch.tiktokPostSubmissionId = tiktokPostSubmissionId
  if (facebookReelSubmissionId) patch.facebookReelSubmissionId = facebookReelSubmissionId
  if (linkedinPostSubmissionId) patch.linkedinPostSubmissionId = linkedinPostSubmissionId
  if (twitterPostSubmissionId) patch.twitterPostSubmissionId = twitterPostSubmissionId
  if (instagramPostSubmissionId) patch.instagramPostSubmissionId = instagramPostSubmissionId
  await client.patch(postId).set(patch).commit()
}

export async function markPublishFailed(postId: string): Promise<void> {
  await transitionStatus(postId, 'publish_failed')
}

// For already-published posts getting social treatment for the first time
export async function patchSocialSubmission(
  postId: string,
  blotatoPostSubmissionId: string,
  socialCopy: string,
): Promise<void> {
  const client = getSanityWriteClient()
  await client
    .patch(postId)
    .set({ blotatoPostSubmissionId, blotatoPublishStatus: 'pending', socialCopy })
    .commit()
}

export async function markSocialDeclined(postId: string): Promise<void> {
  const client = getSanityWriteClient()
  await client.patch(postId).set({ socialDeclined: true }).commit()
}

export async function updateBlotatoStatus(
  postId: string,
  status: 'published' | 'failed',
  postUrl?: string,
): Promise<void> {
  const client = getSanityWriteClient()
  await client
    .patch(postId)
    .set({
      blotatoPublishStatus: status,
      ...(status === 'published' && {
        blotatoPublishedAt: new Date().toISOString(),
        facebookPostUrl: postUrl ?? null,
      }),
    })
    .commit()
}

export async function updateVideoPublishStatus(
  postId: string,
  platform: 'youtube' | 'tiktok',
  status: 'published' | 'failed',
  postUrl?: string,
): Promise<void> {
  const client = getSanityWriteClient()
  const urlField = platform === 'youtube' ? 'youtubePostUrl' : 'tiktokPostUrl'
  await client
    .patch(postId)
    .set({
      ...(status === 'published' && postUrl ? { [urlField]: postUrl } : {}),
    })
    .commit()
}
