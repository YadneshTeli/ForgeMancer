import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : dateString
    return format(date, "PPP")
  } catch (error) {
    return "Invalid date"
  }
}
