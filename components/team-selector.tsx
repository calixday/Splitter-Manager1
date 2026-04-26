"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"

interface Team {
  id: string
  name: string
  region: string
}

interface TeamSelectorProps {
  selectedTeamId: string
  onTeamChange: (teamId: string) => void
}

export function TeamSelector({ selectedTeamId, onTeamChange }: TeamSelectorProps) {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase.from("teams").select("*").order("name")
        if (error) throw error
        setTeams(data || [])
      } catch (error) {
        console.error("[v0] Error fetching teams:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeams()
  }, [])

  if (isLoading || teams.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-slate-300">Team:</label>
      <select
        value={selectedTeamId}
        onChange={(e) => onTeamChange(e.target.value)}
        className="px-3 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
      >
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </div>
  )
}
