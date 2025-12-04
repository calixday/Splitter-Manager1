"use client"

import type React from "react"
import { useState } from "react"
import { useLocations } from "./location-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddSplitterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  locationId: string
}

export function AddSplitterModal({ open, onOpenChange, locationId }: AddSplitterModalProps) {
  const { addSplitterToLocation } = useLocations()
  const [splitterModel, setSplitterModel] = useState("")
  const [splitterPort, setSplitterPort] = useState("")
  const [splitterNotes, setSplitterNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!splitterModel.trim() || !splitterPort.trim()) {
      alert("Please fill in all required fields")
      return
    }

    try {
      setIsSubmitting(true)
      await addSplitterToLocation(locationId, {
        id: Date.now().toString(),
        model: splitterModel,
        port: splitterPort,
        notes: splitterNotes || undefined,
      })

      setSplitterModel("")
      setSplitterPort("")
      setSplitterNotes("")
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding splitter:", error)
      alert("Failed to add splitter")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add Splitter</DialogTitle>
          <DialogDescription className="text-muted-foreground">Add a new splitter to this location</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="model" className="text-foreground">
              Splitter Model *
            </Label>
            <Input
              id="model"
              placeholder="e.g., Adhouse C650"
              value={splitterModel}
              onChange={(e) => setSplitterModel(e.target.value)}
              className="border-border bg-background text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="port" className="text-foreground">
              Port Configuration *
            </Label>
            <Input
              id="port"
              placeholder="e.g., 9/5"
              value={splitterPort}
              onChange={(e) => setSplitterPort(e.target.value)}
              className="border-border bg-background text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="notes" className="text-foreground">
              Notes (Optional)
            </Label>
            <Input
              id="notes"
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
              {isSubmitting ? "Adding..." : "Add Splitter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
