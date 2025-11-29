"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { useStore } from "@/lib/store"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useStore()
  const [isCheckout, setIsCheckout] = useState(false)

  if (!isCheckout) {
    return (
      <main className="min-h-screen bg-background text-foreground pt-32">
        <div className="container mx-auto px-4 py-12">
          <Link href="/shop" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>

          <h1 className="text-5xl font-heading font-bold text-white mb-12">SHOPPING CART</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-6">Your cart is empty</p>
              <Link href="/shop">
                <Button className="bg-primary hover:bg-primary/90 text-white font-heading tracking-wider">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cartItems.map((item, idx) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <Card className="bg-card border-white/5 overflow-hidden">
                        <CardContent className="p-6 flex gap-6">
                          <div className="relative w-32 h-32 flex-shrink-0">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-xl font-heading font-bold text-white mb-2">{item.product.name}</h3>
                              <p className="text-primary font-heading text-sm tracking-widest mb-4">
                                {item.product.category}
                              </p>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  className="h-8 w-8 p-0 rounded-none"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="text-white font-heading font-bold w-8 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                  className="h-8 w-8 p-0 rounded-none"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              <div className="text-right">
                                <p className="text-2xl font-heading font-bold text-white">
                                  ${(item.product.price * item.quantity).toFixed(2)}
                                </p>
                              </div>

                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromCart(item.product.id)}
                                className="hover:bg-destructive/20 hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="bg-card border-white/5 sticky top-32">
                  <CardContent className="p-6 space-y-6">
                    <h3 className="text-xl font-heading font-bold text-white">ORDER SUMMARY</h3>

                    <div className="space-y-3 border-b border-white/10 pb-6">
                      <div className="flex justify-between text-gray-400">
                        <span>Subtotal</span>
                        <span>${getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Shipping</span>
                        <span className="text-primary">FREE</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Tax</span>
                        <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-white">
                      <span className="font-heading text-lg font-bold">Total</span>
                      <span className="text-primary font-heading text-2xl font-bold">
                        ${(getCartTotal() * 1.1).toFixed(2)}
                      </span>
                    </div>

                    <Button
                      onClick={() => setIsCheckout(true)}
                      className="w-full bg-primary hover:bg-primary/90 text-white font-heading tracking-wider"
                    >
                      PROCEED TO CHECKOUT
                    </Button>

                    <Link href="/shop">
                      <Button variant="outline" className="w-full rounded-none bg-transparent">
                        Continue Shopping
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    )
  }

  return <CheckoutForm onBack={() => setIsCheckout(false)} />
}

function CheckoutForm({ onBack }: { onBack: () => void }) {
  const { cartItems, getCartTotal, clearCart } = useStore()
  const [step, setStep] = useState<"info" | "delivery" | "payment" | "success">("info")
  const [formData, setFormData] = useState({
    // Client Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    // Delivery
    deliveryOption: "standard",
    // Payment
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNextStep = () => {
    if (step === "info") setStep("delivery")
    else if (step === "delivery") setStep("payment")
    else if (step === "payment") setStep("success")
  }

  const handlePrevStep = () => {
    if (step === "delivery") setStep("info")
    else if (step === "payment") setStep("delivery")
  }

  const deliveryOptions = [
    { id: "standard", label: "Standard Delivery", time: "5-7 business days", price: 0 },
    { id: "express", label: "Express Delivery", time: "2-3 business days", price: 25 },
    { id: "overnight", label: "Overnight Delivery", time: "Next business day", price: 50 },
  ]

  const selectedDelivery = deliveryOptions.find((opt) => opt.id === formData.deliveryOption)
  const total = getCartTotal() * 1.1 + (selectedDelivery?.price || 0)

  if (step === "success") {
    return (
      <main className="min-h-screen bg-background text-foreground pt-32">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center py-20">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                <div className="text-3xl">✓</div>
              </div>
            </div>
            <h1 className="text-4xl font-heading font-bold text-white mb-4">ORDER CONFIRMED!</h1>
            <p className="text-gray-400 mb-8">
              Thank you for your purchase. Your order has been received and is being prepared for shipment.
            </p>
            <div className="bg-card border border-white/10 rounded p-6 mb-8 text-left">
              <p className="text-gray-400 mb-2">Order Number</p>
              <p className="text-2xl font-heading font-bold text-primary mb-6">
                #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <p className="text-gray-400 mb-2">Total Amount</p>
              <p className="text-2xl font-heading font-bold text-white">${total.toFixed(2)}</p>
            </div>
            <div className="space-y-3">
              <Link href="/shop">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-heading tracking-wider">
                  CONTINUE SHOPPING
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full rounded-none bg-transparent">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground pt-32">
      <div className="container mx-auto px-4 py-12">
        <Button variant="ghost" onClick={onBack} className="mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-card border-white/5">
              <CardContent className="p-8">
                {/* Step Indicator */}
                <div className="flex gap-4 mb-12">
                  {["info", "delivery", "payment"].map((s, idx) => (
                    <div
                      key={s}
                      className={`flex-1 h-1 rounded-full transition-all ${
                        ["info", "delivery", "payment"].indexOf(step) >= idx ? "bg-primary" : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>

                {/* Step Content */}
                {step === "info" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-bold text-white mb-8">CLIENT INFORMATION</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary md:col-span-2"
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary md:col-span-2"
                      />
                      <input
                        type="text"
                        name="address"
                        placeholder="Street Address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary md:col-span-2"
                      />
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="Zip Code"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                      />
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="bg-black/50 border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-primary md:col-span-2"
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="FR">France</option>
                        <option value="DE">Germany</option>
                        <option value="UK">United Kingdom</option>
                      </select>
                    </div>
                  </div>
                )}

                {step === "delivery" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-bold text-white mb-8">DELIVERY OPTIONS</h2>
                    <div className="space-y-3">
                      {deliveryOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`block p-4 border-2 rounded cursor-pointer transition-all ${
                            formData.deliveryOption === option.id
                              ? "border-primary bg-primary/10"
                              : "border-white/20 bg-black/50 hover:border-primary/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="deliveryOption"
                            value={option.id}
                            checked={formData.deliveryOption === option.id}
                            onChange={handleInputChange}
                            className="mr-3"
                          />
                          <span className="font-heading font-bold text-white">{option.label}</span>
                          <span className="text-gray-400 text-sm ml-4">{option.time}</span>
                          {option.price > 0 && (
                            <span className="text-primary float-right font-heading font-bold">+${option.price}</span>
                          )}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {step === "payment" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-heading font-bold text-white mb-8">PAYMENT INFORMATION</h2>
                    <input
                      type="text"
                      name="cardName"
                      placeholder="Cardholder Name"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number (no spaces)"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      maxLength={16}
                      className="w-full bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        className="bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                      />
                      <input
                        type="text"
                        name="cvv"
                        placeholder="CVV"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        maxLength={4}
                        className="bg-black/50 border border-white/20 rounded px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 mt-12">
                  {step !== "info" && (
                    <Button onClick={handlePrevStep} variant="outline" className="flex-1 rounded-none bg-transparent">
                      BACK
                    </Button>
                  )}
                  <Button
                    onClick={handleNextStep}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-heading tracking-wider"
                  >
                    {step === "payment" ? "COMPLETE ORDER" : "NEXT"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-card border-white/5 sticky top-32">
              <CardContent className="p-6">
                <h3 className="text-xl font-heading font-bold text-white mb-6">ORDER SUMMARY</h3>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm text-gray-400">
                      <span>
                        {item.product.name} x{item.quantity}
                      </span>
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-white/10 pt-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax</span>
                    <span>${(getCartTotal() * 0.1).toFixed(2)}</span>
                  </div>
                  {selectedDelivery && (
                    <div className="flex justify-between text-gray-400">
                      <span>Delivery</span>
                      <span>${selectedDelivery.price}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white border-t border-white/10 pt-3 mt-3">
                    <span className="font-heading font-bold">Total</span>
                    <span className="text-primary font-heading text-xl font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
