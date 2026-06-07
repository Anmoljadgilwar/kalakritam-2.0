import { createDatabase } from "../db/index.js";
import { EmailService } from "../services/email.js";
import { catchAsync } from "../utils/catchAsync.js";
import { authenticateToken } from "../middleware/auth.js";

export function setupNewsletterRoutes(app) {
  // Subscribe to newsletter
  app.post("/newsletter/subscribe", catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      const { email } = body;
      
      if (!email) {
        return c.json({
          success: false,
          message: "Email is required"
        }, 400);
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return c.json({
          success: false,
          message: "Please provide a valid email address"
        }, 400);
      }
      
      const db = createDatabase(c.env);
      const now = new Date().toISOString();
      
      // Check if email already exists
      const existingQuery = `SELECT * FROM newsletter_subscriptions WHERE email = $1`;
      const existingResult = await db.query(existingQuery, [email.toLowerCase()]);
      
      if (existingResult.success && existingResult.data && existingResult.data.length > 0) {
        const existing = existingResult.data[0];
        
        if (existing.subscribed) {
          return c.json({
            success: true,
            message: "You're already part of our newsletter family! Check your inbox for our latest updates."
          }, 200);
        } else {
          // Re-subscribe
          const updateQuery = `
            UPDATE newsletter_subscriptions 
            SET subscribed = true, subscribed_at = $1, unsubscribed_at = NULL, updated_at = $1
            WHERE email = $2
            RETURNING *
          `;
          await db.query(updateQuery, [now, email.toLowerCase()]);
          
          // Send confirmation email
          try {
            await EmailService.sendNewsletterConfirmation(email.toLowerCase(), c.env);
            console.log('Newsletter confirmation email sent to:', email.toLowerCase());
          } catch (emailErr) {
            console.error('Failed to send newsletter confirmation:', emailErr);
          }
          
          return c.json({
            success: true,
            message: "Welcome back! You have been re-subscribed to our newsletter. A confirmation email has been sent."
          });
        }
      }
      
      // Get IP address for tracking (optional)
      const ipAddress = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || null;
      
      // Insert new subscription
      const insertQuery = `
        INSERT INTO newsletter_subscriptions (
          email, subscribed, subscribed_at, confirmation_sent, ip_address, source, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      
      const result = await db.query(insertQuery, [
        email.toLowerCase(),
        true,
        now,
        true,
        ipAddress,
        'blog_page',
        now,
        now
      ]);
      
      if (result.success && result.data && result.data.length > 0) {
        // Send confirmation email
        try {
          await EmailService.sendNewsletterConfirmation(email.toLowerCase(), c.env);
          console.log('Newsletter confirmation email sent to:', email.toLowerCase());
        } catch (emailErr) {
          console.error('Failed to send newsletter confirmation:', emailErr);
        }
        
        return c.json({
          success: true,
          message: "Thank you for subscribing to Kalakritam! A confirmation email has been sent to your inbox."
        }, 201);
      } else {
        throw new Error("Failed to save subscription");
      }
    } catch (error3) {
      console.error("Error subscribing to newsletter:", error3);
      return c.json({
        success: false,
        message: "Failed to subscribe to newsletter",
        error: error3.message
      }, 500);
    }
  }));
  
  // Unsubscribe from newsletter
  app.post("/newsletter/unsubscribe", catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      const { email } = body;
      
      if (!email) {
        return c.json({
          success: false,
          message: "Email is required"
        }, 400);
      }
      
      const db = createDatabase(c.env);
      const now = new Date().toISOString();
      
      const updateQuery = `
        UPDATE newsletter_subscriptions 
        SET subscribed = false, unsubscribed_at = $1, updated_at = $1
        WHERE email = $2
        RETURNING *
      `;
      
      const result = await db.query(updateQuery, [now, email.toLowerCase()]);
      
      if (result.success && result.data && result.data.length > 0) {
        return c.json({
          success: true,
          message: "You have been successfully unsubscribed from our newsletter."
        });
      } else {
        return c.json({
          success: false,
          message: "Email not found in our subscription list"
        }, 404);
      }
    } catch (error3) {
      console.error("Error unsubscribing from newsletter:", error3);
      return c.json({
        success: false,
        message: "Failed to unsubscribe from newsletter",
        error: error3.message
      }, 500);
    }
  }));
  
  // Get all subscribers (admin only)
  app.get("/admin/newsletter/subscribers", authenticateToken, catchAsync(async (c) => {
    try {
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 50;
      const subscribed = c.req.query("subscribed");
      const offset = (page - 1) * limit;
      
      const db = createDatabase(c.env);
      
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      
      if (subscribed !== undefined) {
        whereConditions.push(`subscribed = $${paramIndex}`);
        params.push(subscribed === 'true');
        paramIndex++;
      }
      
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      
      // Get total count
      const countQuery = `SELECT COUNT(*) as total FROM newsletter_subscriptions ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = parseInt(countResult.data[0]?.total || 0);
      const totalPages = Math.ceil(total / limit);
      
      // Get subscribers
      params.push(limit, offset);
      const query = `
        SELECT 
          id, email, subscribed, subscribed_at, unsubscribed_at, 
          source, created_at, updated_at
        FROM newsletter_subscriptions 
        ${whereClause}
        ORDER BY subscribed_at DESC 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      const result = await db.query(query, params);
      
      return c.json({
        success: true,
        message: "Newsletter subscribers fetched successfully",
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
      console.error("Error fetching newsletter subscribers:", error3);
      return c.json({
        success: false,
        message: "Failed to fetch newsletter subscribers",
        error: error3.message
      }, 500);
    }
  }));
  
  // Get subscriber stats (admin only)
  app.get("/admin/newsletter/stats", authenticateToken, catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      
      const statsQuery = `
        SELECT 
          COUNT(*) as total_subscriptions,
          COUNT(CASE WHEN subscribed = true THEN 1 END) as active_subscribers,
          COUNT(CASE WHEN subscribed = false THEN 1 END) as unsubscribed,
          COUNT(CASE WHEN subscribed_at >= NOW() - INTERVAL '30 days' THEN 1 END) as new_last_30_days,
          COUNT(CASE WHEN subscribed_at >= NOW() - INTERVAL '7 days' THEN 1 END) as new_last_7_days
        FROM newsletter_subscriptions
      `;
      
      const result = await db.query(statsQuery, []);
      
      return c.json({
        success: true,
        message: "Newsletter stats fetched successfully",
        data: result.data[0] || {
          total_subscriptions: 0,
          active_subscribers: 0,
          unsubscribed: 0,
          new_last_30_days: 0,
          new_last_7_days: 0
        }
      });
    } catch (error3) {
      console.error("Error fetching newsletter stats:", error3);
      return c.json({
        success: false,
        message: "Failed to fetch newsletter stats",
        error: error3.message
      }, 500);
    }
  }));
  
  // Delete subscriber (admin only)
  app.delete("/admin/newsletter/subscribers/:id", authenticateToken, catchAsync(async (c) => {
    try {
      const id = c.req.param("id");
      const db = createDatabase(c.env);
      
      const deleteQuery = `DELETE FROM newsletter_subscriptions WHERE id = $1 RETURNING *`;
      const result = await db.query(deleteQuery, [id]);
      
      if (result.success && result.data && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Subscriber deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Subscriber not found"
        }, 404);
      }
    } catch (error3) {
      console.error("Error deleting subscriber:", error3);
      return c.json({
        success: false,
        message: "Failed to delete subscriber",
        error: error3.message
      }, 500);
    }
  }));
}
