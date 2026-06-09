import type { RankPhases } from "./types"

/** 1-based rank positions for each reveal phase */
export function computeRankPhases(teamCount: number): RankPhases {
  if (teamCount <= 0) {
    return { podiumRanks: [], tailRanks: [], tailStaggerMs: 0 }
  }

  const podiumRanks: number[] = []
  if (teamCount >= 3) {
    podiumRanks.push(3, 2, 1)
  } else if (teamCount === 2) {
    podiumRanks.push(2, 1)
  } else {
    podiumRanks.push(1)
  }

  const tailRanks: number[] = []
  if (teamCount >= 4) {
    for (let rank = 4; rank <= teamCount; rank++) {
      tailRanks.push(rank)
    }
  }

  const baseTailStagger = 300
  const tailStaggerMs =
    tailRanks.length > 5
      ? Math.max(250, Math.floor((4000 / tailRanks.length) * 0.85))
      : baseTailStagger

  return { podiumRanks, tailRanks, tailStaggerMs }
}

export function rankToIndex(rank: number, teamCount: number): number {
  return teamCount - rank
}
