'use client'

import { useState, useEffect } from 'react'
import { signIn, getCsrfToken, getProviders } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestLoginPage() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null)
  const [providers, setProviders] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [email, setEmail] = useState('iradwatkins@gmail.com')

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    // Get CSRF token
    getCsrfToken().then(token => {
      setCsrfToken(token || null)
      addLog(`CSRF Token obtained: ${token?.substring(0, 10)}...`)
    })

    // Get providers
    getProviders().then(p => {
      setProviders(p)
      addLog(`Providers loaded: ${p ? Object.keys(p).join(', ') : 'none'}`)
    })
  }, [])

  const testGoogleLogin = async () => {
    addLog('Starting Google OAuth login...')
    try {
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/dashboard'
      })
      addLog(`Google login result: ${JSON.stringify(result)}`)
    } catch (error: any) {
      addLog(`Google login error: ${error.message}`)
    }
  }

  const testEmailLogin = async () => {
    addLog(`Starting email login for ${email}...`)
    try {
      const result = await signIn('email', {
        email,
        redirect: false,
        callbackUrl: '/dashboard'
      })
      addLog(`Email login result: ${JSON.stringify(result)}`)
    } catch (error: any) {
      addLog(`Email login error: ${error.message}`)
    }
  }

  const testDirectAPI = async () => {
    addLog('Testing direct API call...')
    try {
      const response = await fetch('/api/auth/signin/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          csrfToken,
          callbackUrl: '/dashboard'
        })
      })
      const text = await response.text()
      addLog(`API Response (${response.status}): ${text.substring(0, 100)}...`)
    } catch (error: any) {
      addLog(`API call error: ${error.message}`)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Login Test & Diagnostics</h1>

      <div className="grid gap-6">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>CSRF Token:</strong> {csrfToken ? '✅ Available' : '❌ Missing'}
              </div>
              <div>
                <strong>Providers:</strong> {providers ? Object.keys(providers).join(', ') : 'Loading...'}
              </div>
              <div>
                <strong>Debug Page:</strong>{' '}
                <a href="/debug" target="_blank" className="text-blue-500 underline">
                  Open Debug Dashboard
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Login Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Email address"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={testGoogleLogin} variant="default">
                Test Google Login
              </Button>
              <Button onClick={testEmailLogin} variant="default">
                Test Email Login
              </Button>
              <Button onClick={testDirectAPI} variant="outline">
                Test Direct API
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">No activity yet...</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="text-sm font-mono mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
            <Button
              onClick={() => setLogs([])}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Clear Logs
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle>How to Use This Test Page</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Open the Debug Dashboard in another tab</li>
              <li>Click "Test Google Login" or "Test Email Login"</li>
              <li>Watch the Activity Log here for immediate results</li>
              <li>Check the Debug Dashboard for detailed error tracking</li>
              <li>The logs will show exactly what\'s failing</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}