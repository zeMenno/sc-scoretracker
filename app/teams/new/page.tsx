import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createTeamAction, getTeamsAction } from "@/lib/actions"
import Link from "next/link"
import { ArrowLeft, PlusCircle } from "lucide-react"
import { Label } from "@/components/ui/label"

interface Team {
  id: string
  name: string
  color: string
  score: number
}

export default async function NewTeamPage() {
  const teams = await getTeamsAction()

  return (
    <div className="container mx-auto py-6 px-4 md:py-10 md:px-6 space-y-6 max-w-2xl">
      <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Terug naar Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Nieuw Team</CardTitle>
          <CardDescription>Voeg een nieuw team toe aan het toernooi</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createTeamAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team Naam</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Team Kleur</Label>
              <div className="flex gap-2">
                <Input id="color" name="color" type="color" className="w-20 h-10 p-1" />
                <Input type="text" defaultValue="#3b82f6" className="font-mono" />
              </div>
            </div>
            <Button type="submit" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Team Toevoegen
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bestaande Teams</CardTitle>
          <CardDescription>Overzicht van alle teams in het toernooi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teams.map((team) => (
              <div key={team.id} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: team.color }}
                />
                <span>{team.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

