"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PasswordPromptModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  itemName: string
}

export function PasswordPromptModal({ open, onOpenChange, onConfirm, itemName }: PasswordPromptModalProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleConfirm = () => {
    const correctPassword = "123456"
    if (password === correctPassword) {
      setError("")
      onConfirm()
      setPassword("")
      onOpenChange(false)
    } else {
      setError("Incorrect password. Please try again.")
      setPassword("")
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setPassword("")
      setError("")
    }
    onOpenChange(newOpen)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-foreground">Admin Password Required</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter admin password to delete <span className="font-medium">{itemName}</span>
        </p>

        <div className="mt-4">
          <Input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleConfirm()
              }
            }}
            autoFocus
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => handleOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="flex-1 bg-red-600 hover:bg-red-700">
            Delete
          </Button>
        </div>
      </div>
    </div>
  )
}
