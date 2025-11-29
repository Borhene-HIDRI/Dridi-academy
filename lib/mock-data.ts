export interface Athlete {
  id: string
  fullName: string
  email: string
  imageUrl?: string | null
  phoneNumber: string
  dateOfBirth: string
  emergencyContact: string
  trainingCredits: number
  isMembershipActive: boolean
  isApproved: boolean // Added approval status
  membershipExpiresOn: string
  totalClassesAttended: number
  totalBookings: number
  createdAt: string
  trainingPeriodStart: string
  trainingPeriodEnd: string
  paymentHistory: {
    month: string // Format: "YYYY-MM"
    status: "paid" | "unpaid" | "pending"
  }[]
}

export interface Message {
  id: string
  firstName: string
  lastName: string
  email: string
  interest: string
  message: string
  createdAt: string
  read: boolean
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
    isApproved: true, // Set default approval
    membershipExpiresOn: "2025-12-31",
    totalClassesAttended: 45,
    totalBookings: 50,
    createdAt: "2024-01-15",
    trainingPeriodStart: "2024-01-01",
    trainingPeriodEnd: "2024-12-31",
    paymentHistory: [
      { month: "2024-01", status: "paid" },
      { month: "2024-02", status: "paid" },
      { month: "2024-03", status: "paid" },
      { month: "2024-04", status: "paid" },
      { month: "2024-05", status: "pending" },
    ],
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
    isApproved: true, // Set default approval
    membershipExpiresOn: "2025-11-30",
    totalClassesAttended: 28,
    totalBookings: 32,
    createdAt: "2024-03-20",
    trainingPeriodStart: "2024-03-01",
    trainingPeriodEnd: "2025-02-28",
    paymentHistory: [
      { month: "2024-03", status: "paid" },
      { month: "2024-04", status: "unpaid" },
      { month: "2024-05", status: "pending" },
    ],
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
    isApproved: true, // Set default approval
    membershipExpiresOn: "2024-10-15",
    totalClassesAttended: 15,
    totalBookings: 20,
    createdAt: "2024-06-10",
    trainingPeriodStart: "2024-06-01",
    trainingPeriodEnd: "2024-12-31",
    paymentHistory: [],
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
    isApproved: true, // Set default approval
    membershipExpiresOn: "2026-01-31",
    totalClassesAttended: 78,
    totalBookings: 85,
    createdAt: "2023-09-01",
    trainingPeriodStart: "2023-09-01",
    trainingPeriodEnd: "2024-08-31",
    paymentHistory: [
      { month: "2023-09", status: "paid" },
      { month: "2023-10", status: "paid" },
      { month: "2023-11", status: "paid" },
      { month: "2023-12", status: "paid" },
      { month: "2024-01", status: "paid" },
      { month: "2024-02", status: "paid" },
      { month: "2024-03", status: "paid" },
      { month: "2024-04", status: "paid" },
      { month: "2024-05", status: "paid" },
    ],
  },
  {
    id: "5",
    fullName: "Omar Khedira",
    email: "omar.khedira@example.com",
    imageUrl: "/placeholder.svg?height=100&width=100",
    phoneNumber: "+216 55 123 789",
    dateOfBirth: "2001-04-12",
    emergencyContact: "+216 55 987 321",
    trainingCredits: 0,
    isMembershipActive: false,
    isApproved: false,
    membershipExpiresOn: "",
    totalClassesAttended: 0,
    totalBookings: 0,
    createdAt: "2024-06-25",
    trainingPeriodStart: "",
    trainingPeriodEnd: "",
    paymentHistory: [],
  },
  {
    id: "6",
    fullName: "Leila Ben Sassi",
    email: "leila.sassi@example.com",
    imageUrl: "/placeholder.svg?height=100&width=100",
    phoneNumber: "+216 22 456 123",
    dateOfBirth: "1999-09-09",
    emergencyContact: "+216 22 321 654",
    trainingCredits: 0,
    isMembershipActive: false,
    isApproved: false,
    membershipExpiresOn: "",
    totalClassesAttended: 0,
    totalBookings: 0,
    createdAt: "2024-06-26",
    trainingPeriodStart: "",
    trainingPeriodEnd: "",
    paymentHistory: [],
  },
]

export const mockMessages: Message[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    interest: "MMA",
    message: "I would like to join the MMA class. Do you offer trial sessions?",
    createdAt: "2024-05-20T10:30:00Z",
    read: false,
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Smith",
    email: "sarah@example.com",
    interest: "Kickboxing",
    message: "What is the schedule for kickboxing classes?",
    createdAt: "2024-05-19T15:45:00Z",
    read: true,
  },
]

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

export function getMessages(): Message[] {
  if (typeof window === "undefined") return mockMessages
  const stored = localStorage.getItem("mma_messages")
  if (!stored) {
    localStorage.setItem("mma_messages", JSON.stringify(mockMessages))
    return mockMessages
  }
  return JSON.parse(stored)
}

export function addMessage(message: Omit<Message, "id" | "createdAt" | "read">): void {
  const messages = getMessages()
  const newMessage: Message = {
    ...message,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    read: false,
  }
  messages.unshift(newMessage)
  localStorage.setItem("mma_messages", JSON.stringify(messages))
}

export function markMessageAsRead(id: string): void {
  const messages = getMessages()
  const index = messages.findIndex((m) => m.id === id)
  if (index !== -1) {
    messages[index].read = true
    localStorage.setItem("mma_messages", JSON.stringify(messages))
  }
}

export function deleteMessage(id: string): void {
  const messages = getMessages()
  const filtered = messages.filter((m) => m.id !== id)
  localStorage.setItem("mma_messages", JSON.stringify(filtered))
}

export function getPendingAthletes(): Athlete[] {
  return getAthletes().filter((a) => !a.isApproved)
}

export function approveAthlete(athleteId: string): void {
  const athletes = getAthletes()
  const index = athletes.findIndex((a) => a.id === athleteId)
  if (index !== -1) {
    athletes[index].isApproved = true
    athletes[index].isMembershipActive = true // Auto-activate membership on approval?
    localStorage.setItem("mma_athletes", JSON.stringify(athletes))
  }
}

export function rejectAthlete(athleteId: string): void {
  // Rejecting essentially means deleting the request in this simple model
  deleteAthlete(athleteId)
}
