import { forwardRef } from "react"

export const ArenaGrid = forwardRef<HTMLDivElement>(function ArenaGrid(_, ref) {
  return (
    <div ref={ref} className="reveal-layer reveal-arena" aria-hidden>
      <div className="reveal-arena-grid" />
    </div>
  )
})
