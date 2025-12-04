"use client"

import { SplitterDashboard } from "@/components/splitter-dashboard"
import { LocationProvider } from "@/components/location-context"

export default function Home() {
  return (
    <LocationProvider>
      <SplitterDashboard />
    </LocationProvider>
  )
}
