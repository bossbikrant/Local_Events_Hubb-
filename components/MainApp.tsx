"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventsScreen from "./screens/EventsScreen"
import ProfileScreen from "./screens/ProfileScreen"
import { Calendar, User, Search, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/contexts/ThemeContext"
import { useNotifications } from "@/contexts/NotificationContext"
import NotificationCenter from "./NotificationCenter"

interface MainAppProps {
  onLogout: () => void
}

export default function MainApp({ onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState("events")
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { sendNotification } = useNotifications()

  // Send welcome notification on mount
  useEffect(() => {
    // Only send welcome notification once when user is first available
    if (user) {
      const hasShownWelcome = sessionStorage.getItem("welcome_shown")
      if (!hasShownWelcome) {
        sendNotification({
          title: "Welcome back!",
          body: `Hello ${user.name}, check out the latest tech events happening near you.`,
          type: "general",
        })
        sessionStorage.setItem("welcome_shown", "true")
      }
    }
  }, [user]) // Only depend on user, not sendNotification

  const handleLogout = () => {
    logout()
    onLogout()
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Tech Events Hub</h1>
            <p className="text-blue-100 text-sm">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsContent value="events" className="mt-0">
          <EventsScreen />
        </TabsContent>

        <TabsContent value="profile" className="mt-0">
          <ProfileScreen onLogout={handleLogout} />
        </TabsContent>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
          <TabsList className="grid w-full grid-cols-2 h-16 bg-transparent">
            <TabsTrigger
              value="events"
              className="flex flex-col items-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Events</span>
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="flex flex-col items-center gap-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Profile</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  )
}
