import type { RevealTeam } from "@/lib/reveal/types"



interface RevealStaticStandingsProps {

  teams: RevealTeam[]

}



export function RevealStaticStandings({ teams }: RevealStaticStandingsProps) {

  return (

    <div className="reveal-static">

      <h1>Standings</h1>

      <div className="reveal-static-list" role="list">

        {teams.map((team, index) => (

          <div

            key={team.id}

            role="listitem"

            className={`reveal-static-item${index === 0 ? " reveal-static-item--winner" : ""}`}

          >

            <span className="reveal-card-rank">#{index + 1}</span>

            <div className="reveal-card-accent" style={{ backgroundColor: team.color }} />

            <span className="reveal-card-name">{team.name}</span>

            <span className="reveal-card-total">{team.totalScore.toLocaleString()}</span>

          </div>

        ))}

      </div>

    </div>

  )

}


