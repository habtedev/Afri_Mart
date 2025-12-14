'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { signIn } from 'next-auth/react'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  PasswordStrengthIndicator,
  validatePasswordStrength,
} from './password-strength'

/* ---------------- Schema ---------------- */
const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type RegisterInput = z.infer<typeof RegisterSchema>

/* ---------------- Component ---------------- */
export default function RegisterForm({
  callbackUrl,
}: {
  callbackUrl?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const form = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    mode: 'onTouched',
  })

  /* ---------------- Submit ---------------- */
  const onSubmit = async (data: RegisterInput) => {
    if (loading) return
    setLoading(true)

    const toastId = toast.loading('Creating account...')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      // Handle registration errors
      if (!res.ok || !json.ok) {
        if (json.code === 'EMAIL_EXISTS') {
          toast.error('This email is already registered', { id: toastId })
        } else {
          toast.error(json.error ?? 'Registration failed', { id: toastId })
        }
        return
      }

      // Auto-login after successful registration
      const signInRes = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (signInRes?.ok) {
        toast.success('Account created and logged in!', { id: toastId })
        // Redirect to callbackUrl if provided, else dashboard
        router.replace(callbackUrl ?? '/dashboard')
      } else {
        toast.dismiss(toastId)
        toast(
          'Account created, but auto-login failed. Please log in manually.',
          { icon: '⚠️' }
        )
        router.replace('/login') // fallback to login page
      }
    } catch {
      toast.error('Network error. Please try again.', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- Render ---------------- */
  return (
    <>
      <Toaster position="top-right" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" autoComplete="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      setPasswordStrength(
                        validatePasswordStrength(e.target.value)
                      )
                    }}
                  />
                </FormControl>

                <PasswordStrengthIndicator strength={passwordStrength} />
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
      </Form>
    </>
  )
}
