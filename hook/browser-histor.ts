import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type BrowsingHistoryItem = { id: string; category: string }
type BrowsingHistoryState = {
  products: BrowsingHistoryItem[]
  addItem: (product: BrowsingHistoryItem) => void
  clear: () => void
}

export const browsingHistoryStore = create<BrowsingHistoryState>()(
  persist(
    (set, get) => ({
      products: [],
      addItem: (product: BrowsingHistoryItem) => {
        const current = get().products
        const next = current.filter((p) => p.id !== product.id)
        next.unshift(product)
        if (next.length > 10) next.splice(10)
        set({ products: next })
      },
      clear: () => set({ products: [] }),
    }),
    { name: 'browsingHistoryStore' }
  )
)

export default function useBrowsingHistory() {
  const { products, addItem, clear } = browsingHistoryStore()
  return { products, addItem, clear }
}