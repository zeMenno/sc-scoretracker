## Why

The reveal currently spends its strongest effects—screen shake, shockwaves, and staggered solo spotlights—on the first cards shown (#8, #7, #6). That front-loads attention on last-place teams while the podium (#3, #2, #1) lands later with less individual presence. For live events, the animation emphasis should land on the winners, not the bottom of the standings.

## What Changes

- **Reverse phase order**: After intro, play the suspense beat and reveal #3, #2, and #1 together first—with full dramatic treatment (camera zoom, particles, winner celebration)
- **Subdued tail reveal**: Reveal remaining positions (#4 through #N) afterward with lighter motion—no screen shake, smaller particle bursts, faster stagger, no shockwave per card
- **Keep simultaneous podium beat**: #3, #2, and #1 still appear on the same timeline beat with #1 receiving the strongest winner effects
- **Keep manual reveal button**: No change to idle/playing/complete playback or Reveal Standings / Reveal Again controls
- **Final standings unchanged**: All teams still end fully visible in rank order on screen

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `ranking-reveal-page`: Reverse timeline emphasis so podium positions #3, #2, and #1 are revealed first with the richest effects; remaining ranks (#4+) use a subdued follow-up phase

## Impact

- **Modified**: `lib/reveal/rankPhases.ts` (phase groupings: `podiumRanks` first, `tailRanks` second)
- **Modified**: `lib/reveal/MasterTimeline.ts` (reorder phases; add subdued reveal variant for tail ranks)
- **Modified**: `lib/reveal/WinnerSequence.ts` (podium reveal runs at start of main phase)
- **Modified**: `lib/reveal/types.ts` (timeline phase constants retuned for podium-first pacing)
- **Unchanged**: Reveal trigger UI, reduced-motion path, card layout, data model
