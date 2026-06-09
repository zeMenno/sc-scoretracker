import type { Timeline } from "animejs"

import type { ParticleEngine } from "./ParticleEngine"
import { rankToIndex } from "./rankPhases"
import { animateCounter } from "./ScoreCounter"
import { EASING } from "./types"
import type { RevealCardRef, RevealRefs, RevealTeam } from "./types"
import { addCameraWinnerImpact, addScreenShake } from "./cameraKeyframes"

interface TopThreeRevealOptions {
  tl: Timeline
  refs: RevealRefs
  teams: RevealTeam[]
  particles: ParticleEngine
  podiumRanks: number[]
  teamCount: number
  at: number
}

export function addTopThreeReveal({
  tl,
  refs,
  teams,
  particles,
  podiumRanks,
  teamCount,
  at,
}: TopThreeRevealOptions): void {
  const revealAt = at

  podiumRanks.forEach((rank) => {
    const index = rankToIndex(rank, teamCount)
    const card = refs.cards[index]
    const team = teams[index]
    if (!card || !team) return

    revealPodiumCard(tl, card, team, revealAt, particles, rank === 1)
  })

  const winnerCard = refs.cards[0]
  const winner = teams[0]
  if (!winnerCard || !winner) return

  tl.call(
    () => {
      const rect = winnerCard.root.getBoundingClientRect()
      particles.emitBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, winner.color, 48)
      particles.emitConfetti(50)
    },
    revealAt + 200,
  )

  tl.add(
    refs.winnerGlow,
    {
      opacity: [{ to: 0 }, { to: 0.7 }, { to: 0.45 }],
      scale: [{ to: 0.5 }, { to: 2.5 }],
      duration: 900,
      ease: EASING.expo,
    },
    revealAt,
  )

  tl.add(
    refs.background,
    {
      filter: [
        { to: "brightness(1)" },
        { to: "brightness(1.3) saturate(1.4)" },
        { to: "brightness(1.1) saturate(1.2)" },
      ],
      duration: 800,
      ease: EASING.expo,
    },
    revealAt,
  )

  addCameraWinnerImpact(tl, refs.camera, revealAt + 100)
  addScreenShake(tl, refs.camera, revealAt + 150)

  tl.add(
    winnerCard.root,
    {
      scale: [{ to: 1 }, { to: 1.08 }, { to: 1 }],
      duration: 800,
      ease: EASING.elastic,
    },
    revealAt + 100,
  )

  tl.add(
    winnerCard.glow,
    {
      opacity: [{ to: 0.4 }, { to: 1 }, { to: 0.7 }],
      scale: [{ to: 0.9 }, { to: 1.15 }, { to: 1 }],
      duration: 800,
      ease: EASING.elastic,
    },
    revealAt,
  )
}

function revealPodiumCard(
  tl: Timeline,
  card: RevealCardRef,
  team: RevealTeam,
  at: number,
  particles: ParticleEngine,
  isWinner: boolean,
): void {
  tl.add(
    card.root,
    {
      opacity: [{ to: 0 }, { to: 1 }],
      translateY: [{ to: 120 }, { to: isWinner ? -20 : -12 }, { to: 0 }],
      scale: [{ to: 0.85 }, { to: isWinner ? 1.08 : 1.02 }, { to: 1 }],
      duration: isWinner ? 700 : 550,
      ease: EASING.spring,
    },
    at,
  )

  tl.call(
    () => {
      const rect = card.root.getBoundingClientRect()
      particles.emitBurst(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        team.color,
        isWinner ? 32 : 20,
      )
      animateCounter(card.totalScore, 0, team.totalScore, isWinner ? 900 : 600, EASING.expo)
    },
    at + 150,
  )

  tl.add(
    card.glow,
    {
      opacity: [{ to: 0 }, { to: isWinner ? 0.9 : 0.8 }, { to: isWinner ? 0.7 : 0.4 }],
      duration: 500,
      ease: EASING.expo,
    },
    at,
  )
}
