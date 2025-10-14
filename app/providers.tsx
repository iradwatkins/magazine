'use client'

import { HybridSessionProvider } from '@/components/auth/hybrid-session-provider'
import { ActivityProvider } from '@/components/debug/activity-provider'

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <HybridSessionProvider>
      <ActivityProvider>
        {children}
      </ActivityProvider>
    </HybridSessionProvider>
  )
}
