import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

type CardItem = {
  title: string
  link: { text: string; href: string }
  items: {
    name: string
    items?: string[]
    image: string
    href: string
  }[]
}

export function HomeCard({ cards }: { cards: CardItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-4 gap-6">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="rounded-none flex flex-col h-full border border-gray-200"
        >
          <CardContent className="p-4 flex-1">
            {/* Title */}
            <h3 className="text-lg font-semibold mb-4">{card.title}</h3>

            {/* Items Grid */}
            <div className="grid grid-cols-2 gap-4">
              {card.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex flex-col items-center text-center"
                >
                  {/* Image Container with stable height */}
                  <div className="w-full h-24 flex justify-center items-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={120}
                      height={120}
                      className="object-contain max-h-24"
                    />
                  </div>

                  {/* Name (fixed height, two-line clamp, no overlap) */}
                  <p
                    className="text-sm mt-2 font-medium px-1 overflow-hidden"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: '1.2rem',
                      minHeight: '2.4rem', // exactly 2 lines
                      maxHeight: '2.4rem',
                    }}
                  >
                    {item.name}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>

          {/* Footer Link */}
          {card.link && (
            <CardFooter className="p-4 pt-0">
              <Link
                href={card.link.href}
                className="text-sm font-medium text-blue-700 hover:underline"
              >
                {card.link.text}
              </Link>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}
