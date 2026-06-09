## Context

`/reveal` is a cinematic experience driven by Anime.js (`MasterTimeline`), particles, camera motion, and auto-timed phases. Event operators sometimes need a separate, low-key reveal: plain white screen, presenter-paced, one rank at a time via space bar.

Team data already flows through `getAllTeams()` → `mapTeamsToReveal()` → `RevealTeam[]` (sorted by `totalScore` descending, index 0 = #1). The manual page reuses this pipeline but does not import cinematic reveal modules.

## Goals / Non-Goals

**Goals:**

- New route `/reveal/manual` with fullscreen white background and no app chrome
- Spacebar advances reveal one step at a time, lowest rank first (#N → … → #2, then #2 + #1 together)
- Revealed teams stay visible and stack in rank order on screen
- Simple readable rows: rank, team color accent, name, total score (static numbers, no counters)
- Subtle on-screen hint before first reveal (e.g. "Press Space to reveal")
- Ignore spacebar after all teams are revealed
- Support any team count (not only 8); skip absent ranks naturally via array length

**Non-Goals:**

- Particles, shockwaves, camera, score counters, Anime.js, or master timeline
- Button-based trigger (spacebar only for stepping; no "Reveal Standings" overlay)
- Changes to `/reveal` cinematic page or its components
- Text presets, delta scores, replay/reset controls
- Reduced-motion branching (page is already static/minimal; show all teams immediately if preferred, or same stepped UX—default: same spacebar UX for consistency)

## Decisions

### 1. Route: `/reveal/manual` with dedicated layout

**Decision:** Add `app/reveal/manual/page.tsx` and `app/reveal/manual/layout.tsx` with `background: #fff` and dark text. Do not reuse `app/reveal/layout.tsx` black wrapper.

**Rationale:** Keeps manual reveal discoverable alongside cinematic reveal without coupling styles.

**Alternative considered:** `/manual-reveal` top-level route — rejected; groups reveal variants under one URL prefix.

### 2. Single client component with `revealedCount` state

**Decision:** `ManualWhiteReveal` client component holds `revealedCount` (number of teams currently visible). On `keydown` for `Space` (when not complete):

```
nextCount = revealedCount + 1
if only #1 remains hidden (revealedCount === teams.length - 2):
  nextCount = teams.length   // reveal #2 and #1 together
else:
  nextCount = min(revealedCount + 1, teams.length)
```

Reveal order: teams displayed bottom-to-top by rank. Store teams in winner-first order (`teams[0]` = #1). Render slice from the end:

- After 1 press: show `teams[teams.length - 1]` (#N)
- After k presses: show `teams.slice(teams.length - k)` reversed for display (#N … #N-k+1)
- On penultimate step: jump to full `teams` list

**Rationale:** Minimal state machine; no animation engine. Combined #2+#1 matches presenter flow ("and the winner is…" on same beat as #2).

### 3. Plain list UI, no shared cinematic CSS

**Decision:** New `components/reveal/manual/ManualRevealList.tsx` and `manual-reveal.css` with:

- White page, `#111` text, system font stack
- Row: `#rank` · color swatch · name · score
- No glassmorphism, glow, or transforms
- Optional instant opacity (no transition) or a 150ms fade — default **no animation** per "no intensity"

**Rationale:** Avoids pulling `reveal.css` dark-theme rules into a white page.

### 4. Keyboard handling

**Decision:** `useEffect` on `window` for `keydown`. Call `preventDefault()` on Space when advancing (avoids page scroll). Guard: ignore repeat events while key is held (`e.repeat`). Ignore input when `revealedCount >= teams.length`.

**Rationale:** Presenter uses wireless clicker / spacebar; fullscreen page should not scroll.

### 5. Empty and single-team edge cases

**Decision:**

- 0 teams: show "No teams" message, spacebar no-op
- 1 team: first spacebar reveals #1 (already the only remaining team)
- 2 teams: first press reveals #2, second press reveals #1 (penultimate logic covers when `length - 2 === 0`, first press reveals both)

Wait, let me recalculate for 2 teams:
- teams[0] = #1, teams[1] = #2
- revealedCount = 0: only #2 remains to reveal before final? 
- Order: #2 first, then #1
- Press 1: reveal #2 → revealedCount = 1 (teams.length - 2 = 0, so we're at penultimate...)

Actually the penultimate logic: when revealing #2 (rank 2), also reveal #1.

For 8 teams: indices 0=#1, 7=#8
- Press 1: reveal index 7 (#8) → revealedCount = 1
- Press 2: #7 → count 2
- ...
- Press 6: reveal #3 → count 6
- Press 7: reveal #2 AND #1 → count 8 (jump from 6 to 8)

When revealedCount === teams.length - 2, next press reveals 2 teams.

For 2 teams:
- Press 1: revealedCount=0, teams.length-2=0, so first press reveals both? That would skip showing #2 alone.

User said: "When #2 will be revealed, also reveal #1". So for 2 teams:
- Press 1: reveal #2 only
- Press 2: would reveal #1 but #2 reveal should also show #1...

Re-read: "every team will be revealed on a press of the space bar" and "When the #2 will be revealed. Also reveal #1 since thats the only one left."

So the combined step is specifically when we're about to reveal rank #2 — at that moment we also reveal #1. For 2 teams:
- Press 1: #2
- Press 2: #1 — but user said when #2 is revealed, also #1. So for 2 teams, press 1 should reveal BOTH #2 and #1?

"When the #2 will be revealed" — the moment we reveal position 2, we also reveal position 1. For exactly 2 teams, revealing #2 IS the step where #1 is also revealed (since #1 is the only one left). So one press reveals both #2 and #1.

For 8 teams:
- 7 presses total? 
  - Presses 1-6: #8, #7, #6, #5, #4, #3 (6 teams)
  - Press 7: #2 and #1 together

That's 7 presses for 8 teams. Good.

For 2 teams: 1 press reveals #2 and #1 together.

For 1 team: 1 press reveals #1.

Logic: 
```
if revealedCount >= teams.length: return
if revealedCount === teams.length - 2:
  setRevealedCount(teams.length)  // reveal last two ranks
else:
  setRevealedCount(revealedCount + 1)
```

For 2 teams, length-2=0, first press (revealedCount=0) triggers combined reveal. Good.

For 8 teams, when revealedCount=6 (six teams shown: #8-#3), next press shows #2+#1. Good.

### 6. Data loading mirrors `/reveal`

**Decision:** Server component page fetches teams same as `app/reveal/page.tsx` (`getAllTeams`, fallback `DEMO_REVEAL_TEAMS`).

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Spacebar scrolls page | `preventDefault` on handled keydown |
| Black parent layout bleeds through | Dedicated white `layout.tsx` on manual route |
| Presenter doesn't know to press Space | Persistent subtle hint until first reveal |
| Key repeat advances too fast | Ignore `e.repeat` |

## Migration Plan

1. Add `app/reveal/manual/layout.tsx` and `page.tsx`
2. Add `ManualWhiteReveal` + list component + minimal CSS
3. Manual test: 8 teams, 2 teams, 1 team, spacebar pacing
4. Run `npm run build`

**Rollback:** Delete manual route and components; no impact on `/reveal`.

## Open Questions

- Link from main app to `/reveal/manual`? Default: defer (operators can bookmark URL).
- Show hint after completion? Default: hide hint once all teams visible.
