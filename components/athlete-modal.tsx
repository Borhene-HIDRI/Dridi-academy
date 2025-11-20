"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { type Athlete, updateAthlete, deleteAthlete } from "@/lib/mock-data"
import { Trash2 } from "lucide-react"

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-black border-red-600 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Athlete Details</DialogTitle>
        </DialogHeader>

        {!showDeleteConfirm ? (
          <div className="space-y-4">
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

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trainingCredits">Training Credits</Label>
                <Input
                  id="trainingCredits"
                  type="number"
                  value={formData.trainingCredits}
                  onChange={(e) => setFormData({ ...formData, trainingCredits: Number.parseInt(e.target.value) || 0 })}
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

            <div className="space-y-2">
              <Label htmlFor="membershipExpiresOn">Membership Expires On</Label>
              <Input
                id="membershipExpiresOn"
                type="date"
                value={formData.membershipExpiresOn}
                onChange={(e) => setFormData({ ...formData, membershipExpiresOn: e.target.value })}
                className="bg-zinc-900 border-zinc-800"
              />
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
          </div>
        ) : (
          <div className="py-6">
            <p className="text-center text-lg mb-4">Are you sure you want to delete this athlete?</p>
            <p className="text-center text-zinc-400">This action cannot be undone.</p>
          </div>
        )}

        <DialogFooter className="flex justify-between">
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
