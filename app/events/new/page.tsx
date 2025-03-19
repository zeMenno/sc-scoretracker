import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MultiTeamEventForm } from "@/components/multi-team-event-form"
import { getAllTeams } from "@/lib/redis"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function NewMultiTeamEventPage() {
  const teams = await getAllTeams()

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Terug naar Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Spel toevoegen aan meerdere tribes</CardTitle>
          <CardDescription>Voeg een spel toe aan meerdere tribes tegelijk</CardDescription>
        </CardHeader>
        <CardContent>
          <MultiTeamEventForm teams={teams} />
        </CardContent>
      </Card>
    </div>
  )
}

