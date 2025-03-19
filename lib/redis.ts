import { Redis } from "@upstash/redis"

// Create a Redis client using environment variables
export const redis = Redis.fromEnv()

// Types for our data
export interface Team {
  id: string
  name: string
  score: number
  createdAt: string
  color: string
}

export interface Event {
  id: string
  teamId: string
  description: string
  points: number
  createdAt: string
}

export interface TeamPoints {
  teamId: string
  points: number
}

// Helper functions for team operations
export async function getAllTeams() {
  // Get all team IDs from the set
  const teamIds = await redis.smembers("teams")

  if (!teamIds.length) return []

  // Get all team data using pipeline for efficiency
  const teams = await Promise.all(
    teamIds.map(async (id) => {
      const team = await redis.hgetall(`team:${id}`)
      // Calculate score from events
      const score = await getTeamScore(id)
      return { id, ...team, score } as Team
    }),
  )

  // Sort teams by score (highest first)
  return teams.sort((a, b) => b.score - a.score)
}

export async function getTeamById(id: string) {
  const team = await redis.hgetall(`team:${id}`)
  if (!team) return null

  // Calculate score from events
  const score = await getTeamScore(id)
  return { id, ...team, score } as Team
}

export async function createTeam(name: string, color: string = '#3b82f6') {
  // Generate a unique ID
  const id = crypto.randomUUID()

  // Create team hash
  await redis.hset(`team:${id}`, {
    name,
    createdAt: new Date().toISOString(),
    color,
  })

  // Add team ID to the set of all teams
  await redis.sadd("teams", id)

  return id
}

export async function deleteTeam(id: string) {
  // Get all event IDs for this team
  const eventIds = await redis.smembers(`team:${id}:events`)

  // Delete all events for this team
  for (const eventId of eventIds) {
    await redis.del(`event:${eventId}`)
  }

  // Delete the event set
  await redis.del(`team:${id}:events`)

  // Remove team hash
  await redis.del(`team:${id}`)

  // Remove team ID from the set
  await redis.srem("teams", id)

  return id
}

// Helper functions for event operations
export async function getTeamEvents(teamId: string) {
  // Get all event IDs for this team
  const eventIds = await redis.smembers(`team:${teamId}:events`)

  if (!eventIds.length) return []

  // Get all event data
  const events = await Promise.all(
    eventIds.map(async (id) => {
      const event = await redis.hgetall(`event:${id}`)
      return { id, ...event } as Event
    }),
  )

  // Sort events by creation time (newest first)
  return events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getTeamScore(teamId: string) {
  const events = await getTeamEvents(teamId)
  return events.reduce((total, event) => total + Number(event.points), 0)
}

export async function createEvent(teamId: string, description: string, points: number) {
  // Generate a unique ID
  const id = crypto.randomUUID()

  // Create event hash
  await redis.hset(`event:${id}`, {
    teamId,
    description,
    points,
    createdAt: new Date().toISOString(),
  })

  // Add event ID to the team's event set
  await redis.sadd(`team:${teamId}:events`, id)

  return id
}

export async function createMultiTeamEvent(teamPoints: TeamPoints[], description: string) {
  const timestamp = new Date().toISOString()

  // Create events for each team with their specific points
  await Promise.all(
    teamPoints.map(async ({ teamId, points }) => {
      // Generate a unique ID
      const id = crypto.randomUUID()

      // Create event hash
      await redis.hset(`event:${id}`, {
        teamId,
        description,
        points,
        createdAt: timestamp,
      })

      // Add event ID to the team's event set
      await redis.sadd(`team:${teamId}:events`, id)
    }),
  )

  return teamPoints.map((tp) => tp.teamId)
}

export async function deleteEvent(id: string) {
  // Get the event to find its team
  const rawEvent = await redis.hgetall(`event:${id}`)
  if (!rawEvent) return null

  const event = {
    id,
    teamId: rawEvent.teamId as string,
    description: rawEvent.description as string,
    points: Number(rawEvent.points),
    createdAt: rawEvent.createdAt as string
  }

  // Remove event from the team's event set
  await redis.srem(`team:${event.teamId}:events`, id)

  // Delete the event hash
  await redis.del(`event:${id}`)

  return event.teamId
}

export async function getAllEvents() {
  // Get all team IDs
  const teamIds = await redis.smembers("teams")
  
  // Get all events for each team
  const allEvents = await Promise.all(
    teamIds.map(async (teamId) => {
      const events = await getTeamEvents(teamId)
      const team = await getTeamById(teamId)
      return events.map(event => ({
        ...event,
        teamName: team?.name || 'Unknown Team'
      }))
    })
  )
  
  // Flatten the array and sort by timestamp
  return allEvents
    .flat()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

