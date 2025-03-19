"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trash2, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { deleteEventAction } from "@/lib/actions"
import { nl } from "date-fns/locale"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import type { Team, Event } from "@/lib/redis"

interface EventWithTeam extends Event {
  teamName: string
}

type SortField = "description" | "teamName" | "points" | "createdAt" | "creatorName"
type SortDirection = "asc" | "desc"

interface EventsClientProps {
  initialSession: any
  initialTeams: Team[]
  initialEvents: EventWithTeam[]
}

export function EventsClient({ initialSession, initialTeams, initialEvents }: EventsClientProps) {
  const [selectedTeam, setSelectedTeam] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredAndSortedEvents = initialEvents
    .filter(event => selectedTeam === "all" || event.teamId === selectedTeam)
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      const direction = sortDirection === "asc" ? 1 : -1

      if (sortField === "createdAt") {
        return direction * (new Date(aValue as string).getTime() - new Date(bValue as string).getTime())
      }

      if (typeof aValue === "string") {
        return direction * (aValue as string).localeCompare(bValue as string)
      }

      return direction * ((aValue as number) - (bValue as number))
    })

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
              <CardTitle>Events</CardTitle>
              <CardDescription>
                Overzicht van alle events en hun impact op de scores
              </CardDescription>
            </div>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter per team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle teams</SelectItem>
                {initialTeams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("description")}
                >
                  <div className="flex items-center">
                    Event
                    {sortField === "description" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("teamName")}
                >
                  <div className="flex items-center">
                    Team
                    {sortField === "teamName" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("points")}
                >
                  <div className="flex items-center">
                    Punten
                    {sortField === "points" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Datum
                    {sortField === "createdAt" && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                {initialSession && (
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("creatorName")}
                  >
                    <div className="flex items-center">
                      Toegevoegd door
                      {sortField === "creatorName" && (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      )}
                    </div>
                  </TableHead>
                )}
                {initialSession && <TableHead className="w-[100px]"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.description}</TableCell>
                  <TableCell>{event.teamName}</TableCell>
                  <TableCell>{event.points}</TableCell>
                  <TableCell>{format(new Date(event.createdAt), "dd/MM/yyyy HH:mm", { locale: nl })}</TableCell>
                  {initialSession && <TableCell>{event.creatorName}</TableCell>}
                  {initialSession && (
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