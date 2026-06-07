import { createDatabase } from "../db/index.js";

async function importKey(secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  return await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64UrlEncode(buffer) {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64UrlDecode(str) {
  str += "=".repeat((4 - str.length % 4) % 4);
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function generateToken(payload, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const encoder = new TextEncoder();
  const encodedHeader = base64UrlEncode(encoder.encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const data = encoder.encode(`${encodedHeader}.${encodedPayload}`);
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, data);
  const encodedSignature = base64UrlEncode(signature);
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export async function verifyToken(token, secret) {
  try {
    const [headerB64, payloadB64, signatureB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !signatureB64) return null;
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const key = await importKey(secret);
    const signature = base64UrlDecode(signatureB64);
    const isValid = await crypto.subtle.verify("HMAC", key, signature, data);
    if (!isValid) return null;
    const payloadBytes = base64UrlDecode(payloadB64);
    const payloadStr = new TextDecoder().decode(payloadBytes);
    const payload = JSON.parse(payloadStr);
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export async function hashPassword(password, salt = null) {
  const encoder = new TextEncoder();
  if (!salt) salt = crypto.getRandomValues(new Uint8Array(16));
  else if (typeof salt === "string") salt = encoder.encode(salt);
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveBits"]);
  const hashBuffer = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, keyMaterial, 256);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const saltArray = Array.from(new Uint8Array(salt));
  return btoa(String.fromCharCode(...saltArray.concat(hashArray)));
}

export async function comparePassword(password, hash) {
  try {
    const combined = Uint8Array.from(atob(hash), (c) => c.charCodeAt(0));
    const salt = combined.slice(0, 16);
    const storedHash = combined.slice(16);
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "PBKDF2" }, false, ["deriveBits"]);
    const hashBuffer = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" }, keyMaterial, 256);
    const computedHash = new Uint8Array(hashBuffer);
    if (computedHash.length !== storedHash.length) return false;
    let result = 0;
    for (let i = 0; i < computedHash.length; i++) result |= computedHash[i] ^ storedHash[i];
    return result === 0;
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
}

export async function authenticateToken(c, next) {
  try {
    const authHeader = c.req.header("authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return c.json({ success: false, message: "Access token is required" }, 401);
    const secret = c.env?.JWT_SECRET;
    if (!secret) return c.json({ success: false, message: "JWT secret is not configured" }, 500);
    const payload = await verifyToken(token, secret);
    if (!payload) return c.json({ success: false, message: "Invalid or expired token" }, 403);
    const db = createDatabase(c.env);
    const userResult = await db.query("SELECT * FROM admin_users WHERE id = $1 AND active = true", [payload.userId]);
    if (!userResult.success || userResult.data.length === 0) return c.json({ success: false, message: "User not found" }, 403);
    c.set("user", userResult.data[0]);
    c.set("isAuthenticated", true);
    await next();
  } catch (error) {
    console.error("Authentication error:", error);
    return c.json({ success: false, message: "Authentication failed" }, 500);
  }
}

export async function authenticateUser(c, next) {
  try {
    const authHeader = c.req.header("authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return c.json({ success: false, message: "Access token is required" }, 401);
    const secret = c.env?.JWT_SECRET;
    if (!secret) return c.json({ success: false, message: "JWT secret is not configured" }, 500);
    const payload = await verifyToken(token, secret);
    if (!payload) return c.json({ success: false, message: "Invalid or expired token" }, 403);
    const db = createDatabase(c.env);
    const userResult = await db.query("SELECT * FROM users WHERE id = $1 AND is_active = true", [payload.userId]);
    if (!userResult.success || userResult.data.length === 0) return c.json({ success: false, message: "User not found" }, 403);
    c.set("user", payload);
    c.set("isAuthenticated", true);
    await next();
  } catch (error) {
    console.error("User authentication error:", error);
    return c.json({ success: false, message: "Authentication failed" }, 500);
  }
}

export async function authenticateAdminOrUser(c, next) {
  try {
    const authHeader = c.req.header("authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return c.json({ success: false, message: "Access token is required" }, 401);
    const secret = c.env?.JWT_SECRET;
    if (!secret) return c.json({ success: false, message: "JWT secret is not configured" }, 500);
    const payload = await verifyToken(token, secret);
    if (!payload) return c.json({ success: false, message: "Invalid or expired token" }, 403);
    const db = createDatabase(c.env);
    let userResult = await db.query("SELECT * FROM admin_users WHERE id = $1 AND active = true", [payload.userId]);
    if (!userResult.success || userResult.data.length === 0) {
      userResult = await db.query("SELECT * FROM users WHERE id = $1 AND is_active = true", [payload.userId]);
    }
    if (!userResult.success || userResult.data.length === 0) return c.json({ success: false, message: "User not found" }, 403);
    c.set("user", payload);
    c.set("isAuthenticated", true);
    await next();
  } catch (error) {
    console.error("Admin/User authentication error:", error);
    return c.json({ success: false, message: "Authentication failed" }, 500);
  }
}

export async function optionalAuth(c, next) {
  try {
    const authHeader = c.req.header("authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (token) {
      const secret = c.env?.JWT_SECRET;
      if (secret) {
        const payload = await verifyToken(token, secret);
        if (payload) {
          const db = createDatabase(c.env);
          const userResult = await db.query("SELECT * FROM admin_users WHERE id = $1 AND active = true", [payload.userId]);
          if (userResult.success && userResult.data.length > 0) {
            c.set("user", userResult.data[0]);
            c.set("isAuthenticated", true);
          }
        }
      }
    }
    if (!c.get("isAuthenticated")) { c.set("user", null); c.set("isAuthenticated", false); }
    await next();
  } catch (error) {
    console.error("Optional auth error:", error);
    c.set("user", null); c.set("isAuthenticated", false);
    await next();
  }
}

export async function requireAdmin(c, next) {
  const user = c.get("user");
  if (!user || user.role !== "admin") return c.json({ success: false, message: "Admin access required" }, 403);
  await next();
}
