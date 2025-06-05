"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEvents } from "@/contexts/EventContext"
import { Calendar, MapPin, Users, Clock, Heart } from "lucide-react"
import Image from "next/image"

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

interface EventCardProps {
  event: Event
  onClick: () => void
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const { rsvpEvent } = useEvents()

  const handleRSVP = (e: React.MouseEvent) => {
    e.stopPropagation()
    rsvpEvent(event.id)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const getAttendanceColor = () => {
    const percentage = (event.attendees / event.maxAttendees) * 100
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-orange-600"
    return "text-green-600"
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="relative">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          width={400}
          height={200}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 text-gray-900 hover:bg-white">{event.category}</Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button
            variant={event.isRSVPed ? "default" : "secondary"}
            size="sm"
            onClick={handleRSVP}
            className={event.isRSVPed ? "bg-red-500 hover:bg-red-600" : "bg-white/90 hover:bg-white"}
          >
            <Heart className={`h-4 w-4 ${event.isRSVPed ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2 mt-1">{event.description}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {event.organizer
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">{event.organizer}</span>
            </div>

            <div className={`flex items-center gap-1 text-sm ${getAttendanceColor()}`}>
              <Users className="h-4 w-4" />
              <span>
                {event.attendees}/{event.maxAttendees}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {event.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {event.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{event.tags.length - 3}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
