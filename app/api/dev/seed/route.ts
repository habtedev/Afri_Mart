import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/lib/db/models/user.model'

export const runtime = 'nodejs'

export async function POST() {
  try {
    await connectToDatabase()

    const email = 'admin@example.com'
    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ ok: true, message: 'Admin already exists' })
    }

    const doc = await User.create({
      email,
      name: 'Admin',
      password: '123456',
      role: 'Admin',
      emailVerified: true,
    })

    return NextResponse.json({ ok: true, userId: doc._id.toString() })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Seed failed' }, { status: 500 })
  }
}
