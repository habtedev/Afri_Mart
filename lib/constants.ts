/* =========================================================
   Application Metadata (Public – used in UI & SEO)
========================================================= */

export const APP_NAME =
  process.env.NEXT_PUBLIC_NAME ?? 'AfriMart'

export const APP_SLOGAN =
  process.env.NEXT_PUBLIC_SLOGAN ?? 'Shop Smart. Shop Africa.'

export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_DESCRIPTION ??
  'AfriMart is a modern e-commerce platform built for Africa.'


/* =========================================================
   Legal & Footer
========================================================= */

export const APP_COPYRIGHT =
  process.env.NEXT_PUBLIC_APP_COPYRIGHT ??
  `© ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.`


/* =========================================================
   Pagination & Pricing Rules
========================================================= */

export const PAGE_SIZE = Number(process.env.PAGE_SIZE ?? 9)

export const FREE_SHIPPING_MIN_PRICE = Number(
  process.env.FREE_SHIPPING_MIN_PRICE ?? 35
)


/* =========================================================
   Support & Localization
========================================================= */

export const APP_COUNTRY = 'Ethiopia'

export const APP_SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@afrimart.com'

export const APP_SUPPORT_PHONE =
  process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? '+251900000000'


/* =========================================================
   Payment Methods
========================================================= */

export type PaymentMethodId =
  | 'paypal'
  | 'stripe'
  | 'telebirr'
  | 'mpesa'

export type PaymentMethod = {
  id: PaymentMethodId
  label: string
  commissionPercent: number
  isDefault: boolean
  enabled: boolean
}

export const AVAILABLE_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'paypal',
    label: 'PayPal',
    commissionPercent: 0,
    isDefault: true,
    enabled: true,
  },
  {
    id: 'stripe',
    label: 'Stripe',
    commissionPercent: 0,
    isDefault: false,
    enabled: true,
  },
  {
    id: 'telebirr',
    label: 'Telebirr',
    commissionPercent: 0,
    isDefault: true,
    enabled: true, 
  },
  {
    id: 'mpesa',
    label: 'M-Pesa',
    commissionPercent: 0,
    isDefault: true,
    enabled: true, 
  },
]

export const DEFAULT_PAYMENT_METHOD: PaymentMethodId =
  (process.env.DEFAULT_PAYMENT_METHOD as PaymentMethodId) ??
  AVAILABLE_PAYMENT_METHODS.find(m => m.isDefault)?.id ??
  'paypal'


/* =========================================================
   Delivery & Shipping Options
========================================================= */

export type DeliveryOption = {
  id: number
  label: string
  daysToDeliver: number
  shippingPrice: number
  freeShippingMinPrice: number
}

export const AVAILABLE_DELIVERY_DATES: DeliveryOption[] = [
  {
    id: 0,
    label: 'Tomorrow',
    daysToDeliver: 1,
    shippingPrice: 12.9,
    freeShippingMinPrice: 0,
  },
  {
    id: 1,
    label: 'Next 3 Days',
    daysToDeliver: 3,
    shippingPrice: 6.9,
    freeShippingMinPrice: 0,
  },
  {
    id: 2,
    label: 'Next 5 Days',
    daysToDeliver: 5,
    shippingPrice: 4.9,
    freeShippingMinPrice: FREE_SHIPPING_MIN_PRICE,
  },
]
