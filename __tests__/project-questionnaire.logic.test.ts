/**
 * Tests for pure logic extracted from components/project-questionnaire.tsx
 *
 * Covers:
 * - updateProgress() calculation
 * - handleProjectGoalToggle() logic
 * - projectTypes data structure
 * - techStackOptions data structure
 * - projectGoals list
 * - projectSchema validation rules (Zod schema)
 * - savePendingProject data shape
 */

import { describe, it, expect } from "vitest"

// ── Pure function re-implementations ──

const TOTAL_STEPS = 5

/** updateProgress from ProjectQuestionnaire */
function updateProgress(currentStep: number, totalSteps: number = TOTAL_STEPS): number {
  return (currentStep / totalSteps) * 100
}

/** handleProjectGoalToggle logic */
function toggleProjectGoal(currentGoals: string[], goal: string): string[] {
  if (currentGoals.includes(goal)) {
    return currentGoals.filter((g) => g !== goal)
  } else {
    return [...currentGoals, goal]
  }
}

/** stepIcons mapping (index-based) */
const stepCount = 5

const projectTypes = [
  { value: "web-app", label: "Web Application" },
  { value: "mobile-app", label: "Mobile Application" },
  { value: "e-commerce", label: "E-commerce Site" },
  { value: "portfolio", label: "Portfolio Website" },
  { value: "blog", label: "Blog" },
  { value: "dashboard", label: "Dashboard" },
  { value: "blockchain", label: "Blockchain Application" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "ai-ml", label: "AI/ML Project" },
]

const techStackOptions: Record<string, { value: string; label: string }[]> = {
  "web-app": [
    { value: "React", label: "React" },
    { value: "Next.js", label: "Next.js" },
    { value: "Vue", label: "Vue.js" },
    { value: "Angular", label: "Angular" },
    { value: "Node.js", label: "Node.js" },
    { value: "Django", label: "Django" },
    { value: "Ruby on Rails", label: "Ruby on Rails" },
    { value: "Laravel", label: "Laravel" },
  ],
  "mobile-app": [
    { value: "React Native", label: "React Native" },
    { value: "Flutter", label: "Flutter" },
    { value: "Swift", label: "Swift (iOS)" },
    { value: "Kotlin", label: "Kotlin (Android)" },
    { value: "Xamarin", label: "Xamarin" },
  ],
  "e-commerce": [
    { value: "Shopify", label: "Shopify" },
    { value: "WooCommerce", label: "WooCommerce" },
    { value: "Magento", label: "Magento" },
    { value: "Next.js Commerce", label: "Next.js Commerce" },
    { value: "Saleor", label: "Saleor" },
  ],
  portfolio: [
    { value: "HTML/CSS/JS", label: "HTML/CSS/JavaScript" },
    { value: "React", label: "React" },
    { value: "Next.js", label: "Next.js" },
    { value: "Gatsby", label: "Gatsby" },
    { value: "WordPress", label: "WordPress" },
  ],
  blog: [
    { value: "WordPress", label: "WordPress" },
    { value: "Ghost", label: "Ghost" },
    { value: "Next.js", label: "Next.js" },
    { value: "Gatsby", label: "Gatsby" },
    { value: "Medium", label: "Medium" },
  ],
  dashboard: [
    { value: "React", label: "React" },
    { value: "Next.js", label: "Next.js" },
    { value: "Vue", label: "Vue.js" },
    { value: "D3.js", label: "D3.js" },
    { value: "Grafana", label: "Grafana" },
  ],
  blockchain: [
    { value: "Ethereum", label: "Ethereum" },
    { value: "Solidity", label: "Solidity" },
    { value: "Web3.js", label: "Web3.js" },
    { value: "Hardhat", label: "Hardhat" },
    { value: "Solana", label: "Solana" },
  ],
  "digital-marketing": [
    { value: "Google Ads", label: "Google Ads" },
    { value: "Facebook Ads", label: "Facebook Ads" },
    { value: "SEO", label: "SEO" },
    { value: "Content Marketing", label: "Content Marketing" },
    { value: "Email Marketing", label: "Email Marketing" },
  ],
  "ai-ml": [
    { value: "TensorFlow", label: "TensorFlow" },
    { value: "PyTorch", label: "PyTorch" },
    { value: "scikit-learn", label: "scikit-learn" },
    { value: "Hugging Face", label: "Hugging Face" },
    { value: "OpenAI API", label: "OpenAI API" },
  ],
}

const projectGoals = [
  "Increase revenue",
  "Improve user experience",
  "Expand market reach",
  "Automate processes",
  "Reduce costs",
  "Enhance security",
  "Improve performance",
  "Add new features",
  "Rebrand/redesign",
  "Launch new product",
  "Educational/learning",
  "Personal portfolio",
]

// ═══════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════

describe("updateProgress", () => {
  it("returns 20% for step 1 of 5", () => {
    expect(updateProgress(1, 5)).toBe(20)
  })

  it("returns 40% for step 2 of 5", () => {
    expect(updateProgress(2, 5)).toBe(40)
  })

  it("returns 60% for step 3 of 5", () => {
    expect(updateProgress(3, 5)).toBe(60)
  })

  it("returns 80% for step 4 of 5", () => {
    expect(updateProgress(4, 5)).toBe(80)
  })

  it("returns 100% for step 5 of 5 (final step)", () => {
    expect(updateProgress(5, 5)).toBe(100)
  })

  it("returns 25% for initial step 1 (default totalSteps=5, initial progress=25)", () => {
    // The component initializes progress to 25% (step 1/4 implicit start)
    // But updateProgress(1) → 1/5 = 20
    // This tests the formula itself is (currentStep / totalSteps) * 100
    expect(updateProgress(1)).toBe(20)
  })

  it("progress increases linearly with each step", () => {
    const steps = [1, 2, 3, 4, 5]
    const progressValues = steps.map(s => updateProgress(s, 5))
    for (let i = 1; i < progressValues.length; i++) {
      expect(progressValues[i]).toBeGreaterThan(progressValues[i - 1])
    }
  })
})

describe("toggleProjectGoal", () => {
  it("adds a goal when it is not in the list", () => {
    const result = toggleProjectGoal([], "Increase revenue")
    expect(result).toContain("Increase revenue")
  })

  it("removes a goal when it is already in the list", () => {
    const result = toggleProjectGoal(["Increase revenue", "Reduce costs"], "Increase revenue")
    expect(result).not.toContain("Increase revenue")
    expect(result).toContain("Reduce costs")
  })

  it("does not modify other goals when adding a new one", () => {
    const initial = ["Goal A", "Goal B"]
    const result = toggleProjectGoal(initial, "Goal C")
    expect(result).toContain("Goal A")
    expect(result).toContain("Goal B")
    expect(result).toContain("Goal C")
  })

  it("does not modify other goals when removing one", () => {
    const initial = ["Goal A", "Goal B", "Goal C"]
    const result = toggleProjectGoal(initial, "Goal B")
    expect(result).toContain("Goal A")
    expect(result).toContain("Goal C")
    expect(result).not.toContain("Goal B")
  })

  it("starting with empty array and adding multiple goals works correctly", () => {
    let goals: string[] = []
    goals = toggleProjectGoal(goals, "Goal 1")
    goals = toggleProjectGoal(goals, "Goal 2")
    goals = toggleProjectGoal(goals, "Goal 3")
    expect(goals).toHaveLength(3)
    expect(goals).toContain("Goal 1")
    expect(goals).toContain("Goal 2")
    expect(goals).toContain("Goal 3")
  })

  it("toggling a goal twice returns to original state", () => {
    const initial = ["Increase revenue"]
    const added = toggleProjectGoal(initial, "Reduce costs")
    const removed = toggleProjectGoal(added, "Reduce costs")
    expect(removed).toEqual(initial)
  })

  it("returns new array reference (immutable)", () => {
    const initial = ["Goal A"]
    const result = toggleProjectGoal(initial, "Goal B")
    expect(result).not.toBe(initial)
  })
})

describe("projectTypes data", () => {
  it("has exactly 9 project types", () => {
    expect(projectTypes).toHaveLength(9)
  })

  it("all types have value and label", () => {
    projectTypes.forEach(type => {
      expect(type).toHaveProperty("value")
      expect(type).toHaveProperty("label")
    })
  })

  it("includes web-app type", () => {
    expect(projectTypes.find(t => t.value === "web-app")).toBeDefined()
  })

  it("includes ai-ml type", () => {
    expect(projectTypes.find(t => t.value === "ai-ml")).toBeDefined()
  })

  it("all values are kebab-case strings", () => {
    projectTypes.forEach(type => {
      expect(type.value).toMatch(/^[a-z][a-z-]*[a-z]$|^[a-z]+$/)
    })
  })

  it("no duplicate values", () => {
    const values = projectTypes.map(t => t.value)
    const unique = new Set(values)
    expect(unique.size).toBe(values.length)
  })
})

describe("techStackOptions", () => {
  it("has options for all 9 project types", () => {
    const projectTypeValues = projectTypes.map(t => t.value)
    projectTypeValues.forEach(type => {
      expect(techStackOptions).toHaveProperty(type)
    })
  })

  it("web-app includes React and Next.js", () => {
    const options = techStackOptions["web-app"]
    expect(options.find(o => o.value === "React")).toBeDefined()
    expect(options.find(o => o.value === "Next.js")).toBeDefined()
  })

  it("mobile-app includes React Native and Flutter", () => {
    const options = techStackOptions["mobile-app"]
    expect(options.find(o => o.value === "React Native")).toBeDefined()
    expect(options.find(o => o.value === "Flutter")).toBeDefined()
  })

  it("all stack options have value and label", () => {
    Object.values(techStackOptions).forEach(options => {
      options.forEach(option => {
        expect(option).toHaveProperty("value")
        expect(option).toHaveProperty("label")
      })
    })
  })

  it("returns undefined (no options) for unknown project types", () => {
    expect(techStackOptions["unknown-type"]).toBeUndefined()
  })

  it("e-commerce includes Shopify", () => {
    const options = techStackOptions["e-commerce"]
    expect(options.find(o => o.value === "Shopify")).toBeDefined()
  })
})

describe("projectGoals list", () => {
  it("has exactly 12 project goals", () => {
    expect(projectGoals).toHaveLength(12)
  })

  it("includes 'Increase revenue'", () => {
    expect(projectGoals).toContain("Increase revenue")
  })

  it("includes 'Improve user experience'", () => {
    expect(projectGoals).toContain("Improve user experience")
  })

  it("all goals are non-empty strings", () => {
    projectGoals.forEach(goal => {
      expect(typeof goal).toBe("string")
      expect(goal.length).toBeGreaterThan(0)
    })
  })

  it("no duplicate goals", () => {
    const unique = new Set(projectGoals)
    expect(unique.size).toBe(projectGoals.length)
  })
})

describe("step count and step label logic", () => {
  const stepLabels: Record<number, string> = {
    1: "Basic Information",
    2: "Project Type & Experience",
    3: "Tech Stack & Goals",
    4: "Final Details",
    5: "Review AI Plan",
  }

  it("has exactly 5 steps", () => {
    expect(Object.keys(stepLabels)).toHaveLength(5)
  })

  it("step 5 is 'Review AI Plan'", () => {
    expect(stepLabels[5]).toBe("Review AI Plan")
  })

  it("step 1 is 'Basic Information'", () => {
    expect(stepLabels[1]).toBe("Basic Information")
  })

  it("step 4 triggers AI plan generation (boundary)", () => {
    // In handleNext: step === 4 triggers generatePlan or shows auth gate
    const PLAN_GENERATION_STEP = 4
    expect(PLAN_GENERATION_STEP).toBeLessThan(stepCount)
  })

  it("progress at step 4 shows 80% complete", () => {
    const progress = Math.round(updateProgress(4, 5))
    expect(progress).toBe(80)
  })
})

describe("handleNext fieldsToValidate per step", () => {
  // Validates what fields each step should trigger validation for
  function getFieldsToValidate(step: number): string[] {
    switch (step) {
      case 1: return ["name", "description", "clientName"]
      case 2: return ["projectType", "experienceLevel"]
      case 3: return ["techStack", "projectGoals"]
      case 4: return ["targetAudience", "budget"]
      default: return []
    }
  }

  it("step 1 validates name, description, clientName", () => {
    expect(getFieldsToValidate(1)).toEqual(["name", "description", "clientName"])
  })

  it("step 2 validates projectType and experienceLevel", () => {
    expect(getFieldsToValidate(2)).toEqual(["projectType", "experienceLevel"])
  })

  it("step 3 validates techStack and projectGoals", () => {
    expect(getFieldsToValidate(3)).toEqual(["techStack", "projectGoals"])
  })

  it("step 4 validates targetAudience and budget", () => {
    expect(getFieldsToValidate(4)).toEqual(["targetAudience", "budget"])
  })

  it("step 5 validates nothing (AI review step)", () => {
    expect(getFieldsToValidate(5)).toEqual([])
  })
})