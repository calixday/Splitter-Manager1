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
    { bg: "from-blue-600 to-cyan-500", accent: "from-blue-500/20 to-cyan-500/20" },
    { bg: "from-purple-600 to-pink-500", accent: "from-purple-500/20 to-pink-500/20" },
    { bg: "from-emerald-600 to-teal-500", accent: "from-emerald-500/20 to-teal-500/20" },
    { bg: "from-orange-600 to-yellow-500", accent: "from-orange-500/20 to-yellow-500/20" },
    { bg: "from-rose-600 to-red-500", accent: "from-rose-500/20 to-red-500/20" },
    { bg: "from-indigo-600 to-blue-500", accent: "from-indigo-500/20 to-blue-500/20" },
    { bg: "from-green-600 to-emerald-500", accent: "from-green-500/20 to-emerald-500/20" },
    { bg: "from-sky-600 to-cyan-500", accent: "from-sky-500/20 to-cyan-500/20" },
  ]

  const colorIndex = location.name.charCodeAt(0) % gradientColors.length
  const { bg: gradientClass, accent: accentGradient } = gradientColors[colorIndex]

  return (
    <>
      <div className={`rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col h-full ${
        shouldHighlight 
          ? "border-2 border-red-500 shadow-red-500/50 ring-2 ring-red-500/20" 
          : "border border-slate-700"
      }`}>
        {/* Header with Gradient */}
        <div
          className={`relative border-b border-slate-700 bg-gradient-to-r ${gradientClass} p-3 sm:p-4 flex items-start justify-between gap-3 overflow-hidden`}
        >
          {/* Decorative background shapes */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-40 bg-white"></div>
          </div>
          
          <div className="flex-1 min-w-0 relative z-10">
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
                className="w-full font-bold text-white text-sm sm:text-base bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5"
                autoFocus
              />
            ) : (
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base break-words line-clamp-2">{location.name}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.5 1.5H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V8.75m-9-3v3m3-3v3m-8 0h10" stroke="white" strokeWidth="0.5" fill="none"/>
                    </svg>
                    {location.splitters.length}
                  </span>
                  {location.technician && (
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      isTechnicianMatching 
                        ? "bg-red-500/40 text-red-100 ring-1 ring-red-400/50" 
                        : "bg-white/20 text-white"
                    }`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                      {location.technician.name.charAt(0).toUpperCase() + location.technician.name.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowLocationDetails(true)}
            className="text-white hover:text-slate-100 transition-colors flex-shrink-0 relative z-10 hover:bg-white/20 rounded-lg p-1.5"
            title="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className={`p-3 sm:p-4 space-y-2 flex-1 overflow-y-auto max-h-56 bg-gradient-to-b ${accentGradient}`}>
          {location.splitters.length > 0 ? (
            location.splitters.map((splitter) => {
              const isSplitterMatching = matchingSplitters.some((s) => s.id === splitter.id)
              return (
                <div
                  key={splitter.id}
                  className={`rounded-lg p-2.5 transition-all backdrop-blur-sm ${
                    isSplitterMatching
                      ? "border border-red-500/50 bg-red-500/15 ring-1 ring-red-500/30 shadow-md shadow-red-500/20"
                      : "border border-slate-600/50 bg-slate-700/40 hover:bg-slate-700/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className={`text-xs font-bold break-words mb-1 ${
                        isSplitterMatching ? "text-red-200" : "text-slate-50"
                      }`}>
                        {splitter.model}
                      </p>
                      <div className="flex items-center gap-2">
                        <svg className="w-3 h-3 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.5 1.5h-1m0 0H5.75A2.25 2.25 0 003.5 3.75v12.5A2.25 2.25 0 005.75 18.5h8.5a2.25 2.25 0 002.25-2.25V8.75m-9-3v3" stroke="currentColor" strokeWidth="1" fill="none"/>
                        </svg>
                        <p className={`text-xs font-semibold ${
                          isSplitterMatching ? "text-red-300" : "text-slate-300"
                        }`}>
                          {splitter.port}
                        </p>
                      </div>
                    </div>
                    {isSplitterMatching && (
                      <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                    )}
                  </div>
                  {splitter.notes && (
                    <p className={`text-xs line-clamp-1 mt-1.5 pl-5 border-l-2 ${
                      isSplitterMatching ? "border-red-400/40 text-red-300/70" : "border-slate-600/40 text-slate-400"
                    }`}>
                      {splitter.notes}
                    </p>
                  )}
                </div>
              )
            })
          ) : (
            <div className="text-center py-8">
              <svg className="w-10 h-10 mx-auto text-slate-600/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10m0-10l8-4"/>
              </svg>
              <p className="text-xs text-slate-400 font-medium">No splitters yet</p>
            </div>
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
