## Why

The simplified reveal flow auto-starts the animation on page load, which removes operator control over when the standings appear on stage. Event organizers need to load `/reveal` ahead of time and trigger the sequence from the booth when they are ready—not the moment the page finishes loading.

## What Changes

- **Restore manual reveal trigger**: Page loads into an idle ready state with a prominent fullscreen "Reveal Standings" button; the ~10-second timeline starts only when the operator clicks it
- **Restore playback state machine**: Reintroduce `idle | playing | complete` states to gate timeline start and post-completion UI
- **Keep simplified reveal**: No text presets, URL copy overrides, or delta scores—the button uses fixed labels ("Reveal Standings", "Reveal Again")
- **Keep post-completion hold**: Final standings remain visible after the sequence; a compact corner "Reveal Again" control replays without covering the leaderboard
- **Keep auto-play removal**: Timeline does NOT start on mount when full motion is enabled

## Capabilities

### New Capabilities

<!-- None -->

### Modified Capabilities

- `ranking-reveal-page`: Playback requires explicit operator trigger on load; idle ready state with reveal button; compact reveal-again control after completion; no auto-start on page load

## Impact

- **New**: `components/reveal/RevealTrigger.tsx` (fullscreen + compact variants, fixed labels)
- **Modified**: `components/reveal/RevealExperience.tsx`, `components/reveal/reveal.css`, `lib/reveal/MasterTimeline.ts` (`setIdlePreviewState`, timeline lifecycle tied to playback state)
- **Unchanged**: Simplified data model (no deltas), no text profile system, reduced-motion static fallback
- **No API or Redis changes**
