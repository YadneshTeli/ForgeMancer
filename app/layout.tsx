import type React from "react"
import "./globals.css"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

export const metadata = {
  title: "ForgeMancer",
  description: "Plan and manage projects with AI assistance",
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense
            fallback={
              <div className="grid min-h-[60vh] place-items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-3 w-3 animate-pulse rounded-full bg-muted-foreground/60" />
                  <span>Loading...</span>
                </div>
              </div>
            }
          >
            {children}
          </Suspense>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
