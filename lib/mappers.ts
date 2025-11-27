import { Athlete } from "./mock-data";
import { MemberFull } from "./types/member";


export function mapMemberToAthlete(m: MemberFull): Athlete {
  return {
    id: m.id,
    fullName: m.fullName,
    email: m.email,
    phoneNumber: m.phoneNumber,
    imageUrl: m.imageUrl,
    isApproved: m.isApproved,

    // MemberSub fields
    trainingCredits: m.member?.trainingCredits ?? 0,
    isMembershipActive: m.member?.isMembershipActive ?? false,
    totalBookings: m.member?.totalBookings ?? 0,
    totalClassesAttended: m.member?.totalClassesAttended ?? 0,

    dateOfBirth: m.member?.dateOfBirth ?? "",
    emergencyContact: "", // backend does not have this yet

    trainingPeriodStart: m.member?.trainingPeriodStart ?? "",
    trainingPeriodEnd: m.member?.trainingPeriodEnd ?? "",
    membershipExpiresOn:m.member?.membershipExpiresOn ?? "",
        createdAt: m.createdAt,
paymentHistory:
  m.member?.payments.map(p => ({
    month: p.month,
    status:
      p.status === "paid" || p.status === "pending" || p.status === "unpaid"
        ? p.status
        : "unpaid" // fallback for unknown value
  })) ?? [],
  }
}
