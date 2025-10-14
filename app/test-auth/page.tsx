import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function TestAuthPage() {
  const session = await auth()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-semibold mb-2">Session Status:</h2>
        {session ? (
          <div>
            <p className="text-green-600">✅ Authenticated</p>
            <p>User ID: {session.user?.id}</p>
            <p>Email: {session.user?.email}</p>
            <p>Name: {session.user?.name}</p>
          </div>
        ) : (
          <p className="text-red-600">❌ Not authenticated</p>
        )}
      </div>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Test Links:</h2>
        <ul className="space-y-2">
          <li>
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Go to Dashboard
            </a>
          </li>
          <li>
            <a href="/articles" className="text-blue-600 hover:underline">
              Go to Articles
            </a>
          </li>
          <li>
            <a href="/sign-in" className="text-blue-600 hover:underline">
              Go to Sign In
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}