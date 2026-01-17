"use client"

import { useState } from "react"
import type { Location } from "./location-context"
import { useLocations } from "./location-context"
import { AddSplitterModal } from "./add-splitter-modal"
import { EditSplitterModal } from "./edit-splitter-modal"
import { PasswordPromptModal } from "./password-prompt-modal"
import type { Splitter } from "./location-context"
import { LocationDetailsModal } from "./location-details-modal"

interface LocationCardProps {
  location: Location
}

interface PasswordPromptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  itemName: string
}

export function LocationCard({ location }: LocationCardProps) {
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
      await updateLocation(location.id, {
        name: locationName.trim(),
        notes: location.notes,
      })
      setEditingLocation(false)
    }
  }

  const handlePasswordConfirm = () => {
    if (!deleteAction) return

    if (deleteAction.type === "location") {
      deleteLocation(deleteAction.locationId)
    } else if (deleteAction.type === "splitter" && deleteAction.splitterId) {
      deleteSplitter(deleteAction.locationId, deleteAction.splitterId)
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
      <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full">
        <div
          className={`border-b border-slate-700 bg-gradient-to-r ${gradientClass} p-4 flex items-start justify-between`}
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
                className="w-full font-bold text-white text-sm sm:text-base bg-slate-700 border border-slate-600 rounded px-2 py-1"
                autoFocus
              />
            ) : (
              <h3 className="font-bold text-white text-sm sm:text-base break-words">{location.name}</h3>
            )}
            <p className="text-xs text-slate-100 mt-1">{location.splitters.length} splitter(s)</p>
          </div>
          <button
            onClick={() => setShowLocationDetails(true)}
            className="text-white hover:text-slate-200 transition-colors text-xl ml-2 flex-shrink-0"
            title="Location settings"
          >
            ⚙️
          </button>
        </div>

        <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-64">
          {location.splitters.length > 0 ? (
            location.splitters.map((splitter) => (
              <div
                key={splitter.id}
                className="rounded-lg border border-slate-700 bg-slate-700/50 p-3 hover:bg-slate-600/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-100">{splitter.model}</p>
                    <p className="text-xs text-slate-400">Port: {splitter.port}</p>
                    {splitter.notes && <p className="text-xs text-slate-400 mt-1">{splitter.notes}</p>}
                  </div>
                  <div className="flex items-center gap-6 flex-shrink-0">
                    <button
                      onClick={() => setEditingSplitter(splitter)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors text-lg font-semibold"
                      title="Edit splitter"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDeleteSplitter(splitter)}
                      className="text-red-500 hover:text-red-400 transition-colors text-lg font-semibold"
                      title="Delete splitter"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">No splitters</p>
          )}
        </div>

        {location.notes && (
          <div className="p-3 bg-slate-700/30 border-t border-slate-700">
            <p className="text-xs font-semibold text-slate-300 mb-1">Notes:</p>
            <p className="text-xs text-slate-400">{location.notes}</p>
          </div>
        )}

        <div className="p-3 border-t border-slate-700">
          <button
            onClick={() => setShowAddSplitter(true)}
            className="w-full text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            + Add Splitter
          </button>
        </div>
      </div>

      <AddSplitterModal open={showAddSplitter} onOpenChange={setShowAddSplitter} locationId={location.id} />

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
