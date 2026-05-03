"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"
import { useLocations } from "./location-context"

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchType: "location" | "splitter" | "technician"
  setSearchType: (type: "location" | "splitter" | "technician") => void
}

const TECHNICIANS = ["ngaira", "kioko", "tum"]

export function SearchBar({ searchQuery, setSearchQuery, searchType, setSearchType }: SearchBarProps) {
  const { locations } = useLocations()
  const [selectedModel, setSelectedModel] = useState("")

  // Extract all unique splitter models from locations
  const splitterModels = useMemo(() => {
    const models = new Set<string>()
    locations.forEach((location) => {
      location.splitters.forEach((splitter) => {
        models.add(splitter.model)
      })
    })
    return Array.from(models).sort()
  }, [locations])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value

    if (searchType === "splitter" && selectedModel && newValue.length > 0) {
      if (newValue.length === 1 && /^\d$/.test(newValue)) {
        newValue = newValue + "/"
      }
    }

    setSearchQuery(newValue)
  }

  const handleModelSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const model = e.target.value
    setSelectedModel(model)
    setSearchQuery("") // Reset port search when model changes
  }

  const handleTechnicianSelect = (tech: string) => {
    setSearchQuery(tech)
  }

  const getPlaceholder = () => {
    if (searchType === "location") return "Search location..."
    if (searchType === "technician") return "Select technician..."
    if (searchType === "splitter" && selectedModel) return `Search ${selectedModel} port (e.g., 7/9)...`
    return "Select a splitter model first..."
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
            setSelectedModel("")
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
            setSelectedModel("")
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
            setSelectedModel("")
          }}
          size="sm"
          className="text-xs sm:text-xs flex-1 py-1.5 h-auto font-medium"
        >
          <span className="hidden sm:inline">Technician</span>
          <span className="sm:hidden">Tech</span>
        </Button>
      </div>

      {/* Splitter Search: Two-Step Selection */}
      {searchType === "splitter" ? (
        <div className="space-y-2">
          {/* Step 1: Select Splitter Model */}
          <div className="relative w-full">
            <select
              value={selectedModel}
              onChange={handleModelSelect}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-10 sm:min-h-11 appearance-none cursor-pointer font-medium"
            >
              <option value="">Select splitter model...</option>
              {splitterModels.map((model) => (
                <option key={model} value={model} className="bg-slate-700 text-white">
                  {model}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              ▼
            </div>
          </div>

          {/* Step 2: Search by Port (only if model is selected) */}
          {selectedModel && (
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
      ) : searchType === "technician" ? (
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
