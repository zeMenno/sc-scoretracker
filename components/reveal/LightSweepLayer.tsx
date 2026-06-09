import { forwardRef } from "react"

export const LightSweepLayer = forwardRef<HTMLDivElement>(function LightSweepLayer(_, ref) {
  return (
    <div ref={ref} className="reveal-layer reveal-light-sweep" aria-hidden>
      <div className="reveal-light-ray" />
    </div>
  )
})
