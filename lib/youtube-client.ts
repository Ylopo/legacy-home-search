/**
 * YouTube Data API v3 client (public channel stats only — no OAuth needed)
 *
 * Requires env vars:
 *   YOUTUBE_API_KEY     — API key with YouTube Data API v3 enabled
 *   YOUTUBE_CHANNEL_ID  — channel ID (e.g. "UCiD74WLUZtubbGjz8BtMY5A")
 */

export type YTChannelStats = {
  channelTitle: string
  subscribers: number
  totalViews: number
  videoCount: number
  thumbnailUrl?: string
}

export type YTVideo = {
  videoId: string
  title: string
  publishedAt: string
  thumbnailUrl?: string
  views: number
  likes: number
  comments: number
  duration?: string  // ISO 8601 e.g. "PT1M30S"
}

export type YouTubeOverview = {
  channel: YTChannelStats
  recentVideos: YTVideo[]
  topVideos: YTVideo[]      // sorted by views, last 50 uploads
  recentViews: number       // sum of views across recent videos
  recentLikes: number
  recentComments: number
}

const API_BASE = 'https://www.googleapis.com/youtube/v3'

function key() {
  const k = process.env.YOUTUBE_API_KEY
  return k && k.trim() ? k.trim() : null
}
function channelId() {
  const id = process.env.YOUTUBE_CHANNEL_ID
  return id && id.trim() ? id.trim() : null
}

async function ytFetch(path: string, params: Record<string, string>) {
  const k = key()
  if (!k) throw new Error('YOUTUBE_API_KEY not set')
  const url = new URL(`${API_BASE}${path}`)
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value)
  url.searchParams.set('key', k)
  const res = await fetch(url.toString())
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`YouTube API ${res.status}: ${text.slice(0, 200)}`)
  }
  return res.json()
}

export async function getYouTubeOverview(): Promise<YouTubeOverview | null> {
  const id = channelId()
  if (!id || !key()) return null

  try {
    // 1. Channel info
    const channelRes = await ytFetch('/channels', {
      part: 'snippet,statistics,contentDetails',
      id,
    })
    const channel = channelRes.items?.[0]
    if (!channel) return null

    const uploadsPlaylistId: string | undefined =
      channel.contentDetails?.relatedPlaylists?.uploads
    const stats: YTChannelStats = {
      channelTitle: channel.snippet?.title ?? 'Unknown',
      subscribers: Number(channel.statistics?.subscriberCount ?? 0),
      totalViews: Number(channel.statistics?.viewCount ?? 0),
      videoCount: Number(channel.statistics?.videoCount ?? 0),
      thumbnailUrl: channel.snippet?.thumbnails?.medium?.url,
    }

    let videos: YTVideo[] = []
    if (uploadsPlaylistId) {
      // 2. List up to 50 recent uploads
      const uploadsRes = await ytFetch('/playlistItems', {
        part: 'snippet,contentDetails',
        playlistId: uploadsPlaylistId,
        maxResults: '50',
      })
      const videoIds: string[] = (uploadsRes.items ?? [])
        .map((v: any) => v.contentDetails?.videoId)
        .filter(Boolean)

      // 3. Fetch stats for those videos in one batched call
      if (videoIds.length) {
        const statsRes = await ytFetch('/videos', {
          part: 'snippet,statistics,contentDetails',
          id: videoIds.join(','),
        })
        videos = (statsRes.items ?? []).map((v: any) => ({
          videoId: v.id,
          title: v.snippet?.title ?? '',
          publishedAt: v.snippet?.publishedAt ?? '',
          thumbnailUrl: v.snippet?.thumbnails?.medium?.url,
          views: Number(v.statistics?.viewCount ?? 0),
          likes: Number(v.statistics?.likeCount ?? 0),
          comments: Number(v.statistics?.commentCount ?? 0),
          duration: v.contentDetails?.duration,
        }))
      }
    }

    const recentVideos = [...videos].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    const topVideos = [...videos].sort((a, b) => b.views - a.views).slice(0, 10)

    const recentViews    = videos.reduce((s, v) => s + v.views, 0)
    const recentLikes    = videos.reduce((s, v) => s + v.likes, 0)
    const recentComments = videos.reduce((s, v) => s + v.comments, 0)

    return {
      channel: stats,
      recentVideos,
      topVideos,
      recentViews,
      recentLikes,
      recentComments,
    }
  } catch (err) {
    console.error('[youtube-client]', err)
    return null
  }
}
