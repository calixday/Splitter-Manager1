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

    // Ensure format is correct (only one forward slash allowed)
    const slashCount = (newValue.match(/\//g) || []).length
    if (slashCount > 1) {
      newValue = newValue.replace(/\//g, "").slice(0, 2) + "/" + newValue.replace(/\//g, "").slice(2)
    }

    setSearchQuery(newValue)

    // Auto-hide keyboard after 3 seconds of inactivity
    keyboardTimeoutRef.current = setTimeout(() => {
      if (portInputRef.current) {
        portInputRef.current.blur()
      }
    }, 2000)
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

  return (
    <div className="space-y-2 w-full">
      {/* Search Type Buttons */}
      <div className="flex gap-3 w-full">
        <Button
          variant={searchType === "splitter" ? "default" : "outline"}
          onClick={() => {
            setSearchType("splitter")
            setSearchQuery("")
            setSelectedModel("")
          }}
          className="flex-1 py-3 h-auto text-sm sm:text-base font-semibold transition-all"
        >
          Splitter
        </Button>
        <Button
          variant={searchType === "location" ? "default" : "outline"}
          onClick={() => {
            setSearchType("location")
            setSearchQuery("")
            setSelectedModel("")
          }}
          className="flex-1 py-3 h-auto text-sm sm:text-base font-semibold transition-all"
        >
          Location
        </Button>
        <Button
          variant={searchType === "technician" ? "default" : "outline"}
          onClick={() => {
            setSearchType("technician")
            setSearchQuery("")
            setSelectedModel("")
          }}
          className="flex-1 py-3 h-auto text-sm sm:text-base font-semibold transition-all"
        >
          Technician
        </Button>
      </div>

      {/* Sample Splitter Models - Only show when Splitter tab is active */}
      {searchType === "splitter" && (
        <>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-200">Select Model:</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {SAMPLE_SPLITTER_MODELS.map((model) => (
                <button
                  key={model}
                  onClick={() => handleModelClick(model)}
                  className={`px-4 py-2.5 text-sm rounded-lg font-medium transition-all whitespace-nowrap flex-shrink-0 ${
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
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-200">Enter Port:</label>
              <div className="relative flex items-center w-full">
                <Input
                  ref={portInputRef}
                  placeholder="e.g., 2/12"
                  value={searchQuery}
                  onChange={handlePortChange}
                  inputMode="numeric"
                  maxLength={4}
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

      {/* Technician Selection */}
      {searchType === "technician" && (
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-slate-200">Select Technician:</label>
          <div className="flex gap-3 flex-wrap">
            {TECHNICIANS.map((tech) => (
              <button
                key={tech}
                onClick={() => setSearchQuery(tech)}
                className={`px-5 py-3 text-base rounded-lg font-semibold transition-all ${
                  searchQuery === tech
                    ? "bg-blue-600 text-white ring-2 ring-blue-400"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white border border-slate-600"
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      )}

      {searchType === "location" && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-200">Search Location:</label>
          <div className="relative flex items-center w-full">
            <Input
              placeholder="Enter location name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 text-sm sm:text-base rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8 min-h-12 sm:min-h-13"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-slate-400 hover:text-red-400 transition-colors active:scale-90"
                title="Clear"
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
