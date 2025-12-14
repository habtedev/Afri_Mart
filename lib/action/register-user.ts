'use server'
import { z } from 'zod'

const RegisterSchema = z.object({
  email: z.string().email().transform((v) => v.trim().toLowerCase()),
  name: z.string().min(2).max(64),
  password: z.string().min(6).max(64),
})

// Server action delegates to Node.js API route to avoid Edge crypto.
export async function registerUser(input: unknown) {
  const parsed = RegisterSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: 'Invalid input' }
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed.data),
    cache: 'no-store',
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Server error' }))
    return { ok: false, error: data.error ?? 'Server error' }
  }
  const data = await res.json()
  return { ok: true, userId: data.userId as string }
}
