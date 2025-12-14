'use client'
import React from 'react'
import useCartSidebar from '@/hook/use-cart-sidebar'
import CartSidebar from './cart-sidebar'
import { Toaster } from '../ui/toast'
import { SessionProvider } from 'next-auth/react'

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode
}) {
  const isCartSidebarOpen = useCartSidebar()

  return (
    <SessionProvider>
      {isCartSidebarOpen ? (
        <div className='flex min-h-screen'>
          <div className='flex-1 overflow-hidden'>{children}</div>
          <CartSidebar />
        </div>
      ) : (
        <div>{children}</div>
      )}
      <Toaster />
    </SessionProvider>
  )
}