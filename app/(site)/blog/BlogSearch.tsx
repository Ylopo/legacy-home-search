'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'

export function BlogSearch({ defaultValue = '' }: { defaultValue?: string }) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue]     = useState(defaultValue)
  const [pending, startTransition] = useTransition()

  const submit = useCallback((q: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (q.trim()) {
      params.set('q', q.trim())
    } else {
      params.delete('q')
    }
    params.delete('page') // reset to page 1 on new search
    startTransition(() => {
      router.push(`/blog?${params.toString()}`)
    })
  }, [router, searchParams])

  return (
    <form
      onSubmit={e => { e.preventDefault(); submit(value) }}
      style={{ display: 'flex', gap: 8, maxWidth: 480 }}
    >
      <div style={{ position: 'relative', flex: 1 }}>
        <span style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          color: '#9ca3af', fontSize: 16, pointerEvents: 'none',
        }}>
          🔍
        </span>
        <input
          type="search"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Search posts…"
          style={{
            width: '100%', padding: '10px 14px 10px 40px',
            borderRadius: 10, border: '1.5px solid #e0ddd8',
            fontSize: 14, fontFamily: 'inherit',
            background: '#fff', outline: 'none',
            boxSizing: 'border-box',
            opacity: pending ? 0.6 : 1,
            transition: 'border-color 0.15s',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = '#2563eb' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#e0ddd8' }}
        />
        {value && (
          <button
            type="button"
            onClick={() => { setValue(''); submit('') }}
            style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#9ca3af', fontSize: 16, padding: 2, lineHeight: 1,
            }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      <button
        type="submit"
        style={{
          padding: '10px 18px', borderRadius: 10, border: 'none',
          background: '#2563eb', color: '#fff', fontSize: 14,
          fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
          opacity: pending ? 0.7 : 1, transition: 'opacity 0.15s',
        }}
      >
        {pending ? '…' : 'Search'}
      </button>
    </form>
  )
}
