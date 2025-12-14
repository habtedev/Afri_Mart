'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { MenuIcon, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

import Menu from './menu'
import { Search } from './search'
import { APP_NAME } from '@/lib/constants'
import data from '@/lib/data'

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCategoryHover = useCallback((category: string | null) => {
    setActiveCategory(category)
  }, [])

  return (
    <>
      <header className={cn('sticky top-0 z-50 bg-black text-white transition-all duration-300', isScrolled && 'shadow-xl bg-black/95 backdrop-blur-sm')}>
        {/* Promo */}
        <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-sm">
          🚀 Free shipping on orders over $50 • <Link href="/offers" className="font-semibold underline">Shop now</Link>
        </div>

        {/* Main header */}
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo/AfriMartLog.png" alt={`${APP_NAME} logo`} width={48} height={48} className="object-contain" />
            <span className="font-bold text-xl lg:text-2xl tracking-tight truncate">{APP_NAME}</span>
          </Link>

          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-4">
            <Search />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <Menu />
          </div>

          {/* Mobile menu button */}
          <button className="lg:hidden text-white hover:bg-white/10 p-2 rounded" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Category nav */}
        <div className="border-t border-white/10 bg-gray-800">
          <div className="container mx-auto px-4 flex overflow-x-auto scrollbar-hide">
            <button className="flex items-center gap-2 text-white hover:bg-white/10 px-4 h-12" onMouseEnter={() => handleCategoryHover('all')} onMouseLeave={() => handleCategoryHover(null)}>
              <MenuIcon className="w-5 h-5" />
              <span className="font-semibold">All Categories</span>
              <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
            </button>
            {data.headerMenus.map(menu => (
              <Link key={menu.href} href={menu.href} className="px-4 h-12 flex items-center text-sm font-medium whitespace-nowrap text-white hover:bg-white/10">
                {menu.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="fixed top-0 right-0 bottom-0 w-80 bg-gray-900 text-white z-50 p-6 transition-transform duration-300 transform">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Menu</h2>
              <button className="p-2 rounded hover:bg-white/10" onClick={() => setIsMobileMenuOpen(false)}>
                <MenuIcon className="w-6 h-6 rotate-90" />
              </button>
            </div>
            <Search />
            {data.headerMenus.map(menu => (
              <Link key={menu.href} href={menu.href} className="block py-3 px-4 rounded-lg hover:bg-white/10">
                {menu.name}
              </Link>
            ))}
            <Menu />
          </div>
        </div>
      )}
    </>
  )
}
