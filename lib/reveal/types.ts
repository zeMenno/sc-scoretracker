export type RevealPlaybackState = "idle" | "playing" | "complete"

export interface RevealTeam {
  id: string
  name: string
  color: string
  totalScore: number
}

export const TIMELINE = {
  INTRO_END: 800,
  PODIUM_SUSPENSE_END: 2000,
  PODIUM_REVEAL_END: 4500,
  TAIL_END: 8500,
  TOTAL: 10000,
} as const

export const EASING = {
  expo: "outExpo",
  elastic: "outElastic(1, .6)",
  spring: "spring(1, 80, 10, 0)",
} as const

export interface RevealCardRef {
  root: HTMLElement
  totalScore: HTMLElement
  glow: HTMLElement
}

export interface RevealRefs {
  camera: HTMLElement
  background: HTMLElement
  lightSweep: HTMLElement
  arena: HTMLElement
  leaderboard: HTMLElement
  shockwave: HTMLElement
  winnerGlow: HTMLElement
  blackOverlay: HTMLElement
  cards: RevealCardRef[]
}

export interface RankPhases {
  podiumRanks: number[]
  tailRanks: number[]
  tailStaggerMs: number
}
