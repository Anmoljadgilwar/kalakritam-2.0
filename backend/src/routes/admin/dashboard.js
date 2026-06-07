import { createDatabase } from "../../db/index.js";
import { catchAsync } from "../../utils/catchAsync.js";

export function setupAdminDashboardRoutes(app) {
  app.get("/admin/dashboard", catchAsync(async (c) => {
    const db = createDatabase(c.env);
    try {
      const [
        galleryCount,
        eventsCount,
        workshopsCount,
        artistsCount,
        blogsCount,
        contactSubmissions,
        ticketsSold,
        recentActivity
      ] = await Promise.all([
        db.query("SELECT COUNT(*) as count FROM gallery_items WHERE active = true"),
        db.query("SELECT COUNT(*) as count FROM events WHERE active = true"),
        db.query("SELECT COUNT(*) as count FROM workshops WHERE active = true"),
        db.query("SELECT COUNT(*) as count FROM artists WHERE active = true"),
        db.query("SELECT COUNT(*) as count FROM blogs WHERE published = true"),
        db.query("SELECT COUNT(*) as count FROM contact_submissions WHERE created_at >= NOW() - INTERVAL '30 days'"),
        db.query("SELECT COUNT(*) as count FROM tickets WHERE created_at >= NOW() - INTERVAL '30 days'"),
        db.query(`
          SELECT 'gallery' as type, title as name, created_at FROM gallery_items WHERE created_at >= NOW() - INTERVAL '7 days'
          UNION ALL
          SELECT 'event' as type, title as name, created_at FROM events WHERE created_at >= NOW() - INTERVAL '7 days'
          UNION ALL
          SELECT 'workshop' as type, title as name, created_at FROM workshops WHERE created_at >= NOW() - INTERVAL '7 days'
          UNION ALL
          SELECT 'blog' as type, title as name, created_at FROM blogs WHERE created_at >= NOW() - INTERVAL '7 days'
          ORDER BY created_at DESC LIMIT 10
        `)
      ]);
      const revenueResult = await db.query(`
        SELECT 
          DATE(created_at) as date,
          SUM(total_amount) as revenue,
          COUNT(*) as transactions
        FROM tickets 
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date DESC
      `);
      return c.json({
        success: true,
        message: "Dashboard data fetched successfully",
        data: {
          overview: {
            gallery_items: galleryCount.success ? galleryCount.data[0].count : 0,
            events: eventsCount.success ? eventsCount.data[0].count : 0,
            workshops: workshopsCount.success ? workshopsCount.data[0].count : 0,
            artists: artistsCount.success ? artistsCount.data[0].count : 0,
            published_blogs: blogsCount.success ? blogsCount.data[0].count : 0,
            recent_contacts: contactSubmissions.success ? contactSubmissions.data[0].count : 0,
            recent_tickets: ticketsSold.success ? ticketsSold.data[0].count : 0
          },
          recent_activity: recentActivity.success ? recentActivity.data : [],
          revenue_chart: revenueResult.success ? revenueResult.data : []
        }
      });
    } catch (error3) {
      console.error("Dashboard error:", error3);
      return c.json({
        success: false,
        message: "Failed to fetch dashboard data"
      }, 500);
    }
  }));
}
