## MODIFIED Requirements

### Requirement: Reveal page route

The system SHALL expose a dedicated `/reveal` page for fullscreen competition standings reveals, optimized for projectors and large displays at live events.

#### Scenario: Page loads at reveal route

- **WHEN** a user navigates to `/reveal`
- **THEN** the page renders fullscreen without standard app chrome distractions
- **AND** the page displays a ready state with a prominent reveal button
- **AND** the cinematic reveal sequence does NOT start until the operator clicks the reveal button

#### Scenario: Page accepts team data

- **WHEN** team data is provided to the reveal page
- **THEN** each team SHALL include `id`, `name`, `color`, `totalScore`, and `deltaScore`
- **AND** teams SHALL be treated as pre-sorted by `totalScore` descending (index 0 is the winner)

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
- **THEN** a massive glowing boot title (from the active text profile's `bootTitle`) assembles from particles with slight chromatic aberration
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
- **AND** the showdown text (from the active text profile's `showdownText`) appears prominently then is removed

#### Scenario: Phase 5 — Winner reveal (8.8s–10.0s)

- **WHEN** the timeline reaches 8.8s
- **THEN** second place is revealed first, followed by a ~500ms pause
- **AND** the winner card crashes into center with scale 0.4 → 1.3 → 1.0
- **AND** a massive particle explosion, radial light burst, colored energy wave, screen shake, and confetti occur
- **AND** the winner's color floods the environment and all cards illuminate
- **AND** score and delta counters animate dramatically
- **AND** a gold winner badge (from the active text profile's `winnerBadge`) appears beneath the winner
- **AND** the final frame holds

---

### Requirement: Reduced motion accessibility

The system SHALL respect `prefers-reduced-motion` and provide a clean standings view without cinematic effects.

#### Scenario: Reduced motion preferred

- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** cinematic effects, particles, screen shake, and timeline choreography are skipped
- **AND** final standings are displayed immediately in a readable, static layout using the active text profile headings and badge labels

#### Scenario: Full motion preferred

- **WHEN** reduced motion is not preferred
- **THEN** the full 10-second cinematic sequence plays only after the operator triggers it

## ADDED Requirements

### Requirement: Manual reveal trigger

The reveal page SHALL require explicit operator action to start the cinematic sequence.

#### Scenario: Ready state on load

- **WHEN** the reveal page loads with full motion enabled
- **THEN** a fullscreen ready state is shown with team count visible
- **AND** a prominent reveal button displays the active profile's `revealButton` label (default: "Reveal Standings")
- **AND** no timeline animation runs

#### Scenario: Start on button click

- **WHEN** the operator clicks the reveal button
- **THEN** the ready state hides
- **AND** the 10-second master timeline begins from 0.0s

#### Scenario: Reveal again after completion

- **WHEN** the cinematic sequence completes
- **THEN** a reveal-again button appears using the active profile's `revealAgainButton` label
- **AND** clicking it resets the scene and replays the full sequence

#### Scenario: Reveal again during ready state is idempotent

- **WHEN** the operator clicks reveal again before the sequence finishes
- **THEN** the click is ignored until the current sequence completes or is reset
