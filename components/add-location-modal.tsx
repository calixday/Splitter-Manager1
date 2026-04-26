"use client"

import type React from "react"
import { useState } from "react"
import { useLocations } from "./location-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const PREDEFINED_MODELS = ["ADHS C620 1", "ADHS C620 2", "ADHS C650", "JT C650", "KAREN 650"]

interface AddLocationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teamId: string
}

export function AddLocationModal({ open, onOpenChange, teamId }: AddLocationModalProps) {
  const { addLocation } = useLocations()
  const [locationName, setLocationName] = useState("")
  const [splitterModel, setSplitterModel] = useState(PREDEFINED_MODELS[0])
  const [splitterPort, setSplitterPort] = useState("")
  const [splitterNotes, setSplitterNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModelInput, setShowModelInput] = useState(false)
  const [customModel, setCustomModel] = useState("")

  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    // Auto-add "/" after first digit
    if (value.length === 1 && /^\d$/.test(value)) {
      value = value + "/"
    }
    setSplitterPort(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalModel = showModelInput ? customModel : splitterModel
    if (!locationName.trim() || !finalModel.trim() || !splitterPort.trim()) {
      alert("Please fill in all required fields")
      return
    }

    if (!teamId) {
      alert("Please select a team first")
      return
    }

    try {
      setIsSubmitting(true)
      await addLocation(
        {
          id: "",
          name: locationName,
          team_id: teamId,
          splitters: [
            {
              id: "",
              model: finalModel,
              port: splitterPort,
              notes: splitterNotes || undefined,
            },
          ],
        },
        teamId,
      )

      setLocationName("")
      setSplitterModel(PREDEFINED_MODELS[0])
      setSplitterPort("")
      setSplitterNotes("")
      setShowModelInput(false)
      setCustomModel("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding location:", error)
      alert("Failed to add location")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Location</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a new location and add its first splitter
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="location-name" className="text-foreground">
              Location Name *
            </Label>
            <Input
              id="location-name"
              placeholder="e.g., Argwings kodhek-Elgeyo Marakwet"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="border-border bg-background text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="splitter-model" className="text-foreground">
              Splitter Model *
            </Label>
            {!showModelInput ? (
              <div className="space-y-2">
                <select
                  value={splitterModel}
                  onChange={(e) => setSplitterModel(e.target.value)}
                  className="w-full border border-border bg-background text-foreground rounded px-3 py-2"
                >
                  {PREDEFINED_MODELS.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowModelInput(true)}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Or enter custom model
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  id="splitter-model"
                  placeholder="Enter custom model"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  className="border-border bg-background text-foreground"
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowModelInput(false)
                    setCustomModel("")
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Use predefined models
                </button>
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="splitter-port" className="text-foreground">
              Port Configuration *
            </Label>
            <Input
              id="splitter-port"
              placeholder="e.g., 9/5"
              value={splitterPort}
              onChange={handlePortChange}
              className="border-border bg-background text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="splitter-notes" className="text-foreground">
              Notes (Optional)
            </Label>
            <Input
              id="splitter-notes"
              placeholder="e.g., Black tape, Thin patch cord"
              value={splitterNotes}
              onChange={(e) => setSplitterNotes(e.target.value)}
              className="border-border bg-background text-foreground"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Location"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
