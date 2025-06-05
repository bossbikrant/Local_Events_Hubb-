"use client"

import React from "react"
import { createContext, useContext, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  interests: string[]
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Simple in-memory database simulation (in real app, this would be a proper database)
interface StoredUser {
  id: string
  name: string
  email: string
  passwordHash: string
  avatar?: string
  bio?: string
  interests: string[]
  createdAt: string
}

// Initialize with some demo users
const initializeDatabase = () => {
  const existingUsers = localStorage.getItem("users_database")
  if (!existingUsers) {
    const demoUsers: StoredUser[] = [
      {
        id: "demo-user-1",
        name: "Demo User",
        email: "demo@techevents.com",
        passwordHash: "demo123", // In real app, this would be properly hashed
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "Demo user for testing the application",
        interests: ["React", "Node.js", "Demo"],
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem("users_database", JSON.stringify(demoUsers))
  }
}

// Simple password hashing simulation (in real app, use bcrypt)
const hashPassword = (password: string): string => {
  // This is NOT secure - just for demo purposes
  // In a real app, use bcrypt or similar
  return btoa(password + "salt")
}

const verifyPassword = (password: string, hash: string): boolean => {
  // This is NOT secure - just for demo purposes
  return btoa(password + "salt") === hash
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize database on component mount
  React.useEffect(() => {
    initializeDatabase()

    // Check for existing session
    const token = localStorage.getItem("authToken")
    const currentUserId = localStorage.getItem("currentUserId")

    if (token && currentUserId) {
      // Restore user session
      const users: StoredUser[] = JSON.parse(localStorage.getItem("users_database") || "[]")
      const storedUser = users.find((u) => u.id === currentUserId)

      if (storedUser) {
        setUser({
          id: storedUser.id,
          name: storedUser.name,
          email: storedUser.email,
          avatar: storedUser.avatar,
          bio: storedUser.bio,
          interests: storedUser.interests,
        })
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Get users from "database"
      const users: StoredUser[] = JSON.parse(localStorage.getItem("users_database") || "[]")

      // Find user by email
      const storedUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())

      if (!storedUser) {
        return { success: false, message: "No account found with this email address" }
      }

      // Verify password
      if (!verifyPassword(password, storedUser.passwordHash)) {
        return { success: false, message: "Invalid password" }
      }

      // Create user session
      const sessionUser: User = {
        id: storedUser.id,
        name: storedUser.name,
        email: storedUser.email,
        avatar: storedUser.avatar,
        bio: storedUser.bio,
        interests: storedUser.interests,
      }

      setUser(sessionUser)

      // Store session
      const sessionToken = `session_${Date.now()}_${Math.random()}`
      localStorage.setItem("authToken", sessionToken)
      localStorage.setItem("currentUserId", storedUser.id)

      return { success: true, message: "Login successful" }
    } catch (error) {
      console.error("Login failed:", error)
      return { success: false, message: "Login failed. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Validation
      if (!name.trim()) {
        return { success: false, message: "Name is required" }
      }

      if (!email.trim() || !email.includes("@")) {
        return { success: false, message: "Valid email is required" }
      }

      if (password.length < 6) {
        return { success: false, message: "Password must be at least 6 characters" }
      }

      // Get existing users
      const users: StoredUser[] = JSON.parse(localStorage.getItem("users_database") || "[]")

      // Check if email already exists
      const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (existingUser) {
        return { success: false, message: "An account with this email already exists" }
      }

      // Create new user
      const newUser: StoredUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash: hashPassword(password),
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "",
        interests: [],
        createdAt: new Date().toISOString(),
      }

      // Add to database
      users.push(newUser)
      localStorage.setItem("users_database", JSON.stringify(users))

      // Don't automatically log in - user needs to sign in manually
      return { success: true, message: "Account created successfully! Please sign in with your credentials." }
    } catch (error) {
      console.error("Registration failed:", error)
      return { success: false, message: "Registration failed. Please try again." }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("authToken")
    localStorage.removeItem("currentUserId")
  }

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)

      // Update in database
      const users: StoredUser[] = JSON.parse(localStorage.getItem("users_database") || "[]")
      const userIndex = users.findIndex((u) => u.id === user.id)

      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          name: updatedUser.name,
          bio: updatedUser.bio || "",
          interests: updatedUser.interests,
        }
        localStorage.setItem("users_database", JSON.stringify(users))
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        isLoading,
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
