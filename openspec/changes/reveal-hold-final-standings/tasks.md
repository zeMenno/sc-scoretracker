## 1. Scene State Fix



- [x] 1.1 Add `holdFinalFrame(refs)` to `lib/reveal/MasterTimeline.ts` to lock the post-animation visible state

- [x] 1.2 Refactor timeline `useEffect` in `RevealExperience.tsx` so cleanup does not call `resetRevealScene` when transitioning to `complete`

- [x] 1.3 Call `holdFinalFrame` in timeline `onComplete` before setting playback state to `complete`



## 2. Trigger UI Split



- [x] 2.1 Add `variant: 'fullscreen' | 'compact'` prop to `RevealTrigger.tsx`

- [x] 2.2 Implement compact variant: corner-positioned button, no backdrop overlay

- [x] 2.3 Add CSS for `.reveal-trigger-compact` in `reveal.css`



## 3. Playback State Rendering



- [x] 3.1 Show fullscreen trigger only when `playbackState === 'idle'`

- [x] 3.2 Show compact reveal-again control only when `playbackState === 'complete'`

- [x] 3.3 Remove combined `showTrigger` logic that treats idle and complete identically



## 4. Verification



- [x] 4.1 Verify standings remain fully visible after animation completes

- [x] 4.2 Verify Reveal Again replays the sequence correctly

- [x] 4.3 Verify initial idle state still shows fullscreen trigger

- [x] 4.4 Run `npm run build` and fix any TypeScript errors

