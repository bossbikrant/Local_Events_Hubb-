import type React from "react"
import "./globals.css"
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"

export const metadata: Metadata = {
  title: "Local Events Hub - Tech & Startup",
  description: "Discover and connect with local tech events, hackathons, and startup meetups",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
