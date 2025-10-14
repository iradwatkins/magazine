/**
 * SIMPLIFIED AUTHENTICATION CONFIGURATION
 *
 * Philosophy: Keep it simple until it works perfectly
 * - JWT sessions (no database complexity)
 * - Google OAuth ONLY (removed email/magic link)
 * - No fancy SSO or cross-domain features
 */

import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Use Prisma adapter for account storage only
  adapter: PrismaAdapter(prisma),

  // CRITICAL: Use JWT sessions for simplicity and reliability
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Google OAuth only - simple and reliable
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Allow account linking for simplicity
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  // Simple, standard pages
  pages: {
    signIn: '/sign-in',
    error: '/auth/error',
  },

  // JWT and session callbacks - keep user info in JWT
  callbacks: {
    async jwt({ token, user, account }) {
      // First login - add user info to token
      if (user) {
        token.id = user.id
        token.email = user.email

        // Get user role from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        })

        token.role = dbUser?.role || 'USER'
      }
      return token
    },

    async session({ session, token }) {
      // Pass token info to session
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        // @ts-ignore - adding custom field
        session.user.role = token.role as string
      }
      return session
    },

    async signIn({ user, account, profile }) {
      // Allow sign in
      return true
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },

  // Trust the host
  trustHost: true,

  // Use the secret
  secret: process.env.NEXTAUTH_SECRET,

  // Enable debug to see what's happening
  debug: true,

  // Add events for better logging
  events: {
    async signIn({ user }) {
      console.log('[NextAuth] User signed in:', user.email)
    },
    async signOut() {
      console.log('[NextAuth] User signed out')
    },
    async session({ session }) {
      console.log('[NextAuth] Session checked:', session.user?.email)
    },
  },
})