# 🎨 Kalakritam — Frontend

<div align="center">

**A premium cultural platform for art workshops, gallery experiences, and Indian heritage — built for Hyderabad.**

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r169-black?style=for-the-badge)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.13-88CE02?style=for-the-badge)](https://greensock.com/)
[![MUI](https://img.shields.io/badge/MUI-7.x-007FFF?style=for-the-badge&logo=mui)](https://mui.com/)

[Live Site](https://kalakritam.in) · [Docs](../docs/)

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Application Flow](#-application-flow)
- [Features](#-features)
- [Component Library](#-component-library)
- [Animations & Visual Effects](#-animations--visual-effects)
- [Routing & Auth Guards](#-routing--auth-guards)
- [Performance Optimizations](#-performance-optimizations)
- [SEO Strategy](#-seo-strategy)
- [State Management](#-state-management)
- [Directory Structure](#-directory-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)

---

## 🌟 Project Overview

Kalakritam is a **full-stack cultural platform** for promoting and booking art workshops, gallery exhibitions, cultural events, and Art Party experiences in Hyderabad. The frontend is a visually stunning **React SPA** that blends traditional Indian aesthetics with cutting-edge web technologies.

### What Makes it Unique

| Aspect | Description |
|---|---|
| **Immersive Entry** | Cinematic intro video with animated logo reveal before the main app loads |
| **3D WebGL Gallery** | Virtual gallery powered by `@react-three/fiber` + `drei` for an immersive 3D artwork walk-through |
| **Live Cosmic Background** | Per-page dynamic Three.js particle field (stars, orbits, nebula) with OGL renderer |
| **Premium Card Physics** | Mouse-tracked 3D parallax tilt on every card using vanilla JS `cardTilt.js` |
| **Smart Auth** | Dual auth flows — Google OAuth2 + Email/OTP — with JWT-secured routes |
| **Admin Dashboard** | Full CMS for content management including financials, tickets, and audit logs |

---

## 🛠 Tech Stack

### Core Framework & Build

| Tool | Version | Purpose |
|---|---|---|
| **React** | 18.2.0 | UI framework with concurrent rendering |
| **Vite** | 7.x | Ultra-fast HMR dev server + optimized ESM build |
| **React Router DOM** | 7.x | Client-side routing with lazy loading |
| **React Helmet Async** | 2.x | Dynamic `<head>` management for SEO |

### UI & Styling

| Tool | Version | Purpose |
|---|---|---|
| **MUI (Material UI)** | 7.x | Component library for admin, toast, charts |
| **MUI X Charts** | 8.x | Financial analytics charts in admin panel |
| **Emotion** | 11.x | CSS-in-JS for MUI theming |
| **Vanilla CSS** | — | All custom styling; no Tailwind |
| **Google Fonts** | — | Cinzel, Dancing Script, Montserrat |
| **Samarkan** | Local | Custom decorative Sanskrit-style font |

### Animation & 3D

| Tool | Version | Purpose |
|---|---|---|
| **GSAP** | 3.13 | Timeline animations, scroll triggers, text splits |
| **@gsap/react** | 2.x | React hooks for GSAP |
| **Three.js** | r169 | 3D WebGL rendering engine |
| **@react-three/fiber** | 8.x | React renderer for Three.js |
| **@react-three/drei** | 9.x | Helpers: camera, controls, text, environment |
| **@react-three/rapier** | 1.x | Physics engine for 3D interactions |
| **OGL** | 1.x | Lightweight WebGL for particle systems |
| **Motion** | 12.x | Framer Motion-compatible animation library |
| **Meshline** | 3.x | Line mesh rendering for orbit trails |
| **Postprocessing** | 6.x | WebGL post-processing (bloom, glitch) |
| **@barba/core + css** | 2.x | Page transition animations |

### Data & Utility

| Tool | Version | Purpose |
|---|---|---|
| **React Toastify** | 11.x | Toast notification system |
| **jsPDF** | 3.x | PDF ticket generation |
| **html2canvas** | 1.x | DOM-to-canvas for ticket rendering |
| **qrcode** | 1.x | QR code generation for event tickets |
| **ReactFlow** | 11.x | Flow diagram for admin UI |

---

## 🏛 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Application (SPA)                      │  │
│  │                                                           │  │
│  │  HelmetProvider ──► Dynamic SEO per page                  │  │
│  │       │                                                   │  │
│  │  LoadingProvider ──► Global loading state & spinner       │  │
│  │       │                                                   │  │
│  │  UserAuthProvider ──► JWT + localStorage auth state       │  │
│  │       │                                                   │  │
│  │  BrowserRouter                                            │  │
│  │       │                                                   │  │
│  │  ┌─────────────────────────────────────────────────┐     │  │
│  │  │  ScrollToTop · PageOptimizer · MuiToastContainer│     │  │
│  │  │                                                  │     │  │
│  │  │  Suspense + LazyLoadingErrorBoundary             │     │  │
│  │  │                                                  │     │  │
│  │  │  Routes (40+ pages):                             │     │  │
│  │  │    ├── Public Routes                             │     │  │
│  │  │    ├── GuestOnly  (redirect if logged in)        │     │  │
│  │  │    ├── RequireAuth (redirect if guest)           │     │  │
│  │  │    └── Admin Routes (admin JWT via API)          │     │  │
│  │  └─────────────────────────────────────────────────┘     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Service Worker ──► Asset caching + offline support             │
│  Cloudflare R2 Proxy ──► CORS-free image loading (dev)         │
└─────────────────────────────────────────────────────────────────┘
                              │
                    HTTPS API calls
                              │
                  ┌───────────▼──────────┐
                  │  Cloudflare Workers   │
                  │  (Hono REST API)      │
                  └───────────┬──────────┘
                              │
                  ┌───────────▼──────────┐
                  │  Neon PostgreSQL      │
                  │  (Serverless DB)      │
                  └──────────────────────┘
```

---

## 🔄 Application Flow

### First Visit — User Journey

```
Browser loads kalakritam.in
         │
         ▼
  index.html parsed
  Service Worker registered
  Critical CSS injected, Google Fonts preconnected
         │
         ▼
  React mounts → App.jsx
  HelmetProvider, LoadingProvider, UserAuthProvider initialized
  UserAuthContext → checkAuth() → reads localStorage JWT
         │
    No auth found
         │
         ▼
  Route "/" → IntroVideo (React.lazy)
  Cinematic logo animation (~5 seconds):
    GSAP timeline: fade-in logo → typewriter text → skip button
         │
         ▼
  User clicks "Enter" or animation completes
         │
         ▼
  Navigate to "/home"
         │
         ▼
  Home component loads:
  ├── HeroBanner (rotating featured images with CTA)
  ├── SplitTextAnimation section headings
  ├── 6 Feature Cards with 3D mouse parallax tilt
  ├── OptimizedParticles / CosmicOrbit background
  └── Footer with newsletter signup
```

### Authentication Flow

```
User visits /user/login
         │
         ▼
  UserLogin component loads
  Two tabs: "Login" | "Sign Up"
         │
    ┌────┴────┐
    │         │
Email/Pass  Google OAuth
    │         │
    ▼         ▼
  POST      Google ID token
  /api/auth   → POST /api/auth/google
  /login
    │         │
    └────┬────┘
         │
         ▼
  Backend validates → returns JWT + user object
         │
         ▼
  UserAuthContext.login()
  Stores token + user in localStorage
         │
         ▼
  Navigate to /u/:username/home
```

### Ticket Purchase Flow

```
User browses Events → EventDetail → selects tickets
         │
         ▼
  POST /tickets/purchase
  Backend generates:
    Unique ticket UUID + QR code (base64)
    Sends confirmation email via Brevo
         │
         ▼
  Frontend renders:
    jsPDF → A4 ticket layout
    html2canvas → captures QR block
    PDF downloaded to device
         │
         ▼
  Ticket scan at venue:
    GET /verify-ticket/:ticketId
    → TicketVerification page shows live validity
```

---

## ✨ Features

### Public Features

| Feature | Route | Description |
|---|---|---|
| **Intro Video** | `/` `/intro` | Cinematic full-screen entry with logo animation |
| **Home Page** | `/home` | Hero banner, feature cards, newsletter, footer |
| **Art Gallery** | `/gallery` | Paginated artwork grid with filter/search |
| **Artwork Detail** | `/gallery/:slug` | Full artwork view with artist info |
| **Virtual Gallery** | `/gallery/virtual` | Immersive 3D WebGL walk-through |
| **Workshops** | `/workshops` | Upcoming art workshops with booking |
| **Workshop Detail** | `/workshops/:slug` | Workshop info, pricing, enrollment |
| **Events** | `/events` | Cultural events and exhibitions |
| **Event Detail** | `/events/:slug` | Event info, ticket purchase, QR download |
| **Artists** | `/artists` | Featured artist profiles and portfolios |
| **Art Blogs** | `/artblogs` | Editorial art content and articles |
| **Art Party** | `/artparty` | Special Art Party event page with gallery |
| **Moments** | `/moments` | Photo gallery from past events |
| **Contact** | `/contact` | Contact form with Brevo email integration |
| **About** | `/about` | Organization story and team |
| **Ticket Verify** | `/verify-ticket/:id` | QR-scan ticket verification page |
| **Privacy Policy** | `/privacy` | GDPR-friendly privacy documentation |
| **Terms of Service** | `/terms` | Platform terms and conditions |

### User Auth Features

| Feature | Route | Description |
|---|---|---|
| **Sign Up** | `/user/signup` | Email registration with OTP verification |
| **Login** | `/user/login` | Email/password or Google OAuth |
| **OTP Auth** | (modal) | One-time password via email (Brevo) |
| **Forgot Password** | (modal) | Password reset via email link |
| **Dashboard** | `/user/dashboard` | Personalized user dashboard |
| **Username URLs** | `/u/:username/*` | All routes mirrored under user namespace |

### Admin Panel Features

| Module | Route | Description |
|---|---|---|
| **Admin Login** | `/admin/login` | Secure admin authentication |
| **Admin Portal** | `/admin/portal` | Dashboard with analytics and quick actions |
| **Gallery CMS** | `/admin/gallery` | Create, edit, delete artworks |
| **Workshops CMS** | `/admin/workshops` | Manage art workshops |
| **Events CMS** | `/admin/events` | Manage cultural events |
| **Artists CMS** | `/admin/artists` | Artist profile management |
| **Blogs CMS** | `/admin/blogs` | Blog post editor |
| **Financials** | `/admin/financials` | Revenue/expense dashboard with MUI X Charts |
| **Tickets** | `/admin/tickets` | Ticket management and exports |
| **Contact Inbox** | `/admin/contact` | View and respond to form submissions |
| **Hero Banners** | `/admin/hero-banners` | Homepage banner management |
| **Users** | `/admin/users` | User account management |
| **ArtParty Images** | `/admin/artpartyimages` | Art Party gallery management |
| **Moments** | `/admin/moments` | Event photo gallery management |

---

## 🧱 Component Library

### 62+ React Components Organized by Domain

```
src/components/
│
├── 🎬 Entry & Layout
│   ├── IntroVideo/          Cinematic landing with GSAP logo animation
│   ├── Header/              Sticky nav with glassmorphism blur effect
│   ├── Navigation/          Sidebar/hamburger navigation
│   ├── Footer/              Footer with newsletter + social links
│   └── Loading/             Full-page spinner + SkeletonLoader
│
├── 🏠 Home Page
│   ├── Home/                Hero + 6 feature cards with tilt physics
│   └── HeroBanner/          Auto-rotating banner with CTA overlays
│
├── 🖼️ Gallery
│   ├── Gallery/             Paginated art grid with search/filter
│   ├── ArtworkDetail/       Single artwork page with full metadata
│   ├── UniversalCard/       Reusable card: 3D tilt + shimmer + glow
│   └── VirtualGallery/      Three.js + Rapier physics 3D gallery room
│
├── 🎭 Events & Workshops
│   ├── Events/              Events listing with calendar filter
│   ├── EventDetail/         Event page with ticket purchase + QR
│   ├── Workshops/           Workshop catalog with filters
│   ├── WorkshopDetail/      Workshop page with enrollment
│   └── TicketVerification/  Real-time QR ticket scanner/validator
│
├── 👨‍🎨 Artists & Content
│   ├── Artists/             Artist profiles grid
│   ├── ArtBlogs/            Blog listing + reading page
│   ├── ArtParty/            Art Party landing + image gallery
│   └── Moments/             Event photo memories grid
│
├── 👤 Auth & User
│   ├── UserLogin/           Login/Signup tabs + Google OAuth button
│   ├── UserDashboard/       Personalized profile + bookings
│   ├── ValidateUsername/    Username selection/validation flow
│   ├── RequireAuth.jsx      HOC: redirects guests to login
│   └── GuestOnly.jsx        HOC: redirects logged-in users away
│
├── 🔔 Notifications
│   ├── NotificationBell/    Header bell with unread badge
│   ├── NotificationsList/   Notification dropdown panel
│   └── NotificationMessage/ Individual notification item
│
├── ⚡ Visual & Effects
│   ├── Particles/           OGL WebGL 2D particle field
│   ├── OptimizedParticles/  Performance-optimized particle variant
│   ├── CosmicOrbit/         Three.js: stars + nebula + orbital rings
│   ├── Orb/                 Animated gradient glow orb
│   ├── SplitTextAnimation/  GSAP character-by-character text reveal
│   └── VideoLogo/           Video-based animated brand logo
│
├── 🖼️ Media
│   ├── LazyImage/           IntersectionObserver lazy image + blur-up
│   ├── LazyBackgroundImage/ Lazy background-image wrapper div
│   ├── FileUpload/          Drag-and-drop file uploader
│   └── VideoUpload/         Video file upload component
│
├── 🔧 Utilities
│   ├── GlobalToastContainer/ React Toastify global outlet
│   ├── MuiToastContainer/   MUI-themed toast notifications
│   ├── ToastIcon/           Custom toast icon renderer
│   ├── ScrollToTop.jsx      Auto-scroll-to-top on navigation
│   ├── NotFound/            404 page with animated message
│   ├── SEOFieldsComponent/  Reusable SEO meta fields for admin forms
│   └── ToastDemo/           Dev-only toast system showcase
│
└── 🛠 Admin Panel (14 modules)
    ├── AdminPortal/         Dashboard: stats, revenue, quick actions
    ├── AdminLogin/          Admin-only secure login form
    ├── AdminGallery/        Artwork CRUD
    ├── AdminWorkshops/      Workshop CRUD
    ├── AdminEvents/         Events CRUD
    ├── AdminArtists/        Artist profile CRUD
    ├── AdminBlogs/          Blog post editor with preview
    ├── AdminFinancials/     MUI X Charts revenue/expense dashboard
    ├── AdminTickets/        Ticket management and CSV export
    ├── AdminContact/        Contact form inbox and replies
    ├── AdminHeroBanners/    Homepage rotating banner CMS
    ├── AdminUsers/          User account management
    ├── AdminArtPartyImages/ Art Party image gallery CMS
    └── AdminMoments/        Event photo gallery CMS
```

---

## 🎬 Animations & Visual Effects

Kalakritam delivers a premium animated experience across every page using multiple animation engines.

### 1. GSAP — Timeline Animations

| Component | Animation | Technique |
|---|---|---|
| `IntroVideo` | Logo reveal, typewriter, fade-out | `gsap.timeline()`, `TextPlugin`, stagger |
| `SplitTextAnimation` | Character-by-character text entrance | `SplitText`, stagger, ScrollTrigger |
| `HeroBanner` | Slide transitions, parallax overlays | `gsap.to()`, `ease: "power2.inOut"` |
| `Home` | Section reveal on scroll | `ScrollTrigger` with `scrub` |
| `Gallery` | Card entrance with stagger | `gsap.from()` with `y: 40`, opacity |

### 2. Three.js + React Three Fiber — 3D WebGL

| Component | Effect | Detail |
|---|---|---|
| `CosmicOrbit` | Twinkling star field | 800 stars in sphere, glowing canvas texture |
| `CosmicOrbit` | Animated nebula cloud | 1200 particles with gold/orange palette |
| `CosmicOrbit` | 3 orbital rings with trails | Rotating tori with MeshLine-rendered trails |
| `VirtualGallery` | 3D gallery room walk-through | Rapier physics, drei environment, depth fog |

**CosmicOrbit — Layer Stack:**

```
Layer 1 — Stars (800 points)
  Uniformly distributed in sphere, radius 15–40
  Twinkling via sinusoidal opacity modulation
  Slow continuous Y-axis rotation

Layer 2 — Nebula Cloud (1200 particles)
  Gaussian distribution centered at origin
  Color palette: gold, orange, magenta
  Each particle drifts independently

Layer 3 — Orbital Rings (3 tori)
  3D-rotated planes at varied angles
  Continuous Y-axis rotation at different speeds
  MeshLine trails behind each ring
```

### 3. OGL Particle System — Lightweight WebGL

OGL renders the animated particle background on public pages.

```
Particle count (20% reduced for performance):
  Desktop:  ~576 particles
  Tablet:   ~400 particles
  Mobile:   DISABLED (battery protection)

Behavior:
  Particles drift upward with slight X/Y drift
  Connected by line segments within proximity radius
  Responsive to window resize events
  z-index: -1 (always behind all content)
```

### 4. CSS Micro-Animations

| Effect | CSS Technique | Where Used |
|---|---|---|
| **Diagonal Shimmer Sweep** | `::after` pseudo + `translateX` on hover | Feature cards, UniversalCard |
| **3D Mouse Tilt** | `perspective` + `rotateX/Y` via JS | All cards via cardTilt.js |
| **Gold Gradient Border** | `::before` + conic-gradient animation | Feature cards on hover |
| **Outer Glow Pulse** | `box-shadow` + `@keyframes` | Gallery cards, event cards |
| **Glassmorphism** | `backdrop-filter: blur()` + semi-transparent | Header, modals, navigation |
| **Floating Orb** | `@keyframes float` with `translateY` | Orb component |
| **Scroll Fade-In** | `IntersectionObserver` + CSS class toggle | All section entries |
| **Skeleton Loading** | `@keyframes shimmer` on gradient | SkeletonLoader component |
| **Toast Slide-In** | Custom Toastify CSS | All notifications |
| **Loading Spinner** | CSS conic-gradient rotation | Loading component |

### 5. cardTilt.js — 3D Parallax Tilt Engine

A custom vanilla-JS module that gives every card real-time 3D mouse-parallax physics:

```
Targets: .universal-card, .user-login-card, .admin-login-card, .feature-card

Algorithm:
  1. Single mousemove listener on document (O(1) overhead)
  2. Find closest parent matching a card selector
  3. Compute mouse offset relative to card center
  4. Calculate tilt: max ±15° rotateX and rotateY
  5. Apply: perspective(1000px) rotateX(Ydeg) rotateY(Xdeg)
  6. On mouseleave: spring-reset all transforms to 0

Mobile: Fully disabled (touch events have no hover)
Performance: One listener for all cards — not per-card
```

---

## 🔐 Routing & Auth Guards

### Route Guard Types

| Type | Guard Component | Behavior |
|---|---|---|
| **Public** | None | Accessible to all visitors |
| **GuestOnly** | `GuestOnly.jsx` | Logged-in users redirected away |
| **RequireAuth** | `RequireAuth.jsx` | Guests redirected to `/user/login` |
| **Username-scoped** | N/A | All routes duplicated under `/u/:username/` |
| **Admin** | None (API-enforced) | Admin JWT verified server-side per request |

### Complete Route Map

```
Public Routes:
  /  /intro              → IntroVideo
  /home                  → Home
  /gallery               → Gallery
  /gallery/virtual       → VirtualGallery
  /gallery/:slug         → ArtworkDetail
  /workshops             → Workshops
  /workshops/:slug       → WorkshopDetail
  /artists               → Artists
  /events                → Events
  /events/:slug          → EventDetail
  /artblogs              → ArtBlogs
  /artparty              → ArtParty
  /moments               → Moments
  /contact               → Contact
  /about                 → About
  /privacy               → PrivacyPolicy
  /terms                 → TermsOfService
  /verify-ticket/:id     → TicketVerification
  /verify/:id            → TicketVerification

GuestOnly (redirect logged-in users away):
  /user/login            → UserLogin
  /user/signup           → UserLogin

RequireAuth (redirect guests to login):
  /user/dashboard        → UserDashboard
  /u/:username/home      → Home
  /u/:username/dashboard → UserDashboard
  /u/:username/gallery   → Gallery
  /u/:username/gallery/virtual → VirtualGallery
  /u/:username/gallery/:slug   → ArtworkDetail
  /u/:username/workshops       → Workshops
  /u/:username/workshops/:slug → WorkshopDetail
  /u/:username/events          → Events
  /u/:username/events/:slug    → EventDetail
  /u/:username/artblogs        → ArtBlogs
  /u/:username/artists         → Artists
  /u/:username/artparty        → ArtParty
  /u/:username/moments         → Moments
  /u/:username/contact         → Contact
  /u/:username/about           → About

Admin Routes (JWT enforced via API):
  /admin/login           → AdminLogin
  /admin/portal          → AdminPortal
  /admin/gallery         → AdminGallery
  /admin/workshops       → AdminWorkshops
  /admin/events          → AdminEvents
  /admin/financials      → AdminFinancials
  /admin/artists         → AdminArtists
  /admin/blogs           → AdminBlogs
  /admin/contact         → AdminContact
  /admin/tickets         → AdminTickets
  /admin/artpartyimages  → AdminArtPartyImages
  /admin/moments         → AdminMoments
  /admin/hero-banners    → AdminHeroBanners
  /admin/users           → AdminUsers

  *                      → NotFound (404)
```

---

## ⚡ Performance Optimizations

### Code Splitting & Lazy Loading

Every route uses `React.lazy()` with built-in performance tracking:

```jsx
const Gallery = React.lazy(() => {
  const measure = measureLazyLoadTime('Gallery');
  return import('./components/Gallery').then(m => { measure(); return m; });
});
```

- Each page = a separate JS chunk loaded only when visited
- `LazyLoadingErrorBoundary` catches chunk failures gracefully
- `chunkPreloader.js` prefetches adjacent route chunks in the background

### Vite Build Optimizations

```js
target: 'es2020'           // No legacy polyfills needed
minify: 'esbuild'          // Fastest available minifier
modulePreload: false       // Don't eagerly load all chunks
cssMinify: true            // CSS compression enabled
manualChunks: undefined    // Rollup auto-splits optimally
sourcemap: dev-only        // Source maps in dev, disabled in prod
```

### Image Loading

| Strategy | Implementation |
|---|---|
| **Lazy images** | `LazyImage` uses `IntersectionObserver` (threshold 0.1) |
| **Blur-up effect** | Low-res placeholder shown until full image loads |
| **CDN delivery** | All media on Cloudflare R2 (edge-cached globally) |
| **Dev CORS proxy** | Vite proxies `/r2-proxy/*` to R2 CDN to bypass CORS |

### Service Worker Strategy

`/public/sw.js` implements:
- **Cache-first** for static JS, CSS, and fonts
- **Network-first** for all API calls
- **Stale-while-revalidate** for images
- **Offline fallback** page when network unavailable

### Speculation Rules

`pageOptimizationScript.js` uses Chrome's native Speculation Rules API:

```json
{
  "prefetch": [{ "source": "list", "urls": ["/gallery", "/workshops"] }],
  "prerender": [{ "source": "list", "urls": ["/home"] }]
}
```

---

## 🔍 SEO Strategy

### Dynamic Per-Page Meta Tags

Every page generates unique SEO data via `react-helmet-async`:

| Tag | Implementation |
|---|---|
| `<title>` | Unique per route |
| `meta description` | Unique per page |
| `og:title`, `og:image` | Open Graph for social previews |
| `twitter:card` | Twitter large image cards |
| `canonical` | Canonical URL per page |
| **JSON-LD** | Structured data: Organization, Event, Product schemas |

### SEO Utility Modules

```
utils/seoManager.js       → Per-route SEO config registry
utils/seoHelpers.js       → Meta tag generation helpers
utils/dynamicSeo.js       → Dynamic JSON-LD structured data injection
utils/sitemapGenerator.js → XML sitemap builder
```

### Multilingual Hreflang

```html
<link rel="alternate" hreflang="en" href="https://kalakritam.in/">
<link rel="alternate" hreflang="hi" href="https://kalakritam.in/hi/">
<link rel="alternate" hreflang="te" href="https://kalakritam.in/te/">
<link rel="alternate" hreflang="x-default" href="https://kalakritam.in/">
```

---

## 🗂 State Management

Kalakritam uses **React Context API** — no Redux or Zustand needed at this scale.

### Provider Tree

```
HelmetProvider (react-helmet-async)
  └── LoadingProvider (LoadingContext.jsx)
        ├── isLoading: boolean
        ├── loadingMessage: string
        ├── showLoading(msg?) / hideLoading()
        └── UserAuthProvider (UserAuthContext.jsx)
              ├── user: object | null
              ├── token: string | null
              ├── isAuthenticated: boolean
              ├── login(userData, token) — stores to localStorage
              ├── logout() — clears localStorage
              └── checkAuth() — verifies JWT on mount
```

### UserAuthContext — Auth State Flow

```
On app mount:
  1. Read token + user from localStorage
  2. If found → set AUTHENTICATED immediately (optimistic UX)
  3. Send token to backend for verification
  4. If invalid → clear localStorage → UNAUTHENTICATED

On login:
  1. Store token + user in localStorage
  2. Set state to AUTHENTICATED
  3. Navigate to /u/:username/home

On logout:
  1. Clear localStorage
  2. Set state to UNAUTHENTICATED
  3. Navigate to /user/login
```

---

## 📁 Directory Structure

```
frontend/
├── index.html                     Entry HTML: meta tags, CSP, Service Worker reg
├── vite.config.js                 Build config: R2 proxy, esbuild, optimizations
├── package.json                   44 dependencies, 7 dev scripts
│
└── src/
    ├── main.jsx                   ReactDOM.render entry point
    ├── App.jsx                    Root: providers + BrowserRouter + 40+ lazy routes
    │
    ├── components/                62+ feature components (see Component Library)
    │
    ├── contexts/
    │   ├── LoadingContext.jsx      Global loading spinner state
    │   ├── UserAuthContext.jsx     JWT auth with localStorage persistence
    │   └── NotificationContext.jsx User notification management
    │
    ├── hooks/
    │   ├── useNavigationWithLoading.js  Navigate + trigger loading spinner
    │   ├── usePerformanceTracking.js    Lazy load time measurement
    │   ├── usePerformanceMonitoring.js  Web Vitals CLS/LCP/FID observer
    │   ├── useScrollAnimation.js        IntersectionObserver scroll reveals
    │   ├── useMobileOptimizations.js    Mobile detection + adaptation
    │   └── useServerConnection.js       Backend health check + auto-reconnect
    │
    ├── utils/
    │   ├── apiClient.js            Fetch wrapper with JWT auth headers
    │   ├── cardTilt.js             3D mouse parallax tilt for all cards
    │   ├── seoManager.js           Per-route SEO config management
    │   ├── seoHelpers.js           Meta tag generator helpers
    │   ├── dynamicSeo.js           JSON-LD structured data injection
    │   ├── sitemapGenerator.js     XML sitemap builder utility
    │   ├── analytics.js            GA4 event tracking helpers
    │   ├── notifications.js        Notification API wrapper
    │   ├── notificationHelpers.js  Toast notification helpers
    │   ├── userHelpers.js          User object utility functions
    │   ├── mobileOptimizations.js  isMobile(), touch detection
    │   ├── mobilePerformanceMonitor.js  Mobile perf observer
    │   ├── pageOptimizationScript.js    Chrome Speculation Rules
    │   ├── performance.js          Web Vitals + custom metrics
    │   └── chunkPreloader.js       Route chunk prefetch utility
    │
    ├── lib/
    │   ├── adminApi.js             Full admin API client (1496 lines)
    │   └── apiClient.js            Generic HTTP client
    │
    ├── config/                     App-level constants
    ├── assets/fonts/
    │   └── samarkan.ttf            Custom decorative Indian font
    │
    ├── styles/
    │   ├── react-toastify-custom.css   Custom Toastify theme
    │   └── toastify-black-theme.css    Dark Toastify variant
    │
    ├── index.css                   Global CSS variables, reset, typography
    ├── App.css                     App shell and layout styles
    ├── critical.css                Above-the-fold critical CSS (LCP optimization)
    ├── performance.css             Rendering performance CSS hints
    ├── mobile-optimizations.css    Mobile-specific style overrides
    ├── mobile-performance.css      Mobile performance CSS
    ├── responsive-utilities.css    Responsive helper utility classes
    └── toastify-custom.css         Toast animation overrides
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- Backend API running at `http://localhost:8787`

### Installation

```bash
# Clone the repository
git clone https://github.com/Abhijith-Sura/kalakritam.git
cd kalakritam/frontend

# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:5173
```

---

## 🔑 Environment Variables

Create a `.env` file in the **project root** (one directory above `frontend/`):

> The `vite.config.js` sets `envDir: '..'` so environment variables are read from the parent directory.

```env
# Backend API URL
VITE_API_URL=http://localhost:8787

# Google OAuth Client ID (from Google Cloud Console)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Cloudflare R2 Public CDN URL (for images and videos)
VITE_R2_PUBLIC_URL=https://pub-xxxx.r2.dev

# App environment
VITE_APP_ENV=development
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR on port 5173 |
| `npm run dev:fast` | Dev server with `--force` (busts HMR cache) |
| `npm run build` | Production build to `dist/` |
| `npm run build:prod` | Production build with `NODE_ENV=production` |
| `npm run build:analyze` | Build + open bundle size analyzer |
| `npm run preview` | Preview production build locally |
| `npm run start` | Serve production build on port 4173 |
| `npm run lint` | Run ESLint across all source files |

---

## 🌐 Deployment

### Cloudflare Pages — Auto-Deploy

Pushes to `main` trigger automatic deployment via Cloudflare Pages:

```
Build command:   cd frontend && npm install && npm run build
Build output:    frontend/dist
Root directory:  /
```

**Production URL:** `https://kalakritam.in`

### Production Environment Variables

Set in Cloudflare Pages → Settings → Environment Variables:

```
VITE_API_URL            = https://api.kalakritam.in
VITE_GOOGLE_CLIENT_ID   = <production-google-client-id>
VITE_R2_PUBLIC_URL      = https://pub-xxxx.r2.dev
VITE_APP_ENV            = production
```

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--gold-primary` | `#c38f21` | Brand color, CTAs, primary highlights |
| `--gold-light` | `#e8b84b` | Hover states, secondary accents |
| `--gold-dark` | `#a0721a` | Pressed/active states |
| `--bg-dark` | `#0a0a0f` | Primary page background |
| `--bg-card` | `#12121a` | Card backgrounds |
| `--text-primary` | `#f5f0e8` | Primary text color |
| `--text-muted` | `rgba(245,240,232,0.6)` | Secondary/muted text |

### Typography

| Role | Font | Weight |
|---|---|---|
| **Display / Logo** | Samarkan (local .ttf) | 400 |
| **Section Headings** | Cinzel (Google Fonts) | 400–700 |
| **Accent / Subheadings** | Dancing Script (Google Fonts) | 700 |
| **Body & UI** | Montserrat (Google Fonts) | 300–600 |

All design tokens are defined as CSS custom properties in `src/index.css`.

---

## 📝 Developer Notes

> **Particle performance:** Particles are disabled on mobile via `isMobile()` check. Desktop count was reduced 20% from the original spec to prevent visual over-dominance.

> **Environment directory:** The `.env` file belongs in the **project root**, not inside `frontend/`. Vite's `envDir: '..'` setting handles this automatically.

> **R2 media:** All images and videos are hosted on Cloudflare R2 — not in this repo. Set `VITE_R2_PUBLIC_URL` correctly or no media will load.

> **WebGL components:** `CosmicOrbit` and `VirtualGallery` are GPU-intensive. They auto-disable on mobile via `isMobile()` to protect battery life and performance.

> **Admin JWT:** Admin routes are NOT wrapped by `RequireAuth`. Instead, every admin API call sends the admin JWT header and the server rejects unauthorized requests.

---

<div align="center">

Built with ❤️ for the art community in Hyderabad, India.

**[kalakritam.in](https://kalakritam.in)**

</div>
