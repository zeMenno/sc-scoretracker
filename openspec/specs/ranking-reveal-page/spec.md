# Ranking Reveal Page

Fullscreen cinematic standings reveal for live events, optimized for projectors and large displays.

## Requirements

### Requirement: Reveal page route

The system SHALL expose a dedicated `/reveal` page for fullscreen competition standings reveals, optimized for projectors and large displays at live events.

#### Scenario: Page loads at reveal route

- **WHEN** a user navigates to `/reveal`
- **THEN** the page renders fullscreen without standard app chrome distractions
- **AND** the page enters an idle ready state with a reveal button when full motion is enabled
- **AND** the cinematic reveal sequence does NOT begin automatically on load

#### Scenario: Page accepts team data

- **WHEN** team data is provided to the reveal page
- **THEN** each team SHALL include `id`, `name`, `color`, and `totalScore`
- **AND** teams SHALL be treated as pre-sorted by `totalScore` descending (index 0 is the winner)

---

### Requirement: Dynamic team count adaptation

The reveal animation SHALL adapt automatically to any number of teams (typically 8, sometimes fewer or more) without manual configuration.

#### Scenario: Eight teams

- **WHEN** 8 teams are provided
- **THEN** all eight positions are revealed following the standard timeline phases

#### Scenario: Fewer than eight teams

- **WHEN** fewer than 8 teams are provided
- **THEN** the timeline skips absent rank slots
- **AND** phase durations redistribute proportionally so the total sequence remains approximately 10 seconds

#### Scenario: More than eight teams

- **WHEN** more than 8 teams are provided
- **THEN** lowest ranks beyond the standard middle-rank drama window are revealed in the bottom-up phase with appropriate stagger
- **AND** the final-two showdown and winner reveal still apply to positions #2 and #1

---

### Requirement: Visual layer composition

The reveal page SHALL render layered visual elements: animated dark gradient mesh background, diagonal cinematic light sweeps, subtle perspective arena grid, and a centered leaderboard layer as the primary focus.

#### Scenario: Background layer

- **WHEN** the reveal sequence is active
- **THEN** a slow-moving dark gradient mesh background is visible
- **AND** a soft particle field and volumetric lighting effect are present
- **AND** a very subtle noise texture overlays the background

#### Scenario: Light sweep layer

- **WHEN** the reveal sequence is active
- **THEN** large diagonal light rays move slowly across the screen to create depth

#### Scenario: Arena layer

- **WHEN** the reveal sequence is active
- **THEN** a subtle invisible-perspective grid is visible to convey scale

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

### Requirement: Particle system

The system SHALL provide a lightweight DOM-based particle engine (no canvas libraries) that emits GPU-friendly particles inheriting team colors.

#### Scenario: Particle emission triggers

- **WHEN** a team is revealed, ranks change, or the winner sequence plays
- **THEN** particles emit in the team's color
- **AND** particles are removed after animation completes to avoid DOM bloat

---

### Requirement: Simulated camera movement

The system SHALL simulate cinematic camera movement by animating container transforms so the viewport never feels static.

#### Scenario: Camera motion during sequence

- **WHEN** the reveal sequence plays
- **THEN** the camera container applies scale, translate, and subtle rotation transforms
- **AND** all camera motion uses transform-only properties

---

### Requirement: Score counter animation

Total score values SHALL animate with dedicated counter logic synchronized to the master timeline.

#### Scenario: Score counts on reveal

- **WHEN** a team card is revealed
- **THEN** total score counts up from zero (or a starting value) to the final value
- **AND** no delta score counter is shown or animated

---

### Requirement: Performance at 60 FPS

The reveal page SHALL maintain 60 FPS on modern laptops, projector PCs, and typical event hardware.

#### Scenario: Transform-only animations

- **WHEN** any animation runs
- **THEN** only `transform` and `opacity` properties are animated for core motion
- **AND** layout-thrashing properties (width, height, top, left) are avoided
- **AND** heavy box shadows and expensive reflows are minimized

---

### Requirement: Responsive display scaling

The reveal page SHALL scale elegantly across 1920×1080, 4K displays, large TVs, and projectors.

#### Scenario: Large display rendering

- **WHEN** the viewport is 1920×1080 or larger
- **THEN** all layers, cards, and typography scale proportionally
- **AND** the leaderboard remains centered with massive visual presence

---

### Requirement: Reduced motion accessibility

The system SHALL respect `prefers-reduced-motion` and provide a clean standings view without cinematic effects.

#### Scenario: Reduced motion preferred

- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** cinematic effects, particles, screen shake, and timeline choreography are skipped
- **AND** final standings are displayed immediately in a readable, static layout with no configurable text profiles

#### Scenario: Full motion preferred

- **WHEN** reduced motion is not preferred
- **THEN** the page shows an idle ready state with a reveal button
- **AND** the ~10-second cinematic sequence starts only when the operator clicks the reveal button

---

### Requirement: Post-completion scene state

After the master timeline completes, the reveal scene SHALL remain in its final animated state.

#### Scenario: Final standings persist after completion

- **WHEN** the cinematic sequence completes
- **THEN** all revealed team cards remain fully visible on screen with final scores and positions
- **AND** the background remains fully visible
- **AND** no fullscreen overlay covers the standings

---

### Requirement: Manual reveal trigger

The reveal page SHALL require explicit operator action to start the cinematic sequence when full motion is enabled.

#### Scenario: Ready state on load

- **WHEN** the reveal page loads with full motion enabled
- **THEN** a fullscreen ready state is shown with team count visible
- **AND** a prominent reveal button displays the label "Reveal Standings"
- **AND** a dimmed background preview is visible with no team cards shown
- **AND** no timeline animation runs

#### Scenario: Start on button click

- **WHEN** the operator clicks the reveal button
- **THEN** the ready state hides
- **AND** the ~10-second master timeline begins from 0.0s

#### Scenario: Reveal again after completion

- **WHEN** the cinematic sequence completes
- **THEN** a non-blocking "Reveal Again" control appears in a bottom corner
- **AND** the control does not obscure the leaderboard
- **AND** clicking it resets the scene and replays the full sequence

#### Scenario: Reveal again during playback is ignored

- **WHEN** the operator attempts to trigger replay while the sequence is playing
- **THEN** no new sequence starts until the current playback completes

#### Scenario: Fullscreen trigger only before first play

- **WHEN** playback state is idle
- **THEN** the fullscreen reveal trigger overlay is shown
- **WHEN** playback state is complete
- **THEN** only the compact reveal-again control is shown, not the fullscreen idle overlay

---

### Requirement: Code organization

Reveal functionality SHALL be organized into separated, production-ready modules under the App Router structure.

#### Scenario: Module structure

- **WHEN** the reveal feature is implemented
- **THEN** the route lives at `app/reveal`
- **AND** UI components live under `components/reveal`
- **AND** React hooks live under `hooks/reveal`
- **AND** animation logic lives under `lib/reveal` including at minimum: `MasterTimeline`, `WinnerSequence`, `RevealCard`, `ParticleEngine`, `CameraController`, and `ScoreCounter`
