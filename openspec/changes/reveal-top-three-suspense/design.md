## Context

The reveal timeline currently uses three rank groupings from `computeRankPhases`:

1. **Low ranks** — bottom positions revealed one-by-one (e.g. #8–#5 for eight teams)
2. **Middle drama** — #4 and #3 revealed separately with a temporary swap animation
3. **Showdown + winner** — cards dim, camera zooms, #2 revealed, then #1 with winner effects

The user wants a simpler countdown narrative: reveal from last place upward through #4, then pause for suspense and reveal #3, #2, and #1 together. The manual reveal button and playback state machine from `keep-reveal-button` stay unchanged.

## Goals / Non-Goals

**Goals:**

- Reveal order is strictly bottom-up: #N, #N−1, … down to #4 (one card per beat)
- After #4 lands, build suspense before the podium trio appears
- #3, #2, and #1 animate in on the same timeline beat (same `at` offset)
- #1 still gets the strongest winner celebration layered on the trio beat
- Total sequence remains ~10 seconds; fewer individual reveals may allow slightly longer suspense pause
- Works for team counts ≥ 3; smaller counts skip absent ranks

**Non-Goals:**

- Reintroducing #4/#3 swap drama
- Sequential #2-then-#1 showdown
- Changes to reveal button, idle/complete UI, reduced motion, or data model
- New text overlays or sound design

## Decisions

### 1. Simplify `computeRankPhases` into two groups

**Decision:** Replace `lowRanks` + `middleRanks` with:

| Field | Meaning |
|-------|---------|
| `individualRanks` | Ranks revealed one-by-one from bottom up, stopping at #4 (e.g. `[8,7,6,5,4]` for 8 teams) |
| `topThreeRanks` | Always `[3, 2, 1]` when `teamCount >= 3`; `[2, 1]` when `teamCount === 2`; `[1]` when `teamCount === 1` |
| `staggerMs` | Unchanged adaptive stagger for individual reveals |

**Rationale:** One function drives both phases; no special-case middle ranks.

**Alternative considered:** Keep `middleRanks` and only merge showdown — rejected because swap logic would still run for #4/#3.

### 2. Remove `addMiddleDramaPhase` and `addShowdownPhase` as separate concepts

**Decision:**

- Extend `addLowRanksPhase` (rename to `addIndividualRanksPhase`) to iterate `individualRanks` including #4
- Add new `addTopThreeSuspensePhase` that:
  1. **Suspense beat (~1.0–1.2s):** dim revealed cards (opacity ~0.45), camera showdown zoom, reverse light sweep, brief hold with no new cards
  2. **Trio reveal:** call shared reveal helpers for all cards in `topThreeRanks` at the same `at` timestamp

**Rationale:** Suspense is the dramatic pause *before* the trio; showdown zoom already exists and maps well to this beat.

### 3. Simultaneous trio animation with winner layering

**Decision:** Refactor `WinnerSequence.ts` into `addTopThreeReveal`:

- At `revealAt`, schedule card entrance animations for indices 2, 1, 0 (#3, #2, #1) with identical start time
- Score counters for all three start together
- Particle bursts fire for each card (smaller bursts for #3 and #2)
- On the same `revealAt`, apply existing winner-only effects to index 0: larger scale overshoot, `winnerGlow`, confetti, background brightness, camera impact, screen shake

**Rationale:** "At once" means same beat, not identical motion — #1 can still feel special while all three appear together.

**Alternative considered:** Stagger trio by 100ms — rejected; user asked for simultaneous reveal.

### 4. Timeline phase constants

**Decision:** Retune `TIMELINE` in `types.ts`:

| Constant | Approx. role |
|----------|----------------|
| `INTRO_END` | 800ms (unchanged) |
| `INDIVIDUAL_RANKS_END` | ~5500ms (was `LOW_RANKS_END` at 6000) |
| `SUSPENSE_END` | ~6800ms (replaces `MIDDLE_DRAMA_END`) |
| `TOP_THREE_END` / `SHOWDOWN_END` | ~8500ms |
| `TOTAL` | 10000ms |

Exact values tuned during implementation so five individual reveals + suspense + trio fit ~10s.

### 5. Fewer than eight teams

**Decision:** `individualRanks` is `[teamCount, teamCount−1, …, 4]` intersected with valid ranks. If `teamCount <= 3`, skip individual phase entirely and go intro → suspense → trio (or intro → winner only for 1 team).

**Rationale:** Matches existing adaptive behavior; no absent rank slots.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Trio reveal feels crowded on small viewports | Cards already stack vertically; simultaneous opacity/transform only |
| Losing swap drama reduces mid-sequence surprise | Suspense pause + simultaneous podium compensates |
| Timeline over/under 10s after retune | Adjust `staggerMs` and suspense duration; verify with 8-team fixture |
| Winner effects clash when three cards animate together | Layer winner effects only on card index 0; keep #3/#2 motion subtler |

## Migration Plan

1. Update `RankPhases` type and `computeRankPhases`
2. Refactor `MasterTimeline.ts` phases
3. Refactor `WinnerSequence.ts` → top-three simultaneous reveal
4. Adjust `TIMELINE` constants
5. Manual test: 8 teams, 5 teams, 3 teams; replay via Reveal Again
6. Run `npm run build`

**Rollback:** Restore previous phase functions from git.

## Open Questions

- Suspense pause length: target ~1.0s hold — tune by feel during implementation
- Should unrevealed top-three slots show placeholder tension (e.g. pulsing glow) during suspense? Default: no — cards stay hidden until the beat
