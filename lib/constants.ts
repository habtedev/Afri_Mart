// Application constants (sourced from env vars with defaults handled where used)
export const APP_NAME = process.env.NEXT_PUBLIC_NAME 
export const APP_SLOGAN = process.env.NEXT_PUBLIC_SLOGAN 
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_DESCRIPTION 

// used in meta tages and footerrs
export const APP_COPYRIGHT =
  process.env.NEXT_PUBLIC_APP_COPYRIGHT ||
  `Copyright © 2025 ${APP_NAME}. All rights reserved.`

// pagination
export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9)
export const FREE_SHIPPING_MIN_PRICE = Number(
  process.env.FREE_SHIPPING_MIN_PRICE || 35
)
// lib/constants.tsx


export const APP_COUNTRY = 'Ethiopia'          // <-- Set your country
export const APP_SUPPORT_EMAIL = 'support@afrimart.com'  // <-- Support email
export const APP_SUPPORT_PHONE = '+251 900 000 000'      // <-- Support phone number
