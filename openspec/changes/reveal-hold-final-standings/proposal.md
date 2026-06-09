## Why

After the 10-second reveal animation finishes, the fullscreen "Reveal Again" overlay immediately covers the final standings. Event operators need the completed leaderboard to remain visible on the projector so the audience can read the results—the replay control should not obscure them.

## What Changes

- After the cinematic sequence completes, **hold the final frame**: all team cards, scores, winner badge, and background remain fully visible
- Replace the fullscreen post-completion overlay with a **non-blocking "Reveal Again" control** (small corner button or bottom bar) that does not cover the standings
- Keep the fullscreen trigger only for the initial **idle** state before the first reveal
- Ensure the black intro overlay and other transient FX elements stay hidden after completion so the leaderboard is unobstructed

## Capabilities

### New Capabilities

<!-- None — bug fix within existing reveal flow -->

### Modified Capabilities

- `ranking-reveal-page`: Post-completion behavior must persist final standings on screen; replay control must not use the fullscreen idle overlay.

## Impact

- **Modified**: `components/reveal/RevealExperience.tsx`, `components/reveal/RevealTrigger.tsx`, `components/reveal/reveal.css`
- **Possibly modified**: `lib/reveal/MasterTimeline.ts` — ensure `onComplete` leaves scene in final visible state (no overlay regression)
- **No API, data, or URL parameter changes**
