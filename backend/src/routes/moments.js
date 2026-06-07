import { createDatabase } from "../db/index.js";
import { catchAsync } from "../utils/catchAsync.js";

export function setupMomentsRoutes(app) {
  app.get("/moments", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 100 } = c.req.query();
    try {
      const offset = (page - 1) * limit;
      const query = `
        SELECT id, event_name, photos, created_at
        FROM moments 
        ORDER BY created_at DESC 
        LIMIT $1 OFFSET $2
      `;
      const result = await db.query(query, [limit, offset]);
      const moments = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Moments fetched successfully",
        data: moments
      });
    } catch (error) {
      return c.json({
        success: false,
        message: "Failed to fetch moments",
        error: error.message
      }, 500);
    }
  }));

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
    } catch (error) {
      return c.json({ success: false, message: "Failed to fetch ArtParty images", error: error.message }, 500);
    }
  }));
}
