"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Er is iets misgegaan!</h2>
          <p className="text-muted-foreground mb-6">{error.message || "Er is een onverwachte fout opgetreden."}</p>
          <Button onClick={() => reset()}>Probeer opnieuw</Button>
        </div>
      </body>
    </html>
  )
}

