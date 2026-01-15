"use client"

import type { Location } from "./location-context"
import { LocationCard } from "./location-card"

interface LocationListProps {
  locations: Location[]
}

export function LocationList({ locations }: LocationListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  )
}
