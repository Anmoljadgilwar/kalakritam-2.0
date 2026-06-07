import { createDatabase } from "../../db/index.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { authenticateToken, requireAdmin, hashPassword } from "../../middleware/auth.js";
import { validateBody } from "../../validation/index.js";
import { z } from "zod";
import { createNotificationForAllUsers, deleteNotificationsByTitle } from "../../utils/notifications.js";

export function setupAdminCrudRoutes(app) {
  // ==================== TICKETS CRUD ====================
  app.get("/admin/tickets", authenticateToken, catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 10, search, status, event_id } = c.req.query();
    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (status) {
        whereConditions.push(`status = $${paramIndex++}`);
        params.push(status);
      }
      if (event_id) {
        whereConditions.push(`event_id = $${paramIndex++}`);
        params.push(event_id);
      }
      if (search) {
        whereConditions.push(`(customer_name ILIKE $${paramIndex++} OR customer_email ILIKE $${paramIndex++} OR ticket_number ILIKE $${paramIndex++})`);
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM tickets ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, ticket_number, customer_name, customer_email, customer_phone,
               event_name, event_id, number_of_tickets, amount_paid, 
               event_timings, venue, qr_code_url, url, status, is_verified, 
               verified_at, verified_by, created_at, updated_at
        FROM tickets 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const tickets = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Tickets fetched successfully",
        data: tickets,
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
        message: "Failed to fetch tickets",
        error: error3.message
      }, 500);
    }
  }));
  app.post("/admin/tickets", authenticateToken, catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const ticketData = await c.req.json();
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const ticketNumber = ticketData.ticket_number || `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const query = `
        INSERT INTO tickets (
          id, ticket_number, customer_name, customer_email, customer_phone,
          event_name, event_id, number_of_tickets, amount_paid, 
          event_timings, venue, qr_code_url, url, status, is_verified, 
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        ticketNumber,
        ticketData.customer_name,
        ticketData.customer_email,
        ticketData.customer_phone || null,
        ticketData.event_name || null,
        ticketData.event_id || null,
        ticketData.number_of_tickets || 1,
        ticketData.amount_paid || null,
        ticketData.event_timings || null,
        ticketData.venue || null,
        ticketData.qr_code_url || null,
        ticketData.url || null,
        ticketData.status || "valid",
        ticketData.is_verified || false,
        now,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Ticket created successfully",
          data: result.data[0]
        }, 201);
      } else {
        throw new Error("Failed to create ticket");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create ticket",
        error: error3.message
      }, 500);
    }
  }));
  app.put("/admin/tickets/:id", authenticateToken, catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const ticketData = await c.req.json();
    try {
      const now = new Date().toISOString();
      const query = `
        UPDATE tickets SET
          customer_name = $2, customer_email = $3, customer_phone = $4,
          event_name = $5, event_id = $6, number_of_tickets = $7,
          amount_paid = $8, event_timings = $9, venue = $10, 
          qr_code_url = $11, url = $12, status = $13, is_verified = $14, updated_at = $15
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        ticketData.customer_name,
        ticketData.customer_email,
        ticketData.customer_phone || null,
        ticketData.event_name || null,
        ticketData.event_id || null,
        ticketData.number_of_tickets || 1,
        ticketData.amount_paid || null,
        ticketData.event_timings || null,
        ticketData.venue || null,
        ticketData.qr_code_url || null,
        ticketData.url || null,
        ticketData.status || "valid",
        ticketData.is_verified || false,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Ticket updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update ticket or ticket not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update ticket",
        error: error3.message
      }, 500);
    }
  }));
  app.patch("/admin/tickets/:id", authenticateToken, catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const updates = await c.req.json();
    try {
      const now = new Date().toISOString();
      const updateFields = [];
      const params = [id];
      let paramIndex = 2;
      if (updates.url !== void 0) {
        updateFields.push(`url = $${paramIndex++}`);
        params.push(updates.url);
      }
      if (updates.customer_name !== void 0) {
        updateFields.push(`customer_name = $${paramIndex++}`);
        params.push(updates.customer_name);
      }
      if (updates.customer_email !== void 0) {
        updateFields.push(`customer_email = $${paramIndex++}`);
        params.push(updates.customer_email);
      }
      if (updates.customer_phone !== void 0) {
        updateFields.push(`customer_phone = $${paramIndex++}`);
        params.push(updates.customer_phone);
      }
      if (updates.event_name !== void 0) {
        updateFields.push(`event_name = $${paramIndex++}`);
        params.push(updates.event_name);
      }
      if (updates.venue !== void 0) {
        updateFields.push(`venue = $${paramIndex++}`);
        params.push(updates.venue);
      }
      if (updates.amount_paid !== void 0) {
        updateFields.push(`amount_paid = $${paramIndex++}`);
        params.push(updates.amount_paid);
      }
      if (updates.status !== void 0) {
        updateFields.push(`status = $${paramIndex++}`);
        params.push(updates.status);
      }
      updateFields.push(`updated_at = $${paramIndex++}`);
      params.push(now);
      if (updateFields.length === 1) {
        return c.json({
          success: false,
          message: "No fields to update"
        }, 400);
      }
      const query = `
        UPDATE tickets SET ${updateFields.join(", ")}
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, params);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Ticket updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update ticket or ticket not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update ticket",
        error: error3.message
      }, 500);
    }
  }));
  app.delete("/admin/tickets/:id", authenticateToken, catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      const query = `DELETE FROM tickets WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Ticket deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Ticket not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete ticket",
        error: error3.message
      }, 500);
    }
  }));

  app.use("/admin/*", authenticateToken);

  // ==================== FINANCIALS CRUD ====================
  // List financials with joined event details
  app.get("/admin/financials", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { event_id = null, page = 1, limit = 100, year = null, month = null } = c.req.query();
    const filters = [];
    const params = [];
    let idx = 1;
    if (event_id) {
      filters.push(`ef.event_id = $${idx++}`);
      params.push(event_id);
    }
    if (year) {
      filters.push(`EXTRACT(YEAR FROM COALESCE(e.start_date, ef.created_at)) = $${idx++}`);
      params.push(parseInt(year));
    }
    if (month) {
      filters.push(`EXTRACT(MONTH FROM COALESCE(e.start_date, ef.created_at)) = $${idx++}`);
      params.push(parseInt(month));
    }
    const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const query = `
      SELECT 
        ef.id,
        ef.event_id,
        e.title AS event_name,
        e.start_date AS event_date,
        COALESCE(ef.ticket_sold, 0) AS ticket_sold,
        COALESCE(ef.income, 0) AS income,
        COALESCE(ef.event_expense, 0) AS event_expense,
        COALESCE(ef.material_cost, 0) AS material_cost,
        COALESCE(ef.marketing_cost, 0) AS marketing_cost,
        (COALESCE(ef.event_expense,0) + COALESCE(ef.material_cost,0) + COALESCE(ef.marketing_cost,0)) AS total_investment,
        (COALESCE(ef.income,0) - (COALESCE(ef.event_expense,0) + COALESCE(ef.material_cost,0) + COALESCE(ef.marketing_cost,0))) AS total_profit,
        ef.created_at,
        ef.updated_at
      FROM event_financials ef
      LEFT JOIN events e ON e.id::text = ef.event_id::text
      ${whereClause}
      ORDER BY COALESCE(e.start_date, ef.created_at) DESC
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM event_financials ef 
      LEFT JOIN events e ON e.id::text = ef.event_id::text
      ${whereClause}
    `;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const [dataRes, countRes] = await Promise.all([
      db.query(query, [...params, parseInt(limit), offset]),
      db.query(countQuery, params)
    ]);
    if (!dataRes.success || !countRes.success) {
      const err = dataRes.success ? countRes.error : dataRes.error;
      return c.json({ success: false, message: "Failed to fetch financials", error: err }, 500);
    }
    const total = parseInt(countRes.data[0].total || 0);
    const totalPages = Math.ceil(total / parseInt(limit || 1));
    return c.json({
      success: true,
      message: "Financials fetched successfully",
      data: dataRes.data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });
  }));
  // Create financial record
  app.post("/admin/financials", validateBody(z.object({
    event_id: z.union([z.string(), z.number()]),
    ticket_sold: z.number().int().nonnegative().optional(),
    income: z.number().nonnegative(),
    event_expense: z.number().nonnegative().optional(),
    material_cost: z.number().nonnegative().optional(),
    marketing_cost: z.number().nonnegative().optional()
  })), catchAsync(async (c) => {
    const body = c.get("validatedBody");
    const db = createDatabase(c.env);
    const payload = {
      event_id: body.event_id,
      ticket_sold: body.ticket_sold ?? 0,
      income: body.income ?? 0,
      event_expense: body.event_expense ?? 0,
      material_cost: body.material_cost ?? 0,
      marketing_cost: body.marketing_cost ?? 0,
      created_at: (new Date()).toISOString(),
      updated_at: (new Date()).toISOString()
    };
    const result = await db.insert("event_financials", payload);
    if (!result.success) {
      return c.json({ success: false, message: "Failed to create financial record", error: result.error }, 500);
    }
    return c.json({ success: true, message: "Financial record created", data: result.data }, 201);
  }));
  // Update financial record
  app.put("/admin/financials/:id", validateBody(z.object({
    event_id: z.union([z.string(), z.number()]).optional(),
    ticket_sold: z.number().int().nonnegative().optional(),
    income: z.number().nonnegative().optional(),
    event_expense: z.number().nonnegative().optional(),
    material_cost: z.number().nonnegative().optional(),
    marketing_cost: z.number().nonnegative().optional()
  })), catchAsync(async (c) => {
    const id = c.req.param("id");
    const updates = c.get("validatedBody");
    const db = createDatabase(c.env);
    const result = await db.update("event_financials", id, { ...updates });
    if (!result.success) {
      return c.json({ success: false, message: "Failed to update financial record", error: result.error }, 500);
    }
    return c.json({ success: true, message: "Financial record updated", data: result.data });
  }));
  // Delete financial record
  app.delete("/admin/financials/:id", catchAsync(async (c) => {
    const id = c.req.param("id");
    const db = createDatabase(c.env);
    const res = await db.query("DELETE FROM event_financials WHERE id = $1 RETURNING id", [id]);
    if (!res.success) {
      return c.json({ success: false, message: "Failed to delete financial record", error: res.error }, 500);
    }
    if (res.data.length === 0) {
      return c.json({ success: false, message: "Financial record not found" }, 404);
    }
    return c.json({ success: true, message: "Financial record deleted" });
  }));
  // Monthly summary for a given year
  app.get("/admin/financials/summary/monthly", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { year } = c.req.query();
    const y = parseInt(year || new Date().getFullYear());
    const query = `
      SELECT 
        EXTRACT(MONTH FROM COALESCE(e.start_date, ef.created_at))::int AS month,
        SUM(COALESCE(ef.income,0) - (COALESCE(ef.event_expense,0) + COALESCE(ef.material_cost,0) + COALESCE(ef.marketing_cost,0)))::numeric AS total_profit
      FROM event_financials ef
      LEFT JOIN events e ON e.id = ef.event_id
      WHERE EXTRACT(YEAR FROM COALESCE(e.start_date, ef.created_at)) = $1
      GROUP BY month
      ORDER BY month`;
    const res = await db.query(query, [y]);
    if (!res.success) return c.json({ success: false, message: "Failed to fetch monthly summary", error: res.error }, 500);
    return c.json({ success: true, data: res.data, year: y });
  }));
  // Yearly summary (all years)
  app.get("/admin/financials/summary/yearly", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const query = `
      SELECT 
        EXTRACT(YEAR FROM COALESCE(e.start_date, ef.created_at))::int AS year,
        SUM(COALESCE(ef.income,0) - (COALESCE(ef.event_expense,0) + COALESCE(ef.material_cost,0) + COALESCE(ef.marketing_cost,0)))::numeric AS total_profit
      FROM event_financials ef
      LEFT JOIN events e ON e.id = ef.event_id
      GROUP BY year
      ORDER BY year`;
    const res = await db.query(query);
    if (!res.success) return c.json({ success: false, message: "Failed to fetch yearly summary", error: res.error }, 500);
    return c.json({ success: true, data: res.data });
  }));
  // Analytics dataset for charts
  app.get("/admin/financials/analytics", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const [eventsRes, monthlyRes, ticketRes] = await Promise.all([
      db.query(`
        SELECT 
          ef.id,
          ef.event_id,
          e.title AS event_name,
          e.start_date AS event_date,
          COALESCE(ef.income,0) AS income,
          (COALESCE(ef.event_expense,0) + COALESCE(ef.material_cost,0) + COALESCE(ef.marketing_cost,0)) AS total_investment,
          (COALESCE(ef.income,0) - (COALESCE(ef.event_expense,0) + COALESCE(ef.material_cost,0) + COALESCE(ef.marketing_cost,0))) AS total_profit
        FROM event_financials ef
        LEFT JOIN events e ON e.id = ef.event_id
        ORDER BY COALESCE(e.start_date, ef.created_at) ASC
      `),
      db.query(`
        SELECT 
          DATE_TRUNC('month', COALESCE(e.start_date, ef.created_at)) AS month,
          SUM(COALESCE(ef.income,0) - (COALESCE(ef.event_expense,0) + COALESCE(ef.material_cost,0) + COALESCE(ef.marketing_cost,0)))::numeric AS total_profit
        FROM event_financials ef
        LEFT JOIN events e ON e.id = ef.event_id
        GROUP BY month
        ORDER BY month
      `),
      db.query(`
        SELECT 
          ef.event_id,
          e.title AS event_name,
          COALESCE(ef.ticket_sold,0) AS ticket_sold
        FROM event_financials ef
        LEFT JOIN events e ON e.id = ef.event_id
        ORDER BY ticket_sold DESC
      `)
    ]);
    if (!eventsRes.success || !monthlyRes.success || !ticketRes.success) {
      return c.json({ success: false, message: "Failed to fetch analytics", error: (eventsRes.error || monthlyRes.error || ticketRes.error) }, 500);
    }
    const eventProfits = eventsRes.data.map(r => ({
      eventId: r.event_id,
      eventName: r.event_name,
      eventDate: r.event_date,
      profit: Number(r.total_profit),
      income: Number(r.income),
      investment: Number(r.total_investment)
    }));
    const monthlyTrend = monthlyRes.data.map(r => ({
      month: r.month,
      totalProfit: Number(r.total_profit)
    }));
    const ticketDistribution = ticketRes.data.map(r => ({
      eventId: r.event_id,
      eventName: r.event_name,
      tickets: Number(r.ticket_sold)
    }));
    return c.json({
      success: true,
      data: { eventProfits, monthlyTrend, ticketDistribution }
    });
  }));

  // ==================== SETTINGS ====================
  app.get("/admin/settings", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    try {
      const result = await db.query("SELECT key, value, description FROM system_settings ORDER BY key");
      const settings = {};
      if (result.success) {
        result.data.forEach((row) => {
          settings[row.key] = {
            value: JSON.parse(row.value),
            description: row.description
          };
        });
      }
      return c.json({
        success: true,
        message: "Settings fetched successfully",
        data: { settings }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch settings"
      }, 500);
    }
  }));
  app.put("/admin/settings", validateBody(z.object({
    settings: z.record(z.any())
  })), catchAsync(async (c) => {
    const { settings } = c.get("validatedBody");
    const db = createDatabase(c.env);
    const user = c.get("user");
    try {
      const updates = [];
      for (const [key, value] of Object.entries(settings)) {
        updates.push({
          query: `
            INSERT INTO system_settings (key, value, updated_by, updated_at)
            VALUES ($1, $2, $3, NOW())
            ON CONFLICT (key) 
            DO UPDATE SET value = EXCLUDED.value, updated_by = EXCLUDED.updated_by, updated_at = NOW()
          `,
          params: [key, JSON.stringify(value), user.id]
        });
      }
      const result = await db.transaction(updates);
      if (!result.success) {
        return c.json({
          success: false,
          message: "Failed to update settings"
        }, 500);
      }
      return c.json({
        success: true,
        message: "Settings updated successfully"
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update settings"
      }, 500);
    }
  }));

  // ==================== ADMIN USERS CRUD ====================
  app.get("/admin/users", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 10, search = "" } = c.req.query();
    try {
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        searchFields: ["name", "email"],
        orderBy: "created_at DESC"
      };
      const result = await db.list("admin_users", options);
      if (!result.success) {
        return c.json({
          success: false,
          message: "Failed to fetch users"
        }, 500);
      }
      const users = result.data.map((user) => {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      return c.json({
        success: true,
        message: "Users fetched successfully",
        data: users,
        pagination: result.pagination
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch users"
      }, 500);
    }
  }));
  app.post("/admin/users", requireAdmin, validateBody(z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["admin", "moderator", "editor"]),
    permissions: z.array(z.string()).optional()
  })), catchAsync(async (c) => {
    const userData = c.get("validatedBody");
    const db = createDatabase(c.env);
    const currentUser = c.get("user");
    try {
      const passwordHash = await hashPassword(userData.password);
      const newUser = {
        name: userData.name,
        email: userData.email,
        password_hash: passwordHash,
        role: userData.role,
        permissions: JSON.stringify(userData.permissions || []),
        active: true,
        created_by: currentUser.id,
        created_at: new Date().toISOString()
      };
      const result = await db.insert("admin_users", newUser);
      if (!result.success) {
        if (result.code === "DUPLICATE_ERROR") {
          return c.json({
            success: false,
            message: "User with this email already exists"
          }, 409);
        }
        return c.json({
          success: false,
          message: "Failed to create user"
        }, 500);
      }
      const { password_hash, ...userResponse } = result.data;
      return c.json({
        success: true,
        message: "User created successfully",
        data: userResponse
      }, 201);
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create user"
      }, 500);
    }
  }));
  app.put("/admin/users/:id", requireAdmin, validateBody(z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email format").optional(),
    role: z.enum(["admin", "moderator", "editor"]).optional(),
    permissions: z.array(z.string()).optional(),
    active: z.boolean().optional()
  })), catchAsync(async (c) => {
    const userId = c.req.param("id");
    const updateData = c.get("validatedBody");
    const db = createDatabase(c.env);
    const currentUser = c.get("user");
    try {
      if (updateData.permissions) {
        updateData.permissions = JSON.stringify(updateData.permissions);
      }
      updateData.updated_by = currentUser.id;
      const result = await db.update("admin_users", userId, updateData);
      if (!result.success) {
        if (result.code === "NOT_FOUND") {
          return c.json({
            success: false,
            message: "User not found"
          }, 404);
        }
        return c.json({
          success: false,
          message: "Failed to update user"
        }, 500);
      }
      const { password_hash, ...userResponse } = result.data;
      return c.json({
        success: true,
        message: "User updated successfully",
        data: userResponse
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update user"
      }, 500);
    }
  }));
  app.delete("/admin/users/:id", requireAdmin, catchAsync(async (c) => {
    const userId = c.req.param("id");
    const db = createDatabase(c.env);
    const currentUser = c.get("user");
    try {
      if (userId === currentUser.id) {
        return c.json({
          success: false,
          message: "Cannot delete your own account"
        }, 400);
      }
      const result = await db.delete("admin_users", userId, {
        deletedBy: currentUser.id
      });
      if (!result.success) {
        if (result.code === "NOT_FOUND") {
          return c.json({
            success: false,
            message: "User not found"
          }, 404);
        }
        return c.json({
          success: false,
          message: "Failed to delete user"
        }, 500);
      }
      return c.json({
        success: true,
        message: "User deleted successfully"
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete user"
      }, 500);
    }
  }));

  // ==================== GALLERY CRUD ====================
  app.get("/admin/gallery", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 6, search } = c.req.query();
    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (search) {
        whereConditions.push(`(title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`);
        params.push(`%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM artworks ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, title, description, image_url, thumbnail_url, artist, 
               category, medium, dimensions, 
               CASE 
                 WHEN year IS NULL THEN NULL
                 ELSE CAST(year AS INTEGER)
               END as year, 
               price, 
               available, slug, meta_title, meta_description, meta_keywords,
               og_title, og_description, og_image, created_at, updated_at
        FROM artworks 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const artworks = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Gallery items fetched successfully",
        data: artworks,
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
        message: "Failed to fetch gallery items",
        error: error3.message
      }, 500);
    }
  }));
  app.post("/admin/gallery", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const artworkData = await c.req.json();
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const yearValue = artworkData.year ? parseInt(artworkData.year, 10) : null;
      const year = yearValue && !isNaN(yearValue) && yearValue >= 1 && yearValue <= 9999 ? yearValue : null;
      console.log('📥 Backend received artwork data:', { receivedYear: artworkData.year, parsedYearValue: yearValue, validatedYear: year });
      const query = `
        INSERT INTO artworks (
          id, title, artist, description, medium, dimensions, 
          year, price, category, image_url, available,
          meta_title, meta_description, meta_keywords, slug,
          og_title, og_description, og_image, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        artworkData.title,
        artworkData.artist,
        artworkData.description || null,
        artworkData.medium || null,
        artworkData.dimensions || null,
        year,
        artworkData.price || null,
        artworkData.category || null,
        artworkData.image_url || null,
        artworkData.available !== false,
        artworkData.meta_title || null,
        artworkData.meta_description || null,
        artworkData.meta_keywords || null,
        artworkData.slug || null,
        artworkData.og_title || null,
        artworkData.og_description || null,
        artworkData.og_image || null,
        now,
        now
      ]);
      if (result.success && result.data.length > 0) {
        console.log('[DATABASE] Artwork stored:', { id: result.data[0].id, year: result.data[0].year, yearType: typeof result.data[0].year });
        
        // Create notification for all users
        try {
          const priceInfo = artworkData.price ? `₹${artworkData.price.toLocaleString()}` : 'Price on request';
          const categoryInfo = artworkData.category ? ` | ${artworkData.category}` : '';
          const mediumInfo = artworkData.medium ? ` in ${artworkData.medium}` : '';
          
          await createNotificationForAllUsers(
            db,
            'gallery',
            `New ${artworkData.category || 'Artwork'} in Gallery`,
            `"${artworkData.title}" by ${artworkData.artist}${mediumInfo}${categoryInfo} - ${priceInfo}. Explore this stunning piece now!`,
            '/gallery'
          );
          console.log('[NOTIFICATION] Sent to all users for new artwork');
        } catch (notifError) {
          console.error('[NOTIFICATION ERROR] Failed to send notification:', notifError.message);
        }
        
        return c.json({
          success: true,
          message: "Artwork created successfully",
          data: result.data[0]
        }, 201);
      } else {
        throw new Error("Failed to create artwork");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create artwork",
        error: error3.message
      }, 500);
    }
  }));
  app.put("/admin/gallery/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const artworkData = await c.req.json();
    try {
      const now = new Date().toISOString();
      const yearValue = artworkData.year ? parseInt(artworkData.year, 10) : null;
      const year = yearValue && !isNaN(yearValue) && yearValue >= 1 && yearValue <= 9999 ? yearValue : null;
      console.log('📥 Backend received artwork update:', { id, receivedYear: artworkData.year, parsedYearValue: yearValue, validatedYear: year });
      const query = `
        UPDATE artworks SET
          title = $2, artist = $3, description = $4, medium = $5, dimensions = $6,
          year = $7, price = $8, category = $9, image_url = $10, available = $11,
          meta_title = $12, meta_description = $13, meta_keywords = $14,
          slug = $15, og_title = $16, og_description = $17, og_image = $18, updated_at = $19
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        artworkData.title,
        artworkData.artist,
        artworkData.description || null,
        artworkData.medium || null,
        artworkData.dimensions || null,
        year,
        artworkData.price || null,
        artworkData.category || null,
        artworkData.image_url || null,
        artworkData.available !== false,
        artworkData.meta_title || null,
        artworkData.meta_description || null,
        artworkData.meta_keywords || null,
        artworkData.slug || null,
        artworkData.og_title || null,
        artworkData.og_description || null,
        artworkData.og_image || null,
        now
      ]);
      if (result.success && result.data.length > 0) {
        console.log('[DATABASE] Artwork updated:', { id: result.data[0].id, year: result.data[0].year, yearType: typeof result.data[0].year });
        return c.json({
          success: true,
          message: "Artwork updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update artwork or artwork not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update artwork",
        error: error3.message
      }, 500);
    }
  }));
  app.delete("/admin/gallery/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      // Get artwork details before deleting
      const getQuery = `SELECT title FROM artworks WHERE id = $1`;
      const artworkResult = await db.query(getQuery, [id]);
      
      const query = `DELETE FROM artworks WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        // Delete only notifications for this specific artwork
        if (artworkResult.success && artworkResult.data.length > 0) {
          const artworkTitle = artworkResult.data[0].title;
          try {
            await deleteNotificationsByTitle(db, 'gallery', artworkTitle);
            console.log(`[NOTIFICATION] Deleted notifications for artwork: ${artworkTitle}`);
          } catch (notifError) {
            console.error('[NOTIFICATION ERROR] Failed to delete notifications:', notifError.message);
          }
        }
        
        return c.json({
          success: true,
          message: "Artwork deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Artwork not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete artwork",
        error: error3.message
      }, 500);
    }
  }));

  // ==================== MOMENTS CRUD ====================
  // GET all moments with pagination
  app.get("/admin/moments", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 20, search } = c.req.query();
    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (search) {
        whereConditions.push(`event_name ILIKE $${paramIndex++}`);
        params.push(`%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM moments ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, event_name, photos, created_at, updated_at
        FROM moments 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const moments = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Moments fetched successfully",
        data: moments,
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
        message: "Failed to fetch moments",
        error: error3.message
      }, 500);
    }
  }));

  // POST create new moment
  app.post("/admin/moments", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const momentData = await c.req.json();
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      
      // photos should be an array of image URLs
      const photosJson = JSON.stringify(momentData.photos || []);
      
      const query = `
        INSERT INTO moments (
          id, event_name, photos, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        momentData.event_name,
        photosJson,
        now,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Moment created successfully",
          data: result.data[0]
        }, 201);
      } else {
        throw new Error("Failed to create moment");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create moment",
        error: error3.message
      }, 500);
    }
  }));

  // PUT update moment
  app.put("/admin/moments/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const momentData = await c.req.json();
    try {
      const now = new Date().toISOString();
      
      // photos should be an array of image URLs
      const photosJson = JSON.stringify(momentData.photos || []);
      
      const query = `
        UPDATE moments SET
          event_name = $2, photos = $3, updated_at = $4
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        momentData.event_name,
        photosJson,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Moment updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update moment or moment not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update moment",
        error: error3.message
      }, 500);
    }
  }));

  // DELETE moment
  app.delete("/admin/moments/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      const query = `DELETE FROM moments WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Moment deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Moment not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete moment",
        error: error3.message
      }, 500);
    }
  }));

  // ==================== EVENTS CRUD ====================
  app.get("/admin/events", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 6, search, featured } = c.req.query();
    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (featured !== void 0) {
        whereConditions.push(`featured = $${paramIndex++}`);
        params.push(featured === "true");
      }
      if (search) {
        whereConditions.push(`(title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`);
        params.push(`%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM events ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, title, description, category, start_date, end_date, venue, ticket_price, 
               max_attendees, current_attendees, image_url, video_url, district_url, book_my_show_url, featured, active,
               meta_title, meta_description, meta_keywords, slug, og_title, 
               og_description, og_image, created_at, updated_at
        FROM events 
        ${whereClause}
        ORDER BY featured DESC, start_date DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const events = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Events fetched successfully",
        data: events,
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
        message: "Failed to fetch events",
        error: error3.message
      }, 500);
    }
  }));
  app.post("/admin/events", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const eventData = await c.req.json();
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const query = `
        INSERT INTO events (
          id, title, description, category, start_date, end_date, venue, ticket_price,
          max_attendees, current_attendees, image_url, video_url, district_url, book_my_show_url, featured, active,
          meta_title, meta_description, meta_keywords, slug, og_title,
          og_description, og_image, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        eventData.title,
        eventData.description || null,
        eventData.category || null,
        eventData.start_date || null,
        eventData.end_date || null,
        eventData.venue || null,
        eventData.ticket_price || null,
        eventData.max_attendees || null,
        eventData.current_attendees || 0,
        eventData.image_url || null,
        eventData.video_url || null,
        eventData.district_url || null,
        eventData.book_my_show_url || null,
        eventData.featured || false,
        eventData.active !== false,
        eventData.meta_title || null,
        eventData.meta_description || null,
        eventData.meta_keywords || null,
        eventData.slug || null,
        eventData.og_title || null,
        eventData.og_description || null,
        eventData.og_image || null,
        now,
        now
      ]);
      if (result.success && result.data.length > 0) {
        // Create notification for all users
        try {
          const eventDate = eventData.start_date ? new Date(eventData.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Coming Soon';
          const ticketInfo = eventData.ticket_price ? `Tickets from ₹${eventData.ticket_price}` : 'Free Entry';
          const venueInfo = eventData.venue ? ` at ${eventData.venue}` : '';
          const categoryInfo = eventData.category ? ` | ${eventData.category}` : '';
          
          await createNotificationForAllUsers(
            db,
            'event',
            `Upcoming Event: ${eventData.title}`,
            `Join us on ${eventDate}${venueInfo}${categoryInfo}. ${ticketInfo}. Book your spot now!`,
            '/events'
          );
          console.log('[NOTIFICATION] Sent to all users for new event');
        } catch (notifError) {
          console.error('[NOTIFICATION ERROR] Failed to send notification:', notifError.message);
        }
        
        return c.json({
          success: true,
          message: "Event created successfully",
          data: result.data[0]
        }, 201);
      } else {
        throw new Error("Failed to create event");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create event",
        error: error3.message
      }, 500);
    }
  }));
  app.put("/admin/events/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const eventData = await c.req.json();
    try {
      const now = new Date().toISOString();
      const query = `
        UPDATE events SET
          title = $2, description = $3, category = $4, start_date = $5, end_date = $6, venue = $7,
          ticket_price = $8, max_attendees = $9, current_attendees = $10, image_url = $11, video_url = $12,
          district_url = $13, book_my_show_url = $14, featured = $15, active = $16, meta_title = $17, meta_description = $18,
          meta_keywords = $19, slug = $20, og_title = $21, og_description = $22,
          og_image = $23, updated_at = $24
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        eventData.title,
        eventData.description || null,
        eventData.category || null,
        eventData.start_date || null,
        eventData.end_date || null,
        eventData.venue || null,
        eventData.ticket_price || null,
        eventData.max_attendees || null,
        eventData.current_attendees || 0,
        eventData.image_url || null,
        eventData.video_url || null,
        eventData.district_url || null,
        eventData.book_my_show_url || null,
        eventData.featured || false,
        eventData.active !== false,
        eventData.meta_title || null,
        eventData.meta_description || null,
        eventData.meta_keywords || null,
        eventData.slug || null,
        eventData.og_title || null,
        eventData.og_description || null,
        eventData.og_image || null,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Event updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update event or event not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update event",
        error: error3.message
      }, 500);
    }
  }));
  app.delete("/admin/events/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      // Get event details before deleting
      const getQuery = `SELECT title FROM events WHERE id = $1`;
      const eventResult = await db.query(getQuery, [id]);
      
      const query = `DELETE FROM events WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        // Delete only notifications for this specific event
        if (eventResult.success && eventResult.data.length > 0) {
          const eventTitle = eventResult.data[0].title;
          try {
            await deleteNotificationsByTitle(db, 'event', eventTitle);
            console.log(`[NOTIFICATION] Deleted notifications for event: ${eventTitle}`);
          } catch (notifError) {
            console.error('[NOTIFICATION ERROR] Failed to delete notifications:', notifError.message);
          }
        }
        
        return c.json({
          success: true,
          message: "Event deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Event not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete event",
        error: error3.message
      }, 500);
    }
  }));

  // ==================== WORKSHOPS CRUD ====================
  app.get("/admin/workshops", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 6, search } = c.req.query();
    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (search) {
        whereConditions.push(`(title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++})`);
        params.push(`%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM workshops ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, title, description, instructor, start_date, end_date, venue, duration,
               price, max_participants, current_participants, image_url, active,
               meta_title, meta_description, meta_keywords, slug, og_title, 
               og_description, og_image, created_at, updated_at
        FROM workshops 
        ${whereClause}
        ORDER BY start_date DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const workshops = result.success ? result.data.map(w => ({
        ...w,
        startDate: w.start_date,
        endDate: w.end_date,
        imageUrl: w.image_url,
        maxParticipants: w.max_participants,
        currentParticipants: w.current_participants,
        metaTitle: w.meta_title,
        metaDescription: w.meta_description,
        metaKeywords: w.meta_keywords,
        ogTitle: w.og_title,
        ogDescription: w.og_description,
        ogImage: w.og_image,
        createdAt: w.created_at,
        updatedAt: w.updated_at
      })) : [];
      return c.json({
        success: true,
        message: "Workshops fetched successfully",
        data: workshops,
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
        message: "Failed to fetch workshops",
        error: error3.message
      }, 500);
    }
  }));
  app.post("/admin/workshops", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const workshopData = await c.req.json();
    
    console.log('🔍 Backend received workshop data:', {
      max_participants: workshopData.max_participants,
      max_participants_type: typeof workshopData.max_participants,
      price: workshopData.price,
      price_type: typeof workshopData.price
    });
    
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const query = `
        INSERT INTO workshops (
          id, title, description, instructor, start_date, end_date, venue, duration,
          price, max_participants, current_participants, image_url, active,
          meta_title, meta_description, meta_keywords, slug, og_title,
          og_description, og_image, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        workshopData.title,
        workshopData.description || null,
        workshopData.instructor || null,
        workshopData.start_date || null,
        workshopData.end_date || null,
        (workshopData.venue ?? workshopData.venue_name) || null,
        workshopData.duration || null,
        workshopData.price || null,
        workshopData.max_participants || null,
        workshopData.current_participants || 0,
        workshopData.image_url || null,
        workshopData.active !== false,
        workshopData.meta_title || null,
        workshopData.meta_description || null,
        workshopData.meta_keywords || null,
        workshopData.slug || null,
        workshopData.og_title || null,
        workshopData.og_description || null,
        workshopData.og_image || null,
        now,
        now
      ]);
      if (result.success && result.data.length > 0) {
        const workshop = result.data[0];
        
        console.log('[DATABASE] Workshop created:', {
          id: workshop.id,
          max_participants: workshop.max_participants,
          max_participants_type: typeof workshop.max_participants,
          price: workshop.price,
          price_type: typeof workshop.price
        });
        
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
        
        // Create notification for all users
        try {
          const startDate = workshopData.start_date ? new Date(workshopData.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Soon';
          const priceInfo = workshopData.price ? `₹${workshopData.price}` : 'Free';
          const seatsInfo = workshopData.max_participants ? ` | Limited to ${workshopData.max_participants} seats` : '';
          const instructorInfo = workshopData.instructor ? ` with ${workshopData.instructor}` : '';
          const durationInfo = workshopData.duration ? ` (${workshopData.duration})` : '';
          
          await createNotificationForAllUsers(
            db,
            'workshop',
            `New Workshop Available: ${workshopData.title}`,
            `Starting ${startDate}${instructorInfo}${durationInfo}. Fee: ${priceInfo}${seatsInfo}. Register before seats fill up!`,
            '/workshops'
          );
          console.log('[NOTIFICATION] Sent to all users for new workshop');
        } catch (notifError) {
          console.error('[NOTIFICATION ERROR] Failed to send notification:', notifError.message);
        }
        
        return c.json({
          success: true,
          message: "Workshop created successfully",
          data: transformedWorkshop
        }, 201);
      } else {
        throw new Error("Failed to create workshop");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create workshop",
        error: error3.message
      }, 500);
    }
  }));
  app.put("/admin/workshops/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const workshopData = await c.req.json();
    
    console.log('🔍 Backend received workshop update data:', {
      id: id,
      max_participants: workshopData.max_participants,
      max_participants_type: typeof workshopData.max_participants,
      price: workshopData.price,
      price_type: typeof workshopData.price
    });
    
    try {
      const now = new Date().toISOString();
      const query = `
        UPDATE workshops SET
          title = $2, description = $3, instructor = $4, start_date = $5, end_date = $6,
          venue = $7, duration = $8, price = $9, max_participants = $10, current_participants = $11,
          image_url = $12, active = $13, meta_title = $14,
          meta_description = $15, meta_keywords = $16, slug = $17, og_title = $18,
          og_description = $19, og_image = $20, updated_at = $21
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        workshopData.title,
        workshopData.description || null,
        workshopData.instructor || null,
        workshopData.start_date || null,
        workshopData.end_date || null,
        (workshopData.venue ?? workshopData.venue_name) || null,
        workshopData.duration || null,
        workshopData.price || null,
        workshopData.max_participants || null,
        workshopData.current_participants || 0,
        workshopData.image_url || null,
        workshopData.active !== false,
        workshopData.meta_title || null,
        workshopData.meta_description || null,
        workshopData.meta_keywords || null,
        workshopData.slug || null,
        workshopData.og_title || null,
        workshopData.og_description || null,
        workshopData.og_image || null,
        now
      ]);
      if (result.success && result.data.length > 0) {
        const workshop = result.data[0];
        
        console.log('[DATABASE] Workshop updated:', {
          id: workshop.id,
          max_participants: workshop.max_participants,
          max_participants_type: typeof workshop.max_participants,
          price: workshop.price,
          price_type: typeof workshop.price
        });
        
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
          message: "Workshop updated successfully",
          data: transformedWorkshop
        });
      } else {
        throw new Error("Failed to update workshop or workshop not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update workshop",
        error: error3.message
      }, 500);
    }
  }));
  app.delete("/admin/workshops/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      // Get workshop details before deleting
      const getQuery = `SELECT title FROM workshops WHERE id = $1`;
      const workshopResult = await db.query(getQuery, [id]);
      
      const query = `DELETE FROM workshops WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        // Delete only notifications for this specific workshop
        if (workshopResult.success && workshopResult.data.length > 0) {
          const workshopTitle = workshopResult.data[0].title;
          try {
            await deleteNotificationsByTitle(db, 'workshop', workshopTitle);
            console.log(`[NOTIFICATION] Deleted notifications for workshop: ${workshopTitle}`);
          } catch (notifError) {
            console.error('[NOTIFICATION ERROR] Failed to delete notifications:', notifError.message);
          }
        }
        
        return c.json({
          success: true,
          message: "Workshop deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Workshop not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete workshop",
        error: error3.message
      }, 500);
    }
  }));

  // ==================== ARTISTS CRUD ====================
  app.get("/admin/artists", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 6, search, featured } = c.req.query();
    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (featured !== void 0) {
        whereConditions.push(`featured = $${paramIndex++}`);
        params.push(featured === "true");
      }
      if (search) {
        whereConditions.push(`(name ILIKE $${paramIndex++} OR bio ILIKE $${paramIndex++})`);
        params.push(`%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM artists ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, name, bio, specialization, email, phone, website, image_url,
               social_links, featured, active, meta_title, meta_description,
               meta_keywords, slug, og_title, og_description, og_image,
               created_at, updated_at
        FROM artists 
        ${whereClause}
        ORDER BY featured DESC, created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const artists = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Artists fetched successfully",
        data: artists,
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
        message: "Failed to fetch artists",
        error: error3.message
      }, 500);
    }
  }));
  app.post("/admin/artists", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const artistData = await c.req.json();
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const query = `
        INSERT INTO artists (
          id, name, bio, specialization, email, phone, website, image_url,
          social_links, featured, active, meta_title, meta_description,
          meta_keywords, slug, og_title, og_description, og_image,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        artistData.name,
        artistData.bio || null,
        artistData.specialization || null,
        artistData.email || null,
        artistData.phone || null,
        artistData.website || null,
        artistData.image_url || null,
        artistData.social_links || null,
        artistData.featured || false,
        artistData.active !== false,
        artistData.meta_title || null,
        artistData.meta_description || null,
        artistData.meta_keywords || null,
        artistData.slug || null,
        artistData.og_title || null,
        artistData.og_description || null,
        artistData.og_image || null,
        now,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Artist created successfully",
          data: result.data[0]
        }, 201);
      } else {
        throw new Error("Failed to create artist");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create artist",
        error: error3.message
      }, 500);
    }
  }));
  app.put("/admin/artists/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const artistData = await c.req.json();
    try {
      const now = new Date().toISOString();
      const query = `
        UPDATE artists SET
          name = $2, bio = $3, specialization = $4, email = $5, phone = $6,
          website = $7, image_url = $8, social_links = $9, featured = $10,
          active = $11, meta_title = $12, meta_description = $13,
          meta_keywords = $14, slug = $15, og_title = $16, og_description = $17,
          og_image = $18, updated_at = $19
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        artistData.name,
        artistData.bio || null,
        artistData.specialization || null,
        artistData.email || null,
        artistData.phone || null,
        artistData.website || null,
        artistData.image_url || null,
        artistData.social_links || null,
        artistData.featured || false,
        artistData.active !== false,
        artistData.meta_title || null,
        artistData.meta_description || null,
        artistData.meta_keywords || null,
        artistData.slug || null,
        artistData.og_title || null,
        artistData.og_description || null,
        artistData.og_image || null,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Artist updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update artist or artist not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update artist",
        error: error3.message
      }, 500);
    }
  }));
  app.delete("/admin/artists/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      const query = `DELETE FROM artists WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Artist deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Artist not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete artist",
        error: error3.message
      }, 500);
    }
  }));

  // ==================== BLOGS CRUD ====================
  app.get("/admin/blogs", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 10, search, featured, published } = c.req.query();
    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (featured !== void 0) {
        whereConditions.push(`featured = $${paramIndex++}`);
        params.push(featured === "true");
      }
      if (published !== void 0) {
        whereConditions.push(`published = $${paramIndex++}`);
        params.push(published === "true");
      }
      if (search) {
        whereConditions.push(`(title ILIKE $${paramIndex++} OR content ILIKE $${paramIndex++})`);
        params.push(`%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM blogs ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, title, content, excerpt, author, category, tags, image_url,
               published, featured, read_time, meta_title, meta_description,
               meta_keywords, slug, og_title, og_description, og_image,
               created_at, updated_at
        FROM blogs 
        ${whereClause}
        ORDER BY featured DESC, created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const blogs = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Blogs fetched successfully",
        data: blogs,
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
        message: "Failed to fetch blogs",
        error: error3.message
      }, 500);
    }
  }));
  app.post("/admin/blogs", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const blogData = await c.req.json();
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const query = `
        INSERT INTO blogs (
          id, title, content, excerpt, author, category, tags, image_url,
          published, featured, read_time, meta_title, meta_description,
          meta_keywords, slug, og_title, og_description, og_image,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        blogData.title,
        blogData.content || null,
        blogData.excerpt || null,
        blogData.author || null,
        blogData.category || null,
        blogData.tags || null,
        blogData.image_url || null,
        blogData.published || false,
        blogData.featured || false,
        blogData.read_time || null,
        blogData.meta_title || null,
        blogData.meta_description || null,
        blogData.meta_keywords || null,
        blogData.slug || null,
        blogData.og_title || null,
        blogData.og_description || null,
        blogData.og_image || null,
        now,
        now
      ]);
      if (result.success && result.data.length > 0) {
        // Create notification for all users
        try {
          const authorInfo = blogData.author || 'Kalakritam Team';
          const categoryInfo = blogData.category ? ` | ${blogData.category}` : '';
          const readTimeInfo = blogData.read_time ? ` | ${blogData.read_time} min read` : '';
          const excerptInfo = blogData.excerpt ? ` - ${blogData.excerpt.substring(0, 80)}${blogData.excerpt.length > 80 ? '...' : ''}` : '';
          
          await createNotificationForAllUsers(
            db,
            'blog',
            `New Article Published: ${blogData.title}`,
            `By ${authorInfo}${categoryInfo}${readTimeInfo}${excerptInfo}. Dive into this insightful article now!`,
            '/blogs'
          );
          console.log('[NOTIFICATION] Sent to all users for new blog');
        } catch (notifError) {
          console.error('[NOTIFICATION ERROR] Failed to send notification:', notifError.message);
        }
        
        return c.json({
          success: true,
          message: "Blog created successfully",
          data: result.data[0]
        }, 201);
      } else {
        throw new Error("Failed to create blog");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create blog",
        error: error3.message
      }, 500);
    }
  }));
  app.put("/admin/blogs/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const blogData = await c.req.json();
    try {
      const now = new Date().toISOString();
      const query = `
        UPDATE blogs SET
          title = $2, content = $3, excerpt = $4, author = $5, category = $6,
          tags = $7, image_url = $8, published = $9, featured = $10,
          read_time = $11, meta_title = $12, meta_description = $13,
          meta_keywords = $14, slug = $15, og_title = $16, og_description = $17,
          og_image = $18, updated_at = $19
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        blogData.title,
        blogData.content || null,
        blogData.excerpt || null,
        blogData.author || null,
        blogData.category || null,
        blogData.tags || null,
        blogData.image_url || null,
        blogData.published || false,
        blogData.featured || false,
        blogData.read_time || null,
        blogData.meta_title || null,
        blogData.meta_description || null,
        blogData.meta_keywords || null,
        blogData.slug || null,
        blogData.og_title || null,
        blogData.og_description || null,
        blogData.og_image || null,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Blog updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update blog or blog not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update blog",
        error: error3.message
      }, 500);
    }
  }));
  app.delete("/admin/blogs/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      // Get blog details before deleting
      const getQuery = `SELECT title FROM blogs WHERE id = $1`;
      const blogResult = await db.query(getQuery, [id]);
      
      const query = `DELETE FROM blogs WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        // Delete only notifications for this specific blog
        if (blogResult.success && blogResult.data.length > 0) {
          const blogTitle = blogResult.data[0].title;
          try {
            await deleteNotificationsByTitle(db, 'blog', blogTitle);
            console.log(`[NOTIFICATION] Deleted notifications for blog: ${blogTitle}`);
          } catch (notifError) {
            console.error('[NOTIFICATION ERROR] Failed to delete notifications:', notifError.message);
          }
        }
        
        return c.json({
          success: true,
          message: "Blog deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Blog not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete blog",
        error: error3.message
      }, 500);
    }
  }));

  // ==================== IMAGES CRUD (ArtParty) ====================
  app.get("/admin/images", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 20, search, category, featured } = c.req.query();
    try {
      // Ensure images table exists
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
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (category) {
        whereConditions.push(`LOWER(category) = LOWER($${paramIndex++})`);
        params.push(category);
      }
      if (featured !== void 0) {
        whereConditions.push(`featured = $${paramIndex++}`);
        params.push(featured === "true");
      }
      if (search) {
        whereConditions.push(`(title ILIKE $${paramIndex++} OR description ILIKE $${paramIndex++} OR alt_text ILIKE $${paramIndex++})`);
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM images ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, title, description, image_url, alt_text, category,
               tags, featured, created_at, updated_at
        FROM images
        ${whereClause}
        ORDER BY featured DESC, created_at DESC
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const items = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Images fetched successfully",
        data: items,
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
        message: "Failed to fetch images",
        error: error3.message
      }, 500);
    }
  }));
  app.post("/admin/images", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const body = await c.req.json();
    try {
      // Ensure images table exists
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
      const id = crypto.randomUUID();
      const now = (new Date()).toISOString();
      const query = `
        INSERT INTO images (
          id, title, description, image_url, alt_text, category,
          tags, featured, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        body.title || null,
        body.description || null,
        body.image_url || body.imageUrl || null,
        body.altText || null,
        body.category || 'artparty',
        Array.isArray(body.tags) ? JSON.stringify(body.tags) : (body.tags || []),
        body.featured || false,
        now,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Image created successfully",
          data: result.data[0]
        }, 201);
      } else {
        throw new Error("Failed to create image");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to create image",
        error: error3.message
      }, 500);
    }
  }));
  app.put("/admin/images/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const body = await c.req.json();
    try {
      // Ensure images table exists
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
      const now = (new Date()).toISOString();
      const query = `
        UPDATE images SET
          title = $2, description = $3, image_url = $4, alt_text = $5,
          category = $6, tags = $7, featured = $8, updated_at = $9
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        body.title || null,
        body.description || null,
        body.image_url || body.imageUrl || null,
        body.altText || null,
        body.category || 'artparty',
        Array.isArray(body.tags) ? JSON.stringify(body.tags) : (body.tags || []),
        body.featured || false,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Image updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update image or image not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update image",
        error: error3.message
      }, 500);
    }
  }));
  app.delete("/admin/images/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      // Ensure images table exists
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
      const query = `DELETE FROM images WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Image deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Image not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete image",
        error: error3.message
      }, 500);
    }
  }));

  // ==================== CONTACTS CRUD ====================
  app.get("/admin/contacts", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 10, search, status } = c.req.query();
    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;
      if (status) {
        whereConditions.push(`status = $${paramIndex++}`);
        params.push(status);
      }
      if (search) {
        whereConditions.push(`(name ILIKE $${paramIndex++} OR email ILIKE $${paramIndex++} OR subject ILIKE $${paramIndex++})`);
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
      const countQuery = `SELECT COUNT(*) as total FROM contacts ${whereClause}`;
      const countResult = await db.query(countQuery, params);
      const total = countResult.success ? parseInt(countResult.data[0]?.total || 0) : 0;
      const offset = (page - 1) * limit;
      params.push(limit, offset);
      const query = `
        SELECT id, name, email, phone, subject, message, status, is_read,
               created_at, updated_at
        FROM contacts 
        ${whereClause}
        ORDER BY created_at DESC 
        LIMIT $${paramIndex++} OFFSET $${paramIndex++}
      `;
      const result = await db.query(query, params);
      const contacts = result.success ? result.data : [];
      return c.json({
        success: true,
        message: "Contacts fetched successfully",
        data: contacts,
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
        message: "Failed to fetch contacts",
        error: error3.message
      }, 500);
    }
  }));
  app.put("/admin/contacts/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    const contactData = await c.req.json();
    try {
      const now = new Date().toISOString();
      const query = `
        UPDATE contacts SET
          status = $2, is_read = $3, updated_at = $4
        WHERE id = $1
        RETURNING *
      `;
      const result = await db.query(query, [
        id,
        contactData.status || "new",
        contactData.is_read !== false,
        now
      ]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Contact updated successfully",
          data: result.data[0]
        });
      } else {
        throw new Error("Failed to update contact or contact not found");
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update contact",
        error: error3.message
      }, 500);
    }
  }));
  app.delete("/admin/contacts/:id", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const id = c.req.param("id");
    try {
      const query = `DELETE FROM contacts WHERE id = $1 RETURNING *`;
      const result = await db.query(query, [id]);
      if (result.success && result.data.length > 0) {
        return c.json({
          success: true,
          message: "Contact deleted successfully"
        });
      } else {
        return c.json({
          success: false,
          message: "Contact not found"
        }, 404);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to delete contact",
        error: error3.message
      }, 500);
    }
  }));
}
