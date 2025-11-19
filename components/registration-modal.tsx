"use client"

import { useState } from "react"
import { X, Upload, CheckCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    sport: "MMA",
    picture: null as File | null
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true)
    }, 1000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, picture: e.target.files[0] })
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="p-8">
              {!isSubmitted ? (
                <>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-heading font-bold text-white mb-2">JOIN THE TEAM</h2>
                    <p className="text-gray-400 text-sm">Start your journey to greatness today.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-heading tracking-wider text-primary uppercase">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-primary outline-none transition-colors placeholder:text-gray-600"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-heading tracking-wider text-primary uppercase">Mobile Number</label>
                      <input 
                        required
                        type="tel" 
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-primary outline-none transition-colors placeholder:text-gray-600"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-heading tracking-wider text-primary uppercase">Select Sport</label>
                      <select 
                        value={formData.sport}
                        onChange={(e) => setFormData({...formData, sport: e.target.value})}
                        className="w-full bg-black/50 border border-white/10 p-3 text-white focus:border-primary outline-none transition-colors appearance-none"
                      >
                        <option value="MMA">MMA</option>
                        <option value="Kickboxing">Kickboxing</option>
                        <option value="Grappling">Grappling / BJJ</option>
                        <option value="Boxing">Boxing</option>
                        <option value="Wrestling">Wrestling</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-heading tracking-wider text-primary uppercase">Upload Picture (Optional)</label>
                      <div className="relative">
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="picture-upload"
                        />
                        <label 
                          htmlFor="picture-upload"
                          className="flex items-center justify-center gap-2 w-full bg-black/50 border border-white/10 border-dashed p-4 text-gray-400 hover:text-white hover:border-primary cursor-pointer transition-all"
                        >
                          <Upload className="h-4 w-4" />
                          <span className="text-sm">{formData.picture ? formData.picture.name : "Click to upload photo"}</span>
                        </label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-heading text-lg py-6 rounded-none mt-4">
                      SUBMIT APPLICATION
                    </Button>
                  </form>
                </>
              ) : (
                <div className="py-12 text-center flex flex-col items-center justify-center space-y-6">
                  <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-heading font-bold text-white">APPLICATION RECEIVED</h3>
                  <p className="text-gray-300 text-lg max-w-[250px] mx-auto leading-relaxed">
                    YOU WILL BE CONTACTED IN THE NEXT 24H
                  </p>
                  <Button 
                    onClick={onClose}
                    variant="outline" 
                    className="mt-8 border-white/20 text-white hover:bg-white hover:text-black rounded-none"
                  >
                    CLOSE
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
