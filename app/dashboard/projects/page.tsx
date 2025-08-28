import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTransition } from "@/components/page-transition"
import { getProjects } from "@/app/actions/project-actions"
import { Plus } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function ProjectsPage() {
  const { projects } = await getProjects()

  return (
    <PageTransition>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage your projects and track their progress</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <div className="mt-8">
        {projects && projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <Card className="h-full overflow-hidden transition-all hover:border-primary hover:shadow-md">
                  <CardHeader className="pb-3">
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription>
                      {project.project_type?.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Created: {formatDate(project.created_at)}</span>
                      <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {project.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No projects yet</CardTitle>
              <CardDescription>Create your first project to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/dashboard/projects/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </PageTransition>
  )
}
