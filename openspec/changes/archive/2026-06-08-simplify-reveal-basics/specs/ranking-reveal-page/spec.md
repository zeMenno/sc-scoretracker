## MODIFIED Requirements

### Requirement: Reveal page route

The system SHALL expose a dedicated `/reveal` page for fullscreen competition standings reveals, optimized for projectors and large displays at live events.

#### Scenario: Page loads at reveal route

- **WHEN** a user navigates to `/reveal`
- **THEN** the page renders fullscreen without standard app chrome distractions
- **AND** the cinematic reveal sequence begins automatically when motion is enabled

#### Scenario: Page accepts team data

- **WHEN** team data is provided to the reveal page
- **THEN** each team SHALL include `id`, `name`, `color`, and `totalScore`
- **AND** teams SHALL be treated as pre-sorted by `totalScore` descending (index 0 is the winner)

---

### Requirement: Ten-second master timeline

All motion SHALL be orchestrated by a single Anime.js v4 master timeline with a total duration of approximately 10 seconds. The system MUST NOT use scattered `setTimeout` calls for choreography.

#### Scenario: Phase 0 — Intro (0.0s–0.8s)

- **WHEN** the sequence starts at 0.0s
- **THEN** the screen transitions from black as the background slowly becomes visible
- **AND** ambient particles emerge
- **AND** no team cards are shown
- **AND** no title or text overlays appear

#### Scenario: Phase 1 — Lower ranks (0.8s–6.0s)

- **WHEN** the timeline reaches 0.8s
- **THEN** teams are revealed from bottom rank upward (e.g. #8, #7, #6, #5 for 8 teams)
- **AND** each card slides up with overshoot, settles, animates its total score counter, and pulses a color glow
- **AND** each reveal emits a shockwave ripple, subtle screen vibration, and a particle burst matching the team color
- **AND** revealed cards remain visible and stack upward
- **AND** lower ranks use a faster stagger than the final positions

#### Scenario: Phase 2 — Top-rank emphasis (6.0s–10.0s)

- **WHEN** the timeline reaches 6.0s
- **THEN** the remaining unrevealed positions (typically #4, #3, #2, #1) are revealed with progressively longer pauses and richer motion
- **AND** positions #4 and #3 (when present) may include ranking tension such as temporary position swaps before locking
- **AND** before revealing #2 and #1, existing cards dim slightly and the camera zooms subtly
- **AND** position #2 is revealed before position #1 with a deliberate pause between them
- **AND** the winner (#1) receives the most dramatic effects: scale impact, particle explosion, radial light burst, screen shake, and environmental color flood
- **AND** no text overlays or badge labels appear during any phase
- **AND** the final frame holds with all standings visible

---

### Requirement: Premium team card design

Each revealed team SHALL display as a large, premium glassmorphism card with gradient border, strong depth, and team color accent.

#### Scenario: Card content

- **WHEN** a team card is revealed
- **THEN** it displays position number, team name, total score, and an animated color glow
- **AND** it does NOT display a delta or round-change score

#### Scenario: Card motion on reveal

- **WHEN** a card enters during any reveal phase
- **THEN** motion uses transform-only animations (translate, scale, rotate)
- **AND** easing uses cinematic curves (easeOutExpo, easeOutElastic, spring, cubicBezier)

---

### Requirement: Score counter animation

Total score values SHALL animate with dedicated counter logic synchronized to the master timeline.

#### Scenario: Score counts on reveal

- **WHEN** a team card is revealed
- **THEN** total score counts up from zero (or a starting value) to the final value
- **AND** no delta score counter is shown or animated

---

### Requirement: Reduced motion accessibility

The system SHALL respect `prefers-reduced-motion` and provide a clean standings view without cinematic effects.

#### Scenario: Reduced motion preferred

- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** cinematic effects, particles, screen shake, and timeline choreography are skipped
- **AND** final standings are displayed immediately in a readable, static layout with no configurable text profiles

#### Scenario: Full motion preferred

- **WHEN** reduced motion is not preferred
- **THEN** the full ~10-second cinematic sequence plays automatically on page load

---

### Requirement: Post-completion scene state

After the master timeline completes, the reveal scene SHALL remain in its final animated state.

#### Scenario: Final standings persist after completion

- **WHEN** the cinematic sequence completes
- **THEN** all revealed team cards remain fully visible on screen with final scores and positions
- **AND** the background remains fully visible
- **AND** no overlay covers the standings

## REMOVED Requirements

### Requirement: Manual reveal trigger

**Reason**: Simplified to a single auto-playing reveal flow; operators no longer need a start button.

**Migration**: Navigate to `/reveal` when ready—the sequence starts on load. Use browser refresh to replay.

### Requirement: Phase 1 — System boot (1.0s–2.5s)

**Reason**: Boot title phase removed to focus timeline on standings reveals.

**Migration**: Intro phase covers background ambience only; no replacement title beat.

### Requirement: Phase 4 — Final two showdown (7.5s–8.8s) text overlay

**Reason**: Showdown text overlays removed as part of text system elimination; visual dimming and camera zoom remain in the top-rank emphasis phase.

**Migration**: Top-rank emphasis phase handles showdown visuals without text.

### Requirement: Phase 5 — Winner reveal champion badge text

**Reason**: Text badge labels removed; winner distinguished by position, motion, and visual FX only.

**Migration**: Winner row is position #1 with enhanced glow and particles.
