## REMOVED Requirements

### Requirement: Reveal text profile model

**Reason**: Text profile system eliminated in favor of a single auto-playing standings reveal with no configurable copy.

**Migration**: Remove `?preset=`, `bootTitle`, `showdownText`, and other text override query params—they are no longer supported.

### Requirement: Built-in text presets

**Reason**: Presets (`finals`, `round`, `midpoint`) are no longer needed without text overlays.

**Migration**: Use `/reveal` without query parameters.

### Requirement: Per-field text overrides

**Reason**: URL text overrides depended on the removed profile system.

**Migration**: None—copy is not configurable.

### Requirement: Consistent copy across modes

**Reason**: No configurable copy remains; static fallback uses fixed labels.

**Migration**: Reduced-motion view shows a simple "Standings" heading.
