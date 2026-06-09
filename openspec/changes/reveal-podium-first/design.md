## Context

After `reveal-top-three-suspense`, the timeline runs:

1. Intro
2. Individual reveals #8 → #4 (full `revealTeamCard` with shake, shockwave, large bursts)
3. Suspense beat (dim, camera zoom)
4. Simultaneous #3 / #2 / #1 reveal with winner effects

The first ~5 solo reveals consume the richest effects. For 8 teams, #8, #7, and #6 are the first three on screen with maximum fanfare—exactly the positions the user does not want emphasized.

The leaderboard visual order stays fixed (index 0 = #1 at top). Only timeline phase order and per-rank effect intensity change.

## Goals / Non-Goals

**Goals:**

- Podium (#3, #2, #1) revealed first after intro with suspense + simultaneous beat and full winner treatment
- Remaining ranks (#4 through #N) revealed afterward with clearly subdued motion
- Audience attention peaks on 1st, 2nd, and 3rd place—not 6th, 7th, and 8th
- ~10 second total duration preserved
- Manual reveal button and replay unchanged

**Non-Goals:**

- Changing final card stack layout or sort order on screen
- Revealing ranks in strict 1 → 8 numeric order one-by-one (podium is still a simultaneous trio beat)
- New UI, text overlays, or sound
- Changing reduced-motion static fallback

## Decisions

### 1. Reverse phase order in `createMasterTimeline`

**Decision:** New sequence:

```
intro → podium suspense → top-three reveal → tail ranks (subdued)
```

Replace current `individual → suspense → top-three`.

**Rationale:** Puts maximum effects at the start of the main phase when the audience is freshest.

### 2. Rename rank phase fields

**Decision:** Update `RankPhases`:

| Field | Contents |
|-------|----------|
| `podiumRanks` | `[3, 2, 1]` (or `[2, 1]` / `[1]` for smaller counts) |
| `tailRanks` | `[4, 5, …, N]` ascending (ranks after podium, when present) |
| `tailStaggerMs` | Faster stagger for tail (~300ms) |

Remove `individualRanks` / `topThreeRanks` naming to reflect new semantics.

### 3. Subdued tail reveal helper

**Decision:** Add `revealTailCard` (or `revealTeamCard` with `intensity: 'full' | 'subdued'`):

| Effect | Podium / full | Tail / subdued |
|--------|---------------|----------------|
| Screen shake | Yes (#1) | No |
| Shockwave | Yes (podium beat) | No |
| Particle burst | 20–48 | ~10 |
| Card motion | Spring overshoot | Shorter, smaller translate |
| Score counter | 600–900ms | ~400ms |

**Rationale:** Tail ranks fill in the standings without competing with the podium moment.

### 4. Suspense before podium (not before tail)

**Decision:** Move `addTopThreeSuspensePhase` to run immediately after intro, before any cards appear. No suspense beat before tail—tail is a quiet fill-in.

During suspense, no cards are visible yet (same as current idle state for top three slots).

**Alternative considered:** Suspense before tail to "re-dramatize" lower ranks — rejected; would re-steal focus from podium.

### 5. Timeline constants

**Decision:** Retune `TIMELINE`:

| Constant | Role |
|----------|------|
| `INTRO_END` | 800ms |
| `PODIUM_SUSPENSE_END` | ~2000ms (suspense hold after intro) |
| `PODIUM_REVEAL_END` | ~4500ms (trio + winner effects complete) |
| `TAIL_END` | ~8500ms |
| `TOTAL` | 10000ms |

Tail phase fills remaining time with fast stagger.

### 6. Dim behavior after podium

**Decision:** When tail ranks reveal, already-visible podium cards stay at full opacity (no dimming). Optional subtle dim on tail cards only—not on podium.

**Rationale:** Keeps winners prominent while lower ranks trickle in.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Revealing podium before lower ranks feels "spoiler-first" | Suspense beat preserves drama; tail fill-in completes the picture |
| Tail phase feels anticlimactic | Intentional—podium is the climax; tail is informational |
| Timeline too short for many teams | Adaptive `tailStaggerMs` scales down for 8+ teams |
| Cards animate into empty lower slots while podium already visible | Existing stack layout handles this; tail cards slide into their positions below podium |

## Migration Plan

1. Refactor `rankPhases.ts` → `podiumRanks` + `tailRanks`
2. Reorder `MasterTimeline` phases; move suspense before podium
3. Add subdued tail reveal helper
4. Retune timeline constants
5. Manual test 8-team reveal; verify podium hits first with full effects
6. Run `npm run build`

**Rollback:** Restore previous phase order from `reveal-top-three-suspense`.

## Open Questions

- Tail reveal order: ascending #4 → #N (natural fill) vs descending #N → #4 — default ascending #4 first so standings build downward from podium
- Should tail cards dim podium slightly as they appear? Default no
