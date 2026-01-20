"use client"

import type React from "react"
import { useState } from "react"
import { useLocations } from "./location-context"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const PREDEFINED_MODELS = ["ADHS C620 1", "ADHS C620 2", "ADHS C650", "JT C650", "KAREN 650"]

interface AddSplitterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  locationId: string
}

export function AddSplitterModal({ open, onOpenChange, locationId }: AddSplitterModalProps) {
  const { addSplitterToLocation } = useLocations()
  const [splitterModel, setSplitterModel] = useState(PREDEFINED_MODELS[0])
  const [splitterPort, setSplitterPort] = useState("")
  const [splitterNotes, setSplitterNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModelInput, setShowModelInput] = useState(false)

  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value

    // Auto-add "/" after first digit
    if (value.length === 1 && /^\d$/.test(value) && !value.includes("/")) {
      value = value + "/"
    }

    setSplitterPort(value)
  }

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
      setShowModelInput(false)
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
      <DialogContent className="border-border bg-card w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl text-foreground">Add Splitter</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">Add a new splitter to this location</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="model" className="text-foreground text-sm">
              Splitter Model *
            </Label>
            {showModelInput ? (
              <div className="flex gap-2 mt-2">
                <Input
                  id="model"
                  placeholder="Enter splitter model"
                  value={splitterModel}
                  onChange={(e) => setSplitterModel(e.target.value)}
                  className="border-border bg-background text-foreground flex-1 text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModelInput(false)
                    setSplitterModel("")
                  }}
                  className="px-2 sm:px-3"
                >
                  ✕
                </Button>
              </div>
            ) : (
              <div className="space-y-2 mt-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PREDEFINED_MODELS.map((model) => (
                    <button
                      key={model}
                      type="button"
                      onClick={() => setSplitterModel(model)}
                      className={`p-2 rounded border text-xs sm:text-sm transition-colors touch-manipulation active:scale-95 ${
                        splitterModel === model
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-border bg-background text-foreground hover:bg-slate-700 active:bg-slate-600"
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowModelInput(true)}
                  className="w-full p-2 rounded border border-dashed border-slate-500 text-slate-400 hover:text-slate-300 text-xs sm:text-sm transition-colors touch-manipulation active:bg-slate-700/30"
                >
                  + Enter Custom Model
                </button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="port" className="text-foreground text-sm">
              Port Configuration * (e.g., 7/9)
            </Label>
            <Input
              id="port"
              placeholder="Type first digit, / will auto-add"
              value={splitterPort}
              onChange={handlePortChange}
              className="border-border bg-background text-foreground mt-2 text-sm"
              maxLength={5}
              inputMode="numeric"
            />
          </div>

          <div>
            <Label htmlFor="notes" className="text-foreground text-sm">
              Notes (Optional)
            </Label>
            <Input
              id="notes"
              placeholder="e.g., Black tape, Thin patch cord"
              value={splitterNotes}
              onChange={(e) => setSplitterNotes(e.target.value)}
              className="border-border bg-background text-foreground mt-2 text-sm"
            />
          </div>

          <div className="flex gap-2 pt-4 flex-col-reverse sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 text-sm"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 text-sm" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Splitter"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
