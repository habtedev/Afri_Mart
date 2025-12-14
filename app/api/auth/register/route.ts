import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/lib/db/models/user.model'
import { z } from 'zod'

export const runtime = 'nodejs'

const RegisterSchema = z.object({
  email: z.string().email().transform((v) => v.trim().toLowerCase()),
  name: z.string().min(2).max(64),
  password: z.string().min(6).max(64),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = RegisterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Invalid input' }, { status: 400 })
    }

    const { email, name, password } = parsed.data
    await connectToDatabase()

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ ok: false, error: 'Email already in use' }, { status: 409 })
    }

    // No need to hash here, let the model do it
    const doc = await User.create({
      email,
      name,
      password,
      role: 'User',
      emailVerified: false,
    })

    return NextResponse.json({ ok: true, userId: doc._id.toString() }, { status: 201 })
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}