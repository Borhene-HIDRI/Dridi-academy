"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Athlete, updateAthlete, deleteAthlete } from "@/lib/mock-data"
import { Trash2, CalendarIcon, CheckCircle, XCircle, Clock, Edit2, Save } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface AthleteModalProps {
  athlete: Athlete
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function AthleteModal({ athlete, isOpen, onClose, onUpdate }: AthleteModalProps) {
  const [formData, setFormData] = useState<Athlete>(athlete)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: athlete.trainingPeriodStart ? new Date(athlete.trainingPeriodStart) : undefined,
    to: athlete.trainingPeriodEnd ? new Date(athlete.trainingPeriodEnd) : undefined,
  })

  const handleSave = () => {
    const updatedData = {
      ...formData,
      trainingPeriodStart: dateRange.from ? format(dateRange.from, "yyyy-MM-dd") : "",
      trainingPeriodEnd: dateRange.to ? format(dateRange.to, "yyyy-MM-dd") : "",
    }
    updateAthlete(updatedData)
    onUpdate()
    setIsEditMode(false)
  }

  const handleDelete = () => {
    deleteAthlete(athlete.id)
    onUpdate()
    onClose()
  }

  const getMonthsInRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const months = []
    const current = new Date(start)

    while (current <= end) {
      months.push(current.toISOString().slice(0, 7))
      current.setMonth(current.getMonth() + 1)
    }
    return months
  }

  const months =
    dateRange.from && dateRange.to
      ? getMonthsInRange(format(dateRange.from, "yyyy-MM-dd"), format(dateRange.to, "yyyy-MM-dd"))
      : []

  const getPaymentStatus = (month: string) => {
    return formData.paymentHistory?.find((p) => p.month === month)?.status || "unpaid"
  }

  const togglePaymentStatus = (month: string) => {
    if (!isEditMode) return

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
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 ${isOpen ? "block" : "hidden"}`} />
      <DialogContent className="sm:max-w-3xl bg-black/95 backdrop-blur-xl border-white/10 max-h-[90vh] overflow-y-auto text-white shadow-2xl z-50">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-heading font-bold text-white tracking-wider uppercase">
              Member Details
            </DialogTitle>
            {!showDeleteConfirm && !isEditMode && (
              <Button
                onClick={() => setIsEditMode(true)}
                className="ml-2 mr-5 bg-primary hover:bg-primary/90 text-white font-heading tracking-wider"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                MODIFY
              </Button>
            )}
            {!showDeleteConfirm && isEditMode && (
              <Button
                onClick={handleSave}
                className="bg-green-600 mr-4  hover:bg-green-700 text-white font-heading tracking-wider"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
          </div>
        </DialogHeader>

        {!showDeleteConfirm ? (
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-white/10">
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-[oklch(0.6_0.2_20)] data-[state=active]:text-white font-heading text-zinc-400"
              >
                Personal Info
              </TabsTrigger>
              <TabsTrigger
                value="membership"
                className="data-[state=active]:bg-[oklch(0.6_0.2_20)] data-[state=active]:text-white font-heading text-zinc-400"
              >
                Membership & Payments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-xs font-heading tracking-wider text-primary uppercase">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={!isEditMode}
                    className="bg-black/50 border-white/10 text-white focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-heading tracking-wider text-primary uppercase">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditMode}
                    className="bg-black/50 border-white/10 text-white focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-xs font-heading tracking-wider text-primary uppercase">
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    disabled={!isEditMode}
                    className="bg-black/50 border-white/10 text-white focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-xs font-heading tracking-wider text-primary uppercase">
                    Date of Birth
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    disabled={!isEditMode}
                    className="bg-black/50 border-white/10 text-white focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="emergencyContact"
                  className="text-xs font-heading tracking-wider text-primary uppercase"
                >
                  Emergency Contact
                </Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  disabled={!isEditMode}
                  className="bg-black/50 border-white/10 text-white focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </TabsContent>

            <TabsContent value="membership" className="space-y-6 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="trainingCredits"
                    className="text-xs font-heading tracking-wider text-primary uppercase"
                  >
                    Credits
                  </Label>
                  <Input
                    id="trainingCredits"
                    type="number"
                    value={formData.trainingCredits}
                    onChange={(e) =>
                      setFormData({ ...formData, trainingCredits: Number.parseInt(e.target.value) || 0 })
                    }
                    disabled={!isEditMode}
                    className="bg-black/50 border-white/10 text-white focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="totalClassesAttended"
                    className="text-xs font-heading tracking-wider text-primary uppercase"
                  >
                    Attended
                  </Label>
                  <Input
                    id="totalClassesAttended"
                    type="number"
                    value={formData.totalClassesAttended}
                    onChange={(e) =>
                      setFormData({ ...formData, totalClassesAttended: Number.parseInt(e.target.value) || 0 })
                    }
                    disabled={!isEditMode}
                    className="bg-black/50 border-white/10 text-white focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalBookings" className="text-xs font-heading tracking-wider text-primary uppercase">
                    Bookings
                  </Label>
                  <Input
                    id="totalBookings"
                    type="number"
                    value={formData.totalBookings}
                    onChange={(e) => setFormData({ ...formData, totalBookings: Number.parseInt(e.target.value) || 0 })}
                    disabled={!isEditMode}
                    className="bg-black/50 border-white/10 text-white focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-4 border border-white/10 p-4 bg-black/30">
                <h3 className="font-heading uppercase tracking-wider text-sm text-primary flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Training Period
                </h3>
                <div className="space-y-2">
                  <Label className="text-xs text-zinc-400">Select Start and End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild disabled={!isEditMode}>
                      <Button
                        id="date"
                        variant={"outline"}
                        disabled={!isEditMode}
                        className={cn(
                          "w-full justify-start text-left font-normal bg-black/50 border-white/10 hover:bg-zinc-800 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed",
                          !dateRange && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-zinc-900 border-white/10 text-white" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={(range: any) => setDateRange(range || { from: undefined, to: undefined })}
                        numberOfMonths={2}
                        className="bg-zinc-900 text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-heading uppercase tracking-wider text-sm text-white">Payment History</h3>
                {/* {!isEditMode && 
                // <p className="text-xs text-zinc-500 italic">Click "Edit" to modify payment statuses</p>
                } */}
                {months.length > 0 ? (
                  <div className="grid grid-cols-3 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {months.map((month) => {
                      const status = getPaymentStatus(month)
                      return (
                        <div
                          key={month}
                          onClick={() => togglePaymentStatus(month)}
                          className={`
                            p-3 border flex flex-col items-center justify-center gap-2 transition-all
                            ${isEditMode ? "cursor-pointer" : "cursor-not-allowed opacity-70"}
                            ${
                              status === "paid"
                                ? "bg-green-900/20 border-green-600/50 hover:bg-green-900/40"
                                : status === "pending"
                                  ? "bg-yellow-900/20 border-yellow-600/50 hover:bg-yellow-900/40"
                                  : "bg-red-900/20 border-red-600/50 hover:bg-red-900/40"
                            }
                          `}
                        >
                          <span className="text-sm font-medium font-mono">{month}</span>
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
                  <p className="text-zinc-500 text-sm italic">
                    Use the calendar above to set a training period and view the payment schedule.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                <div>
                  <Label
                    htmlFor="membershipActive"
                    className="text-xs font-heading tracking-wider text-primary uppercase"
                  >
                    Membership Active
                  </Label>
                  <p className="text-sm text-zinc-400">Enable or disable membership status</p>
                </div>
                <Switch
                  id="membershipActive"
                  checked={formData.isMembershipActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isMembershipActive: checked })}
                  disabled={!isEditMode}
                  className="disabled:opacity-60 disabled:cursor-not-allowed"
                />
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="py-6">
            <p className="text-center text-lg mb-4 text-white">Are you sure you want to delete this athlete?</p>
            <p className="text-center text-zinc-400">This action cannot be undone.</p>
          </div>
        )}

        <DialogFooter className="flex justify-between mt-6">
          {!showDeleteConfirm ? (
            <>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isEditMode}
                className="bg-destructive hover:bg-destructive/80 text-white font-heading tracking-wider disabled:opacity-50"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (isEditMode) {
                      setIsEditMode(false)
                      setFormData(athlete) // Reset to original data
                    } else {
                      onClose()
                    }
                  }}
                  className="border-white/10 bg-transparent text-white hover:bg-white/10 font-heading tracking-wider"
                >
                  {isEditMode ? "Cancel Edit" : "Close"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="border-white/10 bg-transparent text-white hover:bg-white/10 font-heading tracking-wider"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/80 text-white font-heading tracking-wider"
              >
                Confirm Delete
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
