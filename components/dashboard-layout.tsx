import { useEffect, useState, type ReactNode } from "react"
import { UserProfileDropdown } from "./user-profile-dropdown"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"
import Image from "next/image"

interface DashboardLayoutProps {
  title: string
  description: string
  children: ReactNode
}

export function DashboardLayout({ title, description, children }: DashboardLayoutProps) 
{
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

    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          {/* <div>
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            <p className="text-zinc-400">{description}</p>
          </div> */}
               {/* Logo and School Name */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
 <div className="flex items-center gap-2">
           <a href="#">
           <div className="relative w-10 h-10 overflow-hidden rounded-full bg-white p-0.5">
              <Image 
               src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/480521460_1073667818106133_4544762354426792498_n-jztncOdPvOePaMZDZ1PBuQJJ5p7YnT.jpg" 
               alt="Logo" 
               fill
               className="object-cover"
             />
           </div></a>
           <span className="font-heading text-xl font-bold tracking-tighter hidden sm:block">
              DRIDI <span className="text-primary">MMA</span> SCHOOL
           </span>
         </div>
          </motion.div>
              {/* Center - Local Time */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="hidden md:flex items-center gap-3 bg-zinc-900/50 border  px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <Clock className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-mono text-white font-semibold tracking-wider">{time || "Loading..."}</span>
          </motion.div>
<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <UserProfileDropdown />
          </motion.div>        </div>
        
        {children}
      </div>
    </div>
    </header>
  )
}
