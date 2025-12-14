"use client"
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function GoogleSignInButton() {
  return (
    <Button
      onClick={() => signIn('google', { callbackUrl: '/' })}
      variant="outline"
      className="w-full flex items-center justify-center gap-2"
    >
      <Image
        src="/icons/google.svg"
        alt="Google"
        width={20}
        height={20}
        className="inline-block align-middle"
      />
      Sign in with Google
    </Button>
  )
}
