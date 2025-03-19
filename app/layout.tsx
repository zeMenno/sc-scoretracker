import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toast } from "@/components/toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Team Score Tracker",
  description: "Track scores for multiple teams",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toast />
      </body>
    </html>
  )
}



import './globals.css'