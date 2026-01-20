"use client"

import type { Location } from "./location-context"
import { LocationCard } from "./location-card"

interface LocationListProps {
  locations: Location[]
  searchQuery?: string
  searchType?: "location" | "splitter"
}

export function LocationList({ locations, searchQuery = "", searchType = "splitter" }: LocationListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 auto-rows-max">
      {locations.map((location) => (
        <LocationCard 
          key={location.id} 
          location={location}
          highlightQuery={searchQuery}
          highlightType={searchType}
        />
      ))}
    </div>
  )
}
