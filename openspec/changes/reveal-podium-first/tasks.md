## 1. Rank Phase Model

- [x] 1.1 Update `RankPhases` in `lib/reveal/types.ts` with `podiumRanks` and `tailRanks` (replace `individualRanks` / `topThreeRanks`)
- [x] 1.2 Refactor `computeRankPhases` — `podiumRanks` = [3,2,1] (or subset), `tailRanks` = [4..N] ascending
- [x] 1.3 Retune `TIMELINE` constants for podium-first pacing (~10s total)

## 2. Podium-First Phase Order

- [x] 2.1 Reorder `createMasterTimeline`: intro → suspense → podium reveal → tail ranks
- [x] 2.2 Move `addTopThreeSuspensePhase` to run right after intro (before any cards shown)
- [x] 2.3 Wire `addTopThreeReveal` at `PODIUM_SUSPENSE_END` instead of end of timeline

## 3. Subdued Tail Reveals

- [x] 3.1 Add `revealTailCard` helper (no shake, no shockwave, smaller bursts, shorter motion)
- [x] 3.2 Add `addTailRanksPhase` — reveal `tailRanks` in ascending order (#4, #5, …) with fast stagger
- [x] 3.3 Keep podium cards at full opacity while tail cards fill in

## 4. Edge Cases and Playback

- [x] 4.1 Verify team counts 1, 2, 3, 5, and 8 (podium-only or podium + tail as appropriate)
- [x] 4.2 Confirm manual reveal button and Reveal Again replay unchanged
- [x] 4.3 Confirm reduced-motion static standings path unchanged

## 5. Verification

- [x] 5.1 Manual test: 8-team reveal opens with suspense, then #3/#2/#1 together with winner emphasis
- [x] 5.2 Manual test: #4–#8 fill in afterward with clearly lighter motion
- [x] 5.3 Run `npm run build` and fix any TypeScript errors
