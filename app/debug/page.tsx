import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DebugPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Debug Pagina</h1>
      <p className="mb-4">Deze pagina is om te testen of de routing werkt.</p>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Test Links</h2>
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/teams/new">Nieuw Team</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/events/new">Multi-team Event</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

