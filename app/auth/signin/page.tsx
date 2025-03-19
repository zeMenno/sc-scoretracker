"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignIn() {
  return (
    <div className="container mx-auto py-10 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Inloggen</CardTitle>
          <CardDescription>
            Log in met je Google account om teams en events te beheren
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => signIn("google")} className="w-full">
            Inloggen met Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 