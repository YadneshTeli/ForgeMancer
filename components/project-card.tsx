import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string | null
    type: string
    status: string
    due_date: string | null
    created_at: string
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    planning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    "on-hold": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  }

  const typeColors = {
    personal: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    work: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    education: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300",
    other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  }

  const statusColor = statusColors[project.status as keyof typeof statusColors] || statusColors["planning"]
  const typeColor = typeColors[project.type as keyof typeof typeColors] || typeColors["other"]

  return (
    <Link href={`/dashboard/projects/${project.id}`} className="block">
      <Card className="h-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="line-clamp-1 text-lg">{project.name}</CardTitle>
            <Badge variant="outline" className={statusColor}>
              {project.status.replace("-", " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.description || "No description provided"}
          </p>
        </CardContent>
        <CardFooter className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className={typeColor}>
            {project.type}
          </Badge>
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            <span>Created {formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</span>
          </div>
          {project.due_date && (
            <div className="flex items-center">
              <CalendarIcon className="mr-1 h-3 w-3" />
              <span>Due {formatDistanceToNow(new Date(project.due_date), { addSuffix: true })}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
