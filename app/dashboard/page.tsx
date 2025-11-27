"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, Trophy, Users } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCard } from "@/components/stat-card"
import AuthGuard from "@/components/AuthGuard"
import { jwtDecode } from "jwt-decode"

export default function DashboardPage() {
  const { user, isAuthenticated, loadingUser } = useAuth()
  const router = useRouter()

  const token = localStorage.getItem("token");
  const decodedRole = jwtDecode


  useEffect(() => {
    // ⛔ Do not redirect until user information is fully loaded
    if (loadingUser) return;

    // Not logged in → home
    if (!isAuthenticated) {
      router.push("/")
      return;
    }

    // Still no user object yet → stop here
    if (!user) return;

    // Redirect admin
    if (user.role === "Admin") {
      router.push("/admin")
      return;
    }

    // Block everyone except athletes
    if (user.role !== "Athlete") {
      router.push("/")
      return;
    }

  }, [loadingUser, isAuthenticated, user, router])

  // ⏳ Show loader while auth is loading
  if (loadingUser) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  // ⛔ Prevent rendering until we are sure the user is athlete
  if (!user || user.role !== "Athlete") return null

  // Mock user data for now
  const membershipData = {
    trainingCredits: 12,
    isMembershipActive: true,
    membershipExpiresOn: "2025-12-31",
    totalClassesAttended: 45,
    totalBookings: 50,
  }

  return (
    <AuthGuard role="Athlete">
      <DashboardLayout
        title={`Welcome back, ${user.fullName}!`}
        description="Track your training progress and membership"
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Training Credits"
            value={membershipData.trainingCredits}
            description="Available sessions"
            icon={CreditCard}
          />
          <StatCard
            title="Classes Attended"
            value={membershipData.totalClassesAttended}
            description="Total sessions"
            icon={Trophy}
          />
          <StatCard
            title="Total Bookings"
            value={membershipData.totalBookings}
            description="All time"
            icon={Calendar}
          />
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membership Status</CardTitle>
              <Users className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <Badge className={membershipData.isMembershipActive ? "bg-green-600" : "bg-red-600"}>
                {membershipData.isMembershipActive ? "Active" : "Inactive"}
              </Badge>
              <p className="text-xs text-zinc-400 mt-2">
                Expires: {new Date(membershipData.membershipExpiresOn).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle>Membership Details</CardTitle>
            <CardDescription>Your current membership information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Email</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Membership Type</span>
              <span>Premium</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Join Date</span>
              <span>January 15, 2024</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Next Billing Date</span>
              <span>{new Date(membershipData.membershipExpiresOn).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    </AuthGuard>
  )
}
