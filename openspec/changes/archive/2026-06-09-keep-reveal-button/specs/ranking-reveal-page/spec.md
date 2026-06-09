## MODIFIED Requirements

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

### Requirement: Post-completion scene state

After the master timeline completes, the reveal scene SHALL remain in its final animated state.

#### Scenario: Final standings persist after completion

- **WHEN** the cinematic sequence completes
- **THEN** all revealed team cards remain fully visible on screen with final scores and positions
- **AND** the background remains fully visible
- **AND** no fullscreen overlay covers the standings

## ADDED Requirements

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
