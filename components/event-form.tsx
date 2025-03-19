"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createEventAction } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, Loader2 } from "lucide-react"

interface EventFormProps {
  teamId: string
}

export function EventForm({ teamId }: EventFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [description, setDescription] = useState("")
  const [points, setPoints] = useState("")
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("teamId", teamId)
    formData.append("description", description)
    formData.append("points", points)

    const result = await createEventAction(formData)

    setIsSubmitting(false)

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Event added successfully",
      })
      setDescription("")
      setPoints("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div className="space-y-2">
        <label htmlFor="points" className="text-sm font-medium">
          Punten
        </label>
        <Input
          id="points"
          type="number"
          placeholder="Voer punten in (positief of negatief)"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Toevoegen...
          </>
        ) : (
          <>
            <PlusCircle className="mr-2 h-4 w-4" />
            Toevoegen
          </>
        )}
      </Button>
    </form>
  )
}

