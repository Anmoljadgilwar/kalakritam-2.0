import { createDatabase } from "../db/index.js";
import { catchAsync } from "../utils/catchAsync.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";

export function setupHeroBannersRoutes(app) {
  app.get("/hero-banners", optionalAuth, catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const query = `
        SELECT id, title, media_type, media_url, link_url, order_index, active, created_at, updated_at
        FROM hero_banners 
        WHERE active = true
        ORDER BY order_index ASC
      `;
      const result = await db.query(query);
      
      if (!result.success) {
        throw new Error(result.error || "Database query failed");
      }
      
      const banners = result.data || [];
      
      return c.json({
        success: true,
        message: "Hero banners fetched successfully",
        data: banners
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch hero banners",
        error: error3.message
      }, 500);
    }
  }));

  app.get("/admin/hero-banners", authenticateToken, catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const { page = 1, limit = 20 } = c.req.query();
      
      const offset = (page - 1) * limit;
      const countQuery = `SELECT COUNT(*) as total FROM hero_banners`;
      const countResult = await db.query(countQuery);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      
      const query = `
        SELECT id, title, media_type, media_url, link_url, order_index, active, created_at, updated_at
        FROM hero_banners 
        ORDER BY order_index ASC, created_at DESC
        LIMIT $1 OFFSET $2
      `;
      const result = await db.query(query, [limit, offset]);
      const banners = result.success ? result.data : [];
      
      return c.json({
        success: true,
        message: "Hero banners fetched successfully",
        data: banners,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch hero banners",
        error: error3.message
      }, 500);
    }
  }));

  app.post("/admin/hero-banners", authenticateToken, catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const bannerData = await c.req.json();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      
      const query = `
        INSERT INTO hero_banners (
          id, title, media_type, media_url, link_url, order_index, active, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      
      const result = await db.query(query, [
        id,
        bannerData.title || null,
        bannerData.media_type || 'image',
        bannerData.media_url || null,
        bannerData.link_url || null,
        bannerData.order_index || 0,
        bannerData.active !== false,
        now,
        now
      ]);
      
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Hero banner created successfully",
          data: result.data[0]
        }, 201);
      } else {
        throw new Error("Failed to create hero banner");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create hero banner",
        error: error3.message
      }, 500);
    }
  }));

  app.put("/admin/hero-banners/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const id = c.req.param("id");
      const bannerData = await c.req.json();
      const now = new Date().toISOString();
      
      const query = `
        UPDATE hero_banners SET
          title = $2, media_type = $3, media_url = $4, link_url = $5,
          order_index = $6, active = $7, updated_at = $8
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await db.query(query, [
        id,
        bannerData.title || null,
        bannerData.media_type || 'image',
        bannerData.media_url || null,
        bannerData.link_url || null,
        bannerData.order_index || 0,
        bannerData.active !== false,
        now
      ]);
      
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Hero banner updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update hero banner or banner not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update hero banner",
        error: error3.message
      }, 500);
    }
  }));

  app.delete("/admin/hero-banners/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const id = c.req.param("id");
      
      const query = `DELETE FROM hero_banners WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Hero banner deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Hero banner not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete hero banner",
        error: error3.message
      }, 500);
    }
  }));
}
