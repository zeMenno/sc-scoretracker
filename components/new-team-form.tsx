'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { createTeamAction } from "@/lib/actions"
import { PlusCircle } from "lucide-react"

export function NewTeamForm() {
  return (
    <form action={createTeamAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Team Naam</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="space-y-2">
        <Label>Team Kleur</Label>
        <Input type="color" name="color" className="h-10 w-full cursor-pointer" defaultValue="#3b82f6" />
      </div>
      <Button type="submit">
        <PlusCircle className="mr-2 h-4 w-4" />
        Team Toevoegen
      </Button>
    </form>
  )
} 