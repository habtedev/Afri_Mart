'use client'

import React, { useEffect, useCallback, useMemo } from 'react'
import useBrowsingHistory from '@/hook/browser-histor'
import ProductSlider from './product-slid'
import { Separator } from '../../ui/separator'
import { cn } from '@/lib/utils'

/** ------------------------------------------------------------------
 *  BrowsingHistoryList
 *  Main wrapper for both "related" and "history" product sections.
 * ------------------------------------------------------------------*/
export default function BrowsingHistoryList({
  className,
}: {
  className?: string
}) {
  const { products } = useBrowsingHistory()

  const hasHistory = products.length > 0

  if (!hasHistory) return null

  return (
    <div className="bg-background">
      <Separator className={cn('mb-4', className)} />

      <ProductList
        title="Related to items that you've viewed"
        type="related"
      />

      <Separator className="mb-4" />

      <ProductList
        title="Your browsing history"
        type="history"
        hideDetails
      />
    </div>
  )
}

/** ------------------------------------------------------------------
 *  ProductList
 *  Fetches product lists (related or history) based on stored browsing
 *  activity.
 * ------------------------------------------------------------------*/

interface Product {
  id: string
  category: string
}

interface ProductListProps {
  title: string
  type: 'history' | 'related'
  hideDetails?: boolean
}

function ProductList({ title, type, hideDetails = false }: ProductListProps) {
  const { products } = useBrowsingHistory()
    const [data, setData] = React.useState<IProduct[]>([])

  const categories = useMemo(
    () => products.map((p) => p.category).join(','),
    [products]
  )
  const ids = useMemo(() => products.map((p) => p.id).join(','), [products])

  const fetchProducts = useCallback(async () => {
    if (products.length === 0) return

    try {
      const res = await fetch(
        `/api/products/browsing-history?type=${type}&categories=${categories}&ids=${ids}`
      )

      if (!res.ok) {
        console.error('Failed to load browsing history products')
        return
      }

        const payload = await res.json()
        setData(payload as IProduct[])
    } catch (err) {
      console.error('Error fetching browsing history:', err)
    }
  }, [categories, ids, type, products])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  if (data.length === 0) return null

  return (
    <ProductSlider
      title={title}
      products={data}
      hideDetails={hideDetails}
    />
  )
}
import { IProduct } from '@/lib/db/models/product.mode'

/** ------------------------------------------------------------------
 *  AddToBrowsingHistory
 *  Adds an item to browsing history when a product page loads.
 * ------------------------------------------------------------------*/

export function AddToBrowsingHistory({
  id,
  category,
}: {
  id: string
  category: string
}) {
  const { addItem } = useBrowsingHistory()

  useEffect(() => {
    addItem({ id: String(id), category })
  }, [id, category, addItem])

  return null
}
