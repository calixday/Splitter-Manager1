"use client"

import type React from "react"

import { useState } from "react"
import { useLocations } from "./location-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddLocationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddLocationModal({ open, onOpenChange }: AddLocationModalProps) {
  const { addLocation } = useLocations()
  const [locationName, setLocationName] = useState("")
  const [splitterModel, setSplitterModel] = useState("")
  const [splitterPort, setSplitterPort] = useState("")
  const [splitterNotes, setSplitterNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!locationName.trim() || !splitterModel.trim() || !splitterPort.trim()) {
      alert("Please fill in all required fields")
      return
    }

    addLocation({
      id: Date.now().toString(),
      name: locationName,
      splitters: [
        {
          id: `${Date.now()}-1`,
          model: splitterModel,
          port: splitterPort,
          notes: splitterNotes || undefined,
        },
      ],
    })

    setLocationName("")
    setSplitterModel("")
    setSplitterPort("")
    setSplitterNotes("")
    onOpenChange(false)
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
            <Input
              id="splitter-model"
              placeholder="e.g., Adhouse C650"
              value={splitterModel}
              onChange={(e) => setSplitterModel(e.target.value)}
              className="border-border bg-background text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="splitter-port" className="text-foreground">
              Port Configuration *
            </Label>
            <Input
              id="splitter-port"
              placeholder="e.g., 9/5"
              value={splitterPort}
              onChange={(e) => setSplitterPort(e.target.value)}
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Location
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
