"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, X } from "lucide-react"

interface MessageConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function MessageConfirmationModal({ isOpen, onClose }: MessageConfirmationModalProps) {
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
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden p-8 text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
            </div>

            <h2 className="text-2xl font-heading font-bold text-white mb-4">MESSAGE SENT!</h2>
            <p className="text-gray-400 mb-8">
              Thank you for reaching out. We have received your message and will contact you within the next 24 hours.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-primary hover:bg-primary/90 text-white font-heading text-lg py-4 transition-colors"
            >
              CLOSE
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
