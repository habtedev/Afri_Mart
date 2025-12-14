import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  const session = await auth()

  if (!session) {
    redirect('/sign-in?callbackUrl=/account')
  }

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <h1 className="text-2xl font-bold mb-4">Your Account</h1>

      <p className="text-muted-foreground">
        Welcome back, {session.user?.name ?? 'User'}
      </p>
    </div>
  )
}
