import { createDatabase } from "../db/index.js";
import { catchAsync } from "../utils/catchAsync.js";
import { hashPassword, comparePassword, authenticateToken } from "../middleware/auth.js";

export function setupDebugRoutes(app) {
  app.use("/debug/*", async (c, next) => {
    if (c.env?.NODE_ENV === "production") {
      return c.json({ success: false, message: "Not found" }, 404);
    }
    await next();
  });
  app.post("/debug/fix-admin-password", catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const passwordHash = await hashPassword("admin123");
      const updateResult = await db.query(
        "UPDATE admin_users SET password = $1 WHERE email = $2 RETURNING id, name, email, role",
        [passwordHash, "admin@kalakritam.in"]
      );
      return c.json({
        success: true,
        message: "Admin password hash updated successfully",
        data: {
          updated: updateResult.data?.[0] || null,
          passwordHashLength: passwordHash?.length || 0,
          rowsAffected: updateResult.data?.length || 0
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update admin password",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/debug/all-tables-check", catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const tables = ["events", "workshops", "artists", "blogs", "contacts", "tickets"];
      const results = {};
      for (const tableName of tables) {
        try {
          const structure = await db.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = $1 AND table_schema = 'public'
            ORDER BY ordinal_position
          `, [tableName]);
          const count3 = await db.query(`SELECT COUNT(*) as total FROM ${tableName}`);
          const sample = await db.query(`SELECT * FROM ${tableName} LIMIT 3`);
          results[tableName] = {
            structure,
            count: count3,
            sampleData: sample
          };
        } catch (error3) {
          results[tableName] = {
            error: error3.message
          };
        }
      }
      return c.json({
        success: true,
        message: "All tables structure check",
        data: results
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Tables check failed",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/debug/artworks-check", catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const artworksTableCheck = await db.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'artworks' AND table_schema = 'public'
        ORDER BY ordinal_position
      `);
      const artworksCount = await db.query("SELECT COUNT(*) as total FROM artworks");
      const artworksData = await db.query("SELECT * FROM artworks LIMIT 10");
      const galleryTableCheck = await db.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'gallery' AND table_schema = 'public'
        ORDER BY ordinal_position
      `);
      const galleryCount = await db.query("SELECT COUNT(*) as total FROM gallery");
      const galleryData = await db.query("SELECT * FROM gallery LIMIT 10");
      return c.json({
        success: true,
        message: "Artworks and Gallery table check",
        data: {
          artworks: {
            structure: artworksTableCheck,
            count: artworksCount,
            sampleData: artworksData
          },
          gallery: {
            structure: galleryTableCheck,
            count: galleryCount,
            sampleData: galleryData
          }
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Artworks check failed",
        error: error3.message,
        stack: error3.stack
      }, 500);
    }
  }));
  app.get("/debug/db-complete", catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const testQuery = await db.query("SELECT NOW() as current_time, version() as pg_version");
      const tablesQuery = await db.query(`
        SELECT table_name, table_schema 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `);
      const adminTableCheck = await db.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'admin_users' AND table_schema = 'public'
        ORDER BY ordinal_position
      `);
      const adminUsers = await db.query("SELECT id, name, email, role, active, created_at FROM admin_users");
      const adminCount = await db.query("SELECT COUNT(*) as total FROM admin_users");
      return c.json({
        success: true,
        message: "Complete database debug",
        data: {
          environment: {
            hasEnvironment: !!c.env,
            hasDatabaseUrl: !!c.env?.DATABASE_URL,
            databaseUrl: c.env?.DATABASE_URL?.substring(0, 80) + "...",
            nodeEnv: c.env?.NODE_ENV || "unknown"
          },
          connectivity: testQuery,
          schema: {
            allTables: tablesQuery,
            adminTableStructure: adminTableCheck
          },
          adminData: {
            count: adminCount,
            users: adminUsers
          }
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Complete database debug failed",
        error: error3.message,
        stack: error3.stack
      }, 500);
    }
  }));
  app.post("/debug/test-password", catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const adminResult = await db.query("SELECT * FROM admin_users WHERE email = $1", ["admin@kalakritam.in"]);
      if (!adminResult.success || adminResult.data.length === 0) {
        return c.json({
          success: false,
          message: "Admin user not found"
        }, 404);
      }
      const admin = adminResult.data[0];
      const testPassword = "admin123";
      const isValid2 = await comparePassword(testPassword, admin.password_hash);
      const newHash = await hashPassword(testPassword);
      return c.json({
        success: true,
        message: "Password test results",
        data: {
          admin: {
            id: admin.id,
            email: admin.email,
            hasPasswordHash: !!admin.password_hash,
            passwordHashLength: admin.password_hash?.length || 0
          },
          passwordTest: {
            testPassword,
            isValid: isValid2,
            storedHashLength: admin.password_hash?.length,
            newHashLength: newHash?.length,
            hashesMatch: admin.password_hash === newHash
          }
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Password test failed",
        error: error3.message,
        stack: error3.stack
      }, 500);
    }
  }));
  app.post("/debug/fix-admin-email", catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const updateResult = await db.query(
        "UPDATE admin_users SET email = $1 WHERE email = $2 RETURNING id, name, email, role",
        ["admin@kalakritam.in", "admin@kalakritam.com"]
      );
      return c.json({
        success: true,
        message: "Admin email updated successfully",
        data: {
          updated: updateResult.data?.[0] || null,
          rowsAffected: updateResult.data?.length || 0
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to update admin email",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/debug/db-direct", catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const testQuery = await db.query("SELECT 1 as test");
      const adminCheck = await db.query("SELECT COUNT(*) as count FROM admin_users");
      const adminList = await db.query("SELECT id, name, email, role, active, created_at FROM admin_users LIMIT 5");
      return c.json({
        success: true,
        message: "Direct database test",
        data: {
          basicTest: testQuery,
          adminCount: adminCheck,
          adminUsers: adminList,
          hasEnvironment: !!c.env,
          hasDatabaseUrl: !!c.env?.DATABASE_URL,
          databaseUrl: c.env?.DATABASE_URL?.substring(0, 50) + "..."
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Database test failed",
        error: error3.message,
        stack: error3.stack
      }, 500);
    }
  }));
  app.post("/debug/init-database", catchAsync(async (c) => {
    try {
      const db = createDatabase(c.env);
      const existingAdmins = await db.query("SELECT COUNT(*) as count FROM admin_users WHERE active = true");
      if (existingAdmins.success && existingAdmins.data[0]?.count > 0) {
        return c.json({
          success: false,
          message: "Database already initialized with admin users"
        }, 409);
      }
      const createAdminUsersTable = `
        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'moderator', 'editor')),
          avatar TEXT,
          permissions JSONB DEFAULT '[]',
          active BOOLEAN DEFAULT true,
          created_by INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP WITH TIME ZONE,
          last_logout TIMESTAMP WITH TIME ZONE
        )
      `;
      await db.query(createAdminUsersTable);
      const createGalleryTable = `
        CREATE TABLE IF NOT EXISTS gallery (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          image_url TEXT NOT NULL,
          thumbnail_url TEXT,
          artist_name VARCHAR(255),
          artwork_type VARCHAR(100),
          medium VARCHAR(100),
          dimensions VARCHAR(100),
          year_created INTEGER,
          price DECIMAL(10,2),
          tags TEXT[],
          featured BOOLEAN DEFAULT false,
          active BOOLEAN DEFAULT true,
          created_by INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await db.query(createGalleryTable);
      const passwordHash = await hashPassword("admin123");
      const insertAdmin = await db.query(`
        INSERT INTO admin_users (name, email, password_hash, role, permissions, active, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, name, email, role, created_at
      `, [
        "Kalakritam Admin",
        "admin@kalakritam.com",
        passwordHash,
        "admin",
        JSON.stringify(["all"]),
        true,
        new Date().toISOString()
      ]);
      if (!insertAdmin.success) {
        throw new Error("Failed to create admin user");
      }
      return c.json({
        success: true,
        message: "Database initialized successfully",
        data: {
          adminUser: insertAdmin.data[0],
          credentials: {
            email: "admin@kalakritam.com",
            password: "admin123"
          }
        }
      });
    } catch (error3) {
      console.error("Database initialization error:", error3);
      return c.json({
        success: false,
        message: "Database initialization failed",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/debug/info", authenticateToken, catchAsync(async (c) => {
    try {
      return c.json({
        success: true,
        message: "Debug information",
        data: {
          environment: c.env?.NODE_ENV || "unknown",
          timestamp: new Date().toISOString(),
          hasDatabase: !!c.env?.DATABASE_URL,
          hasR2: !!c.env?.R2_BUCKET,
          hasKV: !!c.env?.CACHE_KV,
          userAgent: c.req.header("user-agent"),
          ip: c.req.header("cf-connecting-ip") || "unknown"
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to get debug info",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/debug/test-db", authenticateToken, catchAsync(async (c) => {
    try {
      return c.json({
        success: true,
        message: "Database test completed",
        data: {
          connected: true,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Database test failed",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/debug/test-r2", authenticateToken, catchAsync(async (c) => {
    try {
      return c.json({
        success: true,
        message: "R2 test completed",
        data: {
          connected: true,
          bucket: c.env?.R2_BUCKET ? "available" : "not configured"
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "R2 test failed",
        error: error3.message
      }, 500);
    }
  }));
  app.get("/debug/health", authenticateToken, catchAsync(async (c) => {
    try {
      return c.json({
        success: true,
        message: "System health check",
        data: {
          status: "healthy",
          uptime: "0d 0h 0m 0s",
          memory: "N/A (Workers)",
          timestamp: new Date().toISOString()
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Health check failed",
        error: error3.message
      }, 500);
    }
  }));
}
