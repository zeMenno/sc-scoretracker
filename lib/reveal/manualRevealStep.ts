import { animate } from "animejs"

import type { ParticleEngine } from "./ParticleEngine"
import { animateCounter } from "./ScoreCounter"
import { EASING, type RevealCardRef, type RevealTeam } from "./types"

const CARD_REVEAL_MS = 500
const WINNER_CARD_REVEAL_MS = 700
const WINNER_GLOW_MS = 900

export function initManualRevealCards(cards: RevealCardRef[]): void {
  cards.forEach((card) => {
    card.root.style.opacity = "0"
    card.root.style.transform = "translateY(120px) scale(0.9)"
    card.glow.style.opacity = "0"
    card.totalScore.textContent = "0"
  })
}

export function animateCardReveal(
  card: RevealCardRef,
  team: RevealTeam,
  particles: ParticleEngine,
  isWinner: boolean,
): Promise<void> {
  return new Promise((resolve) => {
    const duration = isWinner ? WINNER_CARD_REVEAL_MS : CARD_REVEAL_MS
    const particleCount = isWinner ? 32 : 16

    const runBurst = () => {
      const rect = card.root.getBoundingClientRect()
      particles.emitBurst(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        team.color,
        particleCount,
      )
      animateCounter(
        card.totalScore,
        0,
        team.totalScore,
        isWinner ? 900 : 600,
        EASING.expo,
      )
    }

    requestAnimationFrame(() => {
      runBurst()
    })

    animate(card.glow, {
      opacity: [{ to: 0 }, { to: isWinner ? 0.9 : 0.5 }, { to: isWinner ? 0.7 : 0.35 }],
      duration,
      ease: EASING.expo,
    })

    animate(card.root, {
      opacity: [{ to: 0 }, { to: 1 }],
      translateY: [{ to: 120 }, { to: isWinner ? -20 : -12 }, { to: 0 }],
      scale: [{ to: 0.85 }, { to: isWinner ? 1.08 : 1.02 }, { to: 1 }],
      duration,
      ease: isWinner ? EASING.spring : EASING.expo,
      onComplete: () => resolve(),
    })
  })
}

export function animateWinnerGlow(winnerGlowEl: HTMLElement, winnerColor: string): Promise<void> {
  winnerGlowEl.style.backgroundColor = winnerColor

  return new Promise((resolve) => {
    animate(winnerGlowEl, {
      opacity: [{ to: 0 }, { to: 0.7 }, { to: 0.45 }],
      scale: [{ to: 0.5 }, { to: 2.5 }],
      duration: WINNER_GLOW_MS,
      ease: EASING.expo,
      onComplete: () => resolve(),
    })
  })
}

export function getNewlyRevealedIndices(
  prevCount: number,
  newCount: number,
  total: number,
): number[] {
  if (newCount <= prevCount || total === 0) return []

  if (prevCount === total - 2 && newCount === total) {
    return total >= 2 ? [1, 0] : [0]
  }

  return [total - newCount]
}
