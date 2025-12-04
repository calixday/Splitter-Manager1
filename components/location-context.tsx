"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react"
import { supabase } from "@/lib/supabase/client"
import { v4 as uuidv4 } from "crypto-js"

export interface Splitter {
  id: string
  model: string
  port: string
  notes?: string
  location_id?: string
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
  isConnected: boolean
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

const STORAGE_KEY = "splitters_app_data"

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const subscriptionsRef = useRef<any[]>([])

  const fetchLocations = useCallback(async () => {
    try {
      const { data: locationsData, error: locationsError } = await supabase.from("locations").select("*").order("name")

      if (locationsError) throw locationsError

      if (locationsData && locationsData.length > 0) {
        const { data: splittersData, error: splittersError } = await supabase.from("splitters").select("*")

        if (splittersError) throw splittersError

        // Transform data structure: combine locations with their splitters
        const transformedLocations: Location[] = locationsData.map((loc: any) => ({
          id: loc.id,
          name: loc.name,
          splitters: (splittersData || [])
            .filter((s: any) => s.location_id === loc.id)
            .map((s: any) => ({
              id: s.id,
              model: s.model,
              port: s.port,
              notes: s.notes || "",
              location_id: s.location_id,
            })),
        }))

        setLocations(transformedLocations)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transformedLocations))
        console.log("[v0] Loaded from Supabase:", transformedLocations.length, "locations")
      }
    } catch (error) {
      console.error("[v0] Error fetching locations:", error)
    }
  }, [])

  const setupRealtimeSubscription = useCallback(() => {
    // Subscribe to locations table changes
    const locationsChannel = supabase
      .channel("locations_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "locations" }, (payload) => {
        console.log("[v0] Locations change detected:", payload.eventType)
        fetchLocations()
      })
      .subscribe((status) => {
        console.log("[v0] Locations subscription status:", status)
        if (status === "SUBSCRIBED") setIsConnected(true)
      })

    // Subscribe to splitters table changes
    const splittersChannel = supabase
      .channel("splitters_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "splitters" }, (payload) => {
        console.log("[v0] Splitters change detected:", payload.eventType)
        fetchLocations()
      })
      .subscribe((status) => {
        console.log("[v0] Splitters subscription status:", status)
      })

    subscriptionsRef.current = [locationsChannel, splittersChannel]

    return () => {
      locationsChannel.unsubscribe()
      splittersChannel.unsubscribe()
    }
  }, [fetchLocations])

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchLocations()
        setupRealtimeSubscription()
      } catch (error) {
        console.error("[v0] Initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initialize()

    // Cleanup subscriptions on unmount
    return () => {
      subscriptionsRef.current.forEach((channel) => channel?.unsubscribe())
    }
  }, [fetchLocations, setupRealtimeSubscription])

  // Generate UUIDs for new locations and splitters
  const addLocation = async (location: Location) => {
    try {
      const locationId = uuidv4() // Generate proper UUID
      const { error: locError } = await supabase.from("locations").insert({ id: locationId, name: location.name })

      if (locError) throw locError

      // Add splitters to Supabase
      if (location.splitters.length > 0) {
        const { error: splitterError } = await supabase.from("splitters").insert(
          location.splitters.map((s) => ({
            id: uuidv4(), // Generate proper UUID for each splitter
            location_id: locationId,
            model: s.model,
            port: s.port,
            notes: s.notes || "",
          })),
        )

        if (splitterError) throw splitterError
      }

      console.log("[v0] Location added to Supabase")
    } catch (error) {
      console.error("[v0] Error adding location:", error)
      throw error
    }
  }

  const updateLocation = async (id: string, updatedLocation: Location) => {
    try {
      const { error } = await supabase.from("locations").update({ name: updatedLocation.name }).eq("id", id)

      if (error) throw error

      console.log("[v0] Location updated in Supabase")
    } catch (error) {
      console.error("[v0] Error updating location:", error)
      throw error
    }
  }

  const deleteLocation = async (id: string) => {
    try {
      const { error } = await supabase.from("locations").delete().eq("id", id)

      if (error) throw error

      console.log("[v0] Location deleted from Supabase")
    } catch (error) {
      console.error("[v0] Error deleting location:", error)
      throw error
    }
  }

  const addSplitterToLocation = async (locationId: string, splitter: Splitter) => {
    try {
      const { error } = await supabase.from("splitters").insert({
        id: uuidv4(), // Generate proper UUID
        location_id: locationId,
        model: splitter.model,
        port: splitter.port,
        notes: splitter.notes || "",
      })

      if (error) throw error

      console.log("[v0] Splitter added to Supabase")
    } catch (error) {
      console.error("[v0] Error adding splitter:", error)
      throw error
    }
  }

  const updateSplitter = async (locationId: string, splitterId: string, updatedSplitter: Splitter) => {
    try {
      const { error } = await supabase
        .from("splitters")
        .update({
          model: updatedSplitter.model,
          port: updatedSplitter.port,
          notes: updatedSplitter.notes || "",
        })
        .eq("id", splitterId)

      if (error) throw error

      console.log("[v0] Splitter updated in Supabase")
    } catch (error) {
      console.error("[v0] Error updating splitter:", error)
      throw error
    }
  }

  const deleteSplitter = async (locationId: string, splitterId: string) => {
    try {
      const { error } = await supabase.from("splitters").delete().eq("id", splitterId)

      if (error) throw error

      console.log("[v0] Splitter deleted from Supabase")
    } catch (error) {
      console.error("[v0] Error deleting splitter:", error)
      throw error
    }
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
        isConnected,
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
