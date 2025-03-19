import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createTeamAction, getTeamsAction } from "@/lib/actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { NewTeamForm } from "@/components/new-team-form"

interface Team {
  id: string
  name: string
  color: string
  score: number
}

export const dynamic = 'force-dynamic'

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
          <CardTitle>Nieuwe Tribe</CardTitle>
          <CardDescription>Voeg een nieuwe tribe toe aan het kamp</CardDescription>
        </CardHeader>
        <CardContent>
          <NewTeamForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bestaande Tribes</CardTitle>
          <CardDescription>Overzicht van alle tribes in het toernooi</CardDescription>
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

