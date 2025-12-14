'use client'

import BrowsingHistoryList from '@/components/share/browse-history-list'
import ProductPrice from '@/components/share/product/product-price'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCartStore from '@/hook/use-cart-store'
import { APP_NAME, FREE_SHIPPING_MIN_PRICE } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartClient() {
  const router = useRouter()

  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = useCartStore()

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
        {items.length === 0 ? (
          <Card className="col-span-4 rounded-none">
            <CardHeader className="text-3xl">
              Your Shopping Cart is empty
            </CardHeader>
            <CardContent>
              Continue shopping on <Link href="/">{APP_NAME}</Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Cart Items */}
            <div className="col-span-3">
              <Card className="rounded-none">
                <CardHeader className="text-3xl pb-0">
                  Shopping Cart
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex justify-end border-b mb-4">
                    Price
                  </div>

                  {items.map(item => (
                    <div
                      key={item.clientId}
                      className="flex flex-col md:flex-row justify-between py-4 border-b gap-4"
                    >
                      <Link href={`/product/${item.slug}`}>
                        <div className="relative w-40 h-40">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </Link>

                      <div className="flex-1 space-y-4">
                        <Link
                          href={`/product/${item.slug}`}
                          className="text-lg hover:no-underline"
                        >
                          {item.name}
                        </Link>

                        <div className="flex gap-2 items-center">
                          <Select
                            value={item.quantity.toString()}
                            onValueChange={value =>
                              updateItem(item, Number(value))
                            }
                          >
                            <SelectTrigger className="w-auto">
                              <SelectValue>
                                Quantity: {item.quantity}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({
                                length: item.countInStock,
                              }).map((_, i) => (
                                <SelectItem
                                  key={i + 1}
                                  value={`${i + 1}`}
                                >
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Button
                            variant="outline"
                            onClick={() => removeItem(item)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      <div className="text-right">
                        <ProductPrice
                          price={item.price * item.quantity}
                          plain
                        />
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end text-lg my-2">
                    Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} items):
                    <span className="font-bold ml-1">
                      <ProductPrice price={itemsPrice} plain />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div>
              <Card className="rounded-none">
                <CardContent className="py-4 space-y-4">
                  <Button
                    onClick={() => router.push('/checkout')}
                    className="rounded-full w-full"
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      <BrowsingHistoryList className="mt-10" />
    </div>
  )
}
