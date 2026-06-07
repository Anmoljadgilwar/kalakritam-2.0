import { createDatabase } from "../db/index.js";
import { catchAsync } from "../utils/catchAsync.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";

export function setupImageRoutes(app) {
  app.get("/artparty/images", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS images (
          id UUID PRIMARY KEY,
          title VARCHAR(255),
          description TEXT,
          image_url TEXT,
          alt_text VARCHAR(255),
          category VARCHAR(100),
          tags JSONB DEFAULT '[]',
          featured BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `);
      const featuredOnly = c.req.query("featured");
      const params = ["artparty"];
      let where = "WHERE LOWER(category) = LOWER($1) AND image_url IS NOT NULL";
      if (featuredOnly === "true") {
        where += " AND featured = true";
      }
      const query = `
        SELECT id, title, image_url, alt_text, featured, created_at
        FROM images
        ${where}
        ORDER BY featured DESC, created_at DESC
        LIMIT 50
      `;
      const result = await db.query(query, params);
      const items = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "ArtParty images fetched",
        data: items
      });
    } catch (error3) {
      return c.json({ success: false, message: "Failed to fetch ArtParty images", error: error3.message }, 500);
    }
  }));
  app.get("/images/:key", optionalAuth, catchAsync(async (c) => {
    try {
      const key = c.req.param("key");
      return c.json({
        success: true,
        message: "Image details fetched successfully",
        data: {
          key,
          url: `https://example.com/${key}`,
          metadata: {}
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch image details",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/images/:key/optimized", optionalAuth, catchAsync(async (c) => {
    try {
      const key = c.req.param("key");
      const width = c.req.query("w");
      const height = c.req.query("h");
      const quality = c.req.query("q") || "80";
      return c.json({
        success: true,
        message: "Optimized image URL generated",
        data: {
          url: `https://example.com/${key}?w=${width}&h=${height}&q=${quality}`,
          original: `https://example.com/${key}`
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to generate optimized image",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/images", authenticateToken, catchAsync(async (c) => {
    try {
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 20;
      return c.json({
        success: true,
        message: "Images fetched successfully",
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch images",
        error: error3.message
      }, 500);
    }
  }));
}
