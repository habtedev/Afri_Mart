export const runtime = 'nodejs'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { APP_NAME } from '@/lib/constants'
import SignInClient from './SignInClient'

export const metadata: Metadata = {
  title: `Sign In - ${APP_NAME}`,
  description: `Sign in to your ${APP_NAME} account to enjoy fast delivery, secure shopping, and exclusive deals.`,
}

export default async function SignIn({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  const session = await auth();
  console.log('SIGN-IN PAGE SESSION:', session);
  if (session) {
    console.log('SESSION FOUND, REDIRECTING TO:', callbackUrl || '/');
    redirect(callbackUrl || '/');
  }
  return <SignInClient />;
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
