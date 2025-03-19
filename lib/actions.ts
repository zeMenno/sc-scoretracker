"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createTeam, deleteTeam, createEvent, deleteEvent, createMultiTeamEvent, redis, type TeamPoints, getAllTeams, getAllEvents } from "./redis"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createTeamAction(formData: FormData) {
  const name = formData.get("name") as string
  const color = formData.get("color") as string || '#3b82f6'

  if (!name || name.trim() === "") {
    throw new Error("Team naam is verplicht")
  }

  try {
    await createTeam(name.trim(), color)
    revalidatePath("/")
  } catch (error) {
    console.error("Error creating team:", error)
    throw new Error("Fout bij het aanmaken van team")
  }
}

export async function deleteTeamAction(formData: FormData) {
  const id = formData.get("id") as string

  if (!id) {
    throw new Error("Team ID is required")
  }

  try {
    const team = await redis.hgetall(`team:${id}`)
    if (!team) {
      throw new Error("Team not found")
    }

    // Delete all events for this team
    const events = await redis.smembers(`team:${id}:events`)
    for (const eventId of events) {
      await redis.del(`event:${eventId}`)
    }
    await redis.del(`team:${id}:events`)

    // Delete the team
    await redis.del(`team:${id}`)
    await redis.srem("teams", id)

    revalidatePath("/")
  } catch (error) {
    console.error("Failed to delete team:", error)
    throw new Error("Failed to delete team")
  }
}

export async function createEventAction(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    throw new Error("Not authenticated")
  }

  const teamId = formData.get("teamId") as string
  const description = formData.get("description") as string
  const pointsStr = formData.get("points") as string
  const points = Number.parseInt(pointsStr, 10)

  if (!description || description.trim() === "") {
    throw new Error("Event description is required")
  }

  if (isNaN(points)) {
    throw new Error("Points must be a number")
  }

  try {
    await createEvent(teamId, description.trim(), points, session.user.email)
    revalidatePath(`/teams/${teamId}`)
    revalidatePath("/")
  } catch (error) {
    throw new Error("Failed to create event")
  }
}

export async function createMultiTeamEventAction(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    throw new Error("Not authenticated")
  }

  const description = formData.get("description") as string
  const teamPointsDataStr = formData.get("teamPointsData") as string
  const teamPointsData = JSON.parse(teamPointsDataStr) as TeamPoints[]

  if (!description || description.trim() === "") {
    throw new Error("Event description is required")
  }

  if (teamPointsData.length === 0) {
    throw new Error("Select at least one team")
  }

  try {
    // Create a separate event for each team with their respective points
    for (const teamPoint of teamPointsData) {
      await createEvent(
        teamPoint.teamId,
        description.trim(),
        teamPoint.points,
        session.user.email
      )
    }
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: "Failed to create event" }
  }
}

export async function deleteEventAction(formData: FormData) {
  const id = formData.get("id") as string

  try {
    const teamId = await deleteEvent(id)
    revalidatePath(`/teams/${teamId}`)
    revalidatePath("/")
  } catch (error) {
    throw new Error("Failed to delete event")
  }
}

export async function updateTeamScoreAction(formData: FormData) {
  const id = formData.get("id")
  const score = formData.get("score")

  if (!id || !score) {
    throw new Error("Team ID and score are required")
  }

  try {
    const team = await redis.hgetall(`team:${id}`)
    if (!team) {
      throw new Error("Team not found")
    }

    const newScore = Number(team.score) + Number(score)
    await redis.hset(`team:${id}`, { ...team, score: newScore })
    await redis.zadd("teams", { score: newScore, member: id })

    revalidatePath("/")
  } catch (error) {
    console.error("Failed to update team score:", error)
    throw new Error("Failed to update team score")
  }
}

export async function getTeamsAction() {
  try {
    const teams = await getAllTeams()
    return teams
  } catch (error) {
    console.error("Error fetching teams:", error)
    throw new Error("Fout bij het ophalen van teams")
  }
}

export async function exportTeamsAction() {
  try {
    const teams = await getAllTeams()
    const csvRows = [
      ["Team Naam", "Score", "Kleur"], // Header row
      ...teams.map(team => [
        team.name,
        team.score,
        team.color
      ])
    ]
    
    const csvContent = csvRows
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n")
    
    return csvContent
  } catch (error) {
    console.error("Error exporting teams:", error)
    throw new Error("Fout bij het exporteren van teams")
  }
}

export async function exportEventsAction() {
  try {
    const events = await getAllEvents()
    const csvRows = [
      ["Datum", "Team", "Beschrijving", "Punten"], // Header row
      ...events.map(event => [
        new Date(event.createdAt).toLocaleString("nl-NL"),
        event.teamName,
        event.description,
        event.points
      ])
    ]
    
    const csvContent = csvRows
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n")
    
    return csvContent
  } catch (error) {
    console.error("Error exporting events:", error)
    throw new Error("Fout bij het exporteren van events")
  }
}

