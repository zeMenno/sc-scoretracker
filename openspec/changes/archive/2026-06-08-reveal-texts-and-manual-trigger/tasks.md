## 1. Text Profile System

- [x] 1.1 Add `RevealTextProfile` interface to `lib/reveal/types.ts`
- [x] 1.2 Create `lib/reveal/textProfiles.ts` with `finals`, `round`, and `midpoint` presets
- [x] 1.3 Implement `resolveRevealTextProfile(searchParams)` with per-field URL overrides

## 2. Route and Data Passing

- [x] 2.1 Update `app/reveal/page.tsx` to parse `preset` and override search params
- [x] 2.2 Pass resolved `RevealTextProfile` to `RevealExperience` as a prop

## 3. Component Text Refactor

- [x] 3.1 Update `RevealTitles.tsx` to accept `bootTitle` and `showdownText` props
- [x] 3.2 Update `RevealStaticStandings.tsx` to accept `heading` and `winnerBadge` props
- [x] 3.3 Update `RevealExperience.tsx` to pass text props to child components and set champion badge text from profile

## 4. Manual Trigger UI

- [x] 4.1 Create `components/reveal/RevealTrigger.tsx` with premium fullscreen button overlay
- [x] 4.2 Add idle preview state (dimmed background, no cards) before first reveal
- [x] 4.3 Implement playback state machine: `idle` → `playing` → `complete` in `RevealExperience`

## 5. Timeline Integration

- [x] 5.1 Extract `resetRevealScene()` from `initHiddenState` in `MasterTimeline.ts` for replay support
- [x] 5.2 Change timeline `useEffect` to start only when `playbackState === 'playing'`
- [x] 5.3 Wire timeline `onComplete` callback to transition to `complete` state
- [x] 5.4 Implement Reveal Again: reset scene, destroy previous timeline/particles, restart sequence

## 6. Verification

- [x] 6.1 Verify `/reveal`, `/reveal?preset=round`, and `/reveal?preset=midpoint` show correct copy
- [x] 6.2 Verify URL overrides (e.g. `bootTitle`) work with any preset
- [x] 6.3 Verify sequence does not auto-play; starts only on button click
- [x] 6.4 Verify reduced-motion mode uses profile headings without requiring button click
- [x] 6.5 Run `npm run build` and fix any TypeScript errors
