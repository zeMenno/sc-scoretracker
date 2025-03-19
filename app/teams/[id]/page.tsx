import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTeamById, getTeamEvents } from "@/lib/redis"
import { EventForm } from "@/components/event-form"
import { EventList } from "@/components/event-list"
import Link from "next/link"
import { ArrowLeft, Trophy } from "lucide-react"
import { notFound } from "next/navigation"

interface TeamPageProps {
  params: {
    id: string
  }
}

export default async function TeamPage({ params }: TeamPageProps) {
  const team = await getTeamById(params.id)

  if (!team) {
    notFound()
  }

  const events = await getTeamEvents(params.id)

  return (
    <div className="container mx-auto py-6 px-4 md:py-10 md:px-6 space-y-6">
      <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Terug naar Dashboard
      </Link>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{team.name}</CardTitle>
                <CardDescription>Team Details</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">{team.score}</span>
                <span className="text-muted-foreground">points</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Add Event</CardTitle>
              <CardDescription>Add a new event to update the team's score</CardDescription>
            </CardHeader>
            <CardContent>
              <EventForm teamId={params.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event History</CardTitle>
              <CardDescription>Recent events for this team</CardDescription>
            </CardHeader>
            <CardContent>
              <EventList events={events} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

