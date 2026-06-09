import { forwardRef } from "react"

export const ShockwaveOverlay = forwardRef<HTMLDivElement>(function ShockwaveOverlay(_, ref) {
  return <div ref={ref} className="reveal-layer reveal-shockwave" aria-hidden />
})
