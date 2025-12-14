'use client'

import Link from 'next/link'
import AuthFooter from '@/components/auth/AuthFooter'
import { APP_NAME } from '@/lib/constants'
import { ToasterProvider } from '@/components/ui/use-toast'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToasterProvider>
      <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="py-6 text-center">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight text-gray-900"
        >
          {APP_NAME}
        </Link>
      </header>

      {/* Auth Content */}
      <section className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">{children}</div>
      </section>

      {/* Minimal Footer */}
      <AuthFooter />

      {/* Toast notifications handled by ToasterProvider */}
    </main>
    </ToasterProvider>
  )
}
