'use client'

import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export default function UserButton() {
  const { data: session, status } = useSession()
  const pathname = usePathname()

  if (status === 'loading') {
    return (
      <div className="header-button flex items-center gap-2">
        <div className="flex flex-col text-xs text-left">
          <span>Loading…</span>
          <span className="font-bold">Account & Orders</span>
        </div>
        <ChevronDown />
      </div>
    )
  }

  if (!session?.user) {
    return (
      <Link href={`/sign-in?callbackUrl=${encodeURIComponent(pathname || '/')}`} className="header-button flex items-center gap-2">
        <div className="flex flex-col text-xs text-left">
          <span>Hello, sign in</span>
          <span className="font-bold">Account & Orders</span>
        </div>
        <ChevronDown />
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="header-button flex items-center gap-2 cursor-pointer">
          <div className="flex flex-col text-xs text-left">
            <span>Hello, {session.user.name}</span>
            <span className="font-bold">Account & Orders</span>
          </div>
          <ChevronDown />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{session.user.name}</p>
            <p className="text-xs text-muted-foreground">{session.user.email}</p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuGroup>
          <Link href="/account"><DropdownMenuItem>Your account</DropdownMenuItem></Link>
          <Link href="/account/orders"><DropdownMenuItem>Your orders</DropdownMenuItem></Link>
          {session.user.role === 'Admin' && (
            <Link href="/admin/overview"><DropdownMenuItem>Admin dashboard</DropdownMenuItem></Link>
          )}
        </DropdownMenuGroup>

        <DropdownMenuItem asChild>
          <Button variant="ghost" className="w-full justify-start" onClick={() => signOut({ callbackUrl: '/' })}>
            Sign out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
