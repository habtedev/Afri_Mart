'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { useToast } from '@/components/ui/use-toast'
import { IUserSignIn } from '@/types'
import { UserSignInSchema } from '@/lib/vallidator'
import { APP_NAME } from '@/lib/constants'

const DEFAULT_VALUES =
  process.env.NODE_ENV === 'development'
    ? { email: 'admin@example.com', password: '123456' }
    : { email: '', password: '' }

export default function CredentialsSignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<IUserSignIn>({
    resolver: zodResolver(UserSignInSchema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onTouched',
  })
const onSubmit = async (data: IUserSignIn) => {
  if (isLoading) return
  setIsLoading(true)

  try {
    console.log('callbackUrl:', callbackUrl)
    const res = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
      callbackUrl,
    })
    console.log('signIn result:', res)

    if (res?.error) {
      // Show backend error directly in toast
      toast({
        title: 'Sign in failed',
        description: res.error, // Error message from authorize()
        variant: 'destructive',
      })
      return
    }

    if (res?.ok && !res.error) {
      toast({
        title: 'Successfully signed in!',
        description: 'Redirecting…',
        variant: 'default',
      })
      router.replace(callbackUrl)
    } else {
      toast({
        title: 'Sign in failed',
        description: 'Could not log in. Please try again later.',
        variant: 'destructive',
      })
    }
  } catch (err: any) {
    toast({
      title: 'Network error',
      description: err?.message || 'Could not connect to the server.',
      variant: 'destructive',
    })
  } finally {
    setIsLoading(false)
  }
}


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Enter your email" autoComplete="email" />
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
                  {...field}
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
          {isLoading ? 'Signing in…' : 'Sign In'}
        </Button>

        {/* Legal Notice */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          By signing in, you agree to {APP_NAME}&apos;s{' '}
          <Link href="/page/conditions-of-use" className="underline">
            Conditions of Use
          </Link>{' '}
          and{' '}
          <Link href="/page/privacy-policy" className="underline">
            Privacy Notice
          </Link>.
        </p>
      </form>
    </Form>
  )
}
