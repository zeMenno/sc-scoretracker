"use client"

import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trophy, PlusCircle, Trash2, MoreVertical } from "lucide-react"
import { deleteTeamAction } from "@/lib/actions"
import { animated } from '@react-spring/web'
import { useCountUp } from '@/hooks/useCountUp'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface TeamCardProps {
  id: string
  name: string
  score: number
  rank: number
  color: string
  isAuthenticated: boolean
}

function AnimatedScore({ value }: { value: number }) {
  const count = useCountUp(value)
  
  return (
    <div className="text-2xl font-bold mix-blend-difference text-white">
      {count}
    </div>
  )
}

export function TeamCard({ id, name, score, rank, color, isAuthenticated }: TeamCardProps) {
  const handleDelete = async () => {
    const formData = new FormData()
    formData.append("id", id)

    try {
      await deleteTeamAction(formData)
    } catch (error) {
      console.error("Failed to delete tribe:", error)
    }
  }

  const getTrophyColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500"
      case 2:
        return "text-gray-400"
      case 3:
        return "text-amber-700"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center justify-center w-8 h-8 rounded-full text-white relative"
              style={{ backgroundColor: color }}
            >
              <div className="absolute inset-0 rounded-full" />
              <span className="relative z-10">{rank}</span>
            </div>
            <CardTitle className="text-lg font-bold">{name}</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            {rank <= 3 && (
              <div className="flex items-center gap-2">
                <Trophy className={`h-5 w-5 ${getTrophyColor(rank)}`} />
              </div>
            )}
            <div className="flex items-center gap-2">
              <AnimatedScore value={score} />
              <span className="text-sm text-muted-foreground">Punten</span>
            </div>
            {isAuthenticated && (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/teams/${id}`} className="flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" />
                        Spel Toevoegen
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Verwijderen
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}

