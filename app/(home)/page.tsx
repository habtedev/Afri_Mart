import { HomeCard } from '@/components/share/home/home-card'
import { HomeCarousel } from '@/components/share/home/home-carorsel'
import BrowsingHistoryList from '@/components/share/product/add-history-browser'
import ProductSlider from '@/components/share/product/product-slid'
import { Card, CardContent } from '@/components/ui/card'

import {
  getAllCategories,
  getProductsForCard,
  getProductsByTag,
} from '@/lib/action/product-action'
import data from '@/lib/data'
import { toSlug } from '@/lib/utils'

export default async function Page() {
  // Fetch categories and highlighted product groups
  const categories = (await getAllCategories()).slice(0, 4)

  const [newArrivals, featureds, bestSellers] = await Promise.all([
    getProductsForCard({ tag: 'new-arrival', limit: 4 }),
    getProductsForCard({ tag: 'featured', limit: 4 }),
    getProductsForCard({ tag: 'featured', limit: 4 }),
    getProductsForCard({ tag: 'best-seller', limit: 4 }),
  ])

  const cards = [
    {
      title: 'Categories to explore',
      link: { text: 'See More', href: '/search' },
      items: categories.map((category) => ({
        name: category,
        image: `/images/${toSlug(category)}.jpg`,
        href: `/search?category=${category}`,
      })),
    },
    {
      title: 'Explore New Arrivals',
      link: { text: 'View All', href: '/search?tag=new-arrival' },
      items: newArrivals,
    },
    {
      title: 'Discover Best Sellers',
      link: { text: 'View All', href: '/search?tag=best-seller' },
      items: bestSellers,
    },
    {
      title: 'Featured Products',
      link: { text: 'Shop Now', href: '/search?tag=featured' },
      items: featureds,
    },
  ]

  // Fetch deal sections
  const [todaysDeals, bestSellingProducts] = await Promise.all([
    getProductsByTag({ tag: 'todays-deal' }),
    getProductsByTag({ tag: 'best-seller' }),
  ])

  return (
    <>
      <HomeCarousel items={data.carousels} />

      <div className="md:p-4 md:space-y-4 bg-border">
        {/* Category & highlights */}
        <HomeCard cards={cards} />

        {/* Today's Deals */}
        <Card className="w-full rounded-none">
          <CardContent className="p-4 items-center gap-3">
            <ProductSlider
              title="Today's Deals"
              products={todaysDeals}
            />
          </CardContent>
        </Card>

        {/* Best Selling */}
        <Card className="w-full rounded-none">
          <CardContent className="p-4 items-center gap-3">
            <ProductSlider
              title="Best Selling Products"
              products={bestSellingProducts}
              hideDetails
            />
          </CardContent>
        </Card>

        {/* Browsing history */}
        <div className="p-4 bg-background">
          <BrowsingHistoryList />
        </div>
      </div>
    </>
  )
}
