// /lib/member-service.ts
import { api } from "../api"
import type { MemberFull, PendingUser } from "../types/member"

export async function getAllMembers(): Promise<MemberFull[]> {
  return api.get<MemberFull[]>("/Member/all")
}



export async function approveUser(userId: string) {
  return api.post(`/User/approve/${userId}`, {})
}

export async function updateMember(userId: string, data: any) {
  return api.patch(`/Member/${userId}`, data)
}

export async function deleteMember(userId: string) {
  return api.delete(`/Member/${userId}`)
}

export async function getMemberByUserId(userId: string): Promise<MemberFull> {
  return api.get<MemberFull>(`/Member/${userId}`)
}
