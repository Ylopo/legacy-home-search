/**
 * lib/refresh-store.ts
 *
 * Redis persistence for the content refresh subsystem.
 * Mirrors the pattern from lib/idea-store.ts.
 *
 * Redis keys:
 *   lhs:refresh:candidate:{postId}   JSON blob, 7-day TTL — RefreshCandidate
 *   lhs:refresh:queue                sorted set: score → postId
 *   lhs:refresh:skip:{postId}        empty string, 30-day TTL (skip flag)
 *   lhs:refresh:log:{postId}:{ts}    JSON audit entry, 90-day TTL
 */

import { Redis } from '@upstash/redis'
import type { RefreshCandidate } from './refresh-engine'

const CANDIDATE_TTL = 7  * 24 * 60 * 60  // 7 days
const SKIP_TTL      = 30 * 24 * 60 * 60  // 30 days
const LOG_TTL       = 90 * 24 * 60 * 60  // 90 days

const QUEUE_KEY = 'lhs:refresh:queue'

function getRedis(): Redis {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) throw new Error('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN')
  return new Redis({ url, token })
}

function candidateKey(postId: string) { return `lhs:refresh:candidate:${postId}` }
function skipKey(postId: string)      { return `lhs:refresh:skip:${postId}` }
function logKey(postId: string, ts: string) { return `lhs:refresh:log:${postId}:${ts}` }

// ─── Queue management ─────────────────────────────────────────────────────────

export async function saveRefreshQueue(candidates: RefreshCandidate[]): Promise<void> {
  const redis = getRedis()

  // Clear the old queue and save fresh candidates
  await redis.del(QUEUE_KEY)

  for (const c of candidates) {
    await redis.set(candidateKey(c.postId), JSON.stringify(c), { ex: CANDIDATE_TTL })
    await redis.zadd(QUEUE_KEY, { score: c.priorityScore, member: c.postId })
  }
}

export async function getRefreshQueue(): Promise<RefreshCandidate[]> {
  const redis = getRedis()

  const ids = await redis.zrange<string[]>(QUEUE_KEY, 0, -1, { rev: true })
  if (!ids || ids.length === 0) return []

  const candidates: RefreshCandidate[] = []
  const stale: string[] = []

  for (const id of ids) {
    const raw = await redis.get<string>(candidateKey(id))
    if (!raw) {
      stale.push(id)
      continue
    }
    const c: RefreshCandidate = typeof raw === 'string' ? JSON.parse(raw) : raw
    candidates.push(c)
  }

  if (stale.length > 0) {
    await redis.zrem(QUEUE_KEY, ...stale)
  }

  return candidates
}

export async function removeFromQueue(postId: string): Promise<void> {
  const redis = getRedis()
  await redis.zrem(QUEUE_KEY, postId)
  await redis.del(candidateKey(postId))
}

// ─── Skip (30-day defer) ──────────────────────────────────────────────────────

export async function skipRefreshCandidate(postId: string): Promise<void> {
  const redis = getRedis()
  await redis.set(skipKey(postId), '1', { ex: SKIP_TTL })
  await removeFromQueue(postId)
}

export async function getSkippedIds(): Promise<Set<string>> {
  // The skip pattern uses individual keys, not a set.
  // For queue building we check each candidate individually.
  // This returns an empty set — callers should use isSkipped() per post.
  return new Set<string>()
}

export async function isSkipped(postId: string): Promise<boolean> {
  const redis = getRedis()
  const val = await redis.get(skipKey(postId))
  return val !== null
}

// For bulk evaluation: fetch skip status for a list of post IDs efficiently
export async function getSkippedIdsFromList(postIds: string[]): Promise<Set<string>> {
  if (postIds.length === 0) return new Set()
  const redis = getRedis()
  const skipped = new Set<string>()
  // Batch check — Redis doesn't support mget with TTL keys easily, so we check individually
  // For typical queue sizes (20-200 posts) this is acceptable
  await Promise.all(
    postIds.map(async (id) => {
      const val = await redis.get(skipKey(id))
      if (val !== null) skipped.add(id)
    })
  )
  return skipped
}

// ─── Audit log ────────────────────────────────────────────────────────────────

export interface RefreshAuditEntry {
  postId: string
  postTitle: string
  refreshedAt: string
  action: string
  playbook: string[]
  claudeModel: string
}

export async function saveRefreshLog(entry: RefreshAuditEntry): Promise<void> {
  const redis = getRedis()
  const ts = new Date().getTime().toString()
  await redis.set(logKey(entry.postId, ts), JSON.stringify(entry), { ex: LOG_TTL })
}

export async function getRefreshLogs(postId: string): Promise<RefreshAuditEntry[]> {
  const redis = getRedis()
  // Scan for all log keys for this post — for display in future audit views
  // Using a simple pattern: lhs:refresh:log:{postId}:*
  // Since Upstash Redis doesn't support SCAN in all tiers, we skip enumeration for now
  // and return empty. The audit log is primarily for record-keeping.
  return []
}
