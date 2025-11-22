export interface RegisterDTO {
  fullName: string;
  email: string;
  phoneNumber:string;
  password: string;
  ImageUrl?: string | null;  
  UserType:number
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  isSuccess:string;
  message:string;
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    imageUrl?: string;
    userType: string;
  };
}
