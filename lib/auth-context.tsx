"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  email: string
  fullName: string
  role: "admin" | "user"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, fullName: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("mma_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - admin@mma.com / admin123 for admin, any other for user
    if (email === "admin@mma.com" && password === "admin123") {
      const adminUser: User = {
        id: "1",
        email: "admin@mma.com",
        fullName: "Admin User",
        role: "admin",
      }
      setUser(adminUser)
      localStorage.setItem("mma_user", JSON.stringify(adminUser))
      return true
    } else if (password === "user123") {
      const normalUser: User = {
        id: "2",
        email,
        fullName: email.split("@")[0],
        role: "user",
      }
      setUser(normalUser)
      localStorage.setItem("mma_user", JSON.stringify(normalUser))
      return true
    }
    return false
  }

  const register = async (email: string, password: string, fullName: string): Promise<boolean> => {
    // Mock registration
    const newUser: User = {
      id: Math.random().toString(),
      email,
      fullName,
      role: "user",
    }
    setUser(newUser)
    localStorage.setItem("mma_user", JSON.stringify(newUser))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("mma_user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
