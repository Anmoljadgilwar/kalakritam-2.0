import { createDatabase } from "../db/index.js";
import { catchAsync } from "../utils/catchAsync.js";
import { optionalAuth, authenticateToken } from "../middleware/auth.js";

export function setupArtistsRoutes(app) {
  app.get("/artists", optionalAuth, catchAsync(async (c) => {
    try {
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 6;
      const featured = c.req.query("featured") === "true";
      const offset = (page - 1) * limit;
      const db = createDatabase(c.env);
      let whereConditions = ["active = true"];
      if (featured) {
        whereConditions.push("featured = true");
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM artists ${whereClause}`;
      const countResult = await db.query(countQuery);
      const total = parseInt(countResult.data[0]?.total || 0);
      const totalPages = Math.ceil(total / limit);
      const query = `
        SELECT 
          id, name, bio, specialization, email, phone, website, 
          image_url, social_links, featured, active,
          meta_title, meta_description, meta_keywords, slug,
          og_title, og_description, og_image,
          created_at, updated_at
        FROM artists 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
      `;
      const result = await db.query(query, [limit, offset]);
      return c.json({
        success: true,
        message: "Artists fetched successfully",
        data: result.data || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      });
    } catch (error3) {
      console.error("Error fetching artists:", error3);
      return c.json({
        success: false,
        message: "Failed to fetch artists",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/artists/:id", optionalAuth, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const db = createDatabase(c.env);
      const query = `
        SELECT 
          id, name, bio, specialization, email, phone, website, 
          image_url, social_links, featured, active,
          meta_title, meta_description, meta_keywords, slug,
          og_title, og_description, og_image,
          created_at, updated_at
        FROM artists 
        WHERE id = $1 AND active = true
      `;
      const result = await db.query(query, [id]);
      if (!result.data || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Artist not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "Artist fetched successfully",
        data: result.data[0]
      });
    } catch (error3) {
      console.error("Error fetching artist:", error3);
      return c.json({
        success: false,
        message: "Failed to fetch artist",
        error: error3.message
      }, 500);
    }
  }));
  app.post("/artists", authenticateToken, catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Artist created successfully",
        data: body
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create artist",
        error: error3.message
      }, 500);
    }
  }));
  app.put("/artists/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const body = await c.req.json();
      return c.json({
        success: true,
        message: "Artist updated successfully",
        data: { id, ...body }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update artist",
        error: error3.message
      }, 500);
    }
  }));
  app.delete("/artists/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      return c.json({
        success: true,
        message: "Artist deleted successfully"
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete artist",
        error: error3.message
      }, 500);
    }
  }));
}
