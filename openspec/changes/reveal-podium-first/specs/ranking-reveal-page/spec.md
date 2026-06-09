## MODIFIED Requirements

### Requirement: Dynamic team count adaptation

The reveal animation SHALL adapt automatically to any number of teams (typically 8, sometimes fewer or more) without manual configuration.

#### Scenario: Eight teams

- **WHEN** 8 teams are provided
- **THEN** positions #3, #2, and #1 are revealed first with the richest effects after a suspense beat
- **AND** positions #4 through #8 are revealed afterward with subdued motion

#### Scenario: Fewer than eight teams

- **WHEN** fewer than 8 teams are provided
- **THEN** the timeline skips absent rank slots
- **AND** the podium phase covers the highest present ranks (#3, #2, #1 or fewer)
- **AND** any remaining ranks below the podium use the subdued tail phase
- **AND** phase durations redistribute proportionally so the total sequence remains approximately 10 seconds

#### Scenario: More than eight teams

- **WHEN** more than 8 teams are provided
- **THEN** positions #3, #2, and #1 are still revealed first with full podium emphasis
- **AND** ranks #4 and below are revealed in the subdued tail phase with appropriate stagger

### Requirement: Ten-second master timeline

All motion SHALL be orchestrated by a single Anime.js v4 master timeline with a total duration of approximately 10 seconds. The system MUST NOT use scattered `setTimeout` calls for choreography.

#### Scenario: Phase 0 — Intro (0.0s–0.8s)

- **WHEN** the sequence starts at 0.0s
- **THEN** the screen transitions from black as the background slowly becomes visible
- **AND** ambient particles emerge
- **AND** no team cards are shown
- **AND** no title or text overlays appear

#### Scenario: Phase 1 — Podium suspense and reveal (~0.8s–~4.5s)

- **WHEN** the timeline reaches ~0.8s
- **THEN** a suspense beat plays before any cards appear: camera zoom, light sweep, and brief hold
- **AND** positions #3, #2, and #1 (when present) are revealed simultaneously on the same timeline beat
- **AND** all three podium cards slide in, animate score counters, and emit particle bursts together
- **AND** position #1 receives the most dramatic effects: scale impact, particle explosion, radial light burst, screen shake, and environmental color flood
- **AND** this phase uses the richest motion and effects in the sequence

#### Scenario: Phase 2 — Tail ranks (~4.5s–10.0s)

- **WHEN** the podium reveal completes
- **THEN** remaining positions (#4 through the lowest rank, when present) are revealed in ascending rank order
- **AND** tail-rank cards use subdued motion: no screen shake, no per-card shockwave, smaller particle bursts, and faster stagger
- **AND** already-revealed podium cards remain at full prominence while tail cards fill in
- **AND** no text overlays or badge labels appear during any phase
- **AND** the final frame holds with all standings visible
