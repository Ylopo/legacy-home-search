export const dynamic = 'force-dynamic'

import { AdminNav } from '@/components/AdminNav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: 'Inter, -apple-system, sans-serif', color: '#1a1a1a' }}>
      <AdminNav />
      {children}
    </div>
  )
}
