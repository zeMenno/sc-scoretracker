## MODIFIED Requirements

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

#### Scenario: Final standings persist after completion

- **WHEN** the cinematic sequence completes
- **THEN** all revealed team cards remain fully visible on screen with final scores and positions
- **AND** the winner badge and background remain visible
- **AND** no fullscreen overlay covers the standings

#### Scenario: Reveal again after completion

- **WHEN** the cinematic sequence completes
- **THEN** a non-blocking reveal-again control appears using the active profile's `revealAgainButton` label
- **AND** the control is positioned so it does not obscure the leaderboard (e.g. bottom corner)
- **AND** clicking it resets the scene and replays the full sequence

#### Scenario: Reveal again during playback is idempotent

- **WHEN** the operator clicks reveal again while the sequence is playing
- **THEN** the click is ignored until the current sequence completes

## ADDED Requirements

### Requirement: Post-completion scene state

After the master timeline completes, the reveal scene SHALL remain in its final animated state without reverting to the idle preview.

#### Scenario: No idle overlay after complete

- **WHEN** playback state transitions to `complete`
- **THEN** the black intro overlay opacity is 0 (fully hidden)
- **AND** the background is fully visible
- **AND** all team cards retain opacity 1 (or their post-winner dimmed values from the final frame)

#### Scenario: Fullscreen trigger only before first play

- **WHEN** playback state is `idle`
- **THEN** the fullscreen reveal trigger overlay is shown
- **WHEN** playback state is `complete`
- **THEN** only the compact reveal-again control is shown, not the fullscreen idle overlay
