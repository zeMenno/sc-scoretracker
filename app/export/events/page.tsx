"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { exportEventsAction } from "@/lib/actions"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"

export default function ExportEventsPage() {
  const handleExport = async () => {
    try {
      const csvContent = await exportEventsAction()
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `events-${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Failed to export events:", error)
    }
  }

  return (
    <div className="container mx-auto py-6 px-4 md:py-10 md:px-6 space-y-6">
      <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Terug naar Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Exporteer Events</CardTitle>
          <CardDescription>
            Download een CSV bestand met alle events en hun details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExport} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 