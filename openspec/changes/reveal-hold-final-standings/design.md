## Context

`RevealExperience` uses playback states `idle | playing | complete`. Currently:

```ts
const showTrigger = playbackState === "idle" || playbackState === "complete"
```

Both states render the same fullscreen `RevealTrigger` overlay (`z-index: 60`, dark radial gradient), which hides the final standings after the animation ends. The timeline's final frame correctly shows all cards, but the UI immediately covers them.

## Goals / Non-Goals

**Goals:**

- Final standings remain visible indefinitely after the sequence completes
- "Reveal Again" remains accessible without covering the leaderboard
- Initial idle state keeps the existing fullscreen "Reveal Standings" experience

**Non-Goals:**

- Auto-dismiss of standings after a timeout
- Changing timeline choreography or duration
- Adding new URL parameters

## Decisions

### 1. Split trigger into two variants

**Decision:** Add a `variant` prop to `RevealTrigger`:

| Variant | When | Layout |
|---------|------|--------|
| `fullscreen` | `idle` | Current centered overlay with team count + large button |
| `compact` | `complete` | Fixed bottom-right corner button, no backdrop, no team count |

**Rationale:** Minimal component change; reuses button styling; clear UX separation.

**Alternative considered:** Hide trigger entirely after complete — rejected because operators need replay without reloading.

### 2. Playback state rendering logic

**Decision:**

```tsx
{playbackState === "idle" && <RevealTrigger variant="fullscreen" ... />}
{playbackState === "complete" && <RevealTrigger variant="compact" ... />}
```

Remove the combined `showTrigger` boolean.

### 3. Lock scene on complete

**Decision:** On `onComplete`, call a new `holdFinalFrame(refs)` in `MasterTimeline.ts` that:

- Sets `blackOverlay` opacity to `0`
- Sets `background` opacity to `1`
- Ensures all card roots are visible (opacity `1`, transform settled)
- Leaves champion badge and winner glow at their final values

**Rationale:** Timeline cleanup in `useEffect` currently calls `resetRevealScene()` on unmount, but when transitioning `playing → complete`, the effect cleanup runs and may reset the scene before React re-renders. Fix the effect so cleanup only runs on unmount or when starting a new play session—not when moving to `complete`.

### 4. Fix useEffect cleanup regression

**Decision:** Refactor timeline `useEffect`:

- Store timeline/particles in refs for cleanup
- On `onComplete`: call `holdFinalFrame(refs)`, then `setPlaybackState("complete")` — do NOT reset scene
- Cleanup function: only destroy when `playSession` changes (new play) or component unmounts
- Use a `isActive` flag or separate ref to avoid `resetRevealScene` firing when effect re-runs due to state change

**Rationale:** Root cause is likely `resetRevealScene()` in the effect cleanup when `playbackState` changes from `playing` to `complete`, wiping the final frame before the compact button appears.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Effect cleanup still resets scene | Use refs for timeline lifecycle; `holdFinalFrame` on complete; cleanup only on replay/unmount |
| Compact button hard to see on projector | High-contrast pill with border glow; bottom-right away from card stack center |
| Cards at reduced opacity from showdown phase | `holdFinalFrame` restores card opacity to 1 (except intentional winner emphasis) |

## Migration Plan

1. Add `holdFinalFrame()` to `MasterTimeline.ts`
2. Fix timeline `useEffect` cleanup in `RevealExperience.tsx`
3. Split `RevealTrigger` variants + CSS
4. Manual test: play reveal → verify standings stay visible → click Reveal Again → verify replay works

**Rollback:** Revert to single fullscreen trigger (reintroduces the bug).

## Open Questions

- Should compact button auto-fade after 5s? Default: always visible for operator access.
