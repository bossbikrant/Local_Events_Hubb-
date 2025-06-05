"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { useNotifications } from "./NotificationContext"

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  organizer: string
  attendees: number
  maxAttendees: number
  image: string
  tags: string[]
  isRSVPed: boolean
}

interface Comment {
  id: string
  eventId: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: string
}

interface EventContextType {
  events: Event[]
  comments: Comment[]
  rsvpEvent: (eventId: string) => void
  addComment: (eventId: string, content: string) => void
  searchEvents: (query: string) => Event[]
  filterByCategory: (category: string) => Event[]
  refreshEvents: () => void
}

const EventContext = createContext<EventContextType | undefined>(undefined)

// Mock data for Tech & Startup theme
const mockEvents: Event[] = [
  {
    id: "1",
    title: "AI/ML Hackathon 2024",
    description:
      "Join us for a 48-hour hackathon focused on artificial intelligence and machine learning solutions. Build innovative projects and compete for amazing prizes!",
    date: "2024-02-15",
    time: "09:00",
    location: "Tech Hub, Level 3, 123 Innovation St",
    category: "Hackathon",
    organizer: "TechCorp",
    attendees: 45,
    maxAttendees: 100,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["AI", "Machine Learning", "Python", "Competition"],
    isRSVPed: false,
  },
  {
    id: "2",
    title: "Startup Pitch Night",
    description:
      "Watch emerging startups pitch their ideas to investors and industry experts. Network with entrepreneurs and learn about the latest trends.",
    date: "2024-02-20",
    time: "18:30",
    location: "Innovation Center Auditorium",
    category: "Networking",
    organizer: "Startup Alliance",
    attendees: 78,
    maxAttendees: 150,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Startups", "Pitching", "Investors", "Networking"],
    isRSVPed: true,
  },
  {
    id: "3",
    title: "React Native Workshop",
    description:
      "Learn to build cross-platform mobile apps with React Native. Hands-on workshop covering navigation, state management, and API integration.",
    date: "2024-02-25",
    time: "10:00",
    location: "Code Academy, Room 201",
    category: "Workshop",
    organizer: "Mobile Dev Community",
    attendees: 32,
    maxAttendees: 50,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["React Native", "Mobile Development", "JavaScript", "Workshop"],
    isRSVPed: false,
  },
  {
    id: "4",
    title: "Blockchain & Web3 Meetup",
    description:
      "Explore the future of decentralized applications and blockchain technology. Featuring talks from industry leaders and hands-on demos.",
    date: "2024-03-01",
    time: "19:00",
    location: "Crypto Lounge, Downtown",
    category: "Meetup",
    organizer: "Web3 Collective",
    attendees: 67,
    maxAttendees: 80,
    image: "/placeholder.svg?height=200&width=300",
    tags: ["Blockchain", "Web3", "Cryptocurrency", "DeFi"],
    isRSVPed: false,
  },
]

const mockComments: Comment[] = [
  {
    id: "1",
    eventId: "1",
    userId: "1",
    userName: "Sarah Chen",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content: "Really excited for this hackathon! Anyone working on healthcare AI solutions?",
    timestamp: "2024-02-10T14:30:00Z",
  },
  {
    id: "2",
    eventId: "1",
    userId: "2",
    userName: "Mike Rodriguez",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content: "Count me in! I have experience with TensorFlow and would love to collaborate.",
    timestamp: "2024-02-10T15:45:00Z",
  },
  {
    id: "3",
    eventId: "2",
    userId: "3",
    userName: "Emma Thompson",
    userAvatar: "/placeholder.svg?height=40&width=40",
    content: "Great lineup of startups this month. Looking forward to the fintech presentations!",
    timestamp: "2024-02-12T09:20:00Z",
  },
]

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [comments, setComments] = useState<Comment[]>(mockComments)

  const { sendNotification } = useNotifications()

  const rsvpEvent = (eventId: string) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === eventId) {
          const isRSVPing = !event.isRSVPed
          const updatedEvent = {
            ...event,
            isRSVPed: isRSVPing,
            attendees: isRSVPing ? event.attendees + 1 : event.attendees - 1,
          }

          // Send notification
          if (isRSVPing) {
            sendNotification({
              title: "RSVP Confirmed!",
              body: `You're now registered for "${event.title}". We'll remind you before the event.`,
              type: "rsvp_confirmation",
              eventId: event.id,
            })
          }

          return updatedEvent
        }
        return event
      }),
    )
  }

  const addComment = (eventId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      eventId,
      userId: "1", // Current user ID
      userName: "Alex Developer",
      userAvatar: "/placeholder.svg?height=40&width=40",
      content,
      timestamp: new Date().toISOString(),
    }
    setComments((prev) => [...prev, newComment])
  }

  const searchEvents = (query: string): Event[] => {
    if (!query.trim()) return events
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
    )
  }

  const filterByCategory = (category: string): Event[] => {
    if (category === "All") return events
    return events.filter((event) => event.category === category)
  }

  const refreshEvents = () => {
    // Simulate API refresh
    console.log("Refreshing events...")
  }

  return (
    <EventContext.Provider
      value={{
        events,
        comments,
        rsvpEvent,
        addComment,
        searchEvents,
        filterByCategory,
        refreshEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

export function useEvents() {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider")
  }
  return context
}
