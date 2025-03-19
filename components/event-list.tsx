import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Event } from "@/lib/redis"
import { deleteEventAction } from "@/lib/actions"
import { Trash2, Plus, Minus } from "lucide-react"
import { format } from "date-fns"
import { nl } from "date-fns/locale"

interface EventListProps {
  spellen: Event[]
}

export function EventList({ spellen }: EventListProps) {
  if (spellen.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Nog geen spellen
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {spellen.map((event) => (
        <Card key={event.id}>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{event.description}</CardTitle>
              <div className="flex items-center">
                {Number(event.points) > 0 ? (
                  <Plus className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <Minus className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={Number(event.points) > 0 ? "text-green-500" : "text-red-500"}>
                  {event.points} punten
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{format(new Date(event.createdAt), "dd/MM/yyyy HH:mm", { locale: nl })}</span>
              <p className="text-xs text-muted-foreground">
                Toegevoegd door: {event.creatorName}
              </p>
              <form action={deleteEventAction}>
                <input type="hidden" name="id" value={event.id} />
                <Button variant="ghost" size="sm" type="submit" className="h-8 px-2 text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

