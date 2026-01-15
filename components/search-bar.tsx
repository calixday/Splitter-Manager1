"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchType: "location" | "splitter"
  setSearchType: (type: "location" | "splitter") => void
}

export function SearchBar({ searchQuery, setSearchQuery, searchType, setSearchType }: SearchBarProps) {
  return (
    <div className="flex flex-col gap-2 sm:gap-4">
      <div className="flex-1">
        <div className="relative">
          <Input
            placeholder={
              searchType === "location" ? "Search by location name..." : "Search by splitter model or port..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-3 sm:pl-4 text-xs sm:text-base h-8 sm:h-10"
          />
        </div>
      </div>
      <div className="flex gap-1 sm:gap-2 flex-wrap">
        <Button
          variant={searchType === "location" ? "default" : "outline"}
          onClick={() => setSearchType("location")}
          size="sm"
          className="text-xs sm:text-base"
        >
          By Location
        </Button>
        <Button
          variant={searchType === "splitter" ? "default" : "outline"}
          onClick={() => setSearchType("splitter")}
          size="sm"
          className="text-xs sm:text-base"
        >
          By Splitter
        </Button>
      </div>
    </div>
  )
}
