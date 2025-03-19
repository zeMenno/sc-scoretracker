"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  let errorMessage = "Er is een fout opgetreden bij het inloggen."
  
  if (error === "AccessDenied") {
    errorMessage = "Je hebt geen toegang tot deze applicatie. Neem contact op met de beheerder."
  }

  return (
    <div className="container mx-auto py-10 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Inloggen mislukt</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button asChild>
            <Link href="/">
              Terug naar Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/signin">
              Opnieuw proberen
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 