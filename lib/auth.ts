import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from './db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || 'smtp.resend.com',
        port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
        auth: {
          user: 'resend',
          pass: process.env.RESEND_API_KEY!,
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@stepperslife.com',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // 🔥 SSO MAGIC - Cookie domain sharing
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        domain: '.stepperslife.com', // ← KEY: Enables SSO across all subdomains
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
  },

  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/sign-in',
    signOut: '/sign-out',
    error: '/auth/error',
  },

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id

        // Get user roles from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { roles: true },
        })

        // @ts-expect-error - Adding custom roles field
        session.user.roles = dbUser?.roles || ['USER']
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
})
