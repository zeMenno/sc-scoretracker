## ADDED Requirements

### Requirement: Reveal page route

The system SHALL expose a dedicated `/reveal` page for fullscreen competition standings reveals, optimized for projectors and large displays at live events.

#### Scenario: Page loads at reveal route

- **WHEN** a user navigates to `/reveal`
- **THEN** the page renders fullscreen without standard app chrome distractions
- **AND** the cinematic reveal sequence begins automatically

#### Scenario: Page accepts team data

- **WHEN** team data is provided to the reveal page
- **THEN** each team SHALL include `id`, `name`, `color`, `totalScore`, and `deltaScore`
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

#### Scenario: Phase 0 — Black intro (0.0s–1.0s)

- **WHEN** the sequence starts at 0.0s
- **THEN** the screen is black with cinematic ambience
- **AND** tiny particles emerge as the background slowly becomes visible
- **AND** no team cards are shown

#### Scenario: Phase 1 — System boot (1.0s–2.5s)

- **WHEN** the timeline reaches 1.0s
- **THEN** a massive glowing "FINAL RESULTS" title assembles from particles with slight chromatic aberration
- **AND** light sweeps cross the screen with a subtle camera push-in
- **AND** the title dissolves after reveal

#### Scenario: Phase 2 — Lowest ranks (2.5s–5.5s)

- **WHEN** the timeline reaches 2.5s
- **THEN** teams are revealed from bottom rank upward (e.g. #8, #7, #6, #5 for 8 teams)
- **AND** each card slides up with overshoot, settles, animates score and delta counters, and pulses a color glow
- **AND** each reveal emits a shockwave ripple, subtle screen vibration, and a particle burst matching the team color
- **AND** revealed cards remain visible and stack upward

#### Scenario: Phase 3 — Middle rank drama (5.5s–7.5s)

- **WHEN** the timeline reaches 5.5s
- **THEN** positions #4 and #3 are revealed with ranking tension
- **AND** cards temporarily swap positions before locking into actual standings
- **AND** delta scores and totals animate rapidly before settling

#### Scenario: Phase 4 — Final two showdown (7.5s–8.8s)

- **WHEN** the timeline reaches 7.5s
- **THEN** only positions #2 and #1 remain hidden
- **AND** motion slows, existing cards dim slightly, and the camera zooms subtly
- **AND** "ONLY TWO REMAIN" text appears prominently then is removed

#### Scenario: Phase 5 — Winner reveal (8.8s–10.0s)

- **WHEN** the timeline reaches 8.8s
- **THEN** second place is revealed first, followed by a ~500ms pause
- **AND** the winner card crashes into center with scale 0.4 → 1.3 → 1.0
- **AND** a massive particle explosion, radial light burst, colored energy wave, screen shake, and confetti occur
- **AND** the winner's color floods the environment and all cards illuminate
- **AND** score and delta counters animate dramatically
- **AND** a gold "CHAMPION" badge appears beneath the winner
- **AND** the final frame holds

---

### Requirement: Premium team card design

Each revealed team SHALL display as a large, premium glassmorphism card with gradient border, strong depth, and team color accent.

#### Scenario: Card content

- **WHEN** a team card is revealed
- **THEN** it displays position number, team name, delta score, total score, and an animated color glow

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

Total score and delta score values SHALL animate with dedicated counter logic synchronized to the master timeline.

#### Scenario: Score counts on reveal

- **WHEN** a team card is revealed
- **THEN** total score counts up from zero (or a starting value) to the final value
- **AND** delta score animates in sync with the card reveal timing

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
- **AND** final standings are displayed immediately in a readable, static layout

#### Scenario: Full motion preferred

- **WHEN** reduced motion is not preferred
- **THEN** the full 10-second cinematic sequence plays

---

### Requirement: Code organization

Reveal functionality SHALL be organized into separated, production-ready modules under the App Router structure.

#### Scenario: Module structure

- **WHEN** the reveal feature is implemented
- **THEN** the route lives at `app/reveal`
- **AND** UI components live under `components/reveal`
- **AND** React hooks live under `hooks/reveal`
- **AND** animation logic lives under `lib/reveal` including at minimum: `MasterTimeline`, `WinnerSequence`, `RevealCard`, `ParticleEngine`, `CameraController`, and `ScoreCounter`
