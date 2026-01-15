"use client"

import type { Location } from "./location-context"
import { LocationCard } from "./location-card"

interface LocationListProps {
  locations: Location[]
}

export function LocationList({ locations }: LocationListProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-6 md:gap-7">
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  )
}
