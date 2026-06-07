import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["admin", "user"]).optional().default("user")
});

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  phone: z.string().optional()
});

export const galleryItemSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL"),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true)
});

export const eventSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  startDate: z.string().datetime("Invalid start date"),
  endDate: z.string().datetime("Invalid end date").optional(),
  location: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
  ticketPrice: z.number().min(0, "Price must be non-negative").optional(),
  maxAttendees: z.number().min(1, "Max attendees must be at least 1").optional(),
  active: z.boolean().optional().default(true)
});

export const workshopSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  instructor: z.string().min(2, "Instructor name required"),
  startDate: z.string().datetime("Invalid start date"),
  endDate: z.string().datetime("Invalid end date").optional(),
  duration: z.number().min(1, "Duration must be at least 1 hour").optional(),
  location: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
  price: z.number().min(0, "Price must be non-negative"),
  maxParticipants: z.number().min(1, "Max participants must be at least 1"),
  category: z.string().optional(),
  materials: z.array(z.string()).optional(),
  active: z.boolean().optional().default(true)
});

export const artistSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  website: z.string().url("Invalid website URL").optional(),
  profileImageUrl: z.string().url("Invalid image URL").optional(),
  specialty: z.array(z.string()).optional(),
  featured: z.boolean().optional().default(false),
  active: z.boolean().optional().default(true)
});

export const blogSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z.string().optional(),
  imageUrl: z.string().url("Invalid image URL").optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional().default(false),
  publishedAt: z.string().datetime("Invalid publish date").optional(),
  author: z.string().optional()
});

export const ticketSchema = z.object({
  eventId: z.string().uuid("Invalid event ID").optional(),
  workshopId: z.string().uuid("Invalid workshop ID").optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  customerInfo: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    phone: z.string().optional()
  })
});

export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default(10)
});

export const searchSchema = paginationSchema.extend({
  search: z.string().optional(),
  category: z.string().optional(),
  tag: z.string().optional(),
  featured: z.string().regex(/^(true|false)$/).transform((val) => val === "true").optional(),
  active: z.string().regex(/^(true|false)$/).transform((val) => val === "true").optional()
});
