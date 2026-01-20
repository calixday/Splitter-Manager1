"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLocations, type Splitter } from "./location-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditSplitterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  locationId: string
  splitter: Splitter
}

export function EditSplitterModal({ open, onOpenChange, locationId, splitter }: EditSplitterModalProps) {
  const { updateSplitter } = useLocations()
  const [splitterModel, setSplitterModel] = useState("")
  const [splitterPort, setSplitterPort] = useState("")
  const [splitterNotes, setSplitterNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setSplitterModel(splitter.model)
      setSplitterPort(splitter.port)
      setSplitterNotes(splitter.notes || "")
    }
  }, [open, splitter])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!splitterModel.trim() || !splitterPort.trim()) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)
      console.log("[v0] Updating splitter with ID:", splitter.id, "locationId:", locationId)
      await updateSplitter(locationId, splitter.id, {
        id: splitter.id,
        model: splitterModel.trim(),
        port: splitterPort.trim(),
        notes: splitterNotes.trim() || undefined,
        location_id: locationId,
      })

      console.log("[v0] Splitter update successful")
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error updating splitter:", error)
      alert("Failed to update splitter")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Splitter</DialogTitle>
          <DialogDescription className="text-muted-foreground">Update splitter information</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-model" className="text-foreground">
              Splitter Model *
            </Label>
            <Input
              id="edit-model"
              placeholder="e.g., Adhouse C650"
              value={splitterModel}
              onChange={(e) => setSplitterModel(e.target.value)}
              className="border-border bg-background text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="edit-port" className="text-foreground">
              Port Configuration *
            </Label>
            <Input
              id="edit-port"
              placeholder="e.g., 9/5"
              value={splitterPort}
              onChange={(e) => setSplitterPort(e.target.value)}
              className="border-border bg-background text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="edit-notes" className="text-foreground">
              Notes (Optional)
            </Label>
            <Input
              id="edit-notes"
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
              {isSubmitting ? "Updating..." : "Update Splitter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
