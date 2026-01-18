"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchType: "location" | "splitter"
  setSearchType: (type: "location" | "splitter") => void
}

export function SearchBar({ searchQuery, setSearchQuery, searchType, setSearchType }: SearchBarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value

    if (searchType === "splitter" && newValue.length > 0) {
      // Auto-add "/" after first digit immediately
      if (newValue.length === 1 && /^\d$/.test(newValue)) {
        newValue = newValue + "/"
      } else if (newValue.length === 2 && /^\d\/$/.test(newValue)) {
        // Already has "/" - allow typing the second digit
        // This is fine as is
      }
    }

    setSearchQuery(newValue)
  }

  return (
    <div className="space-y-2">
      <div className="relative flex items-center">
        <Input
          placeholder={searchType === "location" ? "Search location..." : "Search splitter (e.g., 7/9)..."}
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 text-xs rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          autoFocus
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 text-slate-400 hover:text-red-400 transition-colors text-lg"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant={searchType === "splitter" ? "default" : "outline"}
          onClick={() => setSearchType("splitter")}
          size="sm"
          className="text-xs flex-1 py-1 h-auto"
        >
          Splitter
        </Button>
        <Button
          variant={searchType === "location" ? "default" : "outline"}
          onClick={() => setSearchType("location")}
          size="sm"
          className="text-xs flex-1 py-1 h-auto"
        >
          Location
        </Button>
      </div>
    </div>
  )
}
