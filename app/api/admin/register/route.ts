import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import User from '@/lib/db/models/user.model'
import { z } from 'zod'

export const runtime = 'nodejs'

const AdminRegisterSchema = z.object({
  email: z.string().email().transform((v) => v.trim().toLowerCase()),
  name: z.string().min(2).max(64),
  password: z.string().min(6).max(64),
})

export async function POST(req: Request) {
  const secretHeader = req.headers.get('x-admin-secret') || req.headers.get('X-Admin-Secret')
  const expected = process.env.ADMIN_SEED_SECRET
  if (!expected || secretHeader !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = AdminRegisterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Invalid input' }, { status: 400 })
    }

    const { email, name, password } = parsed.data
    await connectToDatabase()

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ ok: false, error: 'Email already in use' }, { status: 409 })
    }

    const doc = await User.create({
      email,
      name,
      password, // Use plain password or hash it using bcrypt before this step
      role: 'Admin',
      emailVerified: true,
    })

    return NextResponse.json({ ok: true, userId: doc._id.toString() }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}
