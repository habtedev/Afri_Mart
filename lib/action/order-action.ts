'use server'

import mongoose from 'mongoose'
import { auth } from '@/auth'
import { connectToDatabase } from '../db'
import Order from '../db/models/order.model'
import { Cart, OrderItem, ShippingAddress } from '@/types'
import { OrderInputSchema } from '../vallidator'
import { AVAILABLE_DELIVERY_DATES } from '../constants'
import { round2 } from '../utils'

/* -------------------------------------------------
   Types
------------------------------------------------- */

export type CreateOrderResult = {
  success: boolean
  message: string
  data?: {
    orderId: string
  }
}

type CalcDeliveryParams = {
  items: OrderItem[]
  shippingAddress?: ShippingAddress
  deliveryDateIndex?: number
}

/* -------------------------------------------------
   Get Order By ID
------------------------------------------------- */

export async function getOrderById(orderId: string) {
  await connectToDatabase()

  if (!mongoose.Types.ObjectId.isValid(orderId)) return null

  const order = await Order.findById(orderId).lean()
  if (!order) return null

  return {
    ...order,
    _id: order._id.toString(),
    createdAt: order.createdAt?.toISOString(),
    updatedAt: order.updatedAt?.toISOString(),
  }
}

/* -------------------------------------------------
   Create Order (PUBLIC ENTRY POINT)
------------------------------------------------- */

export async function createOrder(
  cart: Cart
): Promise<CreateOrderResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error('Unauthorized')
    }

    if (!cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty')
    }

    await connectToDatabase()

    const order = await createOrderFromCart(cart, session.user.id)

    return {
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: order._id.toString(),
      },
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/* -------------------------------------------------
   Internal: Create Order From Cart
------------------------------------------------- */


import { calcDeliveryDateAndPrice } from '../cart/pricing'

async function createOrderFromCart(
  cart: Cart,
  userId: string
) {
  // 🔒 Recalculate all pricing on the server
  const pricing = calcDeliveryDateAndPrice({
    items: cart.items,
    shippingAddress: cart.shippingAddress,
    deliveryDateIndex: cart.deliveryDateIndex,
  })

  const orderInput = OrderInputSchema.parse({
    user: userId,
    items: cart.items,
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    ...pricing,
  })

  return await Order.create(orderInput)
}
