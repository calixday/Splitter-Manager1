"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

export interface Splitter {
  id: string
  model: string
  port: string
  notes?: string
  location_id?: string
}

export interface Technician {
  id: string
  name: string
}

export interface Location {
  id: string
  name: string
  splitters: Splitter[]
  technician_id?: string
  technician?: Technician
}

interface LocationContextType {
  locations: Location[]
  technicians: Technician[]
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

function generateUUID(): string {
  return crypto.randomUUID()
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [locations, setLocations] = useState<Location[]>([])
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const subscriptionsRef = useRef<any[]>([])

  const fetchLocations = useCallback(async () => {
    try {
      // Fetch technicians
      const { data: techniciansData, error: techError } = await supabase.from("technicians").select("*").order("name")
      
      // If technicians table doesn't exist, initialize with sample data
      if (techError?.code === "PGRST116" || techError?.message?.includes("Could not find the table")) {
        const fallbackTechnicians = [
          { id: "1", name: "ngaira" },
          { id: "2", name: "kioko" },
          { id: "3", name: "tum" },
        ]
        setTechnicians(fallbackTechnicians)
      } else if (techError) {
        console.error("Error fetching technicians:", techError)
        setTechnicians([])
      } else {
        setTechnicians(techniciansData || [])
      }
      
      const { data: locationsData, error: locError } = await supabase.from("locations").select("*").order("name")
      if (locError) throw locError

      if (locationsData && locationsData.length > 0) {
        const { data: splitters, error: splittersError } = await supabase.from("splitters").select("*")
        if (splittersError) throw splittersError
        const splittersData = splitters || []

        // Get current technicians list (either from database or fallback)
        const currentTechnicians = techniciansData || [
          { id: "1", name: "ngaira" },
          { id: "2", name: "kioko" },
          { id: "3", name: "tum" },
        ]

        const transformedLocations: Location[] = locationsData.map((loc: any) => {
          // Get splitters for this location
          const locationSplitters = splittersData.filter((s: any) => s.location_id === loc.id)
          
          // Determine technician from splitters' technician field, or from location's technician_id, or default to ngaira
          let assignedTechnician = null
          
          if (locationSplitters.length > 0 && locationSplitters[0].technician) {
            // Get technician name from first splitter (all splitters in a location should have same technician)
            const technicianName = locationSplitters[0].technician
            // Find the technician object by name
            assignedTechnician = currentTechnicians.find((t: any) => t.name.toLowerCase() === technicianName.toLowerCase())
          } else if (loc.technician_id) {
            // Fallback to technician_id if available
            assignedTechnician = currentTechnicians.find((t: any) => t.id === loc.technician_id)
          } else {
            // Default to ngaira
            assignedTechnician = currentTechnicians.find((t: any) => t.id === "1" || t.name.toLowerCase() === "ngaira")
          }
          
          return {
            id: loc.id,
            name: loc.name,
            notes: loc.notes,
            technician_id: assignedTechnician?.id,
            technician: assignedTechnician,
            splitters: locationSplitters.map((s: any) => ({
              id: s.id,
              model: s.model,
              port: s.port,
              notes: s.notes || "",
              location_id: s.location_id,
            })),
          }
        })

        setLocations(transformedLocations)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transformedLocations))

        // Update all locations in database to have ngaira (id: "1") as technician if not already assigned
        if (techError?.code === "PGRST116") {
          for (const loc of locationsData) {
            if (!loc.technician_id) {
              await supabase
                .from("locations")
                .update({ technician_id: "1" })
                .eq("id", loc.id)
            }
          }
        }
      } else {
        setLocations([])
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
      }
    } catch (error) {
      console.error("Error fetching locations:", error)
      setLocations([])
    }
  }, [])

  const setupRealtimeSubscription = useCallback(() => {
    // Subscribe to locations table changes
    const locationsChannel = supabase
      .channel("locations_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "locations" }, () => {
        // Re-fetch locations when data changes
        fetchLocations()
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") setIsConnected(true)
      })

    // Subscribe to splitters table changes
    const splittersChannel = supabase
      .channel("splitters_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "splitters" }, () => {
        // Re-fetch locations when splitters change
        fetchLocations()
      })
      .subscribe()

    subscriptionsRef.current = [locationsChannel, splittersChannel]

    return () => {
      locationsChannel.unsubscribe()
      splittersChannel.unsubscribe()
    }
  }, []) // Empty dependency array - we'll handle fetchLocations differently

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchLocations()
        const cleanup = setupRealtimeSubscription()
        // Store cleanup function for later
        return cleanup
      } catch (error) {
        console.error("Initialization error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    let cleanupFn: (() => void) | undefined
    initialize().then((fn) => {
      cleanupFn = fn
    })

    // Cleanup subscriptions on unmount
    return () => {
      cleanupFn?.()
      subscriptionsRef.current.forEach((channel) => channel?.unsubscribe())
    }
  }, [fetchLocations, setupRealtimeSubscription])

  const addLocation = async (location: Location) => {
    try {
      const locationId = generateUUID()
      console.log("[v0] Adding location:", { locationId, name: location.name, splitterCount: location.splitters.length })
      
      const { error: locError } = await supabase.from("locations").insert({
        id: locationId,
        name: location.name,
        // Note: technician_id column may not exist in older databases
        // Technician is determined from splitters instead
      })

      if (locError) {
        console.error("[v0] Location insert error:", locError)
        throw locError
      }
      console.log("[v0] Location inserted successfully")

      if (location.splitters.length > 0) {
        console.log("[v0] Inserting splitters with technician assignment...")
        
        // Get the selected technician name from the technician_id
        const selectedTechnician = technicians.find((t) => t.id === location.technician_id)
        const technicianName = selectedTechnician?.name || "ngaira"
        console.log("[v0] Using technician:", technicianName)
        
        const { error: splitterError } = await supabase.from("splitters").insert(
          location.splitters.map((s) => ({
            id: generateUUID(),
            location_id: locationId,
            model: s.model,
            port: s.port,
            notes: s.notes || "",
            technician: technicianName, // Use selected technician
          })),
        )

        if (splitterError) {
          console.error("[v0] Splitter insert error:", splitterError)
          throw splitterError
        }
        console.log("[v0] Splitters inserted successfully with technician:", technicianName)
      }

      // Refetch locations to update the UI
      console.log("[v0] Refetching locations...")
      await fetchLocations()
      console.log("[v0] Location added successfully!")
    } catch (error) {
      console.error("[v0] Error adding location:", error)
      throw error
    }
  }

  const updateLocation = async (id: string, updatedLocation: Location) => {
    try {
      console.log("[v0] Updating location:", { id, name: updatedLocation.name })
      
      const { error } = await supabase
        .from("locations")
        .update({ 
          name: updatedLocation.name,
          // Note: technician_id column may not exist in older databases
          // Technician is determined from splitters instead
        })
        .eq("id", id)

      if (error) {
        console.error("[v0] Location update error:", error)
        throw error
      }
      console.log("[v0] Location updated successfully")

      // Refetch locations to update the UI
      console.log("[v0] Refetching locations...")
      await fetchLocations()
    } catch (error) {
      console.error("[v0] Error updating location:", error)
      throw error
    }
  }

  const deleteLocation = async (id: string) => {
    try {
      const { error } = await supabase.from("locations").delete().eq("id", id)

      if (error) throw error

      // Refetch locations to update the UI
      await fetchLocations()
    } catch (error) {
      console.error("[v0] Error deleting location:", error)
      throw error
    }
  }

  const addSplitterToLocation = async (locationId: string, splitter: Splitter) => {
    try {
      // Find the location to get its current technician
      const location = locations.find(l => l.id === locationId)
      const technicianName = location?.technician?.name || "ngaira"
      
      console.log("[v0] Adding splitter to location:", locationId, "with technician:", technicianName)
      
      const { error } = await supabase.from("splitters").insert({
        id: generateUUID(),
        location_id: locationId,
        model: splitter.model,
        port: splitter.port,
        notes: splitter.notes || "",
        technician: technicianName, // Preserve the technician assignment
      })

      if (error) {
        console.error("[v0] Splitter insert error:", error)
        throw error
      }

      console.log("[v0] Splitter added successfully")
      // Refetch locations to update the UI
      await fetchLocations()
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

      // Refetch locations to update the UI
      await fetchLocations()
    } catch (error) {
      console.error("[v0] Error updating splitter:", error)
      throw error
    }
  }

  const deleteSplitter = async (locationId: string, splitterId: string) => {
    try {
      const { error } = await supabase.from("splitters").delete().eq("id", splitterId)

      if (error) throw error

      // Refetch locations to update the UI
      await fetchLocations()
    } catch (error) {
      console.error("[v0] Error deleting splitter:", error)
      throw error
    }
  }

  return (
    <LocationContext.Provider
      value={{
        locations,
        technicians,
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
