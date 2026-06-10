export const projectColors = [
  { bg: "bg-violet-500/10", text: "text-violet-500", border: "border-violet-500/20" },
  { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
  { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
  { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
  { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/20" },
]

export const statusColors: Record<string, string> = {
  "In Progress": "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20",
  "Planning": "text-amber-500 bg-amber-500/10 border border-amber-500/20",
  "Review": "text-blue-500 bg-blue-500/10 border border-blue-500/20",
  "Completed": "text-emerald-600 bg-emerald-500/10 border border-emerald-500/20",
  "On Hold": "text-muted-foreground bg-muted/40 border border-muted/50",
}

export const priorityColors: Record<string, string> = {
  "High": "bg-red-500 shadow-sm shadow-red-500/20",
  "Medium": "bg-amber-500 shadow-sm shadow-amber-500/20",
  "Low": "bg-emerald-500 shadow-sm shadow-emerald-500/20",
}

export const taskStatusColors: Record<string, string> = {
  "To Do": "text-amber-500 bg-amber-500/10 border border-amber-500/20",
  "In Progress": "text-blue-500 bg-blue-500/10 border border-blue-500/20",
  "Done": "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20",
  "Completed": "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20",
}

export function computeProgressRingOffset(percent: number): { circumference: number; offset: number } {
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(Math.max(percent, 0), 100)
  const offset = circumference - (clamped / 100) * circumference
  return { circumference, offset }
}

export function formatRelativeTime(dateStr: string, now: Date = new Date()): string {
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function computeCompletionPercent(completedTaskCount: number, totalTasks: number): number {
  return totalTasks > 0 ? Math.round((completedTaskCount / totalTasks) * 100) : 0
}

export function computePendingTaskProgress(totalTasks: number, pendingTaskCount: number): number {
  return totalTasks > 0
    ? Math.round(((totalTasks - pendingTaskCount) / totalTasks) * 100)
    : 0
}

export function computeChatProgress(chatCount: number): number {
  return chatCount > 0 ? Math.min(chatCount * 10, 100) : 0
}

export function computeProjectStatusData(projects: { status: string | null }[]) {
  return [
    { name: "Planning", count: projects.filter(p => p.status === "Planning").length },
    { name: "In Progress", count: projects.filter(p => p.status === "In Progress").length },
    { name: "Review", count: projects.filter(p => p.status === "Review").length },
    { name: "Completed", count: projects.filter(p => p.status === "Completed").length },
    { name: "On Hold", count: projects.filter(p => p.status === "On Hold").length },
  ]
}

export function getTaskCompletionTimeline(tasks: { completed: boolean | null; status: string | null; created_at: string }[], referenceDate: Date = new Date()) {
  const timeline: Record<string, number> = {}
  for (let i = 4; i >= 0; i--) {
    const d = new Date(referenceDate)
    d.setDate(d.getDate() - i)
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    timeline[label] = 0
  }

  tasks.forEach(t => {
    if (t.completed || t.status === "Done") {
      const dateLabel = new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
      if (timeline[dateLabel] !== undefined) {
        timeline[dateLabel] += 1
      } else {
        const todayLabel = referenceDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        timeline[todayLabel] = (timeline[todayLabel] || 0) + 1
      }
    }
  })

  return Object.entries(timeline).map(([date, completed]) => ({ date, completed }))
}

export function computeProjectInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()
}
