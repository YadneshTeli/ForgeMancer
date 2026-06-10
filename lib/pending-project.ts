/**
 * Utility functions for managing pending project data in localStorage.
 * Used by the "try before signup" flow to persist project questionnaire
 * data before the user authenticates.
 *
 * Only 1 pending project is allowed at a time — saving a new one overwrites
 * the previous. Entries auto-expire after 7 days.
 */

import type { ProjectPlan } from "@/lib/groq"

const STORAGE_KEY = "forgemancer_pending_project"
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface PendingProjectData {
  name: string
  description: string
  clientName?: string
  dueDate?: string // ISO string
  projectType: string
  techStack: string
  experienceLevel: "beginner" | "intermediate" | "expert"
  projectGoals: string[]
  targetAudience: string
  budget: string
}

interface StoredPendingProject {
  formData: PendingProjectData
  createdAt: number
}

/**
 * Stores pending project data to localStorage with a timestamp.
 * Only 1 pending project is allowed at a time (overwrites previous).
 */
export function savePendingProject(data: PendingProjectData): void {
  try {
    const stored: StoredPendingProject = {
      formData: data,
      createdAt: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    // localStorage may be unavailable (SSR, private browsing, quota exceeded)
    console.warn("Failed to save pending project to localStorage")
  }
}

/**
 * Reads pending project from localStorage.
 * Returns null if expired, missing, or malformed. Auto-cleans expired entries.
 */
export function getPendingProject(): PendingProjectData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const stored: StoredPendingProject = JSON.parse(raw)

    // Check expiry
    if (Date.now() - stored.createdAt > MAX_AGE_MS) {
      clearPendingProject()
      return null
    }

    return stored.formData
  } catch {
    // Malformed data — clean up
    clearPendingProject()
    return null
  }
}

/**
 * Remove the pending project data from localStorage.
 * Called after the project has been successfully saved to the database.
 */
export function clearPendingProject(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage may be unavailable
  }
}

/**
 * Quick boolean check for whether a pending project exists and is not expired.
 */
export function hasPendingProject(): boolean {
  return getPendingProject() !== null
}
