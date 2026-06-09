## 1. Data Model Cleanup

- [x] 1.1 Remove `deltaScore` from `RevealTeam` in `lib/reveal/types.ts`
- [x] 1.2 Remove `RevealTextProfile` and `RevealPlaybackState` from `lib/reveal/types.ts`
- [x] 1.3 Remove `deltaScore` ref from `RevealCardRef` and title/badge refs from `RevealRefs`
- [x] 1.4 Simplify `lib/reveal/mapTeams.ts` — drop `getTeamLastEventPoints` lookup and mock delta values
- [x] 1.5 Delete `lib/reveal/textProfiles.ts`

## 2. Remove Text and Trigger UI

- [x] 2.1 Delete `components/reveal/RevealTitles.tsx`
- [x] 2.2 Delete `components/reveal/RevealTrigger.tsx`
- [x] 2.3 Remove text-related imports, refs, and JSX from `RevealExperience.tsx`
- [x] 2.4 Simplify `app/reveal/page.tsx` — remove `searchParams` / `resolveRevealTextProfile`, pass only `teams`

## 3. Card and Static View

- [x] 3.1 Remove delta score span and ref from `RevealCard.tsx`
- [x] 3.2 Update `RevealStaticStandings.tsx` — fixed "Standings" heading, no delta column, no winner badge text
- [x] 3.3 Clean up `reveal.css` — remove unused title, badge, and trigger styles

## 4. Score Counter

- [x] 4.1 Remove `animateDeltaCounter` from `lib/reveal/ScoreCounter.ts`
- [x] 4.2 Remove all `animateDeltaCounter` calls from `MasterTimeline.ts` and `WinnerSequence.ts`

## 5. Timeline Restructure

- [x] 5.1 Update `TIMELINE` constants for intro (0–0.8s), low ranks (0.8–6s), top-rank emphasis (6–10s)
- [x] 5.2 Remove `addBootPhase` and boot title animations from `MasterTimeline.ts`
- [x] 5.3 Remove showdown text animations from `addShowdownPhase` (keep dim + camera zoom)
- [x] 5.4 Shift low-rank phase start to 0.8s; adjust stagger for faster lower ranks
- [x] 5.5 Remove champion badge text logic from `WinnerSequence.ts` and `holdFinalFrame`
- [x] 5.6 Remove `setIdlePreviewState` and delta reset lines from `resetRevealScene`

## 6. Single Auto-Play Flow

- [x] 6.1 Replace playback state machine in `RevealExperience.tsx` with mount-time auto-play `useEffect`
- [x] 6.2 Wire timeline `onComplete` to `holdFinalFrame` only (no complete-state overlay)
- [x] 6.3 Remove `RevealTrigger` rendering and `playSession` replay logic

## 7. Verification

- [x] 7.1 Verify `/reveal` auto-plays and completes in ~10 seconds with 8 mock teams
- [x] 7.2 Verify last 2–3 positions have visibly longer pauses and richer FX than lower ranks
- [x] 7.3 Verify no text overlays, delta scores, or manual trigger appear
- [x] 7.4 Verify reduced-motion mode shows static standings immediately
- [x] 7.5 Verify final standings remain visible after sequence completes
- [x] 7.6 Run `npm run build` and fix any TypeScript errors
