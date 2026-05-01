'use client'
import { useEffect, useState } from 'react'

/**
 * Reads `?secret=` from the current URL.
 *
 * Uses useState + useEffect (not a direct `window.location` read) so the
 * value is stable across SSR/hydration. Returns '' during the initial
 * server-render and first hydration pass, then the real value after mount —
 * which triggers a re-render so links pick up the correct secret.
 */
export function useUrlSecret(): string {
  const [secret, setSecret] = useState('')
  useEffect(() => {
    setSecret(new URLSearchParams(window.location.search).get('secret') ?? '')
  }, [])
  return secret
}
