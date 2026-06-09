"use client"

import { useEffect, useState } from "react"

const BASE_WIDTH = 1920
const MAX_SCALE = 2

export function useRevealScale(): number {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const widthScale = w / BASE_WIDTH
      const heightScale = h / 1080
      setScale(Math.min(Math.max(widthScale, heightScale, 1), MAX_SCALE))
    }

    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  return scale
}
