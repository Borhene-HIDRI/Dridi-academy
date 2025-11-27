"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { motion } from "framer-motion"

export function DashboardHeader() {
  const [time, setTime] = useState<string>("")

  useEffect(() => {
    // Set initial time
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      setTime(timeString)
    }

    updateTime()

    // Update time every second
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-black via-black to-black/80 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo and School Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            {/* Logo */}
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-900 border-2 border-red-500/50 shadow-lg shadow-red-500/20">
              <span className="text-white font-heading font-black text-2xl">D</span>
            </div>

            {/* School Name */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-heading font-black tracking-wider text-white">DRIDI MMA</h1>
              <p className="text-xs text-zinc-500 uppercase tracking-widest">Academy</p>
            </div>
          </motion.div>

          {/* Center - Local Time */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="hidden md:flex items-center gap-3 bg-zinc-900/50 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <Clock className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-mono text-white font-semibold tracking-wider">{time || "Loading..."}</span>
          </motion.div>

          {/* Right - User Profile */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <UserProfileDropdown />
          </motion.div>
        </div>
      </div>
    </header>
  )
}
