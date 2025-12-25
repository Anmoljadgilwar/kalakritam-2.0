# Automatic User Notifications System

## Overview
The notification system automatically sends notifications to all users whenever an admin creates new content (gallery items, workshops, events, or blog posts).

## How It Works

### Backend (Automatic Triggers)
When an admin creates any new content through the admin panel, the system automatically sends **rich, content-specific notifications** to all users:

1. **Gallery Items** - When admin adds new artwork
   - Notification Type: `gallery`
   - Title: "🎨 New [Category] in Gallery!"
   - Message: "[Title]" by [Artist] in [Medium] | [Category] - ₹[Price]. Explore this stunning piece now!
   - Example: "🎨 New Oil Painting in Gallery! \"Sunset Dreams\" by John Doe in Oil on Canvas | Contemporary Art - ₹25,000. Explore this stunning piece now!"
   - Link: `/gallery`

2. **Events** - When admin creates new event
   - Notification Type: `event`
   - Title: "📅 Exciting Event: [Event Title]"
   - Message: Join us on [Date] at [Venue] | [Category]. [Ticket Info]. Book your spot now!
   - Example: "📅 Exciting Event: Summer Art Fest. Join us on Jun 15, 2025 at City Hall | Art Exhibition. Tickets from ₹500. Book your spot now!"
   - Link: `/events`

3. **Workshops** - When admin creates new workshop
   - Notification Type: `workshop`
   - Title: "📚 New Workshop: [Workshop Title]"
   - Message: Starting [Date] with [Instructor] ([Duration]). Fee: ₹[Price] | Limited to [X] seats. Register before seats fill up!
   - Example: "📚 New Workshop: Watercolor Basics. Starting May 20 with Sarah Smith (3 hours). Fee: ₹1,500 | Limited to 20 seats. Register before seats fill up!"
   - Link: `/workshops`

4. **Blog Posts** - When admin publishes new blog
   - Notification Type: `blog`
   - Title: "📝 Fresh Read: [Blog Title]"
   - Message: By [Author] | [Category] | [Read Time] min read - [Excerpt]. Dive into this insightful article now!
   - Example: "📝 Fresh Read: Understanding Modern Art. By Kalakritam Team | Art History | 5 min read - Explore the evolution of contemporary art movements. Dive into this insightful article now!"
   - Link: `/blogs`

### Frontend (User View)
Users can view notifications in their dashboard:

1. **Dashboard Notifications Section**
   - Shows all notifications with unread count
   - Different colored icons for each notification type
   - Click to mark as read
   - "Mark all as read" button

2. **Notification Features**
   - Real-time unread count badge with "NEW" indicator
   - Color-coded icons with glowing effects (gallery=green, workshop=blue, event=orange, blog=purple)
   - Smart timestamp showing relative time ("5 min ago", "2 hours ago")
   - Rich content with full details (prices, dates, instructors, etc.)
   - "View Details →" link for quick navigation
   - Smooth animations and hover effects
   - Left border accent on unread notifications
   - Mobile-responsive design with touch-friendly interactions

## Database Setup

### Required SQL Scripts

1. **Create notifications table** (Run first if not exists):
```sql
-- File: scripts/create_notifications_table.sql
-- Creates user_notifications table with proper indexes
```

2. **Verify users table** (Run if profile_image_url column missing):
```sql
-- File: scripts/verify_users_table.sql
-- Adds profile_image_url column to users table
```

## API Endpoints

### User Endpoints (GET notifications)
- `GET /api/auth/notifications` - Get all user notifications
- `PUT /api/auth/notifications/:id/read` - Mark single notification as read
- `PUT /api/auth/notifications/read-all` - Mark all notifications as read

### Admin Endpoints (Automatic - no manual call needed)
The following admin creation endpoints automatically trigger notifications:
- `POST /admin/gallery` - Creates artwork + sends notification
- `POST /admin/events` - Creates event + sends notification
- `POST /admin/workshops` - Creates workshop + sends notification
- `POST /admin/blogs` - Creates blog + sends notification

## Files Modified

### Backend
- `KALAKRITAM_PRODUCTION_NO_SAMPLE_DATA.js`
  - Line ~16970: Gallery creation with notification
  - Line ~17350: Event creation with notification
  - Line ~17590: Workshop creation with notification
  - Line ~18045: Blog creation with notification
  - Line ~13825: `createNotificationForAllUsers()` helper function
  - Line ~14540: Notification GET/PUT endpoints

### Frontend
- `src/components/NotificationsList/` (NEW)
  - `NotificationsList.jsx` - Main notification component
  - `NotificationsList.css` - Styled with gold theme
  - `index.js` - Export file

- `src/components/UserDashboard/UserDashboard.jsx`
  - Added `<NotificationsList />` component
  - Imports and displays in dashboard grid

- `src/components/UserDashboard/UserDashboard.css`
  - Added `.notifications-card` grid positioning

- `src/utils/notificationHelpers.js` (NEW)
  - Client-side helper (for reference only)
  - Shows example usage patterns

### Database Scripts
- `scripts/create_notifications_table.sql` (NEW)
  - Creates user_notifications table
  - Adds indexes for performance

## Testing the System

### Step 1: Setup Database
```sql
-- Run in your PostgreSQL database
-- Execute: scripts/create_notifications_table.sql
```

### Step 2: Deploy Backend Changes
```bash
# Deploy to Cloudflare Workers
npm run deploy
```

### Step 3: Test Notification Flow
1. Login as admin
2. Go to Admin Panel
3. Create a new gallery item/workshop/event/blog
4. Logout and login as regular user
5. Go to User Dashboard
6. Check notifications section - should see the new notification!

## Notification Types & Colors

| Type | Color | Icon | Use Case |
|------|-------|------|----------|
| gallery | Green (#4CAF50) | 🖼️ | New artwork added |
| workshop | Blue (#2196F3) | 📚 | New workshop available |
| event | Orange (#FF9800) | 📅 | New event announced |
| blog | Purple (#9C27B0) | 📝 | New blog post published |
| announcement | Gold (#c38f21) | 🔔 | General announcements |

## User Experience

### Visual Design Features:
- **Glowing Icons**: Each notification type has a unique colored icon with a subtle glow effect
- **Left Accent Bar**: Unread notifications have a gold gradient bar on the left
- **"NEW" Badge**: Pulsing gold badge on unread notifications
- **Smart Timestamps**: "Just now", "5 min ago", "2 hours ago" format
- **Hover Effects**: Cards lift and shift right with enhanced shadows
- **Rich Content**: Full details including prices, dates, venues, instructors
- **Action Links**: Quick "View Details →" buttons for navigation

### Content Examples:

**Gallery Notification:**
```
🎨 New Oil Painting in Gallery!
"Monsoon Melody" by Ravi Kumar in Oil on Canvas | Contemporary Art - ₹35,000
Explore this stunning piece now!
🕒 15 min ago | View Details →
```

**Event Notification:**
```
📅 Exciting Event: Annual Art Exhibition 2025
Join us on Dec 28, 2025 at Kalakritam Art Center | Art Exhibition
Tickets from ₹300. Book your spot now!
🕒 2 hours ago | View Details →
```

**Workshop Notification:**
```
📚 New Workshop: Acrylic Painting Masterclass
Starting Jan 5 with Priya Sharma (4 hours). Fee: ₹2,000 | Limited to 15 seats
Register before seats fill up!
🕒 1 day ago | View Details →
```

### For Users:
1. ✅ **Automatic** - No action needed, notifications arrive automatically
2. ✅ **Organized** - See all notifications in one place
3. ✅ **Clear** - Unread count badge shows new notifications
4. ✅ **Quick Actions** - Mark as read with a click
5. ✅ **Mobile-Friendly** - Works great on all devices

### For Admins:
1. ✅ **Zero effort** - Just create content as usual
2. ✅ **Automatic delivery** - System handles notifications
3. ✅ **No extra steps** - Notifications sent automatically
4. ✅ **Error handling** - Notification failure doesn't break content creation

## Troubleshooting

### Notifications not appearing?
1. Check if user_notifications table exists in database
2. Verify backend deployment (KALAKRITAM_PRODUCTION_NO_SAMPLE_DATA.js)
3. Check browser console for API errors
4. Ensure user is logged in with valid token

### Old users not getting notifications?
- Notifications only go to active users in the database
- Check users table for is_active status

### Notification count not updating?
- Click "Mark as read" or "Mark all as read"
- Refresh the page to reload notifications

## Future Enhancements (Optional)

- [ ] Add notification preferences (let users choose types)
- [ ] Email notifications for important updates
- [ ] Push notifications for mobile devices
- [ ] Notification history/archive
- [ ] Admin dashboard to track notification delivery
