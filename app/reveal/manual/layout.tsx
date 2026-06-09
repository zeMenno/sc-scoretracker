import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Manual Reveal",
  description: "Presenter-controlled standings reveal",
}

export default function ManualRevealLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflow: "hidden", background: "#000", minHeight: "100vh" }}>
      {children}
    </div>
  )
}
