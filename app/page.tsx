"use client"

import { useState, useEffect } from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import { EventProvider } from "@/contexts/EventContext"
import LoginScreen from "@/components/screens/LoginScreen"
import MainApp from "@/components/MainApp"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { NotificationProvider } from "@/contexts/NotificationContext"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth token only once on mount
    const token = localStorage.getItem("authToken")
    if (token) {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, []) // Empty dependency array ensures this only runs once

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <EventProvider>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              {isAuthenticated ? (
                <MainApp onLogout={() => setIsAuthenticated(false)} />
              ) : (
                <LoginScreen onLogin={() => setIsAuthenticated(true)} />
              )}
            </div>
          </EventProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}
