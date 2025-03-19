"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Trash2 } from "lucide-react"
import { clearDatabaseAction } from "@/lib/actions"
import { toast } from "sonner"

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
    <DropdownMenuItem
      className="text-red-600 focus:text-red-600"
      onClick={handleClearDatabase}
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Database Wissen
    </DropdownMenuItem>
  )
} 