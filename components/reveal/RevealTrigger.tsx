interface RevealTriggerProps {
  variant: "fullscreen" | "compact"
  teamCount?: number
  onReveal: () => void
  disabled?: boolean
}

export function RevealTrigger({ variant, teamCount, onReveal, disabled }: RevealTriggerProps) {
  if (variant === "compact") {
    return (
      <button
        type="button"
        className="reveal-trigger reveal-trigger-compact"
        onClick={onReveal}
        disabled={disabled}
      >
        Reveal Again
      </button>
    )
  }

  const teamLabel = teamCount === 1 ? "team" : "teams"

  return (
    <div className="reveal-trigger reveal-trigger-fullscreen" role="presentation">
      <div className="reveal-trigger-content">
        {teamCount !== undefined && (
          <p className="reveal-trigger-subtitle">
            {teamCount} {teamLabel} ready
          </p>
        )}
        <button
          type="button"
          className="reveal-trigger-button"
          onClick={onReveal}
          disabled={disabled}
        >
          Reveal Standings
        </button>
      </div>
    </div>
  )
}
