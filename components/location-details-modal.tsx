"use client"

import { useState } from "react"
import type { Location, Splitter } from "./location-context"
import { useLocations } from "./location-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PasswordPromptModal } from "./password-prompt-modal"

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
        <DialogContent className="max-w-2xl bg-slate-800 border border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
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
                    className="w-full bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white"
                    autoFocus
                  />
                ) : (
                  <span>{location.name}</span>
                )}
              </div>
              <button
                onClick={() => setEditingName(!editingName)}
                className="text-yellow-400 hover:text-yellow-300 text-lg ml-2"
              >
                ✎
              </button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <h3 className="font-semibold text-slate-200 mb-3">Splitters ({location.splitters.length})</h3>
              <div className="space-y-2">
                {location.splitters.length > 0 ? (
                  location.splitters.map((splitter) => (
                    <div key={splitter.id} className="bg-slate-700 rounded-lg p-3 flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-100">{splitter.model}</p>
                        <p className="text-sm text-slate-400">Port: {splitter.port}</p>
                        {splitter.notes && <p className="text-xs text-slate-400 mt-1">{splitter.notes}</p>}
                      </div>
                      <button
                        onClick={() => handleDeleteSplitter(splitter)}
                        className="text-red-400 hover:text-red-300 text-lg ml-2 flex-shrink-0"
                      >
                        🗑
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">No splitters</p>
                )}
              </div>
            </div>

            {location.notes && (
              <div>
                <h3 className="font-semibold text-slate-200 mb-2">Notes</h3>
                <p className="text-slate-400 text-sm bg-slate-700 rounded p-2">{location.notes}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t border-slate-700">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Close
            </Button>
            <Button variant="destructive" onClick={handleDeleteLocation} className="flex-1 bg-red-600 hover:bg-red-700">
              Delete Location
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <PasswordPromptModal
        open={showPasswordPrompt}
        onOpenChange={setShowPasswordPrompt}
        onConfirm={handlePasswordConfirm}
        itemName={deleteAction?.itemName || ""}
      />
    </>
  )
}
