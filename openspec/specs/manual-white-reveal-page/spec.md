# Manual White Reveal Page

Minimal, presenter-controlled standings reveal on a plain white fullscreen background, separate from the cinematic `/reveal` page.

## Requirements

### Requirement: Manual white reveal route

The system SHALL expose a dedicated `/reveal/manual` page for a minimal, presenter-controlled standings reveal on a plain white fullscreen background, separate from the cinematic `/reveal` page.

#### Scenario: Page loads at manual reveal route

- **WHEN** a user navigates to `/reveal/manual`
- **THEN** the page renders fullscreen with a white background and dark readable text
- **AND** no cinematic effects, particles, camera motion, or timeline animation run
- **AND** no team standings are visible until the operator advances the reveal

#### Scenario: Page accepts team data

- **WHEN** team data is provided to the manual reveal page
- **THEN** each team SHALL include `id`, `name`, `color`, and `totalScore`
- **AND** teams SHALL be treated as pre-sorted by `totalScore` descending (index 0 is rank #1)

---

### Requirement: Spacebar-stepped reveal order

The manual reveal page SHALL reveal teams one step at a time in ascending rank order, starting from the lowest position (#N) and progressing toward #1, triggered by the space bar.

#### Scenario: First press reveals lowest rank

- **WHEN** the page has loaded and the operator presses the space bar for the first time
- **THEN** only the team at the lowest rank (#N, where N is the team count) becomes visible
- **AND** previously hidden teams remain hidden

#### Scenario: Each press reveals the next rank

- **WHEN** the operator presses the space bar and more than two teams remain unrevealed
- **THEN** exactly one additional team is revealed at the next higher rank
- **AND** all previously revealed teams remain visible

#### Scenario: Penultimate press reveals #2 and #1 together

- **WHEN** the operator presses the space bar and only ranks #2 and #1 remain unrevealed
- **THEN** both rank #2 and rank #1 are revealed on that single press
- **AND** no additional press is required to reveal the winner

#### Scenario: No action after all teams revealed

- **WHEN** all teams have been revealed
- **THEN** further space bar presses do not change the displayed standings

#### Scenario: Key repeat ignored

- **WHEN** the operator holds the space bar down
- **THEN** the reveal advances at most one step per deliberate press (key repeat events are ignored)

---

### Requirement: Plain standings presentation

Revealed teams SHALL be displayed in a simple, functional layout without dramatic visual effects.

#### Scenario: Row content

- **WHEN** a team is revealed
- **THEN** its row displays rank number, team name, team color accent, and total score
- **AND** scores are shown as static values (no count-up animation)
- **AND** no delta or round-change score is displayed

#### Scenario: No cinematic layers

- **WHEN** the manual reveal page is active
- **THEN** no particle effects, shockwaves, screen shake, gradient mesh, light sweeps, or simulated camera movement are present

#### Scenario: Operator hint before first reveal

- **WHEN** no teams have been revealed yet
- **THEN** a subtle on-screen hint indicates the operator may press space to begin
- **AND** the hint is hidden or removed once at least one team is revealed

---

### Requirement: Dynamic team count

The manual reveal page SHALL work for any number of teams without manual configuration.

#### Scenario: Eight teams

- **WHEN** 8 teams are provided
- **THEN** the reveal proceeds from #8 through #3 one per press, then #2 and #1 together on the final press (7 presses total)

#### Scenario: Two teams

- **WHEN** 2 teams are provided
- **THEN** rank #2 and rank #1 are both revealed on the first space bar press

#### Scenario: One team

- **WHEN** 1 team is provided
- **THEN** rank #1 is revealed on the first space bar press

#### Scenario: No teams

- **WHEN** no teams are provided
- **THEN** the page shows an empty-state message
- **AND** space bar presses have no effect

---

### Requirement: Manual reveal code organization

Manual reveal functionality SHALL be isolated from the cinematic reveal implementation.

#### Scenario: Module structure

- **WHEN** the manual reveal feature is implemented
- **THEN** the route lives at `app/reveal/manual`
- **AND** UI components live under `components/reveal/manual`
- **AND** the implementation does not depend on `MasterTimeline`, `ParticleEngine`, or other cinematic reveal animation modules
