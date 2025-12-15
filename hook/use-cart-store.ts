import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Cart, OrderItem } from '@/types'
import { calcDeliveryDateAndPrice } from '@/lib/action/order-action'

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: undefined,
  shippingPrice: undefined,
  totalPrice: 0,
  paymentMethod: undefined,
  deliveryDateIndex: undefined,
}

interface CartState {
  cart: Cart
  addItem: (item: OrderItem, quantity: number) => Promise<string>
  updateItem: (item: OrderItem, quantity: number) => Promise<void>
  removeItem: (item: OrderItem) => void
  setDeliveryDateIndex: (index: number) => Promise<void>
  setShippingAddress: (address: any) => void
  setPaymentMethod: (method: string) => void
  clearCart: () => void
  init?: () => void
}

const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: initialState,

      // Add item to cart
      addItem: async (item: OrderItem, quantity: number) => {
        const { items } = get().cart
        const existItem = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )

        if (existItem) {
          if (existItem.countInStock < quantity + existItem.quantity) {
            throw new Error('Not enough items in stock')
          }
        } else {
          if (item.countInStock < quantity) {
            throw new Error('Not enough items in stock')
          }
        }

        const updatedCartItems = existItem
          ? items.map((x) =>
              x.product === item.product &&
              x.color === item.color &&
              x.size === item.size
                ? { ...existItem, quantity: existItem.quantity + quantity }
                : x
            )
          : [...items, { ...item, quantity }]

        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({
              items: updatedCartItems,
            })),
          },
        })

        return updatedCartItems.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )?.clientId!
      },

      // Update quantity of an item
      updateItem: async (item: OrderItem, quantity: number) => {
        const { items } = get().cart
        const exist = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )
        if (!exist) return
        const updatedCartItems = items.map((x) =>
          x.product === item.product &&
          x.color === item.color &&
          x.size === item.size
            ? { ...exist, quantity: quantity }
            : x
        )
        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({
              items: updatedCartItems,
            })),
          },
        })
      },

      // Remove an item
      removeItem: (item: OrderItem) => {
        const { items } = get().cart
        const updatedCartItems = items.filter(
          (x) =>
            x.product !== item.product ||
            x.color !== item.color ||
            x.size !== item.size
        )
        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
          },
        })
      },

      // Set delivery date index
      setDeliveryDateIndex: async (index: number) => {
        const { cart } = get()
        const { deliveryDateIndex, ...cartRest } = cart
        const deliveryResult = await calcDeliveryDateAndPrice({
          items: cart.items,
          shippingAddress: cart.shippingAddress,
          deliveryDateIndex: index,
        })
        const { deliveryDateIndex: _ignored, ...deliveryRest } = deliveryResult
        set({
          cart: {
            ...cartRest,
            deliveryDateIndex: index,
            ...deliveryRest,
          },
        })
      },

      // Set shipping address
      setShippingAddress: (address: any) => {
        set((state) => ({
          cart: {
            ...state.cart,
            shippingAddress: address,
          },
        }))
      },

      // Set payment method
      setPaymentMethod: (method: string) => {
        set((state) => ({
          cart: {
            ...state.cart,
            paymentMethod: method,
          },
        }))
      },

      // Clear the cart
      clearCart: () => {
        set({ cart: initialState })
      },

      // Optional init
      init: () => set({ cart: initialState }),
    }),
    {
      name: 'cart-store',
    }
  )
)

export default useCartStore
