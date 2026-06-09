import { forwardRef } from "react"

export const RevealBackground = forwardRef<HTMLDivElement>(function RevealBackground(_, ref) {
  return <div ref={ref} className="reveal-layer reveal-bg" aria-hidden />
})
