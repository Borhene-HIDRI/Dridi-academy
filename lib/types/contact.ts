export interface ContactMessageDTO {
  firstName: string;
  lastName: string;
  PhoneNumber: string;
  interest: string;
  message: string;
  
}

export interface ContactMessageResponse {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  interest: string;
  isRead: boolean;
  message: string;
  createdAt: string;
}
