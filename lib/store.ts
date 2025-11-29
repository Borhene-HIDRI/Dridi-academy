import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice: number
  image: string
  badge: string | null
  featured: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

interface StoreState {
  likedProducts: Product[]
  cartItems: CartItem[]
  toggleLike: (product: Product) => void
  isLiked: (productId: number) => boolean
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      likedProducts: [],
      cartItems: [],

      toggleLike: (product: Product) => {
        set((state) => {
          const isLiked = state.likedProducts.some((p) => p.id === product.id)
          return {
            likedProducts: isLiked
              ? state.likedProducts.filter((p) => p.id !== product.id)
              : [...state.likedProducts, product],
          }
        })
      },

      isLiked: (productId: number) => {
        return get().likedProducts.some((p) => p.id === productId)
      },

      addToCart: (product: Product, quantity: number) => {
        set((state) => {
          const existingItem = state.cartItems.find((item) => item.product.id === product.id)
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
              ),
            }
          }
          return {
            cartItems: [...state.cartItems, { product, quantity }],
          }
        })
      },

      removeFromCart: (productId: number) => {
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.product.id !== productId),
        }))
      },

      updateQuantity: (productId: number, quantity: number) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        }))
      },

      clearCart: () => {
        set({ cartItems: [] })
      },

      getCartTotal: () => {
        return get().cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
      },
    }),
    {
      name: "mma-shop-store",
    },
  ),
)
