// Static site data (navigation menus and similar)
const data = {
    headerMenu: [
        {
            name: 'Todat Deals',
            href: '/serach?tage=todat-deals',
        },
         {
            name: 'New Arrivals',
            href: '/serach?tage=new-arrivals',
        },
         {
            name: 'Featured Products',
            href: '/serach?tage=featured-products',
        },
         {
            name: 'Best Sellers',
            href: '/serach?tage=best-sellers',
        },
         {
            name: 'Browser History',
            href: '/serach?tage=browser-history',
        },
         {
            name: 'Customer Services',
            href: '/serach?tage=customer-services',
        },
         {
            name: 'About Us',
            href: '/serach?tage=about-us',
        },
         {
            name: 'Help Center',
            href: '/serach?tage=help-center',
        },
    ],
     carousels: [
        {
          title: 'Most Popular Shoes For Sale',
          buttonCaption: 'Shop Now',
          image: '/images/banner3.jpg',
          url: '/search?category=Shoes',
        },
        {
          title: 'Best Sellers in T-Shirts',
          buttonCaption: 'Shop Now',
          image: '/images/banner1.jpg',
          url: '/search?category=T-Shirts',
        },
        {
          title: 'Best Deals on Wrist Watches',
          buttonCaption: 'See More',
          image: '/images/banner2.jpg',
          url: '/search?category=Wrist Watches',
        },
      ],
}

export default data;