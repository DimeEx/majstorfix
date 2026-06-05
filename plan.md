# Project Plan: MajstorFix (МајсторФикс)
## Reverse-Auction Handyman Platform for North Macedonia

This document outlines the product specifications, market adaptations, database architecture, and technical stack for building the web application MVP of **MajstorFix**—a localized platform where Macedonian homeowners post repair jobs and local handymen bid on them transparently.

---

## 1. Core Market Adaptation & Strategy

In North Macedonia, handymen traditionally operate under the *"Ќе се договориме"* (We will make a deal) model, keeping their pricing and availability private. To achieve market fit, this web application flips the standard directory model into a **Reverse-Auction/Job Posting System**:

1. **Buyer/Homeowner Initiates:** Homeowners outline the exact conditions of the repair job, bypassing repetitive phone call explanations.
2. **Handyman Bids Privately:** Handymen see detailed parameters (photos, flooring, material requirements) and provide quick, low-friction digital quotes.
3. **Communication Shortcut:** Built-in deep linking allows instant transition to phone calls or **Viber** (the primary messaging medium for local tradesmen).

---

## 2. Technical Stack & Libraries

The app is architected for maximum performance on mobile web browsers, ease of implementation using AI coding tools (like Cursor, v0, or local Ollama configurations), and zero-friction scaling to native app stores later.

### Frontend Framework
*   **Next.js 15+ (App Router):** Provides fast, SEO-friendly server rendering and optimized routing.
*   **React 19:** State-driven UI for handling complex, multi-step multi-variable forms.

### Styling & UI
*   **Tailwind CSS:** For fast, mobile-first responsive utility styling.
*   **Shadcn/ui:** Pre-built, accessible UI components (dialogs, toggles, forms) that AI code generators understand perfectly.
*   **Lucide React:** Clean, lightweight iconography for visual traits (elevators, tools, housing types).

### Backend & Database (BaaS)
*   **Supabase:** Combines backend-as-a-service utilities into one integration:
    *   **PostgreSQL Database:** Strong relational integrity for handling jobs and interconnected bids.
    *   **Supabase Storage:** S3-compatible bucket storage for handling mandatory user-uploaded photos.
    *   **Supabase Auth:** Low-friction authentication for managing users/handymen via phone OTP or email.

### Utility Libraries
*   **Zod + React Hook Form:** For strict schema validation of mandatory form inputs before sending data to the server.

---

## 3. Product Feature Specifications

### A. The Multi-Step "Post a Job" Wizard (Homeowner)
To ensure high completion rates on mobile browsers, the job posting form is split into a clean, 3-step wizard panel:

*   **Step 1: General Info & Visuals**
    *   *City Selection:* Dropdown listing major Macedonian hubs (Skopje, Bitola, Ohrid, Tetovo, etc.).
    *   *Neighborhood / Municipality:* Text input for localized traffic considerations (e.g., Aerodrom, Taftalidze).
    *   *Problem Description:* Detailed text area explaining the issue.
    *   *Photos of the Problem:* **Mandatory field.** File upload zone accepting camera/gallery attachments.
*   **Step 2: Property Traits (The Technical Context)**
    *   *Property Type Toggle:* `House` or `Apartment`.
    *   *Conditional Apartment Fields:* If `Apartment` is active, input fields for **Floor Number** and a **Has Elevator?** (`Yes/No`) toggle dynamically slide down.
    *   *Occupancy Status Toggle:* `Property is occupied` or `Property is empty / rental`.
*   **Step 3: Logistics & Budget**
    *   *Material Supply Selection:* Radio buttons for:
        *   `I will buy the materials`
        *   `Handyman should supply the materials`
        *   `To be negotiated`
    *   *Urgency Dropdown:* `Emergency (Today)`, `Within 2-3 Days`, or `Flexible`.
    *   *Listing Expiration:* `24 Hours`, `3 Days`, or `7 Days` (how long the ad remains open for bidding).
    *   *Expected Budget:* Minimum and Maximum MKD input fields to filter realistic handymen.

### B. The Active Jobs Dashboard (Handyman Feed)
*   A clean, scrollable feed filterable by **City** and **Trade Type**.
*   Each job card displays property traits cleanly using compact UI badges (e.g., `3rd Floor - No Elevator` | `Emergency`).
*   Photos are displayed in a native slider/thumbnail grid.

### C. The Dual-Pricing Bidding Module (Handyman Interaction)
When a handyman opens an active job, they are presented with a direct response module tailored to material preferences:
*   **Price Option A (Labor Only):** Input field for work cost alone.
*   **Price Option B (Labor + Materials):** Input field for full-service coverage.
*   **Earliest Availability:** Dedicated date/time picker.
*   **Contact Information:** Phone number registry for matching.

### D. The Real-Time Lead Tracker (Homeowner Dashboard)
*   Homeowners see their job post alongside a incoming feed of quotes.
*   The system hides precise contact details from the public web feed. Once the homeowner views the incoming quotes, they can tap directly to reveal the connection:
    *   **Call Button:** Initiates native mobile dialer (`tel:389...`).
    *   **Viber Shortcut:** Launches Viber using deep linking with a pre-formatted template text detailing the job ID.

---

## 4. Database Architecture (Supabase SQL)

Execute this initial schema directly in your Supabase SQL editor to create the necessary relational data states:

```sql
-- Create Enum Types for cleaner state management
CREATE TYPE property_enum AS ENUM ('house', 'apartment');
CREATE TYPE material_enum AS ENUM ('buyer_provides', 'handyman_provides', 'negotiable');
CREATE TYPE urgency_enum AS ENUM ('emergency', 'few_days', 'flexible');

-- 1. Create the Main Jobs Table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT NOT NULL,
    city TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    property_type property_enum NOT NULL,
    floor INT DEFAULT NULL,
    has_elevator BOOLEAN DEFAULT FALSE,
    is_occupied BOOLEAN DEFAULT TRUE,
    material_status material_enum NOT NULL,
    urgency urgency_enum NOT NULL,
    active_days INT NOT NULL DEFAULT 3,
    budget_min INT NOT NULL,
    budget_max INT NOT NULL,
    image_urls TEXT[] NOT NULL, -- Array of URLs pointing to Supabase Storage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create the Bids Table
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    handyman_phone TEXT NOT NULL,
    price_labor_only INT NOT NULL,
    price_with_materials INT DEFAULT NULL,
    availability_date TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- PROJECT LAYOUT
majstor-fix/
├── src/
│   ├── app/                    # Next.js App Router (Pages, Layouts, APIs)
│   │   ├── layout.tsx          # Global layout (Providers, Fonts, Metadata)
│   │   ├── page.tsx            # Landing / Homepage
│   │   ├── jobs/               # Handyman Feed View
│   │   │   ├── page.tsx        # /jobs - Feed listing page
│   │   │   └── [id]/           # /jobs/[id] - Detailed view for a specific job
│   │   │       └── page.tsx
│   │   ├── post-job/           # Buyer Wizard View
│   │   │   └── page.tsx        # /post-job - The multi-step form page
│   │   └── dashboard/          # Homeowner Tracker View
│   │       └── page.tsx        # /dashboard - Live tracking of incoming bids
│   │
│   ├── components/             # Reusable UI Components
│   │   ├── ui/                 # Shadcn/ui Core Primitives (Buttons, Dialogs, Inputs)
│   │   ├── forms/              # Feature-specific form sub-components
│   │   │   ├── step-general.tsx
│   │   │   ├── step-property.tsx
│   │   │   └── step-logistics.tsx
│   │   ├── jobs/               # Components specific to the job feed
│   │   │   ├── job-card.tsx
│   │   │   └── job-filters.tsx
│   │   └── shared/             # Global layout fragments
│   │       ├── navbar.tsx
│   │       └── mobile-nav.tsx
│   │
│   ├── lib/                    # Configuration & Third-Party Initializations
│   │   ├── supabase.ts         # Supabase client configuration
│   │   └── utils.ts            # Tailwind class merger (Shadcn standard)
│   │
│   ├── types/                  # TypeScript Types & Database Interfaces
│   │   └── database.types.ts   # Generated Supabase types
│   │
│   └── hooks/                  # Custom React Hooks
│       └── use-active-bids.ts  # Real-time subscription hook for bids
│
├── public/                     # Static files (Icons, Logos, Manifest)
│   └── icons/
├── supabase/                   # Local Supabase configurations (if using CLI)
│   └── migrations/
├── package.json
└── tailwind.config.ts


### 🛑 Strict Structural Rules for AI Generation

When writing or modifying code for this project, you must strictly follow these structural rules:

1. **Enforce Component Colocation**
   You must separate layout routing from complex UI state. Your page files (e.g., `app/post-job/page.tsx`) must only manage top-level page state and coordination. You must place the actual forms, fields, and heavy interactive elements inside dedicated, modular components under `components/forms/` or `components/jobs/`. Keep files short and single-purpose so they are easy to read and debug.

2. **Define Clear Client Boundaries**
   Remember that Next.js uses Server Components by default. Because our forms, step wizards, and real-time trackers rely entirely on React state management (`useState`, `useEffect`, or interactive event handlers), you must explicitly add the `"use client"` directive at the very top of these component files. Keep server logic and client logic strictly separated.

3. **Keep Types Extracted**
   You must never declare raw TypeScript interfaces inline or duplicate them inside individual page or component files. You must centralize all core database schemas and application types inside the `lib/supabase/types.ts` file. Always import your types cleanly from this folder to ensure the entire application stays typed uniformly.

---

## Implementation Summary (June 2026)

### Tech Stack (Installed)
| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.7 |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS | v4 |
| Components | shadcn/ui (base-nova) | 4.10.0 |
| Icons | Lucide React | 1.17.0 |
| Validation | Zod | 4.4.3 |
| Forms | React Hook Form + @hookform/resolvers | 7.77 / 5.4 |
| Database | Supabase (PostgreSQL) | @supabase/supabase-js 2.107 |
| Auth | Supabase Auth + @supabase/ssr | latest |
| Testing | Vitest + Testing Library | 4.1.8 / 16.3 |

### Project Structure (Actual)
```
majstorfix/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (Navbar, Geist fonts, Toaster)
│   ├── page.tsx                  # Landing page (dual CTA)
│   ├── post-job/page.tsx         # Multi-step wizard page
│   ├── jobs/
│   │   ├── page.tsx              # Filterable job feed (dynamic, searchParams)
│   │   └── [id]/page.tsx         # Job detail + bid form (dynamic, params)
│   └── dashboard/page.tsx        # Homeowner lead tracker
├── components/
│   ├── ui/                       # shadcn/ui primitives (14 components)
│   ├── shared/navbar.tsx         # Sticky navigation
│   ├── post-job/
│   │   ├── wizard-provider.tsx   # 3-step wizard state container
│   │   ├── step-general-info.tsx # City, neighborhood, description, photos
│   │   ├── step-property-traits.tsx # House/Apartment, floor, elevator, occupancy
│   │   └── step-logistics.tsx    # Materials, urgency, expiry, budget range
│   ├── jobs/
│   │   ├── job-card.tsx          # Job listing card
│   │   ├── job-filters.tsx       # City filter (URL search params)
│   │   └── job-badges.tsx        # Property + urgency badges
│   ├── bid/
│   │   └── bid-form.tsx          # Dual pricing, phone, date, notes
│   └── dashboard/
│       ├── lead-tracker.tsx      # Dashboard landing (empty state)
│       └── contact-buttons.tsx   # tel: + viber:// deep links
├── lib/
│   ├── utils.ts                  # cn() helper
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client (use client)
│   │   ├── server.ts             # Server Supabase client (async cookies)
│   │   └── types.ts              # Database types (Job, Bid, Database)
│   └── validations/
│       ├── job-schema.ts         # Zod schemas for all 3 wizard steps + full
│       └── bid-schema.ts         # Zod schema for bid form
├── supabase/migrations/
│   └── 00001_initial_schema.sql  # Full migration (enums, tables, indexes, RLS)
├── __tests__/                    # 61 tests across 13 files
│   ├── ui/                       # Button + Input unit tests
│   ├── supabase/                 # Types, client imports, migration content
│   ├── validations/              # Zod schema validation tests
│   ├── pages/                    # Page rendering + navbar tests
│   └── components/               # JobBadges + ContactButtons tests
├── vitest.config.ts
├── components.json               # shadcn config
├── .env                          # Supabase credentials (SUPABASE_URL, ANON_API_KEY, etc.)
└── package.json
```

### Completed Work
- **Auth check in wizard** — `wizard-provider.tsx` now calls `supabase.auth.getUser()` before insert; shows "Мора да бидете најавени" if not authenticated
- **Fixed `.env` variable names** — Added `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` so the browser client initializes correctly (server client uses unprefixed names)
- **New DB columns** — Added `urgency_custom`, `completion_time`, `completion_time_custom`, `currency` to migration, types, tests, and insert payload
- **Types alignment** — `Database` type updated to match Supabase's expected shape (`Relationships`, `Views`, `Functions`)
- **Insert uses real `owner_id`** — Now passes `userData.user.id` instead of hardcoded `null`
- **Auth pages** — Added `app/auth/login/page.tsx`, `app/auth/register/page.tsx`, `app/auth/confirm/page.tsx`, server actions (signUp/signIn/signOut), Supabase SSR middleware, and navbar auth state (login/logout buttons)
- **Real data fetching** — `/jobs` fetches from Supabase with city filter, `/jobs/[id]` fetches single job with full details, `/dashboard` fetches user's own jobs with auth check
- **Bid submission** — `BidForm` now inserts into Supabase `bids` table with loading state, toast feedback, and form reset
- **Image upload** — `StepGeneralInfo` now uploads files to Supabase Storage (`job-images` bucket) with previews, upload progress, and stores returned URLs
- **Server actions** — Created `lib/actions/create-job.ts` and `lib/actions/create-bid.ts`; wizard and bid form now use server actions instead of direct Supabase client calls
- **Route protection** — `middleware.ts` redirects unauthenticated users from `/post-job` and `/dashboard` to `/auth/login`
- **Real-time quotes** — `useActiveBids` hook subscribes to Realtime INSERTs on `bids` table; dashboard shows live bid count badges per job
- **Handyman profile** — `/profile` page with user email, registration date, and link to dashboard; navbar updated with "Моите" link and profile icon
- **edit/delete job** — `update-job` and `delete-job` server actions; edit page at `/jobs/[id]/edit`; edit button on job detail; owner-only checks; RLS DELETE policy migration
- **Trade type / category** — `trade_type` column (migration `00007`), `TradeType` type, `tradeTypeEnum` in Zod schema, select in wizard/edit-form/filters, `JobBadges` display, URL param filtering; all labels in Macedonian
- **Select dropdown positioning** — Changed `alignItemWithTrigger` from `true` to `false` in `select.tsx` so menu always opens downward
- **Fixed "Other" → "Друго"** — Passed computed Macedonian label as children to `<SelectValue>` in job-filters, step-general-info, edit-job-form
- **ThemeProvider fix** — Added `<ThemeProvider>` from `next-themes` to root layout with `suppressHydrationWarning` on `<html>` (fixed Toaster crash)
- **proxy.ts → middleware.ts** — Renamed to `middleware.ts` and exported as `middleware` function so Next.js actually invokes it
- **Fixed emailRedirectTo** — Changed from `SUPABASE_URL/auth/confirm` to dynamic origin from `headers()` in signUp server action
- **Optimized middleware** — Narrowed matcher to only `/post-job/:path*` and `/dashboard/:path*`; replaced `getUser()` with `getSession()` (no network call)
- **Optimized Navbar** — Replaced `getUser()` with `getSession()` for initial auth state (reads from cookie, no API call)
- **Removed redundant cache purges** — Removed `revalidatePath("/")` from signIn/signOut (redirect already triggers fresh render); removed `router.refresh()` after `router.push()` in edit-job-form and wizard-provider
- **Fixed useActionState wrapping** — Server actions `signIn`/`signUp` now accept `_prev` as first param; forms pass them directly to `useActionState` instead of wrapping in anonymous functions (fixes `pending` state / loading spinner)
- **Fixed client session sync** — `signIn` returns `accessToken`/`refreshToken`; login form calls `supabase.auth.setSession()` on the browser client to initialize the non-HttpOnly cookie so the Navbar detects the logged-in state
- **Replaced Realtime with polling** — `useActiveBids` hook now polls `getBidCounts` server action every 30s instead of subscribing to `postgres_changes` on `bids` table (was causing 13,959 `realtime.list_changes` calls = 64% of DB time); migration `00008` removes `bids` from `supabase_realtime` publication

### Test Coverage
- **22 test files · 128 tests — all passing**
- `npm test` — Vitest runner (4.1.8)
- Tests cover: UI components, Supabase types/migrations/storage, Zod validation, pages (navbar, home, dashboard, post-job), server actions (create/update/delete job, create bid), job card/badges/components, image gallery, owner bid panel, star rating

### Complete (MVP)
All features from the initial plan are implemented. The core MVP flow works:
1. User registers/logs in → browses jobs or posts a new job
2. Job posting wizard collects details with image uploads
3. Handymen view job details and submit bids
4. Homeowners see incoming bids in real-time on their dashboard
5. Contact via phone/Viber deep links