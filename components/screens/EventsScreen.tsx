"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEvents } from "@/contexts/EventContext"
import EventCard from "@/components/EventCard"
import EventDetails from "@/components/EventDetails"
import { Search, Filter, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EventsScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const { events, searchEvents, filterByCategory, refreshEvents } = useEvents()

  const categories = ["All", "Hackathon", "Workshop", "Meetup", "Networking", "Conference"]

  const getFilteredEvents = () => {
    let filtered = events

    if (selectedCategory !== "All") {
      filtered = filterByCategory(selectedCategory)
    }

    if (searchQuery.trim()) {
      filtered = searchEvents(searchQuery)
    }

    return filtered
  }

  const filteredEvents = getFilteredEvents()

  if (selectedEvent) {
    return <EventDetails eventId={selectedEvent} onBack={() => setSelectedEvent(null)} />
  }

  return (
    <div className="pb-20">
      {/* Search and Filter Section */}
      <div className="p-4 bg-white border-b border-gray-200 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search events, tags, or organizers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={refreshEvents}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          {selectedCategory !== "All" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {selectedCategory}
              <button onClick={() => setSelectedCategory("All")} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                ×
              </button>
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              "{searchQuery}"
              <button onClick={() => setSearchQuery("")} className="ml-1 hover:bg-gray-300 rounded-full p-0.5">
                ×
              </button>
            </Badge>
          )}
        </div>
      </div>

      {/* Events List */}
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="p-4 space-y-4">
          {filteredEvents.length === 0 ? (
            <Card className="p-8 text-center">
              <CardContent>
                <div className="text-gray-500">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No events found</h3>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredEvents.length} Event{filteredEvents.length !== 1 ? "s" : ""} Found
                </h2>
              </div>

              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} onClick={() => setSelectedEvent(event.id)} />
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
