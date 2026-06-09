## ADDED Requirements

### Requirement: Reveal text profile model

The system SHALL define a `RevealTextProfile` containing all user-facing copy for a reveal sequence: boot title, showdown text, winner badge label, static standings heading, reveal button label, and reveal-again button label.

#### Scenario: Profile fields

- **WHEN** a reveal text profile is loaded
- **THEN** it provides `bootTitle`, `showdownText`, `winnerBadge`, `staticHeading`, `revealButton`, and `revealAgainButton` as non-empty strings

---

### Requirement: Built-in text presets

The system SHALL ship at least three built-in presets selectable by name:

| Preset | bootTitle | showdownText | winnerBadge |
|--------|-----------|--------------|-------------|
| `finals` | FINAL RESULTS | ONLY TWO REMAIN | CHAMPION |
| `round` | CURRENT STANDINGS | TOP TWO REMAIN | IN THE LEAD |
| `midpoint` | HALFWAY STANDINGS | WHO TAKES FIRST? | LEADER |

#### Scenario: Finals preset default

- **WHEN** no preset is specified on `/reveal`
- **THEN** the `finals` preset is used

#### Scenario: Round preset

- **WHEN** a user navigates to `/reveal?preset=round`
- **THEN** the round preset copy is used for all overlay and button text

#### Scenario: Midpoint preset

- **WHEN** a user navigates to `/reveal?preset=midpoint`
- **THEN** the midpoint preset copy is used for all overlay and button text

---

### Requirement: Per-field text overrides

The system SHALL allow optional URL query parameter overrides for individual text fields without changing the preset.

#### Scenario: Override boot title

- **WHEN** a user navigates to `/reveal?preset=round&bootTitle=DAY%202%20RESULTS`
- **THEN** the boot title displays "DAY 2 RESULTS"
- **AND** all other text fields use the `round` preset defaults

#### Scenario: Invalid override ignored

- **WHEN** an override parameter is empty or whitespace-only
- **THEN** the preset default for that field is used

---

### Requirement: Consistent copy across modes

Configurable text SHALL be applied consistently to cinematic overlays, the manual trigger UI, the reveal-again control, and the reduced-motion static standings view.

#### Scenario: Static fallback uses profile

- **WHEN** reduced motion is preferred
- **THEN** the static standings heading uses `staticHeading` from the active profile
- **AND** the winner row badge uses `winnerBadge` from the active profile
