import { createDatabase } from "../db/index.js";
import { catchAsync } from "../utils/catchAsync.js";
import { optionalAuth, authenticateToken } from "../middleware/auth.js";

export function setupBlogsRoutes(app) {
  app.get("/blogs", optionalAuth, catchAsync(async (c) => {
    try {
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 10;
      const category = c.req.query("category");
      const search = c.req.query("search");
      const isAuthenticated = c.get("isAuthenticated");
      const offset = (page - 1) * limit;
      const db = createDatabase(c.env);
      let whereClause = isAuthenticated ? "WHERE TRUE" : "WHERE published = true";
      let params = [];
      let paramIndex = 1;
      if (category) {
        whereClause += ` AND category = $${paramIndex++}`;
        params.push(category);
      }
      if (search) {
        whereClause += ` AND (title ILIKE $${paramIndex++} OR content ILIKE $${paramIndex++} OR excerpt ILIKE $${paramIndex++})`;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      const countQuery = `SELECT COUNT(*) as total FROM blogs ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const query = `
        SELECT id, title, content, excerpt, author, category, tags, 
               image_url, published, featured, read_time, slug, 
               created_at, updated_at
        FROM blogs 
        ${whereClause}
        ORDER BY featured DESC, created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      params.push(limit, offset);
      const result = await db.query(query, params);
      const blogs = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Blogs fetched successfully",
        data: blogs,
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
        message: "Failed to fetch blogs",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/blogs/:id", optionalAuth, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const isAuthenticated = c.get("isAuthenticated");
      const db = createDatabase(c.env);
      const whereClause = isAuthenticated ? "AND TRUE" : "AND published = true";
      const query = `
        SELECT id, title, content, excerpt, author, category, tags, 
               image_url, published, featured, read_time, slug, 
               meta_title, meta_description, meta_keywords,
               og_title, og_description, og_image, created_at, updated_at
        FROM blogs 
        WHERE id = $1 ${whereClause}
      `;
      const result = await db.query(query, [id]);
      if (!result.success || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Blog not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "Blog fetched successfully",
        data: result.data[0]
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch blog",
        error: error3.message
      }, 500);
    }
  }));
  app.post("/blogs", authenticateToken, catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Blog created successfully",
        data: body
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create blog",
        error: error3.message
      }, 500);
    }
  }));
  app.put("/blogs/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Blog updated successfully",
        data: { id, ...body }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update blog",
        error: error3.message
      }, 500);
    }
  }));
  app.delete("/blogs/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      return c.json({
        success: true,
        message: "Blog deleted successfully"
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete blog",
        error: error3.message
      }, 500);
    }
  }));
}
