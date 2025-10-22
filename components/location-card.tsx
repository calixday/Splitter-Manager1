"use client"

import { useState } from "react"
import type { Location } from "./location-context"
import { useLocations } from "./location-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AddSplitterModal } from "./add-splitter-modal"
import { EditSplitterModal } from "./edit-splitter-modal"
import type { Splitter } from "./location-context"

interface LocationCardProps {
  location: Location
}

export function LocationCard({ location }: LocationCardProps) {
  const { deleteLocation, deleteSplitter } = useLocations()
  const [showAddSplitter, setShowAddSplitter] = useState(false)
  const [editingSplitter, setEditingSplitter] = useState<Splitter | null>(null)

  return (
    <>
      <Card className="overflow-hidden border-border bg-card">
        <CardHeader className="border-b border-border bg-muted/50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">{location.name}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteLocation(location.id)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              🗑 Delete
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {location.splitters.map((splitter) => (
              <div
                key={splitter.id}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-3"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {splitter.model} - Port {splitter.port}
                  </p>
                  {splitter.notes && <p className="text-sm text-muted-foreground">{splitter.notes}</p>}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingSplitter(splitter)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✎ Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSplitter(location.id, splitter.id)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    🗑 Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button onClick={() => setShowAddSplitter(true)} variant="outline" className="mt-4 w-full">
            + Add Splitter
          </Button>
        </CardContent>
      </Card>

      <AddSplitterModal open={showAddSplitter} onOpenChange={setShowAddSplitter} locationId={location.id} />

      {editingSplitter && (
        <EditSplitterModal
          open={!!editingSplitter}
          onOpenChange={(open) => !open && setEditingSplitter(null)}
          locationId={location.id}
          splitter={editingSplitter}
        />
      )}
    </>
  )
}
