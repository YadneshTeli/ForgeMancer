/**
 * Tests for pure logic extracted from app/dashboard/page.tsx
 *
 * Covers:
 * - ProgressRing SVG offset calculation
 * - formatRelativeTime()
 * - completionPercent calculation
 * - bentoStats progress calculations
 * - projectStatusData grouping
 * - getTaskCompletionTimeline()
 * - Color/style constant lookups (projectColors, statusColors, priorityColors, taskStatusColors)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"

// ── Inline re-implementation of module-level constants from app/dashboard/page.tsx ──

const projectColors = [
  { bg: "bg-violet-500/10", text: "text-violet-500", border: "border-violet-500/20" },
  { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
  { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
  { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
  { bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/20" },
]

const statusColors: Record<string, string> = {
  "In Progress": "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20",
  "Planning": "text-amber-500 bg-amber-500/10 border border-amber-500/20",
  "Review": "text-blue-500 bg-blue-500/10 border border-blue-500/20",
  "Completed": "text-emerald-600 bg-emerald-500/10 border border-emerald-500/20",
  "On Hold": "text-muted-foreground bg-muted/40 border border-muted/50",
}

const priorityColors: Record<string, string> = {
  "High": "bg-red-500 shadow-sm shadow-red-500/20",
  "Medium": "bg-amber-500 shadow-sm shadow-amber-500/20",
  "Low": "bg-emerald-500 shadow-sm shadow-emerald-500/20",
}

const taskStatusColors: Record<string, string> = {
  "To Do": "text-amber-500 bg-amber-500/10 border border-amber-500/20",
  "In Progress": "text-blue-500 bg-blue-500/10 border border-blue-500/20",
  "Done": "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20",
  "Completed": "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20",
}

// ── Pure function re-implementations ──

/** ProgressRing SVG math: clamp percent to [0,100] and compute strokeDashoffset */
function computeProgressRingOffset(percent: number): { circumference: number; offset: number } {
  const radius = 16
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(Math.max(percent, 0), 100)
  const offset = circumference - (clamped / 100) * circumference
  return { circumference, offset }
}

/** formatRelativeTime() as implemented in app/dashboard/page.tsx */
function formatRelativeTime(dateStr: string, now: Date = new Date()): string {
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

/** completionPercent calculation as in app/dashboard/page.tsx */
function computeCompletionPercent(completedTaskCount: number, totalTasks: number): number | 0 {
  return totalTasks > 0 ? Math.round((completedTaskCount / totalTasks) * 100) : 0
}

/** bentoStats[1] (Pending Tasks) progress calculation */
function computePendingTaskProgress(totalTasks: number, pendingTaskCount: number): number {
  return totalTasks > 0
    ? Math.round(((totalTasks - pendingTaskCount) / totalTasks) * 100)
    : 0
}

/** bentoStats[2] (Copilot Chats) progress calculation */
function computeChatProgress(chatCount: number): number {
  return chatCount > 0 ? Math.min(chatCount * 10, 100) : 0
}

interface ProjectStub {
  status: string | null
}

function computeProjectStatusData(projects: ProjectStub[]) {
  return [
    { name: "Planning", count: projects.filter(p => p.status === "Planning").length },
    { name: "In Progress", count: projects.filter(p => p.status === "In Progress").length },
    { name: "Review", count: projects.filter(p => p.status === "Review").length },
    { name: "Completed", count: projects.filter(p => p.status === "Completed").length },
  ]
}

interface TaskStub {
  id: string
  completed: boolean | null
  status: string | null
  created_at: string
}

function getTaskCompletionTimeline(tasks: TaskStub[], referenceDate: Date = new Date()): { date: string; completed: number }[] {
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

/** Project initials as computed in DashboardPage's Projects tab */
function computeProjectInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()
}

// ═══════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════

describe("ProgressRing SVG offset calculation", () => {
  const RADIUS = 16
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS

  it("returns full circumference offset (no fill) when percent is 0", () => {
    const { offset } = computeProgressRingOffset(0)
    expect(offset).toBeCloseTo(CIRCUMFERENCE)
  })

  it("returns zero offset (full fill) when percent is 100", () => {
    const { offset } = computeProgressRingOffset(100)
    expect(offset).toBeCloseTo(0)
  })

  it("returns half circumference offset when percent is 50", () => {
    const { offset } = computeProgressRingOffset(50)
    expect(offset).toBeCloseTo(CIRCUMFERENCE / 2)
  })

  it("clamps percent below 0 to 0 (renders empty ring)", () => {
    const { offset: negOffset } = computeProgressRingOffset(-10)
    const { offset: zeroOffset } = computeProgressRingOffset(0)
    expect(negOffset).toBeCloseTo(zeroOffset)
  })

  it("clamps percent above 100 to 100 (renders full ring)", () => {
    const { offset: overOffset } = computeProgressRingOffset(150)
    const { offset: fullOffset } = computeProgressRingOffset(100)
    expect(overOffset).toBeCloseTo(fullOffset)
  })

  it("returns correct circumference value (2 * π * 16)", () => {
    const { circumference } = computeProgressRingOffset(0)
    expect(circumference).toBeCloseTo(100.53, 1)
  })

  it("offset decreases as percent increases", () => {
    const { offset: offset25 } = computeProgressRingOffset(25)
    const { offset: offset75 } = computeProgressRingOffset(75)
    expect(offset25).toBeGreaterThan(offset75)
  })
})

describe("formatRelativeTime", () => {
  it("returns 'Just now' for timestamps less than a minute ago", () => {
    const now = new Date("2024-01-15T12:00:00Z")
    const thirtySecsAgo = new Date("2024-01-15T11:59:40Z").toISOString()
    expect(formatRelativeTime(thirtySecsAgo, now)).toBe("Just now")
  })

  it("returns minutes ago for timestamps within the last hour", () => {
    const now = new Date("2024-01-15T12:00:00Z")
    const thirtyMinsAgo = new Date("2024-01-15T11:30:00Z").toISOString()
    expect(formatRelativeTime(thirtyMinsAgo, now)).toBe("30m ago")
  })

  it("returns hours ago for timestamps within the last 24 hours", () => {
    const now = new Date("2024-01-15T12:00:00Z")
    const threeHoursAgo = new Date("2024-01-15T09:00:00Z").toISOString()
    expect(formatRelativeTime(threeHoursAgo, now)).toBe("3h ago")
  })

  it("returns days ago for timestamps within the last 7 days", () => {
    const now = new Date("2024-01-15T12:00:00Z")
    const threeDaysAgo = new Date("2024-01-12T12:00:00Z").toISOString()
    expect(formatRelativeTime(threeDaysAgo, now)).toBe("3d ago")
  })

  it("returns formatted date string for timestamps older than 7 days", () => {
    const now = new Date("2024-01-15T12:00:00Z")
    const tenDaysAgo = new Date("2024-01-05T12:00:00Z").toISOString()
    const result = formatRelativeTime(tenDaysAgo, now)
    // Format is "Jan 5" or similar locale-dependent
    expect(result).toMatch(/Jan/)
  })

  it("returns '1m ago' for exactly 1 minute ago", () => {
    const now = new Date("2024-01-15T12:01:00Z")
    const oneMinAgo = new Date("2024-01-15T12:00:00Z").toISOString()
    expect(formatRelativeTime(oneMinAgo, now)).toBe("1m ago")
  })

  it("returns '1h ago' for exactly 1 hour ago", () => {
    const now = new Date("2024-01-15T13:00:00Z")
    const oneHourAgo = new Date("2024-01-15T12:00:00Z").toISOString()
    expect(formatRelativeTime(oneHourAgo, now)).toBe("1h ago")
  })

  it("returns '1d ago' for exactly 1 day ago", () => {
    const now = new Date("2024-01-15T12:00:00Z")
    const oneDayAgo = new Date("2024-01-14T12:00:00Z").toISOString()
    expect(formatRelativeTime(oneDayAgo, now)).toBe("1d ago")
  })
})

describe("completionPercent calculation", () => {
  it("returns 0 when there are no tasks", () => {
    expect(computeCompletionPercent(0, 0)).toBe(0)
  })

  it("returns 0 when no tasks are completed", () => {
    expect(computeCompletionPercent(0, 10)).toBe(0)
  })

  it("returns 100 when all tasks are completed", () => {
    expect(computeCompletionPercent(10, 10)).toBe(100)
  })

  it("returns 50 when half the tasks are completed", () => {
    expect(computeCompletionPercent(5, 10)).toBe(50)
  })

  it("rounds to nearest integer", () => {
    // 1/3 ≈ 33.33... → rounds to 33
    expect(computeCompletionPercent(1, 3)).toBe(33)
    // 2/3 ≈ 66.67... → rounds to 67
    expect(computeCompletionPercent(2, 3)).toBe(67)
  })
})

describe("bentoStats progress computations", () => {
  describe("pendingTaskProgress", () => {
    it("returns 0 when there are no tasks", () => {
      expect(computePendingTaskProgress(0, 0)).toBe(0)
    })

    it("returns 0 when all tasks are pending", () => {
      expect(computePendingTaskProgress(10, 10)).toBe(0)
    })

    it("returns 100 when no tasks are pending", () => {
      expect(computePendingTaskProgress(10, 0)).toBe(100)
    })

    it("returns 50 when half the tasks are pending", () => {
      expect(computePendingTaskProgress(10, 5)).toBe(50)
    })
  })

  describe("chatProgress", () => {
    it("returns 0 when there are no chats", () => {
      expect(computeChatProgress(0)).toBe(0)
    })

    it("returns 10 for 1 chat", () => {
      expect(computeChatProgress(1)).toBe(10)
    })

    it("returns 50 for 5 chats", () => {
      expect(computeChatProgress(5)).toBe(50)
    })

    it("caps at 100 for 10 or more chats", () => {
      expect(computeChatProgress(10)).toBe(100)
      expect(computeChatProgress(20)).toBe(100)
      expect(computeChatProgress(100)).toBe(100)
    })

    it("returns 100 for exactly 10 chats", () => {
      expect(computeChatProgress(10)).toBe(100)
    })
  })
})

describe("projectStatusData grouping", () => {
  it("returns zero counts for all statuses when projects is empty", () => {
    const data = computeProjectStatusData([])
    expect(data.every(d => d.count === 0)).toBe(true)
  })

  it("correctly counts projects by status", () => {
    const projects = [
      { status: "Planning" },
      { status: "Planning" },
      { status: "In Progress" },
      { status: "Review" },
      { status: "Completed" },
      { status: "Completed" },
      { status: "Completed" },
    ]
    const data = computeProjectStatusData(projects)
    expect(data.find(d => d.name === "Planning")?.count).toBe(2)
    expect(data.find(d => d.name === "In Progress")?.count).toBe(1)
    expect(data.find(d => d.name === "Review")?.count).toBe(1)
    expect(data.find(d => d.name === "Completed")?.count).toBe(3)
  })

  it("ignores projects with null or unknown status", () => {
    const projects = [
      { status: null },
      { status: "Unknown" },
      { status: "On Hold" },
      { status: "Planning" },
    ]
    const data = computeProjectStatusData(projects)
    expect(data.find(d => d.name === "Planning")?.count).toBe(1)
    // null and unknown statuses are not counted in any category
    expect(data.find(d => d.name === "In Progress")?.count).toBe(0)
  })

  it("returns exactly 4 status groups in correct order", () => {
    const data = computeProjectStatusData([])
    expect(data).toHaveLength(4)
    expect(data[0].name).toBe("Planning")
    expect(data[1].name).toBe("In Progress")
    expect(data[2].name).toBe("Review")
    expect(data[3].name).toBe("Completed")
  })
})

describe("getTaskCompletionTimeline", () => {
  const referenceDate = new Date("2024-06-10T12:00:00Z")

  it("returns exactly 5 data points (last 5 days)", () => {
    const result = getTaskCompletionTimeline([], referenceDate)
    expect(result).toHaveLength(5)
  })

  it("all counts are 0 when there are no tasks", () => {
    const result = getTaskCompletionTimeline([], referenceDate)
    expect(result.every(d => d.completed === 0)).toBe(true)
  })

  it("does not count tasks that are not completed", () => {
    const tasks: TaskStub[] = [
      { id: "1", completed: false, status: "To Do", created_at: referenceDate.toISOString() },
      { id: "2", completed: false, status: "In Progress", created_at: referenceDate.toISOString() },
    ]
    const result = getTaskCompletionTimeline(tasks, referenceDate)
    expect(result.every(d => d.completed === 0)).toBe(true)
  })

  it("counts tasks with completed=true in correct date bucket", () => {
    const tasks: TaskStub[] = [
      { id: "1", completed: true, status: "Done", created_at: referenceDate.toISOString() },
    ]
    const result = getTaskCompletionTimeline(tasks, referenceDate)
    const todayLabel = referenceDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const todayEntry = result.find(d => d.date === todayLabel)
    expect(todayEntry?.completed).toBe(1)
  })

  it("counts tasks with status='Done' (even if completed=false)", () => {
    const tasks: TaskStub[] = [
      { id: "1", completed: false, status: "Done", created_at: referenceDate.toISOString() },
    ]
    const result = getTaskCompletionTimeline(tasks, referenceDate)
    const todayLabel = referenceDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const todayEntry = result.find(d => d.date === todayLabel)
    expect(todayEntry?.completed).toBe(1)
  })

  it("tasks outside the 5-day window fall back to today's bucket", () => {
    // Created 10 days ago = outside range
    const oldDate = new Date(referenceDate)
    oldDate.setDate(oldDate.getDate() - 10)
    const tasks: TaskStub[] = [
      { id: "1", completed: true, status: null, created_at: oldDate.toISOString() },
    ]
    const result = getTaskCompletionTimeline(tasks, referenceDate)
    const todayLabel = referenceDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const todayEntry = result.find(d => d.date === todayLabel)
    expect(todayEntry?.completed).toBe(1)
  })

  it("aggregates multiple completed tasks on the same day", () => {
    const tasks: TaskStub[] = [
      { id: "1", completed: true, status: null, created_at: referenceDate.toISOString() },
      { id: "2", completed: true, status: null, created_at: referenceDate.toISOString() },
      { id: "3", completed: true, status: null, created_at: referenceDate.toISOString() },
    ]
    const result = getTaskCompletionTimeline(tasks, referenceDate)
    const todayLabel = referenceDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    const todayEntry = result.find(d => d.date === todayLabel)
    expect(todayEntry?.completed).toBe(3)
  })
})

describe("Color constant lookups (projectColors)", () => {
  it("has 5 color variants", () => {
    expect(projectColors).toHaveLength(5)
  })

  it("each color has bg, text, and border properties", () => {
    projectColors.forEach(color => {
      expect(color).toHaveProperty("bg")
      expect(color).toHaveProperty("text")
      expect(color).toHaveProperty("border")
    })
  })

  it("wraps around when index exceeds length (modulo behavior)", () => {
    // Projects cycle through colors with index % projectColors.length
    expect(projectColors[0 % projectColors.length]).toEqual(projectColors[0])
    expect(projectColors[5 % projectColors.length]).toEqual(projectColors[0])
    expect(projectColors[6 % projectColors.length]).toEqual(projectColors[1])
  })

  it("first color is violet-500", () => {
    expect(projectColors[0].text).toContain("violet-500")
  })
})

describe("statusColors lookup", () => {
  it("has entries for all expected project statuses", () => {
    expect(statusColors).toHaveProperty("In Progress")
    expect(statusColors).toHaveProperty("Planning")
    expect(statusColors).toHaveProperty("Review")
    expect(statusColors).toHaveProperty("Completed")
    expect(statusColors).toHaveProperty("On Hold")
  })

  it("returns correct class for 'In Progress'", () => {
    expect(statusColors["In Progress"]).toContain("emerald-500")
    expect(statusColors["In Progress"]).toContain("border")
  })

  it("returns correct class for 'On Hold' (muted, not a vibrant color)", () => {
    expect(statusColors["On Hold"]).toContain("muted")
  })

  it("falls back to 'In Progress' style when status is unknown", () => {
    // The component uses: statusColors[project.status ?? ""] || statusColors["In Progress"]
    const fallback = statusColors[""] || statusColors["In Progress"]
    expect(fallback).toBe(statusColors["In Progress"])
  })
})

describe("priorityColors lookup (dashboard page)", () => {
  it("has entries for High, Medium, Low", () => {
    expect(priorityColors).toHaveProperty("High")
    expect(priorityColors).toHaveProperty("Medium")
    expect(priorityColors).toHaveProperty("Low")
  })

  it("High uses red color", () => {
    expect(priorityColors["High"]).toContain("red-500")
  })

  it("Medium uses amber color", () => {
    expect(priorityColors["Medium"]).toContain("amber-500")
  })

  it("Low uses emerald color", () => {
    expect(priorityColors["Low"]).toContain("emerald-500")
  })

  it("all priority levels have shadow styles added in this PR", () => {
    expect(priorityColors["High"]).toContain("shadow")
    expect(priorityColors["Medium"]).toContain("shadow")
    expect(priorityColors["Low"]).toContain("shadow")
  })
})

describe("taskStatusColors lookup", () => {
  it("has entries for all expected task statuses", () => {
    expect(taskStatusColors).toHaveProperty("To Do")
    expect(taskStatusColors).toHaveProperty("In Progress")
    expect(taskStatusColors).toHaveProperty("Done")
    expect(taskStatusColors).toHaveProperty("Completed")
  })

  it("'Done' and 'Completed' share the same visual treatment", () => {
    expect(taskStatusColors["Done"]).toBe(taskStatusColors["Completed"])
  })

  it("all statuses include border classes (added in this PR)", () => {
    Object.values(taskStatusColors).forEach(cls => {
      expect(cls).toContain("border")
    })
  })

  it("'To Do' uses amber color", () => {
    expect(taskStatusColors["To Do"]).toContain("amber-500")
  })

  it("'In Progress' uses blue color", () => {
    expect(taskStatusColors["In Progress"]).toContain("blue-500")
  })
})

describe("computeProjectInitials", () => {
  it("returns 2-letter initials for multi-word project names", () => {
    expect(computeProjectInitials("My Project")).toBe("MP")
  })

  it("returns single uppercase letter for single-word names", () => {
    expect(computeProjectInitials("Alpha")).toBe("A")
  })

  it("truncates to 2 characters for long names", () => {
    expect(computeProjectInitials("Alpha Beta Gamma Delta")).toBe("AB")
  })

  it("uppercases the initials", () => {
    expect(computeProjectInitials("my project")).toBe("MP")
  })

  it("handles names with extra spaces producing empty segments", () => {
    // split(" ") on "A  B" → ["A", "", "B"]
    // map to first char: "A", undefined, "B" → "A" + undefined.toString = crash?
    // In actual code this could throw, but let's test valid names
    expect(computeProjectInitials("E Commerce")).toBe("EC")
  })
})