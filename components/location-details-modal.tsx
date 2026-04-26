"use client"

import { useState } from "react"
import type { Location, Splitter } from "./location-context"
import { useLocations } from "./location-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PasswordPromptModal } from "./password-prompt-modal"
import { AddSplitterModal } from "./add-splitter-modal"
import { EditSplitterModal } from "./edit-splitter-modal"

interface LocationDetailsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  location: Location
}

export function LocationDetailsModal({ open, onOpenChange, location }: LocationDetailsModalProps) {
  const { deleteLocation, deleteSplitter, updateLocation } = useLocations()
  const [editingName, setEditingName] = useState(false)
  const [locationName, setLocationName] = useState(location.name)
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false)
  const [showAddSplitter, setShowAddSplitter] = useState(false)
  const [editingSplitter, setEditingSplitter] = useState<Splitter | null>(null)
  const [deleteAction, setDeleteAction] = useState<{
    type: "location" | "splitter"
    splitterId?: string
    itemName: string
  } | null>(null)

  const handleUpdateName = async () => {
    if (locationName.trim() && locationName !== location.name) {
      await updateLocation(location.id, {
        ...location,
        name: locationName.trim(),
      })
      setEditingName(false)
    }
  }

  const handleDeleteLocation = () => {
    setDeleteAction({
      type: "location",
      itemName: location.name,
    })
    setShowPasswordPrompt(true)
  }

  const handleEditSplitter = (splitter: Splitter) => {
    setEditingSplitter(splitter)
  }

  const handleDeleteSplitter = (splitter: Splitter) => {
    setDeleteAction({
      type: "splitter",
      splitterId: splitter.id,
      itemName: `${splitter.model} - Port ${splitter.port}`,
    })
    setShowPasswordPrompt(true)
  }

  const handlePasswordConfirm = () => {
    if (!deleteAction) return

    if (deleteAction.type === "location") {
      deleteLocation(location.id)
      onOpenChange(false)
    } else if (deleteAction.type === "splitter" && deleteAction.splitterId) {
      deleteSplitter(location.id, deleteAction.splitterId)
    }

    setDeleteAction(null)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-screen h-screen max-w-none bg-slate-800 border border-slate-700 text-white rounded-none flex flex-col p-0">
          <DialogHeader className="border-b border-slate-700 p-6">
            <DialogTitle className="flex items-center justify-between text-2xl">
              <div className="flex-1">
                {editingName ? (
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    onBlur={handleUpdateName}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdateName()
                      if (e.key === "Escape") setEditingName(false)
                    }}
                    className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-2xl"
                    autoFocus
                  />
                ) : (
                  <span>{location.name}</span>
                )}
              </div>
              <button
                onClick={() => setEditingName(!editingName)}
                className="text-yellow-400 hover:text-yellow-300 text-2xl ml-4"
              >
                ✎
              </button>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-200 mb-4 text-xl">Splitters ({location.splitters.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {location.splitters.length > 0 ? (
                    location.splitters.map((splitter) => (
                      <div key={splitter.id} className="bg-slate-700 rounded-lg p-4 flex flex-col justify-between">
                        <div>
                          <p className="font-semibold text-slate-100 text-lg">{splitter.model}</p>
                          <p className="text-sm text-slate-400 mt-1">Port: {splitter.port}</p>
                          {splitter.notes && <p className="text-xs text-slate-400 mt-2">{splitter.notes}</p>}
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <button
                            onClick={() => handleEditSplitter(splitter)}
                            className="text-yellow-400 hover:text-yellow-300 text-xl transition-colors"
                            title="Edit splitter"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDeleteSplitter(splitter)}
                            className="text-red-400 hover:text-red-300 text-xl transition-colors"
                            title="Delete splitter"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm col-span-full">No splitters</p>
                  )}
                </div>
              </div>

              {location.notes && (
                <div>
                  <h3 className="font-semibold text-slate-200 mb-2 text-xl">Notes</h3>
                  <p className="text-slate-400 text-sm bg-slate-700 rounded p-4">{location.notes}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 p-6 border-t border-slate-700 bg-slate-900">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Close
            </Button>
            <Button onClick={() => setShowAddSplitter(true)} className="flex-1 bg-blue-600 hover:bg-blue-700">
              + Add Splitter
            </Button>
            <Button variant="destructive" onClick={handleDeleteLocation} className="flex-1 bg-red-600 hover:bg-red-700">
              Delete Location
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AddSplitterModal open={showAddSplitter} onOpenChange={setShowAddSplitter} locationId={location.id} />

      {editingSplitter && (
        <EditSplitterModal
          open={!!editingSplitter}
          onOpenChange={(isOpen) => !isOpen && setEditingSplitter(null)}
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
