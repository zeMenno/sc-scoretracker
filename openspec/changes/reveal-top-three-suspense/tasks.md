## 1. Rank Phase Model

- [x] 1.1 Update `RankPhases` in `lib/reveal/types.ts` with `individualRanks` and `topThreeRanks` (replace `lowRanks` / `middleRanks`)
- [x] 1.2 Refactor `computeRankPhases` in `lib/reveal/rankPhases.ts` to produce bottom-up ranks through #4 plus top-three batch
- [x] 1.3 Retune `TIMELINE` constants in `types.ts` for individual, suspense, and top-three phases (~10s total)

## 2. Individual Rank Reveals (8 → 4)

- [x] 2.1 Rename/refactor `addLowRanksPhase` to `addIndividualRanksPhase` using `individualRanks`
- [x] 2.2 Ensure #4 is revealed in the individual phase (not in middle drama)
- [x] 2.3 Remove `addMiddleDramaPhase` and its #4/#3 swap logic from `MasterTimeline.ts`

## 3. Top-Three Suspense and Simultaneous Reveal

- [x] 3.1 Add `addTopThreeSuspensePhase`: dim existing cards, camera zoom, light sweep, ~1s hold
- [x] 3.2 Refactor `WinnerSequence.ts` into `addTopThreeReveal` — schedule #3, #2, #1 card entrances at the same `at` offset
- [x] 3.3 Layer winner-only effects on #1 (glow, confetti, shake, background flood) on the same beat as the trio
- [x] 3.4 Remove separate `addShowdownPhase` + sequential #2-then-#1 flow; wire new phases in `createMasterTimeline`

## 4. Edge Cases and Playback

- [x] 4.1 Verify behavior for team counts 1, 2, 3, 5, and 8 (skip absent ranks, correct phase skipping)
- [x] 4.2 Confirm manual reveal button and Reveal Again replay still work unchanged
- [x] 4.3 Confirm reduced-motion path still shows static standings immediately

## 5. Verification

- [x] 5.1 Manual test: 8-team reveal shows #8–#4 one-by-one, suspense pause, then #3/#2/#1 together with winner emphasis
- [x] 5.2 Manual test: Reveal Again replays full updated sequence
- [x] 5.3 Run `npm run build` and fix any TypeScript errors
