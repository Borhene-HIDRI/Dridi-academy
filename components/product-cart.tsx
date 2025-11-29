"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, ShoppingCart } from "lucide-react"
import { motion } from "framer-motion"
import { useStore, type Product } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
  onAddToCart?: () => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { toggleLike, isLiked, addToCart } = useStore()
  const { toast } = useToast()
  const [quantity] = useState(1)
  const isFavorite = isLiked(product.id)
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
    onAddToCart?.()
  }

  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }} className="group">
      <Card className="bg-card border-white/5 overflow-hidden h-full flex flex-col hover:border-primary/50 transition-colors">
        <div className="relative overflow-hidden bg-black flex-1">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.badge && (
              <span className="px-3 py-1 bg-primary text-black font-heading text-xs tracking-wider font-bold">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="px-3 py-1 bg-destructive text-white font-heading text-xs tracking-wider font-bold">
                -{discount}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            size="icon"
            onClick={() => toggleLike(product)}
            className="absolute top-4 right-4 rounded-none bg-black/50 hover:bg-primary hover:text-white border border-white/20 transition-all"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-current text-primary" : ""}`} />
          </Button>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
        </div>

        <CardContent className="p-6 flex flex-col flex-1 justify-between">
          <div>
            <p className="text-primary font-heading text-xs tracking-widest mb-2">{product.category}</p>
            <h3 className="text-xl font-heading font-bold text-white mb-4 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-heading font-bold text-white">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-primary/90 text-white font-heading tracking-wider rounded-none flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              ADD TO CART
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
