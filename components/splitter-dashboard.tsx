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
  const [selectedModel, setSelectedModel] = useState("")
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
      // Splitter search
      return location.splitters.some((splitter) => {
        // If a model is selected, filter by that model first
        if (selectedModel && splitter.model.toLowerCase() !== selectedModel.toLowerCase()) {
          return false
        }
        
        // Then check if search query matches
        if (searchQuery) {
          return (
            splitter.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
            splitter.port.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }
        
        // If no search query, return true if model filter passed
        return true
      })
    }
  })

  // Calculate technician stats when searching by technician
  const technicianStats = searchType === "technician" && searchQuery
    ? {
        totalLocations: filteredLocations.length,
        totalSplitters: filteredLocations.reduce((sum, location) => sum + location.splitters.length, 0)
      }
    : null



  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900 shadow-lg sticky top-0 z-40">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top row: Title and stats */}
          <div className="flex items-start justify-between py-4 sm:py-6 lg:py-8 gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent line-clamp-1">
                Splitter Manager
              </h1>
              <div className="flex items-center gap-2 sm:gap-3 mt-3 flex-wrap text-sm sm:text-base">
                <span className="text-slate-300 font-medium">Nairobi South 1</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-3 py-1.5 text-sm font-medium text-blue-300 border border-blue-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                  <span>{totalLocations} Locations</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-3 py-1.5 text-sm font-medium text-purple-300 border border-purple-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  <span>{totalSplitters} Splitters</span>
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
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
        {/* Search Results Header */}
        {searchQuery && (
          <div className="mb-4 p-3 sm:p-4 bg-slate-800/50 rounded-lg border border-red-500/30">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs sm:text-sm text-slate-200">
                <span className="text-red-400">●</span> Searching: <span className="font-semibold text-red-400">"{searchQuery}"</span> in <span className="capitalize font-medium">{searchType}</span>
              </p>
            </div>
            
            {/* Technician Stats */}
            {technicianStats && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-500/30 text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V8.75" stroke="currentColor" strokeWidth="1" fill="none"/>
                  </svg>
                  {technicianStats.totalLocations} location{technicianStats.totalLocations !== 1 ? 's' : ''}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-500/30 text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 3a2 2 0 110 4 2 2 0 010-4zm4 10a4 4 0 01-8 0v-.5a2 2 0 012-2h4a2 2 0 012 2v.5z" fill="currentColor"/>
                  </svg>
                  {technicianStats.totalSplitters} splitter{technicianStats.totalSplitters !== 1 ? 's' : ''}
                </span>
              </div>
            )}
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

      <AddLocationModal open={showAddModal} onOpenChange={setShowAddModal} teamId={String(selectedTeamId || "")} />
    </div>
  )
}
