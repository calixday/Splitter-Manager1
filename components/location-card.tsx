"use client"

import { useState } from "react"
import { toast } from "sonner"
import type { Location } from "./location-context"
import { useLocations } from "./location-context"
import { AddSplitterModal } from "./add-splitter-modal"
import { EditSplitterModal } from "./edit-splitter-modal"
import { PasswordPromptModal } from "./password-prompt-modal"
import type { Splitter } from "./location-context"
import { LocationDetailsModal } from "./location-details-modal"

interface LocationCardProps {
  location: Location
  highlightQuery?: string
  highlightType?: "location" | "splitter" | "technician"
}

interface PasswordPromptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  itemName: string
}

export function LocationCard({ location, highlightQuery = "", highlightType = "splitter" }: LocationCardProps) {
  const { deleteLocation, deleteSplitter, updateLocation } = useLocations()
  const [showAddSplitter, setShowAddSplitter] = useState(false)
  const [editingSplitter, setEditingSplitter] = useState<Splitter | null>(null)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [editingLocation, setEditingLocation] = useState(false)
  const [locationName, setLocationName] = useState(location.name)
  const [deleteAction, setDeleteAction] = useState<{
    type: "location" | "splitter"
    locationId: string
    splitterId?: string
    itemName: string
  } | null>(null)
  const [showLocationDetails, setShowLocationDetails] = useState(false)

  // Check if location or any of its splitters match the search query
  const isLocationMatching = highlightQuery && highlightType === "location" && location.name.toLowerCase().includes(highlightQuery.toLowerCase())
  const isTechnicianMatching = highlightQuery && highlightType === "technician" && location.technician?.name.toLowerCase().includes(highlightQuery.toLowerCase())
  const matchingSplitters = highlightQuery && highlightType === "splitter" 
    ? location.splitters.filter(
        (splitter) =>
          splitter.model.toLowerCase().includes(highlightQuery.toLowerCase()) ||
          splitter.port.toLowerCase().includes(highlightQuery.toLowerCase())
      )
    : []
  const hasMatchingSplitters = matchingSplitters.length > 0
  const shouldHighlight = isLocationMatching || hasMatchingSplitters || isTechnicianMatching

  const handleDeleteLocation = () => {
    setDeleteAction({
      type: "location",
      locationId: location.id,
      itemName: location.name,
    })
    setShowPasswordPrompt(true)
  }

  const handleDeleteSplitter = (splitter: Splitter) => {
    setDeleteAction({
      type: "splitter",
      locationId: location.id,
      splitterId: splitter.id,
      itemName: `${splitter.model} - Port ${splitter.port}`,
    })
    setShowPasswordPrompt(true)
  }

  const handleEditLocation = async () => {
    if (locationName.trim() && locationName !== location.name) {
      try {
        await updateLocation(location.id, {
          id: location.id,
          name: locationName.trim(),
          splitters: location.splitters,
        })
        setEditingLocation(false)
        toast.success("Location updated successfully!")
      } catch (error) {
        toast.error("Failed to update location")
      }
    }
  }

  const handlePasswordConfirm = async () => {
    if (!deleteAction) return

    try {
      if (deleteAction.type === "location") {
        await deleteLocation(deleteAction.locationId)
        toast.success("Location deleted successfully!")
      } else if (deleteAction.type === "splitter" && deleteAction.splitterId) {
        await deleteSplitter(deleteAction.locationId, deleteAction.splitterId)
        toast.success("Splitter deleted successfully!")
      }
    } catch (error) {
      toast.error("Failed to delete item")
    }

    setDeleteAction(null)
  }

  const gradientColors = [
    "from-blue-600 to-cyan-500",
    "from-purple-600 to-pink-500",
    "from-emerald-600 to-teal-500",
    "from-orange-600 to-yellow-500",
    "from-rose-600 to-red-500",
    "from-indigo-600 to-blue-500",
    "from-green-600 to-emerald-500",
    "from-sky-600 to-cyan-500",
  ]

  const colorIndex = location.name.charCodeAt(0) % gradientColors.length
  const gradientClass = gradientColors[colorIndex]

  return (
    <>
      <div className={`rounded-lg bg-slate-800 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col h-full ${
        shouldHighlight 
          ? "border-2 border-red-500 shadow-red-500/30" 
          : "border border-slate-700"
      }`}>
        <div
          className={`border-b border-slate-700 bg-gradient-to-r ${gradientClass} p-2.5 sm:p-3 flex items-start justify-between gap-2 sm:gap-3`}
        >
          <div className="flex-1 min-w-0">
            {editingLocation ? (
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                onBlur={handleEditLocation}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEditLocation()
                  if (e.key === "Escape") setEditingLocation(false)
                }}
                className="w-full font-bold text-white text-xs sm:text-sm bg-slate-700 border border-slate-600 rounded px-2 py-1"
                autoFocus
              />
            ) : (
              <h3 className="font-bold text-white text-xs sm:text-sm break-words line-clamp-2">{location.name}</h3>
            )}
            <p className="text-xs text-slate-100 mt-0.5">{location.splitters.length} splitter(s)</p>
            {location.technician && (
              <p className={`text-xs mt-0.5 font-medium ${isTechnicianMatching ? "text-red-300 bg-red-500/20 px-1.5 py-0.5 rounded" : "text-yellow-200"}`}>
                {location.technician.name}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowLocationDetails(true)}
            className="text-white hover:text-slate-200 transition-colors flex-shrink-0 pt-0.5"
            title="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>

        <div className="p-2 space-y-1.5 flex-1 overflow-y-auto max-h-56">
          {location.splitters.length > 0 ? (
            location.splitters.map((splitter) => {
              const isSplitterMatching = matchingSplitters.some((s) => s.id === splitter.id)
              return (
                <div
                  key={splitter.id}
                  className={`rounded p-1.5 transition-colors ${
                    isSplitterMatching
                      ? "border border-red-500 bg-red-500/10"
                      : "border border-slate-700 bg-slate-700/50"
                  }`}
                >
                  <p className={`text-xs font-semibold break-words ${
                    isSplitterMatching ? "text-red-200" : "text-slate-100"
                  }`}>
                    {splitter.model}
                  </p>
                  <p className={`text-xs ${
                    isSplitterMatching ? "text-red-300" : "text-slate-400"
                  }`}>
                    {splitter.port}
                  </p>
                  {splitter.notes && <p className={`text-xs line-clamp-1 ${
                    isSplitterMatching ? "text-red-300" : "text-slate-400"
                  }`}>{splitter.notes}</p>}
                  {isSplitterMatching && location.technician && (
                    <p className="text-xs mt-1 font-bold text-yellow-300 bg-yellow-500/20 px-1.5 py-0.5 rounded inline-block">
                      {location.technician.name}
                    </p>
                  )}
                </div>
              )
            })
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">No splitters</p>
          )}
        </div>

      </div>

      {editingSplitter && (
        <EditSplitterModal
          open={!!editingSplitter}
          onOpenChange={(open) => !open && setEditingSplitter(null)}
          locationId={location.id}
          splitter={editingSplitter}
        />
      )}

      <PasswordPromptModal
        open={showPasswordPrompt}
        onOpenChange={setShowPasswordPrompt}
        onConfirm={handlePasswordConfirm}
        itemName={deleteAction?.itemName || ""}
      />

      <LocationDetailsModal open={showLocationDetails} onOpenChange={setShowLocationDetails} location={location} />
    </>
  )
}
