import { createDatabase } from "../../db/index.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { authenticateToken, requireAdmin, comparePassword, generateToken, hashPassword } from "../../middleware/auth.js";

export function setupAdminSystemRoutes(app) {
  app.post("/admin/login", catchAsync(async (c) => {
    const { email, password } = await c.req.json();
    const db = createDatabase(c.env);
    try {
      const userResult = await db.query(
        "SELECT * FROM admin_users WHERE email = $1 AND active = true",
        [email]
      );
      if (!userResult.success || userResult.data.length === 0) {
        return c.json({
          success: false,
          message: "Invalid credentials"
        }, 401);
      }
      const user = userResult.data[0];
      const storedPassword = user.password;
      if (!storedPassword) {
        return c.json({
          success: false,
          message: "Invalid credentials"
        }, 401);
      }
      const isValidPassword = await comparePassword(password, storedPassword);
      if (!isValidPassword && password === storedPassword) {
      } else if (!isValidPassword) {
        return c.json({
          success: false,
          message: "Invalid credentials"
        }, 401);
      }
      await db.query(
        "UPDATE admin_users SET last_login = NOW() WHERE id = $1",
        [user.id]
      );
      const tokenPayload = {
        userId: user.id,
        id: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1e3),
        exp: Math.floor(Date.now() / 1e3) + 24 * 60 * 60
      };
      const token = await generateToken(tokenPayload, c.env.JWT_SECRET);
      return c.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } catch (error3) {
      console.error("Login error:", error3);
      return c.json({
        success: false,
        message: "Login failed"
      }, 500);
    }
  }));
  app.get("/admin/me", authenticateToken, catchAsync(async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({
        success: false,
        message: "User not found"
      }, 401);
    }
    return c.json({
      success: true,
      user: {
        id: user.id || user.userId,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  }));
  app.use("/admin/*", authenticateToken);
  app.get("/admin/health", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    try {
      const [healthCheck, stats] = await Promise.all([
        db.healthCheck(),
        db.getStats()
      ]);
      return c.json({
        success: true,
        message: "System health check completed",
        data: {
          database: healthCheck.data,
          statistics: stats.success ? stats.data : null,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Health check failed",
        data: {
          database: { status: "unhealthy" },
          timestamp: new Date().toISOString()
        }
      }, 500);
    }
  }));
  app.get("/admin/audit-logs", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    const { page = 1, limit = 50, action = "", user_id = "" } = c.req.query();
    try {
      const filters = {};
      if (action)
        filters.action = action;
      if (user_id)
        filters.user_id = user_id;
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        filters,
        orderBy: "created_at DESC"
      };
      const result = await db.list("audit_logs", options);
      return c.json({
        success: true,
        message: "Audit logs fetched successfully",
        data: result.success ? result.data : [],
        pagination: result.success ? result.pagination : null
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch audit logs"
      }, 500);
    }
  }));
  app.get("/admin/export/:table", requireAdmin, catchAsync(async (c) => {
    const table3 = c.req.param("table");
    const db = createDatabase(c.env);
    const { format = "json" } = c.req.query();
    const allowedTables = [
      "gallery_items",
      "events",
      "workshops",
      "artists",
      "blogs",
      "contact_submissions",
      "tickets"
    ];
    if (!allowedTables.includes(table3)) {
      return c.json({
        success: false,
        message: "Table not allowed for export"
      }, 400);
    }
    try {
      const result = await db.query(`SELECT * FROM ${table3} ORDER BY created_at DESC`);
      if (!result.success) {
        return c.json({
          success: false,
          message: "Failed to export data"
        }, 500);
      }
      if (format === "csv") {
        if (result.data.length === 0) {
          return new Response("", {
            headers: {
              "Content-Type": "text/csv",
              "Content-Disposition": `attachment; filename="${table3}.csv"`
            }
          });
        }
        const headers = Object.keys(result.data[0]);
        const csvContent = [
          headers.join(","),
          ...result.data.map(
            (row) => headers.map(
              (header) => JSON.stringify(row[header] || "")
            ).join(",")
          )
        ].join("\n");
        return new Response(csvContent, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="${table3}.csv"`
          }
        });
      }
      return c.json({
        success: true,
        message: "Data exported successfully",
        data: result.data,
        meta: {
          table: table3,
          count: result.data.length,
          exported_at: new Date().toISOString()
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to export data"
      }, 500);
    }
  }));
}
