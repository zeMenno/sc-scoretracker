"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Trash2 } from "lucide-react"
import { clearDatabaseAction } from "@/lib/actions"
import { toast } from "sonner"
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

export function ClearDatabaseButton() {
  const handleClearDatabase = async () => {
    try {
      await clearDatabaseAction()
      toast.success("Database cleared successfully")
    } catch (error) {
      toast.error("Failed to clear database")
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onSelect={(e) => e.preventDefault()}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Database Wissen
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Database Wissen</AlertDialogTitle>
          <AlertDialogDescription>
            Weet je zeker dat je alle data wilt wissen? Deze actie kan niet ongedaan worden gemaakt.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuleren</AlertDialogCancel>
          <AlertDialogAction onClick={handleClearDatabase} className="bg-red-600 hover:bg-red-700">
            Wissen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 