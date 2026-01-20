"use client"

import { useState, useRef, useEffect } from "react"
import { useLocations } from "./location-context"
import { LocationList } from "./location-list"
import { SearchBar } from "./search-bar"
import { AddLocationModal } from "./add-location-modal"

export function SplitterDashboard() {
  const { locations, isLoading } = useLocations()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState<"location" | "splitter">("splitter")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const searchModalRef = useRef<HTMLDivElement>(null)
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null)

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchModalRef.current && !searchModalRef.current.contains(e.target as Node)) {
        setShowSearchModal(false)
        // Don't clear search query - keep it for highlighting
      }
    }

    const handleScroll = () => {
      setShowSearchModal(false)
      // Don't clear search query - keep it for highlighting
    }

    if (showSearchModal) {
      document.addEventListener("mousedown", handleClickOutside)
      window.addEventListener("scroll", handleScroll)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [showSearchModal])

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900 shadow-sm sticky top-0 z-40">
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4 gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent line-clamp-1">
                SPLITTER MANAGER
              </h1>
              <div className="flex items-center gap-2 sm:gap-4 mt-2 flex-wrap">
                <p className="text-xs sm:text-sm text-slate-400 truncate">Nairobi South 1</p>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                    <span className="hidden sm:inline">{totalLocations} locations</span>
                    <span className="sm:hidden">{totalLocations}L</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-2 py-1 text-xs font-medium text-purple-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                    <span className="hidden sm:inline">{totalSplitters} splitters</span>
                    <span className="sm:hidden">{totalSplitters}S</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowSearchModal(!showSearchModal)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 active:shadow-md transition-all flex items-center justify-center font-bold text-base sm:text-lg touch-manipulation"
                aria-label="Search"
              >
                🔍
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                disabled={isLoading}
                className="text-xs sm:text-sm px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-colors disabled:opacity-50 touch-manipulation"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {showSearchModal && (
          <div
            ref={searchModalRef}
            className="fixed inset-x-3 sm:right-4 top-1/2 sm:top-auto sm:bottom-auto transform -translate-y-1/2 sm:translate-y-0 w-auto max-w-xs sm:w-96 rounded-lg sm:rounded-xl bg-slate-800 border border-slate-700 shadow-2xl p-3 sm:p-4 z-50"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-100">Search</h2>
              <button
                onClick={() => {
                  setShowSearchModal(false)
                }}
                className="text-slate-400 hover:text-slate-200 text-xl"
                title="Close search"
              >
                ✕
              </button>
            </div>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchType={searchType}
              setSearchType={setSearchType}
            />
          </div>
        )}

        {/* Search Results Header */}
        {searchQuery && (
          <div className="flex items-center justify-between mb-4 p-3 sm:p-4 bg-slate-800/50 rounded-lg border border-red-500/30">
            <div className="flex items-center gap-2">
              <span className="text-red-400 text-lg">●</span>
              <p className="text-sm text-slate-200">
                Searching for <span className="font-semibold text-red-400">"{searchQuery}"</span> in {searchType}s
              </p>
            </div>
            <button
              onClick={() => setSearchQuery("")}
              className="text-red-400 hover:text-red-300 text-lg transition-colors touch-manipulation"
              title="Clear search"
            >
              ✕
            </button>
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
