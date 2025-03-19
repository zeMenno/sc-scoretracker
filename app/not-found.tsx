import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container flex h-[calc(100vh-8rem)] flex-col items-center justify-center">
      <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-3xl font-bold">Pagina niet gevonden</h1>
      <p className="text-muted-foreground mb-6">De pagina die je zoekt bestaat niet.</p>
      <Button asChild>
        <Link href="/">Terug naar home</Link>
      </Button>
    </div>
  )
}

