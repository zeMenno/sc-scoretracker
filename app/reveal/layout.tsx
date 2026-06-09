import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Final Results",
  description: "Cinematic competition standings reveal",
}

export default function RevealLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflow: "hidden", background: "#000", minHeight: "100vh" }}>
      {children}
    </div>
  )
}
