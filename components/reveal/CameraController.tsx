"use client"

import { forwardRef, type ReactNode } from "react"

interface CameraControllerProps {
  children: ReactNode
  scale?: number
}

export const CameraController = forwardRef<HTMLDivElement, CameraControllerProps>(
  function CameraController({ children, scale = 1 }, ref) {
    return (
      <div
        ref={ref}
        className="reveal-camera"
        style={{ transform: `scale(${scale})` }}
      >
        {children}
      </div>
    )
  },
)
