## Context

The score tracker is a Next.js 16 App Router app backed by Upstash Redis. Teams have `id`, `name`, `color`, and a computed `score` (sorted descending on the home page). There is no dedicated live-event reveal experience today—standings are shown as static `TeamCard` components.

The `/reveal` page targets projector/TV use at teen-focused live finales. It must deliver a fixed ~10-second cinematic sequence using Anime.js v4, with premium motion design, DOM particles, and a reduced-motion fallback. The page is additive; existing routes and APIs remain unchanged.

## Goals / Non-Goals

**Goals:**

- Fullscreen `/reveal` route with automatic playback on load
- Single Anime.js v4 master timeline orchestrating all phases (no `setTimeout` choreography)
- Layered visual system: gradient mesh, light sweeps, arena grid, glassmorphism cards
- Dynamic adaptation to任意 team count with winner always at index 0
- Separated modules: `MasterTimeline`, `WinnerSequence`, `ParticleEngine`, `CameraController`, `ScoreCounter`, `RevealCard`
- 60 FPS via transform/opacity-only animations
- `prefers-reduced-motion` static fallback
- Responsive scaling from 1080p to 4K

**Non-Goals:**

- Audio/sound effects (bass hit, music tension described in the brief are visual-only cues unless audio assets are added later)
- Real-time score updates during the reveal (data is snapshot at page load)
- Authentication gating on the reveal page (public fullscreen display)
- Canvas/WebGL particle libraries
- Persisting reveal state or replay controls (v1 plays once on mount)

## Decisions

### 1. Route architecture: server page + client orchestrator

**Decision:** `app/reveal/page.tsx` is a Server Component that fetches and maps team data; it passes a `RevealTeam[]` snapshot to a `"use client"` `RevealExperience` component.

**Rationale:** Reuses existing `getAllTeams()` from `lib/redis.ts`. Animation requires client-side DOM refs and Anime.js, so the boundary is at the top-level experience component.

**Alternative considered:** Fully client-side fetch via API route—rejected because SSR snapshot is simpler for event operators (bookmark `/reveal`, data is current at load).

### 2. Reveal-specific data type with mapping layer

**Decision:** Define `RevealTeam` in `lib/reveal/types.ts`:

```ts
interface RevealTeam {
  id: string
  name: string
  color: string
  totalScore: number
  deltaScore: number
}
```

Map from Redis `Team` in `lib/reveal/mapTeams.ts`. `totalScore` = `team.score`. `deltaScore` = points from the most recent event for that team (query last event via existing Redis helpers), or `0` if none.

**Rationale:** Matches the motion-design contract without mutating the core `Team` type used elsewhere.

**Alternative considered:** Extend global `Team` interface—rejected to avoid leaking reveal concerns into the whole app.

### 3. Anime.js v4 as the sole animation orchestrator

**Decision:** Install `animejs` v4. `MasterTimeline.ts` exports `createMasterTimeline(refs, teams, options)` returning a timeline instance. Phase modules (`introSequence`, `bootSequence`, `lowRanksSequence`, `middleDramaSequence`, `showdownSequence`, `WinnerSequence`) append labeled segments to the master timeline.

**Rationale:** User requirement mandates centralized timeline with stagger, spring, `easeOutExpo`, `easeOutElastic`, `cubicBezier`. Anime.js v4 native timeline API fits this model.

**API pattern:**

```ts
import { createTimeline, utils } from 'animejs'

const tl = createTimeline({ autoplay: false })
tl.add(targets, { translateY: [...], ease: 'outExpo', duration: 600 }, 2500)
```

Use `tl.label()` or offset parameters for phase boundaries (0, 1000, 2500, 5500, 7500, 8800, 10000 ms).

### 4. Component layering (z-index stack)

**Decision:** Fixed fullscreen stack inside a `CameraController` wrapper:

| Layer | Component | z-index |
|-------|-----------|---------|
| Background | `RevealBackground` (CSS gradient mesh + noise via pseudo-element) | 0 |
| Light sweep | `LightSweepLayer` (2–3 rotated gradient divs) | 10 |
| Arena | `ArenaGrid` (CSS perspective grid) | 20 |
| Leaderboard | `RevealLeaderboard` + `RevealCard` instances | 30 |
| Overlay FX | `ShockwaveOverlay`, title text, "ONLY TWO REMAIN" | 40 |
| Particles | `ParticleEngine` portal layer | 50 |

All layers are children of the camera container so zoom/pan applies uniformly.

### 5. Rank phase algorithm for variable team counts

**Decision:** `lib/reveal/rankPhases.ts` computes reveal order from `teams.length` (N):

- **Low ranks:** positions N down to `max(5, N - 3)` (bottom 4, or fewer if N < 5)
- **Middle drama:** positions 4 and 3 when N ≥ 4; if N = 3, only position 3 gets drama; if N ≤ 2, skip to showdown
- **Showdown:** always positions 2 and 1 when N ≥ 2
- **Winner:** index 0

Stagger intervals compress slightly when N > 8 so total duration stays ~10s.

### 6. Middle-rank suspense via temporary DOM reorder animation

**Decision:** Before locking cards #4 and #3, animate `translateY` swaps between their slot positions (not React reorder during animation). After swap sequence completes, set final positions matching sorted data.

**Rationale:** Creates illusion of uncertainty without corrupting data order. Transform-only.

### 7. DOM particle engine

**Decision:** `ParticleEngine.ts` maintains a pool of ~60 reusable `<span>` elements. `emitBurst({ x, y, color, count })` assigns random velocity vectors via Anime.js, then recycles on `complete`.

**Rationale:** Lightweight, no canvas, team-color inheritance, GPU-friendly `transform` + `opacity`.

**Limits:** Cap concurrent particles at 120; drop excess to protect projector hardware.

### 8. Camera simulation

**Decision:** `CameraController.ts` wraps content in a `div` with `transform-origin: center center`. Timeline keyframes apply `scale`, `translateX/Y`, `rotateZ` (max ±0.5°) synchronized to phases—push-in during boot, slow zoom during showdown, impact punch on winner.

### 9. Score counters

**Decision:** `ScoreCounter.ts` exports `animateCounter(element, from, to, duration, ease)` using Anime.js `onUpdate` with `Math.round` interpolation. `RevealCard` holds refs for total and delta score spans.

### 10. Reduced motion

**Decision:** `hooks/reveal/useReducedMotion.ts` wraps `matchMedia('(prefers-reduced-motion: reduce)')`. When true, `RevealExperience` renders `RevealStaticStandings` (simple vertical list of all teams, final order) and never mounts `MasterTimeline`.

### 11. Styling approach

**Decision:** Tailwind v4 utility classes for layout/typography; scoped CSS variables in `components/reveal/reveal.css` for glassmorphism (`backdrop-blur`, gradient borders via `border-image` or pseudo-elements), team color glow (`box-shadow` only on static states, animated glow via `filter`/`opacity` on a pseudo-element).

**Avoid:** `tailwindcss-animate` utilities for this page—motion is Anime.js driven.

### 12. Responsive scaling

**Decision:** Root container uses `clamp()` font sizes and `vmin`-based card dimensions. Base design at 1920×1080; `scale` on camera container adjusts for viewports > 1920 via `useRevealScale` hook reading `window.innerWidth / 1920` capped at 2.0 for 4K.

### 13. Layout isolation

**Decision:** `app/reveal/layout.tsx` overrides root layout—no toaster distraction, `overflow: hidden`, black background, optional `metadata` title "Final Results".

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Anime.js v4 API differs from v3 tutorials | Pin exact version in `package.json`; reference v4 docs during implementation |
| 10s timeline with many teams may feel rushed | `rankPhases.ts` compresses low-rank stagger; cap particle bursts per reveal |
| `deltaScore` requires extra Redis query per team | Acceptable for event-scale team counts (< 20); batch in server page |
| Heavy `filter`/`backdrop-blur` on projector GPUs | Limit blurred elements to cards only; disable blur in reduced-quality mode via `prefers-reduced-motion` or future `?lite=1` query |
| Screen shake may cause discomfort | Respect reduced motion; keep shake amplitude ≤ 4px |
| No audio in v1 may reduce impact vs brief | Visual bass-hit pulse (background flash) substitutes; audio is non-goal |

## Migration Plan

1. Add `animejs` dependency
2. Implement `lib/reveal/*` modules and types
3. Build `components/reveal/*` UI layers
4. Add `app/reveal/page.tsx` + `layout.tsx`
5. Manual test at 1080p and 4K in Chrome; verify reduced motion
6. Deploy with existing app—no database migration required

**Rollback:** Remove `/reveal` route and `animejs` dependency; no data changes.

## Open Questions

- Should `/reveal` link from the home page admin UI for event operators? (Recommended: add a discreet link in a follow-up, not blocking v1)
- Should `deltaScore` reflect last event only or session/day boundary? (Default: last event points)
- Is a `?replay=1` query param desired for rehearsal? (Defer to v2)
