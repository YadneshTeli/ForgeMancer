import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans, Fira_Code } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
})

const firaCode = Fira_Code({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fira-code",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://forgemancer.vercel.app"),
  title: {
    default: "ForgeMancer - AI-Powered Project Management",
    template: "%s | ForgeMancer",
  },
  description: "ForgeMancer is a premium, AI-powered project management platform designed for modern freelancers and developers. Plan projects, chat with an AI copilot, and generate scope documentation instantly.",
  keywords: [
    "AI project management",
    "project management tool",
    "freelancer organizer",
    "developer copilot",
    "Kanban board",
    "AI documentation generator",
    "ForgeMancer",
    "agile planning"
  ],
  authors: [{ name: "ForgeMancer Team", url: "https://forgemancer.vercel.app" }],
  creator: "ForgeMancer Team",
  publisher: "ForgeMancer",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://forgemancer.vercel.app",
    title: "ForgeMancer - AI-Powered Project Management",
    description: "ForgeMancer is a premium, AI-powered project management platform designed for modern freelancers and developers. Plan projects, chat with an AI copilot, and generate scope documentation instantly.",
    siteName: "ForgeMancer",
  },
  twitter: {
    card: "summary_large_image",
    title: "ForgeMancer - AI-Powered Project Management",
    description: "ForgeMancer is a premium, AI-powered project management platform designed for modern freelancers and developers. Plan projects, chat with an AI copilot, and generate scope documentation & task tracking.",
    creator: "@forgemancer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${plusJakarta.variable} ${firaCode.variable}`}>
      <body className={plusJakarta.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true} disableTransitionOnChange={true}>
          {children}
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
