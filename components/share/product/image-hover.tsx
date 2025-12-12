"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { Play, Pause, Expand, ZoomIn, Heart, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ImageHoverProps {
  src: string
  hoverSrc: string
  alt: string
  className?: string
  priority?: boolean
  enableZoom?: boolean
  enableVideo?: boolean
  videoSrc?: string
  onLike?: () => void
  onShare?: () => void
  onQuickView?: () => void
  showBadges?: boolean
  badges?: Array<"new" | "sale" | "trending" | "sustainable">
  loading?: "eager" | "lazy"
}

const BADGE_CONFIG = {
  new: { label: "New", className: "bg-blue-500" },
  sale: { label: "Sale", className: "bg-red-500" },
  trending: { label: "Trending", className: "bg-purple-500" },
  sustainable: { label: "Eco", className: "bg-green-500" },
} as const

export default function ImageHover({
  src,
  hoverSrc,
  alt,
  className,
  priority = false,
  enableZoom = true,
  enableVideo = false,
  videoSrc,
  onLike,
  onShare,
  onQuickView,
  showBadges = true,
  badges = [],
  loading = "lazy",
}: ImageHoverProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const hoverTimeout = useRef<NodeJS.Timeout | null>(null)

  /* ------------------------------------------------------------
   * HOVER HANDLING (Optimized + Flicker-Free)
   * ------------------------------------------------------------ */
  const handleMouseEnter = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)

    hoverTimeout.current = setTimeout(() => {
      requestAnimationFrame(() => setIsHovered(true))
    }, 200) // slightly faster UX
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    requestAnimationFrame(() => setIsHovered(false))
  }, [])

  /* ------------------------------------------------------------
   * TOUCH (Mobile)
   * ------------------------------------------------------------ */
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setTouchStart(e.touches[0].clientX)
      handleMouseEnter()
    },
    [handleMouseEnter]
  )

  const handleTouchEnd = useCallback(() => {
    if (touchStart != null) {
      setTimeout(() => handleMouseLeave(), 900)
    }
  }, [touchStart, handleMouseLeave])

  /* ------------------------------------------------------------
   * MOUSE POSITION FOR ZOOM
   * ------------------------------------------------------------ */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!enableZoom || !containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      setMousePos({ x, y })
    },
    [enableZoom]
  )

  /* ------------------------------------------------------------
   * ZOOM TOGGLE
   * ------------------------------------------------------------ */
  const toggleZoom = useCallback(() => {
    if (!enableZoom) return
    setIsZoomed((z) => !z)
  }, [enableZoom])

  /* ------------------------------------------------------------
   * VIDEO CONTROL
   * ------------------------------------------------------------ */
  const toggleVideo = useCallback(() => {
    if (!enableVideo || !videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying((p) => !p)
  }, [isPlaying, enableVideo])

  /* ------------------------------------------------------------
   * DOUBLE TAP LIKE
   * ------------------------------------------------------------ */
  const handleDoubleClick = useCallback(() => {
    setIsLiked(true)
    onLike?.()

    setTimeout(() => setIsLiked(false), 700)
  }, [onLike])

  /* ------------------------------------------------------------
   * CLEANUP
   * ------------------------------------------------------------ */
  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    }
  }, [])

  /* ------------------------------------------------------------
   * KEYBOARD SUPPORT
   * ------------------------------------------------------------ */
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return

      if (e.key === "Enter" || e.key === " ") toggleZoom()
      if (e.key === "Escape") setIsZoomed(false)
    }

    document.addEventListener("keydown", listener)
    return () => document.removeEventListener("keydown", listener)
  }, [toggleZoom])

  return (
    <div className="relative group">
      {/* ------------------------------------------------------------
       * IMAGE WRAPPER
       * ------------------------------------------------------------ */}
      <div
        ref={containerRef}
        className={cn(
          "relative h-52 w-full overflow-hidden rounded-lg bg-gradient-to-br from-muted/20 to-muted/5",
          enableZoom && "cursor-zoom-in",
          isZoomed && "cursor-zoom-out",
          "select-none",
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={enableZoom ? handleMouseMove : undefined}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
        role="button"
        tabIndex={0}
        aria-label={alt}
      >
        {/* BASE + HOVER IMAGES */}
        <div className="relative h-full w-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            loading={loading}
            quality={85}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              "object-contain transition-all duration-500",
              isHovered ? "opacity-0 scale-105" : "opacity-100 scale-100",
              isZoomed && "scale-150"
            )}
          />

          <Image
            src={hoverSrc}
            alt={`${alt} hover image`}
            fill
            loading={loading}
            quality={85}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              "absolute inset-0 object-contain transition-all duration-500",
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100",
              isZoomed && "scale-150"
            )}
          />
        </div>

        {/* ------------------------------------------------------------
         * ZOOM LENS
         * ------------------------------------------------------------ */}
        {enableZoom && isHovered && !isZoomed && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, transparent 100px, rgba(0,0,0,0.1) 150px)`,
            }}
          />
        )}

        {/* ------------------------------------------------------------
         * VIDEO OVERLAY
         * ------------------------------------------------------------ */}
        {enableVideo && videoSrc && (
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-contain"
            />
            <div className="absolute bottom-2 right-2">
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={toggleVideo}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------
         * RIGHT ACTION BUTTONS
         * ------------------------------------------------------------ */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Zoom */}
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={toggleZoom}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          {/* Like */}
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={() => {
              setIsLiked((l) => !l)
              onLike?.()
            }}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-red-500 text-red-500")} />
          </Button>

          {/* Share */}
          {onShare && (
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={onShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* ------------------------------------------------------------
         * BADGES
         * ------------------------------------------------------------ */}
        {showBadges && badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {badges.map((b) => {
              const config = BADGE_CONFIG[b]
              if (!config) return null

              return (
                <span
                  key={b}
                  className={cn(
                    "px-2 py-1 text-xs font-semibold text-white rounded-full shadow-lg",
                    config.className
                  )}
                >
                  {config.label}
                </span>
              )
            })}
          </div>
        )}

        {/* ------------------------------------------------------------
         * FULLSCREEN ZOOM
         * ------------------------------------------------------------ */}
        {isZoomed && (
          <div
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={toggleZoom}
          >
            <div className="relative max-w-4xl max-h-[80vh] w-full h-full">
              <Image
                src={isHovered ? hoverSrc : src}
                alt={`Zoomed ${alt}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm"
              >
                <Expand className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------
         * LIKE ANIMATION
         * ------------------------------------------------------------ */}
        {isLiked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart className="h-16 w-16 text-red-500 animate-ping fill-red-500" />
          </div>
        )}
      </div>

      {/* AR / 3D PREVIEW */}
      <div className="mt-2 text-center">
        <button
          onClick={onQuickView}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          👁️ Try AR View
        </button>
      </div>
    </div>
  )
}
