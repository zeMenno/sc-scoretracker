## 1. Master Timeline Helpers

- [x] 1.1 Add `setIdlePreviewState(refs)` to `lib/reveal/MasterTimeline.ts` (dimmed background, hidden cards)
- [x] 1.2 Add `RevealPlaybackState` type to `lib/reveal/types.ts` if not present

## 2. Reveal Trigger Component

- [x] 2.1 Create `components/reveal/RevealTrigger.tsx` with `variant: 'fullscreen' | 'compact'`
- [x] 2.2 Fullscreen variant: team count subtitle, "Reveal Standings" button, dark overlay
- [x] 2.3 Compact variant: bottom-right "Reveal Again" pill, no backdrop
- [x] 2.4 Add trigger styles to `components/reveal/reveal.css`

## 3. Playback State Machine

- [x] 3.1 Add `playbackState` (`idle | playing | complete`) and `playSession` counter to `RevealExperience.tsx`
- [x] 3.2 Call `setIdlePreviewState` on mount when state is `idle`
- [x] 3.3 Gate timeline `useEffect` on `playbackState === 'playing'` only
- [x] 3.4 Wire `onComplete`: `holdFinalFrame(refs)` then `setPlaybackState('complete')`
- [x] 3.5 Fix effect cleanup so `resetRevealScene` does not run on `playing → complete` transition
- [x] 3.6 Implement replay handler: reset scene, increment `playSession`, set state to `playing`

## 4. Trigger Rendering

- [x] 4.1 Render fullscreen `RevealTrigger` when `playbackState === 'idle'`
- [x] 4.2 Render compact `RevealTrigger` when `playbackState === 'complete'`
- [x] 4.3 Hide all triggers during `playing`

## 5. Verification

- [x] 5.1 Verify page loads to idle state without auto-playing
- [x] 5.2 Verify reveal starts on button click and completes with standings visible
- [x] 5.3 Verify "Reveal Again" replays the full sequence
- [x] 5.4 Verify reduced-motion path still shows static standings immediately
- [x] 5.5 Run `npm run build` and fix any TypeScript errors
