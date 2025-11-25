import { api } from "../api";
import type { ContactMessageDTO, ContactMessageResponse } from "../types/contact";

export const ContactService = {
  async sendMessage(dto: ContactMessageDTO): Promise<ContactMessageResponse> {
    return await api.post<ContactMessageResponse>("/Contact/send", dto);
  }  
};
export async function GetMessages(): Promise<ContactMessageResponse[]> {
  return api.get<ContactMessageResponse[]>("/Contact/all")
}
export async function markMessageAsRead(id: number) {
  return api.patch(`/contact/mark-read/${id}`);
}
export async function deleteMessage(id: number) {
  return api.delete(`/contact/delete/${id}`);
}