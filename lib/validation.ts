import { z } from 'zod'

// Item validation schemas
export const itemSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  
  category: z.string()
    .min(1, 'Please select a category'),
  
  location: z.string()
    .min(1, 'Please specify a location'),
  
  date: z.string()
    .min(1, 'Please select a date'),
  
  contactInfo: z.string()
    .optional(),
  
  imageUrl: z.string()
    .url('Invalid image URL')
    .optional()
})

export const lostItemSchema = itemSchema.extend({
  status: z.literal('lost')
})

export const foundItemSchema = itemSchema.extend({
  status: z.literal('found')
})

// User validation schemas
export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address'),
  
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
})

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  
  email: z.string()
    .email('Invalid email address'),
  
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  confirmPassword: z.string(),
  
  department: z.string()
    .min(1, 'Please select your department'),
  
  role: z.enum(['student', 'staff'])
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

// Feedback validation
export const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'general']),
  
  subject: z.string()
    .min(5, 'Subject must be at least 5 characters')
    .max(100, 'Subject must be less than 100 characters'),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  
  email: z.string()
    .email('Invalid email address')
    .optional()
})

// Validation helper functions
export function validateItem(data: unknown, type: 'lost' | 'found') {
  const schema = type === 'lost' ? lostItemSchema : foundItemSchema
  return schema.safeParse(data)
}

export function validateLogin(data: unknown) {
  return loginSchema.safeParse(data)
}

export function validateRegister(data: unknown) {
  return registerSchema.safeParse(data)
}

export function validateFeedback(data: unknown) {
  return feedbackSchema.safeParse(data)
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove potentially dangerous characters
    .substring(0, 1000) // Limit length
}

export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized = {} as T
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value) as T[keyof T]
    } else {
      sanitized[key as keyof T] = value
    }
  }
  
  return sanitized
}