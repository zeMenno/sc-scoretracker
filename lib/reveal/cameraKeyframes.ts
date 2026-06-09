import type { Timeline } from "animejs"
import { EASING } from "./types"

export function addCameraIntroPush(tl: Timeline, camera: HTMLElement, at: number): void {
  tl.add(
    camera,
    {
      scale: [{ to: 1 }, { to: 1.04 }],
      translateY: [{ to: 0 }, { to: -12 }],
      rotateZ: [{ to: 0 }, { to: 0.3 }],
      duration: 1500,
      ease: EASING.expo,
    },
    at,
  )
}

export function addCameraShowdownZoom(tl: Timeline, camera: HTMLElement, at: number): void {
  tl.add(
    camera,
    {
      scale: [{ to: 1.04 }, { to: 1.1 }],
      duration: 1300,
      ease: EASING.expo,
    },
    at,
  )
}

export function addCameraWinnerImpact(tl: Timeline, camera: HTMLElement, at: number): void {
  tl.add(
    camera,
    {
      scale: [{ to: 1.1 }, { to: 1.18 }, { to: 1.05 }],
      rotateZ: [{ to: 0.3 }, { to: -0.4 }, { to: 0 }],
      duration: 600,
      ease: EASING.spring,
    },
    at,
  )
}

export function addScreenShake(tl: Timeline, camera: HTMLElement, at: number): void {
  tl.add(
    camera,
    {
      translateX: [{ to: 0 }, { to: 4 }, { to: -4 }, { to: 3 }, { to: -2 }, { to: 0 }],
      duration: 400,
      ease: "linear",
    },
    at,
  )
}
