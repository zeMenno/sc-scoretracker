## Context

The `/reveal` page was built as a grand-finals cinematic experience: hard-coded strings ("FINAL RESULTS", "ONLY TWO REMAIN", "CHAMPION") and auto-play on mount. Event operators want to reuse the same page for round updates and midpoint standings throughout a multi-day competition, with stage-controlled timing via a reveal button.

Current text is embedded in `RevealTitles.tsx`, `RevealExperience.tsx`, and `RevealStaticStandings.tsx`. The timeline starts in a `useEffect` on mount inside `RevealExperience.tsx`.

## Goals / Non-Goals

**Goals:**

- Configurable text via named presets (`finals`, `round`, `midpoint`) plus optional URL overrides
- Manual trigger: idle → click Reveal → play sequence → Reveal Again
- Same profile drives cinematic overlays, buttons, and reduced-motion static view
- Minimal diff to existing timeline choreography

**Non-Goals:**

- Admin UI for editing presets (URL params are sufficient for v1)
- Persisting operator preferences in localStorage
- Changing timeline duration or phase structure
- i18n / multi-language support

## Decisions

### 1. `RevealTextProfile` type and preset registry

**Decision:** Add to `lib/reveal/types.ts`:

```ts
interface RevealTextProfile {
  bootTitle: string
  showdownText: string
  winnerBadge: string
  staticHeading: string
  revealButton: string
  revealAgainButton: string
}
```

`lib/reveal/textProfiles.ts` exports `REVEAL_PRESETS`, `DEFAULT_PRESET = 'finals'`, and `resolveRevealTextProfile(searchParams)`.

**Rationale:** Centralizes copy; presets cover common competition moments; overrides handle one-offs.

### 2. URL parameter resolution

**Decision:** Server page parses `searchParams`:

| Param | Purpose |
|-------|---------|
| `preset` | `finals` \| `round` \| `midpoint` (default: `finals`) |
| `bootTitle` | Override boot title |
| `showdownText` | Override showdown text |
| `winnerBadge` | Override winner badge |
| `staticHeading` | Override static list heading |
| `revealButton` | Override start button label |
| `revealAgainButton` | Override replay button label |

Pass resolved `RevealTextProfile` as a serializable prop to `RevealExperience`.

**Alternative considered:** Path-based routes (`/reveal/round`) — rejected; query params are easier to bookmark and override.

### 3. Text flows into components as props

**Decision:**

- `RevealTitles` accepts `bootTitle` and `showdownText` props instead of hard-coded strings
- `RevealStaticStandings` accepts `heading` and `winnerBadge`
- `MasterTimeline` / `WinnerSequence` receive `texts: RevealTextProfile` — only `winnerBadge` ref label is set at runtime via DOM textContent before timeline starts

**Rationale:** Keeps animation modules unaware of URL parsing; server resolves once.

### 4. Playback state machine in `RevealExperience`

**Decision:** Client state: `'idle' | 'playing' | 'complete'`

```
idle     → (click Reveal)      → playing
playing  → (timeline onComplete) → complete
complete → (click Reveal Again) → playing (after reset)
```

- `useEffect` for timeline depends on `playbackState === 'playing'`
- On transition to `playing`: reset DOM via existing `initHiddenState`, create timeline, play
- On `complete`: show `RevealTrigger` overlay with `revealAgainButton` label
- `idle`: show `RevealTrigger` with `revealButton` label over dimmed preview background

**Reset on replay:** Call a `resetRevealScene(refs, teamCount)` extracted from `initHiddenState`; cancel/destroy previous timeline and particle engine before restart.

**Alternative considered:** `?autoplay=1` for backwards compat — add as optional query param defaulting to false so existing bookmarks don't surprise operators.

### 5. `RevealTrigger` component

**Decision:** New `components/reveal/RevealTrigger.tsx` — fullscreen overlay with premium styled button, team count subtitle ("8 tribes ready"), keyboard support (Enter/Space when focused).

Hidden during `playing`. z-index above layers but below nothing during idle (sits over dark preview).

### 6. Idle preview state

**Decision:** While idle, show background layers at low opacity (no cards, no animation) so the screen isn't blank black — gives context on projector before reveal.

### 7. Preset copy

| Field | finals | round | midpoint |
|-------|--------|-------|----------|
| bootTitle | FINAL RESULTS | CURRENT STANDINGS | HALFWAY STANDINGS |
| showdownText | ONLY TWO REMAIN | TOP TWO REMAIN | WHO TAKES FIRST? |
| winnerBadge | CHAMPION | IN THE LEAD | LEADER |
| staticHeading | Final Standings | Current Standings | Halfway Standings |
| revealButton | Reveal Standings | Reveal Standings | Reveal Standings |
| revealAgainButton | Reveal Again | Reveal Again | Reveal Again |

`revealButton` / `revealAgainButton` are overridable but share sensible defaults across presets.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Long custom titles overflow on projector | CSS `clamp()` + `text-wrap: balance`; max-length trim at 40 chars in resolver |
| Replay without full reset leaves stale DOM state | Dedicated `resetRevealScene()` mirrors `initHiddenState` |
| Operators expect old auto-play behavior | Document `?autoplay=1` opt-in if added; default is manual |
| Timeline `useEffect` re-runs on text change mid-play | Only start effect when `playbackState === 'playing'`; texts fixed for session |

## Migration Plan

1. Add `textProfiles.ts` and extend types
2. Update `app/reveal/page.tsx` to resolve profile from searchParams
3. Refactor title components and static standings to accept props
4. Add playback state + `RevealTrigger` to `RevealExperience`
5. Pass texts through to timeline init
6. Test all three presets and override params

**Rollback:** Revert to hard-coded strings and mount-time autoplay.

## Open Questions

- Should `revealButton` labels differ per preset (e.g. "Reveal Final Results" for finals)? Defaulting to shared "Reveal Standings" for now.
- Add home-page links to preset URLs for operators? Defer to follow-up.
