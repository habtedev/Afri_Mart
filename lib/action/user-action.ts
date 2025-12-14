'use server'
import { signIn, signOut } from '@/auth'
import { IUserSignIn } from '@/types'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export async function signInWithCredentials(user: IUserSignIn) {
  try {
    const result = await signIn('credentials', {
      ...user,
      redirect: false,
    })

    // NextAuth can return undefined or an object with an error field on bad creds.
    if (!result || (result as { error?: string }).error) {
      return { ok: false, error: 'Invalid email or password' }
    }

    return { ok: true }
  } catch (error) {
    if (
      (error instanceof AuthError && error.type === 'CredentialsSignin') ||
      (typeof error === 'object' && error && (error as { type?: string }).type === 'CredentialsSignin') ||
      `${error}`.includes('CredentialsSignin')
    ) {
      return { ok: false, error: 'Invalid email or password' }
    }

    return { ok: false, error: 'Unable to sign in' }
  }
}
export const SignOut = async () => {
  const redirectTo = await signOut({ redirect: false })
  redirect(redirectTo.redirect)
}