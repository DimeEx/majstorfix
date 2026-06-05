-- Migration: Initial schema for MajstorFix
-- Creates enum types, jobs table, and bids table

-- ============================================
-- UP
-- ============================================

-- Create Enum Types for cleaner state management
DO $$ BEGIN
  CREATE TYPE property_enum AS ENUM ('house', 'apartment');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE material_enum AS ENUM ('buyer_provides', 'handyman_provides', 'negotiable');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE urgency_enum AS ENUM ('emergency', 'few_days', 'flexible', 'custom');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE completion_time_enum AS ENUM ('1-2_hours', '3-4_hours', '5-8_hours', '1-2_days', '3+_days', 'custom');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE currency_enum AS ENUM ('MKD', 'EUR');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 1. Create the Main Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
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
    urgency_custom TEXT DEFAULT NULL,
    completion_time completion_time_enum NOT NULL,
    completion_time_custom TEXT DEFAULT NULL,
    active_days INT NOT NULL DEFAULT 3,
    currency currency_enum NOT NULL DEFAULT 'MKD',
    budget_min INT NOT NULL,
    budget_max INT NOT NULL,
    image_urls TEXT[] NOT NULL,
    owner_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Ensure ALL columns exist (table may have been created without them)
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS city TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS neighborhood TEXT NOT NULL DEFAULT '';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS property_type property_enum NOT NULL DEFAULT 'house';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS floor INT DEFAULT NULL;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS has_elevator BOOLEAN DEFAULT FALSE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_occupied BOOLEAN DEFAULT TRUE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS material_status material_enum NOT NULL DEFAULT 'negotiable';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS urgency urgency_enum NOT NULL DEFAULT 'flexible';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS urgency_custom TEXT DEFAULT NULL;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS completion_time completion_time_enum NOT NULL DEFAULT '1-2_hours';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS completion_time_custom TEXT DEFAULT NULL;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS active_days INT NOT NULL DEFAULT 3;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS currency currency_enum NOT NULL DEFAULT 'MKD';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS budget_min INT NOT NULL DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS budget_max INT NOT NULL DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS image_urls TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS owner_id UUID;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;

-- 2. Create the Bids Table
CREATE TABLE IF NOT EXISTS bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    handyman_phone TEXT NOT NULL,
    price_labor_only INT NOT NULL,
    price_with_materials INT DEFAULT NULL,
    price_labor_only_eur INT DEFAULT NULL,
    price_with_materials_eur INT DEFAULT NULL,
    availability_date TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Ensure ALL bids columns exist
ALTER TABLE bids ADD COLUMN IF NOT EXISTS price_labor_only_eur INT DEFAULT NULL;
ALTER TABLE bids ADD COLUMN IF NOT EXISTS price_with_materials_eur INT DEFAULT NULL;

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_jobs_city ON jobs(city);
CREATE INDEX IF NOT EXISTS idx_jobs_urgency ON jobs(urgency);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bids_job_id ON bids(job_id);

-- Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Everyone can read active jobs
DO $$ BEGIN
  CREATE POLICY "Anyone can view jobs" ON jobs FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Authenticated users can create jobs
DO $$ BEGIN
  CREATE POLICY "Authenticated users can create jobs" ON jobs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Job owners can update their jobs
DO $$ BEGIN
  CREATE POLICY "Job owners can update their jobs" ON jobs FOR UPDATE USING (auth.uid() = owner_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Anyone can view bids on a job
DO $$ BEGIN
  CREATE POLICY "Anyone can view bids" ON bids FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Authenticated users can create bids
DO $$ BEGIN
  CREATE POLICY "Authenticated users can create bids" ON bids FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- DOWN
-- ============================================

-- DROP POLICY IF EXISTS "Anyone can view jobs" ON jobs;
-- DROP POLICY IF EXISTS "Authenticated users can create jobs" ON jobs;
-- DROP POLICY IF EXISTS "Job owners can update their jobs" ON jobs;
-- DROP POLICY IF EXISTS "Anyone can view bids" ON bids;
-- DROP POLICY IF EXISTS "Authenticated users can create bids" ON bids;
-- DROP TABLE IF EXISTS bids;
-- DROP TABLE IF EXISTS jobs;
-- DROP TYPE IF EXISTS currency_enum;
-- DROP TYPE IF EXISTS completion_time_enum;
-- DROP TYPE IF EXISTS urgency_enum;
-- DROP TYPE IF EXISTS material_enum;
-- DROP TYPE IF EXISTS property_enum;
