import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated locally
    const checkLocalAuth = async () => {
      const authStatus = localStorage.getItem('admin_authenticated')
      if (authStatus === 'true') {
        // Try to get existing Supabase session
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          setIsAuthenticated(true)
        } else {
          // For now, allow local authentication without Supabase user
          // This will be updated once the admin user is created in Supabase
          setIsAuthenticated(true)
          console.log('Using local authentication - Supabase admin user not yet created')
        }
      }
      setLoading(false)
    }

    checkLocalAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          // Only set authenticated if we also have local auth
          const localAuth = localStorage.getItem('admin_authenticated')
          if (localAuth === 'true') {
            setIsAuthenticated(true)
          }
        } else {
          setUser(null)
          // Don't automatically set to false, let logout handle it
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithAdminCredentials = async () => {
    try {
      // Try to sign in with admin credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@wedding.local',
        password: 'Admin2025!'
      })

      if (error) {
        console.warn('Supabase admin sign in failed:', error.message)
        console.log('Please create an admin user in Supabase with email: admin@wedding.local and password: Admin2025!')
        return false
      }

      if (data.user) {
        setUser(data.user)
        return true
      }

      return false
    } catch (error) {
      console.error('Admin credentials sign in error:', error)
      return false
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Check static credentials first
      if (username === 'admin' && password === 'Admin2025!') {
        // Try to sign in to Supabase with admin credentials
        const supabaseSuccess = await signInWithAdminCredentials()
        
        if (supabaseSuccess) {
          setIsAuthenticated(true)
          localStorage.setItem('admin_authenticated', 'true')
          return true
        } else {
          // Allow local auth even if Supabase fails (for development)
          console.warn('Supabase authentication failed, using local auth')
          console.log('To enable full functionality, please create an admin user in Supabase:')
          console.log('Email: admin@wedding.local')
          console.log('Password: Admin2025!')
          
          setIsAuthenticated(true)
          localStorage.setItem('admin_authenticated', 'true')
          return true
        }
      }

      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('admin_authenticated')
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if Supabase fails
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('admin_authenticated')
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}