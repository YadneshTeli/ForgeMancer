import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  bio: z.string().optional(),
  profession: z.string().optional(),
  skills: z.array(z.string()).optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
})

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  clientName: z.string().optional(),
  projectType: z.string().min(1, "Project type is required"),
  techStack: z.array(z.string()).min(1, "At least one technology is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
  dueDate: z.date().optional(),
})

export const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  status: z.string().default("To Do"),
  priority: z.string().default("Medium"),
  dueDate: z.date().optional(),
  assignedTo: z.string().optional(),
})
