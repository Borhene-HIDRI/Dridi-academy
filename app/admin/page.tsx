"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LogOut, Search, Users, Trophy, Calendar } from "lucide-react"
import { getAthletes, type Athlete } from "@/lib/mock-data"
import { AthleteModal } from "@/components/athlete-modal"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"

export default function AdminPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [filteredAthletes, setFilteredAthletes] = useState<Athlete[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/")
      return
    }

    const loadedAthletes = getAthletes()
    setAthletes(loadedAthletes)
    setFilteredAthletes(loadedAthletes)
  }, [isAuthenticated, user, router])

  useEffect(() => {
    const filtered = athletes.filter(
      (athlete) =>
        athlete.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        athlete.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredAthletes(filtered)
  }, [searchQuery, athletes])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleAthleteClick = (athlete: Athlete) => {
    setSelectedAthlete(athlete)
    setIsModalOpen(true)
  }

  const handleAthleteUpdate = () => {
    const updatedAthletes = getAthletes()
    setAthletes(updatedAthletes)
    setFilteredAthletes(updatedAthletes)
  }

  const totalActive = athletes.filter((a) => a.isMembershipActive).length
  const totalClasses = athletes.reduce((sum, a) => sum + a.totalClassesAttended, 0)

  if (!user || user.role !== "admin") return null

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-zinc-400">Manage your athletes and memberships</p>
          </div>
        <UserProfileDropdown />

        </div>

        <div className="grid gap-3 md:grid-cols-3 mb-3">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Athletes</CardTitle>
              <Users className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{athletes.length}</div>
              <p className="text-xs text-zinc-400">Registered members</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Memberships</CardTitle>
              <Trophy className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActive}</div>
              <p className="text-xs text-zinc-400">Currently active</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
              <Calendar className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClasses}</div>
              <p className="text-xs text-zinc-400">Classes attended</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Athletes Management</CardTitle>
            <CardDescription>View and manage your registered athletes</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search athletes by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black border-zinc-800"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAthletes.map((athlete) => (
                <div
                  key={athlete.id}
                  onClick={() => handleAthleteClick(athlete)}
                  className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg hover:border-red-600 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
                      <span className="text-lg font-bold">{athlete.fullName.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{athlete.fullName}</h3>
                      <p className="text-sm text-zinc-400">{athlete.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{athlete.trainingCredits} Credits</p>
                      <p className="text-xs text-zinc-400">{athlete.totalClassesAttended} Classes</p>
                    </div>
                    <Badge className={athlete.isMembershipActive ? "bg-green-600" : "bg-red-600"}>
                      {athlete.isMembershipActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedAthlete && (
        <AthleteModal
          athlete={selectedAthlete}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedAthlete(null)
          }}
          onUpdate={handleAthleteUpdate}
        />
      )}
    </div>
  )
}
