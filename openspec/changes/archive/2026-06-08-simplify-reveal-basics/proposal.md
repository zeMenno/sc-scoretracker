## Why

The reveal page has accumulated complexity—text presets, URL overrides, a three-state playback machine, and per-round delta scores—that distracts from its core job: dramatically revealing the standings over ~10 seconds. Operators want a simpler, more reliable experience focused on rank reveals, with extra emphasis reserved for the final 2–3 positions.

## What Changes

- **Remove text system**: Delete `RevealTextProfile`, presets, URL params (`preset`, `bootTitle`, etc.), and all cinematic title overlays (boot title, showdown text, champion badge labels)
- **Remove delta scores**: Drop `deltaScore` from `RevealTeam`, cards, counters, Redis lookups, and static fallback
- **Simplify to one reveal flow**: Replace `idle | playing | complete` playback state with a single auto-playing reveal that starts on mount (or one continuous sequence without idle overlay / manual trigger)
- **Streamline timeline**: Short intro (background only), then bottom-up rank reveals over ~10 seconds; no boot phase or text beats
- **Preserve top-rank drama**: Last 2–3 positions (#3–#1) still receive longer pauses, camera zoom, dimming of lower ranks, and richer motion than earlier ranks
- **Keep**: Glassmorphism cards, particles, shockwaves, score counters (total only), reduced-motion static list, variable team count, final-frame hold after completion
- **BREAKING**: `/reveal?preset=…` and text override query params removed; manual "Reveal Standings" button removed; `deltaScore` no longer shown

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `ranking-reveal-page`: Simplified data model (no deltas), no text overlays, auto-play single flow, streamlined ~10s timeline with extended final-rank emphasis
- `reveal-text-profiles`: **Removed** — preset/override system no longer exists

## Impact

- **Deleted**: `lib/reveal/textProfiles.ts`, `components/reveal/RevealTitles.tsx`, `components/reveal/RevealTrigger.tsx`, `reveal-text-profiles` spec
- **Modified**: `lib/reveal/types.ts`, `lib/reveal/mapTeams.ts`, `lib/reveal/MasterTimeline.ts`, `lib/reveal/WinnerSequence.ts`, `lib/reveal/ScoreCounter.ts`, `components/reveal/RevealExperience.tsx`, `components/reveal/RevealCard.tsx`, `components/reveal/RevealStaticStandings.tsx`, `app/reveal/page.tsx`
- **No new dependencies**; `animejs` and existing visual layers remain
