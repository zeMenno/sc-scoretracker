"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { Team, TeamPoints } from "@/lib/redis"

interface TeamSelectorProps {
  teams: Team[]
  onChange: (selectedTeamPoints: TeamPoints[]) => void
}

export function TeamSelector({ teams, onChange }: TeamSelectorProps) {
  const [selectedTeams, setSelectedTeams] = useState<Record<string, boolean>>({})
  const [teamPoints, setTeamPoints] = useState<Record<string, number>>({})

  const handleTeamChange = (teamId: string, checked: boolean) => {
    const newSelectedTeams = { ...selectedTeams, [teamId]: checked }
    setSelectedTeams(newSelectedTeams)

    updateSelectedTeamPoints(newSelectedTeams, teamPoints)
  }

  const handlePointsChange = (teamId: string, points: number) => {
    const newTeamPoints = { ...teamPoints, [teamId]: points }
    setTeamPoints(newTeamPoints)

    updateSelectedTeamPoints(selectedTeams, newTeamPoints)
  }

  const updateSelectedTeamPoints = (selected: Record<string, boolean>, points: Record<string, number>) => {
    const selectedTeamPoints: TeamPoints[] = Object.entries(selected)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => ({
        teamId: id,
        points: points[id] || 0,
      }))

    onChange(selectedTeamPoints)
  }

  const handleSelectAll = (checked: boolean) => {
    const newSelectedTeams: Record<string, boolean> = {}
    teams.forEach((team) => {
      newSelectedTeams[team.id] = checked
    })
    setSelectedTeams(newSelectedTeams)

    updateSelectedTeamPoints(newSelectedTeams, teamPoints)
  }

  const allSelected = teams.length > 0 && teams.every((team) => selectedTeams[team.id])
  const someSelected = teams.some((team) => selectedTeams[team.id]) && !allSelected

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="select-all"
          checked={allSelected}
          indeterminate={someSelected}
          onCheckedChange={(checked) => handleSelectAll(!!checked)}
        />
        <label
          htmlFor="select-all"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Selecteer alle teams
        </label>
      </div>

      <div className="border rounded-md divide-y">
        {teams.map((team) => (
          <div key={team.id} className="flex items-center space-x-2 p-3">
            <Checkbox
              id={`team-${team.id}`}
              checked={!!selectedTeams[team.id]}
              onCheckedChange={(checked) => handleTeamChange(team.id, !!checked)}
            />
            <label
              htmlFor={`team-${team.id}`}
              className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {team.name}
            </label>
            <div className="w-24">
              <Input
                type="number"
                value={teamPoints[team.id] || ""}
                onChange={(e) => handlePointsChange(team.id, Number.parseInt(e.target.value, 10) || 0)}
                placeholder="Punten"
                disabled={!selectedTeams[team.id]}
                className="h-8 text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

