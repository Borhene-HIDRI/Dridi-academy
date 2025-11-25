// lib/auth-context.tsx
"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: string;
  fullName: string;
  email: string;
  imageUrl?: string;
  userType: number;
  role: string; // computed from userType
    isApproved: boolean;

}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loadingUser: boolean;         // ✅ NEW
  loadUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)     // ✅ Important

  useEffect(() => {
    loadUser()
  }, [])

  // 🔥 Load current user from /User/me
  const loadUser = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      setUser(null)
      setLoadingUser(false)
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/User/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Unauthorized")

      const data = await res.json()

      // Role mapping by userType
      const roleMap: any = {
        1: "Admin",
        2: "Coach",
        3: "Athlete",
      }

      const formattedUser: User = {
        ...data,
        role: roleMap[data.userType] ?? "Athlete",
      }

      setUser(formattedUser)

    } catch (error) {
      console.error("Failed to load user:", error)
      setUser(null)
      localStorage.removeItem("token")
    }

    setLoadingUser(false)   // ✅ FINALLY READY
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,     // only true AFTER loadUser finishes
        loadingUser,                 // ✅ allow pages to wait
        loadUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be inside AuthProvider")
  return ctx
}
