## Why

The `/reveal/manual` page was built as a plain white-screen reveal for calm, presenter-paced events. Operators still want spacebar control and a lower-intensity pace than `/reveal`, but the standings should look and feel like the main reveal—dark stage, premium score cards, colored particle bursts, and a dramatic winner glow when #1 is revealed.

## What Changes

- **Dark reveal styling**: Replace the white fullscreen layout with the same dark background treatment as `/reveal`
- **Premium score cards**: Use the existing `RevealCard` glassmorphism cards instead of plain text rows
- **Colored particle bursts**: Emit team-colored particles on each spacebar reveal step via the shared `ParticleEngine`
- **Winner glow finale**: When the final step reveals #1 (including the combined #2+#1 press), flood the screen with a large radial glow in the #1 team's color
- **Card entrance motion**: Light per-card reveal animation (slide/fade) on each step—no master timeline, camera, shockwaves, or auto-play
- **Unchanged pacing**: Spacebar still advances one rank at a time from #N toward #1; #2 and #1 still reveal together on the penultimate press
- **Unchanged cinematic reveal**: `/reveal` auto-timed experience is not modified

## Capabilities

### New Capabilities

<!-- None — extends existing manual reveal capability -->

### Modified Capabilities

- `manual-white-reveal-page`: Replace white/plain presentation requirements with dark-stage styling, shared reveal cards, particle bursts per step, and winner-color screen glow on the final reveal

## Impact

- **Modified**: `app/reveal/manual/layout.tsx` (dark background, shared reveal CSS)
- **Modified**: `components/reveal/manual/ManualWhiteReveal.tsx` (particles, glow, card refs, reveal animations)
- **Modified/Replaced**: `components/reveal/manual/ManualRevealList.tsx` → leaderboard using `RevealCard` / `RevealLeaderboard` pattern
- **Removed/Deprecated**: `components/reveal/manual/manual-reveal.css` white-page styles (replaced by `reveal.css`)
- **Reused**: `RevealCard`, `ParticleEngine`, `reveal.css`, `RevealBackground` (optional ambient layer), `animateCounter` for score count-up on reveal
- **Unchanged**: `lib/reveal/MasterTimeline.ts`, `RevealExperience.tsx`, `/reveal` route
