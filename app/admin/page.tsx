"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, Trophy, Calendar, MessageSquare, Mail, Clock } from "lucide-react"
import { getAthletes, getMessages, markMessageAsRead, type Athlete, type Message } from "@/lib/mock-data"
import { AthleteModal } from "@/components/athlete-modal"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCard } from "@/components/stat-card"


// -----------------------------------------------------------
// ⭐ Avatar component with FULL fallback logic
// -----------------------------------------------------------
function AthleteAvatar({ athlete }: { athlete: Athlete }) {
  const [useFallback, setUseFallback] = useState(false)

  const handleLoad = (e: any) => {
    // If Next.js returns placeholder.svg → force fallback
    if (e.target.src.includes("placeholder.svg")) {
      setUseFallback(true)
    }
  }

  return (
    <>
      {!useFallback ? (
        <img
          src={athlete.imageUrl}
          alt={athlete.fullName}
          className="h-12 w-12 rounded-full object-cover border border-zinc-700"
          onError={() => setUseFallback(true)}
          onLoad={handleLoad}
        />
      ) : (
        <div className="h-12 w-12 rounded-full bg-zinc-800 flex items-center justify-center">
          <span className="text-lg font-bold">
            {athlete.fullName.charAt(0)}
          </span>
        </div>
      )}
    </>
  )
}


// -----------------------------------------------------------
// ⭐ MAIN Admin Page
// -----------------------------------------------------------
export default function AdminPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredAthletes, setFilteredAthletes] = useState<Athlete[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Load data
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      router.push("/")
      return
    }

    const loadedAthletes = getAthletes()
    const loadedMessages = getMessages()
    setAthletes(loadedAthletes)
    setFilteredAthletes(loadedAthletes)
    setMessages(loadedMessages)
  }, [isAuthenticated, user, router])

  // Search filter
  useEffect(() => {
    const filtered = athletes.filter(
      (athlete) =>
        athlete.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        athlete.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredAthletes(filtered)
  }, [searchQuery, athletes])

  const handleAthleteClick = (athlete: Athlete) => {
    setSelectedAthlete(athlete)
    setIsModalOpen(true)
  }

  const handleAthleteUpdate = () => {
    const updatedAthletes = getAthletes()
    setAthletes(updatedAthletes)
    setFilteredAthletes(updatedAthletes)
  }

  const handleMarkAsRead = (id: string) => {
    markMessageAsRead(id)
    setMessages(getMessages())
  }

  const totalActive = athletes.filter((a) => a.isMembershipActive).length
  const totalClasses = athletes.reduce((sum, a) => sum + a.totalClassesAttended, 0)
  const unreadMessages = messages.filter((m) => !m.read).length

  if (!user || user.role !== "admin") return null

  return (
    <DashboardLayout title="Admin Dashboard" description="">
      
      {/* Top Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <StatCard title="Total Athletes" value={athletes.length} description="Registered members" icon={Users} />
        <StatCard title="Active Memberships" value={totalActive} description="Currently active" icon={Trophy} />
        <StatCard title="Total Classes" value={totalClasses} description="Classes attended" icon={Calendar} />
        <StatCard title="New Messages" value={unreadMessages} description="Unread inquiries" icon={MessageSquare} />
      </div>


      {/* Tabs */}
      <Tabs defaultValue="athletes" className="space-y-6">
        <TabsList className="bg-zinc-900 border-zinc-800">
          <TabsTrigger value="athletes">Athletes Management</TabsTrigger>
          <TabsTrigger value="messages">Messages ({unreadMessages})</TabsTrigger>
        </TabsList>


        {/* Athletes Tab */}
        <TabsContent value="athletes">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Athletes</CardTitle>

              <div className="relative mt-2 mb-2">
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
              <div className="space-y-2">
                {filteredAthletes.map((athlete) => (
                  <div
                    key={athlete.id}
                    onClick={() => handleAthleteClick(athlete)}
                    className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg hover:border-red-600 cursor-pointer transition-colors"
                  >
                    
                    {/* Avatar + Info */}
                    <div className="flex items-center gap-4">
                      <AthleteAvatar athlete={athlete} />

                      <div>
                        <h3 className="font-semibold">{athlete.fullName}</h3>
                        <p className="text-sm text-zinc-400">{athlete.phoneNumber}</p>
                      </div>
                    </div>

                    {/* Credits + Active Status */}
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
        </TabsContent>


        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Inbox</CardTitle>
              <CardDescription>Messages from the contact form</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <p className="text-center text-zinc-400 py-8">No messages received yet.</p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        message.read ? "border-zinc-800 bg-black/20" : "border-red-600/50 bg-red-900/10"
                      }`}
                      onClick={() => !message.read && handleMarkAsRead(message.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            {message.firstName} {message.lastName}
                          </h3>
                          {!message.read && <Badge className="bg-red-600 text-[10px] h-5">NEW</Badge>}
                        </div>

                        <div className="flex items-center text-xs text-zinc-400 gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(message.createdAt).toLocaleDateString()} at{" "}
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3">
                        <Mail className="h-3 w-3" />
                        {message.email}
                        <span className="mx-2">•</span>
                        <span className="text-primary">{message.interest}</span>
                      </div>

                      <p className="text-zinc-300 bg-black/40 p-3 rounded border border-zinc-800/50">
                        {message.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>


      {/* Athlete Modal */}
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
    </DashboardLayout>
  )
}
