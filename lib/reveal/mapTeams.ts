import type { Team } from "@/lib/redis"

import type { RevealTeam } from "./types"



export async function mapTeamsToReveal(teams: Team[]): Promise<RevealTeam[]> {

  const sorted = [...teams].sort((a, b) => b.score - a.score)



  return sorted.map((team) => ({

    id: team.id,

    name: team.name,

    color: team.color || "#3b82f6",

    totalScore: Number(team.score),

  }))

}



export const DEMO_REVEAL_TEAMS: RevealTeam[] = [

  { id: "1", name: "Phoenix Rising", color: "#ef4444", totalScore: 2840 },

  { id: "2", name: "Neon Wolves", color: "#8b5cf6", totalScore: 2710 },

  { id: "3", name: "Storm Breakers", color: "#3b82f6", totalScore: 2580 },

  { id: "4", name: "Crimson Tide", color: "#f97316", totalScore: 2450 },

  { id: "5", name: "Shadow Legion", color: "#6366f1", totalScore: 2320 },

  { id: "6", name: "Golden Eagles", color: "#eab308", totalScore: 2190 },

  { id: "7", name: "Iron Titans", color: "#64748b", totalScore: 2060 },

  { id: "8", name: "Azure Dragons", color: "#06b6d4", totalScore: 1930 },

]


