"use client"

import { useState, useRef } from "react"
import { supabase } from "@/lib/supabase/client"

interface DocumentUploadProps {
  locationId: string
  onUploadComplete?: () => void
}

export function DocumentUpload({ locationId, onUploadComplete }: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true)
      const fileName = `${locationId}/${Date.now()}_${file.name}`

      const { error } = await supabase.storage.from("location-documents").upload(fileName, file)

      if (error) throw error

      setUploadedFiles([...uploadedFiles, fileName])
      onUploadComplete?.()
    } catch (error) {
      console.error("[v0] Error uploading document:", error)
      alert("Error uploading document")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="mt-4 p-3 bg-slate-800 rounded-lg">
      <h4 className="text-sm font-medium text-slate-300 mb-2">Documents</h4>
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        disabled={isUploading}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "+ Upload Document"}
      </button>
      {uploadedFiles.length > 0 && (
        <div className="mt-2 text-xs text-slate-400">{uploadedFiles.length} file(s) uploaded</div>
      )}
    </div>
  )
}
