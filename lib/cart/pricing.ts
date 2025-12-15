import { OrderItem, ShippingAddress } from '@/types'
import { AVAILABLE_DELIVERY_DATES } from '../constants'
import { round2 } from '../utils'

export type CalcDeliveryParams = {
  items: OrderItem[]
  shippingAddress?: ShippingAddress
  deliveryDateIndex?: number
}

export function calcDeliveryDateAndPrice({
  items,
  shippingAddress,
  deliveryDateIndex,
}: CalcDeliveryParams) {
  const itemsPrice = round2(
    items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  const index =
    typeof deliveryDateIndex === 'number' &&
    deliveryDateIndex >= 0 &&
    deliveryDateIndex < AVAILABLE_DELIVERY_DATES.length
      ? deliveryDateIndex
      : AVAILABLE_DELIVERY_DATES.length - 1

  const delivery = AVAILABLE_DELIVERY_DATES[index]

  const shippingPrice =
    itemsPrice >= delivery.freeShippingMinPrice
      ? 0
      : delivery.shippingPrice

  const taxPrice = round2(itemsPrice * 0.15)
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

  const expectedDeliveryDate = new Date()
  expectedDeliveryDate.setDate(
    expectedDeliveryDate.getDate() + delivery.daysToDeliver
  )

  return {
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    expectedDeliveryDate,
    deliveryDateIndex: index,
  }
}
