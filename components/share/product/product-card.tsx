'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { IProduct } from '@/lib/db/models/product.mode'

import Rating from './rating'
import { formatNumber } from '@/lib/utils'
import ProductPrice from './product-price'
import ImageHover from './image-hover'

interface ProductCardProps {
  product: IProduct
  hideDetails?: boolean
  hideBorder?: boolean
}

const ProductCard = ({ product, hideDetails = false, hideBorder = false }: ProductCardProps) => {
  
  // ----------------------------------------------------------
  // PRODUCT IMAGE
  // ----------------------------------------------------------
  const ProductImage = () => (
    <Link href={`/product/${product.slug}`} className="block">
      <div className="relative h-52 overflow-hidden rounded-md">
        {product.images.length > 1 ? (
          <ImageHover
            src={product.images[0]}
            hoverSrc={product.images[1]}
            alt={product.name}
          />
        ) : (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width:768px) 90vw, 30vw"
            className="object-contain"
          />
        )}
      </div>
    </Link>
  )

  // ----------------------------------------------------------
  // PRODUCT DETAILS
  // ----------------------------------------------------------
  const ProductDetails = () => (
    <div className="flex flex-col items-center text-center space-y-2">
      
      {/* Brand */}
      {product.brand && (
        <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          {product.brand}
        </p>
      )}

      {/* Name */}
      <Link
        href={`/product/${product.slug}`}
        className="font-medium line-clamp-2 hover:text-primary transition-colors text-sm"
      >
        {product.name}
      </Link>

      {/* Rating */}
      <div className="flex gap-2 justify-center items-center text-sm">
        <Rating rating={product.avgRating} />
        <span className="text-muted-foreground">
          ({formatNumber(product.numReviews)})
        </span>
      </div>

      {/* Price */}
      <ProductPrice
        isDeal={product.tags.includes('todays-deal')}
        price={product.price}
        listPrice={product.listPrice}
        forListing
      />
    </div>
  )

  // ----------------------------------------------------------
  // CARD LAYOUT
  // ----------------------------------------------------------
  if (hideBorder) {
    return (
      <div className="flex flex-col">
        <ProductImage />
        
        {!hideDetails && (
          <div className="p-3 flex-1">
            <ProductDetails />
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-3">
        <ProductImage />
      </CardHeader>

      {!hideDetails && (
        <CardContent className="p-3 flex-1">
          <ProductDetails />
        </CardContent>
      )}
    </Card>
  )
}

export default ProductCard
