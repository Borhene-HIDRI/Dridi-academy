"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, Trophy, Users } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { StatCard } from "@/components/stat-card"
import AuthGuard from "@/components/AuthGuard"
import { getMemberByUserId } from "@/lib/services/member-service"
import type { MemberFull } from "@/lib/types/member"
import PaymentTimeline from "@/components/payment-timeline"
import SkeletonDashboard from "@/components/skeleton-dashboard"

export default function DashboardPage() {
  const { user, isAuthenticated, loadingUser } = useAuth()
  const router = useRouter()

  const [userData, setUserData] = useState<MemberFull | null>(null)
  const [loading, setLoading] = useState(true)

  // ------------------------------
  // LOAD USER + MEMBER DATA
  // ------------------------------
  useEffect(() => {
    if (loadingUser) return

    if (!isAuthenticated || !user) {
      router.push("/")
      return
    }

    if (user.role !== "Member") {
      router.push("/")
      return
    }

    async function load() {
      try {
        const res = await getMemberByUserId(user!.id)
        setUserData(res)
      } catch (err) {
        console.error("Failed to load membership:", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [user, loadingUser, isAuthenticated, router])


  // ------------------------------
  // Extract member BEFORE any returns
  // ------------------------------
  const member = userData?.member

  // ------------------------------
  // NEXT BILLING MONTH (MUST BE BEFORE ANY CONDITIONAL RETURN)
  // ------------------------------
  const nextBillingMonth = useMemo(() => {
    if (!member?.payments) return null

    const unpaid = member.payments.filter(p => p.status === "unpaid")
    if (unpaid.length === 0) return null

    const sorted = unpaid.sort((a, b) => a.month.localeCompare(b.month))
    return sorted[0].month
  }, [member?.payments])

  // ------------------------------
  // CONDITIONAL RETURNS BELOW HOOKS
  // ------------------------------
  if (loadingUser || loading) return <SkeletonDashboard />
  if (!userData) return null


  // ------------------------------
  // RENDER DASHBOARD
  // ------------------------------
  return (
    <AuthGuard role="Member">
      <DashboardLayout
        title={`Welcome back, ${user?.fullName}!`}
        description="Track your training progress and membership"
      >
        {/* TOP STATS */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Training Credits"
            value={member?.trainingCredits ?? 0}
            description="Available sessions"
            icon={CreditCard}
          />

          <StatCard
            title="Classes Attended"
            value={member?.totalClassesAttended ?? 0}
            description="Total sessions"
            icon={Trophy}
          />

          <StatCard
            title="Total Bookings"
            value={member?.totalBookings ?? 0}
            description="All time"
            icon={Calendar}
          />

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membership Status</CardTitle>
              <Users className="h-4 w-4 text-red-600" />
            </CardHeader>

            <CardContent>
              <Badge className={member?.isMembershipActive ? "bg-green-600" : "bg-red-600"}>
                {member?.isMembershipActive ? "Active" : "Inactive"}
              </Badge>

              <div className="text-xs text-zinc-400 mt-3 space-y-1">
                <p>
                  Start:{" "}
                  {member?.trainingPeriodStart
                    ? new Date(member.trainingPeriodStart).toLocaleDateString()
                    : "—"}
                </p>

                <p>
                  End:{" "}
                  {member?.trainingPeriodEnd
                    ? new Date(member.trainingPeriodEnd).toLocaleDateString()
                    : "—"}
                </p>

                {nextBillingMonth && (
                  <p className="mt-1 text-yellow-400">
                    Next billing: {" "}
                  {member?.trainingPeriodEnd
                    ? new Date(member.trainingPeriodEnd).toLocaleDateString()
                    : "—"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {member?.payments && <PaymentTimeline payments={member.payments} />}

        {/* MEMBERSHIP DETAILS */}
        <Card className="bg-zinc-900 border-zinc-800 mt-6">
          <CardHeader>
            <CardTitle>Membership Details</CardTitle>
            <CardDescription>Your current membership information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Email</span>
              <span>{user?.email}</span>
            </div>

            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Membership Type</span>
              <span>Premium</span>
            </div>

            <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Join Date</span>
              <span>{" "}
                  {member?.trainingPeriodStart
                    ? new Date(member.trainingPeriodStart).toLocaleDateString()
                    : "—"}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Next billing</span>
              <span className="text-yellow-400 ">
                {" "}
                  {member?.trainingPeriodEnd
                    ? new Date(member.trainingPeriodEnd).toLocaleDateString()
                    : "—"}
              </span>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    </AuthGuard>
  )
}
