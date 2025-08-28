import { LoadingSpinner } from "@/components/loading-spinner"

export default function Loading() {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="text-primary" />
        <h2 className="mt-4 text-xl font-semibold">Loading Profile...</h2>
        <p className="mt-2 text-sm text-muted-foreground">Please wait while we load your profile information</p>
      </div>
    </div>
  )
}
