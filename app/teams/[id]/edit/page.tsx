import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getTeamById } from "@/lib/redis"
import { updateTeamScoreAction } from "@/lib/actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

interface EditTeamPageProps {
  params: {
    id: string
  }
}

export default async function EditTeamPage({ params }: EditTeamPageProps) {
  const team = await getTeamById(params.id)

  if (!team) {
    notFound()
  }

  return (
    <div className="container mx-auto py-10 max-w-md">
      <Link href="/" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Update Team Score</CardTitle>
          <CardDescription>Update the score for {team.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateTeamScoreAction} className="space-y-4">
            <input type="hidden" name="id" value={params.id} />
            <div className="space-y-2">
              <label
                htmlFor="score"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Score
              </label>
              <Input id="score" name="score" type="number" defaultValue={team.score} min="0" required />
            </div>
            <Button type="submit" className="w-full">
              Update Score
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

