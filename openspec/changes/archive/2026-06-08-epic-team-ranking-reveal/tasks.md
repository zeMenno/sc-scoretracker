## 1. Setup and Dependencies

- [x] 1.1 Add `animejs` v4 to `package.json` and install
- [x] 1.2 Create directory structure: `app/reveal`, `components/reveal`, `hooks/reveal`, `lib/reveal`
- [x] 1.3 Define `RevealTeam` type and shared constants (timeline offsets, easing presets) in `lib/reveal/types.ts`

## 2. Data Layer

- [x] 2.1 Implement `lib/reveal/mapTeams.ts` to map Redis `Team[]` to `RevealTeam[]` (totalScore from score, deltaScore from last event)
- [x] 2.2 Add helper to fetch last event points per team (extend or use existing Redis helpers)
- [x] 2.3 Implement `lib/reveal/rankPhases.ts` to compute reveal order and stagger timing for variable team counts

## 3. Animation Core Modules

- [x] 3.1 Implement `lib/reveal/ScoreCounter.ts` with Anime.js counter interpolation for total and delta scores
- [x] 3.2 Implement `lib/reveal/CameraController.ts` with transform keyframe helpers (scale, translate, rotate)
- [x] 3.3 Implement `lib/reveal/ParticleEngine.ts` with DOM particle pool, burst emission, and recycling
- [x] 3.4 Implement `lib/reveal/WinnerSequence.ts` for second-place reveal, pause, winner impact, confetti, and CHAMPION badge
- [x] 3.5 Implement `lib/reveal/MasterTimeline.ts` orchestrating all five phases (intro, boot, low ranks, middle drama, showdown, winner) on a single timeline

## 4. Visual Layer Components

- [x] 4.1 Create `components/reveal/reveal.css` with glassmorphism, noise texture, and glow variables
- [x] 4.2 Build `RevealBackground` — animated dark gradient mesh with subtle particle field
- [x] 4.3 Build `LightSweepLayer` — slow diagonal cinematic light rays
- [x] 4.4 Build `ArenaGrid` — subtle perspective grid for scale
- [x] 4.5 Build `ShockwaveOverlay` and screen-shake utility for reveal impacts
- [x] 4.6 Build `RevealCard` — premium glass card with position, name, scores, color accent, and animated glow
- [x] 4.7 Build title components: particle-assembled "FINAL RESULTS" and "ONLY TWO REMAIN" overlay text

## 5. Experience Orchestration

- [x] 5.1 Implement `hooks/reveal/useReducedMotion.ts` for `prefers-reduced-motion` detection
- [x] 5.2 Implement `hooks/reveal/useRevealScale.ts` for 1080p–4K viewport scaling
- [x] 5.3 Build `RevealLeaderboard` — card slot layout, stacking, dimming during showdown
- [x] 5.4 Build `RevealStaticStandings` — clean fallback list for reduced motion
- [x] 5.5 Build `RevealExperience` client component — wires refs, layers, camera, particles, and starts master timeline on mount
- [x] 5.6 Build `CameraController` React wrapper applying animated transforms to all layers

## 6. Route and Layout

- [x] 6.1 Create `app/reveal/layout.tsx` — fullscreen, overflow hidden, black background, minimal chrome
- [x] 6.2 Create `app/reveal/page.tsx` — server component fetching teams, mapping to `RevealTeam[]`, rendering `RevealExperience`

## 7. Timeline Phase Implementation

- [x] 7.1 Phase 0 (0–1s): black screen, particle emergence, background fade-in
- [x] 7.2 Phase 1 (1–2.5s): "FINAL RESULTS" particle assembly, chromatic aberration, light sweep, camera push-in, title dissolve
- [x] 7.3 Phase 2 (2.5–5.5s): bottom-up rank reveals with slide/overshoot, score counters, glow pulse, shockwave, vibration, particle bursts
- [x] 7.4 Phase 3 (5.5–7.5s): middle ranks (#4, #3) with position-swap suspense and rapid counter animation before lock-in
- [x] 7.5 Phase 4 (7.5–8.8s): dim existing cards, camera zoom, faster particles, "ONLY TWO REMAIN" text
- [x] 7.6 Phase 5 (8.8–10s): second place reveal, 500ms pause, winner crash-in, explosion FX, environment color flood, CHAMPION badge, hold frame

## 8. Polish and Verification

- [x] 8.1 Verify transform/opacity-only animations; profile for 60 FPS on 1080p
- [x] 8.2 Test responsive scaling at 1920×1080 and 4K resolutions
- [x] 8.3 Test with 2, 4, 8, and 12 teams to confirm dynamic adaptation
- [x] 8.4 Verify reduced-motion mode shows static standings immediately
- [x] 8.5 Run `npm run build` and fix any TypeScript or lint errors
