'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ICarousel } from '@/types'

type HomeCarouselProps = {
  items: ICarousel[]
  autoPlayDelay?: number
  showNavigation?: boolean
  showOverlay?: boolean
  className?: string
  aspectRatio?: string
}

export function HomeCarousel({
  items,
  autoPlayDelay = 5000,
  showNavigation = true,
  showOverlay = true,
  className,
  aspectRatio = '16/6',
}: HomeCarouselProps) {
  const [isMounted, setIsMounted] = React.useState(false)
  const plugin = React.useRef(
    Autoplay({ 
      delay: autoPlayDelay, 
      stopOnInteraction: true,
      stopOnMouseEnter: true,
      jump: false,
    })
  )

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      // You would typically trigger previous slide here
      event.preventDefault()
    } else if (event.key === 'ArrowRight') {
      // You would typically trigger next slide here
      event.preventDefault()
    }
  }, [])

  if (!isMounted) {
    return (
      <div className={cn('relative w-full', className)}>
        <div className={`relative aspect-[${aspectRatio}] w-full overflow-hidden`}>
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    )
  }

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div 
      className={cn('relative w-full group', className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured content"
    >
      <Carousel
        plugins={[plugin.current]}
        opts={{
          loop: true,
          align: 'start',
          skipSnaps: false,
          duration: 30,
        }}
        className="w-full"
        dir="ltr"
        onKeyDownCapture={handleKeyDown}
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem 
              key={`${item.title}-${index}`}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${items.length}`}
            >
              <Link 
                href={item.url} 
                aria-label={item.title}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary rounded-lg overflow-hidden"
              >
                <div 
                  className={`relative aspect-[${aspectRatio}] w-full overflow-hidden`}
                  style={{ aspectRatio }}
                >
                  {/* Image with optimized loading */}
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                    priority={index === 0}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    quality={90}
                  />

                  {/* Overlay with gradient options */}
                  {showOverlay && (
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                  )}

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                      <div className="max-w-2xl text-white p-4 md:p-6 rounded-lg bg-gradient-to-r from-black/30 to-transparent backdrop-blur-[1px]">
                        <h2 className="mb-3 md:mb-6 text-2xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                          {item.title}
                        </h2>
                        
                        {item.description && (
                          <p className="mb-4 md:mb-6 text-sm md:text-lg lg:text-xl text-white/90 line-clamp-2 md:line-clamp-3">
                            {item.description}
                          </p>
                        )}

                        {item.buttonCaption && (
                          <Button 
                            size="lg" 
                            className="mt-2 md:mt-4 animate-in fade-in slide-in-from-left-5 duration-500"
                            variant="default"
                            asChild
                          >
                            <span>{item.buttonCaption}</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation controls */}
        {showNavigation && items.length > 1 && (
          <>
            <CarouselPrevious 
              className="left-2 md:left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Previous slide"
            />
            <CarouselNext 
              className="right-2 md:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              aria-label="Next slide"
            />
            
            {/* Indicators/Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {items.map((_, index) => (
                <button
                  key={index}
                  className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label={`Go to slide ${index + 1}`}
                  // You would typically connect this to carousel API
                />
              ))}
            </div>
          </>
        )}
      </Carousel>
    </div>
  )
}