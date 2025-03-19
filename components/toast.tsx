"use client"

import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"

export function Toast() {
  const { currentToast, isVisible, dismiss } = useToast()

  if (!currentToast) return null

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-md transform transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <div
        className={`rounded-lg shadow-lg p-4 ${
          currentToast.variant === "destructive" ? "bg-destructive text-destructive-foreground" : "bg-background border"
        }`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{currentToast.title}</h3>
            <p className="text-sm mt-1">{currentToast.description}</p>
          </div>
          <button onClick={dismiss} className="ml-4 text-gray-400 hover:text-gray-500">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

