import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Your Orders',
}

export default async function OrdersPage() {
  const session = await auth()

  if (!session) {
    redirect('/sign-in?callbackUrl=/account/orders')
  }

  return (
    <div className="container mx-auto max-w-5xl py-10">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      {/* Replace later with real orders */}
      <div className="border rounded-lg p-6 text-muted-foreground">
        You have no orders yet.
      </div>
    </div>
  )
}
