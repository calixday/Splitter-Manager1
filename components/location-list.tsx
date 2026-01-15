"use client"

import type { Location } from "./location-context"
import { LocationCard } from "./location-card"

interface LocationListProps {
  locations: Location[]
}

export function LocationList({ locations }: LocationListProps) {
  return (
    <div className="grid gap-3 sm:gap-6 md:grid-cols-1 lg:grid-cols-1">
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  )
}
