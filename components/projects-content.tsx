"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Filter, Grid, List, Plus, Search, Users } from "lucide-react"

type Project = {
  id: string
  name: string
  client: string
  status: "Planning" | "In Progress" | "Review" | "Completed"
  dueDate: string
  progress: number
  members: number
  color: string
}

const projects: Project[] = [
  {
    id: "website-redesign",
    name: "Website Redesign",
    client: "Acme Inc.",
    status: "In Progress",
    dueDate: "Apr 15, 2025",
    progress: 65,
    members: 3,
    color: "blue",
  },
  {
    id: "mobile-app",
    name: "Mobile App",
    client: "TechStart",
    status: "Planning",
    dueDate: "Jun 30, 2025",
    progress: 25,
    members: 2,
    color: "green",
  },
  {
    id: "branding",
    name: "Branding Project",
    client: "Global Media",
    status: "Review",
    dueDate: "Apr 5, 2025",
    progress: 90,
    members: 1,
    color: "purple",
  },
  {
    id: "marketing-campaign",
    name: "Marketing Campaign",
    client: "Retail Chain",
    status: "Planning",
    dueDate: "May 20, 2025",
    progress: 10,
    members: 4,
    color: "amber",
  },
  {
    id: "e-commerce",
    name: "E-commerce Platform",
    client: "Fashion Brand",
    status: "In Progress",
    dueDate: "Jul 10, 2025",
    progress: 40,
    members: 3,
    color: "pink",
  },
  {
    id: "content-strategy",
    name: "Content Strategy",
    client: "Media Company",
    status: "Completed",
    dueDate: "Mar 25, 2025",
    progress: 100,
    members: 2,
    color: "emerald",
  },
]

export function ProjectsContent() {
  const [view, setView] = useState<"grid" | "list" | "kanban">("kanban")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const kanbanColumns = [
    { title: "Planning", projects: filteredProjects.filter((p) => p.status === "Planning") },
    { title: "In Progress", projects: filteredProjects.filter((p) => p.status === "In Progress") },
    { title: "Review", projects: filteredProjects.filter((p) => p.status === "Review") },
    { title: "Completed", projects: filteredProjects.filter((p) => p.status === "Completed") },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage and track all your freelance projects</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Tabs defaultValue="kanban" onValueChange={(value) => setView(value as "grid" | "list" | "kanban")}>
            <TabsList>
              <TabsTrigger value="grid">
                <Grid className="h-4 w-4" />
                <span className="sr-only">Grid View</span>
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
                <span className="sr-only">List View</span>
              </TabsTrigger>
              <TabsTrigger value="kanban">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  className="h-4 w-4"
                >
                  <path
                    d="M14 4H1M14 11H1M6 4V11M9 4V11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="sr-only">Kanban View</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {view === "kanban" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {kanbanColumns.map((column) => (
            <div key={column.title} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{column.title}</h3>
                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">{column.projects.length}</span>
              </div>
              <div className="space-y-4">
                {column.projects.map((project) => (
                  <Card key={project.id} className="glass-card">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`h-6 w-6 rounded-md bg-${project.color}-500/20 flex items-center justify-center`}
                          >
                            <span className={`text-xs font-medium text-${project.color}-500`}>
                              {project.name.charAt(0)}
                            </span>
                          </div>
                          <CardTitle className="text-sm font-medium">{project.name}</CardTitle>
                        </div>
                      </div>
                      <CardDescription className="text-xs">{project.client}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{project.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{project.members}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "grid" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-8 w-8 rounded-md bg-${project.color}-500/20 flex items-center justify-center`}>
                      <span className={`text-sm font-medium text-${project.color}-500`}>{project.name.charAt(0)}</span>
                    </div>
                    <CardTitle>{project.name}</CardTitle>
                  </div>
                  <span
                    className={`text-xs font-medium text-${
                      project.status === "Planning"
                        ? "amber"
                        : project.status === "In Progress"
                          ? "green"
                          : project.status === "Review"
                            ? "blue"
                            : "emerald"
                    }-500 bg-${
                      project.status === "Planning"
                        ? "amber"
                        : project.status === "In Progress"
                          ? "green"
                          : project.status === "Review"
                            ? "blue"
                            : "emerald"
                    }-500/10 px-2 py-1 rounded-full`}
                  >
                    {project.status}
                  </span>
                </div>
                <CardDescription>{project.client}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full bg-${project.color}-500`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Due: {project.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{project.members} members</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/dashboard/projects/${project.id}`}>View Project</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {view === "list" && (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="glass-card">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-md bg-${project.color}-500/20 flex items-center justify-center`}>
                      <span className={`text-sm font-medium text-${project.color}-500`}>{project.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{project.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{project.members} members</span>
                    </div>
                    <span
                      className={`text-xs font-medium text-${
                        project.status === "Planning"
                          ? "amber"
                          : project.status === "In Progress"
                            ? "green"
                            : project.status === "Review"
                              ? "blue"
                              : "emerald"
                      }-500 bg-${
                        project.status === "Planning"
                          ? "amber"
                          : project.status === "In Progress"
                            ? "green"
                            : project.status === "Review"
                              ? "blue"
                              : "emerald"
                      }-500/10 px-2 py-1 rounded-full`}
                    >
                      {project.status}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/projects/${project.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
