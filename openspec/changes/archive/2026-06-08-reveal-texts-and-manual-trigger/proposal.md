## Why

The `/reveal` page is hard-coded for a grand-finals moment ("FINAL RESULTS", "CHAMPION", auto-play on load). In practice, organizers use the same cinematic reveal throughout a multi-day competition—for round updates, midpoint standings, and the finale. They also need control over *when* the animation starts so they can cue it from the stage, not on page load.

## What Changes

- Replace hard-coded reveal copy with a **configurable text profile** supporting multiple competition moments (e.g. finals, round update, midpoint standings)
- Add a **manual reveal trigger**: page loads into a ready/idle state with a prominent button; the 10-second timeline starts only when the operator clicks it
- Support selecting a text profile via URL (e.g. `/reveal?preset=finals` or `/reveal?preset=round`) so operators can bookmark different reveal modes
- Allow optional per-field text overrides via query params for one-off events
- Update static/reduced-motion fallback to use the same configurable labels
- After a reveal completes, show a **Reveal Again** control so operators can re-run the sequence without reloading

## Capabilities

### New Capabilities

- `reveal-text-profiles`: Preset and override system for all user-facing reveal copy (boot title, showdown text, winner badge, static list heading, button labels)

### Modified Capabilities

- `ranking-reveal-page`: Playback no longer auto-starts on mount; requires explicit operator trigger. Overlay text requirements become configurable instead of fixed finals wording.

## Impact

- **Modified**: `components/reveal/RevealExperience.tsx`, `RevealTitles.tsx`, `RevealStaticStandings.tsx`, `lib/reveal/types.ts`, `lib/reveal/MasterTimeline.ts`
- **New**: `lib/reveal/textProfiles.ts`, `components/reveal/RevealTrigger.tsx`
- **Modified route**: `app/reveal/page.tsx` — parse `preset` and text override search params, pass config to client
- **No breaking API changes** to Redis or team data; additive URL parameters only
