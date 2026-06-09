import { animate } from "animejs"

import type { JSAnimation } from "animejs"



export function animateCounter(

  element: HTMLElement,

  from: number,

  to: number,

  duration: number,

  ease: string = "outExpo",

): JSAnimation {

  const state = { value: from }

  element.textContent = formatScore(from)



  return animate(state, {

    value: to,

    duration,

    ease,

    onUpdate: () => {

      element.textContent = formatScore(Math.round(state.value))

    },

  })

}



function formatScore(n: number): string {

  return n.toLocaleString("en-US")

}


