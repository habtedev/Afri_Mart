'use client'

import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Shield, Truck, CreditCard } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { APP_NAME } from '@/lib/constants'

import CredentialsSignInForm from './credentials-signin-form'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'

export default function SignInPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-gray-50">
      <div className="container max-w-md w-full px-4">
        {/* Sign In Card */}
        <Card className="border-2 shadow-lg w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-2">
              Welcome back! Please sign in to continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-4 flex flex-col gap-4">
            {/* Google Sign-In */}
            <GoogleSignInButton />

            {/* Divider */}
            <div className="flex items-center my-2">
              <span className="grow border-t border-gray-300" />
              <span className="mx-2 text-gray-400 text-sm">or</span>
              <span className="grow border-t border-gray-300" />
            </div>

            {/* Email / Password Sign-In */}
            <CredentialsSignInForm />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t pt-6">
            <p className="text-center text-sm text-muted-foreground">
              New to {APP_NAME}?{' '}
              <Link
                href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="underline text-primary hover:text-primary/80"
              >
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Benefits */}
        <div className="mt-10 space-y-6">
          <h2 className="text-2xl font-bold text-center mb-4">Why Sign In?</h2>

          <BenefitCard
            icon={<Truck className="h-6 w-6" />}
            title="Fast, Free Delivery"
            description="Access fast shipping and exclusive deals."
          />

          <BenefitCard
            icon={<Shield className="h-6 w-6" />}
            title="Secure Shopping"
            description="Your account and transactions are protected."
          />

          <BenefitCard
            icon={<CreditCard className="h-6 w-6" />}
            title="Easy Payment"
            description="Multiple payment options for smooth checkout."
          />
        </div>
      </div>
    </div>
  )
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="shrink-0 bg-primary text-primary-foreground rounded-full p-3">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
