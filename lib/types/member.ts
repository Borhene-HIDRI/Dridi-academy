export interface MemberPayment {
  month: string;
  status: string;
}

export interface PendingUser {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  imageUrl?: string | null
  createdAt: string
  userType:number
}
export interface MemberData {
  id: string
  userId: string
  dateOfBirth?: string | null
  trainingCredits: number
  isMembershipActive: boolean
  totalClassesAttended: number
  totalBookings: number
  trainingPeriodStart?: string | null
  trainingPeriodEnd?: string | null
  payments: MemberPayment[]
}
export interface MemberSub {
  id: string;
  userId: string;
  dateOfBirth: string | null;
  trainingCredits: number;
  isMembershipActive: boolean;
  totalClassesAttended: number;
  totalBookings: number;
  membershipExpiresOn: string | null;
  createdAt: Date;
  trainingPeriodStart: string | null;
  trainingPeriodEnd: string | null;
  payments: MemberPayment[];
}

export interface MemberFull {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  imageUrl?: string | null ;
  isApproved: boolean;
  createdAt: string;

  member: MemberSub | null;
}
export interface MemberUpdateDTO {  
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string | null;
  trainingCredits?: number;
  isMembershipActive?: boolean;
  trainingPeriodStart?: string | null;
  trainingPeriodEnd?: string | null;
    payments: MemberPayment[]

}