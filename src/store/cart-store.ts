import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  productName: string
  sizeKg: number
  price: number
  quantity: number
  image?: string
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string, sizeKg: number) => void
  updateQuantity: (productId: string, sizeKg: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (newItem) => {
        const { items } = get()
        const existingItemIndex = items.findIndex(
          item => item.productId === newItem.productId && item.sizeKg === newItem.sizeKg
        )
        
        if (existingItemIndex > -1) {
          // Si ya existe, incrementar cantidad
          const updatedItems = [...items]
          updatedItems[existingItemIndex].quantity += 1
          set({ items: updatedItems })
        } else {
          // Si no existe, agregar nuevo item
          set({ items: [...items, { ...newItem, quantity: 1 }] })
        }
      },
      
      removeItem: (productId, sizeKg) => {
        const { items } = get()
        const filteredItems = items.filter(
          item => !(item.productId === productId && item.sizeKg === sizeKg)
        )
        set({ items: filteredItems })
      },
      
      updateQuantity: (productId, sizeKg, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, sizeKg)
          return
        }
        
        const { items } = get()
        const updatedItems = items.map(item => 
          item.productId === productId && item.sizeKg === sizeKg
            ? { ...item, quantity }
            : item
        )
        set({ items: updatedItems })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotalItems: () => {
        const { items } = get()
        return items.reduce((total, item) => total + item.quantity, 0)
      },
      
      getTotalPrice: () => {
        const { items } = get()
        return items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)
