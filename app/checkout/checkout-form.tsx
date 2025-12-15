'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

import useCartStore from '@/hook/use-cart-store'
import useSettingStore from '@/hook/use-setting-store'
import useIsMounted from '@/hook/use-mouted'
import { useToast } from '@/hook/use-toast'
import { ShippingAddressSchema } from '@/lib/vallidator'
import type { ShippingAddress } from '@/types'
import { createOrder, calcDeliveryDateAndPrice } from '@/lib/action/order-action'
import { calculateFutureDate, formatDateTime } from '@/lib/utils'
import ProductPrice from '@/components/share/product/product-price'
import CheckoutFooter from './checkout-footer'
import Header from '@/components/share/header'

const SHIPPING_FIELDS = [
  { name: 'fullName', label: 'Full Name' },
  { name: 'street', label: 'Street Address' },
  { name: 'city', label: 'City' },
  { name: 'province', label: 'State/Province' },
  { name: 'country', label: 'Country' },
  { name: 'postalCode', label: 'Postal Code' },
  { name: 'phone', label: 'Phone Number' },
] as const

const shippingAddressDefaultValues: ShippingAddress = {
  fullName: '',
  street: '',
  city: '',
  province: '',
  country: '',
  postalCode: '',
  phone: '',
}

const CheckoutForm = () => {
  const { toast } = useToast()
  const router = useRouter()
  const isMounted = useIsMounted()

  const {
    setting: { availablePaymentMethods, availableDeliveryDates },
  } = useSettingStore()

  const {
    cart: { 
      items, 
      itemsPrice, 
      shippingPrice, 
      taxPrice, 
      totalPrice, 
      shippingAddress, 
      deliveryDateIndex, 
      paymentMethod 
    },
    setShippingAddress,
    setPaymentMethod,
    setDeliveryDateIndex,
    updateItem,
    removeItem,
    clearCart,
  } = useCartStore()

  const [isAddressEditing, setIsAddressEditing] = useState(!shippingAddress)
  const [isPaymentEditing, setIsPaymentEditing] = useState(!paymentMethod)
  const [isDeliveryEditing, setIsDeliveryEditing] = useState(deliveryDateIndex === undefined)
  const [orderSummary, setOrderSummary] = useState<any>(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const shippingAddressForm = useForm<ShippingAddress>({
    resolver: zodResolver(ShippingAddressSchema),
    defaultValues: shippingAddress || shippingAddressDefaultValues,
    mode: 'onBlur',
  })

  const handleSaveAddress: SubmitHandler<ShippingAddress> = useCallback((data) => {
    setShippingAddress(data)
    setIsAddressEditing(false)
    toast({ 
      title: 'Address saved',
      description: 'Shipping address has been updated',
      variant: 'default' 
    })
  }, [setShippingAddress, toast])

  const handleSelectPaymentMethod = useCallback((method: string) => {
    setPaymentMethod(method)
    setIsPaymentEditing(false)
    toast({
      title: 'Payment method selected',
      description: `${method} has been selected`,
      variant: 'default'
    })
  }, [setPaymentMethod, toast])

  const handleSelectDeliveryDate = useCallback((index: number) => {
    setDeliveryDateIndex(index)
    setIsDeliveryEditing(false)
  }, [setDeliveryDateIndex])

  const handlePlaceOrder = useCallback(async () => {
    if (!shippingAddress || !paymentMethod || deliveryDateIndex === undefined) {
      toast({
        title: 'Missing information',
        description: 'Please complete all checkout steps',
        variant: 'destructive'
      })
      return
    }

    setIsPlacingOrder(true)
    
    try {
      const res = await createOrder({
        items,
        shippingAddress,
        deliveryDateIndex,
      })

      toast({ 
        title: 'Order placed!',
        description: 'Your order was placed successfully.',
        variant: 'default' 
      })
      clearCart()
      // If your Order type has an id or orderId, use it here:
      router.push(`/checkout/${(res as any).id || ''}`)
    } catch (error) {
      toast({ 
        title: 'Order failed',
        description: error instanceof Error ? error.message : 'Failed to place order',
        variant: 'destructive' 
      })
    } finally {
      setIsPlacingOrder(false)
    }
  }, [shippingAddress, paymentMethod, deliveryDateIndex, items, toast, clearCart, router])

  // Memoized computed values
  const isOrderReady = useMemo(() => 
    shippingAddress && paymentMethod && deliveryDateIndex !== undefined,
    [shippingAddress, paymentMethod, deliveryDateIndex]
  )

  const selectedDeliveryDate = useMemo(() => {
    if (deliveryDateIndex === undefined || !availableDeliveryDates?.[deliveryDateIndex]) return null
    return formatDateTime(
      calculateFutureDate(availableDeliveryDates[deliveryDateIndex].daysToDeliver)
    ).dateOnly
  }, [deliveryDateIndex, availableDeliveryDates])

  // Fetch order summary
  useEffect(() => {
    if (!isMounted || items.length === 0) return
    
    const fetchSummary = async () => {
      try {
        const summary = await calcDeliveryDateAndPrice({ items })
        setOrderSummary(summary)
      } catch (error) {
        console.error('Failed to fetch order summary:', error)
      }
    }
    
    fetchSummary()
  }, [items, isMounted])

  // Auto-select default payment method if available
  useEffect(() => {
    if (availablePaymentMethods?.length > 0 && !paymentMethod) {
      const defaultMethod = availablePaymentMethods[0]
      const methodValue = typeof defaultMethod === 'string' ? defaultMethod : defaultMethod.name
      setPaymentMethod(methodValue)
    }
  }, [availablePaymentMethods, paymentMethod, setPaymentMethod])

  if (items.length === 0) {
    return (
      <main className='max-w-6xl mx-auto px-4 py-8'>
        <Card>
          <CardContent className='py-8 text-center'>
            <h2 className='text-xl font-bold mb-2'>Your cart is empty</h2>
            <p className='text-muted-foreground mb-6'>Add items to your cart to proceed to checkout</p>
            <Button onClick={() => router.push('/')}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (!orderSummary) {
    return (
      <main className='max-w-6xl mx-auto px-4 py-8'>
        <div className='grid md:grid-cols-3 gap-6'>
          <div className='md:col-span-2 space-y-6'>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className='pt-6'>
                  <Skeleton className='h-6 w-48 mb-4' />
                  <div className='space-y-4'>
                    {Array.from({ length: 3 }).map((_, j) => (
                      <Skeleton key={j} className='h-10 w-full' />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className='pt-6'>
              <Skeleton className='h-6 w-48 mb-4' />
              <div className='space-y-2'>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className='h-4 w-full' />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <>
      <Header />
      <main className='max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-8'>
        <h1 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-8 text-center sm:text-left'>Checkout</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8'>
        {/* Left column - Checkout steps */}
        <div className='lg:col-span-2 space-y-4 sm:space-y-6'>
          {/* Step 1: Shipping Address */}
          <Card className='shadow-sm border border-gray-200'>
            <CardHeader className='pb-3'>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
                <div className='flex items-center space-x-2'>
                  <div className='flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-base font-semibold'>
                    1
                  </div>
                  <h2 className='text-base sm:text-lg font-semibold'>Shipping Address</h2>
                </div>
                {shippingAddress && !isAddressEditing && (
                  <Button 
                    size='sm' 
                    variant='outline' 
                    onClick={() => setIsAddressEditing(true)}
                    className='text-xs sm:text-sm px-3 py-1'
                  >
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isAddressEditing ? (
                <Form {...shippingAddressForm}>
                  <form 
                    onSubmit={shippingAddressForm.handleSubmit(handleSaveAddress)} 
                    className='space-y-4'
                  >
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                      {SHIPPING_FIELDS.map(({ name, label }) => (
                        <FormField
                          key={name}
                          control={shippingAddressForm.control}
                          name={name}
                          render={({ field }) => (
                            <FormItem className={name === 'street' ? 'md:col-span-2' : ''}>
                              <FormLabel>{label}</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder={`Enter ${label.toLowerCase()}`} 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                    <Button 
                      type='submit' 
                      className='w-full rounded-md py-2 text-base font-semibold mt-2 sm:mt-0'
                      disabled={!shippingAddressForm.formState.isValid}
                    >
                      Save Address
                    </Button>
                  </form>
                </Form>
              ) : shippingAddress ? (
                <div className='space-y-2 text-sm'>
                  <p className='font-medium'>{shippingAddress.fullName}</p>
                  <p>{shippingAddress.street}</p>
                  <p className='text-muted-foreground'>
                    {shippingAddress.city}, {shippingAddress.province} {shippingAddress.postalCode}
                  </p>
                  <p className='text-muted-foreground'>{shippingAddress.country}</p>
                  <p className='pt-2'>📱 {shippingAddress.phone}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Step 2: Payment Method */}
          <Card className='shadow-sm border border-gray-200'>
            <CardHeader className='pb-3'>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
                <div className='flex items-center space-x-2'>
                  <div className='flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-base font-semibold'>
                    2
                  </div>
                  <h2 className='text-base sm:text-lg font-semibold'>Payment Method</h2>
                </div>
                {paymentMethod && !isPaymentEditing && (
                  <Button 
                    size='sm' 
                    variant='outline' 
                    onClick={() => setIsPaymentEditing(true)}
                    className='text-xs sm:text-sm px-3 py-1'
                  >
                    Change
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isPaymentEditing ? (
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={handleSelectPaymentMethod}
                  className='space-y-3'
                >
                  {availablePaymentMethods.map((pm: any) => {
                    let value: string;
                    let label: string;
                    if (typeof pm === 'string') {
                      value = pm;
                      label = pm;
                    } else if (pm && typeof pm === 'object') {
                      value = String(pm.name ?? '');
                      label = String(pm.label ?? pm.name ?? '');
                    } else {
                      value = '';
                      label = '';
                    }
                    return (
                      <div key={value} className='flex items-center space-x-2'>
                        <RadioGroupItem value={value} id={`payment-${value}`} />
                        <Label 
                          htmlFor={`payment-${value}`} 
                          className='flex-1 cursor-pointer py-2'
                        >
                          {label}
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
              ) : (
                <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
                  <span className='font-medium'>{paymentMethod}</span>
                  <span className='text-muted-foreground text-sm'>Selected</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Review Items & Shipping */}
          <Card className='shadow-sm border border-gray-200'>
            <CardHeader className='pb-3'>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2'>
                <div className='flex items-center space-x-2'>
                  <div className='flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-base font-semibold'>
                    3
                  </div>
                  <h2 className='text-base sm:text-lg font-semibold'>Review Items & Shipping</h2>
                </div>
                {deliveryDateIndex !== undefined && !isDeliveryEditing && (
                  <Button 
                    size='sm' 
                    variant='outline' 
                    onClick={() => setIsDeliveryEditing(true)}
                    className='text-xs sm:text-sm px-3 py-1'
                  >
                    Change
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {/* Cart Items */}
                <div className='space-y-4'>
                  {items.map((item, idx) => (
                    <div key={item.clientId || idx} className='flex gap-3 sm:gap-4 py-2 border-b last:border-b-0'>
                      <div className='relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-md overflow-hidden border'>
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className='object-contain'
                          sizes='80px'
                        />
                      </div>
                      <div className='flex-1 min-w-0 flex flex-col gap-1'>
                        <h3 className='font-medium truncate'>{item.name}</h3>
                        <p className='font-bold text-sm'>
                          <ProductPrice price={item.price || 0} plain />
                        </p>
                        <div className='flex items-center gap-2'>
                          <Select
                            value={item.quantity.toString()}
                            onValueChange={(value) => {
                              if (value === '0') {
                                removeItem(item)
                              } else {
                                updateItem(item, Number(value))
                              }
                            }}
                          >
                            <SelectTrigger className='w-20 h-8 text-xs sm:text-sm'>
                              <SelectValue>Qty: {item.quantity}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: Math.min(item.countInStock, 10) }).map((_, i) => (
                                <SelectItem key={i + 1} value={`${i + 1}`} className='text-xs sm:text-sm'>
                                  {i + 1}
                                </SelectItem>
                              ))}
                              {item.countInStock > 10 && (
                                <div className='px-2 py-1.5 text-xs text-muted-foreground'>
                                  Up to {item.countInStock} available
                                </div>
                              )}
                              <Separator className='my-1' />
                              <SelectItem value='0' className='text-destructive text-xs sm:text-sm'>
                                Remove
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Options */}
                <Separator />
                
                <div>
                  <h3 className='font-semibold mb-3'>Delivery Options</h3>
                  {isDeliveryEditing ? (
                    <RadioGroup
                      value={availableDeliveryDates[deliveryDateIndex!]?.name || ''}
                      onValueChange={(value) => {
                        const index = availableDeliveryDates.findIndex((d: any) => d.name === value)
                        handleSelectDeliveryDate(index)
                      }}
                      className='space-y-3'
                    >
                      {availableDeliveryDates.map((dd: any) => (
                        <div key={dd.name} className='flex items-center space-x-2'>
                          <RadioGroupItem value={dd.name} id={`delivery-${dd.name}`} />
                          <Label 
                            htmlFor={`delivery-${dd.name}`} 
                            className='flex-1 cursor-pointer py-2'
                          >
                            <div className='flex justify-between items-center'>
                              <span>
                                {formatDateTime(calculateFutureDate(dd.daysToDeliver)).dateOnly}
                              </span>
                              <span className='font-medium'>
                                {dd.shippingPrice === 0 ? (
                                  <span className='text-green-600'>FREE</span>
                                ) : (
                                  <ProductPrice price={dd.shippingPrice} plain />
                                )}
                              </span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  ) : selectedDeliveryDate ? (
                    <div className='flex items-center justify-between p-3 bg-muted rounded-lg'>
                      <div>
                        <p className='font-medium'>Delivery Date</p>
                        <p className='text-sm text-muted-foreground'>{selectedDeliveryDate}</p>
                      </div>
                      <span className='font-medium'>
                        {shippingPrice === 0 ? (
                          <span className='text-green-600'>FREE</span>
                        ) : (
                          <ProductPrice price={shippingPrice || 0} plain />
                        )}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Place Order Button */}
          {isOrderReady && (
            <Button
              onClick={handlePlaceOrder}
              className='w-full h-12 text-base'
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <>
                  <span className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                  Processing...
                </>
              ) : (
                <>
                  Place Your Order
                  {typeof totalPrice === 'number' && totalPrice > 0 && (
                    <span className='ml-2 font-semibold'>
                      (<ProductPrice price={totalPrice} plain />)
                    </span>
                  )}
                </>
              )}
            </Button>
          )}
        </div>

        {/* Right column - Order Summary */}
        <div className='lg:col-span-1 mt-6 lg:mt-0'>
          <Card className='sticky top-4 shadow-md border border-gray-200'>
            <CardHeader>
              <h2 className='text-base sm:text-lg font-semibold text-center sm:text-left'>Order Summary</h2>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3 text-sm sm:text-base'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <ProductPrice price={itemsPrice || 0} plain />
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Shipping</span>
                  {shippingPrice === 0 ? (
                    <span className='text-green-600 font-medium'>FREE</span>
                  ) : (
                    <ProductPrice price={shippingPrice || 0} plain />
                  )}
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>Tax</span>
                  <ProductPrice price={taxPrice || 0} plain />
                </div>
              </div>
              
              <Separator />
              
              <div className='flex justify-between text-base sm:text-lg font-bold'>
                <span>Total</span>
                <ProductPrice price={totalPrice || 0} />
              </div>
              
              {selectedDeliveryDate && (
                <div className='pt-4 border-t'>
                  <p className='text-xs sm:text-sm text-muted-foreground mb-1'>Estimated delivery</p>
                  <p className='font-medium'>{selectedDeliveryDate}</p>
                </div>
              )}
            </CardContent>
            
            {!isOrderReady && (
              <CardFooter className='border-t pt-4'>
                <p className='text-sm text-center text-muted-foreground'>
                  Complete all steps above to place your order
                </p>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>

      <div className='mt-8 sm:mt-12'>
        <CheckoutFooter />
      </div>
    </main>
  </>
  )
}

export default CheckoutForm