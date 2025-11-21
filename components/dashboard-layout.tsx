import type { ReactNode } from "react"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"

interface DashboardLayoutProps {
  title: string
  description: string
  children: ReactNode
}

export function DashboardLayout({ title, description, children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            <p className="text-zinc-400">{description}</p>
          </div>
          <UserProfileDropdown />
        </div>
        {children}
      </div>
    </div>
  )
}
