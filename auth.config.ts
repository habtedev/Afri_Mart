import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { connectToDatabase } from '@/lib/db'
import User from '@/lib/db/models/user.model'
import bcrypt from 'bcrypt'
import type { NextAuthConfig } from 'next-auth'

const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Email and password are required.')
        }
        const email = typeof credentials.email === 'string' ? credentials.email : ''
        await connectToDatabase()
        const user = await User.findOne({ email: email.toLowerCase().trim() })
        if (!user) {
          throw new Error('No account found with this email.')
        }
        const password = typeof credentials.password === 'string' ? credentials.password : ''
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          throw new Error('Incorrect password.')
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  pages: {
    signIn: '/sign-in', // Must match your actual sign-in route
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === 'production'
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
}

export default authConfig
