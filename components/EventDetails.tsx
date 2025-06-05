"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEvents } from "@/contexts/EventContext"
import { useAuth } from "@/contexts/AuthContext"
import { ArrowLeft, Calendar, MapPin, Users, Heart, Share2, MessageCircle, Send } from "lucide-react"
import Image from "next/image"
import GoogleMap from "./GoogleMap"

interface EventDetailsProps {
  eventId: string
  onBack: () => void
}

export default function EventDetails({ eventId, onBack }: EventDetailsProps) {
  const [newComment, setNewComment] = useState("")
  const { events, comments, rsvpEvent, addComment } = useEvents()
  const { user } = useAuth()

  const event = events.find((e) => e.id === eventId)
  const eventComments = comments.filter((c) => c.eventId === eventId)

  if (!event) {
    return (
      <div className="p-4">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <p>Event not found</p>
      </div>
    )
  }

  const handleRSVP = () => {
    rsvpEvent(event.id)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(event.id, newComment.trim())
      setNewComment("")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCommentTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getAttendanceStatus = () => {
    const percentage = (event.attendees / event.maxAttendees) * 100
    if (percentage >= 90) return { text: "Almost Full", color: "text-red-600" }
    if (percentage >= 70) return { text: "Filling Up", color: "text-orange-600" }
    return { text: "Available", color: "text-green-600" }
  }

  const attendanceStatus = getAttendanceStatus()

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant={event.isRSVPed ? "default" : "outline"}
            onClick={handleRSVP}
            className={event.isRSVPed ? "bg-red-500 hover:bg-red-600" : ""}
          >
            <Heart className={`h-4 w-4 mr-2 ${event.isRSVPed ? "fill-current" : ""}`} />
            {event.isRSVPed ? "Going" : "RSVP"}
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-140px)]">
        <div className="space-y-6">
          {/* Event Image */}
          <div className="relative">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              width={400}
              height={250}
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-black/70 text-white">{event.category}</Badge>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Event Title and Basic Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {event.organizer
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span>Organized by {event.organizer}</span>
              </div>
            </div>

            {/* Event Details */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{formatDate(event.date)}</p>
                    <p className="text-sm text-gray-600">{event.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{event.location}</p>
                    <p className="text-sm text-gray-600">View on map</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">
                      {event.attendees} of {event.maxAttendees} attendees
                    </p>
                    <p className={`text-sm ${attendanceStatus.color}`}>{attendanceStatus.text}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Map */}
            <GoogleMap location={event.location} eventTitle={event.title} />

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Comments ({eventComments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">
                      {user?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                    />
                    <Button size="icon" onClick={handleAddComment} disabled={!newComment.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {eventComments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                  ) : (
                    eventComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.userAvatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {comment.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.userName}</span>
                              <span className="text-xs text-gray-500">{formatCommentTime(comment.timestamp)}</span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
