import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Shield, Truck, CreditCard } from 'lucide-react'

import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'
import CredentialsSignInForm from './credentials-signin-form'

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
      <div className="container max-w-3xl w-full px-4">
        {/* Sign In Form */}
        <Card className="border-2 shadow-lg w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-2">
              Welcome back! Please sign in to continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-4">
            <CredentialsSignInForm />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t pt-6">
            <div className="w-full">
              <p className="text-center text-sm text-muted-foreground mb-4">
                New to {APP_NAME}?
              </p>
              <Link href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="block">
                <Button variant="outline" className="w-full py-4 text-base">
                  Create your {APP_NAME} account
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Benefits Section - below the form */}
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-bold text-center mb-6">Why Sign In?</h2>
          <BenefitCard
            icon={<Truck className="h-6 w-6" />}
            title="Fast, Free Delivery"
            description="Access fast shipping and exclusive deals on millions of items"
          />
          <BenefitCard
            icon={<Shield className="h-6 w-6" />}
            title="Secure Shopping"
            description="Your account and transactions are protected with top-notch security"
          />
          <BenefitCard
            icon={<CreditCard className="h-6 w-6" />}
            title="Easy Payment"
            description="Multiple payment options available for a smooth checkout"
          />
        </div>
      </div>
    </div>
  )
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4 mb-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="bg-primary text-primary-foreground rounded-full p-3">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
