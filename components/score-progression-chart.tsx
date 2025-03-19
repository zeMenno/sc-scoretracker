"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Team, Event } from "@/lib/redis"
import { format } from "date-fns"
import { nl } from "date-fns/locale"

interface ScoreProgressionChartProps {
  teams: Team[]
  events: Event[]
}

interface ChartData {
  timestamp: string
  [key: string]: string | number // teamId -> score
}

export function ScoreProgressionChart({ teams, events }: ScoreProgressionChartProps) {
  // Create a map of team scores over time
  const scoreHistory = new Map<string, number>()
  const chartData: ChartData[] = []

  // Sort events by timestamp
  const sortedEvents = [...events].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  // Initialize scores for all teams
  teams.forEach(team => {
    scoreHistory.set(team.id, 0)
  })

  // Create data points for each event
  sortedEvents.forEach(event => {
    const currentScores = { ...Object.fromEntries(scoreHistory) }
    const teamScore = currentScores[event.teamId] || 0
    currentScores[event.teamId] = teamScore + event.points
    scoreHistory.set(event.teamId, currentScores[event.teamId])

    chartData.push({
      timestamp: format(new Date(event.createdAt), "HH:mm", { locale: nl }),
      ...currentScores
    })
  })

  return (
    <div className="w-full h-[400px] mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          {teams.map((team) => (
            <Line
              key={team.id}
              type="monotone"
              dataKey={team.id}
              name={team.name}
              stroke={team.color}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
} 