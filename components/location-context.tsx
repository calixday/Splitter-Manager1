"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Splitter {
  id: string
  model: string
  port: string
  notes?: string
}

export interface Location {
  id: string
  name: string
  splitters: Splitter[]
}

interface LocationContextType {
  locations: Location[]
  addLocation: (location: Location) => Promise<void>
  updateLocation: (id: string, location: Location) => Promise<void>
  deleteLocation: (id: string) => Promise<void>
  addSplitterToLocation: (locationId: string, splitter: Splitter) => Promise<void>
  updateSplitter: (locationId: string, splitterId: string, splitter: Splitter) => Promise<void>
  deleteSplitter: (locationId: string, splitterId: string) => Promise<void>
  isLoading: boolean
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

const STORAGE_KEY = "splitters_app_data"
const VERSION_KEY = "splitters_app_version"
const DATA_VERSION_KEY = "splitters_app_data_version"
const CURRENT_DATA_VERSION = 2 // Increment this to clear stale cache

const INITIAL_DATA: Location[] = [
  {
    id: "1",
    name: "Argwings kodhek-Elgeyo Marakwet",
    splitters: [
      { id: "1-1", model: "Adhouse C650", port: "9/5", notes: "" },
      { id: "1-2", model: "Adhouse C650", port: "3/4", notes: "" },
    ],
  },
  {
    id: "2",
    name: "Methodist",
    splitters: [
      { id: "2-1", model: "Adhouse C650", port: "3/9", notes: "" },
      { id: "2-2", model: "Adhouse C650", port: "4/1", notes: "" },
      { id: "2-3", model: "Adhouse C650", port: "2/7", notes: "" },
      { id: "2-4", model: "Adhouse 620 2", port: "2/1", notes: "" },
      { id: "2-5", model: "Adhouse 620", port: "1/4", notes: "" },
    ],
  },
  {
    id: "3",
    name: "Kirichwa-Ngaira Region",
    splitters: [
      { id: "3-1", model: "Adhouse C650", port: "7/16", notes: "" },
      { id: "3-2", model: "Adhouse C650", port: "8/1", notes: "" },
    ],
  },
  {
    id: "4",
    name: "Lavington security(Cab 15)",
    splitters: [
      { id: "4-1", model: "Adhs C650", port: "1/8", notes: "Black tape" },
      { id: "4-2", model: "Adhs C650", port: "3/7", notes: "" },
      { id: "4-3", model: "Adhs C620 2", port: "1/9", notes: "" },
    ],
  },
  {
    id: "5",
    name: "Lenana-Chaka",
    splitters: [
      { id: "5-1", model: "Adhs 650", port: "8/15", notes: "" },
      { id: "5-2", model: "Adhs C650", port: "3/11", notes: "" },
      { id: "5-3", model: "Adhs C620 2", port: "2/2", notes: "Thin patch cord" },
    ],
  },
  {
    id: "6",
    name: "Chaka-Tigoni",
    splitters: [
      { id: "6-1", model: "Adhs 620 2", port: "1/2", notes: "dark blue patch cord" },
      { id: "6-2", model: "Adhs 650", port: "3/10", notes: "White tape" },
      { id: "6-3", model: "Adhs 620 1", port: "1/15", notes: "light blue patch cord" },
    ],
  },
  {
    id: "7",
    name: "Dennis pritt - Woodlands",
    splitters: [
      { id: "7-1", model: "Adhs C650", port: "3/14", notes: "" },
      { id: "7-2", model: "Adhs C650", port: "4/7", notes: "" },
      { id: "7-3", model: "Adhs C620 2", port: "1/12", notes: "" },
    ],
  },
  {
    id: "8",
    name: "Mbaazi-Kunde Road",
    splitters: [
      { id: "8-1", model: "Adhs C650", port: "7/8", notes: "" },
      { id: "8-2", model: "Adhs C650", port: "4/6", notes: "" },
    ],
  },
  {
    id: "9",
    name: "Lenana -Woodlands",
    splitters: [
      { id: "9-1", model: "Adhs C650", port: "7/14", notes: "" },
      { id: "9-2", model: "Adhs C620 2", port: "2/9", notes: "" },
    ],
  },
  {
    id: "10",
    name: "Kitanga Rd-Muthangari Rd",
    splitters: [
      { id: "10-1", model: "Adhs C650", port: "8/11", notes: "" },
      { id: "10-2", model: "Adhs C650", port: "3/3", notes: "" },
      { id: "10-3", model: "Adhs C650", port: "1/2", notes: "" },
      { id: "10-4", model: "Adhs C620 2", port: "1/5", notes: "" },
    ],
  },
  {
    id: "11",
    name: "Dennis Pritt-Citizen (Cab 17)",
    splitters: [
      { id: "11-1", model: "Adhs C620 1", port: "1/12", notes: "" },
      { id: "11-2", model: "Adhs C650", port: "3/15", notes: "" },
    ],
  },
  {
    id: "12",
    name: "Hendred Ave-White Knight Apt",
    splitters: [
      { id: "12-1", model: "Adhs C650", port: "4/4", notes: "" },
      { id: "12-2", model: "Adhs C650", port: "9/12", notes: "" },
    ],
  },
  {
    id: "13",
    name: "Hurlinghum-Shell(CAB 5)",
    splitters: [
      { id: "13-1", model: "JT C650", port: "2/9", notes: "Thin patch cords" },
      { id: "13-2", model: "Adhs C650", port: "3/16", notes: "green paints" },
      { id: "13-3", model: "Adhs C620 1", port: "2/16", notes: "black tape" },
      { id: "13-4", model: "Adhs C620 1", port: "1/8", notes: "yellow patch cord" },
    ],
  },
  {
    id: "14",
    name: "Msanduku",
    splitters: [
      { id: "14-1", model: "Adhs C650", port: "4/5", notes: "" },
      { id: "14-2", model: "Adhs C650", port: "7/7", notes: "" },
    ],
  },
  {
    id: "15",
    name: "Lenana-Rose Avenue(Cab 1)",
    splitters: [
      { id: "15-1", model: "Adhs C650", port: "8/7", notes: "Black tape" },
      { id: "15-2", model: "Adhs C620 2", port: "1/1", notes: "Thin patch cord" },
      { id: "15-3", model: "Adhouse C650", port: "3/13", notes: "" },
    ],
  },
  {
    id: "16",
    name: "Kasuku center-kileleshwa",
    splitters: [
      { id: "16-1", model: "Adhs C650", port: "7/3", notes: "" },
      { id: "16-2", model: "Adhs C650", port: "4/8", notes: "" },
      { id: "16-3", model: "Adhs C650", port: "4/14", notes: "" },
      { id: "16-4", model: "Adhs C650", port: "2/12", notes: "" },
    ],
  },
  {
    id: "17",
    name: "Dennis spritt-Nyangumi",
    splitters: [
      { id: "17-1", model: "Adhouse C650", port: "9/6", notes: "Thin patch cord" },
      { id: "17-2", model: "Adhouse C650", port: "3/12", notes: "Yellow Patch cord" },
    ],
  },
  {
    id: "18",
    name: "Dhanjay",
    splitters: [
      { id: "18-1", model: "Adhouse C650", port: "1/1", notes: "Yellow Patch cord" },
      { id: "18-2", model: "Adhouse C650", port: "4/11", notes: "Thin Patch cord" },
    ],
  },
  {
    id: "19",
    name: "James Gichuru",
    splitters: [
      { id: "19-1", model: "Adhouse C650", port: "2/5", notes: "Yellow Patch cord" },
      { id: "19-2", model: "Adhouse C620 1", port: "1/14", notes: "Thin Patch cord" },
    ],
  },
]

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastVersion, setLastVersion] = useState(0)

  useEffect(() => {
    const initialize = () => {
      try {
        const storedDataVersion = localStorage.getItem(DATA_VERSION_KEY)
        const needsReset = !storedDataVersion || Number.parseInt(storedDataVersion) < CURRENT_DATA_VERSION

        if (needsReset) {
          // Clear old data and use fresh INITIAL_DATA
          localStorage.removeItem(STORAGE_KEY)
          localStorage.removeItem(VERSION_KEY)
          localStorage.setItem(DATA_VERSION_KEY, CURRENT_DATA_VERSION.toString())
          console.log("[v0] Cache cleared - loading fresh data")
        }

        // Load stored data
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const data = JSON.parse(stored)
          setLocations(data)
          console.log("[v0] Loaded data from localStorage")
        } else {
          // Initialize with default data
          localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA))
          setLocations(INITIAL_DATA)
          console.log("[v0] Initialized with default data")
        }

        setIsLoading(false)
      } catch (error) {
        console.error("[v0] Error initializing:", error)
        setLocations(INITIAL_DATA)
        setIsLoading(false)
      }
    }

    initialize()

    const pollInterval = setInterval(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const version = localStorage.getItem(VERSION_KEY) || "0"
        const currentVersion = Number.parseInt(version)

        if (currentVersion > lastVersion && stored) {
          const data = JSON.parse(stored)
          setLocations(data)
          setLastVersion(currentVersion)
          console.log("[v0] Synced data from another device/tab")
        }
      } catch (error) {
        console.error("[v0] Polling error:", error)
      }
    }, 3000)

    return () => clearInterval(pollInterval)
  }, [lastVersion])

  const saveToStorage = (data: Location[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    const newVersion = (lastVersion + 1).toString()
    localStorage.setItem(VERSION_KEY, newVersion)
    setLastVersion(Number.parseInt(newVersion))
    setLocations(data)
    console.log("[v0] Data saved and broadcasted to all devices")
  }

  const addLocation = async (location: Location) => {
    const updated = [...locations, location]
    saveToStorage(updated)
  }

  const deleteLocation = async (id: string) => {
    const updated = locations.filter((loc) => loc.id !== id)
    saveToStorage(updated)
  }

  const addSplitterToLocation = async (locationId: string, splitter: Splitter) => {
    const updated = locations.map((loc) =>
      loc.id === locationId ? { ...loc, splitters: [...loc.splitters, splitter] } : loc,
    )
    saveToStorage(updated)
  }

  const updateSplitter = async (locationId: string, splitterId: string, updatedSplitter: Splitter) => {
    const updated = locations.map((loc) =>
      loc.id === locationId
        ? {
            ...loc,
            splitters: loc.splitters.map((s) => (s.id === splitterId ? updatedSplitter : s)),
          }
        : loc,
    )
    saveToStorage(updated)
  }

  const deleteSplitter = async (locationId: string, splitterId: string) => {
    const updated = locations.map((loc) =>
      loc.id === locationId ? { ...loc, splitters: loc.splitters.filter((s) => s.id !== splitterId) } : loc,
    )
    saveToStorage(updated)
  }

  const updateLocation = async (id: string, updatedLocation: Location) => {
    const updated = locations.map((loc) => (loc.id === id ? updatedLocation : loc))
    saveToStorage(updated)
  }

  return (
    <LocationContext.Provider
      value={{
        locations,
        addLocation,
        updateLocation,
        deleteLocation,
        addSplitterToLocation,
        updateSplitter,
        deleteSplitter,
        isLoading,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useLocations() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error("useLocations must be used within LocationProvider")
  }
  return context
}
