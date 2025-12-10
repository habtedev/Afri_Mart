// import { HomeCarousel } from '@/components/share/home/home-carousel'
import { HomeCarousel } from '@/components/share/home/home-carorsel'
import data from '@/lib/data'

export default function Home() {
  return (
    <main className="w-full">
      <HomeCarousel items={data.carousels} />
    </main>
  )
}
