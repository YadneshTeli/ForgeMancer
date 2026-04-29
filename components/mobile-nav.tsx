"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Menu, X } from "lucide-react"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Toggle menu</span>
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b shadow-lg p-6 flex flex-col gap-6 animate-in slide-in-from-top-2 md:hidden">
          <nav className="flex flex-col gap-5">
            {["Features", "Pricing", "Testimonials"].map((item) => (
              <Link 
                key={item} 
                href={`#${item.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {item}
              </Link>
            ))}
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)}
              className="text-base font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Login
            </Link>
          </nav>
          <div className="pt-5 border-t border-border/50">
            <Link 
              href="/signup" 
              onClick={() => setIsOpen(false)}
              className="pill-action-primary w-full justify-center !py-3 text-sm"
            >
              Get Started
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
