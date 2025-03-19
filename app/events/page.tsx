import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { EventsClient } from "@/app/events/events-client"
import { getAllTeams, getAllEvents } from "@/lib/redis"

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const session = await getServerSession(authOptions)
  const teams = await getAllTeams()
  const events = await getAllEvents()
  
  return <EventsClient initialSession={session} initialTeams={teams} initialEvents={events} />
} 