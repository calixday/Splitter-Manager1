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
        setSearchQuery("")
      }
    }

    const handleScroll = () => {
      setShowSearchModal(false)
      setSearchQuery("")
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
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900 shadow-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                SPLITTER MANAGER
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-sm text-slate-400">Nairobi South 1</p>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/20 px-2 py-1 text-xs font-medium text-blue-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    {totalLocations} locations
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/20 px-2 py-1 text-xs font-medium text-purple-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                    {totalSplitters} splitters
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSearchModal(!showSearchModal)}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center font-bold text-lg"
              >
                🔍
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                disabled={isLoading}
                className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {showSearchModal && (
          <div
            ref={searchModalRef}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 w-72 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl p-4 z-50"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-100">Search</h2>
              <button
                onClick={() => {
                  setShowSearchModal(false)
                  setSearchQuery("")
                }}
                className="text-slate-400 hover:text-slate-200 text-xl"
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

        {/* Locations Grid */}
        <div>
          {isLoading ? (
            <div className="rounded-xl bg-slate-800 border border-slate-700 p-12 text-center shadow-sm">
              <p className="text-slate-400">Loading locations...</p>
            </div>
          ) : filteredLocations.length > 0 ? (
            <LocationList locations={filteredLocations} />
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
