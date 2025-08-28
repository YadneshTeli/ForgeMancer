"use client"

import type React from "react"

// Simplified version of the use-toast.ts file
import { useState, useEffect } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function generateId() {
  return `${count++}`
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  useEffect(() => {
    const timers = new Map<string, ReturnType<typeof setTimeout>>()

    toasts.forEach((toast) => {
      if (!toast.id) return

      if (timers.has(toast.id)) return

      const timer = setTimeout(() => {
        setToasts((prevToasts) => prevToasts.filter((t) => t.id !== toast.id))
      }, TOAST_REMOVE_DELAY)

      timers.set(toast.id, timer)
    })

    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [toasts])

  function toast({ title, description, variant, action }: Omit<ToastProps, "id">) {
    const id = generateId()

    setToasts((prevToasts) => {
      const newToast = {
        id,
        title,
        description,
        variant,
        action,
      }

      return [...prevToasts, newToast].slice(-TOAST_LIMIT)
    })

    return {
      id,
      dismiss: () => setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id)),
      update: (props: Omit<ToastProps, "id">) => {
        setToasts((prevToasts) => prevToasts.map((t) => (t.id === id ? { ...t, ...props } : t)))
      },
    }
  }

  return {
    toast,
    toasts,
    dismiss: (toastId?: string) => {
      setToasts((prevToasts) => (toastId ? prevToasts.filter((t) => t.id !== toastId) : []))
    },
  }
}
