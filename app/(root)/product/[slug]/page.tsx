import { Card, CardContent } from '@/components/ui/card'
import {
  getProductBySlug,
  getRelatedProductsByCategory,
} from '@/lib/action/product-action'

import SelectVariant from '@/components/share/product/selector-variyant'
import ProductPrice from '@/components/share/product/product-price'
import ProductGallery from '@/components/share/product/product-gallary'
import { Separator } from '@/components/ui/separator'
import ProductSlider from '@/components/share/product/product-slid'
import Rating from '@/components/share/product/rating'
import BrowsingHistoryList from '@/components/share/browse-history-list'
import { AddToBrowsingHistory } from '@/components/share/product/add-history-browser'
import AddToCart from '@/components/share/product/add-to-cart'
import { generateId, round2 } from '@/lib/utils'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await props.params
  const product = await getProductBySlug(slug)

  if (!product) return { title: 'Product not found' }

  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetails(props: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; color?: string; size?: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams

  const { slug } = params
  const { page, color, size } = searchParams

  const product = await getProductBySlug(slug)
  if (!product) return <div>Product Not Found</div>

  const relatedProducts = await getRelatedProductsByCategory({
    category: product.category,
    productId: product._id.toString(),
    page: Number(page || 1),
  })

  return (
    <div>
      {/* BROWSING HISTORY */}
      <AddToBrowsingHistory
        id={product._id.toString()}
        category={product.category}
      />

      <section>
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* LEFT GALLERY */}
          <div className="col-span-2">
            <ProductGallery images={product.images} />
          </div>

          {/* PRODUCT INFO */}
          <div className="col-span-2 flex flex-col gap-2 md:p-5">
            <div className="flex flex-col gap-3">
              <p className="p-medium-16 rounded-full bg-grey-500/10 text-grey-500">
                Brand {product.brand} — {product.category}
              </p>

              <h1 className="font-bold text-lg lg:text-xl">{product.name}</h1>

              <div className="flex items-center gap-2">
                <span>{product.avgRating.toFixed(1)}</span>
                <Rating rating={product.avgRating} />
                <span>{product.numReviews} ratings</span>
              </div>

              <Separator />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <ProductPrice
                  price={product.price}
                  listPrice={product.listPrice}
                  isDeal={product.tags.includes('todays-deal')}
                  forListing={false}
                />
              </div>
            </div>

            {/* VARIANTS */}
            <SelectVariant
              product={product}
              size={size || product.sizes[0]}
              color={color || product.colors[0]}
            />

            <Separator className="my-2" />

            {/* DESCRIPTION */}
            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-grey-600">Description:</p>
              <p className="p-medium-16 lg:p-regular-18">
                {product.description}
              </p>
            </div>
          </div>

          {/* ADD TO CART BOX */}
          <div>
            <Card>
              <CardContent className="p-4 flex flex-col gap-4">
                <ProductPrice price={product.price} />

                {product.countInStock > 0 && product.countInStock <= 3 && (
                  <div className="text-destructive font-bold">
                    Only {product.countInStock} left in stock — order soon
                  </div>
                )}

                {product.countInStock > 0 ? (
                  <div className="text-green-700 text-xl">In Stock</div>
                ) : (
                  <div className="text-destructive text-xl">
                    Out of Stock
                  </div>
                )}

                {/* ADD TO CART BUTTON */}
                {product.countInStock > 0 && (
                  <div className="flex justify-center items-center">
                    <AddToCart
                      item={{
                        clientId: generateId(),
                        product: product._id.toString(),
                        countInStock: product.countInStock,
                        name: product.name,
                        slug: product.slug,
                        category: product.category,
                        price: round2(product.price),
                        quantity: 1,
                        image: product.images[0],
                        size: size || product.sizes[0],
                        color: color || product.colors[0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      <section className="mt-10">
        <ProductSlider
          products={relatedProducts.data}
          title={`Best Sellers in ${product.category}`}
        />
      </section>

      {/* BROWSING HISTORY LIST */}
      <section>
        <BrowsingHistoryList className="mt-10" />
      </section>
    </div>
  )
}
