"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart, ArrowRight, Instagram } from "lucide-react"
import { motion } from "framer-motion"
import { useStore } from "@/lib/store"
import { ProductCard } from "@/components/product-cart"

const PRODUCTS = [
  {
    id: 1,
    name: "Professional UFC Gloves",
    category: "Training Gloves",
    price: 199.99,
    originalPrice: 249.99,
    image: "/professional-ufc-boxing-gloves-red-leather.jpg",
    badge: "BEST SELLER",
    featured: true,
  },
  {
    id: 2,
    name: "Elite Training Jersey",
    category: "Apparel",
    price: 79.99,
    originalPrice: 99.99,
    image: "/black-athletic-training-jersey-with-logo.jpg",
    badge: "NEW",
    featured: true,
  },
  {
    id: 3,
    name: "Combat Shorts",
    category: "Apparel",
    price: 89.99,
    originalPrice: 119.99,
    image: "/athletic-mma-combat-shorts-red-and-black.jpg",
    badge: null,
    featured: false,
  },
  {
    id: 4,
    name: "Hand Wraps Set",
    category: "Accessories",
    price: 24.99,
    originalPrice: 34.99,
    image: "/professional-hand-wraps-boxing-training.jpg",
    badge: null,
    featured: false,
  },
  {
    id: 5,
    name: "Heavybag Gloves",
    category: "Training Gloves",
    price: 159.99,
    originalPrice: 199.99,
    image: "/heavy-bag-gloves-boxing-training-equipment.jpg",
    badge: "SALE",
    featured: true,
  },
  {
    id: 6,
    name: "Premium Training Rash Guard",
    category: "Apparel",
    price: 69.99,
    originalPrice: 89.99,
    image: "/compression-rash-guard-athletic-wear.jpg",
    badge: null,
    featured: false,
  },
  {
    id: 7,
    name: "Protective Mouthguard",
    category: "Accessories",
    price: 44.99,
    originalPrice: 59.99,
    image: "/sports-mouthguard-protective-gear.jpg",
    badge: "NEW",
    featured: false,
  },
  {
    id: 8,
    name: "Training Shin Guards",
    category: "Protective Gear",
    price: 134.99,
    originalPrice: 169.99,
    image: "/mma-shin-guards-protective-equipment.jpg",
    badge: null,
    featured: true,
  },
]

const CATEGORIES = ["All", "Training Gloves", "Apparel", "Accessories", "Protective Gear"]

function ShopNavbar() {
  const { cartItems } = useStore()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/90 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-6"}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10 overflow-hidden rounded-full bg-white p-0.5">
            <Image
              src="/images/school.jpg"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-heading text-xl font-bold tracking-tighter hidden sm:block">
            ABDERAHMEN DRIDI <span className="text-primary">MMA</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 font-heading text-sm tracking-widest">
          <Link href="/" className="hover:text-primary transition-colors">
            HOME
          </Link>
          <a href="#shop" className="hover:text-primary transition-colors">
            SHOP
          </a>
          <a href="/#contact" className="hover:text-primary transition-colors">
            CONTACT
          </a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/cart">
            <Button size="icon" variant="ghost" className="rounded-none hover:bg-primary hover:text-white">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/cart">
            <Button className="bg-primary hover:bg-primary/90 text-white font-heading tracking-wider rounded-none skew-x-[-10deg] relative">
              <span className="skew-x-[10deg] flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                CART
              </span>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

function FeaturedProducts() {
  const featured = PRODUCTS.filter((p) => p.featured)

  return (
    <section id="bestseller" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <h2 className="text-primary font-heading text-lg tracking-widest mb-2">FEATURED COLLECTION</h2>
          <h3 className="text-5xl md:text-6xl font-heading font-bold text-white">SHOP BESTSELLERS</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AllProducts() {
  const [activeCategory, setActiveCategory] = useState("All")
  const filteredProducts = activeCategory === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCategory)

  return (
    <section id="shop" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-primary font-heading text-lg tracking-widest mb-2">COMPLETE INVENTORY</h2>
          <h3 className="text-5xl md:text-6xl font-heading font-bold text-white mb-8">ALL PRODUCTS</h3>

          <div className="flex flex-wrap gap-4">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 font-heading text-sm tracking-wider transition-all rounded-none border-2 ${
                  activeCategory === category
                    ? "bg-primary text-black border-primary"
                    : "bg-transparent text-white border-white/20 hover:border-primary"
                }`}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PromoSection() {
  return (
    <section className="py-24 bg-gradient-to-r from-primary/20 to-transparent border-y border-primary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-primary font-heading text-lg tracking-widest mb-4">LIMITED TIME</h2>
            <h3 className="text-5xl md:text-6xl font-heading font-bold text-white mb-6">
              GET CHAMPIONSHIP <span className="text-primary">READY</span>
            </h3>
            <p className="text-gray-400 text-lg mb-8">
              Use code DRIDI2024 for 15% off your first order. Premium gear to elevate your training.
            </p>
            <Button
              size="lg"
              className="bg-white text-black hover:bg-primary hover:text-white font-heading text-lg px-8 py-6 rounded-none"
            >
              SHOP NOW <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-96"
          >
            <Image
              src="/professional-athlete-in-mma-gear-training.jpg"
              alt="Champion athlete"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ShopFooter() {
  return (
    <footer className="bg-black py-5 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8  mb-12">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4 mt-15 ml-23">
              <div className="relative w-8 h-8  overflow-hidden rounded-full bg-white p-0.5">
                <Image
                  src="/images/lou.jpg"
                  alt="Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-heading text-lg font-bold tracking-tighter">
                DRIDI <span className="text-primary">MMA</span>
              </span>
            </Link>
            {/* <p className="text-gray-500 text-sm">Premium combat sports gear for champions.</p> */}
          </div>

          <div>
            <h4 className="font-heading font-bold text-white mb-4 tracking-wider">SHOP</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#shop" className="hover:text-primary transition-colors">
                  All Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Sale
                </a>
              </li>
              <li>
                <a href="#bestseller" className="hover:text-primary transition-colors">
                  Best Sellers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white mb-4 tracking-wider">SUPPORT</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-white mb-4 tracking-wider">FOLLOW</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="https://www.instagram.com/teamdridimma" className="hover:text-primary transition-colors">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  TikTok
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
{/* 
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Dridi MMA. All rights reserved.</p>
          <div className="flex gap-4 text-gray-500 text-sm">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Cookie Settings
            </a>
          </div>
        </div> */}
      </div>
    </footer>
  )
}

export default function Shop() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ShopNavbar />
      <div className="pt-32 pb-0">
        <section className="relative h-96 flex items-center justify-center overflow-hidden">
          <Image
            src="/mma-training-gloves-equipment-professional-arena.jpg"
            alt="Shop Hero"
            fill
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-background/30" />
          <div className="relative z-10 text-center">
            <h1 className="text-7xl md:text-8xl font-heading font-bold text-white mb-4">
              SHOP <span className="text-primary">GEAR</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to dominate the mats. Premium equipment built for champions.
            </p>
          </div>
        </section>
      </div>
      <FeaturedProducts />
      <PromoSection />
      <AllProducts />
      <ShopFooter />
    </main>
  )
}
