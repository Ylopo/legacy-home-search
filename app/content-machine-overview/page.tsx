'use client'

import { useEffect, useState } from 'react'

export default function ContentMachinePresentation() {
  const [slide, setSlide] = useState(0)
  const total = 10

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setSlide(s => Math.min(s + 1, total - 1))
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   setSlide(s => Math.max(s - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const prev = () => setSlide(s => Math.max(s - 1, 0))
  const next = () => setSlide(s => Math.min(s + 1, total - 1))

  return (
    <div style={{
      minHeight: '100vh', background: '#f8f7f4',
      fontFamily: 'Inter, -apple-system, sans-serif',
      color: '#1a1a1a', display: 'flex', flexDirection: 'column',
    }}>
      {/* Nav bar */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #e2e8f0',
        padding: '0 32px', height: 52, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', flexShrink: 0,
      }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8' }}>
          Legacy Home Team · Content Machine
        </span>
        <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>
          {slide + 1} / {total}
        </span>
      </div>

      {/* Slide area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>
        <div style={{ width: '100%', maxWidth: 900 }}>
          {slide === 0 && <Slide0 />}
          {slide === 1 && <Slide1 />}
          {slide === 2 && <Slide2 />}
          {slide === 3 && <Slide3 />}
          {slide === 4 && <Slide4 />}
          {slide === 5 && <Slide5 />}
          {slide === 6 && <Slide6 />}
          {slide === 7 && <Slide7 />}
          {slide === 8 && <Slide8 />}
          {slide === 9 && <Slide9 />}
        </div>
      </div>

      {/* Nav buttons */}
      <div style={{
        padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: '#fff', borderTop: '1px solid #e2e8f0', flexShrink: 0,
      }}>
        <button onClick={prev} disabled={slide === 0} style={navBtn(slide === 0)}>← Previous</button>
        <div style={{ display: 'flex', gap: 8 }}>
          {Array.from({ length: total }).map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{
              width: 8, height: 8, borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer',
              background: i === slide ? '#2563eb' : '#cbd5e1',
            }} />
          ))}
        </div>
        <button onClick={next} disabled={slide === total - 1} style={navBtn(slide === total - 1)}>Next →</button>
      </div>
    </div>
  )
}

function navBtn(disabled: boolean) {
  return {
    padding: '8px 20px', borderRadius: 8, border: '1px solid #e2e8f0',
    background: disabled ? '#f8f7f4' : '#fff', color: disabled ? '#cbd5e1' : '#475569',
    fontSize: 13, fontWeight: 600, cursor: disabled ? 'default' : 'pointer',
  } as const
}

// ─── Slide components ─────────────────────────────────────────────────────────

function SlideShell({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '56px 64px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      display: center ? 'flex' : 'block',
      flexDirection: center ? 'column' : undefined,
      alignItems: center ? 'center' : undefined,
      justifyContent: center ? 'center' : undefined,
      textAlign: center ? 'center' : undefined,
      minHeight: 480,
    }}>
      {children}
    </div>
  )
}

function Tag({ children, color = '#2563eb' }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
      color, background: color + '18', padding: '4px 10px', borderRadius: 99,
    }}>
      {children}
    </span>
  )
}

function H({ children }: { children: React.ReactNode }) {
  return <h1 style={{ fontSize: 36, fontWeight: 800, color: '#1a1a1a', margin: '16px 0 0', lineHeight: 1.2 }}>{children}</h1>
}

function Sub({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 17, color: '#475569', lineHeight: 1.7, margin: '16px 0 0' }}>{children}</p>
}

// Slide 0 — Title
function Slide0() {
  return (
    <SlideShell center>
      <div style={{ fontSize: 56, marginBottom: 8 }}>⚙️</div>
      <Tag>Legacy Home Team</Tag>
      <h1 style={{ fontSize: 48, fontWeight: 900, color: '#1a1a1a', margin: '20px 0 0', lineHeight: 1.1 }}>
        The Content Machine
      </h1>
      <p style={{ fontSize: 20, color: '#475569', margin: '16px 0 0', maxWidth: 560 }}>
        Automated content marketing — from raw news to published blog post and social media, every week.
      </p>
      <div style={{ marginTop: 40, display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
        {['Website', 'Facebook', 'YouTube', 'TikTok'].map(p => (
          <span key={p} style={{ fontSize: 13, fontWeight: 600, color: '#64748b', background: '#f1f5f9', padding: '6px 14px', borderRadius: 99 }}>{p}</span>
        ))}
      </div>
      <p style={{ fontSize: 12, color: '#cbd5e1', marginTop: 48 }}>Use ← → arrow keys or the buttons below to navigate</p>
    </SlideShell>
  )
}

// Slide 1 — The Problem
function Slide1() {
  return (
    <SlideShell>
      <Tag color="#dc2626">The Challenge</Tag>
      <H>Real estate agents need content. They never have time to write it.</H>
      <Sub>Google rewards consistent publishing. Social platforms reward it too. But writing a single quality blog post takes 3–4 hours — research, drafting, SEO, formatting, images, and then you still need to post it everywhere.</Sub>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 32 }}>
        {[
          { label: 'Without a system', items: ['0–2 posts/month, inconsistently', 'No keyword strategy', 'Nothing posted to social', 'Zero compounding traffic'] },
          { label: 'With the Content Machine', items: ['4–8 posts/month, on autopilot', 'Every post scored for SEO value', 'Auto-posted to Facebook, YouTube, TikTok', 'Traffic compounds over time'] },
        ].map(col => (
          <div key={col.label} style={{
            background: col.label.includes('Without') ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${col.label.includes('Without') ? '#fecaca' : '#86efac'}`,
            borderRadius: 12, padding: '20px 24px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: col.label.includes('Without') ? '#dc2626' : '#16a34a', marginBottom: 12 }}>
              {col.label.includes('Without') ? '✗' : '✓'} {col.label}
            </div>
            {col.items.map(item => (
              <div key={item} style={{ fontSize: 13, color: '#475569', marginBottom: 6 }}>{item}</div>
            ))}
          </div>
        ))}
      </div>
    </SlideShell>
  )
}

// Slide 2 — What It Does (big numbers)
function Slide2() {
  return (
    <SlideShell>
      <Tag>By the numbers</Tag>
      <H>What the machine does</H>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 32 }}>
        {[
          { n: '21+', label: 'Posts published', sub: 'and growing every week' },
          { n: '4', label: 'Platforms covered', sub: 'Website · Facebook · YouTube · TikTok' },
          { n: '~15 min', label: 'Human time per week', sub: 'to review and approve ideas' },
        ].map(stat => (
          <div key={stat.n} style={{ background: '#f8f7f4', border: '1px solid #e2e8f0', borderRadius: 12, padding: '28px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 44, fontWeight: 900, color: '#2563eb', lineHeight: 1 }}>{stat.n}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginTop: 8 }}>{stat.label}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{stat.sub}</div>
          </div>
        ))}
      </div>
      <Sub>Every post is written in Barry's voice, optimized for Hampton Roads search terms, and published to the website and Facebook in one click. Videos go to YouTube and TikTok from the same workflow.</Sub>
    </SlideShell>
  )
}

// Slide 3 — The Pipeline
function Slide3() {
  const steps = [
    { icon: '🔍', label: 'Research', sub: 'Tavily search API', type: 'auto' },
    { icon: '🎯', label: 'Score & Rank', sub: 'Claude Opus (100pt model)', type: 'auto' },
    { icon: '👤', label: 'Idea Review', sub: '~15 min, once/week', type: 'human' },
    { icon: '✍️', label: 'AI Writing', sub: 'Claude Sonnet, ~20 sec', type: 'auto' },
    { icon: '🎨', label: 'VA: Media', sub: 'Thumbnail + caption', type: 'va' },
    { icon: '🚀', label: 'Publish', sub: 'Website + Facebook', type: 'auto' },
    { icon: '📹', label: 'Video', sub: 'YouTube + TikTok', type: 'va' },
  ]
  const colors: Record<string, string> = { auto: '#16a34a', human: '#2563eb', va: '#7c3aed' }
  const labels: Record<string, string> = { auto: 'Automated', human: 'Human', va: 'VA' }

  return (
    <SlideShell>
      <Tag>End-to-end</Tag>
      <H>From raw news to published post</H>
      <div style={{ marginTop: 32, display: 'flex', alignItems: 'flex-start', gap: 0, overflowX: 'auto' }}>
        {steps.map((step, i) => (
          <div key={step.label} style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 100 }}>
              <div style={{
                width: 60, height: 60, borderRadius: 14,
                background: colors[step.type] + '15',
                border: `2px solid ${colors[step.type]}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
              }}>{step.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', marginTop: 8, textAlign: 'center' }}>{step.label}</div>
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 2, textAlign: 'center', lineHeight: 1.4 }}>{step.sub}</div>
              <span style={{
                marginTop: 6, fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: colors[step.type], background: colors[step.type] + '18', padding: '2px 7px', borderRadius: 99,
              }}>{labels[step.type]}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ marginTop: 20, fontSize: 18, color: '#cbd5e1', padding: '0 4px', flexShrink: 0 }}>→</div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 20, marginTop: 28 }}>
        {[{ color: '#16a34a', label: 'Automated — no human needed' }, { color: '#2563eb', label: 'Human touchpoint (~15 min/week)' }, { color: '#7c3aed', label: 'VA step (~20 min per post)' }].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </SlideShell>
  )
}

// Slide 4 — Where Ideas Come From
function Slide4() {
  return (
    <SlideShell>
      <Tag>The research engine</Tag>
      <H>Where ideas come from</H>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 28 }}>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 22, marginBottom: 8 }}>📰</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1e40af', marginBottom: 8 }}>Daily News Feed</div>
          <div style={{ fontSize: 13, color: '#1e3a8a', lineHeight: 1.6, marginBottom: 12 }}>
            Every morning at 6 AM, the system runs 8 targeted search queries across Tavily — covering Hampton Roads market news, real estate law changes, military housing, flood risk, community development, and more.
          </div>
          <div style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600 }}>8 queries/day · ~40 raw articles · top ideas scored and queued</div>
        </div>
        <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: 12, padding: 24 }}>
          <div style={{ fontSize: 22, marginBottom: 8 }}>📈</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#92400e', marginBottom: 8 }}>Team Renick Intelligence</div>
          <div style={{ fontSize: 13, color: '#78350f', lineHeight: 1.6, marginBottom: 12 }}>
            Every week, the system scrapes Team Renick's Blog Effectiveness Dashboard — a comparable real estate market that publishes their exact traffic-lift data per content format. The machine finds their top-performing patterns and adapts them to Hampton Roads.
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ background: '#fff', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#16a34a' }}>+800%</div>
              <div style={{ fontSize: 11, color: '#78350f', fontWeight: 600 }}>Cost Breakdown posts</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#16a34a' }}>+1,829%</div>
              <div style={{ fontSize: 11, color: '#78350f', fontWeight: 600 }}>Flood Zone content</div>
            </div>
          </div>
        </div>
      </div>
      <Sub>Both sources feed a single unified idea queue in Redis, sorted by score. The reviewer only sees the best ideas — everything below the threshold is automatically filtered out.</Sub>
    </SlideShell>
  )
}

// Slide 5 — The Scoring System
function Slide5() {
  const dims = [
    { label: 'Local Relevance', max: 25, desc: 'Is it specifically about Hampton Roads / Virginia Beach?' },
    { label: 'Timeliness', max: 20, desc: 'Breaking news scores 20. Evergreen topics score 2–8.' },
    { label: 'Format Fit', max: 15, desc: 'Cost breakdowns and flood risk posts score highest (proven formats).' },
    { label: 'Audience Value', max: 15, desc: 'How useful is this for local buyers, sellers, or homeowners right now?' },
    { label: 'Source Credibility', max: 10, desc: 'Government data and local news score higher than generic blogs.' },
    { label: 'Novelty', max: 10, desc: 'Have we covered this topic recently? Duplicate angles score lower.' },
    { label: 'SEO Potential', max: 5, desc: 'Does it match a real search query?' },
  ]
  return (
    <SlideShell>
      <Tag>Automated quality gate</Tag>
      <H>Every idea is scored before you see it</H>
      <Sub>Claude Opus evaluates each idea on 7 dimensions. Ideas below 55/100 are automatically dropped — never reach the review queue. Ideas scoring ≥85 with breaking news urgency trigger an immediate email alert.</Sub>
      <div style={{ marginTop: 24, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        {dims.map((d, i) => (
          <div key={d.label} style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px',
            background: i % 2 === 0 ? '#fff' : '#f8f7f4',
            borderBottom: i < dims.length - 1 ? '1px solid #e2e8f0' : 'none',
          }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#2563eb18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#2563eb' }}>{d.max}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{d.label}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{d.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  )
}

// Slide 6 — The Review Page
function Slide6() {
  return (
    <SlideShell>
      <Tag color="#7c3aed">Human gate</Tag>
      <H>The Idea Review — 15 minutes, once a week</H>
      <Sub>The only part of the pipeline that requires a human. A weekly email delivers the top 10–15 ideas. The reviewer opens the admin dashboard and sees each idea as a card.</Sub>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 28 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Each idea card shows:</div>
          {[
            '📊 Score (0–100) with expandable breakdown',
            '📰 Proposed headline and angle',
            '❓ Why it matters to Hampton Roads residents right now',
            '⚡ Urgency: Breaking / Timely / Evergreen',
            '📈 Renick performance context (when applicable)',
            '🎯 Audience: Buyers / Sellers / Homeowners / Investors',
          ].map(item => (
            <div key={item} style={{ fontSize: 13, color: '#475569', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>{item}</div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Actions per idea:</div>
          {[
            { action: '✓ Approve & Write Post', color: '#16a34a', desc: 'Claude Sonnet writes the full post in ~20 seconds. Automatically queued for VA.' },
            { action: '↓ Defer', color: '#d97706', desc: 'Keep it in queue for next week. Nothing is lost.' },
            { action: '✕ Skip', color: '#64748b', desc: 'Remove permanently. The topic is deprioritized in future scoring.' },
          ].map(a => (
            <div key={a.action} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: a.color }}>{a.action}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{a.desc}</div>
            </div>
          ))}
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: 12, marginTop: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>Tech stack</div>
            <div style={{ fontSize: 12, color: '#166534', marginTop: 4 }}>Ideas stored in Upstash Redis · Scored by Claude Opus · Weekly digest via Resend email</div>
          </div>
        </div>
      </div>
    </SlideShell>
  )
}

// Slide 7 — From Idea to Published
function Slide7() {
  return (
    <SlideShell>
      <Tag>Post production</Tag>
      <H>From idea approval to live post</H>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 28 }}>
        {[
          {
            step: '1', icon: '✍️', title: 'AI Writing (~20 sec)', color: '#16a34a',
            items: [
              'Claude Sonnet writes 350–450 words',
              'Written in Barry\'s voice — warm, local, direct',
              "Ties every insight back to Hampton Roads specifically",
              'SEO-optimized headline + meta description',
              'Max 2 inline CTAs (naturally placed)',
            ],
          },
          {
            step: '2', icon: '🎨', title: 'VA: Media (~20 min)', color: '#7c3aed',
            items: [
              'AI-generated thumbnail (Barry + community photo)',
              'Auto-generated Facebook caption (editable)',
              'Optional: HeyGen avatar video script',
              'VA uploads edited video if needed',
              'All done via a simple admin UI — no code',
            ],
          },
          {
            step: '3', icon: '🚀', title: 'Publish (one click)', color: '#2563eb',
            items: [
              'Sanity CMS → post goes live on website',
              'Blotato → image + caption posted to Facebook',
              'Both happen simultaneously in one click',
              'Optional: video → YouTube + TikTok',
              'All publish statuses tracked in real-time',
            ],
          },
        ].map(col => (
          <div key={col.step} style={{ background: '#f8f7f4', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: col.color + '18', border: `1px solid ${col.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{col.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{col.title}</div>
            </div>
            {col.items.map(item => (
              <div key={item} style={{ fontSize: 12, color: '#475569', padding: '4px 0', borderBottom: '1px solid #e2e8f0', lineHeight: 1.5 }}>{item}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 20px', fontSize: 13, color: '#1e40af' }}>
        <strong>Tech stack:</strong> Sanity CMS (content storage) · Vercel Blob (images + videos) · Blotato (Facebook / YouTube / TikTok publishing API) · OpenAI gpt-image-1 (thumbnail generation)
      </div>
    </SlideShell>
  )
}

// Slide 8 — Reporting Dashboard
function Slide8() {
  const platforms = [
    { icon: '🔍', name: 'Google Search', color: '#1a73e8', metrics: ['Clicks & impressions', 'Top performing pages', 'Search queries driving traffic', 'Average ranking position', '7-day trend'] },
    { icon: '📘', name: 'Facebook', color: '#1877f2', metrics: ['Weekly reach & impressions', 'Post engagement rate', 'Video views', 'Reactions breakdown', 'Top performing posts'] },
    { icon: '▶️', name: 'YouTube', color: '#ff0000', metrics: ['Subscriber count', 'Total video views', 'Top videos (views + likes)', 'Recent upload performance', 'Channel growth trend'] },
    { icon: '🎵', name: 'TikTok', color: '#000000', metrics: ['Connected via Blotato', 'API setup in progress', 'Will track views + follows', 'Per-video engagement', 'Publishing status'] },
  ]
  return (
    <SlideShell>
      <Tag>Reporting</Tag>
      <H>Live analytics across every platform</H>
      <Sub>A single admin dashboard shows performance across all four platforms. Accessible at any time — no logins to each platform separately.</Sub>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 24 }}>
        {platforms.map(p => (
          <div key={p.name} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>{p.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{p.name}</span>
            </div>
            {p.metrics.map(m => (
              <div key={m} style={{ fontSize: 11, color: '#64748b', padding: '3px 0', borderBottom: '1px solid #f1f5f9' }}>{m}</div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, background: '#f8f7f4', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 20px', fontSize: 13, color: '#475569' }}>
        <strong>Tech stack:</strong> Google Search Console API (OAuth2) · Facebook Graph API (never-expiring page token) · YouTube Data API v3 · Upstash Redis (caching) · All surfaced in a single Next.js admin page
      </div>
    </SlideShell>
  )
}

// Slide 9 — What's Next
function Slide9() {
  const items = [
    { icon: '📰', title: 'Local interest content', desc: 'Historical anniversaries, famous local stories, notable people — content that Hampton Roads locals genuinely want to share, beyond real estate.' },
    { icon: '🧠', title: 'Self-improving loop', desc: 'As posts accumulate performance data, the Renick scoring weights auto-adjust. Content formats that drive traffic for Barry get scored higher in future rounds.' },
    { icon: '📹', title: 'Video pipeline growing', desc: 'HeyGen AI avatar videos → YouTube + TikTok. Barry\'s face and voice on every platform without recording a single video.' },
    { icon: '🗺️', title: 'All 6 Hampton Roads cities', desc: 'Virginia Beach, Norfolk, Chesapeake, Hampton, Newport News, Suffolk — each gets city-targeted content and community pages.' },
    { icon: '📧', title: 'Breaking news alerts', desc: 'When a story scores ≥85/100 with urgent timeliness (e.g. a major law change, a hurricane approaching), an immediate email fires — no waiting for the weekly review.' },
    { icon: '🤖', title: 'Fully automated video', desc: 'Long-term: automated AI video creation removes the VA step entirely for standard posts. Human review stays; manual work disappears.' },
  ]
  return (
    <SlideShell>
      <Tag color="#7c3aed">Roadmap</Tag>
      <H>What's next</H>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 28 }}>
        {items.map(item => (
          <div key={item.title} style={{ display: 'flex', gap: 14, padding: '16px 20px', background: '#f8f7f4', border: '1px solid #e2e8f0', borderRadius: 12 }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 28, textAlign: 'center', padding: '20px', background: '#f0fdf4', borderRadius: 12, border: '1px solid #86efac' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#166534', marginBottom: 4 }}>The goal</div>
        <div style={{ fontSize: 14, color: '#166534' }}>
          Barry shows up everywhere — blog, Facebook, YouTube, TikTok — consistently and authoritatively, without writing a single word or recording a single video.
        </div>
      </div>
    </SlideShell>
  )
}
