'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  isUnlocked: boolean
  unlock: (password: string) => boolean
  lock: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    const session = sessionStorage.getItem('xpense_unlocked')
    if (session === 'true') setIsUnlocked(true)
  }, [])

  const unlock = (password: string): boolean => {
    const correct = process.env.NEXT_PUBLIC_APP_PASSWORD
    if (password === correct) {
      setIsUnlocked(true)
      sessionStorage.setItem('xpense_unlocked', 'true')
      return true
    }
    return false
  }

  const lock = () => {
    setIsUnlocked(false)
    sessionStorage.removeItem('xpense_unlocked')
  }

  return (
    <AuthContext.Provider value={{ isUnlocked, unlock, lock }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
