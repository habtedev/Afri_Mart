import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Shield, Truck, CreditCard } from 'lucide-react'

import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/lib/constants'
import RegisterForm from './register-form'

export const metadata: Metadata = {
  title: `Sign Up - ${APP_NAME}`,
  description: 'Create your account to enjoy fast delivery, exclusive deals, and secure shopping.',
}

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const params = await searchParams
  const callbackUrl = params.callbackUrl || '/'
  const session = await auth()
  
  if (session) redirect(callbackUrl)

  return (
    <div className="min-h-screen flex items-center justify-center py-12 bg-gray-50">
      <div className="container max-w-3xl w-full px-4">
        {/* Registration Form */}
        <Card className="border-2 shadow-lg w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
            <CardDescription className="text-base text-muted-foreground mt-2">
              Join millions of customers enjoying fast, secure shopping
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-4">
            <RegisterForm callbackUrl={callbackUrl} />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t pt-6">
            <div className="text-sm text-center text-muted-foreground">
              By creating an account, you agree to {APP_NAME}&apos;s{' '}
              <Link href="/conditions-of-use" className="text-primary hover:underline">
                Conditions of Use
              </Link>{' '}
              and{' '}
              <Link href="/privacy-notice" className="text-primary hover:underline">
                Privacy Notice
              </Link>
            </div>

            <div className="w-full">
              <p className="text-center text-sm text-muted-foreground mb-4">
                Already have an account?
              </p>
              <Link href={`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="block">
                <Button variant="outline" className="w-full py-4 text-base">
                  Sign in to your account
                </Button>
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Benefits Section - below the form */}
        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-bold text-center mb-6">Why Join {APP_NAME}?</h2>
          <BenefitCard
            icon={<Truck className="h-6 w-6" />}
            title="Fast, Free Delivery"
            description="Free delivery on your first order and fast shipping on millions of items"
          />
          <BenefitCard
            icon={<Shield className="h-6 w-6" />}
            title="Secure Shopping"
            description="Your security is our priority with end-to-end encrypted transactions"
          />
          <BenefitCard
            icon={<CreditCard className="h-6 w-6" />}
            title="Easy Payment"
            description="Multiple payment options including card, wallet, and EMI"
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
