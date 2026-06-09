## Context

`/reveal/manual` ships a white-screen, plain-text reveal with spacebar pacing (#N → #1, #2+#1 combined on the final press). `/reveal` provides the premium dark-stage experience: `RevealCard` glassmorphism, `reveal.css`, `ParticleEngine`, and a `reveal-winner-glow` layer driven by Anime.js timelines.

Operators want manual pacing without the full 10-second auto show, but with the same visual language—dark background, score cards, colored particles, and a winner-color screen glow when #1 appears.

## Goals / Non-Goals

**Goals:**

- Match `/reveal` dark stage and `RevealCard` presentation on `/reveal/manual`
- Keep existing spacebar reveal order and penultimate #2+#1 combined step
- Emit team-colored particle bursts on every reveal step
- On the final step (when #1 is revealed), show a large radial screen glow in the #1 team's color
- Light per-card entrance animation (opacity, translateY, glow fade-in) and score count-up on each newly revealed card
- Subtle ambient background (reuse `RevealBackground`) for visual continuity
- Preserve presenter hint ("Press Space to reveal") before the first step

**Non-Goals:**

- Master timeline, auto-play, camera motion, shockwaves, light sweeps, screen shake, or confetti
- Changes to `/reveal` cinematic page or `MasterTimeline`
- Replay/reset controls
- Reduced-motion branching (manual page can show static standings if motion is reduced—same pattern as cinematic fallback)

## Decisions

### 1. Reuse cinematic visual stack, not white custom CSS

**Decision:** Switch `app/reveal/manual/layout.tsx` to black background (`#000`) and import `reveal.css` in the manual client root. Remove `manual-reveal.css` white styles.

**Rationale:** Single source of truth for card and particle styling; avoids drift between pages.

**Alternative considered:** Duplicate card styles in manual CSS — rejected; maintenance burden.

### 2. Pre-render full leaderboard, reveal cards incrementally

**Decision:** Use `RevealLeaderboard` (or a thin `ManualRevealLeaderboard` wrapper) rendering all teams in winner-first stack order. Cards start hidden (`opacity: 0`). Each spacebar press reveals the next rank from the bottom (#N upward) by animating the corresponding card ref.

Mapping: rank `r` → array index `teams.length - r`. Reveal sequence touches indices `length-1, length-2, …, 1, 0` with the final press jumping from index `1` to also reveal index `0`.

**Rationale:** Reuses `cardTopOffset` stacking so cards land in the same positions as cinematic reveal. Particle burst coordinates come from `getBoundingClientRect()` on the card root.

### 3. Lightweight Anime.js per-step animations (not MasterTimeline)

**Decision:** Add `lib/reveal/manualRevealStep.ts` with functions:

- `animateCardReveal(card, team, particles)` — card slide-up + glow + `animateCounter` + `particles.emitBurst` (10–20 particles for mid ranks, 32+ for #1)
- `animateWinnerGlow(winnerGlowEl, winnerColor)` — reuse winner glow keyframes from `WinnerSequence` (opacity 0→0.7→0.45, scale 0.5→2.5, ~900ms) without camera/shake/confetti

Call these imperatively from the spacebar handler after updating `revealedCount`.

**Rationale:** Manual pacing needs discrete step triggers, not a continuous timeline. Sharing animation parameters with `WinnerSequence` keeps visual consistency.

**Alternative considered:** Import `MasterTimeline` segments — rejected; tightly coupled to auto-play phases.

### 4. ParticleEngine lifecycle

**Decision:** Instantiate one `ParticleEngine` on mount (particle container div inside `reveal-root`), destroy on unmount. Reuse the same `.reveal-particle` CSS class.

**Rationale:** Identical particle look; pool is small and safe for stepped reveals.

### 5. Winner glow layer

**Decision:** Add a `reveal-winner-glow` div (same class as cinematic page). Set `backgroundColor` to `teams[0].color` on mount. Animate only when index `0` (#1) is revealed on the final step.

**Rationale:** Delivers the requested "big glow of the color on #1" without full winner sequence effects.

### 6. Penultimate combined reveal animation

**Decision:** When `revealedCount` jumps to `teams.length`, animate both remaining cards (#2 at index 1, #1 at index 0) in the same step. Run winner glow and larger particle burst only for #1; #2 gets standard card reveal.

**Rationale:** Matches existing manual pacing spec; glow is winner-specific.

### 7. Component rename (optional cleanup)

**Decision:** Rename `ManualWhiteReveal` → `ManualRevealExperience` during implementation; keep file exports stable or update imports in `page.tsx`.

**Rationale:** Name no longer reflects white styling.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Card refs not ready on first animation frame | `requestAnimationFrame` before reading `getBoundingClientRect()` |
| Double animation if spacebar pressed during in-flight animation | Ignore spacebar while `isAnimating` ref is true |
| Winner glow too intense on projectors | Match cinematic opacity values (max ~0.7); tunable in CSS |
| Importing anime.js increases manual bundle | Already a project dependency via cinematic reveal |
| `RevealLeaderboard` couples to `MasterTimeline` `cardTopOffset` | Acceptable shared layout helper; only imports pure functions |

## Migration Plan

1. Update manual layout to dark + `reveal-root` structure
2. Replace `ManualRevealList` with leaderboard + particle/glow layers
3. Wire spacebar handler to step animations
4. Delete `manual-reveal.css`
5. Manual test: 8-team sequence, final glow color matches #1, particles on each step
6. Run `npm run build`

**Rollback:** Revert manual components to white plain list; no impact on `/reveal`.

## Open Questions

- Include subtle `RevealBackground` gradient mesh? **Default: yes** — low cost, matches cinematic idle look.
- Score count-up on every card or only top ranks? **Default: every card** — matches cinematic card reveals.
