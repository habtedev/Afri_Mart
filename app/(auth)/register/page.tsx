'use client'


import Link from 'next/link'
import { Shield, Truck, CreditCard } from 'lucide-react'
import { Suspense } from 'react'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'
import RegisterForm from './register-form'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'

interface SignUpPageProps {
  callbackUrl?: string
}

export default function SignUpPage({ callbackUrl = '/' }: SignUpPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-gray-50">
      <div className="container max-w-md w-full px-4">
        {/* Registration Card */}
        <Card className="border-2 shadow-lg w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-2">
              Join millions of customers enjoying fast, secure shopping
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-4 flex flex-col gap-4">

            {/* Google Sign-In */}
            <Suspense>
              <GoogleSignInButton />
            </Suspense>

            {/* Divider */}
            <div className="flex items-center my-2">
              <span className="flex-grow border-t border-gray-300"></span>
              <span className="mx-2 text-gray-400 text-sm">or</span>
              <span className="flex-grow border-t border-gray-300"></span>
            </div>

            {/* Email/Password Registration */}
            <RegisterForm callbackUrl={callbackUrl} />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t pt-6">
            <p className="text-center text-sm text-muted-foreground">
              By creating an account, you agree to {APP_NAME}&apos;s{' '}
              <Link href="/conditions-of-use" className="text-primary hover:underline">
                Conditions of Use
              </Link>{' '}
              and{' '}
              <Link href="/privacy-notice" className="text-primary hover:underline">
                Privacy Notice
              </Link>.
            </p>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Benefits Section */}
        <div className="mt-10 space-y-6">
          <h2 className="text-2xl font-bold text-center mb-4">Why Join {APP_NAME}?</h2>
          <BenefitCard
            icon={<Truck className="h-6 w-6" />}
            title="Fast, Free Delivery"
            description="Free delivery on your first order and fast shipping on millions of items."
          />
          <BenefitCard
            icon={<Shield className="h-6 w-6" />}
            title="Secure Shopping"
            description="Your security is our priority with end-to-end encrypted transactions."
          />
          <BenefitCard
            icon={<CreditCard className="h-6 w-6" />}
            title="Easy Payment"
            description="Multiple payment options including card, wallet, and EMI."
          />
        </div>
      </div>
    </div>
  )
}

// Benefit Card Component
function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex-shrink-0 bg-primary text-primary-foreground rounded-full p-3">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
