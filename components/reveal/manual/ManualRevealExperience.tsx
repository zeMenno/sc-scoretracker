"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useRevealScale } from "@/hooks/reveal/useRevealScale"
import {
  animateCardReveal,
  animateWinnerGlow,
  getNewlyRevealedIndices,
  initManualRevealCards,
} from "@/lib/reveal/manualRevealStep"
import { ParticleEngine } from "@/lib/reveal/ParticleEngine"
import type { RevealTeam } from "@/lib/reveal/types"
import { ArenaGrid } from "../ArenaGrid"
import { CameraController } from "../CameraController"
import { RevealBackground } from "../RevealBackground"
import { RevealLeaderboard, type RevealLeaderboardHandle } from "../RevealLeaderboard"
import "../reveal.css"

interface ManualRevealExperienceProps {
  teams: RevealTeam[]
}

function nextRevealedCount(current: number, total: number): number {
  if (current >= total) return current
  if (current === total - 2) return total
  return current + 1
}

export function ManualRevealExperience({ teams }: ManualRevealExperienceProps) {
  const scale = useRevealScale()
  const [revealedCount, setRevealedCount] = useState(0)
  const total = teams.length

  const leaderboardRef = useRef<RevealLeaderboardHandle>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const winnerGlowRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const particlesEngineRef = useRef<ParticleEngine | null>(null)
  const isAnimatingRef = useRef(false)
  const revealedCountRef = useRef(0)

  useEffect(() => {
    revealedCountRef.current = revealedCount
  }, [revealedCount])

  useEffect(() => {
    if (!particlesRef.current) return

    const engine = new ParticleEngine(particlesRef.current)
    particlesEngineRef.current = engine

    return () => {
      engine.destroy()
      particlesEngineRef.current = null
    }
  }, [])

  useEffect(() => {
    if (total === 0) return

    let cancelled = false

    function initScene() {
      if (cancelled) return

      const cards = leaderboardRef.current?.getCardRefs() ?? []
      if (cards.length !== total) {
        requestAnimationFrame(initScene)
        return
      }

      initManualRevealCards(cards)

      if (backgroundRef.current) {
        backgroundRef.current.style.opacity = "1"
      }

      if (winnerGlowRef.current) {
        winnerGlowRef.current.style.backgroundColor = teams[0]?.color ?? "#ffd700"
        winnerGlowRef.current.style.opacity = "0"
      }
    }

    initScene()

    return () => {
      cancelled = true
    }
  }, [teams, total])

  const runRevealStep = useCallback(
    async (prevCount: number, newCount: number) => {
      const cards = leaderboardRef.current?.getCardRefs() ?? []
      const particles = particlesEngineRef.current
      if (cards.length !== total || !particles) return

      const indices = getNewlyRevealedIndices(prevCount, newCount, total)
      if (indices.length === 0) return

      isAnimatingRef.current = true

      try {
        for (const index of indices) {
          const team = teams[index]
          const card = cards[index]
          if (!team || !card) continue

          const isWinner = index === 0
          await animateCardReveal(card, team, particles, isWinner)
        }

        if (indices.includes(0) && winnerGlowRef.current) {
          await animateWinnerGlow(winnerGlowRef.current, teams[0]?.color ?? "#ffd700")
        }
      } finally {
        isAnimatingRef.current = false
      }
    },
    [teams, total],
  )

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.code !== "Space" && event.key !== " ") return
      if (event.repeat) return
      if (isAnimatingRef.current) return

      const current = revealedCountRef.current
      if (total === 0 || current >= total) return

      event.preventDefault()

      const newCount = nextRevealedCount(current, total)
      setRevealedCount(newCount)
      void runRevealStep(current, newCount)
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [total, runRevealStep])

  if (total === 0) {
    return (
      <div className="reveal-root reveal-static">
        <h1>No teams to reveal</h1>
      </div>
    )
  }

  return (
    <div className="reveal-root">
      <CameraController scale={scale}>
        <RevealBackground ref={backgroundRef} />
        <ArenaGrid />
        <div ref={winnerGlowRef} className="reveal-winner-glow" aria-hidden />
        <RevealLeaderboard ref={leaderboardRef} teams={teams} />
      </CameraController>

      <div ref={particlesRef} className="reveal-particles" aria-hidden />

      {revealedCount === 0 && (
        <p className="manual-reveal-hint">Press Space to reveal</p>
      )}
    </div>
  )
}
