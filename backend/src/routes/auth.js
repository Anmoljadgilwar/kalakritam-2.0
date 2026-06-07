import { createDatabase } from "../db/index.js";
import { EmailService } from "../services/email.js";
import { generateOTP } from "../utils/otp.js";
import { generateToken, verifyToken, authenticateToken, authenticateUser, authenticateAdminOrUser, hashPassword, comparePassword } from "../middleware/auth.js";
import { catchAsync } from "../utils/catchAsync.js";
import { validateLogin, validateRegister, validateBody } from "../validation/index.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { z } from "zod";

export function setupAuthRoutes(app) {
  app.use("/auth/*", authRateLimiter());
  app.post("/auth/login", validateLogin, catchAsync(async (c) => {
    const { email, password } = c.get("validatedBody");
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
      const storedPassword = user.password_hash || user.password;
      if (!storedPassword) {
        return c.json({
          success: false,
          message: "Invalid credentials"
        }, 401);
      }
      const isValidPassword = await comparePassword(password, storedPassword);
      if (!isValidPassword) {
        return c.json({
          success: false,
          message: "Invalid credentials"
        }, 401);
      }
      const token = await generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1e3),
        exp: Math.floor(Date.now() / 1e3) + 24 * 60 * 60
        // 24 hours
      }, c.env?.JWT_SECRET);
      await db.query(
        "UPDATE admin_users SET last_login = $1 WHERE id = $2",
        [(new Date()).toISOString(), user.id]
      );
      return c.json({
        success: true,
        message: "Login successful",
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            permissions: user.permissions || [],
            last_login: (new Date()).toISOString()
          }
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
  app.post("/auth/logout", authenticateToken, catchAsync(async (c) => {
    const user = c.get("user");
    const db = createDatabase(c.env);
    try {
      await db.query(
        "UPDATE admin_users SET last_logout = $1 WHERE id = $2",
        [(new Date()).toISOString(), user.id]
      );
      return c.json({
        success: true,
        message: "Logout successful"
      });
    } catch (error3) {
      return c.json({
        success: true,
        message: "Logout successful"
      });
    }
  }));
  app.get("/auth/verify", authenticateToken, catchAsync(async (c) => {
    const user = c.get("user");
    return c.json({
      success: true,
      message: "Token is valid",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          permissions: user.permissions || []
        }
      }
    });
  }));
  app.get("/auth/me", authenticateToken, catchAsync(async (c) => {
    const user = c.get("user");
    const db = createDatabase(c.env);
    try {
      const result = await db.query(
        "SELECT id, email, name, role, avatar, created_at, last_login, permissions FROM admin_users WHERE id = $1",
        [user.id]
      );
      if (!result.success || result.data.length === 0) {
        return c.json({
          success: false,
          message: "User not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "User profile fetched successfully",
        data: {
          user: result.data[0]
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch user profile"
      }, 500);
    }
  }));
  app.put("/auth/profile", authenticateToken, validateBody(z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    avatar: z.string().url("Invalid avatar URL").optional(),
    current_password: z.string().optional(),
    new_password: z.string().min(8, "Password must be at least 8 characters").optional()
  })), catchAsync(async (c) => {
    const user = c.get("user");
    const { name, avatar, current_password, new_password } = c.get("validatedBody");
    const db = createDatabase(c.env);
    try {
      const updates = {};
      const params = [];
      let paramIndex = 1;
      if (name) {
        updates.name = `$${paramIndex++}`;
        params.push(name);
      }
      if (avatar) {
        updates.avatar = `$${paramIndex++}`;
        params.push(avatar);
      }
      if (new_password) {
        if (!current_password) {
          return c.json({
            success: false,
            message: "Current password is required to change password"
          }, 400);
        }
        const userResult = await db.query(
          "SELECT password_hash FROM admin_users WHERE id = $1",
          [user.id]
        );
        if (!userResult.success || userResult.data.length === 0) {
          return c.json({
            success: false,
            message: "User not found"
          }, 404);
        }
        const isValidPassword = await comparePassword(current_password, userResult.data[0].password_hash);
        if (!isValidPassword) {
          return c.json({
            success: false,
            message: "Current password is incorrect"
          }, 400);
        }
        const hashedPassword = await hashPassword(new_password);
        updates.password_hash = `$${paramIndex++}`;
        params.push(hashedPassword);
      }
      if (Object.keys(updates).length === 0) {
        return c.json({
          success: false,
          message: "No valid updates provided"
        }, 400);
      }
      updates.updated_at = `$${paramIndex++}`;
      params.push((new Date()).toISOString());
      params.push(user.id);
      const setClause = Object.entries(updates).map(([key, placeholder]) => `${key} = ${placeholder}`).join(", ");
      const result = await db.query(
        `UPDATE admin_users SET ${setClause} WHERE id = $${paramIndex} RETURNING id, email, name, role, avatar`,
        params
      );
      if (!result.success || result.data.length === 0) {
        return c.json({
          success: false,
          message: "Failed to update profile"
        }, 500);
      }
      return c.json({
        success: true,
        message: "Profile updated successfully",
        data: {
          user: result.data[0]
        }
      });
    } catch (error3) {
      console.error("Profile update error:", error3);
      return c.json({
        success: false,
        message: "Failed to update profile"
      }, 500);
    }
  }));
  app.post("/auth/change-password", authenticateToken, validateBody(z.object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(8, "New password must be at least 8 characters"),
    confirm_password: z.string().min(1, "Password confirmation is required")
  })), catchAsync(async (c) => {
    const user = c.get("user");
    const { current_password, new_password, confirm_password } = c.get("validatedBody");
    const db = createDatabase(c.env);
    if (new_password !== confirm_password) {
      return c.json({
        success: false,
        message: "New password and confirmation do not match"
      }, 400);
    }
    try {
      const userResult = await db.query(
        "SELECT password_hash FROM admin_users WHERE id = $1",
        [user.id]
      );
      if (!userResult.success || userResult.data.length === 0) {
        return c.json({
          success: false,
          message: "User not found"
        }, 404);
      }
      const isValidPassword = await comparePassword(current_password, userResult.data[0].password_hash);
      if (!isValidPassword) {
        return c.json({
          success: false,
          message: "Current password is incorrect"
        }, 400);
      }
      const hashedPassword = await hashPassword(new_password);
      const updateResult = await db.query(
        "UPDATE admin_users SET password_hash = $1, updated_at = $2 WHERE id = $3",
        [hashedPassword, (new Date()).toISOString(), user.id]
      );
      if (!updateResult.success) {
        return c.json({
          success: false,
          message: "Failed to update password"
        }, 500);
      }
      return c.json({
        success: true,
        message: "Password changed successfully"
      });
    } catch (error3) {
      console.error("Password change error:", error3);
      return c.json({
        success: false,
        message: "Failed to change password"
      }, 500);
    }
  }));
  app.post("/auth/refresh", authenticateToken, catchAsync(async (c) => {
    const user = c.get("user");
    try {
      const token = await generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
        iat: Math.floor(Date.now() / 1e3),
        exp: Math.floor(Date.now() / 1e3) + 24 * 60 * 60
        // 24 hours
      }, c.env?.JWT_SECRET);
      return c.json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to refresh token"
      }, 500);
    }
  }));
  app.get("/auth/permissions", authenticateToken, catchAsync(async (c) => {
    const user = c.get("user");
    const db = createDatabase(c.env);
    try {
      const result = await db.query(
        "SELECT permissions FROM admin_users WHERE id = $1",
        [user.id]
      );
      if (!result.success || result.data.length === 0) {
        return c.json({
          success: false,
          message: "User not found"
        }, 404);
      }
      return c.json({
        success: true,
        message: "Permissions fetched successfully",
        data: {
          permissions: result.data[0].permissions || []
        }
      });
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to fetch permissions"
      }, 500);
    }
  }));
}
