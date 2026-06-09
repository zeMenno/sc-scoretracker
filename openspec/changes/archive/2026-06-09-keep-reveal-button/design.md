## Context

The `simplify-reveal-basics` change removed the manual reveal trigger and playback state machine in favor of auto-play on mount. The current `RevealExperience` starts the timeline immediately in a `useEffect` with no operator control.

Operators at live events load `/reveal` on a projector before the moment is right. They need a ready state and a button to cue the ~10-second sequence from the booth. The simplified reveal (no text presets, no deltas) should stay; only the trigger and playback gating are restored.

`holdFinalFrame` and `resetRevealScene` already exist in `MasterTimeline.ts`. `RevealTrigger.tsx` was deleted during simplification and must be recreated with fixed labels (no text profile system).

## Goals / Non-Goals

**Goals:**

- Restore `idle | playing | complete` playback states
- Fullscreen "Reveal Standings" button on idle; sequence starts only on click
- Compact "Reveal Again" corner control after completion (standings stay visible)
- Idle preview: dimmed background visible, cards hidden, no animation running
- Timeline `useEffect` runs only when `playbackState === 'playing'`
- Replay resets scene and restarts timeline cleanly

**Non-Goals:**

- Text presets, URL copy overrides, or configurable button labels
- Delta scores or title overlays
- `?autoplay=1` query param (deferred)
- Changes to Redis, team data, or reduced-motion static fallback behavior

## Decisions

### 1. Recreate `RevealTrigger` with two variants (fixed labels)

**Decision:** New `components/reveal/RevealTrigger.tsx` with `variant: 'fullscreen' | 'compact'`:

| Variant | When | Layout |
|---------|------|--------|
| `fullscreen` | `idle` | Centered overlay, team count subtitle, large "Reveal Standings" button |
| `compact` | `complete` | Fixed bottom-right pill, "Reveal Again", no backdrop |

**Rationale:** Reuses the proven split from `reveal-hold-final-standings` without reintroducing text profiles. Fixed strings keep the component simple.

**Alternative considered:** Single fullscreen trigger for both idle and complete — rejected because it covers final standings after completion.

### 2. Playback state machine

**Decision:**

```
idle     → (click Reveal Standings)  → playing
playing  → (timeline onComplete)     → complete
complete → (click Reveal Again)      → playing (after reset)
```

- `useState<RevealPlaybackState>('idle')` plus `playSession` counter to force effect re-run on replay
- Timeline effect guard: `if (playbackState !== 'playing') return`
- `onComplete`: `holdFinalFrame(refs)` then `setPlaybackState('complete')`
- Replay handler: increment `playSession`, `setPlaybackState('playing')`

**Rationale:** Matches archived manual-trigger design; separates idle cue from post-completion replay.

### 3. Restore `setIdlePreviewState`

**Decision:** Add `setIdlePreviewState(refs)` to `MasterTimeline.ts` that:

- Shows background at reduced opacity
- Hides all cards, black overlay, shockwave, winner glow
- Runs once on mount when `playbackState === 'idle'`

**Rationale:** Gives operators visual context on the projector before reveal without showing standings prematurely.

### 4. Timeline lifecycle and cleanup

**Decision:** Refactor timeline `useEffect`:

- Dependencies: `[playbackState, playSession, teams, reducedMotion, getSceneRefs]`
- On `playing`: create particles + timeline, `tl.play()` after rAF
- Cleanup: destroy timeline/particles and call `resetRevealScene` only when leaving `playing` for a new session or unmount—not when transitioning to `complete`
- Use refs or conditional cleanup so `holdFinalFrame` state survives `playing → complete`

**Rationale:** Prevents the regression where effect cleanup wipes the final frame before the compact button appears.

### 5. Reduced motion unchanged

**Decision:** Static standings render immediately on load with no button (existing `RevealStaticStandings` behavior).

**Rationale:** Accessibility path should not require operator interaction.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Effect cleanup resets scene on complete | Guard cleanup; `holdFinalFrame` before state transition |
| Operators forget button exists | Large fullscreen CTA with team count; document in README |
| Replay leaves stale particles | Destroy previous `ParticleEngine` in effect cleanup before restart |
| Idle preview shows wrong team count | Pass `teams.length` to trigger subtitle |

## Migration Plan

1. Add `setIdlePreviewState` to `MasterTimeline.ts`
2. Create `RevealTrigger.tsx` with fullscreen + compact variants and CSS
3. Refactor `RevealExperience.tsx`: playback state, idle preview effect, gated timeline effect
4. Manual test: load page → idle button → play → standings hold → reveal again
5. Run `npm run build`

**Rollback:** Revert to auto-play `useEffect` (loses operator control).

## Open Questions

- Should keyboard shortcut (Enter/Space) trigger reveal from idle? Default: yes, on focused button.
- Auto-fade compact button after N seconds? Default: always visible for operator access.
