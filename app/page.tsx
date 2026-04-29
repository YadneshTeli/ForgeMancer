import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { MobileNav } from "@/components/mobile-nav"
import {
  ArrowRight, Bot, Check, Code, FileText, Github,
  Linkedin, Sparkles, Star, Twitter, Zap, LayoutTemplate, Flame,
  Globe, Cpu, BarChart, Code2, Smartphone
} from "lucide-react"

/* ── Tiny reusable check-item ── */
function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2.5 text-sm">
      <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
        <Check className="h-3 w-3 text-primary" />
      </div>
      <span className="text-muted-foreground">{children}</span>
    </li>
  )
}

/* ── Feature card data ── */
type FeatureCard = {
  icon: any;
  title: string;
  desc: string;
  gradient: string;
  iconColor: string;
  span: string;
  featured?: boolean;
  list?: string[];
  stats?: { value: string; label: string };
};

const features: FeatureCard[] = [
  {
    icon: Bot,
    title: "AI-Assisted Project Creation",
    desc: "Generate project plans, timelines, and documentation with AI assistance.",
    gradient: "from-violet-500/20 to-purple-500/5",
    iconColor: "text-violet-500",
    span: "md:col-span-2 lg:col-span-2",
    featured: true,
  },
  {
    icon: LayoutTemplate,
    title: "Beautiful Templates",
    desc: "Start with pre-built, stunning project templates to accelerate development.",
    gradient: "from-blue-500/20 to-blue-500/5",
    iconColor: "text-blue-500",
    span: "md:col-span-1 lg:col-span-1",
  },
  {
    icon: Code,
    title: "Real-time AI Interactions",
    desc: "Chat with AI assistants to solve problems in real-time.",
    gradient: "from-emerald-500/20 to-emerald-500/5",
    iconColor: "text-emerald-500",
    span: "md:col-span-1 lg:col-span-1",
  },
  {
    icon: FileText,
    title: "Smart Documentation",
    desc: "Automatically create professional documentation from your project data.",
    gradient: "from-cyan-500/20 to-cyan-500/5",
    iconColor: "text-cyan-500",
    span: "md:col-span-2 lg:col-span-2",
  },
  {
    icon: Zap,
    title: "Fast Workflow",
    desc: "Optimized for extreme speed and efficiency.",
    gradient: "from-orange-500/20 to-orange-500/5",
    iconColor: "text-orange-500",
    span: "md:col-span-1 lg:col-span-1",
  },
  {
    icon: Check,
    title: "Task Management",
    desc: "Track progress effortlessly with built-in native task boards.",
    gradient: "from-pink-500/20 to-pink-500/5",
    iconColor: "text-pink-500",
    span: "md:col-span-1 lg:col-span-1",
  }
]

/* ── Testimonial data ── */
const testimonials = [
  { name: "Sarah Johnson", role: "Web Developer", initials: "SJ", color: "bg-violet-500/15 text-violet-500 border-violet-500/20", gradient: "from-violet-500/20 to-purple-500/5",
    quote: "ForgeMancer has completely transformed how I manage my freelance projects. The AI assistance saves me hours of work every week.", span: "md:col-span-2 lg:col-span-2" },
  { name: "Michael Chen", role: "UX Designer", initials: "MC", color: "bg-blue-500/15 text-blue-500 border-blue-500/20", gradient: "from-blue-500/20 to-cyan-500/5",
    quote: "The documentation generation feature is a game-changer. I can create professional deliverables in minutes instead of hours.", span: "md:col-span-1 lg:col-span-1" },
  { name: "Emily Rodriguez", role: "Content Creator", initials: "ER", color: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20", gradient: "from-emerald-500/20 to-teal-500/5",
    quote: "I love how the AI chat helps me brainstorm ideas. It's like having experts at my fingertips.", span: "md:col-span-1 lg:col-span-1" },
  { name: "David Kim", role: "Mobile Developer", initials: "DK", color: "bg-orange-500/15 text-orange-500 border-orange-500/20", gradient: "from-orange-500/20 to-amber-500/5",
    quote: "Finally, a tool that understands the freelance lifecycle. The bento dashboard alone makes this my favorite daily driver.", span: "md:col-span-1 lg:col-span-1" },
  { name: "Jessica Alba", role: "UI Designer", initials: "JA", color: "bg-pink-500/15 text-pink-500 border-pink-500/20", gradient: "from-pink-500/20 to-rose-500/5",
    quote: "The design is gorgeous. It feels premium and makes managing client work actually enjoyable.", span: "md:col-span-1 lg:col-span-1" },
  { name: "Robert Fox", role: "SEO Specialist", initials: "RF", color: "bg-indigo-500/15 text-indigo-500 border-indigo-500/20", gradient: "from-indigo-500/20 to-blue-500/5",
    quote: "I've tried everything. ForgeMancer's AI integration is by far the most cohesive and helpful platform out there.", span: "md:col-span-2 lg:col-span-2" },
]

/* ── Pricing data ── */
const plans = [
  { name: "Basic", desc: "For solo freelancers just getting started", price: "$9",
    features: ["5 Active Projects", "Basic AI Chat", "Standard Documentation"],
    cta: "Get Started", highlight: false },
  { name: "Pro", desc: "For growing freelance businesses", price: "$29",
    features: ["Unlimited Projects", "Advanced AI Chat", "Premium Documentation", "Team Collaboration"],
    cta: "Get Started", highlight: true },
  { name: "Enterprise", desc: "For established freelance agencies", price: "$99",
    features: ["Unlimited Everything", "Custom AI Models", "White-label Documentation", "Priority Support"],
    cta: "Contact Sales", highlight: false },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      {/* ════════════════════════ HEADER ════════════════════════ */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center glow-sm">
                <Flame className="h-4 w-4 text-white" fill="currentColor" strokeWidth={1} />
              </div>
              <span className="font-bold text-xl tracking-tight">ForgeMancer</span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {["Features", "Pricing", "Testimonials"].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                {item}
              </Link>
            ))}
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <ModeToggle />
            <Link href="/signup" className="!hidden md:!inline-flex pill-action-primary text-xs px-4 py-2 whitespace-nowrap">
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ════════════════════════ HERO ════════════════════════ */}
        <section className="relative w-full py-16 md:py-28 lg:py-36 xl:py-48">
          {/* Ambient orbs */}
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.08] blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(124,58,237,0.8), rgba(99,102,241,0.4), transparent)" }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.06] blur-3xl pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(129,140,248,0.6), transparent)" }} />
          <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />

          <div className="container relative px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-16 xl:grid-cols-[1fr_520px]">
              <div className="flex flex-col justify-center space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 self-start rounded-full border glass px-3.5 py-1.5 text-xs font-medium animate-fade-in shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500 font-semibold">AI-Powered Project Management</span>
                </div>

                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl/[1.1] text-glow animate-fade-in stagger-1">
                    Forge Your Projects with{" "}
                    <span className="gradient-text-warm">AI Magic</span>
                  </h1>
                  <p className="max-w-[540px] text-muted-foreground text-base md:text-lg leading-relaxed animate-fade-in stagger-2">
                    Manage projects, communicate with AI, and generate documentation
                    dynamically. Built for freelancers who move fast.
                  </p>
                </div>

                <div className="flex flex-col gap-4 min-[400px]:flex-row animate-fade-in stagger-3">
                  <Link href="/signup" className="pill-action-primary group text-base px-6 py-3">
                    Get Started for Free
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link href="#features" className="pill-action text-base px-6 py-3 bg-background hover:bg-muted/50">
                    Learn More
                  </Link>
                </div>

                {/* Social proof */}
                <div className="flex items-center gap-4 pt-4 animate-fade-in stagger-4 border-t border-border/50">
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
                          className={`h-10 w-10 rounded-full border-2 border-background ${colors[i]} flex items-center justify-center text-xs font-bold shadow-sm`}>
                          {init}
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center gap-1 mb-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400 drop-shadow-sm" />
                      ))}
                    </div>
                    <span className="text-muted-foreground font-medium">Loved by 1,000+ freelancers</span>
                  </div>
                </div>
              </div>

              {/* Hero chat preview */}
              <div className="hidden lg:block animate-fade-in stagger-3 relative">
                <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-indigo-500/20 rounded-[2rem] blur-xl opacity-50" />
                <div className="glass-glow rounded-[1.5rem] shadow-2xl relative overflow-hidden">
                  {/* Fake macOS header */}
                  <div className="h-12 border-b border-white/5 flex items-center px-4 bg-muted/20">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                      <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl gradient-bg flex items-center justify-center shadow-inner">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <span className="font-semibold text-sm">Forge AI Assistant</span>
                          <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                            <span className="text-xs text-muted-foreground font-medium">Online & Ready</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center shrink-0 shadow-sm">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-card border shadow-sm p-4 rounded-2xl rounded-tl-sm max-w-[85%]">
                          <p className="text-sm leading-relaxed">How can I help with your project today?</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 justify-end">
                        <div className="gradient-bg-vivid p-4 rounded-2xl rounded-tr-sm max-w-[85%] glow-sm shadow-md">
                          <p className="text-sm text-white font-medium">I need to create a project plan for a new e-commerce website.</p>
                        </div>
                        <div className="h-8 w-8 rounded-lg bg-secondary border flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold">YOU</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center shrink-0 shadow-sm">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-card border shadow-sm p-4 rounded-2xl rounded-tl-sm max-w-[85%]">
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            I&apos;ll help you create a comprehensive project plan. Let me generate a
                            template with milestones, tasks, and timelines...
                          </p>
                          <div className="flex gap-2 mt-4">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
                              <LayoutTemplate className="h-3 w-3 text-primary" />
                              <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">Plan Generated</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════ FEATURES ════════════════════════ */}
        <section id="features" className="relative w-full py-12 md:py-20 min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden border-t">
          <div className="absolute inset-0 bg-muted/30 pointer-events-none" />
          <div className="absolute right-0 top-1/4 w-[500px] h-[500px] rounded-full opacity-[0.03] blur-3xl pointer-events-none bg-primary" />
          
          <div className="container relative px-4 md:px-6 w-full">
            <div className="flex flex-col items-center justify-center space-y-2 text-center mb-6 md:mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-[10px] font-medium animate-fade-in shadow-sm">
                <Zap className="h-3 w-3 text-primary" />
                <span className="text-foreground">Features</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl text-glow animate-fade-in stagger-1">
                Everything You Need
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-lg animate-fade-in stagger-2">
                ForgeMancer combines AI-powered tools with project management to streamline your freelance workflow.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-fr">
              {features.map((feat, i) => (
                <div key={feat.title} className={`glass-card group p-4 md:p-5 animate-fade-in stagger-${i + 1} ${feat.span} relative overflow-hidden flex flex-col items-start border border-white/5`}>
                  {/* Subtle color glows */}
                  <div className={`absolute -right-10 -top-10 w-48 h-48 bg-gradient-to-br ${feat.gradient} blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${feat.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`} />
                  
                  {feat.featured && (
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-400 ring-1 ring-inset ring-violet-500/20 relative z-10">
                      <Sparkles className="h-2.5 w-2.5" />
                      Featured
                    </div>
                  )}

                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-3 md:mb-4 ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-300 relative z-10`}>
                    <feat.icon className={`h-4 w-4 ${feat.iconColor}`} />
                  </div>
                  
                  <h3 className="text-base md:text-lg font-bold mb-1.5 md:mb-2 tracking-tight relative z-10">{feat.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed relative z-10 flex-grow mb-3 md:mb-4">{feat.desc}</p>
                  
                  {feat.list && (
                    <ul className="w-full space-y-1.5 mb-4 relative z-10">
                      {feat.list.map((item) => (
                        <li key={item} className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
                          <Check className={`h-3 w-3 ${feat.iconColor} shrink-0`} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {feat.stats && (
                    <div className="w-full rounded-lg border border-white/5 bg-background/50 backdrop-blur-sm p-3 mb-4 relative z-10">
                      <div className="text-xl md:text-2xl font-bold">{feat.stats.value}</div>
                      <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{feat.stats.label}</div>
                    </div>
                  )}

                  <div className={`mt-auto flex items-center gap-1.5 text-sm font-medium ${feat.iconColor} relative z-10 opacity-80 group-hover:opacity-100 group-hover:gap-2 transition-all cursor-pointer`}>
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════ TESTIMONIALS ════════════════════════ */}
        <section id="testimonials" className="relative w-full py-12 md:py-20 min-h-[calc(100vh-4rem)] flex items-center justify-center border-t">
          <div className="absolute left-0 top-1/2 w-[600px] h-[600px] rounded-full opacity-[0.02] blur-3xl pointer-events-none bg-blue-500 -translate-y-1/2" />
          
          <div className="container relative px-4 md:px-6 w-full">
            <div className="flex flex-col items-center justify-center space-y-2 text-center mb-6 md:mb-8">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-[10px] font-medium animate-fade-in shadow-sm">
                <Star className="h-3 w-3 text-amber-500" />
                <span className="text-foreground">Testimonials</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl text-glow animate-fade-in stagger-1">
                What Our Users Say
              </h2>
              <p className="max-w-[600px] text-xs md:text-sm text-muted-foreground animate-fade-in stagger-2">
                Hear from freelancers who have transformed their workflow with ForgeMancer.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 auto-rows-fr">
              {testimonials.map((t, i) => (
                <div key={t.name} className={`glass-card p-3 md:p-4 animate-fade-in stagger-${i + 1} flex flex-col justify-between ${t.span} group relative overflow-hidden border border-white/5`}>
                  {/* Subtle color glows */}
                  <div className={`absolute -right-10 -bottom-10 w-48 h-48 bg-gradient-to-tl ${t.gradient} blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none`} />

                  <div className="relative z-10">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400 drop-shadow-sm" />
                      ))}
                    </div>
                    <p className="text-xs md:text-sm font-medium text-foreground leading-relaxed mb-3">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-border/50 relative z-10 mt-auto">
                    <div className={`h-8 w-8 rounded-full ${t.color} border flex items-center justify-center shadow-inner`}>
                      <span className="text-[10px] font-bold tracking-wider">{t.initials}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs md:text-sm tracking-tight">{t.name}</h4>
                      <p className="text-[10px] md:text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════ PRICING ════════════════════════ */}
        <section id="pricing" className="relative w-full py-20 md:py-32 overflow-hidden border-t">
          <div className="absolute inset-0 bg-muted/20 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03] blur-3xl pointer-events-none bg-primary" />
          
          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3.5 py-1.5 text-xs font-medium animate-fade-in shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-foreground">Pricing</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-glow animate-fade-in stagger-1">
                Simple, Transparent Pricing
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-lg animate-fade-in stagger-2">
                Choose the plan that works best for your freelance business.
              </p>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 items-center">
              {plans.map((plan, i) => (
                <div key={plan.name}
                  className={`glass-card p-8 animate-fade-in stagger-${i + 1} transition-all duration-300 !overflow-visible ${
                    plan.highlight 
                      ? "ring-2 ring-primary shadow-2xl shadow-primary/20 scale-105 z-10" 
                      : "hover:-translate-y-1 hover:shadow-xl z-0"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 gradient-bg text-white px-5 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-lg glow-sm whitespace-nowrap">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-2xl font-extrabold tracking-tight">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed h-10">{plan.desc}</p>
                  </div>
                  <div className="mb-8 pb-8 border-b border-border/50">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                      <span className="text-muted-foreground text-sm font-medium">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-4 mb-8 min-h-[160px]">
                    {plan.features.map((f) => (
                      <CheckItem key={f}>{f}</CheckItem>
                    ))}
                  </ul>
                  {plan.highlight ? (
                    <Link href="/signup" className="pill-action-primary w-full justify-center py-6 text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40">
                      {plan.cta}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  ) : (
                    <Button className="w-full rounded-full py-6 text-base font-semibold" variant={plan.name === "Enterprise" ? "outline" : "secondary"} asChild>
                      <Link href={plan.name === "Enterprise" ? "#" : "/signup"}>
                        {plan.cta}
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════ CTA ════════════════════════ */}
        <section className="relative w-full py-24 md:py-32 lg:py-40 overflow-hidden">
          <div className="absolute inset-0 gradient-bg-vivid animate-gradient" />
          <div className="absolute inset-0 dot-pattern opacity-20 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-px bg-white/20" />
          
          <div className="container relative px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-8 text-center text-white">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md shadow-lg">
                <Sparkles className="h-4 w-4" />
                Start Building Today
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-3xl drop-shadow-md">
                Ready to Transform Your Workflow?
              </h2>
              <p className="max-w-[700px] text-white/90 md:text-xl font-medium drop-shadow">
                Join thousands of freelancers who are saving time and delivering better results with ForgeMancer.
              </p>
              <div className="flex flex-col gap-4 min-[400px]:flex-row pt-4">
                <Button size="lg" asChild className="rounded-full px-8 py-6 text-base font-bold bg-white text-primary hover:bg-white/90 shadow-xl">
                  <Link href="/signup">
                    Get Started for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline"
                  className="rounded-full border-2 border-white/30 bg-transparent text-white hover:bg-white/10 px-8 py-6 text-base font-bold backdrop-blur-sm" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ════════════════════════ FOOTER ════════════════════════ */}
      <footer className="w-full bg-background border-t py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center shadow-sm">
                  <Flame className="h-4 w-4 text-white" fill="currentColor" strokeWidth={1} />
                </div>
                <span className="font-bold text-xl tracking-tight">ForgeMancer</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                AI-Powered Project Management designed exclusively for freelancers and independent creators.
              </p>
              <div className="flex gap-3 pt-2">
                {[
                  { icon: Twitter, label: "Twitter" },
                  { icon: Github, label: "GitHub" },
                  { icon: Linkedin, label: "LinkedIn" },
                ].map(({ icon: Icon, label }) => (
                  <Link key={label} href="#"
                    className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{label}</span>
                  </Link>
                ))}
              </div>
            </div>
            {[
              { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Pricing", href: "#pricing" }, { label: "Roadmap", href: "#" }] },
              { title: "Resources", links: [{ label: "Documentation", href: "#" }, { label: "Guides", href: "#" }, { label: "Support", href: "#" }] },
              { title: "Company", links: [{ label: "About", href: "#" }, { label: "Blog", href: "#" }, { label: "Careers", href: "#" }] },
            ].map((col) => (
              <div key={col.title} className="space-y-5">
                <h4 className="text-sm font-bold tracking-wider uppercase text-foreground">{col.title}</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="hover:text-primary font-medium transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-medium">
            <p>© {new Date().getFullYear()} ForgeMancer. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
