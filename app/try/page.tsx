"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { ProjectQuestionnaire } from "@/components/project-questionnaire"

export default function TryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between p-4">
        <Link href="/" className="flex items-center gap-1">
          <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center">
            <span className="font-bold text-white">F</span>
          </div>
          <span className="font-bold text-xl">ForgeMancer</span>
        </Link>
        <ModeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto w-full max-w-3xl p-6">
          <ProjectQuestionnaire mode="try" />
        </div>
      </div>
    </div>
  )
}
