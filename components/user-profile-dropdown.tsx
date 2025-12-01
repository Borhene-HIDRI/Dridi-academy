"use client"

import { LogOut, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export function UserProfileDropdown() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const imageUrl = user.imageUrl
    ? `${process.env.NEXT_PUBLIC_API_URL}${user.imageUrl}`
    : "/placeholder-user.jpg"
   const final= imageUrl.replace("/api","");

  return (
    <div className="flex items-center gap-3 mr-3">
      {/* Fade animation on the welcome text */}
      <AnimatePresence mode="wait">
        <motion.span
          key={user.fullName}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.25 }}
          className=" font-heading text-gray-400  hidden md:inline-block"
        >
             <span>Welcome,</span><span className="text-white font-semibold">{user.fullName.toUpperCase()}</span>
        </motion.span>
      </AnimatePresence>

      {/* Avatar + Menu */}
      <DropdownMenu onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <Avatar className="h-10 w-10 border border-zinc-800">
<AvatarImage
  src={`${final}`}
  alt={user.fullName}
/>                <AvatarFallback className="bg-primary text-white font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </Button>
        </DropdownMenuTrigger>

        {/* Dropdown animation */}
        <AnimatePresence>
          {open && (
            <DropdownMenuContent
              forceMount
              align="end"
              className="w-56 rounded bg-zinc-900 border-zinc-800 text-white overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-xs leading-none text-zinc-400">{user.email}</p>
                                        <p className="text-xs leading-none text-zinc-400">{user.role.toUpperCase()}</p>

                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-zinc-800" />

                <DropdownMenuGroup>
                  <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-zinc-800" />

                <DropdownMenuItem
                  className="text-red-500 focus:bg-red-900/20 cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </motion.div>
            </DropdownMenuContent>
          )}
        </AnimatePresence>
      </DropdownMenu>
    </div>
  )
}
