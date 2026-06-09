## Context

The `/reveal` page evolved through three changes: the original epic 10-second cinematic reveal, configurable text presets with manual trigger, and post-completion standings hold. The result is a three-state playback machine (`idle | playing | complete`), URL-driven copy, delta score lookups per team, and multiple title overlays that compete with the core standings reveal.

Operators want to strip this back: one straightforward reveal that auto-plays on load, shows only team name/rank/total score, and finishes in ~10 seconds—with the last 2–3 positions still getting the most dramatic treatment.

## Goals / Non-Goals

**Goals:**

- Auto-play a single ~10-second reveal on page load (no manual trigger, no idle overlay)
- Reveal all teams bottom-up; allocate disproportionate time and FX to ranks #3, #2, and #1
- Show only `totalScore` on cards (no delta)
- Remove all cinematic text overlays and the text-profile system
- Keep visual polish: background, particles, shockwaves, glass cards, camera motion, winner sequence
- Keep `prefers-reduced-motion` static fallback and final-frame hold after completion
- Keep dynamic team-count adaptation via `rankPhases.ts`

**Non-Goals:**

- Text presets, URL copy overrides, or i18n
- Delta scores or per-round point deltas
- Manual reveal button or replay controls (page refresh replays)
- Audio
- Changes to Redis team model or home page

## Decisions

### 1. Single auto-play flow (no playback state machine)

**Decision:** Remove `RevealPlaybackState`, `RevealTrigger`, `setIdlePreviewState`, and `playSession`. Timeline mounts and plays once in a `useEffect` on load (when `!reducedMotion && teams.length > 0`), matching the original epic reveal pattern.

**Rationale:** "One reveal state" means no idle/complete branching—the page exists to reveal standings immediately.

**Alternative considered:** Keep manual trigger — rejected per user request to simplify.

### 2. Remove text system entirely

**Decision:** Delete `lib/reveal/textProfiles.ts`, `RevealTitles.tsx`, `RevealTrigger.tsx`, and `RevealTextProfile` type. Remove DOM refs for `titleFinalResults`, `titleOnlyTwo`, `championBadge` from `RevealRefs` and `RevealExperience`. Remove boot phase and showdown text animations from `MasterTimeline`. Winner sequence keeps visual glow/particles but no text badge element.

**Rationale:** Text overlays and presets added complexity without improving the standings reveal.

### 3. Slim `RevealTeam` data model

**Decision:**

```ts
interface RevealTeam {
  id: string
  name: string
  color: string
  totalScore: number
}
```

Remove `deltaScore` from types, `mapTeams.ts` (drop `getTeamLastEventPoints` call), `RevealCard`, `RevealStaticStandings`, `ScoreCounter.animateDeltaCounter`, and timeline reveal callbacks.

**Rationale:** Deltas are out of scope; simplifies server page and card layout.

### 4. Restructured ~10s timeline (no boot phase)

**Decision:** Update `TIMELINE` constants:

| Phase | Window | Content |
|-------|--------|---------|
| Intro | 0.0s–0.8s | Black overlay fades, background appears, ambient particles |
| Low ranks | 0.8s–6.0s | Bottom ranks revealed with fast stagger (~400–500ms each) |
| Top three | 6.0s–10.0s | Ranks #4–#3 (if present) with swap drama, then dim + camera zoom, #2 reveal, pause, #1 winner sequence |

Remove `addBootPhase` and `addShowdownPhase` text animations. Keep `addMiddleDramaPhase` swap logic for #4/#3. Keep `addWinnerSequence` for #2 and #1 with existing dramatic FX minus badge text.

Compress low-rank stagger when `teamCount > 8` (existing `rankPhases` logic). The final ~4 seconds are reserved for the top 3 positions (or top 2 when fewer teams).

**Rationale:** Boot phase consumed 1.5s without revealing standings; that time goes to rank reveals and top-rank emphasis.

### 5. Card layout: total score only

**Decision:** `RevealCard` shows rank, name, and animated total score. Remove delta `<span>` and `deltaScore` ref from `RevealCardRef`.

**Rationale:** Cleaner projector readability.

### 6. Static fallback without profile copy

**Decision:** `RevealStaticStandings` uses a fixed heading ("Standings") and no winner badge label—winner row distinguished by position #1 styling only.

**Rationale:** No text profile system to drive copy.

### 7. Post-completion hold (unchanged)

**Decision:** Keep `holdFinalFrame()` on timeline `onComplete` so standings remain visible. No replay UI.

**Rationale:** Operators still need final standings on screen; replay via browser refresh is sufficient for v1.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Operators relied on manual trigger timing | Document that reveal auto-starts; use browser back/refresh to delay |
| Removing presets breaks bookmarked URLs | Params are silently ignored; no error state |
| Faster low-rank phase may feel rushed with many teams | Existing `staggerMs` compression in `rankPhases.ts` |
| Less text may reduce "event moment" feel | Top-rank camera zoom, dimming, and winner FX carry drama |

## Migration Plan

1. Remove text system files and types
2. Simplify `RevealTeam` and `mapTeams.ts`
3. Refactor `RevealRefs`, `RevealExperience`, `RevealCard`, `RevealStaticStandings`
4. Restructure `MasterTimeline` phases and `TIMELINE` constants
5. Strip delta logic from `WinnerSequence` and `ScoreCounter`
6. Simplify `app/reveal/page.tsx` (no searchParams parsing)
7. Run `npm run build` and manual test at 1080p

**Rollback:** Revert branch; no data migration.

## Open Questions

- Should a discreet "↻ Replay" corner link be added later? Deferred—refresh is enough for now.
- Keep light sweep during intro only, or also during top-rank phase? Keep both for visual continuity without text.
