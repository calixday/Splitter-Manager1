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
    let value = e.target.value

    if (searchType === "splitter" && value.length > 0) {
      const parts = value.split("/")
      // Only auto-add slash if: has one part (no slash yet), is all digits, and last char is a digit
      if (parts.length === 1 && /^\d+$/.test(value)) {
        value = value + "/"
      }
    }

    setSearchQuery(value)
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          placeholder={searchType === "location" ? "Search location..." : "Search splitter (e.g., 7/9)..."}
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 text-xs rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
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
