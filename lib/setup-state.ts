import { Redis } from '@upstash/redis'

const KEY_PREFIX = 'setup:'

function getRedis(): Redis | null {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

export async function getStepStates(setupId: string): Promise<Record<string, boolean>> {
  const redis = getRedis()
  if (!redis) return {}
  const data = await redis.get<Record<string, boolean>>(KEY_PREFIX + setupId)
  return data ?? {}
}

export async function setStepState(setupId: string, stepId: string, done: boolean): Promise<Record<string, boolean>> {
  const redis = getRedis()
  if (!redis) return { [stepId]: done }
  const current = (await redis.get<Record<string, boolean>>(KEY_PREFIX + setupId)) ?? {}
  current[stepId] = done
  await redis.set(KEY_PREFIX + setupId, current)
  return current
}
