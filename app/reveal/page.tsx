import { RevealExperience } from "@/components/reveal/RevealExperience"

import { DEMO_REVEAL_TEAMS, mapTeamsToReveal } from "@/lib/reveal/mapTeams"

import { getAllTeams } from "@/lib/redis"



export const dynamic = "force-dynamic"



export default async function RevealPage() {

  const teams = await getAllTeams()

  const revealTeams = teams.length > 0 ? await mapTeamsToReveal(teams) : DEMO_REVEAL_TEAMS



  return <RevealExperience teams={revealTeams} />

}


