import { Hono } from "hono";
import { cors } from "hono/cors";
import { createDatabase } from "./db/index.js";
import { catchAsync } from "./utils/catchAsync.js";

import { setupAuthRoutes } from "./routes/auth.js";
import { setupUserAuthRoutes } from "./routes/user-auth.js";
import { setupGalleryRoutes } from "./routes/gallery.js";
import { setupEventsRoutes } from "./routes/events.js";
import { setupWorkshopsRoutes } from "./routes/workshops.js";
import { setupArtistsRoutes } from "./routes/artists.js";
import { setupBlogsRoutes } from "./routes/blogs.js";
import { setupContactRoutes } from "./routes/contact.js";
import { setupTicketsRoutes } from "./routes/tickets.js";
import { setupHeroBannersRoutes } from "./routes/hero-banners.js";
import { setupNewsletterRoutes } from "./routes/newsletter.js";
import { setupUploadRoutes } from "./routes/upload.js";
import { setupImageRoutes } from "./routes/images.js";
import { setupDebugRoutes } from "./routes/debug.js";
import { setupMomentsRoutes } from "./routes/moments.js";
import { setupAdminSystemRoutes } from "./routes/admin/system.js";
import { setupAdminDashboardRoutes } from "./routes/admin/dashboard.js";
import { setupAdminCrudRoutes } from "./routes/admin/index.js";

const app = new Hono();

// CORS
app.use("/*", cors({
  origin: [
    "https://kalakritam.in",
    "https://www.kalakritam.in",
    "https://staging.kalakritam.in",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  maxAge: 86400
}));

// Health check
app.get("/health", catchAsync(async (c) => {
  const db = createDatabase(c.env);
  const result = await db.healthCheck();
  return c.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    environment: c.env?.NODE_ENV || "production",
    version: "2.0.0",
    database: result.success ? "connected" : "disconnected"
  });
}));

// API info
app.get("/api/info", (c) => {
  return c.json({
    success: true,
    message: "Kalakritam API",
    version: "2.0.0",
    environment: c.env?.NODE_ENV || "production",
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: "/auth/*",
      userAuth: "/api/auth/*",
      gallery: "/gallery",
      events: "/events",
      workshops: "/workshops",
      artists: "/artists",
      blogs: "/blogs",
      contact: "/contact",
      tickets: "/tickets",
      heroBanners: "/hero-banners",
      newsletter: "/newsletter/*",
      upload: "/upload/*",
      images: "/images/*",
      moments: "/moments",
      artparty: "/artparty/images",
      admin: "/admin/*",
      health: "/health",
      debug: "/debug/*"
    }
  });
});

// Test database connection
app.get("/test-db", catchAsync(async (c) => {
  const db = createDatabase(c.env);
  const result = await db.healthCheck();
  return c.json(result);
}));

// Register all route groups
setupAuthRoutes(app);
setupUserAuthRoutes(app);
setupGalleryRoutes(app);
setupEventsRoutes(app);
setupWorkshopsRoutes(app);
setupArtistsRoutes(app);
setupBlogsRoutes(app);
setupContactRoutes(app);
setupTicketsRoutes(app);
setupHeroBannersRoutes(app);
setupNewsletterRoutes(app);
setupUploadRoutes(app);
setupImageRoutes(app);
setupDebugRoutes(app);
setupMomentsRoutes(app);
setupAdminSystemRoutes(app);
setupAdminDashboardRoutes(app);
setupAdminCrudRoutes(app);

// Catch-all 404
app.all("*", (c) => {
  return c.json({ success: false, message: "Not found" }, 404);
});

export default app;
