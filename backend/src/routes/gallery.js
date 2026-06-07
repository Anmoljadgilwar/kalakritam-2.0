import { createDatabase } from "../db/index.js";
import { catchAsync } from "../utils/catchAsync.js";
import { optionalAuth, authenticateToken } from "../middleware/auth.js";

export function setupGalleryRoutes(app) {
  app.get("/gallery", optionalAuth, catchAsync(async (c) => {
    try {
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 6;
      const category = c.req.query("category");
      const search = c.req.query("search");
      const isAuthenticated = c.get("isAuthenticated");
      const offset = (page - 1) * limit;
      const db = createDatabase(c.env);
  let whereClause = "WHERE COALESCE(available, true) = true";
      let params = [];
      let paramIndex = 1;
      if (category) {
        whereClause += ` AND category = $${paramIndex++}`;
        params.push(category);
      }
      if (search) {
        whereClause += ` AND (title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`;
        params.push(`%${search}%`, `%${search}%`);
      }
      const countQuery = `SELECT COUNT(*) as total FROM artworks ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const query = `
        SELECT id, title, description, image_url, thumbnail_url, artist, 
               category, medium, dimensions, year, price, 
               available, slug, created_at, updated_at
        FROM artworks 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      params.push(limit, offset);
      const result = await db.query(query, params);
      const artworks = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Gallery items fetched successfully",
        data: artworks,
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
        message: "Failed to fetch gallery items",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/gallery/:id", optionalAuth, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const isAuthenticated = c.get("isAuthenticated");
      const db = createDatabase(c.env);
      const query = `
        SELECT id, title, description, image_url, thumbnail_url, artist, 
               category, medium, dimensions, year, price, 
               available, slug, meta_title, meta_description, meta_keywords,
               og_title, og_description, og_image, created_at, updated_at
        FROM artworks 
        WHERE id = $1 AND available = true
      `;
      const result = await db.query(query, [id]);
      if (!result.success || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Gallery item not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "Gallery item fetched successfully",
        data: result.data[0]
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch gallery item",
        error: error3.message
      }, 500);
    }
  }));
  app.post("/gallery", authenticateToken, catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Gallery item created successfully",
        data: body
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create gallery item",
        error: error3.message
      }, 500);
    }
  }));
  app.put("/gallery/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Gallery item updated successfully",
        data: { id, ...body }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update gallery item",
        error: error3.message
      }, 500);
    }
  }));
  app.delete("/gallery/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      return c.json({
        success: true,
        message: "Gallery item deleted successfully"
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete gallery item",
        error: error3.message
      }, 500);
    }
  }));
}
