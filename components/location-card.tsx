"use client"

import { useState } from "react"
import type { Location } from "./location-context"
import { useLocations } from "./location-context"
import { AddSplitterModal } from "./add-splitter-modal"
import { EditSplitterModal } from "./edit-splitter-modal"
import { PasswordPromptModal } from "./password-prompt-modal"
import type { Splitter } from "./location-context"

interface LocationCardProps {
  location: Location
}

export function LocationCard({ location }: LocationCardProps) {
  const { deleteLocation, deleteSplitter } = useLocations()
  const [showAddSplitter, setShowAddSplitter] = useState(false)
  const [editingSplitter, setEditingSplitter] = useState<Splitter | null>(null)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [deleteAction, setDeleteAction] = useState<{
    type: "location" | "splitter"
    locationId: string
    splitterId?: string
    itemName: string
  } | null>(null)

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

  const handlePasswordConfirm = () => {
    if (!deleteAction) return

    if (deleteAction.type === "location") {
      deleteLocation(deleteAction.locationId)
    } else if (deleteAction.type === "splitter" && deleteAction.splitterId) {
      deleteSplitter(deleteAction.locationId, deleteAction.splitterId)
    }

    setDeleteAction(null)
  }

  return (
    <>
      <div className="rounded-xl bg-slate-800 border border-slate-700 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full">
        <div className="border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-100 text-sm sm:text-base truncate">{location.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{location.splitters.length} splitter(s)</p>
            </div>
            <button
              onClick={handleDeleteLocation}
              className="text-slate-400 hover:text-red-400 transition-colors flex-shrink-0 text-lg"
              title="Delete location"
            >
              🗑
            </button>
          </div>
        </div>

        <div className="p-3 space-y-2 flex-1 overflow-y-auto max-h-64">
          {location.splitters.length > 0 ? (
            location.splitters.map((splitter) => (
              <div
                key={splitter.id}
                className="rounded-lg border border-slate-700 bg-slate-700/50 p-2 hover:bg-slate-600/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-100">{splitter.model}</p>
                    <p className="text-xs text-slate-400">Port: {splitter.port}</p>
                    {splitter.notes && <p className="text-xs text-slate-400 mt-1">{splitter.notes}</p>}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setEditingSplitter(splitter)}
                      className="text-slate-400 hover:text-blue-400 transition-colors text-sm"
                      title="Edit splitter"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDeleteSplitter(splitter)}
                      className="text-slate-400 hover:text-red-400 transition-colors text-sm"
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

        <div className="border-t border-slate-700 p-2 flex gap-2">
          <button
            onClick={() => setShowAddSplitter(true)}
            className="flex-1 text-xs bg-slate-700 hover:bg-slate-600 text-blue-300 font-medium py-2 rounded-lg transition-colors"
          >
            + Add
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
    </>
  )
}
