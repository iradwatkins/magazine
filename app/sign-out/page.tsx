'use client'

import { signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignOutPage() {
  const router = useRouter()

  useEffect(() => {
    // Automatically sign out when page loads
    signOut({
      callbackUrl: '/',
      redirect: false
    }).then(() => {
      // Redirect to home after sign out
      router.push('/')
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
        <h1 className="text-2xl font-bold">Signing Out...</h1>
        <p className="text-muted-foreground">Please wait while we sign you out</p>

        <div className="pt-4">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Click here if not redirected
          </button>
        </div>
      </div>
    </div>
  )
}