## Why

The existing `/reveal` page is built for a cinematic, auto-timed ~10-second show with particles, camera motion, and shockwaves. Some events need a calm, operator-controlled standings reveal on a plain white screen—one team at a time, paced by the presenter with the space bar, without visual drama.

## What Changes

- **New manual reveal route**: A dedicated page (separate from `/reveal`) for a minimal white-screen standings reveal
- **Spacebar-driven pacing**: Each space bar press reveals the next team, starting from the lowest rank (#8) and counting up toward #1
- **Combined final reveal**: When position #2 is revealed, position #1 is revealed on the same press (no extra keypress for the winner alone)
- **Plain presentation**: White background, readable dark text, no particles, shockwaves, camera motion, score counters, or timeline choreography
- **Same team data**: Reuses existing team loading and `RevealTeam` shape (`id`, `name`, `color`, `totalScore`, pre-sorted descending)
- **Unchanged cinematic reveal**: `/reveal` behavior, components, and timeline are not modified

## Capabilities

### New Capabilities

- `manual-white-reveal-page`: Minimal fullscreen white reveal page with spacebar-stepped rank disclosure from lowest to highest, including the #2+#1 combined final step

### Modified Capabilities

<!-- None — existing ranking-reveal-page is untouched -->

## Impact

- **New**: `app/reveal/manual/page.tsx` (or equivalent route under App Router)
- **New**: Lightweight components under `components/reveal/manual/` (simple list/cards, no animation engine)
- **Reused**: `lib/reveal/mapTeams.ts`, `lib/redis.ts` team fetching, `RevealTeam` type
- **Unchanged**: `components/reveal/*` cinematic stack, `lib/reveal/MasterTimeline.ts`, `/reveal` route
