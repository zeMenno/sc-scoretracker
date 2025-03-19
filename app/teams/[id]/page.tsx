import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createEventAction } from "@/lib/actions"
import Link from "next/link"
import { ArrowLeft, PlusCircle, Trophy } from "lucide-react"
import { Label } from "@/components/ui/label"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getTeamById, getTeamEvents } from "@/lib/redis"
import { notFound } from "next/navigation"
import { EventList } from "@/components/event-list"
import { Textarea } from "@/components/ui/textarea"

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function TeamPage({ params }: PageProps) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  const team = await getTeamById(id)

  if (!team) {
    notFound()
  }

  const events = await getTeamEvents(id)

  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  return (
    <div className="container mx-auto py-6 px-4 md:py-10 md:px-6 space-y-6">
      <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Terug naar Dashboard
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{team.name}</CardTitle>
              <CardDescription>Tribe Details</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span className="text-2xl font-bold">{team.score}</span>
              <span className="text-muted-foreground">punten</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nieuw Spel</CardTitle>
            <CardDescription>Voeg een nieuw spel toe aan het kamp</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createEventAction} className="space-y-4">
              <input type="hidden" name="teamId" value={id} />
              <div className="space-y-2">
                <Label htmlFor="description">Beschrijving</Label>
                <Textarea id="description" name="description" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Punten</Label>
                <Input id="points" name="points" type="number" required />
              </div>
              <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" />
                Spel Toevoegen
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spel Geschiedenis</CardTitle>
            <CardDescription>Recente spellen voor deze tribe</CardDescription>
          </CardHeader>
          <CardContent>
            <EventList spellen={events} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

