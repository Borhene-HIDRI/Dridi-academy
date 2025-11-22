export interface ContactMessageDTO {
  firstName: string;
  lastName: string;
  PhoneNumber: string;
  interest: string;
  message: string;
}

export interface ContactMessageResponse {
  id: number;
  createdAt: string;
}
