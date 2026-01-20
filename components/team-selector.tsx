"use client"

interface TeamSelectorProps {
  selectedTeamId: string
  onTeamChange: (teamId: string) => void
}

export function TeamSelector({ selectedTeamId, onTeamChange }: TeamSelectorProps) {
  // Team selector is not needed as there is no teams table in the current schema
  // Return null to hide this component
  return null
}
