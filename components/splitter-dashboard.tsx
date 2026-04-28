"use client"

import { useState } from "react"
import { useLocations } from "./location-context"
import { LocationList } from "./location-list"
import { SearchBar } from "./search-bar"
import { AddLocationModal } from "./add-location-modal"

export function SplitterDashboard() {
  const { locations, isLoading } = useLocations()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"location" | "splitter" | "technician">("splitter")
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)

  const totalLocations = locations.length
  const totalSplitters = locations.reduce((sum, location) => sum + location.splitters.length, 0)

  const filteredLocations = locations.filter((location) => {
    if (searchType === "location") {
      return location.name.toLowerCase().includes(searchQuery.toLowerCase())
    } else if (searchType === "technician") {
      return location.technician?.name.toLowerCase().includes(searchQuery.toLowerCase())
    } else {
      return location.splitters.some(
        (splitter) =>
          splitter.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
          splitter.port.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }
  })



  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900 shadow-sm sticky top-0 z-40">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
          {/* Top row: Title and stats */}
          <div className="flex items-start justify-between py-2 sm:py-2.5 gap-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent line-clamp-1">
                SPLITTER MGR
              </h1>
              <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap text-xs sm:text-sm">
                <span className="text-slate-400">Nairobi South 1</span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-500/20 px-1.5 py-0.5 text-xs font-medium text-blue-300">
                  <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                  <span className="hidden sm:inline">{totalLocations}L</span>
                  <span className="sm:hidden">{totalLocations}</span>
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-purple-500/20 px-1.5 py-0.5 text-xs font-medium text-purple-300">
                  <span className="w-1 h-1 rounded-full bg-purple-400"></span>
                  <span className="hidden sm:inline">{totalSplitters}S</span>
                  <span className="sm:hidden">{totalSplitters}</span>
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              disabled={isLoading}
              className="text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-colors disabled:opacity-50 touch-manipulation font-medium flex-shrink-0 h-fit"
            >
              <span className="hidden sm:inline">+ Add Location</span>
              <span className="sm:hidden">+ Add</span>
            </button>
          </div>
          
          {/* Bottom row: Search Bar */}
          <div className="pb-2 sm:pb-2.5">
            <div className="max-w-sm ml-auto">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchType={searchType}
                setSearchType={setSearchType}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
        {/* Search Results Header */}
        {searchQuery && (
          <div className="flex items-center justify-between mb-3 p-2 sm:p-3 bg-slate-800/50 rounded-lg border border-red-500/30">
            <p className="text-xs sm:text-sm text-slate-200">
              <span className="text-red-400">●</span> Searching: <span className="font-semibold text-red-400">"{searchQuery}"</span> in <span className="capitalize">{searchType}</span>
            </p>
          </div>
        )}

        {/* Locations Grid */}
        <div>
          {isLoading ? (
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-12 text-center shadow-sm">
              <p className="text-slate-400">Loading locations...</p>
            </div>
          ) : filteredLocations.length > 0 ? (
            <LocationList 
              locations={filteredLocations} 
              searchQuery={searchQuery}
              searchType={searchType}
            />
          ) : (
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-12 text-center shadow-sm">
              <p className="text-slate-400">No {searchType === "location" ? "locations" : "splitters"} found.</p>
            </div>
          )}
        </div>
      </main>

      <AddLocationModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  )
}
