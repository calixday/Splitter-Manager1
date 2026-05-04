"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchType: "location" | "splitter" | "technician"
  setSearchType: (type: "location" | "splitter" | "technician") => void
  selectedModel?: string
  setSelectedModel?: (model: string) => void
}

const TECHNICIANS = ["NGAIRA", "KIOKO", "TUM"]
const SAMPLE_SPLITTER_MODELS = ["ADHS C650 1", "ADHS C650 2", "JT C650", "KAREN C650", "KAREN C620", "RUBIA C650", "NRB MILIMANI C650"]

export function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  searchType, 
  setSearchType,
  selectedModel: externalSelectedModel,
  setSelectedModel: externalSetSelectedModel
}: SearchBarProps) {
  const [internalSelectedModel, setInternalSelectedModel] = useState("")
  const selectedModel = externalSelectedModel ?? internalSelectedModel
  const setSelectedModel = externalSetSelectedModel ?? setInternalSelectedModel
  const portInputRef = useRef<HTMLInputElement>(null)
  const modelInputRef = useRef<HTMLInputElement>(null)
  const keyboardTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value

    // Clear existing timeout
    if (keyboardTimeoutRef.current) {
      clearTimeout(keyboardTimeoutRef.current)
    }

    // Auto-format: add "/" after first digit
    if (newValue.length === 1 && /^\d$/.test(newValue)) {
      newValue = newValue + "/"
    }

    // Only allow digits and forward slash
    newValue = newValue.replace(/[^0-9/]/g, "")

    // Ensure format is correct (digit/digit)
    if (newValue.length > 3) {
      newValue = newValue.slice(0, 3)
    }

    setSearchQuery(newValue)

    // Auto-hide keyboard after 3 seconds of inactivity
    keyboardTimeoutRef.current = setTimeout(() => {
      if (portInputRef.current) {
        portInputRef.current.blur()
      }
    }, 3000)
  }

  const handleModelClick = (model: string) => {
    if (selectedModel === model) {
      setSelectedModel("")
      setSearchQuery("")
    } else {
      setSelectedModel(model)
      setSearchQuery("")
      // Focus the port input after selecting a model
      setTimeout(() => {
        portInputRef.current?.focus()
      }, 0)
    }
  }

  // Auto-focus the model buttons on component mount when Splitter is active
  useEffect(() => {
    if (searchType === "splitter" && !selectedModel) {
      modelInputRef.current?.focus()
    }
  }, [searchType, selectedModel])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (keyboardTimeoutRef.current) {
        clearTimeout(keyboardTimeoutRef.current)
      }
    }
  }, [])

  const handleTechnicianSelect = (tech: string) => {
    setSearchQuery(tech)
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

      {/* Sample Splitter Models - Only show when Splitter tab is active */}
      {searchType === "splitter" && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-300">Select Model:</label>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {SAMPLE_SPLITTER_MODELS.map((model) => (
                <button
                  key={model}
                  onClick={() => handleModelClick(model)}
                  className={`px-3 py-2 text-xs rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    selectedModel === model
                      ? "bg-blue-600 text-white ring-2 ring-blue-400"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white border border-slate-600"
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>

          {/* Port Search Input - Only show when a model is selected */}
          {selectedModel && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-300">Enter Port:</label>
              <div className="relative flex items-center w-full">
                <Input
                  ref={portInputRef}
                  placeholder="e.g., 7/9"
                  value={searchQuery}
                  onChange={handlePortChange}
                  inputMode="numeric"
                  maxLength={3}
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
            </div>
          )}
        </>
      )}

      {/* Technician and Location Search */}
      {searchType === "technician" && (
        <div className="relative w-full">
          <select
            value={searchQuery}
            onChange={(e) => handleTechnicianSelect(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-10 sm:min-h-11 appearance-none cursor-pointer font-medium"
          >
            <option value="">Select a technician...</option>
            {TECHNICIANS.map((tech) => (
              <option key={tech} value={tech} className="bg-slate-700 text-white">
                {tech}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            ▼
          </div>
        </div>
      )}

      {searchType === "location" && (
        <div className="relative flex items-center w-full">
          <Input
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
