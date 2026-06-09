## MODIFIED Requirements

### Requirement: Manual white reveal route

The system SHALL expose a dedicated `/reveal/manual` page for a presenter-controlled standings reveal on a dark fullscreen stage matching the cinematic `/reveal` visual language, separate from the auto-timed `/reveal` page.

#### Scenario: Page loads at manual reveal route

- **WHEN** a user navigates to `/reveal/manual`
- **THEN** the page renders fullscreen with a dark background consistent with `/reveal`
- **AND** no auto-timed timeline, camera motion, or shockwave choreography runs
- **AND** no team standings are visible until the operator advances the reveal

#### Scenario: Page accepts team data

- **WHEN** team data is provided to the manual reveal page
- **THEN** each team SHALL include `id`, `name`, `color`, and `totalScore`
- **AND** teams SHALL be treated as pre-sorted by `totalScore` descending (index 0 is rank #1)

---

### Requirement: Plain standings presentation

Revealed teams SHALL be displayed using the same premium `RevealCard` score cards and dark-stage styling as the cinematic reveal page, with per-step visual feedback on each spacebar advance.

#### Scenario: Card content

- **WHEN** a team is revealed
- **THEN** it displays as a glassmorphism score card with position number, team name, team color accent, and total score
- **AND** the total score animates from zero to the final value on reveal
- **AND** no delta or round-change score is displayed

#### Scenario: Particle burst on each reveal step

- **WHEN** a team card is revealed via spacebar
- **THEN** a colored particle burst emits at the card position in that team's color
- **AND** particles are removed after animation completes

#### Scenario: Winner screen glow on final step

- **WHEN** rank #1 is revealed (including the combined #2+#1 penultimate press)
- **THEN** a large radial screen glow appears in the #1 team's color
- **AND** the glow fades in and settles without requiring additional operator input

#### Scenario: Operator hint before first reveal

- **WHEN** no teams have been revealed yet
- **THEN** a subtle on-screen hint indicates the operator may press space to begin
- **AND** the hint is hidden or removed once at least one team is revealed

---

### Requirement: Manual reveal code organization

Manual reveal functionality SHALL reuse shared reveal presentation modules while remaining independent of the cinematic auto-play timeline.

#### Scenario: Module structure

- **WHEN** the manual reveal feature is implemented
- **THEN** the route lives at `app/reveal/manual`
- **AND** UI components live under `components/reveal/manual`
- **AND** the implementation MAY reuse `RevealCard`, `RevealLeaderboard`, `ParticleEngine`, `reveal.css`, and lightweight Anime.js step helpers
- **AND** the implementation does not depend on `MasterTimeline` or auto-play choreography
