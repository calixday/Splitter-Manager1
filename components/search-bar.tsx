"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchType: "location" | "splitter" | "technician"
  setSearchType: (type: "location" | "splitter" | "technician") => void
}

const TECHNICIANS = ["ngaira", "kioko", "tum"]

export function SearchBar({ searchQuery, setSearchQuery, searchType, setSearchType }: SearchBarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value

    if (searchType === "splitter" && newValue.length > 0) {
      if (newValue.length === 1 && /^\d$/.test(newValue)) {
        newValue = newValue + "/"
      }
    }

    setSearchQuery(newValue)
  }

  const handleTechnicianSelect = (tech: string) => {
    setSearchQuery(tech)
  }

  const getPlaceholder = () => {
    if (searchType === "location") return "Search location..."
    if (searchType === "technician") return "Select technician..."
    return "Search splitter (e.g., 7/9)..."
  }

  return (
    <div className="space-y-2 w-full">
      {/* Search Type Buttons */}
      <div className="flex gap-1.5 w-full">
        <Button
          variant={searchType === "splitter" ? "default" : "outline"}
          onClick={() => {
            setSearchType("splitter")
            setSearchQuery("")
          }}
          size="sm"
          className="text-xs sm:text-xs flex-1 py-1.5 h-auto font-medium"
        >
          <span className="hidden sm:inline">Splitter</span>
          <span className="sm:hidden">Split</span>
        </Button>
        <Button
          variant={searchType === "location" ? "default" : "outline"}
          onClick={() => {
            setSearchType("location")
            setSearchQuery("")
          }}
          size="sm"
          className="text-xs sm:text-xs flex-1 py-1.5 h-auto font-medium"
        >
          <span className="hidden sm:inline">Location</span>
          <span className="sm:hidden">Loc</span>
        </Button>
        <Button
          variant={searchType === "technician" ? "default" : "outline"}
          onClick={() => {
            setSearchType("technician")
            setSearchQuery("")
          }}
          size="sm"
          className="text-xs sm:text-xs flex-1 py-1.5 h-auto font-medium"
        >
          <span className="hidden sm:inline">Technician</span>
          <span className="sm:hidden">Tech</span>
        </Button>
      </div>

      {/* Search Input - Technician Dropdown or Regular Input */}
      {searchType === "technician" ? (
        <div className="relative w-full">
          <select
            value={searchQuery}
            onChange={(e) => handleTechnicianSelect(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-10 sm:min-h-11 appearance-none cursor-pointer font-medium"
          >
            <option value="">Select a technician...</option>
            {TECHNICIANS.map((tech) => (
              <option key={tech} value={tech} className="bg-slate-700 text-white">
                {tech.charAt(0).toUpperCase() + tech.slice(1)}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            ▼
          </div>
        </div>
      ) : (
        <div className="relative flex items-center w-full">
          <Input
            placeholder={getPlaceholder()}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 min-h-10 sm:min-h-11"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 text-slate-400 hover:text-red-400 transition-colors active:scale-90"
              title="Clear"
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  )
}
