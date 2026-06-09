## Why

Live competition finales need a dedicated, cinematic reveal moment—not a static leaderboard. The score tracker already stores team standings, but projecting final results on large screens at teen-focused events requires a 10-second, trailer-quality experience that builds anticipation and delivers a memorable winner payoff.

## What Changes

- Add a new `/reveal` route as a fullscreen, projector-optimized cinematic standings reveal page
- Introduce Anime.js v4 as a dependency for orchestrated motion (single master timeline, no scattered timers)
- Build a layered visual system: animated gradient mesh background, light sweeps, perspective arena grid, and premium glassmorphism team cards
- Implement a fixed 10-second animation timeline with five phases: black intro, title boot sequence, bottom-up rank reveals, middle-rank suspense swap, final-two showdown, and explosive winner reveal
- Support dynamic team counts (typically 8, but adaptable to fewer or more teams) with teams pre-sorted by final score
- Add DOM-based particle engine, simulated camera movement, score/delta counters, and shockwave/screen-shake effects—all transform/opacity driven for 60 FPS
- Provide `prefers-reduced-motion` accessibility mode that skips cinematic effects and shows standings cleanly
- Organize code under `app/reveal`, `components/reveal`, `hooks/reveal`, and `lib/reveal` with separated animation modules

## Capabilities

### New Capabilities

- `ranking-reveal-page`: Fullscreen cinematic competition standings reveal at `/reveal`, including visual layers, 10-second timeline choreography, team card design, particle/camera systems, reduced-motion fallback, and responsive scaling for 1080p through 4K displays

### Modified Capabilities

<!-- No existing openspec specs; no modified capabilities -->

## Impact

- **New route**: `app/reveal/page.tsx` (and supporting client components)
- **New modules**: `components/reveal/*`, `hooks/reveal/*`, `lib/reveal/*` (MasterTimeline, WinnerSequence, RevealCard, ParticleEngine, CameraController, ScoreCounter)
- **New dependency**: `animejs` v4
- **Data**: Consumes `Team` objects with `id`, `name`, `color`, `totalScore`, `deltaScore` (may require mapping from existing Redis `Team` shape with `score`)
- **No breaking changes** to existing pages or APIs; additive feature only
