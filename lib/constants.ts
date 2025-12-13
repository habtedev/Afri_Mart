// Application constants (sourced from env vars with defaults handled where used)
export const APP_NAME = process.env.NEXT_PUBLIC_NAME 
export const APP_SLOGAN = process.env.NEXT_PUBLIC_SLOGAN 
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_DESCRIPTION 
export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9)
export const FREE_SHIPPING_MIN_PRICE = Number(
  process.env.FREE_SHIPPING_MIN_PRICE || 35
)
