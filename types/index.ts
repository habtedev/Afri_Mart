

// --- Order type for order-action.ts ---
export type Order = z.infer<typeof CartSchema> & {
  expectedDeliveryDate?: Date;
};
// --- ClientSetting and SiteCurrency types for settings store ---
export type SiteCurrency = {
  name: string;
  code: string;
  symbol: string;
  convertRate: number;
};

export type ClientSetting = {
  common: {
    freeShippingMinPrice: number;
    isMaintenanceMode: boolean;
    defaultTheme: string;
    defaultColor: string;
    pageSize: number;
  };
  site: {
    name: string;
    description: string;
    keywords: string;
    url: string;
    logo: string;
    slogan: string;
    author: string;
    copyright: string;
    email: string;
    address: string;
    phone: string;
  };
  carousels: Array<{
    title: string;
    buttonCaption: string;
    image: string;
    url: string;
  }>;
  availableLanguages: Array<{ code: string; name: string }>;
  defaultLanguage: string;
  availableCurrencies: SiteCurrency[];
  defaultCurrency: string;
  availablePaymentMethods: Array<{ name: string; commission: number }>;
  defaultPaymentMethod: string;
  availableDeliveryDates: Array<{
    name: string;
    daysToDeliver: number;
    shippingPrice: number;
    freeShippingMinPrice: number;
  }>;
  defaultDeliveryDate: string;
  currency?: string;
};
import {
  CartSchema,
  OrderItemSchema,
  ProductInputSchema,
  ShippingAddressSchema,
  UserInputSchema,
  UserSignInSchema,
} from '@/lib/vallidator'
import z from "zod";

export type IProductInput = z.infer<typeof ProductInputSchema>

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
export type ShippingAddress = z.infer<typeof ShippingAddressSchema>
// user
export type IUserInput = z.infer<typeof UserInputSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>