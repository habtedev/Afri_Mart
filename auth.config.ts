import Credentials from 'next-auth/providers/credentials'
import { connectToDatabase } from '@/lib/db'
import User from '@/lib/db/models/user.model'
import bcrypt from 'bcrypt'
import type { NextAuthConfig } from 'next-auth'

const authConfig: NextAuthConfig = {
  providers: [
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
    signIn: '/auth/signin', // Optional: custom sign-in page
  },
}

export default authConfig
