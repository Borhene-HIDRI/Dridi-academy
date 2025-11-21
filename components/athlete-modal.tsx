"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Athlete, updateAthlete, deleteAthlete } from "@/lib/mock-data"
import { Trash2, Calendar, CheckCircle, XCircle, Clock } from "lucide-react"

interface AthleteModalProps {
  athlete: Athlete
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function AthleteModal({ athlete, isOpen, onClose, onUpdate }: AthleteModalProps) {
  const [formData, setFormData] = useState<Athlete>(athlete)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = () => {
    updateAthlete(formData)
    onUpdate()
    onClose()
  }

  const handleDelete = () => {
    deleteAthlete(athlete.id)
    onUpdate()
    onClose()
  }

  // Helper to generate months between start and end date
  const getMonthsInRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const months = []
    const current = new Date(start)

    while (current <= end) {
      months.push(current.toISOString().slice(0, 7)) // YYYY-MM
      current.setMonth(current.getMonth() + 1)
    }
    return months
  }

  const months =
    formData.trainingPeriodStart && formData.trainingPeriodEnd
      ? getMonthsInRange(formData.trainingPeriodStart, formData.trainingPeriodEnd)
      : []

  const getPaymentStatus = (month: string) => {
    return formData.paymentHistory?.find((p) => p.month === month)?.status || "unpaid"
  }

  const togglePaymentStatus = (month: string) => {
    const currentStatus = getPaymentStatus(month)
    const newStatus = currentStatus === "paid" ? "unpaid" : currentStatus === "unpaid" ? "pending" : "paid"

    const newHistory = [...(formData.paymentHistory || [])]
    const index = newHistory.findIndex((p) => p.month === month)

    if (index >= 0) {
      newHistory[index] = { month, status: newStatus }
    } else {
      newHistory.push({ month, status: newStatus })
    }

    setFormData({ ...formData, paymentHistory: newHistory })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-black border-red-600 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Athlete Details</DialogTitle>
        </DialogHeader>

        {!showDeleteConfirm ? (
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-900">
              <TabsTrigger value="details">Personal Info</TabsTrigger>
              <TabsTrigger value="membership">Membership & Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>
            </TabsContent>

            <TabsContent value="membership" className="space-y-6 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trainingCredits">Training Credits</Label>
                  <Input
                    id="trainingCredits"
                    type="number"
                    value={formData.trainingCredits}
                    onChange={(e) =>
                      setFormData({ ...formData, trainingCredits: Number.parseInt(e.target.value) || 0 })
                    }
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalClassesAttended">Classes Attended</Label>
                  <Input
                    id="totalClassesAttended"
                    type="number"
                    value={formData.totalClassesAttended}
                    onChange={(e) =>
                      setFormData({ ...formData, totalClassesAttended: Number.parseInt(e.target.value) || 0 })
                    }
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalBookings">Total Bookings</Label>
                  <Input
                    id="totalBookings"
                    type="number"
                    value={formData.totalBookings}
                    onChange={(e) => setFormData({ ...formData, totalBookings: Number.parseInt(e.target.value) || 0 })}
                    className="bg-zinc-900 border-zinc-800"
                  />
                </div>
              </div>

              <div className="space-y-4 border border-zinc-800 p-4 rounded-lg bg-zinc-900/50">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-600" />
                  Training Period
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="trainingPeriodStart">Start Date</Label>
                    <Input
                      id="trainingPeriodStart"
                      type="date"
                      value={formData.trainingPeriodStart || ""}
                      onChange={(e) => setFormData({ ...formData, trainingPeriodStart: e.target.value })}
                      className="bg-black border-zinc-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trainingPeriodEnd">End Date</Label>
                    <Input
                      id="trainingPeriodEnd"
                      type="date"
                      value={formData.trainingPeriodEnd || ""}
                      onChange={(e) => setFormData({ ...formData, trainingPeriodEnd: e.target.value })}
                      className="bg-black border-zinc-800"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Payment History</h3>
                {months.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3 max-h-[200px] overflow-y-auto pr-2">
                    {months.map((month) => {
                      const status = getPaymentStatus(month)
                      return (
                        <div
                          key={month}
                          onClick={() => togglePaymentStatus(month)}
                          className={`
                            cursor-pointer p-3 rounded border flex flex-col items-center justify-center gap-2 transition-all
                            ${
                              status === "paid"
                                ? "bg-green-900/20 border-green-600/50 hover:bg-green-900/40"
                                : status === "pending"
                                  ? "bg-yellow-900/20 border-yellow-600/50 hover:bg-yellow-900/40"
                                  : "bg-red-900/20 border-red-600/50 hover:bg-red-900/40"
                            }
                          `}
                        >
                          <span className="text-sm font-medium">{month}</span>
                          {status === "paid" ? (
                            <div className="flex items-center gap-1 text-green-500 text-xs uppercase font-bold">
                              <CheckCircle className="h-3 w-3" /> Paid
                            </div>
                          ) : status === "pending" ? (
                            <div className="flex items-center gap-1 text-yellow-500 text-xs uppercase font-bold">
                              <Clock className="h-3 w-3" /> Pending
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-500 text-xs uppercase font-bold">
                              <XCircle className="h-3 w-3" /> Unpaid
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-zinc-500 text-sm italic">Set a training period to view payment calendar.</p>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border border-zinc-800 rounded-lg">
                <div>
                  <Label htmlFor="membershipActive">Membership Active</Label>
                  <p className="text-sm text-zinc-400">Enable or disable membership status</p>
                </div>
                <Switch
                  id="membershipActive"
                  checked={formData.isMembershipActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isMembershipActive: checked })}
                />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="py-6">
            <p className="text-center text-lg mb-4">Are you sure you want to delete this athlete?</p>
            <p className="text-center text-zinc-400">This action cannot be undone.</p>
          </div>
        )}

        <DialogFooter className="flex justify-between mt-6">
          {!showDeleteConfirm ? (
            <>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} className="border-zinc-800 bg-transparent">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-red-600 hover:bg-red-700">
                  Save Changes
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="border-zinc-800">
                Cancel
              </Button>
              <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Confirm Delete
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
