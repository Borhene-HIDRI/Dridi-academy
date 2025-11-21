import { api } from "../api";
import type { ContactMessageDTO, ContactMessageResponse } from "../types/contact";

export const ContactService = {
  async sendMessage(dto: ContactMessageDTO): Promise<ContactMessageResponse> {
    return await api.post<ContactMessageResponse>("/Contact/send", dto);
  }
};
