"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-3xl font-bold">Er is iets misgegaan</h1>
      <p className="text-muted-foreground mb-6">Er is een fout opgetreden bij het laden van deze pagina.</p>
      <div className="flex gap-4">
        <Button onClick={reset}>Probeer opnieuw</Button>
        <Button variant="outline" asChild>
          <Link href="/">Terug naar home</Link>
        </Button>
      </div>
    </div>
  )
}

