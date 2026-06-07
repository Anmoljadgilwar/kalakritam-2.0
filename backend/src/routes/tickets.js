import { createDatabase } from "../db/index.js";
import { EmailService } from "../services/email.js";
import { catchAsync } from "../utils/catchAsync.js";
import { optionalAuth, authenticateToken } from "../middleware/auth.js";

export function setupTicketsRoutes(app) {
  app.get("/tickets", optionalAuth, catchAsync(async (c) => {
    try {
      const eventId = c.req.query("eventId");
      const workshopId = c.req.query("workshopId");
      const status = c.req.query("status");
      const page = parseInt(c.req.query("page")) || 1;
      const limit = parseInt(c.req.query("limit")) || 20;
      const offset = (page - 1) * limit;
      const db = createDatabase(c.env);
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (eventId) {
        whereConditions.push(`event_id = $${paramIndex}`);
        params.push(eventId);
        paramIndex++;
      }
      if (status) {
        whereConditions.push(`status = $${paramIndex}`);
        params.push(status);
        paramIndex++;
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM tickets ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = parseInt(countResult.data[0]?.total || 0);
      const totalPages = Math.ceil(total / limit);
      params.push(limit, offset);
      const query = `
        SELECT 
          id, ticket_number, customer_name, customer_email, customer_phone,
          event_name, event_id, number_of_tickets, amount_paid, event_timings, venue,
          qr_code_url, status, is_verified, verified_at, verified_by, created_at, updated_at
        FROM tickets 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      const result = await db.query(query, params);
      return c.json({
        success: true,
        message: "Tickets fetched successfully",
        data: result.data || [],
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        },
        filters: { eventId, workshopId, status }
      });
    } catch (error3) {
      console.error("Error fetching tickets:", error3);
      return c.json({
        success: false,
        message: "Failed to fetch tickets",
        error: error3.message
      }, 500);
    }
  }));
  app.post("/tickets/purchase", catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      const { eventId, workshopId, quantity, customerInfo } = body;
      if (!customerInfo || !customerInfo.name || !customerInfo.email) {
        return c.json({
          success: false,
          message: "Customer name and email are required"
        }, 400);
      }
      if (!eventId && !workshopId) {
        return c.json({
          success: false,
          message: "Event ID or Workshop ID is required"
        }, 400);
      }
      if (!quantity || quantity < 1) {
        return c.json({
          success: false,
          message: "Valid quantity is required"
        }, 400);
      }
      return c.json({
        success: true,
        message: "Ticket purchase functionality not implemented yet",
        data: { eventId, workshopId, quantity, customerInfo }
      });
    } catch (error3) {
      console.error("Error purchasing ticket:", error3);
      return c.json({
        success: false,
        message: "Failed to purchase ticket",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/tickets/verify/:ticketId", catchAsync(async (c) => {
    try {
      const ticketId = c.req.param("ticketId");
      const db = createDatabase(c.env);
      const query = `
        SELECT 
          id, ticket_number, customer_name, customer_email, customer_phone,
          event_name, event_id, number_of_tickets, amount_paid, event_timings, venue,
          qr_code_url, url, status, is_verified, verified_at, verified_by, created_at
        FROM tickets 
        WHERE id = $1 OR ticket_number = $1
      `;
      const result = await db.query(query, [ticketId]);
      if (!result.data || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Ticket not found"
        }, 404);
      }
      const ticket = result.data[0];
      if (ticket.status !== "valid") {
        return c.json({
          success: false,
          message: `Ticket is ${ticket.status}`,
          data: { status: ticket.status }
        }, 400);
      }
      return c.json({
        success: true,
        message: "Ticket verified successfully",
        data: ticket
      });
    } catch (error3) {
      console.error("Error verifying ticket:", error3);
      return c.json({
        success: false,
        message: "Failed to verify ticket",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/tickets/:ticketId", catchAsync(async (c) => {
    try {
      const ticketId = c.req.param("ticketId");
      const db = createDatabase(c.env);
      const query = `
        SELECT 
          id, ticket_number, customer_name, customer_email, customer_phone,
          event_name, event_id, number_of_tickets, amount_paid, event_timings, venue,
          qr_code, qr_code_url, status, is_verified, verified_at, verified_by, created_at, updated_at
        FROM tickets 
        WHERE id = $1 OR ticket_number = $1
      `;
      const result = await db.query(query, [ticketId]);
      if (!result.data || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Ticket not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "Ticket details fetched successfully",
        data: result.data[0]
      });
    } catch (error3) {
      console.error("Error fetching ticket details:", error3);
      return c.json({
        success: false,
        message: "Failed to fetch ticket details",
        error: error3.message
      }, 500);
    }
  }));
  app.patch("/tickets/:ticketId/verify", authenticateToken, catchAsync(async (c) => {
    try {
      const ticketId = c.req.param("ticketId");
      const user = c.get("user");
      const db = createDatabase(c.env);
      const query = `
        UPDATE tickets 
        SET is_verified = true, verified_at = $1, verified_by = $2, updated_at = $1
        WHERE id = $3 OR ticket_number = $3
        RETURNING *
      `;
      const now = new Date().toISOString();
      const result = await db.query(query, [now, user.email, ticketId]);
      if (!result.data || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Ticket not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "Ticket marked as verified",
        data: result.data[0]
      });
    } catch (error3) {
      console.error("Error marking ticket as verified:", error3);
      return c.json({
        success: false,
        message: "Failed to mark ticket as verified",
        error: error3.message
      }, 500);
    }
  }));
}
