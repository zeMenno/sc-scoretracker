## 1. Route and Layout

- [x] 1.1 Create `app/reveal/manual/layout.tsx` with white fullscreen background and page metadata
- [x] 1.2 Create `app/reveal/manual/page.tsx` server component that loads teams via `getAllTeams` / `mapTeamsToReveal` (same fallback as `/reveal`)

## 2. Manual Reveal UI

- [x] 2.1 Create `components/reveal/manual/ManualWhiteReveal.tsx` client component with `revealedCount` state
- [x] 2.2 Create `components/reveal/manual/ManualRevealList.tsx` for plain rank rows (rank, color accent, name, static score)
- [x] 2.3 Add `components/reveal/manual/manual-reveal.css` with white-page styles (no cinematic effects)

## 3. Spacebar Reveal Logic

- [x] 3.1 Register window `keydown` listener for Space; `preventDefault` and ignore `e.repeat`
- [x] 3.2 Advance one rank per press from #N upward; when only #2 and #1 remain, reveal both on one press
- [x] 3.3 No-op when all teams revealed or team list is empty
- [x] 3.4 Show "Press Space to reveal" hint until first team is revealed

## 4. Edge Cases

- [x] 4.1 Handle 0 teams with empty-state message
- [x] 4.2 Verify 1-team, 2-team, and 8-team reveal sequences match spec

## 5. Verification

- [x] 5.1 Confirm `/reveal` cinematic page is unchanged
- [x] 5.2 Manual test spacebar pacing on `/reveal/manual`
- [x] 5.3 Run `npm run build` and fix any TypeScript errors
