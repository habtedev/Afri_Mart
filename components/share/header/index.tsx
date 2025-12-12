'use client'
// Header: brand logo, search and top navigation
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { MenuIcon, ChevronDown, User, ShoppingCart, Heart } from "lucide-react";
import { Search } from "./search";
import Menu from "./menu";
import { Button } from "@/components/ui/button";
import data from "@/lib/data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Handle scroll effect for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [isMobileMenuOpen]);

  const handleCategoryHover = useCallback((category: string | null) => {
    setActiveCategory(category);
  }, []);

  // Mock cart items count - replace with your actual cart state
  const cartItemsCount = 3;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 bg-black text-white transition-all duration-300",
          isScrolled && "shadow-xl bg-black/95 backdrop-blur-sm"
        )}
      >
        {/* Promo banner */}
        <div className="bg-primary text-primary-foreground text-center py-2 px-4 text-sm">
          <p>
            🚀 Free shipping on orders over $50 •{" "}
            <Link
              href="/offers"
              className="font-semibold underline underline-offset-2 hover:no-underline"
            >
              Shop now
            </Link>
          </p>
        </div>

        {/* Main header section */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4 lg:gap-8">
            {/* Logo & Brand */}
            <Link
              href="/"
              className="flex items-center gap-3 min-w-0 flex-shrink-0"
              aria-label={`${APP_NAME} - Go to homepage`}
            >
              <div className="relative w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0">
                <Image
                  src="/logo/AfriMartLog.png"
                  alt={`${APP_NAME} logo`}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 48px, 64px"
                />
              </div>
              <span className="font-bold text-xl lg:text-2xl tracking-tight truncate">
                {APP_NAME}
              </span>
            </Link>

            {/* Desktop Search bar */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-4">
              <Search />
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                asChild
              >
                <Link href="/account" className="flex flex-col items-center">
                  <User className="w-5 h-5" />
                  <span className="text-xs mt-1">Account</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                asChild
              >
                <Link href="/wishlist" className="flex flex-col items-center">
                  <Heart className="w-5 h-5" />
                  <span className="text-xs mt-1">Wishlist</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 relative"
                asChild
              >
                <Link href="/cart" className="flex flex-col items-center">
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemsCount > 0 && (
                      <Badge
                        className="absolute -top-2 -right-2 px-1.5 min-w-[1.25rem] h-5 bg-red-500 border-0"
                        variant="destructive"
                      >
                        {cartItemsCount}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs mt-1">Cart</span>
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <MenuIcon className="w-6 h-6" />
            </Button>
          </div>

          {/* Mobile search bar (appears below on scroll) */}
          <div
            className={cn(
              "lg:hidden mt-3 transition-all duration-300",
              isScrolled && "opacity-0 pointer-events-none"
            )}
          >
            <Search />
          </div>
        </div>

        {/* Navigation bar with categories */}
        <div className="border-t border-white/10 bg-gray-800">
          <div className="container mx-auto px-4">
            <nav
              className="flex items-center overflow-x-auto scrollbar-hide"
              aria-label="Main navigation"
            >
              {/* All Categories dropdown trigger */}
              <div
                className="relative group"
                onMouseEnter={() => handleCategoryHover("all")}
                onMouseLeave={() => handleCategoryHover(null)}
              >
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-white hover:bg-white/10 rounded-none h-12 px-4"
                >
                  <MenuIcon className="w-5 h-5" />
                  <span className="font-semibold">All Categories</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </Button>
              </div>

              {/* Main navigation links */}
              <div className="flex items-center divide-x divide-white/10">
                {data.headerMenus.map((menu) => (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    className={cn(
                      "px-4 h-12 flex items-center text-sm font-medium whitespace-nowrap",
                      "text-white hover:bg-white/10 transition-colors",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                    )}
                    onMouseEnter={() => handleCategoryHover(menu.name)}
                    onMouseLeave={() => handleCategoryHover(null)}
                  >
                    {menu.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            className={cn(
              "fixed top-0 right-0 bottom-0 w-80 bg-gray-900 text-white z-50 p-6",
              "transform transition-transform duration-300 ease-in-out lg:hidden",
              isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Menu</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <MenuIcon className="w-6 h-6 rotate-90" />
              </Button>
            </div>

            <nav className="space-y-4" aria-label="Mobile navigation">
              <div className="mb-6">
                <Search />
              </div>

              {data.headerMenus.map((menu) => (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className="block py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{menu.name}</span>
                  </div>
                </Link>
              ))}

              <div className="pt-6 border-t border-white/10 space-y-3">
                <Link
                  href="/account"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>My Account</span>
                </Link>
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Heart className="w-5 h-5" />
                  <span>Wishlist</span>
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-white/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemsCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 px-1.5 min-w-[1.25rem] h-5 bg-red-500 border-0">
                        {cartItemsCount}
                      </Badge>
                    )}
                  </div>
                  <span>Cart</span>
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}