"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Notification {
  id: string
  title: string
  body: string
  type: "event_reminder" | "event_update" | "new_comment" | "rsvp_confirmation" | "general"
  eventId?: string
  timestamp: string
  read: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  requestPermission: () => Promise<boolean>
  sendNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (notificationId: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
  hasPermission: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    // Check if browser supports notifications
    if ("Notification" in window) {
      setHasPermission(Notification.permission === "granted")
    }

    // Load saved notifications
    const savedNotifications = localStorage.getItem("app_notifications")
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
  }, [])

  useEffect(() => {
    // Only save notifications to localStorage when they actually change
    // and avoid saving empty arrays which can trigger unnecessary updates
    if (notifications.length > 0) {
      const currentNotifications = localStorage.getItem("app_notifications")
      const notificationsString = JSON.stringify(notifications)

      // Only update localStorage if the notifications have actually changed
      if (currentNotifications !== notificationsString) {
        localStorage.setItem("app_notifications", notificationsString)
      }
    }
  }, [notifications])

  const requestPermission = async (): Promise<boolean> => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return false
    }

    if (Notification.permission === "granted") {
      setHasPermission(true)
      return true
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission()
      const granted = permission === "granted"
      setHasPermission(granted)
      return granted
    }

    return false
  }

  const sendNotification = (notificationData: Omit<Notification, "id" | "timestamp" | "read">) => {
    const notification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    }

    // Add to app notifications
    setNotifications((prev) => [notification, ...prev])

    // Send browser notification if permission granted
    if (hasPermission && "Notification" in window) {
      const browserNotification = new Notification(notification.title, {
        body: notification.body,
        icon: "/placeholder.svg?height=64&width=64",
        badge: "/placeholder.svg?height=32&width=32",
        tag: notification.id,
        requireInteraction: notification.type === "event_reminder",
      })

      browserNotification.onclick = () => {
        window.focus()
        markAsRead(notification.id)
        browserNotification.close()
      }

      // Auto close after 5 seconds for non-critical notifications
      if (notification.type !== "event_reminder") {
        setTimeout(() => {
          browserNotification.close()
        }, 5000)
      }
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((notif) => !notif.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        requestPermission,
        sendNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        hasPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
