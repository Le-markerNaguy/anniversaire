"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthContextType {
  token: string | null;
  login: (jwt: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    setToken(stored)
    if (!stored && typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
      router.push("/admin/login")
    }
  }, [router])

  const login = (jwt: string) => {
    localStorage.setItem("auth_token", jwt)
    setToken(jwt)
    router.push("/admin")
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setToken(null)
    router.push("/admin/login")
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
