'use client'

import Link from 'next/link'
import { Shield, Lock, HelpCircle } from 'lucide-react'
import {
  APP_NAME,
  APP_SUPPORT_EMAIL,
} from '@/lib/constants'

export default function AuthFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-600" />
            Secure Authentication
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-600" />
            Encrypted Passwords
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-gray-600" />
            Support Available
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
          <Link href="/page/privacy-policy" className="hover:text-gray-900">
            Privacy Policy
          </Link>
          <Link href="/page/conditions-of-use" className="hover:text-gray-900">
            Terms of Service
          </Link>
          <a
            href={`mailto:${APP_SUPPORT_EMAIL}`}
            className="hover:text-gray-900"
          >
            {APP_SUPPORT_EMAIL}
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-4 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
