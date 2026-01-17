"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react"
import { supabase } from "@/lib/supabase/client"

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
  team_id?: string
  notes?: string
  splitters: Splitter[]
}

interface LocationContextType {
  locations: Location[]
  selectedTeamId: string
  setSelectedTeamId: (teamId: string) => void
  addLocation: (location: Location, teamId: string) => Promise<void>
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

function generateUUID(): string {
  return crypto.randomUUID()
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<string>("")
  const [teamNgairaId, setTeamNgairaId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const subscriptionsRef = useRef<any[]>([])

  useEffect(() => {
    const fetchDefaultTeam = async () => {
      try {
        const { data, error } = await supabase.from("teams").select("id").eq("name", "Team Ngaira").single()
        if (error) throw error
        if (data?.id) {
          setTeamNgairaId(data.id)
          setSelectedTeamId(data.id)
        }
      } catch (error) {
        console.error("[v0] Error fetching default team:", error)
      }
    }
    fetchDefaultTeam()
  }, [])

  const fetchLocations = useCallback(
    async (teamId?: string) => {
      try {
        const query = supabase.from("locations").select("*").order("name")

        let locationsData: any[] = []
        let splittersData: any[] = []

        const activeTeamId = teamId || selectedTeamId
        if (activeTeamId) {
          const { data, error } = await query.eq("team_id", activeTeamId)
          if (error) throw error
          locationsData = data || []
        } else {
          const { data, error } = await query
          if (error) throw error
          locationsData = data || []
        }

        if (locationsData && locationsData.length > 0) {
          const { data: splitters, error: splittersError } = await supabase.from("splitters").select("*")
          if (splittersError) throw splittersError
          splittersData = splitters || []

          const transformedLocations: Location[] = locationsData.map((loc: any) => ({
            id: loc.id,
            name: loc.name,
            team_id: loc.team_id,
            notes: loc.notes,
            splitters: splittersData
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
        }
      } catch (error) {
        console.error("[v0] Error fetching locations:", error)
      }
    },
    [selectedTeamId],
  )

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
        if (selectedTeamId) {
          await fetchLocations(selectedTeamId)
        }
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
  }, [fetchLocations, setupRealtimeSubscription, selectedTeamId])

  useEffect(() => {
    if (selectedTeamId) {
      fetchLocations(selectedTeamId)
    }
  }, [selectedTeamId, fetchLocations])

  const addLocation = async (location: Location, teamId: string) => {
    try {
      const locationId = generateUUID()
      const { error: locError } = await supabase.from("locations").insert({
        id: locationId,
        name: location.name,
        team_id: teamId,
        notes: location.notes || "",
      })

      if (locError) throw locError

      if (location.splitters.length > 0) {
        const { error: splitterError } = await supabase.from("splitters").insert(
          location.splitters.map((s) => ({
            id: generateUUID(),
            location_id: locationId,
            model: s.model,
            port: s.port,
            notes: s.notes || "",
          })),
        )

        if (splitterError) throw splitterError
      }

      console.log("[v0] Location added to Supabase with team_id")
    } catch (error) {
      console.error("[v0] Error adding location:", error)
      throw error
    }
  }

  const updateLocation = async (id: string, updatedLocation: Location) => {
    try {
      const { error } = await supabase
        .from("locations")
        .update({ name: updatedLocation.name, notes: updatedLocation.notes || "" })
        .eq("id", id)

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
        id: generateUUID(),
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
        selectedTeamId,
        setSelectedTeamId,
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
  if (context === undefined) {
    throw new Error("useLocations must be used within a LocationProvider")
  }
  return context
}
