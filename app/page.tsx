import { Button } from "@/components/ui/button"
import { TeamCard } from "@/components/team-card"
import { getAllTeams, getAllEvents } from "@/lib/redis"
import Link from "next/link"
import { PlusCircle, Trophy, Award, List, MoreVertical, Download, History } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { LoginButton, LogoutButton } from "./components/auth-buttons"
import { ClearDatabaseButton } from "@/components/clear-database-button"
import { ScoreProgressionChart } from "@/components/score-progression-chart"
import { Separator } from "@/components/ui/separator"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const teams = await getAllTeams()
  const events = await getAllEvents()
  const session = await getServerSession(authOptions)

  return (
    <div className="container mx-auto py-6 px-6 md:py-10 md:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Summercamp</h1>
          <p className="text-muted-foreground">Rise Up</p>
        </div>
        <div className="flex items-center gap-2">
          {session ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/teams/new">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Nieuwe Tribe
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/events/new">
                      <Award className="mr-2 h-4 w-4" />
                      Multi-tribe Spel
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/events">
                      <List className="mr-2 h-4 w-4" />
                      Beheer Spellen
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/export/teams">
                      <Download className="mr-2 h-4 w-4" />
                      Export Tribes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/export/events">
                      <Download className="mr-2 h-4 w-4" />
                      Exporteer Spellen
                    </Link>
                  </DropdownMenuItem>
                  {session.user.email === "mfesevur@gmail.com" && <ClearDatabaseButton />}
                  <DropdownMenuItem className="md:hidden p-0">
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="hidden md:block">
                <LogoutButton />
              </div>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href="/events">
                    <History className="mr-2 h-4 w-4" />
                    Spellen
                  </Link>
                </Button>
                <LoginButton />
              </div>
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/events">
                        <History className="mr-2 h-4 w-4" />
                        Spellen
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LoginButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground italic">
        "Maar wie hoopt op de HEER krijgt nieuwe kracht: hij slaat zijn vleugels uit als een adelaar, hij loopt, maar wordt niet moe, hij rent, maar raakt niet uitgeput." - Jesaja 40:31
      </p>

      {teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">Nog geen tribes</h2>
          <p className="text-muted-foreground mb-4">Voeg je eerste tribe toe om scores bij te houden</p>
          {session && (
            <Button asChild>
              <Link href="/teams/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nieuwe Tribe
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4 w-full">
          <h2 className="text-xl font-semibold">Tribes</h2>
          <div className="flex flex-col w-full gap-2">
            {teams.map((team, index) => (
              <TeamCard 
                key={team.id} 
                id={team.id} 
                name={team.name} 
                score={Number(team.score)} 
                rank={index + 1} 
                color={team.color || '#3b82f6'} 
                isAuthenticated={!!session}
              />
            ))}
          </div>
        </div>
      )}

      <Separator className="my-8" />

      <ScoreProgressionChart teams={teams} events={events} />
    </div>
  )
}

