"use client"

import { forwardRef, useImperativeHandle, useRef } from "react"
import { cardTopOffset, stackHeight } from "@/lib/reveal/MasterTimeline"
import type { RevealTeam } from "@/lib/reveal/types"
import { RevealCard, type RevealCardHandle } from "./RevealCard"

export interface RevealLeaderboardHandle {
  getCardRefs: () => ReturnType<RevealCardHandle["getRefs"]>[]
}

interface RevealLeaderboardProps {
  teams: RevealTeam[]
}

export const RevealLeaderboard = forwardRef<RevealLeaderboardHandle, RevealLeaderboardProps>(
  function RevealLeaderboard({ teams }, ref) {
    const containerRef = useRef<HTMLDivElement>(null)
    const cardHandles = useRef<(RevealCardHandle | null)[]>([])

    useImperativeHandle(ref, () => ({
      getCardRefs: () =>
        cardHandles.current
          .filter((h): h is RevealCardHandle => h !== null)
          .map((h) => h.getRefs()),
    }))

    const height = stackHeight(teams.length)

    return (
      <div ref={containerRef} className="reveal-layer reveal-leaderboard">
        <div className="reveal-cards-stack" style={{ height }}>
          {teams.map((team, index) => {
            const rank = index + 1
            return (
              <RevealCard
                key={team.id}
                ref={(el) => {
                  cardHandles.current[index] = el
                }}
                team={team}
                rank={rank}
                style={{ top: cardTopOffset(index) }}
              />
            )
          })}
        </div>
      </div>
    )
  },
)
