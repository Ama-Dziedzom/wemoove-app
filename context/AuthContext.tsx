"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { Alert } from "react-native"

interface Profile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  wallet_balance_ghs: number
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, userData: any) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  refreshProfile: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  refreshProfile: async () => {},
  resetPassword: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for session on app load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setIsLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setIsLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch user profile from Supabase
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        throw error
      }

      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh user profile
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  // Login with email and password
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        throw new Error("No user returned from login")
      }
    } catch (error: any) {
      Alert.alert("Login Error", error.message || "An error occurred during login")
      setIsLoading(false)
      throw error
    }
  }

  // Sign up with email and password
  const signup = async (email: string, password: string, userData: any) => {
    setIsLoading(true)
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (!data.user) {
        throw new Error("No user returned from signup")
      }

      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: email,
        phone: userData.phone,
        wallet_balance_ghs: 0,
      })

      if (profileError) {
        throw profileError
      }
    } catch (error: any) {
      Alert.alert("Signup Error", error.message || "An error occurred during signup")
      setIsLoading(false)
      throw error
    }
  }

  // Logout
  const logout = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    } catch (error: any) {
      Alert.alert("Logout Error", error.message || "An error occurred during logout")
    } finally {
      setIsLoading(false)
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "yourapp://reset-password",
      })

      if (error) {
        throw error
      }

      Alert.alert("Password Reset Email Sent", "Check your email for a password reset link.")
    } catch (error: any) {
      Alert.alert("Reset Password Error", error.message || "An error occurred during password reset")
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        refreshProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
