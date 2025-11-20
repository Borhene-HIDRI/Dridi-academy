export interface Athlete {
  id: string
  fullName: string
  email: string
  imageUrl: string
  phoneNumber: string
  dateOfBirth: string
  emergencyContact: string
  trainingCredits: number
  isMembershipActive: boolean
  membershipExpiresOn: string
  totalClassesAttended: number
  totalBookings: number
  createdAt: string
}

export const mockAthletes: Athlete[] = [
  {
    id: "1",
    fullName: "Mohamed Ben Ali",
    email: "mohamed.benali@example.com",
    imageUrl: "/placeholder.svg?height=100&width=100",
    phoneNumber: "+216 98 123 456",
    dateOfBirth: "1995-05-15",
    emergencyContact: "+216 98 654 321",
    trainingCredits: 12,
    isMembershipActive: true,
    membershipExpiresOn: "2025-12-31",
    totalClassesAttended: 45,
    totalBookings: 50,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    fullName: "Ahmed Trabelsi",
    email: "ahmed.trabelsi@example.com",
    imageUrl: "/placeholder.svg?height=100&width=100",
    phoneNumber: "+216 99 234 567",
    dateOfBirth: "1998-08-22",
    emergencyContact: "+216 99 765 432",
    trainingCredits: 8,
    isMembershipActive: true,
    membershipExpiresOn: "2025-11-30",
    totalClassesAttended: 28,
    totalBookings: 32,
    createdAt: "2024-03-20",
  },
  {
    id: "3",
    fullName: "Yasmine Mansour",
    email: "yasmine.mansour@example.com",
    imageUrl: "/placeholder.svg?height=100&width=100",
    phoneNumber: "+216 97 345 678",
    dateOfBirth: "2000-02-10",
    emergencyContact: "+216 97 876 543",
    trainingCredits: 3,
    isMembershipActive: false,
    membershipExpiresOn: "2024-10-15",
    totalClassesAttended: 15,
    totalBookings: 20,
    createdAt: "2024-06-10",
  },
  {
    id: "4",
    fullName: "Karim Hamdi",
    email: "karim.hamdi@example.com",
    imageUrl: "/placeholder.svg?height=100&width=100",
    phoneNumber: "+216 96 456 789",
    dateOfBirth: "1992-11-30",
    emergencyContact: "+216 96 987 654",
    trainingCredits: 20,
    isMembershipActive: true,
    membershipExpiresOn: "2026-01-31",
    totalClassesAttended: 78,
    totalBookings: 85,
    createdAt: "2023-09-01",
  },
]

// Store athletes in localStorage
export function getAthletes(): Athlete[] {
  if (typeof window === "undefined") return mockAthletes
  const stored = localStorage.getItem("mma_athletes")
  if (!stored) {
    localStorage.setItem("mma_athletes", JSON.stringify(mockAthletes))
    return mockAthletes
  }
  return JSON.parse(stored)
}

export function updateAthlete(updatedAthlete: Athlete): void {
  const athletes = getAthletes()
  const index = athletes.findIndex((a) => a.id === updatedAthlete.id)
  if (index !== -1) {
    athletes[index] = updatedAthlete
    localStorage.setItem("mma_athletes", JSON.stringify(athletes))
  }
}

export function deleteAthlete(athleteId: string): void {
  const athletes = getAthletes()
  const filtered = athletes.filter((a) => a.id !== athleteId)
  localStorage.setItem("mma_athletes", JSON.stringify(filtered))
}
