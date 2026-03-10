# 🚗 BlaBlaCar India Clone — PRD v2.0 (Showcase Edition)

**Version**: 2.0 — Showcase / Portfolio Build  
**Tech Stack**: Next.js 15 · TypeScript · Tailwind CSS v4  
**Design System**: Material You (MD3) — adapted with custom brand tokens  
**Color Theme**: Background `#FFFFFF` · Highlight `#177d19` · Text `#19191b`  
**Scope**: Demo-ready, not production. One real API (Mapbox). Everything else mocked.

---

## 1. Project Overview

A showcase-grade intercity carpooling marketplace replicating BlaBlaCar.in's look, feel, and core user flows. The goal is to **demonstrate the full product experience** — search, book, publish, dashboard — in a way that feels completely real to anyone using it.

**Guiding principle**: If it looks real and feels real, it *is* real for demo purposes.

### What's Real vs Mocked

| Concern | Approach |
|---|---|
| **Maps & city autocomplete** | ✅ Real — Mapbox API (only external dependency) |
| **Payments** | 🎭 Mocked — Realistic UPI flow with fake QR, 3s processing animation, success state |
| **Auth / OTP** | 🎭 Mocked — Any credentials work; OTP is always `123456`; session stored in `localStorage` |
| **Database** | 🎭 Mocked — All data lives in `/lib/mock-data/` JSON files; in-memory state via Zustand |
| **SMS / Email** | ❌ Removed — Not needed |
| **File storage** | 🎭 Mocked — Uploads preview locally via `FileReader`, no actual upload |
| **Real-time messaging** | 🎭 Mocked — `setInterval` simulates driver replies after 2–4s |
| **ID Verification** | 🎭 Mocked — Upload UI shown, auto-approves after 2s "processing" animation |
| **Notifications** | 🎭 Mocked — Pre-seeded notification list, new ones added on booking/message actions |

---

## 2. Design Token System

### Brand Colors

```ts
// tailwind.config.ts
colors: {
  brand: {
    primary:     '#177d19',   // CTA buttons, links, active states
    primary90:   '#177d19E6', // hover (90% opacity)
    primary80:   '#177d19CC', // active/pressed (80% opacity)
    primary10:   '#177d191A', // ghost hover overlay
    primary5:    '#177d190D', // ghost focus overlay
  },
  surface: {
    bg:          '#FFFFFF',   // page background
    container:   '#F3FAF3',   // card backgrounds (tinted green-white)
    low:         '#E8F5E8',   // input fills, recessed surfaces
    outline:     '#79747E',   // borders
  },
  text: {
    primary:     '#19191b',   // headings, body
    secondary:   '#49454F',   // captions, metadata
    onPrimary:   '#FFFFFF',   // text on green buttons
  }
}
```

### Typography
- **Font**: Inter via `next/font/google` (weights: 400, 500, 700)
- Scale follows MD3: Display Large (56px) → Label Small (12px)
- Buttons: `font-medium tracking-wide text-sm`

### Radius & Spacing
- Cards: `rounded-3xl` (24px)
- Hero/major sections: `rounded-[48px]`
- Buttons: `rounded-full` (pill — always)
- Inputs: `rounded-t-xl rounded-b-none border-b-2` (MD3 filled style)
- Section padding: `py-16 md:py-24`
- Card padding: `p-6 md:p-8`

### Motion
- Card hover: `hover:scale-[1.02] shadow-sm hover:shadow-md transition-all duration-300`
- Button active: `active:scale-95`
- Easing: `cubic-bezier(0.2, 0, 0, 1)`
- Blur blobs in hero: `blur-3xl opacity-15` (brand green)

---

## 3. Architecture

```
/
├── app/
│   ├── page.tsx                      # Homepage
│   ├── rides/
│   │   ├── page.tsx                  # Search results
│   │   ├── [id]/page.tsx             # Ride detail
│   │   └── publish/page.tsx          # Publish wizard
│   ├── bookings/
│   │   ├── page.tsx                  # My bookings
│   │   └── [id]/page.tsx             # Booking detail + ticket
│   ├── dashboard/
│   │   ├── page.tsx                  # Dashboard
│   │   └── profile/page.tsx          # Edit profile
│   ├── messages/
│   │   ├── page.tsx                  # Conversation list
│   │   └── [id]/page.tsx             # Chat view
│   ├── profile/[id]/page.tsx         # Public user profile
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── how-it-works/page.tsx
│   └── api/
│       ├── maps/
│       │   ├── autocomplete/route.ts # → Mapbox Places API
│       │   └── route-distance/route.ts # → Mapbox Directions API
│       ├── rides/
│       │   ├── search/route.ts       # filters mock data
│       │   ├── create/route.ts       # appends to mock store
│       │   └── [id]/route.ts
│       ├── bookings/
│       │   ├── route.ts
│       │   └── [id]/cancel/route.ts
│       ├── payments/
│       │   └── mock-process/route.ts # waits 3s, always returns success
│       ├── messages/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── auth/
│       │   ├── login/route.ts        # accepts any credentials
│       │   └── register/route.ts     # creates mock user
│       └── users/
│           └── [id]/route.ts
│
├── lib/
│   ├── mock-data/
│   │   ├── rides.ts                  # 20+ seeded rides across Indian cities
│   │   ├── users.ts                  # 15+ driver/passenger profiles
│   │   ├── bookings.ts               # sample past bookings
│   │   ├── reviews.ts                # sample reviews
│   │   └── messages.ts               # sample conversations
│   ├── store/
│   │   ├── auth.ts                   # Zustand: current user session
│   │   ├── rides.ts                  # Zustand: rides state
│   │   ├── bookings.ts               # Zustand: bookings state
│   │   └── messages.ts               # Zustand: messages state
│   ├── mapbox.ts                     # Mapbox API helpers (server-side)
│   ├── mock-payment.ts               # Payment simulation logic
│   └── utils.ts                      # formatCurrency, formatDate, getDistance
│
├── components/
│   ├── ui/                           # Atoms
│   ├── rides/
│   ├── bookings/
│   ├── dashboard/
│   ├── messages/
│   └── layout/
│
└── types/index.ts
```

---

## 4. Mock Data Strategy

All data lives in `/lib/mock-data/`. Zustand stores hydrate from these on app start and allow in-memory mutations (new rides, bookings, messages) that persist for the session.

### Seed Data Requirements

**Rides** (20+ entries covering popular Indian routes):
- Mumbai → Pune, Delhi → Agra, Bangalore → Mysore, Chennai → Pondicherry
- Hyderabad → Vijayawada, Kochi → Trivandrum, Jaipur → Udaipur
- Each with realistic driver, price (₹250–₹800), departure times spread across next 7 days
- Mix of verified/unverified drivers, different seat counts, preferences

**Users** (15+ profiles):
- Mix of drivers and passengers
- Realistic Indian names, cities, profile photos (use `https://i.pravatar.cc/150?u={id}`)
- Varying ratings (3.8 → 5.0), trip counts (2 → 180)
- Some with verified badges, some without

**Reviews**: 30+ realistic reviews with tags (Punctual, Friendly, Clean car, etc.)

**Bookings**: 5 sample past bookings for the demo user (mix of completed/cancelled)

**Messages**: 3 sample conversations with pre-seeded chat history

---

## 5. Feature Modules

---

### Module 1: Auth (Mocked)

**Registration UI**:
- Full-page split layout: decorative left panel (green gradient + blob shapes) + form right
- Fields: Name, Phone (+91 prefix), Email, Password
- "Continue with Google" pill button (UI only, no actual OAuth)
- After submit → OTP screen: 6-box PIN input, auto-focus progression
- OTP hint shown: *"Use 123456 for demo"* (subtle grey text below input)
- After OTP → redirect to homepage, session saved to `localStorage`

**Login UI**:
- Same split layout
- Phone + Password fields
- Any credentials work — API route always returns success with a mock user
- "Demo credentials" hint below form

**Mock API Routes**:
- `POST /api/auth/register` → creates user in Zustand store, returns mock JWT
- `POST /api/auth/login` → always succeeds, returns seeded demo user session
- Session: stored in `localStorage` as `{ user, token }`, read by Zustand auth store

**No real password hashing, no real JWT — just a mock token string.**

---

### Module 2: Ride Publishing — 6-Step Wizard

**Step 1 – Route**:
- Origin city input with **Mapbox autocomplete** (real, filtered to India)
- Destination city input with **Mapbox autocomplete** (real)
- Date picker: calendar UI, past dates disabled
- "Add a stop" expandable section: up to 2 intermediate cities (also Mapbox autocomplete)
- Map preview updates live as origin/destination selected (Mapbox GL JS embed)

**Step 2 – Seats & Vehicle**:
- Seat count: pill toggle buttons 1–6 (not a slider)
- Vehicle make dropdown (Indian popular cars: Maruti Swift, Honda City, Toyota Innova, etc.)
- Model & color text fields
- Vehicle photo: file input with local preview via `FileReader` (no upload)

**Step 3 – Pricing**:
- Distance auto-fetched from **Mapbox Directions API** via `/api/maps/route-distance`
- Suggested price = `distance × ₹3.25 ÷ seats` (shown as recommendation)
- Price slider: ₹50 → ₹2000, snaps to ₹50 increments
- Live earnings preview: `price × 0.80` (after 20% platform fee)
- Price comparison chip: "₹X cheaper than bus"

**Step 4 – Preferences**:
- Toggle cards (not plain toggles): Smoking / Pets / Music
- Chat preference: 3 pill options — Silent 🤫 / Some chat 💬 / Let's chat! 🎉
- Luggage: 3 illustrated options — Small bag / Backpack / Large suitcase

**Step 5 – Meeting Point**:
- Mapbox GL JS map centered on origin city
- Draggable pin for pickup location
- Suggested spots list below map (hardcoded for popular cities: railway station, bus stand, major landmarks)
- Same for drop-off near destination

**Step 6 – Review & Publish**:
- Full summary card styled like a ticket/receipt
- Animated "Publish" button: on click → loading spinner (1.5s) → success animation (checkmark) → redirect to dashboard

**Mock API**: `POST /api/rides/create` appends to Zustand rides store, generates mock ID.

---

### Module 3: Search & Discovery

#### 3.1 Homepage

**Hero Section**:
- Large `rounded-[48px]` surface-container card
- Two organic blur blobs (brand green, `blur-3xl`, 15% opacity) positioned behind
- Headline: *"Share the ride, share the road"*
- Search form embedded in hero: Origin → Destination → Date → Seats
- Origin/Destination: **Mapbox autocomplete** inputs (real)
- "Search" CTA: large green pill button

**Below the fold**:
- **Popular Routes** grid: 6 cards with origin→destination, avg price, weekly trips count (all mocked)
- **How It Works**: 3-step with numbered badges + icons (Search → Book → Ride)
- **Trust Section**: 3 stat cards — "2M+ rides shared", "98% on-time", "Verified drivers"
- **Testimonials**: 3 review cards with avatar, name, rating, quote (seeded)
- **Download App** banner (UI only, no links)

#### 3.2 Search Results

**URL**: `/rides?from=Mumbai&to=Pune&date=2025-03-10&seats=1`

**Layout**:
- Filter sidebar (desktop) / bottom sheet (mobile)
- Results list with count: *"14 rides found"*

**Filters**:
- Price range: dual-thumb slider
- Departure time: Morning (6–12) / Afternoon (12–17) / Evening (17–21) / Night (21–6) — pill toggles
- Verified drivers only: toggle
- Preferences: No smoking / Pets OK / AC car — chips
- Seats available: stepper

**Sorting**: Earliest departure / Cheapest / Best rated

**RideCard** contains:
- Driver avatar (pravatar) + name + star rating + verified badge (if applicable)
- Route: Origin time → Destination time with duration
- Seats available: green pill badge
- Vehicle: make + color icon
- Price per seat: large, green, prominent
- Preference icons: smoke/pet/chat (greyed out if not allowed)
- "View Ride" button → navigates to detail page

**Empty state**: Illustrated empty state + "Set up a ride alert" CTA

**Mock API**: `GET /api/rides/search` filters the mock rides JSON by from/to/date/seats.

#### 3.3 Ride Detail

**Layout**: Two-column on desktop (details left, booking card sticky right)

**Left column**:
- Trip timeline: animated vertical line, origin → optional stops → destination with times
- Map: Mapbox GL JS showing the route polyline (real, from Mapbox Directions)
- Meeting point pin marked on map
- Driver card: large avatar, name, rating stars, total trips, member since, verified badge, bio
- Preferences section: icon chips for smoking/pets/chat/luggage
- Vehicle card: make/model/color + photo preview
- Reviews section: last 5 reviews with avatar, name, rating, comment, date

**Right column (sticky booking card)**:
- Date + time + seats available
- Visual seat map: SVG car diagram, clickable seats (green = available, grey = taken, brand-green = selected)
- Seat count stepper
- Price breakdown:
  - Seat price × count
  - Platform convenience fee: ₹15 (fixed for demo)
  - **Total** in large green text
- "Book Now" green pill CTA
- Driver contact note: *"Driver's number revealed after booking"*

---

### Module 4: Booking Flow

**Step 1 – Seat Selection** (on ride detail page inline)

**Step 2 – Passenger Details** (modal or new page):
- Pre-filled from mock session: name, phone
- Note to driver: optional textarea
- "Continue to Payment" CTA

**Step 3 – Payment (Mocked UPI Flow)**:
- Full-screen payment page styled like a real payment gateway
- Header: *"Pay ₹XXX to BlaBlaCar"*
- UPI section:
  - Generated fake QR code (use `qrcode` npm package, encode a fake UPI string)
  - QR refreshes with a countdown timer: *"QR expires in 9:47"*
  - UPI ID input: `name@upi` format with validation
  - Popular UPI app buttons: GPay / PhonePe / Paytm (icons, UI only)
- "Pay ₹XXX" green pill button
- On click → 3-second animated processing state:
  - Spinner with *"Verifying payment..."*
  - Then *"Confirming booking..."*
  - Then success ✅

**Step 4 – Booking Confirmed**:
- Animated checkmark (Lottie or CSS)
- Booking ticket card:
  - Booking ID: `BLB-XXXXXX` (random generated)
  - Route, date, time, seats
  - Driver name + now-revealed phone number (mock: +91 98XXX XXXXX)
  - Passenger name
  - Amount paid
  - QR code of booking ID
- "View My Bookings" + "Back to Home" CTAs

**Mock API**: `POST /api/payments/mock-process` → `setTimeout(3000)` → returns `{ success: true, bookingId }`. Booking added to Zustand store.

---

### Module 5: My Bookings

**Tabs**: Upcoming / Past / Cancelled

**BookingCard** shows:
- Route + date + time
- Driver/passenger info
- Seats booked
- Amount paid
- Status badge: Confirmed (green) / Completed (grey) / Cancelled (red)
- CTAs:
  - Upcoming: "View Ticket" + "Cancel Booking" + "Message Driver"
  - Past (no review yet): "Rate this trip" → opens review modal
  - Past (reviewed): shows your star rating
  - Cancelled: "Book another ride" link

**Cancel Flow**:
- Modal: reason selector (Driver cancelled / Change of plans / Emergency / Other)
- Refund policy shown based on time to departure
- "Confirm Cancellation" → updates Zustand store → toast notification

**Mock API**: All operations update Zustand store only.

---

### Module 6: Dashboard

**Two views based on mock user role** (toggle at top: "I'm a Passenger" / "I'm a Driver"):

#### Driver View
- **Stats row**: 4 cards — Total Rides Published / Total Passengers / This Month Earnings / Average Rating
- **Earnings chart**: Recharts bar chart, last 8 weeks, mock data
- **My Rides list**: Active rides with passenger count, upcoming date, status
  - Each ride: "View bookings" expandable → shows passenger avatars + names
  - Edit / Cancel ride actions
- **Pending requests**: If any bookings in `pending` state → approve/reject buttons
- **Quick actions**: "Publish New Ride" FAB

#### Passenger View
- **Stats row**: Total Trips / Cities Visited / Money Saved (vs cab) / Reviews Given
- **Upcoming rides**: next 2 bookings as prominent cards
- **Past trips map**: Mapbox map showing dots for all cities visited (mock)
- **Suggested rides**: 3 RideCards based on "your frequent routes" (mock)

---

### Module 7: Messaging

**Conversation List** (`/messages`):
- Each row: driver/passenger avatar, name, last message preview, timestamp, unread count badge
- Seeded with 3 conversations

**Chat View** (`/messages/[id]`):
- Bubble-style: own messages right-aligned (green), other's left-aligned (grey surface)
- Message input: MD3 filled style + send button
- System messages centered: *"Booking confirmed ✓"*, *"Trip completed"*
- **Simulated replies**: after user sends a message, `setTimeout(2000–4000)` triggers a pre-written reply from the driver (picked randomly from a reply pool per conversation)
- Typing indicator: animated 3-dot bubble shown during the timeout
- Conversation shows ride info banner at top: route + date

**Mock**: No real-time, no SSE. Just `setTimeout` for the simulation.

---

### Module 8: Reviews & Ratings

**Triggered from**: "Rate this trip" button on past booking card

**Review Modal**:
- Driver/passenger avatar + name
- Star rating: interactive, animated fill on hover
- Category chips (multi-select): Punctual / Friendly / Clean car / Safe driver / Good passenger / Great music
- Comment textarea: optional, 280 char limit with counter
- "Submit Review" → updates mock store → toast: *"Review submitted!"*
- Both sides can review (driver reviews passenger, passenger reviews driver)

**Public display**: On profile pages and ride detail driver card

---

### Module 9: User Profile

**Public Profile** (`/profile/[id]`):
- Cover area: gradient + avatar (large, 96px)
- Name, member since, bio
- Verification badges: Phone ✓ / Email ✓ / ID ✓ (green pills)
- Stats: X rides · X reviews · ⭐ X.X
- Preference icons: 🚬/🐾/💬
- Reviews list: paginated, 5 per load
- Active rides (if driver): 3 upcoming rides as compact cards

**Edit Profile** (`/dashboard/profile`):
- Photo: click to change, `FileReader` local preview
- Bio: textarea
- Preference toggles
- **ID Verification section**:
  - Upload front of Aadhaar/PAN (file input, local preview)
  - After "Submit" → 2s loading animation → "Verified ✓" badge appears (mock)
- Notification preferences: toggles (UI only)

---

### Module 10: Ride Alerts

**Triggered from**: Empty search results page

**Alert creation**:
- Modal: From city (Mapbox autocomplete) + To city + optional date range
- "Notify me" green pill button
- Saved to Zustand store

**My Alerts** (in dashboard sidebar):
- List of active alerts with toggle and delete
- Mock trigger: when user publishes a ride that matches an alert, a notification appears in the bell

---

### Module 11: Notifications

**Bell icon in header**: Badge with unread count

**Notification dropdown**:
- Pre-seeded: "Your booking BLB-123456 is confirmed", "Rahul rated you 5 stars", etc.
- New ones added automatically when user performs actions (book, message, etc.)
- Mark all read
- Each notification: icon + text + time ago

---

## 6. Page Inventory

| Route | Auth Required | Description |
|---|---|---|
| `/` | No | Homepage |
| `/rides` | No | Search results |
| `/rides/[id]` | No | Ride detail + booking |
| `/rides/publish` | Yes | Publish wizard |
| `/bookings` | Yes | My bookings |
| `/bookings/[id]` | Yes | Ticket / detail |
| `/dashboard` | Yes | Driver + Passenger dashboard |
| `/dashboard/profile` | Yes | Edit profile |
| `/messages` | Yes | Conversations |
| `/messages/[id]` | Yes | Chat |
| `/profile/[id]` | No | Public profile |
| `/login` | No | Login |
| `/register` | No | Register |
| `/how-it-works` | No | Static page |

**Auth guard**: If not logged in and hitting a protected route → redirect to `/login` with `?redirect=` param. No real JWT validation — just check `localStorage` for mock session.

---

## 7. API Routes (Simplified)

All routes return `{ success: boolean, data?: T, error?: string }`.

```
# Real (Mapbox)
GET  /api/maps/autocomplete?q=&country=in     → Mapbox Places API
GET  /api/maps/route-distance?from=&to=       → Mapbox Directions API

# Mocked (read/write in-memory Zustand store via server)
GET  /api/rides/search?from=&to=&date=&seats=
GET  /api/rides/[id]
POST /api/rides/create
PATCH /api/rides/[id]
DELETE /api/rides/[id]

GET  /api/bookings
GET  /api/bookings/[id]
POST /api/bookings/[id]/cancel

POST /api/payments/mock-process             → setTimeout(3000) → success

GET  /api/messages
GET  /api/messages/[id]
POST /api/messages/[id]

POST /api/auth/login                        → always succeeds
POST /api/auth/register                     → always succeeds

GET  /api/users/[id]
PATCH /api/users/profile
```

---

## 8. Component Library

### Atoms (`/components/ui/`)

| Component | Variants | Key behavior |
|---|---|---|
| `Button` | filled, tonal, outlined, ghost | `rounded-full`, `active:scale-95` |
| `Input` | text, phone, password | MD3: rounded-top, border-bottom-2 |
| `Card` | default, interactive | hover scale + shadow |
| `Badge` | filled, outline | pill shape |
| `Avatar` | sm, md, lg | with verified ring variant |
| `StarRating` | display, interactive | animated hover fill |
| `Chip` | selectable, filter | pill with icon |
| `Skeleton` | — | shimmer loading |
| `Toast` | success, error, info | bottom-center, auto-dismiss 3s |
| `Modal` | — | `rounded-[28px]`, backdrop blur |
| `Spinner` | sm, md, lg | brand green |
| `StepIndicator` | — | connected dots for wizard |

### Molecules

- `RideCard` — search result card with all ride info
- `RideSearchForm` — origin / destination / date / seats with Mapbox autocomplete
- `SeatPicker` — SVG car diagram with clickable seats
- `DriverCard` — avatar + stats + badges
- `PriceBreakdown` — itemized payment summary
- `TripTimeline` — animated vertical origin → destination
- `ReviewCard` — single review display
- `ChatBubble` — message bubble with tail
- `BookingTicket` — post-payment confirmation ticket
- `PaymentQR` — fake UPI QR with countdown timer
- `EarningsChart` — Recharts bar chart for dashboard

---

## 9. Mapbox Integration

**Only real external dependency.**

```ts
// .env.local
MAPBOX_ACCESS_TOKEN=pk.xxxxxxxx   // server-side only, never exposed to client
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxx  // public token for GL JS map rendering
```

**Two API routes** proxy all Mapbox calls:

```ts
// /api/maps/autocomplete/route.ts
// Calls: https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json
// Params: country=in, types=place, limit=5
// Returns: { suggestions: [{ name, fullName, coordinates }] }

// /api/maps/route-distance/route.ts
// Calls: https://api.mapbox.com/directions/v5/mapbox/driving/{from};{to}
// Returns: { distanceKm, durationMin }
```

**Client-side Mapbox GL JS** (for map embeds):
- Ride detail page: route polyline between origin and destination
- Publish wizard step 5: draggable meeting point pin
- Dashboard passenger view: cities visited dots

---

## 10. Payment Mock — UX Details

The payment flow must feel completely real. Here's exactly how it works:

```
User clicks "Book Now"
  → Booking details page (passenger info pre-filled)
  → "Continue to Payment"
  → Payment page:
      ┌─────────────────────────────┐
      │  Pay ₹480 to BlaBlaCar      │
      │                             │
      │  [QR CODE - fake UPI]       │
      │  Expires in 9:47 ⏱         │
      │                             │
      │  ── or pay with UPI ID ──   │
      │  [  yourname@upi        ]   │
      │                             │
      │  [G Pay] [PhonePe] [Paytm]  │
      │                             │
      │  [   Pay ₹480  ▶   ]        │
      └─────────────────────────────┘

  → Click "Pay ₹480"
  → 1s: "Verifying payment..." (spinner)
  → 1s: "Confirming with bank..." (spinner)
  → 1s: "Securing your seats..." (spinner)
  → ✅ Success animation
  → Booking confirmed page
```

QR code generated client-side using `qrcode` package encoding: `upi://pay?pa=blablacar@upi&pn=BlaBlaCar&am=480&tn=RideBooking`

---

## 11. Tech Stack

```json
{
  "framework":   "Next.js 15 (App Router)",
  "language":    "TypeScript 5",
  "styling":     "Tailwind CSS v4",
  "state":       "Zustand (all app state + mock data)",
  "maps":        "Mapbox GL JS + Mapbox API (only real external API)",
  "charts":      "Recharts (dashboard earnings)",
  "qr":          "qrcode (payment mock)",
  "icons":       "Lucide React",
  "animations":  "Framer Motion (page transitions, step wizard, payment success)",
  "auth":        "Mock only — localStorage session",
  "database":    "None — JSON mock data in /lib/mock-data/",
  "deployment":  "Vercel"
}
```

---

## 12. Implementation Plan (4 Days)

### Day 1 — Foundation + Homepage
- Project setup: Next.js, Tailwind, Zustand, Mapbox
- Design tokens: colors, typography, spacing in Tailwind config
- Component library: Button, Input, Card, Badge, Avatar, Skeleton, Toast
- Seed all mock data (rides, users, bookings, messages, reviews)
- Homepage: Hero + Search form (Mapbox autocomplete) + Popular routes + How it works + Testimonials

### Day 2 — Core Ride Flow
- Search results page with filters and sorting
- Ride detail page: timeline, Mapbox route map, driver card, seat picker
- Publish ride wizard: all 6 steps with Mapbox in steps 1 & 5
- Booking flow: seat selection → passenger details → payment mock → confirmation ticket

### Day 3 — User Experience Modules
- Auth pages: login + register (mock, OTP UI with 123456 hint)
- Dashboard: driver view + passenger view with Recharts earnings chart
- My bookings: tabs, cancel flow, rate driver modal
- Messaging: conversation list + chat view with simulated replies

### Day 4 — Polish & Demo-Ready
- User profiles: public view + edit profile + ID verification mock
- Notifications bell with dropdown
- Ride alerts UI
- Mobile responsiveness: bottom nav, responsive grids, touch targets
- Loading skeletons on all data-fetching pages
- Page transitions (Framer Motion)
- Final demo data review: ensure all flows are seamless end-to-end

---

## 13. Design Signature Details

- **Hero**: `rounded-[48px]` green-tinted container, 2× blur blobs (`blur-3xl opacity-15`), frosted search card
- **RideCard**: `hover:scale-[1.02]`, green price badge pill, verified driver chip, smooth shadow elevation
- **Publish Wizard**: Connected step dots, slide-in animation per step, summary ticket at the end
- **Seat Picker**: SVG car overhead view, green seats available, grey = taken, animated selection
- **Payment Screen**: Full-page dark overlay, card-style payment widget, sequential loading messages
- **Chat**: Typing indicator (3-dot bounce), green own-message bubbles, ride banner at top
- **Dashboard**: Staggered card entrance animations, Recharts bar chart with brand green bars
- **Mobile Bottom Nav**: 5 tabs (Home / Search / Publish+ / Bookings / Profile), active tab = green pill bg

---

*End of PRD — BlaBlaCar India Clone v2.0 (Showcase Edition)*
