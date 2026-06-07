import { createDatabase } from "../db/index.js";
import { catchAsync } from "../utils/catchAsync.js";
import { authenticateToken } from "../middleware/auth.js";

export function setupContactRoutes(app) {
  app.post("/contact", catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      const { name, email, message, phone, subject } = body;
      if (!name || !email || !message) {
        return c.json({
          success: false,
          message: "Name, email, and message are required"
        }, 400);
      }
      const emailRegex2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex2.test(email)) {
        return c.json({
          success: false,
          message: "Please provide a valid email address"
        }, 400);
      }
      const db = createDatabase(c.env);
      const id = `rec_${Math.random().toString(36).substr(2, 24)}`;
      const query = `
        INSERT INTO contacts (
          id, name, email, phone, subject, message, 
          status, is_read, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      const now = new Date().toISOString();
      const result = await db.query(query, [
        id,
        name,
        email,
        phone || null,
        subject || "General Inquiry",
        message,
        "unread",
        false,
        now,
        now
      ]);
      return c.json({
        success: true,
        message: "Contact form submitted successfully. We will get back to you soon!",
        data: result.data[0]
      });
    } catch (error3) {
      console.error("Error submitting contact form:", error3);
      return c.json({
        success: false,
        message: "Failed to submit contact form",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/contact/info", catchAsync(async (c) => {
    try {
      return c.json({
        success: true,
        message: "Contact information retrieved successfully",
        data: {
          email: "info@kalakritam.in",
          phone: "+91-XXXXXXXXXX",
          address: "Kalakritam Art Gallery, City, State",
          hours: "Mon-Sat: 10AM-6PM"
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to get contact info",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/admin/contacts", authenticateToken, catchAsync(async (c) => {
    try {
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 20;
      const status = c.req.query("status");
      const offset = (page - 1) * limit;
      const db = createDatabase(c.env);
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (status) {
        whereConditions.push(`status = $${paramIndex}`);
        params.push(status);
        paramIndex++;
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM contacts ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = parseInt(countResult.data[0]?.total || 0);
      const totalPages = Math.ceil(total / limit);
      params.push(limit, offset);
      const query = `
        SELECT 
          id, name, email, phone, subject, message, 
          status, is_read, created_at, updated_at
        FROM contacts 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      const result = await db.query(query, params);
      return c.json({
        success: true,
        message: "Contacts fetched successfully",
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
      console.error("Error fetching contacts:", error3);
      return c.json({
        success: false,
        message: "Failed to fetch contacts",
        error: error3.message
      }, 500);
    }
  }));
  app.patch("/admin/contacts/:id/read", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const db = createDatabase(c.env);
      const query = `
        UPDATE contacts 
        SET is_read = true, status = 'read', updated_at = $1
        WHERE id = $2
        RETURNING *
      `;
      const result = await db.query(query, [new Date().toISOString(), id]);
      if (!result.data || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Contact not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "Contact marked as read",
        data: result.data[0]
      });
    } catch (error3) {
      console.error("Error marking contact as read:", error3);
      return c.json({
        success: false,
        message: "Failed to mark contact as read",
        error: error3.message
      }, 500);
    }
  }));
}
