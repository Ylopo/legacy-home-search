'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { upload } from '@vercel/blob/client'
import { AdminNav } from '@/components/AdminNav'
import type { SanityBlogPost, WorkflowStatus } from '@/sanity/queries'
type ThumbnailState =
  | { type: 'none' }
  | { type: 'upload'; file: File; previewUrl: string }
  | { type: 'saved' }

type VideoState =
  | { type: 'none' }
  | { type: 'uploading'; progress: number }
  | { type: 'ready'; url: string; filename: string }
  | { type: 'saved'; url: string }

type HeyGenState =
  | { type: 'idle' }
  | { type: 'generating'; videoId: string; message: string }
  | { type: 'ready'; url: string }

type PlatformStatus =
  | { phase: 'idle' }
  | { phase: 'publishing' }
  | { phase: 'polling'; submissionId: string }
  | { phase: 'done'; postUrl?: string }
  | { phase: 'error'; message: string }

type PublishState =
  | { phase: 'idle' }
  | { phase: 'saving' }
  | { phase: 'publishing' }
  | {
      phase: 'polling'
      facebook: PlatformStatus
      facebookReel: PlatformStatus
      youtube: PlatformStatus
      tiktok: PlatformStatus
      linkedin: PlatformStatus
      twitter: PlatformStatus
      threads: PlatformStatus
    }
  | {
      phase: 'done'
      facebook: PlatformStatus
      facebookReel: PlatformStatus
      youtube: PlatformStatus
      tiktok: PlatformStatus
      linkedin: PlatformStatus
      twitter: PlatformStatus
      threads: PlatformStatus
    }
  | { phase: 'error'; message: string }

const CATEGORY_LABELS: Record<string, string> = {
  'market-update': 'Market Update',
  'buying-tips':   'Buying Tips',
  'selling-tips':  'Selling Tips',
  'community-spotlight': 'Community Spotlight',
  'investment':    'Investment',
  'news':          'News',
}

export default function VAPostPage() {
  const params = useParams()
  const postId = params.postId as string

  const secret = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('secret') ?? ''
    : ''

  const [post, setPost] = useState<SanityBlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Media editor state
  const [thumbnail, setThumbnail] = useState<ThumbnailState>({ type: 'none' })
  const [socialCopy, setSocialCopy] = useState('')
  const [generatingCaption, setGeneratingCaption] = useState(false)
  const [videoScript, setVideoScript] = useState('')
  const [generatingScript, setGeneratingScript] = useState(false)
  const [video, setVideo] = useState<VideoState>({ type: 'none' })
  const [heygenState, setHeygenState] = useState<HeyGenState>({ type: 'idle' })
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState<string | null>(null)
  const [uploadingVideoThumb, setUploadingVideoThumb] = useState(false)
  const [videoUploadedAt, setVideoUploadedAt] = useState<Date | null>(null)
  const [videoPublishState, setVideoPublishState] = useState<
    | { phase: 'idle' }
    | { phase: 'publishing' }
    | { phase: 'done'; facebookReel: { postSubmissionId?: string; error?: string }; youtube: { postSubmissionId?: string; error?: string }; tiktok: { postSubmissionId?: string; error?: string } }
    | { phase: 'error'; message: string }
  >({ phase: 'idle' })
  const heygenPollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Publish state
  const [publishState, setPublishState] = useState<PublishState>({ phase: 'idle' })
  const pollRefs = useRef<Record<string, ReturnType<typeof setInterval>>>({})

  // Schedule state
  const [publishDelay, setPublishDelay] = useState<number | null>(null) // hours, null = now
  const [scheduleState, setScheduleState] = useState<'idle' | 'scheduling' | 'cancelling'>('idle')
  const [scheduleError, setScheduleError] = useState('')

  // ── Load post ────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      if (!secret) { setError('Unauthorized'); setLoading(false); return }
      try {
        const res = await fetch(`/api/content/post?secret=${encodeURIComponent(secret)}&postId=${encodeURIComponent(postId)}`)
        if (res.status === 401) { setError('Unauthorized'); return }
        if (res.status === 404) { setError('Post not found.'); return }
        if (!res.ok) { setError('Failed to load post'); return }
        const found: SanityBlogPost = await res.json()
        setPost(found)

        if (found) {
          setSocialCopy(found.socialCopy ?? '')
          setVideoScript(found.videoScript ?? '')

          if (found.workflowStatus === 'media_ready' || found.workflowStatus === 'published' || found.workflowStatus === 'scheduled') {
            setThumbnail({ type: 'saved' })
          }

          if (found.videoUrl) {
            setVideo({ type: 'saved', url: found.videoUrl })
          }
          if (found.videoThumbnailUrl) {
            setVideoThumbnailUrl(found.videoThumbnailUrl)
          }
        }
      } catch {
        setError('Failed to load post')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [postId, secret])

  // ── Cleanup polls on unmount ─────────────────────────────────────────────────
  useEffect(() => () => {
    Object.values(pollRefs.current).forEach(clearInterval)
    if (heygenPollRef.current) clearInterval(heygenPollRef.current)
  }, [])

  // ── Generate Facebook caption ────────────────────────────────────────────────
  async function handleGenerateCaption() {
    if (!post) return
    setGeneratingCaption(true)
    try {
      const res = await fetch(`/api/content/generate-caption?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: post.title, excerpt: post.excerpt, category: post.category }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setSocialCopy(data.caption)
    } catch {
      // leave existing copy unchanged
    } finally {
      setGeneratingCaption(false)
    }
  }

  // ── Generate video script ────────────────────────────────────────────────────
  async function handleGenerateScript() {
    if (!post) return
    setGeneratingScript(true)
    try {
      const res = await fetch(`/api/content/generate-script?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: post.title, excerpt: post.excerpt, category: post.category }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed')
      setVideoScript(data.script)
    } catch {
      // leave existing script unchanged
    } finally {
      setGeneratingScript(false)
    }
  }

  // ── Generate base video via HeyGen ──────────────────────────────────────────
  async function handleGenerateHeyGenVideo() {
    if (!videoScript.trim()) return
    if (heygenPollRef.current) clearInterval(heygenPollRef.current)

    try {
      const res = await fetch(`/api/content/generate-heygen-video?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: videoScript }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to start video generation')

      const { videoId } = data
      setHeygenState({ type: 'generating', videoId, message: 'Starting render…' })

      let elapsed = 0
      heygenPollRef.current = setInterval(async () => {
        elapsed += 15
        const minutes = Math.floor(elapsed / 60)
        const seconds = elapsed % 60
        const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`

        setHeygenState(prev =>
          prev.type === 'generating'
            ? { ...prev, message: `Rendering… ${timeStr}` }
            : prev
        )

        try {
          const statusRes = await fetch(
            `/api/content/heygen-status?secret=${encodeURIComponent(secret)}&videoId=${encodeURIComponent(videoId)}`
          )
          const statusData = await statusRes.json()

          if (statusData.status === 'completed') {
            clearInterval(heygenPollRef.current!)
            setHeygenState({ type: 'ready', url: statusData.videoUrl })
          } else if (statusData.status === 'failed') {
            clearInterval(heygenPollRef.current!)
            setHeygenState({ type: 'idle' })
            alert(`HeyGen render failed: ${statusData.error ?? 'Unknown error'}`)
          } else if (elapsed >= 600) {
            clearInterval(heygenPollRef.current!)
            setHeygenState({ type: 'idle' })
            alert('HeyGen render timed out after 10 minutes. Try again.')
          }
        } catch { /* keep polling */ }
      }, 15000)
    } catch (err) {
      setHeygenState({ type: 'idle' })
      alert(err instanceof Error ? err.message : 'Failed to generate video')
    }
  }

  // ── Video upload via Vercel Blob ─────────────────────────────────────────────
  async function handleVideoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setVideo({ type: 'uploading', progress: 0 })

    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: `/api/content/upload-video?secret=${encodeURIComponent(secret)}`,
        onUploadProgress: ({ percentage }) => {
          setVideo({ type: 'uploading', progress: Math.round(percentage) })
        },
      })

      setVideo({ type: 'ready', url: blob.url, filename: file.name })
      setVideoUploadedAt(new Date())
    } catch (err) {
      setVideo({ type: 'none' })
      alert(err instanceof Error ? err.message : 'Video upload failed')
    }

    // Reset input so the same file can be re-selected
    e.target.value = ''
  }

  function handleRemoveVideo() {
    setVideo({ type: 'none' })
  }

  // ── Publish video only (YouTube + TikTok) for already-published posts ────────
  async function handlePublishVideoOnly() {
    if (video.type !== 'ready') return
    setVideoPublishState({ phase: 'publishing' })
    try {
      const res = await fetch(`/api/content/publish-video?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          videoUrl: video.url,
          ...(videoThumbnailUrl ? { videoThumbnailUrl } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Publish failed')
      setVideoPublishState({ phase: 'done', facebookReel: data.facebookReel ?? {}, youtube: data.youtube ?? {}, tiktok: data.tiktok ?? {} })
    } catch (err) {
      setVideoPublishState({ phase: 'error', message: err instanceof Error ? err.message : 'Publish failed' })
    }
  }

  async function handleVideoThumbnailSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingVideoThumb(true)
    try {
      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: `/api/content/upload-video?secret=${encodeURIComponent(secret)}`,
      })
      setVideoThumbnailUrl(blob.url)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Thumbnail upload failed')
    } finally {
      setUploadingVideoThumb(false)
      e.target.value = ''
    }
  }

  // ── Upload thumbnail ─────────────────────────────────────────────────────────
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    setThumbnail({ type: 'upload', file, previewUrl })
  }

  // ── Mark Ready ───────────────────────────────────────────────────────────────
  async function handleMarkReady() {
    if (thumbnail.type !== 'upload') return

    setPublishState({ phase: 'saving' })

    try {
      const form = new FormData()
      form.append('postId', postId)
      form.append('socialCopy', socialCopy)
      if (videoScript) form.append('videoScript', videoScript)

      const videoUrl = video.type === 'ready' ? video.url :
                       video.type === 'saved' ? video.url : null
      if (videoUrl) form.append('videoUrl', videoUrl)
      if (videoThumbnailUrl) form.append('videoThumbnailUrl', videoThumbnailUrl)

      if (thumbnail.type === 'upload') {
        form.append('image', thumbnail.file)
      }

      const res = await fetch(`/api/content/mark-ready?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        body: form,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to save')

      setThumbnail({ type: 'saved' })
      if (video.type === 'ready') {
        setVideo(prev => prev.type === 'ready' ? { type: 'saved', url: prev.url } : prev)
      }
      setPost(prev => prev ? { ...prev, workflowStatus: 'media_ready' as WorkflowStatus } : prev)
      setPublishState({ phase: 'idle' })
    } catch (err) {
      setPublishState({ phase: 'error', message: err instanceof Error ? err.message : 'Save failed' })
    }
  }

  // ── Poll a single platform ───────────────────────────────────────────────────
  function startPoll(
    platform: 'facebook' | 'facebookReel' | 'youtube' | 'tiktok' | 'linkedin' | 'twitter' | 'threads',
    submissionId: string,
    onUpdate: (status: PlatformStatus) => void,
  ) {
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      try {
        const res = await fetch(
          `/api/content/blotato-status?secret=${encodeURIComponent(secret)}&postSubmissionId=${encodeURIComponent(submissionId)}&postId=${encodeURIComponent(postId)}&platform=${platform}`
        )
        const data = await res.json()

        if (data.status === 'published') {
          clearInterval(interval)
          delete pollRefs.current[platform]
          onUpdate({ phase: 'done', postUrl: data.postUrl })
        } else if (data.status === 'failed') {
          clearInterval(interval)
          delete pollRefs.current[platform]
          onUpdate({ phase: 'error', message: data.errorMessage ?? `${platform} publish failed` })
        } else if (attempts >= 30) {
          clearInterval(interval)
          delete pollRefs.current[platform]
          onUpdate({ phase: 'done' })
        }
      } catch { /* keep trying */ }
    }, 10000)

    pollRefs.current[platform] = interval
  }

  // ── Publish ──────────────────────────────────────────────────────────────────
  async function handlePublish() {
    setPublishState({ phase: 'saving' })

    try {
      // If thumbnail hasn't been uploaded to Sanity yet, do it now
      if (thumbnail.type === 'upload') {
        const form = new FormData()
        form.append('postId', postId)
        form.append('socialCopy', socialCopy)
        if (videoScript) form.append('videoScript', videoScript)
        if (video.type === 'ready') form.append('videoUrl', video.url)
        if (videoThumbnailUrl) form.append('videoThumbnailUrl', videoThumbnailUrl)
        form.append('image', thumbnail.file)

        const markRes = await fetch(`/api/content/mark-ready?secret=${encodeURIComponent(secret)}`, {
          method: 'POST',
          body: form,
        })
        if (!markRes.ok) {
          const d = await markRes.json()
          throw new Error(d.error ?? 'Failed to save thumbnail')
        }
        setThumbnail({ type: 'saved' })
        if (video.type === 'ready') {
          setVideo(prev => prev.type === 'ready' ? { type: 'saved', url: prev.url } : prev)
        }
      }

      setPublishState({ phase: 'publishing' })

      // Always pass the current video URL — if it was uploaded after mark-ready it won't be in Sanity yet
      const currentVideoUrl = video.type === 'ready' ? video.url : video.type === 'saved' ? video.url : undefined

      const res = await fetch(`/api/content/publish?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          socialCopy,
          ...(currentVideoUrl ? { videoUrl: currentVideoUrl } : {}),
          ...(videoThumbnailUrl ? { videoThumbnailUrl } : {}),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Publish failed')

      const initFb: PlatformStatus = data.facebook?.postSubmissionId
        ? { phase: 'polling', submissionId: data.facebook.postSubmissionId }
        : { phase: 'idle' }
      const initReel: PlatformStatus = data.facebookReel?.postSubmissionId
        ? { phase: 'polling', submissionId: data.facebookReel.postSubmissionId }
        : data.facebookReel?.error
        ? { phase: 'error', message: data.facebookReel.error }
        : { phase: 'idle' }
      const initYt: PlatformStatus = data.youtube?.postSubmissionId
        ? { phase: 'polling', submissionId: data.youtube.postSubmissionId }
        : data.youtube?.error
        ? { phase: 'error', message: data.youtube.error }
        : { phase: 'idle' }
      const initTt: PlatformStatus = data.tiktok?.postSubmissionId
        ? { phase: 'polling', submissionId: data.tiktok.postSubmissionId }
        : data.tiktok?.error
        ? { phase: 'error', message: data.tiktok.error }
        : { phase: 'idle' }
      const initLi: PlatformStatus = data.linkedin?.postSubmissionId
        ? { phase: 'polling', submissionId: data.linkedin.postSubmissionId }
        : data.linkedin?.error
        ? { phase: 'error', message: data.linkedin.error }
        : { phase: 'idle' }
      const initTw: PlatformStatus = data.twitter?.postSubmissionId
        ? { phase: 'polling', submissionId: data.twitter.postSubmissionId }
        : data.twitter?.error
        ? { phase: 'error', message: data.twitter.error }
        : { phase: 'idle' }
      const initTh: PlatformStatus = data.threads?.postSubmissionId
        ? { phase: 'polling', submissionId: data.threads.postSubmissionId }
        : data.threads?.error
        ? { phase: 'error', message: data.threads.error }
        : { phase: 'idle' }

      setPublishState({ phase: 'polling', facebook: initFb, facebookReel: initReel, youtube: initYt, tiktok: initTt, linkedin: initLi, twitter: initTw, threads: initTh })
      setPost(prev => prev ? { ...prev, workflowStatus: 'published' as WorkflowStatus } : prev)
      // Mark video as saved so the secondary "Publish Video" button doesn't appear
      setVideo(prev => prev.type === 'ready' ? { type: 'saved', url: prev.url } : prev)

      const resolved = {
        facebook: initFb.phase === 'idle',
        facebookReel: initReel.phase === 'idle',
        youtube: initYt.phase === 'idle',
        tiktok: initTt.phase === 'idle',
        linkedin: initLi.phase === 'idle',
        twitter: initTw.phase === 'idle',
        threads: initTh.phase === 'idle',
      }
      const statuses: Record<string, PlatformStatus> = {
        facebook: initFb, facebookReel: initReel,
        youtube: initYt, tiktok: initTt,
        linkedin: initLi, twitter: initTw, threads: initTh,
      }

      function checkAllDone() {
        if (resolved.facebook && resolved.facebookReel && resolved.youtube && resolved.tiktok && resolved.linkedin && resolved.twitter && resolved.threads) {
          setPublishState({ phase: 'done', facebook: statuses.facebook, facebookReel: statuses.facebookReel, youtube: statuses.youtube, tiktok: statuses.tiktok, linkedin: statuses.linkedin, twitter: statuses.twitter, threads: statuses.threads })
        }
      }

      if (data.facebook?.postSubmissionId) {
        startPoll('facebook', data.facebook.postSubmissionId, (s) => {
          statuses.facebook = s
          resolved.facebook = true
          setPublishState(prev => prev.phase === 'polling' ? { ...prev, facebook: s } : prev)
          checkAllDone()
        })
      } else {
        resolved.facebook = true
      }

      if (data.facebookReel?.postSubmissionId) {
        startPoll('facebookReel', data.facebookReel.postSubmissionId, (s) => {
          statuses.facebookReel = s
          resolved.facebookReel = true
          setPublishState(prev => prev.phase === 'polling' ? { ...prev, facebookReel: s } : prev)
          checkAllDone()
        })
      } else {
        resolved.facebookReel = true
      }

      if (data.youtube?.postSubmissionId) {
        startPoll('youtube', data.youtube.postSubmissionId, (s) => {
          statuses.youtube = s
          resolved.youtube = true
          setPublishState(prev => prev.phase === 'polling' ? { ...prev, youtube: s } : prev)
          checkAllDone()
        })
      } else {
        resolved.youtube = true
      }

      if (data.tiktok?.postSubmissionId) {
        startPoll('tiktok', data.tiktok.postSubmissionId, (s) => {
          statuses.tiktok = s
          resolved.tiktok = true
          setPublishState(prev => prev.phase === 'polling' ? { ...prev, tiktok: s } : prev)
          checkAllDone()
        })
      } else {
        resolved.tiktok = true
      }

      if (data.linkedin?.postSubmissionId) {
        startPoll('linkedin', data.linkedin.postSubmissionId, (s) => {
          statuses.linkedin = s
          resolved.linkedin = true
          setPublishState(prev => prev.phase === 'polling' ? { ...prev, linkedin: s } : prev)
          checkAllDone()
        })
      } else {
        resolved.linkedin = true
      }

      if (data.twitter?.postSubmissionId) {
        startPoll('twitter', data.twitter.postSubmissionId, (s) => {
          statuses.twitter = s
          resolved.twitter = true
          setPublishState(prev => prev.phase === 'polling' ? { ...prev, twitter: s } : prev)
          checkAllDone()
        })
      } else {
        resolved.twitter = true
      }

      if (data.threads?.postSubmissionId) {
        startPoll('threads', data.threads.postSubmissionId, (s) => {
          statuses.threads = s
          resolved.threads = true
          setPublishState(prev => prev.phase === 'polling' ? { ...prev, threads: s } : prev)
          checkAllDone()
        })
      } else {
        resolved.threads = true
      }

      checkAllDone()
    } catch (err) {
      setPublishState({ phase: 'error', message: err instanceof Error ? err.message : 'Publish failed' })
    }
  }

  async function handleSchedule() {
    if (!post || publishDelay === null) return
    setScheduleError('')
    setScheduleState('scheduling')
    try {
      const scheduledPublishAt = new Date(Date.now() + publishDelay * 3600 * 1000).toISOString()
      const videoUrl = video.type === 'ready' ? video.url : video.type === 'saved' ? video.url : undefined
      const res = await fetch(`/api/content/schedule?secret=${encodeURIComponent(secret)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post._id, scheduledPublishAt, videoUrl, videoThumbnailUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to schedule')
      setPost(prev => prev ? { ...prev, workflowStatus: 'scheduled', scheduledPublishAt } : prev)
      setScheduleState('idle')
    } catch (err) {
      setScheduleError(err instanceof Error ? err.message : 'Failed to schedule')
      setScheduleState('idle')
    }
  }

  async function handleCancelSchedule() {
    if (!post) return
    setScheduleState('cancelling')
    try {
      const res = await fetch(`/api/content/schedule?secret=${encodeURIComponent(secret)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post._id }),
      })
      if (!res.ok) throw new Error('Failed to cancel')
      setPost(prev => prev ? { ...prev, workflowStatus: 'media_ready', scheduledPublishAt: undefined } : prev)
      setPublishDelay(null)
      setScheduleState('idle')
    } catch {
      setScheduleState('idle')
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  const thumbnailPreviewUrl =
    thumbnail.type === 'upload' ? thumbnail.previewUrl :
    thumbnail.type === 'saved' && post?.coverImage?.asset
      ? `https://cdn.sanity.io/images/2nr7n3lm/production/${post.coverImage.asset._ref.replace('image-', '').replace(/-(\w+)$/, '.$1')}`
      : null

  const isReady = post?.workflowStatus === 'media_ready'
  const isPublished = post?.workflowStatus === 'published'
  const isScheduled = post?.workflowStatus === 'scheduled'
  const videoUploading = video.type === 'uploading'
  const canPublish = !isPublished && !isScheduled && (thumbnail.type === 'saved' || thumbnail.type === 'upload') && !videoUploading
  const publishInProgress = ['saving', 'publishing', 'polling'].includes(publishState.phase)
  const hasVideo = video.type === 'ready' || video.type === 'saved'

  if (loading) return <PageShell><p style={{ padding: 32, color: '#64748b' }}>Loading…</p></PageShell>
  if (error) return <PageShell><p style={{ padding: 32, color: '#dc2626' }}>{error}</p></PageShell>
  if (!post) return <PageShell><p style={{ padding: 32, color: '#64748b' }}>Post not found in queue.</p></PageShell>

  return (
    <PageShell>
      {/* Nav */}
      <AdminNav />
      {/* Post title bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '10px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</span>
        {post.workflowStatus && (
          <span style={{ flexShrink: 0, fontSize: 11, background: '#f1f5f9', color: '#475569', padding: '3px 10px', borderRadius: 99, fontWeight: 600 }}>
            {post.workflowStatus.replace(/_/g, ' ').toUpperCase()}
          </span>
        )}
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: 32, alignItems: 'start' }}>

        {/* ── LEFT ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* Article context */}
          <Card title="Article">
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {post.category && (
                <span style={{ fontSize: 11, fontWeight: 700, background: '#EEF1F5', color: '#1E3A5F', padding: '3px 10px', borderRadius: 99 }}>
                  {CATEGORY_LABELS[post.category] ?? post.category}
                </span>
              )}
              {post.publishedAt && (
                <span style={{ fontSize: 11, color: '#94a3b8' }}>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 10px', color: '#1a1a1a', lineHeight: 1.4 }}>{post.title}</h2>
            {post.excerpt && <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: 0 }}>{post.excerpt}</p>}
          </Card>

          {/* Social copy */}
          <Card title="Facebook Post Caption">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                This text will be posted to the Legacy Home Team Facebook page. Edit it before publishing.
              </p>
              <button
                onClick={handleGenerateCaption}
                disabled={generatingCaption}
                style={{
                  flexShrink: 0, marginLeft: 12,
                  padding: '5px 14px', background: '#eff6ff', color: '#1e40af',
                  border: '1px solid #93c5fd', borderRadius: 6, fontSize: 12,
                  fontWeight: 600, cursor: generatingCaption ? 'wait' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {generatingCaption ? 'Writing…' : '✨ Generate Caption'}
              </button>
            </div>
            <textarea
              value={socialCopy}
              onChange={e => setSocialCopy(e.target.value)}
              placeholder="Facebook post caption will appear here after generating or editing…"
              rows={4}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: 12, border: '1px solid #e2e8f0', borderRadius: 8,
                fontSize: 14, lineHeight: 1.6, resize: 'vertical',
                fontFamily: 'Inter, sans-serif', color: '#1a1a1a',
              }}
            />
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
              The blog post URL will be appended automatically when published.
            </p>
          </Card>

          {/* Video script */}
          <Card title="Video Script">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
              <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                A short script for Barry to record a video summary of this article — high-level takeaways, what it means for the local market, and a direct call to action.
              </p>
              <button
                onClick={handleGenerateScript}
                disabled={generatingScript}
                style={{
                  flexShrink: 0,
                  padding: '5px 14px', background: '#eff6ff', color: '#1e40af',
                  border: '1px solid #93c5fd', borderRadius: 6, fontSize: 12,
                  fontWeight: 600, cursor: generatingScript ? 'wait' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {generatingScript ? 'Writing…' : '🎬 Generate Script'}
              </button>
            </div>
            <textarea
              value={videoScript}
              onChange={e => setVideoScript(e.target.value)}
              placeholder="Video script will appear here after generating…"
              rows={14}
              style={{
                width: '100%', boxSizing: 'border-box',
                padding: 12, border: '1px solid #e2e8f0', borderRadius: 8,
                fontSize: 13, lineHeight: 1.7, resize: 'vertical',
                fontFamily: '"Courier New", Courier, monospace', color: '#1a1a1a',
                background: '#fafafa',
              }}
            />
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 6 }}>
              Tip: Edit before recording. Read naturally — don't rush. Scripts run 30–90 seconds depending on the topic.
            </p>
          </Card>

          {/* Video upload */}
          <Card title="Video (YouTube + TikTok + Facebook + LinkedIn + X + Threads)">
            <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.5 }}>
              Optional. Upload a final video to publish to YouTube, TikTok, Facebook Reel, LinkedIn, X, and Threads alongside the Facebook post. Supports MP4, MOV, or WebM up to 500 MB.
            </p>

            {/* Step 1: HeyGen base generation */}
            <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                Step 1 — Generate Base Video (optional)
              </div>

              {heygenState.type === 'idle' && (
                <>
                  <button
                    onClick={handleGenerateHeyGenVideo}
                    disabled={!videoScript.trim()}
                    title={!videoScript.trim() ? 'Generate a video script first' : undefined}
                    style={{
                      padding: '9px 18px',
                      background: videoScript.trim() ? '#1E3A5F' : '#e2e8f0',
                      color: videoScript.trim() ? '#fff' : '#94a3b8',
                      border: 'none', borderRadius: 8, fontSize: 13,
                      fontWeight: 600, cursor: videoScript.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    🤖 Generate with HeyGen
                  </button>
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                    Renders a talking-head avatar video from the script above. Download it, edit it to add backgrounds, then upload your final version below.
                  </p>
                </>
              )}

              {heygenState.type === 'generating' && (
                <div style={{ padding: '14px 16px', background: '#eff6ff', border: '1px solid #93c5fd', borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ fontSize: 18 }}>🎬</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e40af' }}>HeyGen is rendering the base video</div>
                      <div style={{ fontSize: 12, color: '#3b82f6' }}>{heygenState.message}</div>
                    </div>
                  </div>
                  <div style={{ height: 4, background: '#bfdbfe', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '100%', background: '#3b82f6', borderRadius: 99, animation: 'pulse 1.5s ease-in-out infinite' }} />
                  </div>
                  <p style={{ fontSize: 11, color: '#60a5fa', marginTop: 8, marginBottom: 0 }}>
                    Typically takes 2–5 minutes. This page can stay open.
                  </p>
                </div>
              )}

              {heygenState.type === 'ready' && (
                <div style={{ padding: '12px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>✅</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>Base video rendered</span>
                    <a
                      href={heygenState.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: '#2563eb', textDecoration: 'none' }}
                    >
                      Download ↗
                    </a>
                  </div>
                  <p style={{ fontSize: 11, color: '#166534', margin: '0 0 8px', lineHeight: 1.5 }}>
                    Open it in HeyGen or a video editor to add backgrounds and graphics, then upload your final cut below.
                  </p>
                  <button
                    onClick={() => setHeygenState({ type: 'idle' })}
                    style={{ fontSize: 11, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                  >
                    Generate new base video
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Upload final video */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
                Step 2 — Upload Final Video
              </div>

              {video.type === 'none' && (
                <>
                  <label style={{
                    display: 'inline-block',
                    padding: '10px 20px', background: '#f1f5f9', color: '#475569',
                    border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                    fontWeight: 600, cursor: 'pointer',
                  }}>
                    📹 Upload Video
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm,video/x-m4v"
                      onChange={handleVideoSelect}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                    No video uploaded — YouTube, TikTok, Facebook Reel, LinkedIn, X, and Threads will get image posts instead.
                  </p>
                </>
              )}

              {video.type === 'uploading' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#475569', marginBottom: 6 }}>
                    <span>Uploading video…</span>
                    <span>{video.progress}%</span>
                  </div>
                  <div style={{ height: 6, background: '#e2e8f0', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${video.progress}%`, background: '#1E3A5F', borderRadius: 99, transition: 'width 0.3s' }} />
                  </div>
                </div>
              )}

              {(video.type === 'ready' || video.type === 'saved') && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8 }}>
                  <span style={{ fontSize: 20 }}>🎥</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>
                      {video.type === 'saved' ? 'Video saved' : `Video uploaded at ${videoUploadedAt?.toLocaleTimeString() ?? '—'}`}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {video.type === 'ready' ? video.filename : video.url.split('/').pop()}
                    </div>
                  </div>
                  {video.type === 'ready' && (
                    <button
                      onClick={handleRemoveVideo}
                      style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* YouTube Thumbnail (only when video is ready — TikTok doesn't support external thumbnails) */}
            {(video.type === 'ready' || video.type === 'saved') && (
              <div style={{ marginTop: 16, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', display: 'block', marginBottom: 4 }}>
                  YouTube Thumbnail <span style={{ fontWeight: 400, color: '#94a3b8' }}>(optional)</span>
                </label>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 10px', lineHeight: 1.5 }}>
                  Custom thumbnail for YouTube. JPG or PNG, 1280×720 recommended. TikTok uses a frame from the video automatically.
                </p>

                {videoThumbnailUrl ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={videoThumbnailUrl}
                      alt="Video thumbnail"
                      style={{ width: 120, height: 68, objectFit: 'cover', borderRadius: 6, border: '1px solid #e2e8f0' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#166534' }}>✓ Thumbnail ready</div>
                      <label style={{ fontSize: 11, color: '#2563eb', cursor: 'pointer', display: 'block', marginTop: 4 }}>
                        Replace
                        <input type="file" accept="image/*" onChange={handleVideoThumbnailSelect} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label style={{
                    display: 'inline-block',
                    padding: '8px 16px', background: '#f1f5f9', color: '#475569',
                    border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13,
                    fontWeight: 600, cursor: uploadingVideoThumb ? 'wait' : 'pointer',
                    opacity: uploadingVideoThumb ? 0.7 : 1,
                  }}>
                    {uploadingVideoThumb ? 'Uploading…' : '🖼 Upload YouTube Thumbnail'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleVideoThumbnailSelect}
                      disabled={uploadingVideoThumb}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
            )}
          </Card>

        </div>

        {/* ── RIGHT: Preview + Publish ── */}
        <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Thumbnail */}
          <Card title="Thumbnail">
            <div style={{
              aspectRatio: '16/9', background: '#f1f5f9', borderRadius: 8, overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
            }}>
              {thumbnailPreviewUrl ? (
                <img src={thumbnailPreviewUrl} alt="Thumbnail preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🖼</div>
                  <div style={{ fontSize: 13 }}>No thumbnail yet</div>
                </div>
              )}
            </div>

            {thumbnail.type === 'saved' ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: '#166534', fontWeight: 600 }}>✓ Thumbnail saved</span>
                <label style={{ fontSize: 12, color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}>
                  Replace
                  <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
                </label>
              </div>
            ) : (
              <label style={{
                display: 'block', width: '100%', boxSizing: 'border-box', marginBottom: 10,
                padding: '10px 0', textAlign: 'center',
                background: '#f1f5f9', color: '#475569',
                border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14,
                fontWeight: 600, cursor: 'pointer',
              }}>
                📷 Upload Thumbnail
                <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
              </label>
            )}

          </Card>

          {/* Publish panel */}
          <Card title="Publish">
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12, lineHeight: 1.5 }}>
              Pressing Publish will:
            </p>
            <ul style={{ fontSize: 13, color: '#475569', lineHeight: 1.8, margin: '0 0 16px', paddingLeft: 18 }}>
              <li>Make the post live on the website</li>
              <li>Post to the Legacy Home Team Facebook page</li>
              {hasVideo && <li>Publish as a Facebook Reel</li>}
              {hasVideo && <li>Upload the video to YouTube</li>}
              {hasVideo && <li>Post the video to TikTok</li>}
              <li>Post to LinkedIn {hasVideo ? '(video)' : '(image)'}</li>
              <li>Post to X / Twitter {hasVideo ? '(video)' : '(image)'}</li>
              <li>Post to Threads {hasVideo ? '(video)' : '(image)'}</li>
            </ul>

            {/* Per-platform publish status */}
            {(publishState.phase === 'polling' || publishState.phase === 'done') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <PlatformStatusRow
                  icon="🌐"
                  label="Website"
                  status={{ phase: 'done' }}
                />
                <PlatformStatusRow
                  icon="👥"
                  label="Facebook"
                  status={publishState.facebook}
                />
                {publishState.facebookReel.phase !== 'idle' && (
                  <PlatformStatusRow icon="🎬" label="Facebook Reel" status={publishState.facebookReel} />
                )}
                {publishState.youtube.phase !== 'idle' && (
                  <PlatformStatusRow icon="▶️" label="YouTube" status={publishState.youtube} />
                )}
                {publishState.tiktok.phase !== 'idle' && (
                  <PlatformStatusRow icon="🎵" label="TikTok" status={publishState.tiktok} />
                )}
                {publishState.linkedin.phase !== 'idle' && (
                  <PlatformStatusRow icon="💼" label="LinkedIn" status={publishState.linkedin} />
                )}
                {publishState.twitter.phase !== 'idle' && (
                  <PlatformStatusRow icon="𝕏" label="X / Twitter" status={publishState.twitter} />
                )}
                {publishState.threads.phase !== 'idle' && (
                  <PlatformStatusRow icon="🧵" label="Threads" status={publishState.threads} />
                )}
              </div>
            )}

            {publishState.phase === 'error' && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: '#991b1b' }}>
                {publishState.message}
              </div>
            )}

            {publishState.phase === 'done' && (
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, color: '#166534' }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>✓ Published!</div>
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', display: 'block' }}>
                  View blog post →
                </a>
                {publishState.facebook.phase === 'done' && publishState.facebook.postUrl && (
                  <a href={publishState.facebook.postUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', display: 'block', marginTop: 4 }}>
                    View Facebook post →
                  </a>
                )}
                {publishState.facebookReel.phase === 'done' && publishState.facebookReel.postUrl && (
                  <a href={publishState.facebookReel.postUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', display: 'block', marginTop: 4 }}>
                    View Facebook Reel →
                  </a>
                )}
                {publishState.youtube.phase === 'done' && publishState.youtube.postUrl && (
                  <a href={publishState.youtube.postUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', display: 'block', marginTop: 4 }}>
                    View YouTube video →
                  </a>
                )}
                {publishState.tiktok.phase === 'done' && publishState.tiktok.postUrl && (
                  <a href={publishState.tiktok.postUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', display: 'block', marginTop: 4 }}>
                    View TikTok post →
                  </a>
                )}
                {publishState.linkedin.phase === 'done' && publishState.linkedin.postUrl && (
                  <a href={publishState.linkedin.postUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', display: 'block', marginTop: 4 }}>
                    View LinkedIn post →
                  </a>
                )}
                {publishState.twitter.phase === 'done' && publishState.twitter.postUrl && (
                  <a href={publishState.twitter.postUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', display: 'block', marginTop: 4 }}>
                    View X post →
                  </a>
                )}
                {publishState.threads.phase === 'done' && publishState.threads.postUrl && (
                  <a href={publishState.threads.postUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#166534', display: 'block', marginTop: 4 }}>
                    View Threads post →
                  </a>
                )}
              </div>
            )}

            {/* ── Scheduled state ── */}
            {isScheduled && post?.scheduledPublishAt && (
              <div style={{ background: '#eff6ff', border: '1.5px solid #bfdbfe', borderRadius: 10, padding: '14px 16px', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1d4ed8', marginBottom: 4 }}>
                  📅 Scheduled
                </div>
                <div style={{ fontSize: 13, color: '#1e40af', marginBottom: 10 }}>
                  {new Date(post.scheduledPublishAt).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
                  })}
                </div>
                <div style={{ fontSize: 12, color: '#3b82f6', marginBottom: 10, lineHeight: 1.5 }}>
                  The post will go live on the website and all social platforms at this time.
                </div>
                <button
                  onClick={handleCancelSchedule}
                  disabled={scheduleState === 'cancelling'}
                  style={{ fontSize: 12, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                >
                  {scheduleState === 'cancelling' ? 'Cancelling…' : 'Cancel scheduled publish'}
                </button>
              </div>
            )}

            {isPublished ? (
              <div>
                {/* Persistent platform status — shown from Sanity data on reload */}
                {publishState.phase === 'idle' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                    <PlatformStatusRow icon="🌐" label="Website" status={{ phase: 'done' }} />
                    <PlatformStatusRow
                      icon="👥" label="Facebook"
                      status={post.blotatoPublishStatus === 'published' || post.facebookPostUrl
                        ? { phase: 'done', postUrl: post.facebookPostUrl }
                        : post.blotatoPostSubmissionId
                        ? { phase: 'done' }
                        : { phase: 'idle' }}
                    />
                    {post.facebookReelSubmissionId && (
                      <PlatformStatusRow icon="🎬" label="Facebook Reel" status={{ phase: 'done' }} />
                    )}
                    {post.youtubePostSubmissionId && (
                      <PlatformStatusRow icon="▶️" label="YouTube" status={{ phase: 'done', postUrl: post.youtubePostUrl }} />
                    )}
                    {post.tiktokPostSubmissionId && (
                      <PlatformStatusRow icon="🎵" label="TikTok" status={{ phase: 'done', postUrl: post.tiktokPostUrl }} />
                    )}
                    {post.linkedinPostSubmissionId && (
                      <PlatformStatusRow icon="💼" label="LinkedIn" status={{ phase: 'done' }} />
                    )}
                    {post.twitterPostSubmissionId && (
                      <PlatformStatusRow icon="𝕏" label="X / Twitter" status={{ phase: 'done' }} />
                    )}
                    {post.threadsPostSubmissionId && (
                      <PlatformStatusRow icon="🧵" label="Threads" status={{ phase: 'done' }} />
                    )}
                  </div>
                )}
                <div style={{ fontSize: 13, color: '#166534', fontWeight: 600, padding: '8px 0', textAlign: 'center', marginBottom: 8 }}>
                  ✓ Already published
                </div>
                {video.type === 'ready' && videoPublishState.phase === 'idle' && (
                  <button
                    onClick={handlePublishVideoOnly}
                    style={{
                      width: '100%', padding: '11px 0',
                      background: '#1E3A5F', color: '#fff',
                      border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    ▶️ Publish Video to Facebook Reel, YouTube & TikTok
                  </button>
                )}
                {videoPublishState.phase === 'publishing' && (
                  <div style={{ fontSize: 13, color: '#64748b', textAlign: 'center', padding: '8px 0' }}>Publishing video…</div>
                )}
                {videoPublishState.phase === 'done' && (
                  <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: 12, fontSize: 13 }}>
                    <div style={{ fontWeight: 700, color: '#166534', marginBottom: 6 }}>Video published!</div>
                    {videoPublishState.facebookReel.error ? (
                      <div style={{ color: '#991b1b' }}>🎬 Facebook Reel: {videoPublishState.facebookReel.error}</div>
                    ) : (
                      <div style={{ color: '#166534' }}>🎬 Facebook Reel: queued</div>
                    )}
                    {videoPublishState.youtube.error ? (
                      <div style={{ color: '#991b1b', marginTop: 4 }}>▶️ YouTube: {videoPublishState.youtube.error}</div>
                    ) : (
                      <div style={{ color: '#166534', marginTop: 4 }}>▶️ YouTube: queued</div>
                    )}
                    {videoPublishState.tiktok.error ? (
                      <div style={{ color: '#991b1b', marginTop: 4 }}>🎵 TikTok: {videoPublishState.tiktok.error}</div>
                    ) : (
                      <div style={{ color: '#166534', marginTop: 4 }}>🎵 TikTok: queued</div>
                    )}
                  </div>
                )}
                {videoPublishState.phase === 'error' && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: 12, fontSize: 13, color: '#991b1b' }}>
                    {videoPublishState.message}
                  </div>
                )}
              </div>
            ) : !isScheduled ? (
              <div>
                {/* Delay picker */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                    When to publish
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {[
                      { label: 'Now', hours: null },
                      { label: '+1h', hours: 1 },
                      { label: '+2h', hours: 2 },
                      { label: '+4h', hours: 4 },
                      { label: '+8h', hours: 8 },
                      { label: '+12h', hours: 12 },
                      { label: '+1 day', hours: 24 },
                      { label: '+2 days', hours: 48 },
                      { label: '+3 days', hours: 72 },
                    ].map(({ label, hours }) => (
                      <button
                        key={label}
                        onClick={() => setPublishDelay(hours)}
                        style={{
                          padding: '5px 10px', fontSize: 12, fontWeight: 600, borderRadius: 6,
                          border: '1px solid',
                          borderColor: publishDelay === hours ? '#1E3A5F' : '#e2e8f0',
                          background: publishDelay === hours ? '#1E3A5F' : '#fff',
                          color: publishDelay === hours ? '#fff' : '#475569',
                          cursor: 'pointer',
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {publishDelay !== null && (
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
                      Publishes at:{' '}
                      {new Date(Date.now() + publishDelay * 3600 * 1000).toLocaleString('en-US', {
                        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
                      })}
                    </div>
                  )}
                </div>

                {scheduleError && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '8px 12px', marginBottom: 10, fontSize: 12, color: '#991b1b' }}>
                    {scheduleError}
                  </div>
                )}

                {/* Video upload in-progress lock banner */}
                {videoUploading && video.type === 'uploading' && (
                  <div style={{
                    background: '#fffbeb',
                    border: '1.5px solid #fbbf24',
                    borderRadius: 8,
                    padding: '12px 14px',
                    marginBottom: 12,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 16 }}>⏳</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>
                          Video uploading — {video.progress}%
                        </div>
                        <div style={{ fontSize: 11, color: '#b45309', lineHeight: 1.4 }}>
                          Publishing is locked until the upload finishes.
                        </div>
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 800, color: '#d97706' }}>{video.progress}%</span>
                    </div>
                    <div style={{ height: 5, background: '#fde68a', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${video.progress}%`,
                        background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                        borderRadius: 99,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                )}

                {publishDelay === null ? (
                  <button
                    onClick={handlePublish}
                    disabled={!canPublish || publishInProgress}
                    style={{
                      width: '100%', padding: '13px 0',
                      background: canPublish && !publishInProgress ? '#1E3A5F' : '#e2e8f0',
                      color: canPublish && !publishInProgress ? '#fff' : '#94a3b8',
                      border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700,
                      cursor: canPublish && !publishInProgress ? 'pointer' : 'not-allowed',
                      transition: 'background 0.2s',
                    }}
                  >
                    {publishState.phase === 'publishing' ? 'Publishing…' :
                     publishState.phase === 'polling'    ? 'Waiting for confirmation…' :
                     publishState.phase === 'saving'     ? 'Preparing…' :
                     '🚀 Publish'}
                  </button>
                ) : (
                  <button
                    onClick={handleSchedule}
                    disabled={!canPublish || scheduleState === 'scheduling'}
                    style={{
                      width: '100%', padding: '13px 0',
                      background: canPublish && scheduleState !== 'scheduling' ? '#0f766e' : '#e2e8f0',
                      color: canPublish && scheduleState !== 'scheduling' ? '#fff' : '#94a3b8',
                      border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700,
                      cursor: canPublish && scheduleState !== 'scheduling' ? 'pointer' : 'not-allowed',
                      transition: 'background 0.2s',
                    }}
                  >
                    {scheduleState === 'scheduling' ? 'Scheduling…' : '📅 Schedule'}
                  </button>
                )}

                {!canPublish && !publishInProgress && (
                  <p style={{ fontSize: 12, color: videoUploading ? '#b45309' : '#94a3b8', textAlign: 'center', marginTop: 8 }}>
                    {videoUploading
                      ? 'Publishing will unlock once the video upload is complete.'
                      : 'Upload a thumbnail to enable publishing.'}
                  </p>
                )}
              </div>
            ) : null}

            {!canPublish && !isPublished && isScheduled && (
              <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 8 }}>
                Upload a thumbnail to enable publishing.
              </p>
            )}
          </Card>
        </div>
      </div>
    </PageShell>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PlatformStatusRow({ icon, label, status }: {
  icon: string
  label: string
  status: PlatformStatus
}) {
  const isPolling = status.phase === 'polling'
  const isDone = status.phase === 'done'
  const isError = status.phase === 'error'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 12px',
      background: isDone ? '#f0fdf4' : isError ? '#fef2f2' : '#eff6ff',
      border: `1px solid ${isDone ? '#86efac' : isError ? '#fca5a5' : '#93c5fd'}`,
      borderRadius: 8, fontSize: 13,
    }}>
      <span>{icon}</span>
      <span style={{ fontWeight: 600, color: isDone ? '#166534' : isError ? '#991b1b' : '#1e40af' }}>
        {label}
      </span>
      <span style={{ marginLeft: 'auto', color: isDone ? '#166534' : isError ? '#991b1b' : '#1e40af' }}>
        {isPolling ? 'Waiting…' : isDone ? '✓ Published' : isError ? `✗ ${status.message}` : ''}
      </span>
    </div>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', fontFamily: 'Inter, sans-serif' }}>
      {children}
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}
