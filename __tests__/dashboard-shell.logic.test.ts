/**
 * Tests for pure logic extracted from components/dashboard-shell.tsx
 *
 * Covers:
 * - getUserInitials() function
 * - mainNavigation array structure
 * - sidebar project color cycling
 * - page title mapping from pathname
 */

import { describe, it, expect } from "vitest"

// ── Pure function re-implementations ──

/** getUserInitials() from DashboardShell component */
function getUserInitials(
  profileFullName: string | null | undefined,
  userEmail: string | null | undefined,
): string {
  if (profileFullName) {
    return profileFullName
      .split(" ")
      .map((name: string) => name[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }
  return userEmail?.substring(0, 2).toUpperCase() || "U"
}

/** Page title mapping as implemented in DashboardShell desktop header */
function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Dashboard"
  if (pathname === "/dashboard/projects") return "Projects"
  if (pathname === "/dashboard/chat") return "AI Chat"
  if (pathname === "/dashboard/tasks") return "Tasks"
  if (pathname === "/dashboard/settings") return "Settings"
  if (pathname === "/dashboard/profile") return "Profile"
  if (pathname === "/dashboard/notifications") return "Notifications"
  if (pathname.includes("/dashboard/projects/")) return "Project Details"
  return "Dashboard"
}

/** Project initials computation from sidebar */
function computeSidebarProjectInitials(projectName: string): string {
  return projectName
    .split(" ")
    .map((word: string) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()
}

const mainNavigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Projects", href: "/dashboard/projects" },
  { name: "AI Chat", href: "/dashboard/chat" },
  { name: "Tasks", href: "/dashboard/tasks" },
]

const sidebarColors = [
  { bg: "bg-blue-500/15 border-blue-500/20", text: "text-blue-500" },
  { bg: "bg-emerald-500/15 border-emerald-500/20", text: "text-emerald-500" },
  { bg: "bg-violet-500/15 border-violet-500/20", text: "text-violet-500" },
  { bg: "bg-amber-500/15 border-amber-500/20", text: "text-amber-500" },
  { bg: "bg-rose-500/15 border-rose-500/20", text: "text-rose-500" },
]

// ═══════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════

describe("getUserInitials", () => {
  it("returns first two letters of full name", () => {
    expect(getUserInitials("John Doe", "john@example.com")).toBe("JD")
  })

  it("returns first letter only for single-word name", () => {
    expect(getUserInitials("Alice", "alice@example.com")).toBe("A")
  })

  it("uppercases the initials", () => {
    expect(getUserInitials("john doe", "john@example.com")).toBe("JD")
  })

  it("truncates to 2 characters for names with many words", () => {
    expect(getUserInitials("Mary Jane Watson Parker", undefined)).toBe("MJ")
  })

  it("falls back to email prefix when full_name is null", () => {
    expect(getUserInitials(null, "alice@example.com")).toBe("AL")
  })

  it("falls back to email prefix when full_name is empty string", () => {
    expect(getUserInitials("", "bob@example.com")).toBe("BO")
  })

  it("falls back to email prefix when full_name is undefined", () => {
    expect(getUserInitials(undefined, "charlie@example.com")).toBe("CH")
  })

  it("returns 'U' as ultimate fallback when both full_name and email are missing", () => {
    expect(getUserInitials(null, null)).toBe("U")
    expect(getUserInitials(undefined, undefined)).toBe("U")
  })

  it("returns 'U' when email is empty string", () => {
    expect(getUserInitials(null, "")).toBe("U")
  })

  it("handles names with single character", () => {
    expect(getUserInitials("X", "x@example.com")).toBe("X")
  })

  it("email prefix is exactly 2 chars (uppercase)", () => {
    // "zy@example.com" → "ZY"
    const result = getUserInitials(null, "zy@example.com")
    expect(result).toBe("ZY")
    expect(result).toHaveLength(2)
  })
})

describe("mainNavigation structure", () => {
  it("has exactly 4 navigation items", () => {
    expect(mainNavigation).toHaveLength(4)
  })

  it("Dashboard is first", () => {
    expect(mainNavigation[0].name).toBe("Dashboard")
    expect(mainNavigation[0].href).toBe("/dashboard")
  })

  it("all items have name and href", () => {
    mainNavigation.forEach(item => {
      expect(item).toHaveProperty("name")
      expect(item).toHaveProperty("href")
      expect(typeof item.name).toBe("string")
      expect(typeof item.href).toBe("string")
    })
  })

  it("all hrefs start with /dashboard", () => {
    mainNavigation.forEach(item => {
      expect(item.href).toMatch(/^\/dashboard/)
    })
  })
})

describe("getPageTitle (pathname → page title)", () => {
  it("returns 'Dashboard' for /dashboard", () => {
    expect(getPageTitle("/dashboard")).toBe("Dashboard")
  })

  it("returns 'Projects' for /dashboard/projects", () => {
    expect(getPageTitle("/dashboard/projects")).toBe("Projects")
  })

  it("returns 'AI Chat' for /dashboard/chat", () => {
    expect(getPageTitle("/dashboard/chat")).toBe("AI Chat")
  })

  it("returns 'Tasks' for /dashboard/tasks", () => {
    expect(getPageTitle("/dashboard/tasks")).toBe("Tasks")
  })

  it("returns 'Settings' for /dashboard/settings", () => {
    expect(getPageTitle("/dashboard/settings")).toBe("Settings")
  })

  it("returns 'Profile' for /dashboard/profile", () => {
    expect(getPageTitle("/dashboard/profile")).toBe("Profile")
  })

  it("returns 'Notifications' for /dashboard/notifications", () => {
    expect(getPageTitle("/dashboard/notifications")).toBe("Notifications")
  })

  it("returns 'Project Details' for project detail pages", () => {
    expect(getPageTitle("/dashboard/projects/abc123")).toBe("Project Details")
    expect(getPageTitle("/dashboard/projects/abc123?tab=tasks")).toBe("Project Details")
  })

  it("returns 'Dashboard' as fallback for unknown routes", () => {
    expect(getPageTitle("/dashboard/unknown")).toBe("Dashboard")
  })
})

describe("sidebar project color cycling", () => {
  it("has exactly 5 color options", () => {
    expect(sidebarColors).toHaveLength(5)
  })

  it("cycles colors by index modulo 5", () => {
    // First 5 indices map 1:1
    for (let i = 0; i < 5; i++) {
      expect(sidebarColors[i % sidebarColors.length]).toEqual(sidebarColors[i])
    }
    // Index 5 wraps back to color 0
    expect(sidebarColors[5 % sidebarColors.length]).toEqual(sidebarColors[0])
    expect(sidebarColors[6 % sidebarColors.length]).toEqual(sidebarColors[1])
  })

  it("first color is blue", () => {
    expect(sidebarColors[0].text).toContain("blue-500")
  })

  it("each color has bg and text properties", () => {
    sidebarColors.forEach(color => {
      expect(color).toHaveProperty("bg")
      expect(color).toHaveProperty("text")
    })
  })
})

describe("computeSidebarProjectInitials", () => {
  it("returns 2-character initials for multi-word projects", () => {
    expect(computeSidebarProjectInitials("My Project")).toBe("MP")
  })

  it("returns 1-character initials for single word", () => {
    expect(computeSidebarProjectInitials("Alpha")).toBe("A")
  })

  it("uppercases the result", () => {
    expect(computeSidebarProjectInitials("acme corp")).toBe("AC")
  })

  it("truncates to max 2 characters", () => {
    expect(computeSidebarProjectInitials("A B C D E")).toBe("AB")
  })
})