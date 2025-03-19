"use server"

import { revalidatePath } from "next/cache"
import { createTeam, createEvent, deleteEvent, redis, type TeamPoints, getAllTeams, getAllEvents, clearAllData } from "./redis"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function createTeamAction(formData: FormData) {
  const name = formData.get("name") as string
  const color = formData.get("color") as string || '#3b82f6'

  if (!name || name.trim() === "") {
    throw new Error("Tribe naam is verplicht")
  }

  try {
    await createTeam(name.trim(), color)
    revalidatePath("/")
  } catch (error) {
    console.error("Error creating tribe:", error)
    throw new Error("Fout bij het aanmaken van tribe")
  }
}

export async function deleteTeamAction(formData: FormData) {
  const id = formData.get("id") as string

  if (!id) {
    throw new Error("Tribe ID is required")
  }

  try {
    const team = await redis.hgetall(`team:${id}`)
    if (!team) {
      throw new Error("Tribe not found")
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
    console.error("Failed to delete tribe:", error)
    throw new Error("Failed to delete tribe")
  }
}

export async function createEventAction(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.name) {
    throw new Error("Not authenticated")
  }

  const teamId = formData.get("teamId") as string
  const description = formData.get("description") as string
  const pointsStr = formData.get("points") as string
  const points = Number.parseInt(pointsStr, 10)

  if (!description || description.trim() === "") {
    throw new Error("Spel beschrijving is verplicht")
  }

  if (isNaN(points)) {
    throw new Error("Punten moeten een getal zijn")
  }

  try {
    await createEvent(teamId, description.trim(), points, session.user.name)
    revalidatePath(`/teams/${teamId}`)
    revalidatePath("/")
  } catch (error) {
    throw new Error("Fout bij het aanmaken van spel")
  }
}

export async function createMultiTeamEventAction(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.name) {
    throw new Error("Not authenticated")
  }

  const description = formData.get("description") as string
  const teamPointsDataStr = formData.get("teamPointsData") as string
  const teamPointsData = JSON.parse(teamPointsDataStr) as TeamPoints[]

  if (!description || description.trim() === "") {
    throw new Error("Spel beschrijving is verplicht")
  }

  if (teamPointsData.length === 0) {
    throw new Error("Selecteer minstens één tribe")
  }

  try {
    // Create a separate event for each team with their respective points
    for (const teamPoint of teamPointsData) {
      await createEvent(
        teamPoint.teamId,
        description.trim(),
        teamPoint.points,
        session.user.name
      )
    }
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    return { error: "Fout bij het aanmaken van spel" }
  }
}

export async function deleteEventAction(formData: FormData) {
  const id = formData.get("id") as string

  try {
    const teamId = await deleteEvent(id)
    revalidatePath(`/teams/${teamId}`)
    revalidatePath("/")
  } catch (error) {
    throw new Error("Fout bij het verwijderen van spel")
  }
}

export async function updateTeamScoreAction(formData: FormData) {
  const id = formData.get("id")
  const score = formData.get("score")

  if (!id || !score) {
    throw new Error("Tribe ID en score zijn verplicht")
  }

  try {
    const team = await redis.hgetall(`team:${id}`)
    if (!team) {
      throw new Error("Tribe niet gevonden")
    }

    const newScore = Number(team.score) + Number(score)
    await redis.hset(`team:${id}`, { ...team, score: newScore })
    await redis.zadd("teams", { score: newScore, member: id })

    revalidatePath("/")
  } catch (error) {
    console.error("Failed to update tribe score:", error)
    throw new Error("Fout bij het bijwerken van tribe score")
  }
}

export async function getTeamsAction() {
  try {
    const teams = await getAllTeams()
    return teams
  } catch (error) {
    console.error("Error fetching tribes:", error)
    throw new Error("Fout bij het ophalen van tribes")
  }
}

export async function exportTeamsAction() {
  try {
    const teams = await getAllTeams()
    const csvRows = [
      ["Tribe Naam", "Score", "Kleur"], // Header row
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
    console.error("Error exporting tribes:", error)
    throw new Error("Fout bij het exporteren van tribes")
  }
}

export async function exportEventsAction() {
  try {
    const events = await getAllEvents()
    const csvRows = [
      ["Datum", "Tribe", "Beschrijving", "Punten", "Toegevoegd door"], // Header row
      ...events.map(event => [
        new Date(event.createdAt).toLocaleString("nl-NL"),
        event.teamName,
        event.description,
        event.points,
        event.creatorName
      ])
    ]
    
    const csvContent = csvRows
      .map(row => row.map(cell => `"${cell}"`).join(","))
      .join("\n")
    
    return csvContent
  } catch (error) {
    console.error("Error exporting spells:", error)
    throw new Error("Fout bij het exporteren van spellen")
  }
}

export async function clearDatabaseAction() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    throw new Error("Not authenticated")
  }

  // Only allow specific email to clear the database
  if (session.user.email !== "mfesevur@gmail.com") {
    throw new Error("Unauthorized")
  }

  try {
    await clearAllData()
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error clearing database:", error)
    throw new Error("Failed to clear database")
  }
}

