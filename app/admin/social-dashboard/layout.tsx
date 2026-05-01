export const dynamic = 'force-dynamic'

import { SocialDashboardNav } from '@/components/SocialDashboardNav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', fontFamily: 'Inter, -apple-system, sans-serif', color: '#1a1a1a' }}>
      <SocialDashboardNav />
      {children}
    </div>
  )
}
