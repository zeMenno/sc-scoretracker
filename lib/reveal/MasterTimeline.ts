import { createTimeline } from "animejs"
import type { Timeline } from "animejs"

import { addCameraIntroPush, addCameraShowdownZoom } from "./cameraKeyframes"
import type { ParticleEngine } from "./ParticleEngine"
import { computeRankPhases, rankToIndex } from "./rankPhases"
import { animateCounter } from "./ScoreCounter"
import { EASING, TIMELINE, type RevealCardRef, type RevealRefs, type RevealTeam } from "./types"
import { addTopThreeReveal } from "./WinnerSequence"

export const CARD_HEIGHT = 72
export const CARD_GAP = 10

export function stackHeight(teamCount: number): number {
  return teamCount * CARD_HEIGHT + (teamCount - 1) * CARD_GAP
}

export function cardTopOffset(index: number): number {
  return index * (CARD_HEIGHT + CARD_GAP)
}

interface MasterTimelineOptions {
  refs: RevealRefs
  teams: RevealTeam[]
  particles: ParticleEngine
  onComplete?: () => void
}

export function createMasterTimeline({
  refs,
  teams,
  particles,
  onComplete,
}: MasterTimelineOptions): Timeline {
  const tl = createTimeline({
    autoplay: false,
    defaults: { ease: EASING.expo },
    onComplete,
  })

  const teamCount = teams.length
  const phases = computeRankPhases(teamCount)

  resetRevealScene(refs)

  addIntroPhase(tl, refs, particles)
  addPodiumSuspensePhase(tl, refs)
  addTopThreeReveal({
    tl,
    refs,
    teams,
    particles,
    podiumRanks: phases.podiumRanks,
    teamCount,
    at: TIMELINE.PODIUM_SUSPENSE_END,
  })
  addTailRanksPhase(tl, refs, teams, particles, phases, teamCount)

  return tl
}

export function setIdlePreviewState(refs: RevealRefs): void {
  refs.camera.style.transform = ""
  refs.blackOverlay.style.opacity = "0.55"
  refs.background.style.opacity = "0.45"
  refs.winnerGlow.style.opacity = "0"
  refs.shockwave.style.opacity = "0"
  refs.shockwave.style.transform = "scale(0)"

  refs.cards.forEach((card) => {
    card.root.style.opacity = "0"
    card.root.style.transform = "translateY(120px) scale(0.9)"
    card.glow.style.opacity = "0"
    card.totalScore.textContent = "0"
  })
}

export function resetRevealScene(refs: RevealRefs): void {
  refs.camera.style.transform = ""
  refs.blackOverlay.style.opacity = "1"
  refs.background.style.opacity = "0"
  refs.winnerGlow.style.opacity = "0"
  refs.shockwave.style.opacity = "0"
  refs.shockwave.style.transform = "scale(0)"

  refs.cards.forEach((card) => {
    card.root.style.opacity = "0"
    card.root.style.transform = "translateY(120px) scale(0.9)"
    card.glow.style.opacity = "0"
    card.totalScore.textContent = "0"
  })
}

export function holdFinalFrame(refs: RevealRefs): void {
  refs.blackOverlay.style.opacity = "0"
  refs.background.style.opacity = "1"
  refs.shockwave.style.opacity = "0"
  refs.shockwave.style.transform = "scale(0)"

  refs.cards.forEach((card, index) => {
    card.root.style.opacity = index === 0 ? "1" : "0.85"
    card.root.style.transform = "translateY(0) scale(1)"
    card.glow.style.opacity = index === 0 ? "0.7" : "0.35"
  })
}

function addIntroPhase(tl: Timeline, refs: RevealRefs, particles: ParticleEngine): void {
  tl.add(
    refs.blackOverlay,
    {
      opacity: [{ to: 1 }, { to: 0.3 }],
      duration: TIMELINE.INTRO_END,
      ease: EASING.expo,
    },
    0,
  )

  tl.add(
    refs.background,
    {
      opacity: [{ to: 0 }, { to: 1 }],
      duration: TIMELINE.INTRO_END,
      ease: EASING.expo,
    },
    150,
  )

  tl.add(
    refs.lightSweep,
    {
      translateX: [{ to: "-30%" }, { to: "130%" }],
      opacity: [{ to: 0 }, { to: 0.6 }, { to: 0 }],
      duration: 700,
      ease: EASING.expo,
    },
    200,
  )

  tl.call(
    () => {
      particles.emitBurst(window.innerWidth / 2, window.innerHeight / 2, "#ffffff", 12)
    },
    300,
  )

  addCameraIntroPush(tl, refs.camera, 400)
}

function addPodiumSuspensePhase(tl: Timeline, refs: RevealRefs): void {
  const at = TIMELINE.INTRO_END

  addCameraShowdownZoom(tl, refs.camera, at)

  tl.add(
    refs.lightSweep,
    {
      translateX: [{ to: "130%" }, { to: "-30%" }],
      opacity: [{ to: 0 }, { to: 0.8 }, { to: 0 }],
      duration: 1000,
      ease: EASING.expo,
    },
    at + 100,
  )
}

function addTailRanksPhase(
  tl: Timeline,
  refs: RevealRefs,
  teams: RevealTeam[],
  particles: ParticleEngine,
  phases: ReturnType<typeof computeRankPhases>,
  teamCount: number,
): void {
  let offset = TIMELINE.PODIUM_REVEAL_END

  phases.tailRanks.forEach((rank) => {
    const index = rankToIndex(rank, teamCount)
    const card = refs.cards[index]
    const team = teams[index]
    if (!card || !team) return

    revealTailCard(tl, card, team, offset, particles)
    offset += phases.tailStaggerMs
  })
}

function revealTailCard(
  tl: Timeline,
  card: RevealCardRef,
  team: RevealTeam,
  at: number,
  particles: ParticleEngine,
): void {
  tl.add(
    card.root,
    {
      opacity: [{ to: 0 }, { to: 0.85 }],
      translateY: [{ to: 80 }, { to: -6 }, { to: 0 }],
      scale: [{ to: 0.92 }, { to: 1.01 }, { to: 1 }],
      duration: 400,
      ease: EASING.expo,
    },
    at,
  )

  tl.add(
    card.glow,
    {
      opacity: [{ to: 0 }, { to: 0.4 }, { to: 0.25 }],
      duration: 400,
      ease: EASING.expo,
    },
    at,
  )

  tl.call(
    () => {
      const rect = card.root.getBoundingClientRect()
      particles.emitBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, team.color, 10)
      animateCounter(card.totalScore, 0, team.totalScore, 400, EASING.expo)
    },
    at + 80,
  )
}
