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
   You must never declare raw TypeScript interfaces inline or duplicate them inside individual page or component files. You must centralize all core database schemas and application types inside the `src/types/` directory. Always import your types cleanly from this folder to ensure the entire application stays typed uniformly.