import { NextRequest, NextResponse } from 'next/server'

const protectedPrefixes = ['/wishlist', '/checkout', '/orders']

export async function proxy(req: NextRequest) {
  // Edge-safe: infer auth by presence of NextAuth session cookies.
  const { pathname } = req.nextUrl
  const hasSessionCookie = Boolean(
    req.cookies.get('__Secure-next-auth.session-token')?.value ||
      req.cookies.get('next-auth.session-token')?.value
  )

  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p))
  if (isProtected && !hasSessionCookie) {
    const callbackUrl = `${pathname}${req.nextUrl.search || ''}`
    const url = req.nextUrl.clone()
    url.pathname = '/sign-in'
    url.searchParams.set('callbackUrl', callbackUrl)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}