import { resolve } from "path";
import { api } from "../api";
import { PendingUser } from "../types/member";
import type { RegisterDTO, LoginDTO, AuthResponse } from "../types/user";
import type { AxiosResponse } from "axios";

export const UserService = {
  async register(dto: RegisterDTO, file?: File): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append("fullName", dto.fullName);
    formData.append("email", dto.email);
    formData.append("password", dto.password);
    formData.append("phoneNumber", dto.phoneNumber);

    if (file) {
      formData.append("ImageUrl", file); // MUST MATCH backend property name
    }
    
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/User/register`, {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);

      if(errorData?.errors){
        const allErrors = Object.values(errorData.errors)
        .flat()
        .join(" \n ")
        // const firstKey = Object.keys(errorData.errors)[0];
        // const firstError = errorData.errors[firstKey][0];
        throw new Error(allErrors);
      }
      throw new Error(errorData?.message || "Registration failed");
    }

    return res.json();
  },

 async login(dto: LoginDTO): Promise<AuthResponse> {
  try {
    const res = await api.post<AuthResponse>("/User/login", dto);
    console.log("LOGIN RAW RES:", res);
    return res; // <-- NOT res.data
  } catch (error: any) {
    const msg = error?.message || "Login failed";
    throw new Error(msg);
  }
}

 
};
export async function getPendingUsers(): Promise<PendingUser[]> {
 return api.get<PendingUser[]>("/User/pending");
}
export async function approveUser(userId: string): Promise<string> {
  return api.post<string>(`/User/approve/${userId}`);
}

export async function rejectUser(userId: string): Promise<string> {
  return api.delete<string>(`/User/${userId}`);
}
