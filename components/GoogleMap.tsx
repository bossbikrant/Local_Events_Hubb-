"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, ExternalLink } from "lucide-react"

interface GoogleMapProps {
  location: string
  eventTitle?: string
}

export default function GoogleMap({ location, eventTitle }: GoogleMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false)

  // Sydney International School of Technology and Commerce coordinates
  const defaultLocation = "Sydney International School of Technology and Commerce, Sydney, NSW, Australia"
  const coordinates = { lat: -33.8688, lng: 151.2093 } // Sydney coordinates

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const openInGoogleMaps = () => {
    const query = encodeURIComponent(location || defaultLocation)
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`
    window.open(url, "_blank")
  }

  const getDirections = () => {
    const query = encodeURIComponent(location || defaultLocation)
    const url = `https://www.google.com/maps/dir/?api=1&destination=${query}`
    window.open(url, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Event Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Map Container */}
        <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          {!mapLoaded ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {/* Simulated Google Map */}
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 relative">
                {/* Map grid pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-6 h-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-gray-400 dark:border-gray-600"></div>
                    ))}
                  </div>
                </div>

                {/* Location marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-red-500"></div>
                  </div>
                </div>

                {/* Location label */}
                <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg max-w-xs">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{location || defaultLocation}</p>
                  {eventTitle && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{eventTitle}</p>}
                </div>

                {/* Zoom controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-1">
                  <button className="w-8 h-8 bg-white dark:bg-gray-800 rounded shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                    +
                  </button>
                  <button className="w-8 h-8 bg-white dark:bg-gray-800 rounded shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700">
                    −
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Location Details */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{location || defaultLocation}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Sydney, NSW, Australia</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={openInGoogleMaps} variant="outline" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Maps
          </Button>
          <Button onClick={getDirections} className="flex-1">
            <Navigation className="h-4 w-4 mr-2" />
            Get Directions
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>• Public transport: Train to Central Station, then bus</p>
          <p>• Parking: Limited street parking available</p>
          <p>• Accessibility: Wheelchair accessible venue</p>
        </div>
      </CardContent>
    </Card>
  )
}
