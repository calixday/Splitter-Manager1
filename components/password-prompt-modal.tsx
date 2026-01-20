"use client"

import { useState, useEffect, useRef } from "react"
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
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Prevent body scroll and manage focus when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
      
      // Focus the input field
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
      
      // Trap focus within the modal
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleOpenChange(false)
        }
      }
      
      document.addEventListener("keydown", handleKeyDown)
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
      }
    } else {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
    }
    return () => {
      document.body.style.overflow = ""
      document.body.style.position = ""
      document.body.style.width = ""
    }
  }, [open])

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
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/50"
        onClick={() => handleOpenChange(false)}
        role="presentation"
        aria-hidden="true"
      />
      <div ref={containerRef} className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 sm:p-0">
        <div
          className="w-full sm:max-w-sm rounded-t-lg sm:rounded-lg border border-border bg-card p-6 sm:shadow-lg max-h-[90vh] overflow-y-auto focus:outline-none"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="password-modal-title"
          tabIndex={-1}
        >
          <h2 id="password-modal-title" className="text-lg font-semibold text-foreground">
            Admin Password Required
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Enter admin password to delete <span className="font-medium break-words">{itemName}</span>
          </p>

          <div className="mt-6">
            <Input
              ref={inputRef}
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleConfirm()
                }
              }}
              className="text-base"
            />
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          </div>

          <div className="mt-6 flex gap-3 flex-col-reverse sm:flex-row">
            <Button variant="outline" onClick={() => handleOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="flex-1 bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
