import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { IProduct } from '@/lib/db/models/product.mode'
import Rating from './rating'
import { formatNumber, generateId, round2 } from '@/lib/utils'
import ProductPrice from './product-price'
import ImageHover from './image-hover'
import AddToCart from './add-to-cart'

interface ProductCardProps {
  product: IProduct
  hideDetails?: boolean
  hideBorder?: boolean
  hideAddToCart?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  hideBorder = false,
  hideDetails = false,
  hideAddToCart = true,
}) => {
  const ProductImage = () => (
    <Link href={`/product/${product.slug}`}>
      <div className="relative h-52 w-full overflow-hidden rounded-md">
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
            sizes="(max-width: 768px) 90vw, 30vw"
            className="object-contain"
          />
        )}
      </div>
    </Link>
  )

  const ProductDetails = () => (
    <div className="flex flex-col items-center text-center space-y-1">
      {/* Brand */}
      {product.brand && (
        <p
          className="font-semibold text-xs text-muted-foreground uppercase tracking-wide overflow-hidden text-ellipsis"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.brand}
        </p>
      )}

      {/* Product Name */}
      <Link
        href={`/product/${product.slug}`}
        className="font-medium text-sm hover:text-primary transition-colors overflow-hidden"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {product.name}
      </Link>

      {/* Rating */}
      <div className="flex gap-1 justify-center items-center text-xs">
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

  const AddButton = () => (
    <div className="w-full text-center mt-1">
      <AddToCart
        minimal
        item={{
          clientId: generateId(),
          product: product._id.toString(),
          size: product.sizes[0],
          color: product.colors[0],
          countInStock: product.countInStock,
          name: product.name,
          slug: product.slug,
          category: product.category,
          price: round2(product.price),
          quantity: 1,
          image: product.images[0],
        }}
      />
    </div>
  )

  return hideBorder ? (
    <div className="flex flex-col w-full">
      <ProductImage />
      {!hideDetails && (
        <>
          <div className="p-2 flex-1">
            <ProductDetails />
          </div>
          {!hideAddToCart && <AddButton />}
        </>
      )}
    </div>
  ) : (
    <Card className="flex flex-col w-full overflow-hidden">
      <CardHeader className="p-2">
        <ProductImage />
      </CardHeader>
      {!hideDetails && (
        <>
          <CardContent className="p-2 flex-1">
            <ProductDetails />
          </CardContent>
          <CardFooter className="p-2">
            {!hideAddToCart && <AddButton />}
          </CardFooter>
        </>
      )}
    </Card>
  )
}

export default ProductCard
