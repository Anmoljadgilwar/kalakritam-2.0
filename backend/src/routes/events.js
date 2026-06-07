import { createDatabase } from "../db/index.js";
import { catchAsync } from "../utils/catchAsync.js";
import { optionalAuth, authenticateToken } from "../middleware/auth.js";

export function setupEventsRoutes(app) {
  app.get("/events", optionalAuth, catchAsync(async (c) => {
    try {
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 6;
      const upcoming = c.req.query("upcoming") === "true";
      const search = c.req.query("search");
      const offset = (page - 1) * limit;
      const db = createDatabase(c.env);
  let whereClause = "WHERE COALESCE(active, true) = true";
      let params = [];
      let paramIndex = 1;
      if (upcoming) {
        whereClause += ` AND start_date > NOW()`;
      }
      if (search) {
        whereClause += ` AND (title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`;
        params.push(`%${search}%`, `%${search}%`);
      }
      const countQuery = `SELECT COUNT(*) as total FROM events ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const query = `
        SELECT id, title, description, category, start_date, end_date, venue, 
               ticket_price, max_attendees, current_attendees, image_url, video_url, 
               district_url, book_my_show_url, featured, active, slug, created_at, updated_at
        FROM events 
        ${whereClause}
        ORDER BY featured DESC, start_date ASC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      params.push(limit, offset);
      const result = await db.query(query, params);
      const events = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Events fetched successfully",
        data: events,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch events",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/events/:id", optionalAuth, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const db = createDatabase(c.env);
      const query = `
        SELECT id, title, description, start_date, end_date, venue, 
               ticket_price, max_attendees, current_attendees, image_url, 
               featured, active, slug, meta_title, meta_description, meta_keywords,
               og_title, og_description, og_image, created_at, updated_at
        FROM events 
        WHERE id = $1 AND active = true
      `;
      const result = await db.query(query, [id]);
      if (!result.success || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Event not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "Event fetched successfully",
        data: result.data[0]
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch event",
        error: error3.message
      }, 500);
    }
  }));
  app.post("/events", authenticateToken, catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Event created successfully",
        data: body
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create event",
        error: error3.message
      }, 500);
    }
  }));
  app.put("/events/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Event updated successfully",
        data: { id, ...body }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update event",
        error: error3.message
      }, 500);
    }
  }));
  app.delete("/events/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      return c.json({
        success: true,
        message: "Event deleted successfully"
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete event",
        error: error3.message
      }, 500);
    }
  }));
}
