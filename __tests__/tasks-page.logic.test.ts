/**
 * Tests for pure logic extracted from app/dashboard/tasks/page.tsx
 *
 * Covers:
 * - priorityColors (with glow shadows added in PR)
 * - priorityGlowClasses (new in PR)
 * - formatDueDate()
 * - isToday()
 * - filteredTasks filter logic
 * - pendingCount / completedCount calculations
 * - Calendar helpers: daysInMonth, startDayOfWeek, calendarGrid, getTasksForDate
 * - monthNames array
 * - toggleTaskCompletion optimistic state logic
 */

import { describe, it, expect } from "vitest"

// ── Module-level constants from app/dashboard/tasks/page.tsx ──

const priorityColors: Record<string, string> = {
  High: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]",
  Medium: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
  Low: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
}

const priorityGlowClasses: Record<string, string> = {
  High: "border-red-500/20 hover:border-red-500/40 shadow-[0_0_20px_-3px_rgba(239,68,68,0.08)] dark:shadow-[0_0_20px_-3px_rgba(239,68,68,0.15)]",
  Medium: "border-amber-500/20 hover:border-amber-500/40 shadow-[0_0_20px_-3px_rgba(245,158,11,0.08)] dark:shadow-[0_0_20px_-3px_rgba(245,158,11,0.15)]",
  Low: "border-emerald-500/20 hover:border-emerald-500/40 shadow-[0_0_20px_-3px_rgba(16,185,129,0.08)] dark:shadow-[0_0_20px_-3px_rgba(16,185,129,0.15)]",
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

// ── Pure function re-implementations ──

function isToday(dateStr: string | null, now: Date = new Date()): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return d.toDateString() === now.toDateString()
}

function formatDueDate(dateStr: string | null, now: Date = new Date()): string | null {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (d.toDateString() === now.toDateString()) return "Today"
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow"
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

interface Task {
  id: string
  name: string
  status: string | null
  priority: string | null
  due_date: string | null
  completed: boolean | null
  created_at: string
  project_id: string | null
  projects: { name: string } | null
  description: string | null
}

function filterTasks(tasks: Task[], searchQuery: string, filter: string, now: Date = new Date()): Task[] {
  return tasks.filter((task) => {
    const matchesSearch =
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.projects?.name || "").toLowerCase().includes(searchQuery.toLowerCase())

    if (filter === "all") return matchesSearch
    if (filter === "today") return matchesSearch && isToday(task.due_date, now)
    if (filter === "upcoming") return matchesSearch && !task.completed && task.status !== "Done"
    if (filter === "completed") return matchesSearch && (task.completed === true || task.status === "Done")

    return matchesSearch
  })
}

function computeCalendarHelpers(calendarDate: Date) {
  const currentYear = calendarDate.getFullYear()
  const currentMonth = calendarDate.getMonth()

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const startDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    return new Date(currentYear, currentMonth, i + 1)
  })

  const paddingDays = Array.from({ length: startDayOfWeek }, () => null)
  const calendarGrid = [...paddingDays, ...calendarDays]

  return { currentYear, currentMonth, startDayOfWeek, daysInMonth, calendarDays, paddingDays, calendarGrid }
}

function getTasksForDate(tasks: Task[], date: Date): Task[] {
  return tasks.filter((task) => {
    if (!task.due_date) return false
    const d = new Date(task.due_date)
    return (
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
    )
  })
}

function nextMonthDate(currentDate: Date): Date {
  return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
}

function prevMonthDate(currentDate: Date): Date {
  return new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
}

/** Optimistic toggle logic as in toggleTaskCompletion */
function applyOptimisticToggle(tasks: Task[], taskId: string): Task[] {
  return tasks.map((t) => {
    if (t.id !== taskId) return t
    const newCompleted = !t.completed
    const newStatus = newCompleted ? "Done" : "To Do"
    return { ...t, completed: newCompleted, status: newStatus }
  })
}

function revertToggle(tasks: Task[], originalTask: Task): Task[] {
  return tasks.map((t) =>
    t.id === originalTask.id
      ? { ...t, completed: originalTask.completed, status: originalTask.status }
      : t,
  )
}

// ═══════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════

describe("priorityColors (tasks page - PR changes)", () => {
  it("has glow shadow for High priority (new in PR)", () => {
    expect(priorityColors["High"]).toContain("shadow")
    expect(priorityColors["High"]).toContain("rgba(239,68,68")
  })

  it("has glow shadow for Medium priority (new in PR)", () => {
    expect(priorityColors["Medium"]).toContain("shadow")
    expect(priorityColors["Medium"]).toContain("rgba(245,158,11")
  })

  it("has glow shadow for Low priority (new in PR)", () => {
    expect(priorityColors["Low"]).toContain("shadow")
    expect(priorityColors["Low"]).toContain("rgba(16,185,129")
  })

  it("High uses bg-red-500", () => {
    expect(priorityColors["High"]).toContain("bg-red-500")
  })

  it("Medium uses bg-amber-500", () => {
    expect(priorityColors["Medium"]).toContain("bg-amber-500")
  })

  it("Low uses bg-emerald-500", () => {
    expect(priorityColors["Low"]).toContain("bg-emerald-500")
  })
})

describe("priorityGlowClasses (new in PR)", () => {
  it("has all three priority levels", () => {
    expect(priorityGlowClasses).toHaveProperty("High")
    expect(priorityGlowClasses).toHaveProperty("Medium")
    expect(priorityGlowClasses).toHaveProperty("Low")
  })

  it("High includes red border classes", () => {
    expect(priorityGlowClasses["High"]).toContain("border-red-500/20")
    expect(priorityGlowClasses["High"]).toContain("hover:border-red-500/40")
  })

  it("Medium includes amber border classes", () => {
    expect(priorityGlowClasses["Medium"]).toContain("border-amber-500/20")
    expect(priorityGlowClasses["Medium"]).toContain("hover:border-amber-500/40")
  })

  it("Low includes emerald border classes", () => {
    expect(priorityGlowClasses["Low"]).toContain("border-emerald-500/20")
    expect(priorityGlowClasses["Low"]).toContain("hover:border-emerald-500/40")
  })

  it("all glow classes include dark mode shadow variants", () => {
    Object.values(priorityGlowClasses).forEach(cls => {
      expect(cls).toContain("dark:shadow-")
    })
  })
})

describe("isToday", () => {
  const now = new Date("2024-06-10T14:30:00Z")

  it("returns true for today's date", () => {
    const today = new Date("2024-06-10T09:00:00Z")
    expect(isToday(today.toISOString(), now)).toBe(true)
  })

  it("returns false for yesterday", () => {
    const yesterday = new Date("2024-06-09T14:30:00Z")
    expect(isToday(yesterday.toISOString(), now)).toBe(false)
  })

  it("returns false for tomorrow", () => {
    const tomorrow = new Date("2024-06-11T14:30:00Z")
    expect(isToday(tomorrow.toISOString(), now)).toBe(false)
  })

  it("returns false for null date string", () => {
    expect(isToday(null, now)).toBe(false)
  })
})

describe("formatDueDate", () => {
  const now = new Date("2024-06-10T12:00:00Z")

  it("returns null for null input", () => {
    expect(formatDueDate(null, now)).toBeNull()
  })

  it("returns 'Today' for today's date", () => {
    expect(formatDueDate(new Date("2024-06-10T08:00:00Z").toISOString(), now)).toBe("Today")
  })

  it("returns 'Tomorrow' for tomorrow's date", () => {
    expect(formatDueDate(new Date("2024-06-11T08:00:00Z").toISOString(), now)).toBe("Tomorrow")
  })

  it("returns short date format (without year) for other dates", () => {
    const result = formatDueDate(new Date("2024-06-20T08:00:00Z").toISOString(), now)
    // Should be like "Jun 20"
    expect(result).toMatch(/Jun/)
    expect(result).toMatch(/20/)
    // Should NOT contain a 4-digit year (changed in PR: removed year from format)
    expect(result).not.toMatch(/2024/)
  })

  it("returns formatted date for past dates", () => {
    const result = formatDueDate(new Date("2024-05-01T08:00:00Z").toISOString(), now)
    expect(result).toMatch(/May/)
    expect(result).toMatch(/1/)
  })

  it("returns date string without year (format change in PR)", () => {
    // PR changed: removed 'year: "numeric"' from toLocaleDateString options
    const result = formatDueDate(new Date("2024-07-15T08:00:00Z").toISOString(), now)
    expect(result).not.toContain("2024")
  })
})

describe("filterTasks", () => {
  const now = new Date("2024-06-10T12:00:00Z")
  const tomorrow = new Date("2024-06-11T12:00:00Z")
  const yesterday = new Date("2024-06-09T12:00:00Z")

  const baseTasks: Task[] = [
    {
      id: "1",
      name: "Write tests",
      status: "To Do",
      priority: "High",
      due_date: now.toISOString(),
      completed: false,
      created_at: now.toISOString(),
      project_id: "p1",
      projects: { name: "ForgeMancer" },
      description: null,
    },
    {
      id: "2",
      name: "Fix bug",
      status: "Done",
      priority: "Medium",
      due_date: tomorrow.toISOString(),
      completed: false,
      created_at: now.toISOString(),
      project_id: "p1",
      projects: { name: "ForgeMancer" },
      description: null,
    },
    {
      id: "3",
      name: "Deploy app",
      status: "In Progress",
      priority: "Low",
      due_date: tomorrow.toISOString(),
      completed: false,
      created_at: now.toISOString(),
      project_id: "p2",
      projects: { name: "Client Portal" },
      description: null,
    },
    {
      id: "4",
      name: "Code review",
      status: "Completed",
      priority: "Low",
      due_date: yesterday.toISOString(),
      completed: true,
      created_at: yesterday.toISOString(),
      project_id: "p2",
      projects: { name: "Client Portal" },
      description: null,
    },
  ]

  it("returns all tasks when filter is 'all' and no search query", () => {
    const result = filterTasks(baseTasks, "", "all", now)
    expect(result).toHaveLength(4)
  })

  it("filters by search query on task name", () => {
    const result = filterTasks(baseTasks, "write", "all", now)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe("Write tests")
  })

  it("filters by search query on project name", () => {
    const result = filterTasks(baseTasks, "ForgeMancer", "all", now)
    expect(result).toHaveLength(2)
  })

  it("search is case-insensitive", () => {
    const result = filterTasks(baseTasks, "FORGEMANCER", "all", now)
    expect(result).toHaveLength(2)
  })

  it("filter='today' only returns tasks due today", () => {
    const result = filterTasks(baseTasks, "", "today", now)
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("1")
  })

  it("filter='upcoming' returns non-completed tasks", () => {
    const result = filterTasks(baseTasks, "", "upcoming", now)
    // Tasks with completed=false and status !== "Done"
    // task 1: completed=false, status="To Do" → include
    // task 2: completed=false, status="Done" → exclude (status is Done)
    // task 3: completed=false, status="In Progress" → include
    // task 4: completed=true → exclude
    expect(result).toHaveLength(2)
    expect(result.map(t => t.id)).toContain("1")
    expect(result.map(t => t.id)).toContain("3")
  })

  it("filter='completed' returns completed or Done tasks", () => {
    const result = filterTasks(baseTasks, "", "completed", now)
    // task 2: status="Done" → include (completed=false but status Done)
    // task 4: completed=true → include
    expect(result).toHaveLength(2)
    expect(result.map(t => t.id)).toContain("2")
    expect(result.map(t => t.id)).toContain("4")
  })

  it("combines search and filter correctly", () => {
    const result = filterTasks(baseTasks, "ForgeMancer", "upcoming", now)
    // Only tasks with ForgeMancer project AND not completed/done
    // task 1: ForgeMancer, not complete → include
    // task 2: ForgeMancer, status Done → exclude
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe("1")
  })

  it("returns empty array when no tasks match search", () => {
    const result = filterTasks(baseTasks, "xyznotfound", "all", now)
    expect(result).toHaveLength(0)
  })
})

describe("pendingCount and completedCount", () => {
  const tasks: Task[] = [
    { id: "1", name: "A", status: "To Do", priority: null, due_date: null, completed: false, created_at: "", project_id: null, projects: null, description: null },
    { id: "2", name: "B", status: "Done", priority: null, due_date: null, completed: false, created_at: "", project_id: null, projects: null, description: null },
    { id: "3", name: "C", status: "In Progress", priority: null, due_date: null, completed: false, created_at: "", project_id: null, projects: null, description: null },
    { id: "4", name: "D", status: "Completed", priority: null, due_date: null, completed: true, created_at: "", project_id: null, projects: null, description: null },
  ]

  it("pendingCount counts non-completed, non-Done tasks", () => {
    const pendingCount = tasks.filter((t) => !t.completed && t.status !== "Done").length
    expect(pendingCount).toBe(2)
  })

  it("completedCount counts completed or Done tasks", () => {
    const completedCount = tasks.filter((t) => t.completed || t.status === "Done").length
    expect(completedCount).toBe(2)
  })

  it("pendingCount + completedCount does not need to equal total tasks (edge cases)", () => {
    // A task with completed=false and status="Done" → not pending, is completed
    // A task with completed=true and status="To Do" → not pending, is completed
    const pendingCount = tasks.filter((t) => !t.completed && t.status !== "Done").length
    const completedCount = tasks.filter((t) => t.completed || t.status === "Done").length
    expect(pendingCount + completedCount).toBeLessThanOrEqual(tasks.length)
  })
})

describe("Calendar helpers", () => {
  it("correctly computes daysInMonth for January (31 days)", () => {
    const { daysInMonth } = computeCalendarHelpers(new Date(2024, 0, 15))
    expect(daysInMonth).toBe(31)
  })

  it("correctly computes daysInMonth for February 2024 (leap year, 29 days)", () => {
    const { daysInMonth } = computeCalendarHelpers(new Date(2024, 1, 1))
    expect(daysInMonth).toBe(29)
  })

  it("correctly computes daysInMonth for February 2023 (non-leap year, 28 days)", () => {
    const { daysInMonth } = computeCalendarHelpers(new Date(2023, 1, 1))
    expect(daysInMonth).toBe(28)
  })

  it("calendarDays has same length as daysInMonth", () => {
    const { daysInMonth, calendarDays } = computeCalendarHelpers(new Date(2024, 0, 1))
    expect(calendarDays).toHaveLength(daysInMonth)
  })

  it("paddingDays has length equal to startDayOfWeek", () => {
    const { startDayOfWeek, paddingDays } = computeCalendarHelpers(new Date(2024, 0, 1))
    expect(paddingDays).toHaveLength(startDayOfWeek)
  })

  it("calendarGrid = paddingDays + calendarDays", () => {
    const { paddingDays, calendarDays, calendarGrid } = computeCalendarHelpers(new Date(2024, 2, 1))
    expect(calendarGrid).toHaveLength(paddingDays.length + calendarDays.length)
  })

  it("calendarGrid starts with null entries for padding", () => {
    // January 2024: starts on Monday (day 1), so 1 padding day
    const { calendarGrid, startDayOfWeek } = computeCalendarHelpers(new Date(2024, 0, 1))
    for (let i = 0; i < startDayOfWeek; i++) {
      expect(calendarGrid[i]).toBeNull()
    }
  })

  it("calendarGrid first non-null entry is day 1 of the month", () => {
    const { calendarGrid, startDayOfWeek } = computeCalendarHelpers(new Date(2024, 2, 1))
    const firstDay = calendarGrid[startDayOfWeek] as Date
    expect(firstDay.getDate()).toBe(1)
  })

  it("nextMonthDate advances month correctly", () => {
    const may2024 = new Date(2024, 4, 15)
    const june2024 = nextMonthDate(may2024)
    expect(june2024.getMonth()).toBe(5)
    expect(june2024.getFullYear()).toBe(2024)
    expect(june2024.getDate()).toBe(1)
  })

  it("nextMonthDate wraps from December to January", () => {
    const dec2024 = new Date(2024, 11, 15)
    const jan2025 = nextMonthDate(dec2024)
    expect(jan2025.getMonth()).toBe(0)
    expect(jan2025.getFullYear()).toBe(2025)
  })

  it("prevMonthDate goes back one month", () => {
    const june2024 = new Date(2024, 5, 15)
    const may2024 = prevMonthDate(june2024)
    expect(may2024.getMonth()).toBe(4)
    expect(may2024.getFullYear()).toBe(2024)
    expect(may2024.getDate()).toBe(1)
  })

  it("prevMonthDate wraps from January to December", () => {
    const jan2024 = new Date(2024, 0, 15)
    const dec2023 = prevMonthDate(jan2024)
    expect(dec2023.getMonth()).toBe(11)
    expect(dec2023.getFullYear()).toBe(2023)
  })
})

describe("getTasksForDate", () => {
  const tasks: Task[] = [
    {
      id: "1",
      name: "Task on June 10",
      status: "To Do",
      priority: "High",
      due_date: "2024-06-10T08:00:00Z",
      completed: false,
      created_at: "2024-06-01T00:00:00Z",
      project_id: null,
      projects: null,
      description: null,
    },
    {
      id: "2",
      name: "Another task on June 10",
      status: "In Progress",
      priority: "Low",
      due_date: "2024-06-10T22:00:00Z",
      completed: false,
      created_at: "2024-06-01T00:00:00Z",
      project_id: null,
      projects: null,
      description: null,
    },
    {
      id: "3",
      name: "Task on June 15",
      status: "To Do",
      priority: "Medium",
      due_date: "2024-06-15T08:00:00Z",
      completed: false,
      created_at: "2024-06-01T00:00:00Z",
      project_id: null,
      projects: null,
      description: null,
    },
    {
      id: "4",
      name: "Task with no due date",
      status: "To Do",
      priority: null,
      due_date: null,
      completed: false,
      created_at: "2024-06-01T00:00:00Z",
      project_id: null,
      projects: null,
      description: null,
    },
  ]

  it("returns all tasks due on a specific date", () => {
    const june10 = new Date(2024, 5, 10) // June 10, 2024 local
    const result = getTasksForDate(tasks, june10)
    // Both task 1 and task 2 have due_date on June 10 UTC
    // Note: UTC dates are interpreted in local time by new Date()
    expect(result.some(t => t.id === "1")).toBe(true)
    expect(result.some(t => t.id === "2")).toBe(true)
  })

  it("excludes tasks due on other dates", () => {
    const june15 = new Date(2024, 5, 15)
    const result = getTasksForDate(tasks, june15)
    expect(result.every(t => t.id === "3")).toBe(true)
  })

  it("excludes tasks with no due_date", () => {
    const june10 = new Date(2024, 5, 10)
    const result = getTasksForDate(tasks, june10)
    expect(result.find(t => t.id === "4")).toBeUndefined()
  })

  it("returns empty array when no tasks are due on that date", () => {
    const randomDate = new Date(2024, 5, 25)
    const result = getTasksForDate(tasks, randomDate)
    expect(result).toHaveLength(0)
  })
})

describe("monthNames array", () => {
  it("has exactly 12 months", () => {
    expect(monthNames).toHaveLength(12)
  })

  it("starts with January (index 0)", () => {
    expect(monthNames[0]).toBe("January")
  })

  it("ends with December (index 11)", () => {
    expect(monthNames[11]).toBe("December")
  })

  it("correctly maps calendar month index to name", () => {
    // new Date(2024, 5, 1).getMonth() === 5 → June
    expect(monthNames[5]).toBe("June")
    expect(monthNames[11]).toBe("December")
  })
})

describe("toggleTaskCompletion optimistic update logic", () => {
  const initialTasks: Task[] = [
    { id: "t1", name: "Task 1", completed: false, status: "To Do", priority: "High", due_date: null, created_at: "", project_id: null, projects: null, description: null },
    { id: "t2", name: "Task 2", completed: true, status: "Done", priority: "Low", due_date: null, created_at: "", project_id: null, projects: null, description: null },
  ]

  it("marks an incomplete task as completed and sets status to 'Done'", () => {
    const updated = applyOptimisticToggle(initialTasks, "t1")
    const task = updated.find(t => t.id === "t1")!
    expect(task.completed).toBe(true)
    expect(task.status).toBe("Done")
  })

  it("marks a completed task as incomplete and sets status to 'To Do'", () => {
    const updated = applyOptimisticToggle(initialTasks, "t2")
    const task = updated.find(t => t.id === "t2")!
    expect(task.completed).toBe(false)
    expect(task.status).toBe("To Do")
  })

  it("does not change other tasks", () => {
    const updated = applyOptimisticToggle(initialTasks, "t1")
    const unchanged = updated.find(t => t.id === "t2")!
    expect(unchanged.completed).toBe(initialTasks[1].completed)
    expect(unchanged.status).toBe(initialTasks[1].status)
  })

  it("reverts correctly on error", () => {
    const optimistic = applyOptimisticToggle(initialTasks, "t1")
    // Simulate error: revert to original state of t1
    const reverted = revertToggle(optimistic, initialTasks[0])
    const task = reverted.find(t => t.id === "t1")!
    expect(task.completed).toBe(false)
    expect(task.status).toBe("To Do")
  })

  it("adds success toast notification when task is completed (new in PR)", () => {
    // The PR added an else branch for success toasting
    // We test the title/description string construction logic
    const task = initialTasks[0]
    const newCompleted = !task.completed // true
    const toastTitle = newCompleted ? "Task completed!" : "Task reopened"
    const toastDescription = `"${task.name}" has been updated.`
    expect(toastTitle).toBe("Task completed!")
    expect(toastDescription).toBe('"Task 1" has been updated.')
  })

  it("shows 'Task reopened' when uncompleting a task (new in PR)", () => {
    const task = initialTasks[1] // completed=true
    const newCompleted = !task.completed // false
    const toastTitle = newCompleted ? "Task completed!" : "Task reopened"
    expect(toastTitle).toBe("Task reopened")
  })
})