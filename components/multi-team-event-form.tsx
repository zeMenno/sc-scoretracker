"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TeamSelector } from "@/components/team-selector"
import { createMultiTeamEventAction } from "@/lib/actions"
import { Loader2, PlusCircle } from "lucide-react"
import type { Team, TeamPoints } from "@/lib/redis"
import { toast } from "sonner"

interface MultiTeamEventFormProps {
  teams: Team[]
}

export function MultiTeamEventForm({ teams }: MultiTeamEventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [description, setDescription] = useState("")
  const [selectedTeamPoints, setSelectedTeamPoints] = useState<TeamPoints[]>([])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (selectedTeamPoints.length === 0) {
      toast.error("Selecteer ten minste één team")
      return
    }

    // Check if any selected team has no points value
    const hasEmptyPoints = selectedTeamPoints.some((tp) => tp.points === undefined || tp.points === null)
    if (hasEmptyPoints) {
      toast.error("Vul punten in voor alle geselecteerde tribes")
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("teamPointsData", JSON.stringify(selectedTeamPoints))
    formData.append("description", description)

    const result = await createMultiTeamEventAction(formData)

    setIsSubmitting(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`Spel toegevoegd aan ${selectedTeamPoints.length} tribes`)
      setDescription("")
      setSelectedTeamPoints([])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Selecteer tribes en punten</h3>
          <TeamSelector teams={teams} onChange={setSelectedTeamPoints} />
          {selectedTeamPoints.length > 0 && (
            <p className="text-sm text-muted-foreground mt-2">{selectedTeamPoints.length} tribes geselecteerd</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Spel Beschrijving
          </label>
          <Textarea
            id="description"
            placeholder="Beschrijf het spel"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting || selectedTeamPoints.length === 0} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Toevoegen...
          </>
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" />
            Spel toevoegen aan {selectedTeamPoints.length} tribes
          </>
        )}
      </Button>
    </form>
  )
}

