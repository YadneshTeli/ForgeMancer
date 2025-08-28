import { PageTransition } from "@/components/page-transition"
import { ProjectQuestionnaire } from "@/components/project-questionnaire"

export default function NewProjectPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
          <p className="text-muted-foreground">
            Answer a few questions to generate an AI-powered project plan tailored to your needs.
          </p>
        </div>
        <ProjectQuestionnaire />
      </div>
    </PageTransition>
  )
}
