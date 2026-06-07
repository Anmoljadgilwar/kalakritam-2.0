import { z } from "zod";
import { loginSchema, registerSchema, contactSchema, galleryItemSchema, eventSchema, workshopSchema, artistSchema, blogSchema, ticketSchema } from "./schemas.js";

export function validateBody(schema) {
  return async (c, next) => {
    try {
      const body = await c.req.json();
      const validatedData = schema.parse(body);
      c.set("validatedBody", validatedData);
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return c.json({
          success: false,
          message: "Validation failed",
          errors: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message
          }))
        }, 400);
      }
      return c.json({
        success: false,
        message: "Invalid JSON in request body"
      }, 400);
    }
  };
}

export const validateLogin = validateBody(loginSchema);
export const validateRegister = validateBody(registerSchema);
export const validateContact = validateBody(contactSchema);
export const validateGalleryItem = validateBody(galleryItemSchema);
export const validateEvent = validateBody(eventSchema);
export const validateWorkshop = validateBody(workshopSchema);
export const validateArtist = validateBody(artistSchema);
export const validateBlog = validateBody(blogSchema);
export const validateTicket = validateBody(ticketSchema);
