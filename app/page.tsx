"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { MobileNav } from "@/components/mobile-nav"
import {
  ArrowRight, Bot, Check, Code, FileText, Sparkles,
  Star, Zap, LayoutTemplate, Flame, HelpCircle
} from "lucide-react"

/* ── SVG Company Logo Components ── */
const GitHubIcon = () => (
  <svg className="h-6 w-auto fill-muted-foreground hover:fill-foreground transition-colors duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
)

const StripeIcon = () => (
  <svg className="h-6 w-auto fill-muted-foreground hover:fill-foreground transition-colors duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.962 10.3c0-1.02.816-1.662 2.2-1.662 1.62 0 2.822.584 3.738 1.157L21 7.15c-.943-.7-2.736-1.334-4.838-1.334-3.792 0-6.22 2.05-6.22 5.518 0 5.485 7.525 4.595 7.525 6.966 0 1.214-1.042 1.834-2.616 1.834-1.954 0-3.5-.83-4.48-1.523L9.2 21.365c1.155.93 3.242 1.635 5.632 1.635 4.148 0 6.668-2.023 6.668-5.618 0-5.718-7.538-4.7-7.538-7.082zM0 12.5C0 7 5.176 5.8 7.37 5.8c1.65 0 2.822.455 3.51.9L9.773 9.42c-.523-.332-1.334-.583-2.182-.583-1.636 0-2.48.916-2.48 2.65V23H0V12.5zm10.7-3.4h5.1V5.8h-5.1v3.3z"/>
  </svg>
)

const VercelIcon = () => (
  <svg className="h-5 w-auto fill-muted-foreground hover:fill-foreground transition-colors duration-300" viewBox="0 0 76 65" xmlns="http://www.w3.org/2000/svg">
    <path d="M37.527 0L75.054 65H0L37.527 0Z"/>
  </svg>
)

const SlackIcon = () => (
  <svg className="h-6 w-auto fill-muted-foreground hover:fill-foreground transition-colors duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.823a2.528 2.528 0 0 1-2.52-2.52v-5.042zM18.835 8.835a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522 2.528 2.528 0 0 1-2.522 2.52h-2.52v-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.52 2.522h-5.043a2.528 2.528 0 0 1-2.522-2.522v-5.043a2.528 2.528 0 0 1 2.522-2.52h5.043zM8.823 5.042a2.528 2.528 0 0 1 2.52-2.52 2.528 2.528 0 0 1 2.522 2.52v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.52 2.52H3.78a2.528 2.528 0 0 1-2.52-2.52V8.823a2.528 2.528 0 0 1 2.52-2.52h5.043zM15.165 18.835a2.528 2.528 0 0 1 2.52 2.52 2.528 2.528 0 0 1-2.52 2.522 2.528 2.528 0 0 1-2.522-2.522v-2.52h2.522zm-1.261-1.261a2.528 2.528 0 0 1-2.52 2.52H6.341a2.528 2.528 0 0 1-2.522-2.52v-5.043a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.043z"/>
  </svg>
)

const DiscordIcon = () => (
  <svg className="h-5 w-auto fill-muted-foreground hover:fill-[#5865F2] transition-colors duration-300" viewBox="0 0 127.14 96.36" xmlns="http://www.w3.org/2000/svg">
    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,52.88,6.83,77.19,77.19,0,0,0,49.58,0,105.15,105.15,0,0,0,19.14,8.07C3,32.33-1.63,55.93.42,79.15a107.69,107.69,0,0,0,32,16.21,80.29,80.29,0,0,0,6.77-11A69.1,69.1,0,0,1,28.4,79.15c.87-.64,1.72-1.31,2.54-2a76.88,76.88,0,0,0,65.06,0c.82.69,1.67,1.36,2.54,2a68.59,68.59,0,0,1-10.77,5.22,80.29,80.29,0,0,0,6.77,11,107.69,107.69,0,0,0,32-16.21C129.51,55.93,124.88,32.33,107.7,8.07ZM42.45,65.69C36,65.69,30.7,59.8,30.7,52.61S36,39.53,42.45,39.53,54.2,45.42,54.2,52.61,48.9,65.69,42.45,65.69Zm42,0C78,65.69,72.72,59.8,72.72,52.61S78,39.53,84.47,39.53s11.75,5.89,11.75,13.08S91,65.69,84.47,65.69Z"/>
  </svg>
)

/* ── Elegant Floating Geometric Shapes for Hero ── */
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} backdrop-blur-[2px] border border-white/[0.1] dark:border-white/[0.15] shadow-[0_8px_32px_0_rgba(124,58,237,0.08)]`}
        />
      </motion.div>
    </motion.div>
  )
}

/* ── Reusable check-item for pricing ── */
function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5 text-sm">
      <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
        <Check className="h-3 w-3 text-emerald-500" />
      </div>
      <span className="text-muted-foreground">{children}</span>
    </li>
  )
}

/* ── Features Data with enhanced aesthetics ── */
const features = [
  {
    icon: Bot,
    title: "AI-Assisted Project Creation",
    desc: "Generate production-grade project plans, realistic milestones, and custom timelines in seconds utilizing advanced models.",
    gradient: "from-violet-600/20 to-purple-600/5",
    iconColor: "text-violet-500",
    span: "md:col-span-2 lg:col-span-2",
    featured: true,
  },
  {
    icon: LayoutTemplate,
    title: "Beautiful Templates",
    desc: "Pre-built components and layouts designed to accelerate client deliverables.",
    gradient: "from-blue-600/20 to-indigo-600/5",
    iconColor: "text-blue-500",
    span: "md:col-span-1 lg:col-span-1",
  },
  {
    icon: Code,
    title: "Real-time AI Chat",
    desc: "A developer copilot that reviews code snippets, clarifies stack errors, and suggests structural changes.",
    gradient: "from-emerald-600/20 to-teal-600/5",
    iconColor: "text-emerald-500",
    span: "md:col-span-1 lg:col-span-1",
  },
  {
    icon: FileText,
    title: "Smart Documentation",
    desc: "Instantly create professional design documents, API specifications, and scope-of-work briefs from structured data.",
    gradient: "from-cyan-600/20 to-sky-600/5",
    iconColor: "text-cyan-500",
    span: "md:col-span-2 lg:col-span-2",
  },
  {
    icon: Zap,
    title: "Fast Workflow Engine",
    desc: "No lag, pure speed. Designed to sync seamlessly with Supabase backends for instant operations.",
    gradient: "from-orange-600/20 to-amber-600/5",
    iconColor: "text-orange-500",
    span: "md:col-span-1 lg:col-span-1",
  },
  {
    icon: Check,
    title: "Task Management Board",
    desc: "Clean Kanban layouts designed to visualize progress and keep projects organized.",
    gradient: "from-pink-600/20 to-rose-600/5",
    iconColor: "text-pink-500",
    span: "md:col-span-1 lg:col-span-1",
  }
]

/* ── Testimonials ── */
const testimonials = [
  { name: "Sarah Johnson", role: "Web Developer", initials: "SJ", color: "bg-violet-500/10 text-violet-500 border-violet-500/20", gradient: "from-violet-500/10 to-purple-500/5",
    quote: "ForgeMancer has completely transformed how I manage my freelance projects. The AI assistance saves me hours of work every week.", span: "md:col-span-2" },
  { name: "Michael Chen", role: "UX Designer", initials: "MC", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", gradient: "from-blue-500/10 to-cyan-500/5",
    quote: "The documentation generation feature is a game-changer. I can create professional deliverables in minutes instead of hours.", span: "md:col-span-1" },
  { name: "Emily Rodriguez", role: "Content Creator", initials: "ER", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", gradient: "from-emerald-500/10 to-teal-500/5",
    quote: "I love how the AI chat helps me brainstorm ideas. It's like having experts at my fingertips.", span: "md:col-span-1" },
  { name: "David Kim", role: "Mobile Developer", initials: "DK", color: "bg-orange-500/10 text-orange-500 border-orange-500/20", gradient: "from-orange-500/10 to-amber-500/5",
    quote: "Finally, a tool that understands the freelance lifecycle. The bento dashboard alone makes this my favorite daily driver.", span: "md:col-span-1" },
  { name: "Jessica Alba", role: "UI Designer", initials: "JA", color: "bg-pink-500/10 text-pink-500 border-pink-500/20", gradient: "from-pink-500/10 to-rose-500/5",
    quote: "The design is gorgeous. It feels premium and makes managing client work actually enjoyable.", span: "md:col-span-1" },
  { name: "Robert Fox", role: "SEO Specialist", initials: "RF", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20", gradient: "from-indigo-500/10 to-blue-500/5",
    quote: "I've tried everything. ForgeMancer's AI integration is by far the most cohesive and helpful platform out there.", span: "md:col-span-2" },
]

/* ── Pricing ── */
const plans = [
  { name: "Basic", desc: "For solo freelancers just getting started", price: "$9",
    features: ["5 Active Projects", "Basic AI Chat", "Standard Documentation", "Email Support"],
    cta: "Get Started", highlight: false },
  { name: "Pro", desc: "For growing freelance businesses", price: "$29",
    features: ["Unlimited Projects", "Advanced AI Chat", "Premium Documentation", "Priority Support", "Team Collaboration"],
    cta: "Get Started", highlight: true },
  { name: "Enterprise", desc: "For established freelance agencies", price: "$99",
    features: ["Unlimited Everything", "Custom AI Models", "White-label Documentation", "Dedicated Account Manager", "Priority Support"],
    cta: "Contact Sales", highlight: false },
]

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#faf8ff] text-[#1e1b4b] dark:bg-[#03020a] dark:text-[#f3f0ff] font-sans antialiased selection:bg-primary/20 transition-colors duration-300">
      
      {/* ════════════════════════ HEADER ════════════════════════ */}
      <header className="fixed inset-x-0 top-0 z-50 w-full border-b border-[#7c3aed]/10 bg-[#faf8ff]/80 backdrop-blur-xl dark:bg-[#03020a]/80 supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center glow-sm transition-transform duration-300 group-hover:scale-105">
                <Flame className="h-4.5 w-4.5 text-white" fill="currentColor" strokeWidth={1} />
              </div>
              <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">ForgeMancer</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {["Features", "Pricing", "Testimonials"].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:scale-102 transition-all cursor-pointer">
                {item}
              </Link>
            ))}
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:scale-102 transition-all cursor-pointer">
              Login
            </Link>
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <ModeToggle />
            <Link href="/try" className="hidden md:inline-flex pill-action-primary text-xs px-4 py-2 whitespace-nowrap">
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ════════════════════════ HERO (GEOMETRIC & ANIMATED) ════════════════════════ */}
        <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden pt-20">
          {/* Ambient orbs */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/[0.05] via-transparent to-[#10b981]/[0.03] dark:from-[#7c3aed]/[0.08] dark:to-[#10b981]/[0.05] blur-3xl pointer-events-none" />
          <div className="absolute inset-0 dot-pattern opacity-15 pointer-events-none" />

          {/* Floating Shape Backgrounds (Kokonut UI Elegant Shapes) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <ElegantShape
              delay={0.2}
              width={500}
              height={120}
              rotate={12}
              gradient="from-violet-500/[0.15] dark:from-violet-500/[0.12]"
              className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
            />
            <ElegantShape
              delay={0.4}
              width={400}
              height={100}
              rotate={-15}
              gradient="from-emerald-500/[0.12] dark:from-emerald-500/[0.08]"
              className="right-[-5%] md:right-[2%] top-[60%] md:top-[65%]"
            />
            <ElegantShape
              delay={0.3}
              width={250}
              height={70}
              rotate={-8}
              gradient="from-indigo-500/[0.15] dark:from-indigo-500/[0.12]"
              className="left-[5%] md:left-[10%] bottom-[8%] md:bottom-[12%]"
            />
          </div>

          <div className="container relative z-10 px-4 md:px-6 py-12">
            <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:gap-16 xl:grid-cols-[1fr_520px] items-center">
              
              {/* Left Column: Headline and Call-To-Action */}
              <div className="flex flex-col justify-center space-y-8 text-center lg:text-left">
                {/* Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 self-center lg:self-start rounded-full border border-violet-500/10 dark:border-violet-500/20 bg-violet-500/5 px-3.5 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-md"
                >
                  <Sparkles className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 font-semibold uppercase tracking-wider">
                    Next-Gen Project Management
                  </span>
                </motion.div>

                <div className="space-y-4">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/[1.1] text-glow leading-tight"
                  >
                    Forge Your Projects with{" "}
                    <span className="gradient-text-warm bg-gradient-to-r from-[#7c3aed] via-[#d946ef] to-[#f43f5e] dark:from-[#9f7aea] dark:via-[#f472b6] dark:to-[#fb7185] bg-clip-text text-transparent">AI Magic</span>
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-[540px] mx-auto lg:mx-0 text-muted-foreground text-base md:text-lg leading-relaxed"
                  >
                    Manage projects, interact with a real-time developer copilot, and generate client-ready documentation dynamically. Engineered for modern freelancers.
                  </motion.p>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex flex-col gap-4 min-[400px]:flex-row justify-center lg:justify-start"
                >
                  <Link href="/try" className="pill-action-primary group text-base px-6 py-3 cursor-pointer">
                    Create Your First Project
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href="#features" className="pill-action text-base px-6 py-3 bg-white dark:bg-[#110f1c] hover:bg-muted/30 border border-[#7c3aed]/10 cursor-pointer">
                    Explore Features
                  </Link>
                </motion.div>

                {/* Social proof */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-muted/50 justify-center lg:justify-start"
                >
                  <div className="flex -space-x-3">
                    {["SJ", "MC", "ER", "DK"].map((init, i) => {
                      const colors = [
                        "bg-violet-500 text-white",
                        "bg-blue-500 text-white",
                        "bg-emerald-500 text-white",
                        "bg-orange-500 text-white"
                      ]
                      return (
                        <div key={init}
                          className={`h-10 w-10 rounded-full border-2 border-[#faf8ff] dark:border-[#03020a] ${colors[i]} flex items-center justify-center text-xs font-bold shadow-md`}>
                          {init}
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-center sm:text-left text-sm">
                    <div className="flex justify-center sm:justify-start items-center gap-1 mb-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400 drop-shadow-sm" />
                      ))}
                    </div>
                    <span className="text-muted-foreground font-medium">Loved by 1,000+ freelance creators</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Premium AI Chat Mockup */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -inset-1.5 bg-gradient-to-tr from-[#7c3aed]/20 to-[#10b981]/20 rounded-[2.5rem] blur-2xl opacity-40 dark:opacity-60 pointer-events-none" />
                <div className="glass-glow rounded-[2rem] shadow-2xl relative overflow-hidden bg-white/70 dark:bg-[#090812]/75 border border-[#7c3aed]/15 dark:border-white/10">
                  {/* macOS header */}
                  <div className="h-12 border-b border-black/5 dark:border-white/5 flex items-center px-6 bg-[#7c3aed]/5 justify-between">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                      <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground/80 tracking-widest uppercase">Forge AI Copilot</span>
                    <div className="w-12" />
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center shadow-md">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <span className="font-bold text-sm tracking-tight">ForgeMancer AI</span>
                          <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                            <span className="text-[10px] text-muted-foreground font-semibold">ONLINE</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 font-sans">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 border border-violet-500/20 flex items-center justify-center shrink-0 shadow-sm">
                          <Bot className="h-4 w-4 text-violet-500 dark:text-violet-400" />
                        </div>
                        <div className="bg-white dark:bg-[#110f1c]/90 border border-black/5 dark:border-white/5 shadow-sm p-4 rounded-2xl rounded-tl-sm max-w-[85%]">
                          <p className="text-xs md:text-sm leading-relaxed">How can I help with your project architecture today?</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 justify-end">
                        <div className="gradient-bg p-4 rounded-2xl rounded-tr-sm max-w-[85%] glow-sm shadow-md text-white font-medium">
                          <p className="text-xs md:text-sm">I need to build a SaaS dashboard structure with real-time analytics.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg bg-violet-500/10 dark:bg-violet-500/20 border border-violet-500/20 flex items-center justify-center shrink-0 shadow-sm">
                          <Bot className="h-4 w-4 text-violet-500 dark:text-violet-400" />
                        </div>
                        <div className="bg-white dark:bg-[#110f1c]/90 border border-black/5 dark:border-white/5 shadow-sm p-4 rounded-2xl rounded-tl-sm max-w-[85%]">
                          <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                            I&apos;ve mapped out a bento-style layouts system and added custom database schemas to your plan:
                          </p>
                          <div className="flex gap-2 mt-3.5">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                              <LayoutTemplate className="h-3 w-3 text-emerald-500" />
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Plan Ready</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════════════════ BRAND LOGO CLOUD ════════════════════════ */}
        <section className="py-12 border-t border-[#7c3aed]/10 bg-white/30 dark:bg-[#07050f]/30 backdrop-blur-sm">
          <div className="container">
            <p className="text-center text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-8">
              Empowering developers from around the globe
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16 opacity-60 dark:opacity-50">
              <GitHubIcon />
              <StripeIcon />
              <VercelIcon />
              <SlackIcon />
              <DiscordIcon />
            </div>
          </div>
        </section>

        {/* ════════════════════════ FEATURES (BENTO GRID) ════════════════════════ */}
        <section id="features" className="relative w-full py-20 border-t border-[#7c3aed]/10 bg-[#faf8ff] dark:bg-[#03020a]">
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full opacity-[0.03] blur-3xl pointer-events-none bg-[#7c3aed]" />
          
          <div className="container relative">
            <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/10 dark:border-violet-500/20 bg-violet-500/5 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-widest shadow-sm">
                <Zap className="h-3 w-3 text-violet-500" />
                <span className="text-violet-600 dark:text-violet-400">Features</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-glow leading-tight">
                Everything You Need
              </h2>
              <p className="max-w-[600px] text-muted-foreground text-sm sm:text-base leading-relaxed">
                ForgeMancer combines AI-powered project orchestration with task boards, providing freelancers with unmatched efficiency.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {features.map((feat, i) => (
                <div 
                  key={feat.title} 
                  className={`glass-card group p-6 hover-scale relative overflow-hidden flex flex-col justify-between border border-[#7c3aed]/10 dark:border-white/5 bg-white/50 dark:bg-[#090812]/50 ${feat.span}`}
                >
                  {/* Subtle hover gradient glows */}
                  <div className={`absolute -right-16 -top-16 w-52 h-52 bg-gradient-to-br ${feat.gradient} blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`} />
                  
                  <div className="relative z-10 space-y-4">
                    {feat.featured && (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-2.5 py-0.5 text-[10px] font-bold text-violet-500 dark:text-violet-400 border border-violet-500/20">
                        <Sparkles className="h-2.5 w-2.5" />
                        AI Power
                      </div>
                    )}

                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center border border-[#7c3aed]/15 shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                      <feat.icon className={`h-5 w-5 ${feat.iconColor}`} />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold tracking-tight">{feat.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                  
                  <div className={`mt-6 flex items-center gap-1.5 text-xs font-semibold ${feat.iconColor} opacity-80 group-hover:opacity-100 transition-all cursor-pointer`}>
                    Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════ TESTIMONIALS ════════════════════════ */}
        <section id="testimonials" className="relative w-full py-20 border-t border-[#7c3aed]/10 bg-white dark:bg-[#06050e]">
          <div className="absolute left-0 top-1/2 w-[500px] h-[500px] rounded-full opacity-[0.02] blur-3xl pointer-events-none bg-blue-500 -translate-y-1/2" />
          
          <div className="container relative">
            <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/10 dark:border-violet-500/20 bg-violet-500/5 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-widest shadow-sm">
                <Star className="h-3 w-3 text-amber-500" />
                <span className="text-violet-600 dark:text-violet-400">Testimonials</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-glow leading-tight">
                Client Success Stories
              </h2>
              <p className="max-w-[600px] text-muted-foreground text-sm sm:text-base leading-relaxed">
                See how independent creators and development squads utilize ForgeMancer to skyrocket their deliverability.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div 
                  key={t.name} 
                  className={`glass-card p-6 flex flex-col justify-between ${t.span} group relative overflow-hidden border border-[#7c3aed]/10 dark:border-white/5 bg-[#faf8ff]/50 dark:bg-[#090812]/50 hover-scale`}
                >
                  <div className={`absolute -right-16 -bottom-16 w-52 h-52 bg-gradient-to-tl ${t.gradient} blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none`} />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm font-medium leading-relaxed italic text-foreground/90">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-muted/50 relative z-10 mt-6">
                    <div className={`h-8 w-8 rounded-full ${t.color} border flex items-center justify-center shadow-inner`}>
                      <span className="text-[10px] font-bold tracking-wider">{t.initials}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm tracking-tight">{t.name}</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════ PRICING ════════════════════════ */}
        <section id="pricing" className="relative w-full py-24 border-t border-[#7c3aed]/10 bg-[#faf8ff] dark:bg-[#03020a]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03] blur-3xl pointer-events-none bg-violet-600" />
          
          <div className="container relative">
            <div className="flex flex-col items-center justify-center text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/10 dark:border-violet-500/20 bg-violet-500/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                <span className="text-violet-600 dark:text-violet-400">Pricing</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-glow leading-tight">
                Simple, Transparent Plans
              </h2>
              <p className="max-w-[600px] text-muted-foreground text-sm sm:text-base leading-relaxed">
                No surprises. Start scaling your client operations on your terms.
              </p>

              {/* Monthly / Annual Toggle */}
              <div className="flex items-center gap-3 pt-6">
                <span className={`text-xs font-bold ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
                <button 
                  onClick={() => setIsAnnual(!isAnnual)}
                  className="w-11 h-6 rounded-full bg-violet-200 dark:bg-violet-950/50 p-0.5 border border-violet-500/20 flex items-center relative transition-colors cursor-pointer"
                >
                  <motion.div 
                    layout
                    className="h-4.5 w-4.5 rounded-full bg-violet-600"
                    animate={{ x: isAnnual ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
                <span className={`text-xs font-bold ${isAnnual ? "text-foreground" : "text-muted-foreground"} flex items-center gap-1.5`}>
                  Yearly
                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full uppercase">Save 20%</span>
                </span>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 items-center">
              {plans.map((plan, i) => {
                const basePrice = parseInt(plan.price.replace("$", ""))
                const displayPrice = isAnnual ? `$${Math.round(basePrice * 12 * 0.8)}` : plan.price
                const displayPeriod = isAnnual ? "/yr" : "/mo"

                return (
                  <div 
                    key={plan.name}
                    className={`glass-card p-8 hover-scale transition-all duration-300 relative border ${
                      plan.highlight 
                        ? "border-violet-500 shadow-xl shadow-violet-500/10 bg-white/80 dark:bg-[#0d0a1c]/80 scale-105 z-10" 
                        : "border-[#7c3aed]/10 dark:border-white/5 bg-white/50 dark:bg-[#090812]/50"
                    }`}
                  >
                    {plan.highlight && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 gradient-bg text-white px-4 py-1 rounded-full text-[10px] font-extrabold tracking-widest shadow-lg uppercase">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-bold tracking-tight">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed min-h-[32px]">{plan.desc}</p>
                    </div>
                    
                    <div className="mb-6 pb-6 border-b border-muted/50">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold tracking-tight">{displayPrice}</span>
                        <span className="text-muted-foreground text-xs font-semibold">{displayPeriod}</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-3.5 mb-8 min-h-[180px]">
                      {plan.features.map((f) => (
                        <CheckItem key={f}>{f}</CheckItem>
                      ))}
                    </ul>
                    
                    {plan.highlight ? (
                      <Link href="/signup" className="pill-action-primary w-full justify-center py-2.5 text-xs font-bold shadow-lg shadow-violet-500/20">
                        {plan.cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <Button className="w-full rounded-full py-5 text-xs font-semibold border-[#7c3aed]/20" variant={plan.name === "Enterprise" ? "outline" : "secondary"} asChild>
                        <Link href={plan.name === "Enterprise" ? "#" : "/signup"}>
                          {plan.cta}
                        </Link>
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ════════════════════════ FINAL CTA ════════════════════════ */}
        <section className="relative w-full py-20 overflow-hidden border-t border-[#7c3aed]/10 bg-white dark:bg-[#06050e]">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 dark:from-violet-950/20 dark:to-indigo-950/20 pointer-events-none" />
          <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />
          
          <div className="container relative">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/15 bg-violet-500/5 px-4.5 py-1.5 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-violet-500" />
                Start Creating Free
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl max-w-2xl text-glow leading-tight">
                Ready to Supercharge Your Freelance Business?
              </h2>
              <p className="max-w-[600px] text-muted-foreground text-sm sm:text-base leading-relaxed">
                Create a detailed project blueprint using our state-of-the-art AI assistant, manage tasks, and organize scopes instantly.
              </p>
              <div className="flex flex-col gap-4 min-[400px]:flex-row pt-4">
                <Link href="/try" className="pill-action-primary text-base px-6 py-3 cursor-pointer">
                  Start Building Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="#features" className="pill-action text-base px-6 py-3 bg-white dark:bg-[#110f1c] hover:bg-muted/30 border border-[#7c3aed]/15 cursor-pointer">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ════════════════════════ FOOTER ════════════════════════ */}
      <footer className="w-full bg-[#faf8ff] dark:bg-[#03020a] border-t border-[#7c3aed]/10 py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center shadow-sm">
                  <Flame className="h-4.5 w-4.5 text-white" fill="currentColor" strokeWidth={1} />
                </div>
                <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">ForgeMancer</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                AI-powered plan configuration and task orchestration created specifically for autonomous developers.
              </p>
            </div>
            {[
              { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Pricing", href: "#pricing" }] },
              { title: "Resources", links: [{ label: "Documentation", href: "#" }, { label: "Guides", href: "#" }] },
              { title: "Company", links: [{ label: "About", href: "#" }, { label: "Blog", href: "#" }] },
            ].map((col) => (
              <div key={col.title} className="space-y-4">
                <h4 className="text-sm font-bold tracking-wider uppercase text-foreground/80">{col.title}</h4>
                <ul className="space-y-2.5 text-sm text-muted-foreground">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-primary font-medium transition-colors cursor-pointer">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-[#7c3aed]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            <p>© {new Date().getFullYear()} ForgeMancer. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
