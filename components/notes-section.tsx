"use client"

import { useState } from "react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

interface NotesSectionProps {
  locationId: string
  initialNotes?: string
}

export function NotesSection({ locationId, initialNotes = "" }: NotesSectionProps) {
  const [notes, setNotes] = useState(initialNotes)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const { error } = await supabase.from("locations").update({ notes }).eq("id", locationId)

      if (error) throw error
      setIsEditing(false)
      toast.success("Notes saved successfully!")
    } catch (error) {
      console.error("[v0] Error saving notes:", error)
      toast.error("Failed to save notes")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mt-4 p-3 bg-slate-800 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-slate-300">Notes</h4>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-xs text-blue-400 hover:text-blue-300">
            Edit
          </button>
        )}
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 bg-slate-700 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Add notes for this location..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-400">{notes || "No notes yet"}</p>
      )}
    </div>
  )
}
