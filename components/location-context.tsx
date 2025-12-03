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
  addLocation: (location: Location) => void
  updateLocation: (id: string, location: Location) => void
  deleteLocation: (id: string) => void
  addSplitterToLocation: (locationId: string, splitter: Splitter) => void
  updateSplitter: (locationId: string, splitterId: string, splitter: Splitter) => void
  deleteSplitter: (locationId: string, splitterId: string) => void
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

const INITIAL_DATA: Location[] = [

  {
    id: "1",
    name: "Argwings kodhek-Elgeyo Marakwet",
    splitters: [
      { id: "1-1", model: "Adhouse C650", port: "9/5" },
      { id: "1-2", model: "Adhouse C650", port: "3/4" },
    ],
  },
  {
    id: "2",
    name: "Methodist",
    splitters: [
      { id: "2-1", model: "Adhouse C650", port: "3/9" },
      { id: "2-2", model: "Adhouse C650", port: "4/1" },
      { id: "2-3", model: "Adhouse C650", port: "2/7" },
      { id: "2-4", model: "Adhouse 620 2", port: "2/1" },
      { id: "2-5", model: "Adhouse 620", port: "1/4" },
    ],
  },
  {
    id: "3",
    name: "Kirichwa-Ngaira Region",
    splitters: [
      { id: "3-1", model: "Adhouse C650", port: "7/16" },
      { id: "3-2", model: "Adhouse C650", port: "8/1" },
    ],
  },
  {
    id: "4",
    name: "Lavington security(Cab 15)",
    splitters: [
      { id: "4-1", model: "Adhs C650", port: "1/8", notes: "Black tape" },
      { id: "4-2", model: "Adhs C650", port: "3/7" },
      { id: "4-3", model: "Adhs C620 2", port: "1/9" },
    ],
  },
  {
    id: "5",
    name: "Lenana-Chaka",
    splitters: [
      { id: "5-1", model: "Adhs 650", port: "8/15" },
      { id: "5-2", model: "Adhs C650", port: "3/11" },
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
      { id: "7-1", model: "Adhs C650", port: "3/14" },
      { id: "7-2", model: "Adhs C650", port: "4/7" },
      { id: "7-3", model: "Adhs C620 2", port: "1/12" },
    ],
  },
  {
    id: "8",
    name: "Mbaazi-Kunde Road",
    splitters: [
      { id: "8-1", model: "Adhs C650", port: "7/8" },
      { id: "8-2", model: "Adhs C650", port: "4/6" },
    ],
  },
  {
    id: "9",
    name: "Lenana -Woodlands",
    splitters: [
      { id: "9-1", model: "Adhs C650", port: "7/14" },
      { id: "9-2", model: "Adhs C620 2", port: "2/9" },
    ],
  },
  {
    id: "10",
    name: "Kitanga Rd-Muthangari Rd",
    splitters: [
      { id: "10-1", model: "Adhs C650", port: "8/11" },
      { id: "10-2", model: "Adhs C650", port: "3/3" },
      { id: "10-3", model: "Adhs C650", port: "1/2" },
      { id: "10-4", model: "Adhs C620 2", port: "1/5" },
    ],
  },
  {
    id: "11",
    name: "Dennis Pritt-Citizen (Cab 17)",
    splitters: [
      { id: "11-1", model: "Adhs C620 1", port: "1/12" },
      { id: "11-2", model: "Adhs C650", port: "3/15" },
    ],
  },
  {
    id: "12",
    name: "Hendred Ave-White Knight Apt",
    splitters: [
      { id: "12-1", model: "Adhs C650", port: "4/4" },
      { id: "12-2", model: "Adhs C650", port: "9/12" },
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
      { id: "14-1", model: "Adhs C650", port: "4/5" },
      { id: "14-2", model: "Adhs C650", port: "7/7" },
    ],
  },
  {
    id: "15",
    name: "Lenana-Rose Avenue(Cab 1)",
    splitters: [
      { id: "15-1", model: "Adhs C650", port: "8/7", notes: "Black tape" },
      { id: "15-2", model: "Adhs C620 2", port: "1/1", notes: "Thin patch cord" },
      { id: "15-3", model: "Adhouse C650", port: "3/13" },
    ],
  },
  {
    id: "16",
    name: "Kasuku center-kileleshwa",
    splitters: [
      { id: "16-1", model: "Adhs C650", port: "7/3" },
      { id: "16-2", model: "Adhs C650", port: "4/8" },
      { id: "16-3", model: "Adhs C650", port: "4/14" },
      { id: "16-4", model: "Adhs C650", port: "2/12" },
    ],
  },
  {
    id: "17",
    name: "Dennis pritt-Nyangumi",
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
];



export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locations, setLocations] = useState<Location[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("splitter-locations")
    if (stored) {
      setLocations(JSON.parse(stored))
    } else {
      setLocations(INITIAL_DATA)
      localStorage.setItem("splitter-locations", JSON.stringify(INITIAL_DATA))
    }
  }, [])

  const saveLocations = (newLocations: Location[]) => {
    setLocations(newLocations)
    localStorage.setItem("splitter-locations", JSON.stringify(newLocations))
  }

  const addLocation = (location: Location) => {
    const newLocations = [...locations, location]
    saveLocations(newLocations)
  }

  const updateLocation = (id: string, updatedLocation: Location) => {
    const newLocations = locations.map((loc) => (loc.id === id ? updatedLocation : loc))
    saveLocations(newLocations)
  }

  const deleteLocation = (id: string) => {
    const newLocations = locations.filter((loc) => loc.id !== id)
    saveLocations(newLocations)
  }

  const addSplitterToLocation = (locationId: string, splitter: Splitter) => {
    const newLocations = locations.map((loc) =>
      loc.id === locationId ? { ...loc, splitters: [...loc.splitters, splitter] } : loc,
    )
    saveLocations(newLocations)
  }

  const updateSplitter = (locationId: string, splitterId: string, updatedSplitter: Splitter) => {
    const newLocations = locations.map((loc) =>
      loc.id === locationId
        ? {
            ...loc,
            splitters: loc.splitters.map((s) => (s.id === splitterId ? updatedSplitter : s)),
          }
        : loc,
    )
    saveLocations(newLocations)
  }

  const deleteSplitter = (locationId: string, splitterId: string) => {
    const newLocations = locations.map((loc) =>
      loc.id === locationId ? { ...loc, splitters: loc.splitters.filter((s) => s.id !== splitterId) } : loc,
    )
    saveLocations(newLocations)
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
