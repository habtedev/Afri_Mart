import {
  CartSchema,
  OrderItemSchema,
  ProductInputSchema,
} from '@/lib/vallidator'
import z from "zod";

export type IProductInput = z.infer<typeof ProductInputSchema>
// Minimal user input type to satisfy `lib/data.ts`
export type IUserInput = {
  name: string
  email: string
  password: string
  role: string
  address: {
    fullName: string
    street: string
    city: string
    province: string
    postalCode: string
    country: string
    phone: string
  }
  paymentMethod: string
  emailVerified: boolean
}

export type Data = {
  users: IUserInput[]
  products: IProductInput[]
  reviews: {
    title: string
    rating: number
    comment: string
  }[]
  webPages: {
    title: string
    slug: string
    content: string
    isPublished: boolean
  }[]
  headerMenus: {
    name: string
    href: string
  }[]
  carousels: {
    image: string
    url: string
    title: string
    buttonCaption: string
    isPublished: boolean
  }[]
  settings: any[]
}

export type ICarousel = {
  image: string
  url: string
  title: string
  buttonCaption: string
  isPublished: boolean
  description?: string
}
export type OrderItem = z.infer<typeof OrderItemSchema>
export type Cart = z.infer<typeof CartSchema>