"use client"

import { useState } from "react"
import { useLocations } from "./location-context"
import { LocationList } from "./location-list"
import { SearchBar } from "./search-bar"
import { AddLocationModal } from "./add-location-modal"
import { Button } from "@/components/ui/button"

export function SplitterDashboard() {
  const { locations, isLoading } = useLocations()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"location" | "splitter">("location")
  const [showAddModal, setShowAddModal] = useState(false)

  const totalLocations = locations.length
  const totalSplitters = locations.reduce((sum, location) => sum + location.splitters.length, 0)

  const filteredLocations = locations.filter((location) => {
    if (searchType === "location") {
      return location.name.toLowerCase().includes(searchQuery.toLowerCase())
    } else {
      return location.splitters.some(
        (splitter) =>
          splitter.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          splitter.port.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-2 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-foreground">Splitter Manager</h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">SOUTH 1 {isLoading && "(Loading...)"}</p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              disabled={isLoading}
              size="sm"
              className="text-xs sm:text-base"
            >
              + Add Location
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-2 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 grid grid-cols-2 gap-2 sm:gap-4">
          <div className="rounded-lg border border-border bg-card p-3 sm:p-6">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Locations</p>
            <p className="mt-1 text-xl sm:text-3xl font-bold text-foreground">{totalLocations}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 sm:p-6">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Splitters</p>
            <p className="mt-1 text-xl sm:text-3xl font-bold text-foreground">{totalSplitters}</p>
          </div>
        </div>

        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchType={searchType}
          setSearchType={setSearchType}
        />

        <div className="mt-4">
          {isLoading ? (
            <div className="rounded-lg border border-border bg-card p-4 sm:p-8 text-center">
              <p className="text-sm sm:text-base text-muted-foreground">Loading data from Supabase...</p>
            </div>
          ) : filteredLocations.length > 0 ? (
            <LocationList locations={filteredLocations} />
          ) : (
            <div className="rounded-lg border border-border bg-card p-4 sm:p-8 text-center">
              <p className="text-sm sm:text-base text-muted-foreground">
                No {searchType === "location" ? "locations" : "splitters"} found matching your search.
              </p>
            </div>
          )}
        </div>
      </main>

      <AddLocationModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  )
}
