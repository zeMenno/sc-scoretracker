"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Team, Event } from "@/lib/redis"
import { format, isSameDay, differenceInMinutes, startOfMinute, addMinutes } from "date-fns"
import { nl } from "date-fns/locale"

interface ScoreProgressionChartProps {
  teams: Team[]
  events: Event[]
}

interface ChartData {
  timestamp: string
  fullTimestamp: Date
  [key: string]: string | number | Date // teamId -> score
}

export function ScoreProgressionChart({ teams, events }: ScoreProgressionChartProps) {
  // Sort events by timestamp
  const sortedEvents = [...events].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  // Create 30-minute interval data points
  const intervalData: ChartData[] = []
  if (sortedEvents.length > 0) {
    const startTime = startOfMinute(new Date(sortedEvents[0].createdAt))
    const endTime = addMinutes(new Date(sortedEvents[sortedEvents.length - 1].createdAt), 30)

    let currentTime = startTime
    while (currentTime <= endTime) {
      // Calculate scores up to current time
      const scores = new Map<string, number>()
      teams.forEach(team => {
        scores.set(team.id, 0)
      })

      sortedEvents.forEach(event => {
        if (new Date(event.createdAt) <= currentTime) {
          const currentScore = scores.get(event.teamId) || 0
          scores.set(event.teamId, currentScore + event.points)
        }
      })

      intervalData.push({
        timestamp: format(currentTime, "HH:mm", { locale: nl }),
        fullTimestamp: currentTime,
        ...Object.fromEntries(scores)
      })

      currentTime = addMinutes(currentTime, 30)
    }
  }

  // Custom tick formatter to show date only when it changes or when events are more than 15 minutes apart
  const formatTick = (index: number) => {
    if (index === 0) return format(intervalData[index].fullTimestamp, "dd/MM HH:mm", { locale: nl })
    
    const currentDate = intervalData[index].fullTimestamp
    const prevDate = intervalData[index - 1].fullTimestamp
    
    const minutesDiff = differenceInMinutes(currentDate, prevDate)
    
    if (minutesDiff < 15) {
      return format(currentDate, "HH:mm", { locale: nl })
    }
    
    return format(currentDate, "dd/MM HH:mm", { locale: nl })
  }

  return (
    <div className="w-full h-[400px] mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={intervalData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            tickFormatter={(_, index) => formatTick(index)}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(_, payload) => {
              if (payload && payload[0]) {
                return format(payload[0].payload.fullTimestamp, "dd/MM HH:mm", { locale: nl })
              }
              return ""
            }}
          />
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