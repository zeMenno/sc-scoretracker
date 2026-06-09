"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import {
  createMasterTimeline,
  holdFinalFrame,
  resetRevealScene,
  setIdlePreviewState,
} from "@/lib/reveal/MasterTimeline"
import { ParticleEngine } from "@/lib/reveal/ParticleEngine"
import type { RevealPlaybackState, RevealTeam } from "@/lib/reveal/types"
import { useReducedMotion } from "@/hooks/reveal/useReducedMotion"
import { useRevealScale } from "@/hooks/reveal/useRevealScale"
import { ArenaGrid } from "./ArenaGrid"
import { CameraController } from "./CameraController"
import { LightSweepLayer } from "./LightSweepLayer"
import { RevealBackground } from "./RevealBackground"
import { RevealLeaderboard, type RevealLeaderboardHandle } from "./RevealLeaderboard"
import { RevealStaticStandings } from "./RevealStaticStandings"
import { RevealTrigger } from "./RevealTrigger"
import { ShockwaveOverlay } from "./ShockwaveOverlay"
import "./reveal.css"

interface RevealExperienceProps {
  teams: RevealTeam[]
}

function collectRefs(
  camera: HTMLDivElement,
  background: HTMLDivElement,
  lightSweep: HTMLDivElement,
  arena: HTMLDivElement,
  shockwave: HTMLDivElement,
  winnerGlow: HTMLDivElement,
  blackOverlay: HTMLDivElement,
  cards: ReturnType<RevealLeaderboardHandle["getCardRefs"]>,
) {
  return {
    camera,
    background,
    lightSweep,
    arena,
    leaderboard: arena,
    shockwave,
    winnerGlow,
    blackOverlay,
    cards,
  }
}

export function RevealExperience({ teams }: RevealExperienceProps) {
  const reducedMotion = useReducedMotion()
  const scale = useRevealScale()
  const [playbackState, setPlaybackState] = useState<RevealPlaybackState>("idle")
  const [playSession, setPlaySession] = useState(0)

  const cameraRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const lightSweepRef = useRef<HTMLDivElement>(null)
  const arenaRef = useRef<HTMLDivElement>(null)
  const leaderboardRef = useRef<RevealLeaderboardHandle>(null)
  const shockwaveRef = useRef<HTMLDivElement>(null)
  const winnerGlowRef = useRef<HTMLDivElement>(null)
  const blackOverlayRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const completingRef = useRef(false)

  const getSceneRefs = useCallback(() => {
    const camera = cameraRef.current
    const background = backgroundRef.current
    const lightSweep = lightSweepRef.current
    const arena = arenaRef.current
    const shockwave = shockwaveRef.current
    const winnerGlow = winnerGlowRef.current
    const blackOverlay = blackOverlayRef.current
    const cards = leaderboardRef.current?.getCardRefs() ?? []

    if (
      !camera ||
      !background ||
      !lightSweep ||
      !arena ||
      !shockwave ||
      !winnerGlow ||
      !blackOverlay ||
      cards.length !== teams.length
    ) {
      return null
    }

    return collectRefs(camera, background, lightSweep, arena, shockwave, winnerGlow, blackOverlay, cards)
  }, [teams.length])

  useEffect(() => {
    if (reducedMotion || teams.length === 0 || playbackState !== "idle") return

    const refs = getSceneRefs()
    if (!refs) return

    winnerGlowRef.current!.style.backgroundColor = teams[0]?.color ?? "#ffd700"
    setIdlePreviewState(refs)
  }, [playbackState, teams, reducedMotion, getSceneRefs])

  useEffect(() => {
    if (reducedMotion || teams.length === 0 || playbackState !== "playing") return

    const refs = getSceneRefs()
    if (!refs) return

    completingRef.current = false
    winnerGlowRef.current!.style.backgroundColor = teams[0]?.color ?? "#ffd700"

    const particles = new ParticleEngine(particlesRef.current!)
    const tl = createMasterTimeline({
      refs,
      teams,
      particles,
      onComplete: () => {
        completingRef.current = true
        holdFinalFrame(refs)
        setPlaybackState("complete")
      },
    })

    const startTimer = requestAnimationFrame(() => {
      tl.play()
    })

    return () => {
      cancelAnimationFrame(startTimer)
      tl.pause()
      particles.destroy()

      if (!completingRef.current) {
        const cleanupRefs = getSceneRefs()
        if (cleanupRefs) {
          resetRevealScene(cleanupRefs)
        }
      }

      completingRef.current = false
    }
  }, [playbackState, playSession, teams, reducedMotion, getSceneRefs])

  const handleStartReveal = useCallback(() => {
    setPlaybackState("playing")
  }, [])

  const handleReplay = useCallback(() => {
    setPlaySession((session) => session + 1)
    setPlaybackState("playing")
  }, [])

  if (reducedMotion) {
    return (
      <div className="reveal-root">
        <RevealStaticStandings teams={teams} />
      </div>
    )
  }

  if (teams.length === 0) {
    return (
      <div className="reveal-root reveal-static">
        <h1>No teams to reveal</h1>
      </div>
    )
  }

  return (
    <div className="reveal-root">
      <CameraController ref={cameraRef} scale={scale}>
        <RevealBackground ref={backgroundRef} />
        <LightSweepLayer ref={lightSweepRef} />
        <ArenaGrid ref={arenaRef} />
        <div ref={winnerGlowRef} className="reveal-winner-glow" aria-hidden />
        <RevealLeaderboard ref={leaderboardRef} teams={teams} />
        <ShockwaveOverlay ref={shockwaveRef} />
        <div ref={blackOverlayRef} className="reveal-layer reveal-black-overlay" aria-hidden />
      </CameraController>

      <div ref={particlesRef} className="reveal-particles" aria-hidden />

      {playbackState === "idle" && (
        <RevealTrigger variant="fullscreen" teamCount={teams.length} onReveal={handleStartReveal} />
      )}

      {playbackState === "complete" && (
        <RevealTrigger variant="compact" onReveal={handleReplay} />
      )}
    </div>
  )
}
