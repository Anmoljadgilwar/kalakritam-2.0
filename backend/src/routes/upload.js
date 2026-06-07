import { createDatabase } from "../db/index.js";
import { catchAsync } from "../utils/catchAsync.js";
import { authenticateToken, authenticateAdminOrUser } from "../middleware/auth.js";

export function setupUploadRoutes(app) {
  app.post("/upload/image", authenticateAdminOrUser, catchAsync(async (c) => {
    try {
      const formData = await c.req.formData();
      const file = formData.get("file");
  const folder = formData.get("folder") || "general";
  const providedName = formData.get("name");
      if (!file) {
        return c.json({
          success: false,
          message: "No file provided"
        }, 400);
      }
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm", "video/quicktime"];
      if (!allowedTypes.includes(file.type)) {
        return c.json({
          success: false,
          message: "Invalid file type. Only JPEG, PNG, GIF, WebP images and MP4, WebM videos are allowed"
        }, 400);
      }
      const isVideo = file.type.startsWith('video/');
      const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        return c.json({
          success: false,
          message: `File too large. Maximum size is ${isVideo ? '50MB' : '5MB'}`
        }, 400);
      }
      const validFolders = ["artworks", "workshops", "events", "artists", "blogs", "images", "artparty", "artpartyimages", "hero-banners", "user-profiles", "general"];
      const sanitizedFolder = validFolders.includes(folder) ? folder : "general";
      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      let filename;
      if (providedName && typeof providedName === "string" && providedName.trim().length > 0) {
        const base = providedName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")
          .substring(0, 80);
        filename = `${sanitizedFolder}/${base}-${timestamp}.${fileExtension}`;
      } else {
        filename = `${sanitizedFolder}/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      }
      if (c.env.R2_BUCKET) {
        try {
          await c.env.R2_BUCKET.put(filename, file.stream(), {
            httpMetadata: {
              contentType: file.type
            }
          });
          const publicUrl = c.env.CLOUDFLARE_R2_PUBLIC_URL ? `${c.env.CLOUDFLARE_R2_PUBLIC_URL}/${filename}` : `https://www.cdn.kalakritam.in/${filename}`;
          return c.json({
            success: true,
            message: "Image uploaded successfully to R2",
            data: {
              url: publicUrl,
              filename,
              key: filename,
              folder: sanitizedFolder,
              size: file.size,
              type: file.type
            }
          });
        } catch (r2Error) {
          console.error("R2 Upload Error:", r2Error);
          return c.json({
            success: false,
            message: "Failed to upload to R2 storage",
            error: r2Error.message
          }, 500);
        }
      } else {
        return c.json({
          success: false,
          message: "R2 storage not configured. Please check bucket binding.",
          error: "R2_BUCKET environment binding is missing"
        }, 500);
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to upload image",
        error: error3.message
      }, 500);
    }
  }));
  app.delete("/upload/image/:key", authenticateToken, catchAsync(async (c) => {
    try {
      const key = decodeURIComponent(c.req.param("key"));
      if (!key) {
        return c.json({
          success: false,
          message: "No image key provided"
        }, 400);
      }
      console.log("Deleting image with key:", key);
      if (c.env.R2_BUCKET) {
        await c.env.R2_BUCKET.delete(key);
        return c.json({
          success: true,
          message: "Image deleted successfully from R2",
          data: { key }
        });
      } else {
        return c.json({
          success: true,
          message: "Image deleted successfully (development mode)",
          data: { key }
        });
      }
    } catch (error3) {
      console.error("Delete error:", error3);
      return c.json({
        success: false,
        message: "Failed to delete image",
        error: error3.message
      }, 500);
    }
  }));
  app.post("/upload/pdf", authenticateToken, catchAsync(async (c) => {
    try {
      const formData = await c.req.formData();
      const file = formData.get("file");
      const folder = formData.get("folder") || "tickets";
      const ticketId = formData.get("ticketId");
      if (!file) {
        return c.json({
          success: false,
          message: "No PDF file provided"
        }, 400);
      }
      const allowedTypes = ["application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        return c.json({
          success: false,
          message: "Invalid file type. Only PDF files are allowed"
        }, 400);
      }
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        return c.json({
          success: false,
          message: "PDF file too large. Maximum size is 10MB"
        }, 400);
      }
      const validFolders = ["tickets", "documents"];
      const sanitizedFolder = validFolders.includes(folder) ? folder : "tickets";
      const timestamp = Date.now();
      const fileName = ticketId ? `ticket_${ticketId}_${timestamp}.pdf` : `document_${timestamp}.pdf`;
      const fullPath = `${sanitizedFolder}/${fileName}`;
      if (c.env.R2_BUCKET) {
        try {
          await c.env.R2_BUCKET.put(fullPath, file.stream(), {
            httpMetadata: {
              contentType: file.type
            }
          });
          const publicUrl = c.env.CLOUDFLARE_R2_PUBLIC_URL ? `${c.env.CLOUDFLARE_R2_PUBLIC_URL}/${fullPath}` : `https://www.cdn.kalakritam.in/${fullPath}`;
          return c.json({
            success: true,
            message: "PDF uploaded successfully to R2",
            data: {
              url: publicUrl,
              filename: fullPath,
              key: fullPath,
              folder: sanitizedFolder,
              size: file.size,
              type: file.type,
              ticketId
            }
          });
        } catch (r2Error) {
          console.error("R2 PDF Upload Error:", r2Error);
          return c.json({
            success: false,
            message: "Failed to upload PDF to R2 storage",
            error: r2Error.message
          }, 500);
        }
      } else {
        return c.json({
          success: false,
          message: "R2 storage not configured. Please check bucket binding.",
          error: "R2_BUCKET environment binding is missing"
        }, 500);
      }
    } catch (error3) {
      console.error("PDF upload error:", error3);
      return c.json({
        success: false,
        message: "Failed to upload PDF",
        error: error3.message
      }, 500);
    }
  }));
  app.post("/upload/presigned-url", authenticateToken, catchAsync(async (c) => {
    try {
      const body = await c.req.json();
      const { filename, contentType } = body;
      if (!filename) {
        return c.json({
          success: false,
          message: "Filename is required"
        }, 400);
      }
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
      if (contentType && !allowedTypes.includes(contentType)) {
        return c.json({
          success: false,
          message: "Invalid content type. Only JPEG, PNG, GIF, and WebP images are allowed"
        }, 400);
      }
      const timestamp = Date.now();
      const fileExtension = filename.split(".").pop();
      const uniqueFilename = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExtension}`;
      if (c.env.R2_BUCKET) {
        const publicUrl = c.env.CLOUDFLARE_R2_PUBLIC_URL ? `${c.env.CLOUDFLARE_R2_PUBLIC_URL}/${uniqueFilename}` : `https://www.cdn.kalakritam.in/${uniqueFilename}`;
        return c.json({
          success: true,
          message: "Use direct upload endpoint instead of presigned URL",
          data: {
            uploadEndpoint: "/upload/image",
            fileUrl: publicUrl,
            filename: uniqueFilename,
            note: "Upload the file directly to /upload/image endpoint with form-data"
          }
        });
      } else {
        return c.json({
          success: true,
          message: "Presigned URL generated successfully (development mode)",
          data: {
            uploadUrl: "https://example.com/presigned-upload-url",
            fileUrl: `https://example.com/${uniqueFilename}`,
            filename: uniqueFilename
          }
        });
      }
    } catch (error3) {
      return c.json({
        success: false,
        message: "Failed to generate presigned URL",
        error: error3.message
      }, 500);
    }
  }));
}
