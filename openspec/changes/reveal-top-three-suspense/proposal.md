## Why

The current reveal splits the podium finish across separate phases—#4/#3 swap drama, then a showdown with #2 and #1 revealed one after another. For live events, a cleaner bottom-up countdown (8 → 1) with the final three revealed together builds more collective suspense before the winner lands.

## What Changes

- **Straight bottom-up order for ranks 8–4**: Reveal positions from last place upward one at a time with the existing staggered card motion (8, 7, 6, 5, 4 for eight teams)
- **Remove #4/#3 swap drama**: Drop the temporary position-swap tension between 4th and 3rd; both are revealed in the normal stagger like other lower/mid ranks
- **Simultaneous top-three reveal**: After #4 is shown, build suspense (dim other cards, camera zoom, pause), then reveal #3, #2, and #1 together
- **Winner emphasis within the trio**: #1 still receives the strongest celebration effects (particles, glow, screen shake) when the trio lands, but all three cards animate in at the same beat
- **Keep manual reveal button**: No change to idle/playing/complete playback or the Reveal Standings / Reveal Again controls

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `ranking-reveal-page`: Update phase choreography so ranks reveal 8 → 1 with ranks #3, #2, and #1 revealed simultaneously after a suspense beat; remove separate #4/#3 swap and sequential #2-then-#1 showdown

## Impact

- **Modified**: `lib/reveal/rankPhases.ts` (phase groupings: individual ranks 8–4, top-three batch)
- **Modified**: `lib/reveal/MasterTimeline.ts` (remove middle-drama swap; add top-three suspense phase)
- **Modified**: `lib/reveal/WinnerSequence.ts` (refactor for simultaneous trio reveal with winner emphasis)
- **Modified**: `lib/reveal/types.ts` (timeline phase constants if durations shift)
- **Unchanged**: Reveal trigger UI, reduced-motion path, particle engine, card design, data model
