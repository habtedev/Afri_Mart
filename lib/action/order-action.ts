// lib/action/order-action.ts
'use server'

import { OrderItem, ShippingAddress, Order } from '@/types'
import { round2 } from '../utils'
import { AVAILABLE_DELIVERY_DATES } from '../constants'

export type CalcDeliveryParams = {
  items: OrderItem[]
  shippingAddress?: ShippingAddress
  deliveryDateIndex?: number
}

export type CalcDeliveryResult = {
  AVAILABLE_DELIVERY_DATES: typeof AVAILABLE_DELIVERY_DATES
  deliveryDateIndex: number
  itemsPrice: number
  shippingPrice?: number
  taxPrice?: number
  totalPrice: number
}

/**
 * Calculate delivery date, shipping cost, tax, and total price
 */
export const calcDeliveryDateAndPrice = async ({
  items,
  shippingAddress,
  deliveryDateIndex,
}: CalcDeliveryParams): Promise<CalcDeliveryResult> => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  const dateIndex =
    deliveryDateIndex === undefined
      ? AVAILABLE_DELIVERY_DATES.length - 1
      : deliveryDateIndex

  const deliveryDate = AVAILABLE_DELIVERY_DATES[dateIndex]

  const shippingPrice =
    !shippingAddress || !deliveryDate
      ? undefined
      : deliveryDate.freeShippingMinPrice > 0 && itemsPrice >= deliveryDate.freeShippingMinPrice
      ? 0
      : deliveryDate.shippingPrice

  const taxPrice = !shippingAddress ? undefined : round2(itemsPrice * 0.15)

  const totalPrice = round2(
    itemsPrice + (shippingPrice ?? 0) + (taxPrice ?? 0)
  )

  return {
    AVAILABLE_DELIVERY_DATES,
    deliveryDateIndex: dateIndex,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  }
}

/**
 * Create a new order
 */
export const createOrder = async ({
  items,
  shippingAddress,
  deliveryDateIndex,
}: CalcDeliveryParams): Promise<Order> => {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, shippingAddress, deliveryDateIndex }),
    })

    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.message || 'Failed to create order')
    }

    return res.json()
  } catch (err: unknown) {
    if (err instanceof Error) throw err
    throw new Error('Unknown error while creating order')
  }
}

/**
 * Fetch orders (for user or admin)
 */
export const getOrders = async (): Promise<Order[]> => {
  try {
    const res = await fetch('/api/orders')
    if (!res.ok) throw new Error('Failed to fetch orders')
    return res.json()
  } catch (err: unknown) {
    if (err instanceof Error) throw err
    throw new Error('Unknown error while fetching orders')
  }
}
