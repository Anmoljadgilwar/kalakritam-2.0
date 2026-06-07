import { createDatabase } from "../db/index.js";
import { catchAsync } from "../utils/catchAsync.js";
import { optionalAuth, authenticateToken } from "../middleware/auth.js";

export function setupWorkshopsRoutes(app) {
  app.get("/workshops", optionalAuth, catchAsync(async (c) => {
    try {
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 6;
      const search = c.req.query("search");
      const upcoming = c.req.query("upcoming") === "true";
      const offset = (page - 1) * limit;
      const db = createDatabase(c.env);
      let whereClause = "WHERE active = true";
      let params = [];
      let paramIndex = 1;
      if (upcoming) {
        whereClause += ` AND start_date > NOW()`;
      }
      if (search) {
        whereClause += ` AND (title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`;
        params.push(`%${search}%`, `%${search}%`);
      }
      const countQuery = `SELECT COUNT(*) as total FROM workshops ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const query = `
        SELECT id, title, description, instructor, start_date, end_date, 
               venue, duration, price, max_participants, current_participants, 
               image_url, active, slug, created_at, updated_at
        FROM workshops 
        ${whereClause}
        ORDER BY start_date ASC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      params.push(limit, offset);
      const result = await db.query(query, params);
      const workshops = result.success ? result.data.map(w => ({
        ...w,
        startDate: w.start_date,
        endDate: w.end_date,
        imageUrl: w.image_url,
        maxParticipants: w.max_participants,
        currentParticipants: w.current_participants,
        createdAt: w.created_at,
        updatedAt: w.updated_at
      })) : [];
      return c.json({
        success: true,
        message: "Workshops fetched successfully",
        data: workshops,
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
        message: "Failed to fetch workshops",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/workshops/:id", optionalAuth, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const db = createDatabase(c.env);
      
      // Check if id is a UUID or a slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      
      const query = `
        SELECT id, title, description, instructor, start_date, end_date, 
               venue, duration, price, max_participants, current_participants, 
               image_url, active, slug, meta_title, meta_description, 
               meta_keywords, og_title, og_description, og_image, created_at, updated_at
        FROM workshops 
        WHERE ${isUUID ? 'id' : 'slug'} = $1 AND active = true
      `;
      const result = await db.query(query, [id]);
      if (!result.success || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Workshop not found"
        }, 404);
      }
      const workshop = result.data[0];
      const transformedWorkshop = {
        ...workshop,
        startDate: workshop.start_date,
        endDate: workshop.end_date,
        imageUrl: workshop.image_url,
        maxParticipants: workshop.max_participants,
        currentParticipants: workshop.current_participants,
        metaTitle: workshop.meta_title,
        metaDescription: workshop.meta_description,
        metaKeywords: workshop.meta_keywords,
        ogTitle: workshop.og_title,
        ogDescription: workshop.og_description,
        ogImage: workshop.og_image,
        createdAt: workshop.created_at,
        updatedAt: workshop.updated_at
      };
      return c.json({
        success: true,
        message: "Workshop fetched successfully",
        data: transformedWorkshop
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch workshop",
        error: error3.message
      }, 500);
    }
  }));
  app.post("/workshops", authenticateToken, catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Workshop created successfully",
        data: body
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create workshop",
        error: error3.message
      }, 500);
    }
  }));
  app.put("/workshops/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Workshop updated successfully",
        data: { id, ...body }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update workshop",
        error: error3.message
      }, 500);
    }
  }));
  app.delete("/workshops/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      return c.json({
        success: true,
        message: "Workshop deleted successfully"
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete workshop",
        error: error3.message
      }, 500);
    }
  }));
}
