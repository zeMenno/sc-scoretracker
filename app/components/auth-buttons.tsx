"use client"

import { signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { FC } from "react"

export const LoginButton: FC = () => {
  return (
    <Button onClick={() => signIn("google")}>
      Inloggen
    </Button>
  )
}

export const LogoutButton: FC = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          Uitloggen
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Weet je het zeker?</AlertDialogTitle>
          <AlertDialogDescription>
            Je wordt uitgelogd en kunt geen teams of events meer beheren.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Annuleren
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => {
              e.stopPropagation()
              signOut()
            }} 
            className="w-full"
          >
            Uitloggen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 