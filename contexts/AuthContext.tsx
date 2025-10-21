import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type User = { email: string }
type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string) => Promise<boolean>
  resetPassword: (email: string, newPassword: string) => Promise<boolean>
  requestOtp: (email: string) => Promise<boolean>
  verifyOtp: (email: string, code: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function toHex(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder()
  const data = enc.encode(password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return toHex(digest)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem('natfit_auth_user')
    if (raw) {
      try {
        setUser(JSON.parse(raw))
      } catch {}
    }
  }, [])

  const login = async (email: string, password: string) => {
    if (typeof window === 'undefined') return false
    const usersRaw = window.localStorage.getItem('natfit_users')
    const users: { email: string; passwordHash: string }[] = usersRaw ? JSON.parse(usersRaw) : []
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!found) return false
    const hash = await hashPassword(password)
    if (hash !== found.passwordHash) return false
    const u = { email }
    setUser(u)
    window.localStorage.setItem('natfit_auth_user', JSON.stringify(u))
    return true
  }

  const register = async (email: string, password: string) => {
    if (typeof window === 'undefined') return false
    const usersRaw = window.localStorage.getItem('natfit_users')
    const users: { email: string; passwordHash: string }[] = usersRaw ? JSON.parse(usersRaw) : []
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return false // já existe
    }
    const passwordHash = await hashPassword(password)
    users.push({ email, passwordHash })
    window.localStorage.setItem('natfit_users', JSON.stringify(users))
    const u = { email }
    setUser(u)
    window.localStorage.setItem('natfit_auth_user', JSON.stringify(u))
    return true
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('natfit_auth_user')
    }
  }

  // value será definido após incluir todas as funções (reset, otp, etc.)
  async function requestOtp(email: string) {
    try {
      const resp = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      return resp.ok
    } catch {
      return false
    }
  }

  async function verifyOtp(email: string, code: string) {
    try {
      const resp = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      if (!resp.ok) return false
      const u = { email }
      setUser(u)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('natfit_auth_user', JSON.stringify(u))
      }
      return true
    } catch {
      return false
    }
  }

  async function resetPassword(email: string, newPassword: string) {
    if (typeof window === 'undefined') return false
    const usersRaw = window.localStorage.getItem('natfit_users')
    const users: { email: string; passwordHash: string }[] = usersRaw ? JSON.parse(usersRaw) : []
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase())
    if (idx === -1) return false
    const passwordHash = await hashPassword(newPassword)
    users[idx].passwordHash = passwordHash
    window.localStorage.setItem('natfit_users', JSON.stringify(users))
    return true
  }

  const value = useMemo(() => ({ user, login, register, resetPassword, requestOtp, verifyOtp, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}