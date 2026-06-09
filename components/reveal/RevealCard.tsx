"use client"



import { forwardRef, useImperativeHandle, useRef } from "react"

import type { RevealCardRef } from "@/lib/reveal/types"

import type { RevealTeam } from "@/lib/reveal/types"



export interface RevealCardHandle {

  getRefs: () => RevealCardRef

}



interface RevealCardProps {

  team: RevealTeam

  rank: number

  style?: React.CSSProperties

}



export const RevealCard = forwardRef<RevealCardHandle, RevealCardProps>(function RevealCard(

  { team, rank, style },

  ref,

) {

  const rootRef = useRef<HTMLDivElement>(null)

  const totalRef = useRef<HTMLSpanElement>(null)

  const glowRef = useRef<HTMLDivElement>(null)



  useImperativeHandle(ref, () => ({

    getRefs: () => ({

      root: rootRef.current!,

      totalScore: totalRef.current!,

      glow: glowRef.current!,

    }),

  }))



  return (

    <div ref={rootRef} className="reveal-card" style={style} aria-label={`${team.name}, rank ${rank}`}>

      <div

        ref={glowRef}

        className="reveal-card-glow"

        style={{ backgroundColor: team.color }}

      />

      <div className="reveal-card-inner">

        <span className="reveal-card-rank">#{rank}</span>

        <div className="reveal-card-accent" style={{ backgroundColor: team.color }} />

        <span className="reveal-card-name">{team.name}</span>

        <span ref={totalRef} className="reveal-card-total">

          0

        </span>

      </div>

    </div>

  )

})


