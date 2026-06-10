# Kalakritam

Weekend art workshops platform based in Hyderabad, India. A full-stack web application for browsing artworks, registering for workshops and events, purchasing tickets, and managing the platform via an admin dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 7, MUI 7, GSAP, Three.js, React Three Fiber |
| **Backend** | Hono 4 (Cloudflare Workers), Zod validation |
| **Database** | PostgreSQL via Neon (serverless) |
| **Storage** | Cloudflare R2 (images, videos, PDFs) |
| **Email** | Brevo (Sendinblue) SMTP API |
| **Auth** | Custom JWT (HMAC-SHA256) + PBKDF2 + OTP |
| **Hosting** | Cloudflare Pages (frontend) + Cloudflare Workers (backend) |
| **CI/CD** | GitHub Actions |

## Prerequisites

- Node.js 18+
- npm
- A Neon PostgreSQL database (or any PostgreSQL with connection string)
- A Cloudflare account (for R2 + Workers deploy)
- A Brevo account (for email sending)

## Getting Started

### 1. Clone & Install

```bash
git clone <repo-url>
cd kalakritamofficial
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your credentials. At minimum you need:

```env
NEON_DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=<a-strong-random-secret>
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<password>
ADMIN_NAME=Admin
```

For the backend dev server, also update `backend/.dev.vars`:

```
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=<same-secret-as-above>
```

### 3. Initialize Database

```bash
curl -X POST http://localhost:8787/debug/init-database
```

This creates all tables and a default admin user.

### 4. Start Dev Servers (two terminals)

```bash
# Terminal 1 — Backend (Hono on Cloudflare Workers)
cd backend && npm run dev
# → http://localhost:8787

# Terminal 2 — Frontend (Vite dev server)
cd frontend && npm run dev
# → http://localhost:5173
```

The backend entry point is `backend/src/app.js` and runs via `wrangler dev`.

## Project Structure

```
kalakritamofficial/
├── backend/                  # Hono API (Cloudflare Workers)
│   └── src/
│       ├── app.js            # Main entry — Hono app, CORS, routes
│       ├── db/index.js       # Neon PostgreSQL wrapper
│       ├── middleware/
│       │   ├── auth.js       # JWT generation/verification, auth middleware
│       │   └── rateLimiter.js
│       ├── routes/           # All API endpoints
│       │   ├── auth.js       # Admin auth
│       │   ├── user-auth.js  # User auth (signup, login, OTP, Google)
│       │   ├── gallery.js    # Public gallery endpoints
│       │   ├── events.js     # Public events
│       │   ├── workshops.js  # Public workshops
│       │   ├── artists.js    # Public artists
│       │   ├── blogs.js      # Public blogs
│       │   ├── contact.js    # Contact form + admin management
│       │   ├── tickets.js    # Ticket purchase & verification
│       │   ├── hero-banners.js
│       │   ├── newsletter.js
│       │   ├── upload.js     # File upload (R2)
│       │   ├── images.js     # ArtParty images
│       │   ├── moments.js    # Photo galleries
│       │   ├── debug.js      # Dev-only debug endpoints
│       │   └── admin/
│       │       ├── index.js  # CRUD for all resources
│       │       ├── dashboard.js
│       │       └── system.js # Admin login, health, audit logs
│       ├── services/email.js # Brevo email service
│       ├── utils/
│       └── validation/       # Zod schemas
├── frontend/                 # React SPA (Vite)
│   └── src/
│       ├── App.jsx           # Router setup
│       ├── components/       # 63+ components
│       ├── contexts/         # Auth, Loading, Notification
│       ├── hooks/
│       ├── lib/
│       │   ├── adminApi.js   # Full API client (1496 lines)
│       │   └── apiClient.js  # Generic HTTP client
│       ├── utils/
│       └── config/
├── docs/                     # Documentation
├── scripts/                  # SQL migration scripts
├── functions/                # Cloudflare Pages Functions
├── .github/workflows/        # CI/CD
├── wrangler-production.toml  # Production Workers config
└── .cloudflare-pages.json    # Cloudflare Pages config
```

## API Endpoints

### Public
| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/gallery` | List artworks (paginated, filterable) |
| GET | `/gallery/:id` | Single artwork |
| GET | `/events` | List events (upcoming filter) |
| GET | `/events/:id` | Single event |
| GET | `/workshops` | List workshops |
| GET | `/workshops/:id` | Single workshop (by UUID or slug) |
| GET | `/artists` | List artists |
| GET | `/artists/:id` | Single artist |
| GET | `/blogs` | List published blogs |
| GET | `/blogs/:id` | Single blog |
| POST | `/contact` | Submit contact form |
| GET | `/hero-banners` | Active banners |
| POST | `/newsletter/subscribe` | Subscribe |
| POST | `/newsletter/unsubscribe` | Unsubscribe |
| GET | `/moments` | Photo galleries |
| POST | `/tickets/purchase` | Purchase ticket |
| GET | `/tickets/verify/:ticketId` | Verify ticket |

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/admin/login` | Admin login |
| POST | `/auth/login` | Admin login (alt) |
| POST | `/api/auth/signup` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/request-otp` | Request OTP |
| POST | `/api/auth/verify-otp` | Verify OTP |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset with token |
| POST | `/api/auth/reset-password-otp` | Reset with OTP |

### Admin (all require admin JWT)
Full CRUD at `/admin/gallery`, `/admin/events`, `/admin/workshops`, `/admin/artists`, `/admin/blogs`, `/admin/tickets`, `/admin/moments`, `/admin/hero-banners`

Dashboard: `GET /admin/dashboard` — stats and analytics

## Database

PostgreSQL hosted on Neon. Key tables (19+):

- `admin_users` — admin accounts with roles & permissions
- `users` — end-user accounts (email + Google OAuth)
- `artworks` / `gallery` — artwork listings
- `events` — workshop events
- `workshops` — art workshops
- `artists` — artist profiles
- `blogs` — blog posts
- `tickets` — event tickets with QR codes
- `contacts` — contact form submissions
- `hero_banners` — homepage banners
- `newsletter_subscriptions` — email subscribers
- `otp_codes` — one-time passwords
- `user_notifications` — user notification inbox
- `event_financials` — per-event income/expenses
- `audit_logs` — admin action audit trail
- `system_settings` — key-value configuration

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev:frontend` | Start Vite dev server |
| `npm run build:frontend` | Build frontend for production |
| `npm run dev:backend` | Start Workers dev server |
| `npm run deploy:backend` | Deploy backend to Workers |

## Deployment

### Frontend (Cloudflare Pages)
Pushes to `main` trigger automatic deployment via Cloudflare Pages integration. Build config in `.cloudflare-pages.json`.

### Backend (Cloudflare Workers)
Pushes to `main` with changes under `backend/` trigger the GitHub Action `.github/workflows/deploy-backend.yml`, which:
1. Installs dependencies
2. Runs lint
3. Deploys to Workers via `wrangler deploy`
4. Sets secrets (`DATABASE_URL`, `JWT_SECRET`)
5. Runs a health check

## Documentation

See the `docs/` directory for:
- `EMAIL_INTEGRATION.md` — Brevo email setup, templates
- `FINANCIAL_ANALYTICS.md` — Financial dashboard & analytics
- `NOTIFICATIONS_SYSTEM.md` — Notification triggers & management

## Team

| Role | Responsibility |
|---|---|
| **Team Lead** | Project coordination, code review, final sign-off |
| **Member 1** | Backend API & middleware testing |
| **Member 2** | Authentication & security testing |
| **Member 3** | Database & integration testing |
| **Member 4** | Frontend public pages & UX testing |
| **Member 5** | Admin panel, user dashboard & E2E flows |
