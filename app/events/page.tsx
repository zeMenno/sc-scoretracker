import { getAllTeams, getTeamEvents, Event } from "@/lib/redis"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { deleteEventAction } from "@/lib/actions"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { nl } from "date-fns/locale"

export const dynamic = 'force-dynamic'

interface EventWithTeam extends Event {
  teamName: string
}

export default async function EventsPage() {
  const teams = await getAllTeams()
  const session = await getServerSession(authOptions)

  // Get all events from all teams
  const allEvents = await Promise.all(
    teams.map(async (team) => {
      const events = await getTeamEvents(team.id)
      return events.map((event: Event) => ({
        ...event,
        teamName: team.name
      }))
    })
  )

  // Flatten and sort events by date
  const sortedEvents = allEvents
    .flat()
    .sort((a: EventWithTeam, b: EventWithTeam) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="container mx-auto py-6 px-4 md:py-10 md:px-6 space-y-6">
      <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Terug naar Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>
            Overzicht van alle events en hun impact op de scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Punten</TableHead>
                <TableHead>Datum</TableHead>
                {session && <TableHead>Toegevoegd door</TableHead>}
                {session && <TableHead className="w-[100px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.description}</TableCell>
                  <TableCell>{event.teamName}</TableCell>
                  <TableCell>{event.points}</TableCell>
                  <TableCell>{format(new Date(event.createdAt), "dd/MM/yyyy HH:mm", { locale: nl })}</TableCell>
                  {session && <TableCell>{event.creatorEmail}</TableCell>}
                  {session && (
                    <TableCell>
                      <form action={deleteEventAction}>
                        <input type="hidden" name="id" value={event.id} />
                        <Button variant="ghost" size="icon" type="submit" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 