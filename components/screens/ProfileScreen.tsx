"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { useEvents } from "@/contexts/EventContext"
import { Edit, LogOut, Calendar, Users, Settings, Star } from "lucide-react"

interface ProfileScreenProps {
  onLogout: () => void
}

export default function ProfileScreen({ onLogout }: ProfileScreenProps) {
  const { user, updateProfile } = useAuth()
  const { events } = useEvents()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    interests: user?.interests || [],
  })

  const rsvpedEvents = events.filter((event) => event.isRSVPed)
  const totalAttendees = rsvpedEvents.reduce((sum, event) => sum + event.attendees, 0)

  const handleSave = () => {
    updateProfile(editData)
    setIsEditing(false)
  }

  const addInterest = (interest: string) => {
    if (interest && !editData.interests.includes(interest)) {
      setEditData({
        ...editData,
        interests: [...editData.interests, interest],
      })
    }
  }

  const removeInterest = (interest: string) => {
    setEditData({
      ...editData,
      interests: editData.interests.filter((i) => i !== interest),
    })
  }

  if (!user) return null

  return (
    <div className="pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-white">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-2xl bg-white text-blue-600">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-blue-100">{user.email}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{rsvpedEvents.length} Events</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{totalAttendees} Connections</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{rsvpedEvents.length}</div>
              <div className="text-sm text-gray-600">Events Joined</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{user.interests.length}</div>
              <div className="text-sm text-gray-600">Interests</div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile Information</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  />
                </div>
                <Button onClick={handleSave} className="w-full">
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Bio</Label>
                  <p className="mt-1 text-gray-900">{user.bio || "No bio added yet. Click edit to add one!"}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Interests */}
        <Card>
          <CardHeader>
            <CardTitle>Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {user.interests.map((interest) => (
                <Badge key={interest} variant="secondary" className="flex items-center gap-1">
                  {interest}
                  {isEditing && (
                    <button
                      onClick={() => removeInterest(interest)}
                      className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  placeholder="Add interest..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addInterest(e.currentTarget.value)
                      e.currentTarget.value = ""
                    }
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Events */}
        <Card>
          <CardHeader>
            <CardTitle>My Events ({rsvpedEvents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {rsvpedEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No events joined yet. Explore events to get started!</p>
            ) : (
              <div className="space-y-3">
                {rsvpedEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-gray-600">
                        {event.date} • {event.location}
                      </p>
                    </div>
                    <Badge variant="outline">{event.category}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Star className="h-4 w-4 mr-2" />
              Notification Preferences
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Privacy Settings
            </Button>
            <Button variant="destructive" className="w-full justify-start" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
