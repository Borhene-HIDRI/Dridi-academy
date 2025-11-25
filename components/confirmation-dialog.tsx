"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  variant?: "danger" | "warning"
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  variant = "danger",
}: ConfirmationDialogProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-zinc-900 border border-white/20 shadow-2xl p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <div className={`p-3 rounded-full ${variant === "danger" ? "bg-red-500/10" : "bg-yellow-500/10"}`}>
                <AlertTriangle className={`h-6 w-6 ${variant === "danger" ? "text-red-500" : "text-yellow-500"}`} />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-white/10 text-white hover:bg-white/5 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onConfirm()
                  onClose()
                }}
                className={`flex-1 font-heading tracking-wider ${
                  variant === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-yellow-600 hover:bg-yellow-700"
                } text-white`}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
