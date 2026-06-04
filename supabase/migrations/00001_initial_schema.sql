-- Migration: Initial schema for MajstorFix
-- Creates enum types, jobs table, and bids table

-- ============================================
-- UP
-- ============================================

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
    image_urls TEXT[] NOT NULL,
    owner_id UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
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

-- Indexes for common queries
CREATE INDEX idx_jobs_city ON jobs(city);
CREATE INDEX idx_jobs_urgency ON jobs(urgency);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_bids_job_id ON bids(job_id);

-- Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Everyone can read active jobs
CREATE POLICY "Anyone can view jobs"
    ON jobs FOR SELECT
    USING (true);

-- Authenticated users can create jobs
CREATE POLICY "Authenticated users can create jobs"
    ON jobs FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Job owners can update their jobs
CREATE POLICY "Job owners can update their jobs"
    ON jobs FOR UPDATE
    USING (auth.uid() = owner_id);

-- Anyone can view bids on a job
CREATE POLICY "Anyone can view bids"
    ON bids FOR SELECT
    USING (true);

-- Authenticated users can create bids
CREATE POLICY "Authenticated users can create bids"
    ON bids FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

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
-- DROP TYPE IF EXISTS urgency_enum;
-- DROP TYPE IF EXISTS material_enum;
-- DROP TYPE IF EXISTS property_enum;
