"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { Team, Event } from "@/lib/redis"
import { format, startOfDay, subDays } from "date-fns"
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
  const sortedEvents = [...events].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const dailyScores: { [key: string]: ChartData } = {};

  if (sortedEvents.length > 0) {
    const firstEventDate = startOfDay(new Date(sortedEvents[0].createdAt)).toISOString();
    const previousDay = subDays(new Date(firstEventDate), 1).toISOString();

    // Initialize previous day scores
    dailyScores[previousDay] = createInitialScores(previousDay, teams);

    // Process each event
    sortedEvents.forEach(event => {
      const eventDate = startOfDay(new Date(event.createdAt)).toISOString(); // Group by date only

      if (!dailyScores[eventDate]) {
        dailyScores[eventDate] = createInitialScores(eventDate, teams);
      }

      // Add the event's points to the corresponding team's score
      dailyScores[eventDate][event.teamId] = ((dailyScores[eventDate][event.teamId] as number) || 0) + event.points;
    });

    // Calculate cumulative scores
    calculateCumulativeScores(dailyScores, teams);
  }

  const chartData = Object.values(dailyScores);
  console.log(chartData); // Log chart data for debugging

  return (
    <div className="w-full h-[400px] mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" angle={-45} textAnchor="end" height={80} />
          <YAxis />
          <Tooltip labelFormatter={(_, payload) => payload && payload[0] ? format(payload[0].payload.fullTimestamp, "dd/MM/yyyy", { locale: nl }) : ""} />
          <Legend />
          {teams.map((team) => (
            <Line key={team.id} type="monotone" dataKey={team.id} name={team.name} stroke={team.color} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Helper function to create initial scores
const createInitialScores = (date: string, teams: Team[]): ChartData => ({
  timestamp: format(new Date(date), "dd/MM/yyyy", { locale: nl }),
  fullTimestamp: new Date(date),
  ...Object.fromEntries(teams.map(team => [team.id, 0])) // Initialize scores to 0
});

// Helper function to calculate cumulative scores
const calculateCumulativeScores = (dailyScores: { [key: string]: ChartData }, teams: Team[]) => {
  let cumulativeScores: { [key: string]: number } = {};
  Object.keys(dailyScores).forEach(date => {
    teams.forEach(team => {
      cumulativeScores[team.id] = (cumulativeScores[team.id] || 0) + (dailyScores[date][team.id] as number);
      dailyScores[date][team.id] = cumulativeScores[team.id]; // Update to cumulative score
    });
  });
}; 
