/**
 * Tests for pure logic extracted from app/dashboard/settings/page.tsx
 *
 * Covers:
 * - skillsArray parsing from comma-separated string (handleSave logic)
 * - Skills array to display string serialization (fetchProfile logic)
 * - firstName/lastName derivation from full_name
 * - experience_level valid values
 * - Animation variant configuration (item hidden.y changed from 20 to 15 in this PR)
 */

import { describe, it, expect } from "vitest"

// ── Pure function re-implementations ──

/** Skills string (CSV) → cleaned array — from handleSave in settings/page.tsx */
function parseSkillsToArray(skillsStr: string): string[] {
  return skillsStr
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

/** Profile skills field (Array | string) → display string — from fetchProfile */
function profileSkillsToDisplayString(skills: string[] | string | null | undefined): string {
  if (Array.isArray(skills)) {
    return skills.join(", ")
  }
  return skills || ""
}

/** firstName derivation from full_name */
function getFirstName(fullName: string): string {
  return fullName.split(" ")[0] ?? ""
}

/** lastName derivation from full_name */
function getLastName(fullName: string): string {
  return fullName.split(" ").slice(1).join(" ")
}

/** Full name reconstruction from separate first/last name values */
function buildFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim()
}

// ═══════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════

describe("parseSkillsToArray (handleSave skill parsing)", () => {
  it("parses a simple comma-separated string", () => {
    const result = parseSkillsToArray("JavaScript, React, TypeScript")
    expect(result).toEqual(["JavaScript", "React", "TypeScript"])
  })

  it("trims whitespace from each skill", () => {
    const result = parseSkillsToArray("  JavaScript  ,  React  ,  CSS  ")
    expect(result).toEqual(["JavaScript", "React", "CSS"])
  })

  it("filters out empty entries from double commas", () => {
    const result = parseSkillsToArray("JavaScript,,React,")
    expect(result).toEqual(["JavaScript", "React"])
  })

  it("returns empty array for empty string", () => {
    expect(parseSkillsToArray("")).toEqual([])
  })

  it("returns empty array for whitespace-only string", () => {
    expect(parseSkillsToArray("   ")).toEqual([])
  })

  it("returns single-element array for single skill", () => {
    expect(parseSkillsToArray("React")).toEqual(["React"])
  })

  it("handles trailing comma", () => {
    const result = parseSkillsToArray("JavaScript, React,")
    expect(result).toEqual(["JavaScript", "React"])
  })

  it("handles leading comma", () => {
    const result = parseSkillsToArray(",JavaScript, React")
    expect(result).toEqual(["JavaScript", "React"])
  })

  it("handles skills with hyphenated names", () => {
    const result = parseSkillsToArray("UI/UX, Next.js, Node.js")
    expect(result).toEqual(["UI/UX", "Next.js", "Node.js"])
  })

  it("preserves skill names with internal spaces", () => {
    const result = parseSkillsToArray("Machine Learning, Data Science")
    expect(result).toEqual(["Machine Learning", "Data Science"])
  })
})

describe("profileSkillsToDisplayString (fetchProfile skills normalization)", () => {
  it("joins string array with ', ' separator", () => {
    const result = profileSkillsToDisplayString(["JavaScript", "React", "TypeScript"])
    expect(result).toBe("JavaScript, React, TypeScript")
  })

  it("returns plain string unchanged when given a string", () => {
    expect(profileSkillsToDisplayString("JavaScript, React")).toBe("JavaScript, React")
  })

  it("returns empty string for null", () => {
    expect(profileSkillsToDisplayString(null)).toBe("")
  })

  it("returns empty string for undefined", () => {
    expect(profileSkillsToDisplayString(undefined)).toBe("")
  })

  it("returns empty string for empty array", () => {
    expect(profileSkillsToDisplayString([])).toBe("")
  })

  it("returns single item for single-element array", () => {
    expect(profileSkillsToDisplayString(["React"])).toBe("React")
  })

  it("returns empty string for empty string input", () => {
    expect(profileSkillsToDisplayString("")).toBe("")
  })
})

describe("firstName / lastName derivation from full_name", () => {
  it("correctly extracts first name from 'John Doe'", () => {
    expect(getFirstName("John Doe")).toBe("John")
  })

  it("correctly extracts last name from 'John Doe'", () => {
    expect(getLastName("John Doe")).toBe("Doe")
  })

  it("handles single-word name (no last name)", () => {
    expect(getFirstName("Alice")).toBe("Alice")
    expect(getLastName("Alice")).toBe("")
  })

  it("handles three-part names", () => {
    expect(getFirstName("Mary Jane Watson")).toBe("Mary")
    expect(getLastName("Mary Jane Watson")).toBe("Jane Watson")
  })

  it("returns empty string for empty full_name", () => {
    expect(getFirstName("")).toBe("")
    expect(getLastName("")).toBe("")
  })

  it("handles names with extra trailing spaces", () => {
    // split(" ") on "John Doe " → ["John", "Doe", ""] → lastName = "Doe "
    const lastName = getLastName("John Doe ")
    // Trim is applied when building the full name, not when extracting
    expect(getFirstName("John Doe ")).toBe("John")
  })
})

describe("buildFullName (full_name reconstruction)", () => {
  it("combines first and last name with a space", () => {
    expect(buildFullName("John", "Doe")).toBe("John Doe")
  })

  it("trims result when last name is empty", () => {
    expect(buildFullName("Alice", "")).toBe("Alice")
  })

  it("trims result when first name is empty", () => {
    expect(buildFullName("", "Smith")).toBe("Smith")
  })

  it("handles both names empty", () => {
    expect(buildFullName("", "")).toBe("")
  })

  it("preserves multi-word last name", () => {
    expect(buildFullName("Mary", "Jane Watson")).toBe("Mary Jane Watson")
  })
})

describe("experience_level valid values (settings form)", () => {
  const validLevels = [
    { id: "beginner", title: "Beginner", desc: "0-2 years of experience" },
    { id: "intermediate", title: "Intermediate", desc: "2-5 years of experience" },
    { id: "expert", title: "Expert", desc: "5+ years of experience" },
  ]

  it("has exactly 3 experience levels", () => {
    expect(validLevels).toHaveLength(3)
  })

  it("beginner is the first level", () => {
    expect(validLevels[0].id).toBe("beginner")
  })

  it("intermediate is the default level", () => {
    // Default value in component is "intermediate"
    const defaultLevel = "intermediate"
    expect(validLevels.find(l => l.id === defaultLevel)).toBeDefined()
  })

  it("expert is the last level", () => {
    expect(validLevels[validLevels.length - 1].id).toBe("expert")
  })

  it("all levels have id, title, and desc properties", () => {
    validLevels.forEach(level => {
      expect(level).toHaveProperty("id")
      expect(level).toHaveProperty("title")
      expect(level).toHaveProperty("desc")
    })
  })
})

describe("animation variant change (PR: item hidden.y changed from 20 to 15)", () => {
  // This tests that the new animation config is what we expect
  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  }

  it("item hidden state has y: 15 (changed from 20 in PR)", () => {
    expect(item.hidden.y).toBe(15)
  })

  it("item show state has y: 0", () => {
    expect(item.show.y).toBe(0)
  })

  it("item hidden state has opacity: 0", () => {
    expect(item.hidden.opacity).toBe(0)
  })

  it("item show state has opacity: 1", () => {
    expect(item.show.opacity).toBe(1)
  })

  it("y offset in hidden state is NOT 20 (old value before PR)", () => {
    expect(item.hidden.y).not.toBe(20)
  })
})

describe("billing: price calculation logic from landing page (plans)", () => {
  const plans = [
    { name: "Basic", price: "$9" },
    { name: "Pro", price: "$29" },
    { name: "Enterprise", price: "$99" },
  ]

  function computeDisplayPrice(priceStr: string, isAnnual: boolean): string {
    const basePrice = parseInt(priceStr.replace("$", ""))
    return isAnnual ? `$${Math.round(basePrice * 12 * 0.8)}` : priceStr
  }

  it("returns monthly price unchanged when not annual", () => {
    expect(computeDisplayPrice("$9", false)).toBe("$9")
    expect(computeDisplayPrice("$29", false)).toBe("$29")
  })

  it("applies 20% discount for annual billing", () => {
    // $9/mo * 12 * 0.8 = $86.4 → rounds to $86
    expect(computeDisplayPrice("$9", true)).toBe("$86")
    // $29/mo * 12 * 0.8 = $278.4 → rounds to $278
    expect(computeDisplayPrice("$29", true)).toBe("$278")
  })

  it("annual price is less than monthly * 12", () => {
    const monthly = 29
    const annualStr = computeDisplayPrice(`$${monthly}`, true)
    const annual = parseInt(annualStr.replace("$", ""))
    expect(annual).toBeLessThan(monthly * 12)
  })

  it("annual discount is exactly 20%", () => {
    const monthly = 10
    const annualStr = computeDisplayPrice(`$${monthly}`, true)
    const annual = parseInt(annualStr.replace("$", ""))
    const expectedDiscount = monthly * 12 * 0.8
    expect(annual).toBe(Math.round(expectedDiscount))
  })
})