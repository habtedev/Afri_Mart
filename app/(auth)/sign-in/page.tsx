
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Shield, Truck, CreditCard } from 'lucide-react'

import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'
import CredentialsSignInForm from './credentials-signin-form'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'

export const metadata: Metadata = {
  title: `Sign In - ${APP_NAME}`,
  description: `Sign in to your ${APP_NAME} account to enjoy fast delivery, secure shopping, and exclusive deals.`,
}

export default async function SignIn({ searchParams }: { searchParams: { callbackUrl?: string } }) {
  const callbackUrl = searchParams.callbackUrl || '/'
  const session = await auth()
  if (session) redirect(callbackUrl)

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
              <span className="flex-grow border-t border-gray-300"></span>
              <span className="mx-2 text-gray-400 text-sm">or</span>
              <span className="flex-grow border-t border-gray-300"></span>
            </div>

            {/* Email/Password Sign-In */}
            <CredentialsSignInForm callbackUrl={callbackUrl} />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t pt-6">
            <p className="text-center text-sm text-muted-foreground">
              New to {APP_NAME}?{' '}
              <Link href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="underline text-primary hover:text-primary/80">
                Create an account
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Benefits Section */}
        <div className="mt-10 space-y-6">
          <h2 className="text-2xl font-bold text-center mb-4">Why Sign In?</h2>
          <BenefitCard
            icon={<Truck className="h-6 w-6" />}
            title="Fast, Free Delivery"
            description="Access fast shipping and exclusive deals on millions of items."
          />
          <BenefitCard
            icon={<Shield className="h-6 w-6" />}
            title="Secure Shopping"
            description="Your account and transactions are protected with top-notch security."
          />
          <BenefitCard
            icon={<CreditCard className="h-6 w-6" />}
            title="Easy Payment"
            description="Multiple payment options available for a smooth checkout experience."
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
