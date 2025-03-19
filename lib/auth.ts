import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { JWT } from "next-auth/jwt"
import { Session } from "next-auth"

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('Missing GOOGLE_CLIENT_ID')
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Missing GOOGLE_CLIENT_SECRET')
}

const ALLOWED_EMAILS = [
  "mfesevur@gmail.com",
  "jiskadehoop@gmail.com"
]

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn attempt:', { user, account, profile })
      if (!user.email) {
        console.log('No email provided')
        return false
      }
      const isAllowed = ALLOWED_EMAILS.includes(user.email)
      console.log('Email allowed:', isAllowed)
      return isAllowed
    },
    async jwt({ token, user, account }) {
      console.log('JWT callback:', { token, user, account })
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback:', { session, token })
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: true,
} 