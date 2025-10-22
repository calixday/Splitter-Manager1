"use client"

import { useState, useEffect } from "react"
import { SplitterDashboard } from "@/components/splitter-dashboard"
import { LocationProvider } from "@/components/location-context"

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <LocationProvider>
      <SplitterDashboard />
    </LocationProvider>
  )
}
