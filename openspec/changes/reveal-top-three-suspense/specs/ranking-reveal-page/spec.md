## MODIFIED Requirements

### Requirement: Dynamic team count adaptation

The reveal animation SHALL adapt automatically to any number of teams (typically 8, sometimes fewer or more) without manual configuration.

#### Scenario: Eight teams

- **WHEN** 8 teams are provided
- **THEN** positions #8 through #4 are revealed individually in bottom-up order
- **AND** positions #3, #2, and #1 are revealed together after a suspense beat

#### Scenario: Fewer than eight teams

- **WHEN** fewer than 8 teams are provided
- **THEN** the timeline skips absent rank slots
- **AND** individual reveals run from the lowest present rank up to #4 (when present)
- **AND** phase durations redistribute proportionally so the total sequence remains approximately 10 seconds

#### Scenario: More than eight teams

- **WHEN** more than 8 teams are provided
- **THEN** lowest ranks beyond #4 are revealed in the bottom-up individual phase with appropriate stagger
- **AND** positions #3, #2, and #1 are still revealed together after a suspense beat

### Requirement: Ten-second master timeline

All motion SHALL be orchestrated by a single Anime.js v4 master timeline with a total duration of approximately 10 seconds. The system MUST NOT use scattered `setTimeout` calls for choreography.

#### Scenario: Phase 0 — Intro (0.0s–0.8s)

- **WHEN** the sequence starts at 0.0s
- **THEN** the screen transitions from black as the background slowly becomes visible
- **AND** ambient particles emerge
- **AND** no team cards are shown
- **AND** no title or text overlays appear

#### Scenario: Phase 1 — Individual ranks (0.8s–~5.5s)

- **WHEN** the timeline reaches 0.8s
- **THEN** teams are revealed from bottom rank upward one at a time through position #4 (e.g. #8, #7, #6, #5, #4 for 8 teams)
- **AND** each card slides up with overshoot, settles, animates its total score counter, and pulses a color glow
- **AND** each reveal emits a shockwave ripple, subtle screen vibration, and a particle burst matching the team color
- **AND** revealed cards remain visible and stack upward
- **AND** individual ranks use a faster stagger than the final podium beat

#### Scenario: Phase 2 — Top-three suspense and reveal (~5.5s–10.0s)

- **WHEN** position #4 has been revealed (or the individual phase is skipped when fewer than 4 teams)
- **THEN** a suspense beat plays: existing cards dim slightly, the camera zooms subtly, and a brief hold occurs with no new cards shown
- **AND** positions #3, #2, and #1 (when present) are revealed simultaneously on the same timeline beat
- **AND** all three podium cards slide in, animate score counters, and emit particle bursts together
- **AND** position #1 receives the most dramatic effects within the trio beat: scale impact, particle explosion, radial light burst, screen shake, and environmental color flood
- **AND** no text overlays or badge labels appear during any phase
- **AND** the final frame holds with all standings visible
