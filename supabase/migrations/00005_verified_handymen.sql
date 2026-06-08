-- Migration: Add verified_handymen table for handyman verification
-- Allows admin to mark handymen as verified; verified badge shown on bids

-- ============================================
-- UP
-- ============================================

CREATE TABLE IF NOT EXISTS verified_handymen (
    phone TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_verified_handymen_phone ON verified_handymen(phone);

-- Row Level Security
ALTER TABLE verified_handymen ENABLE ROW LEVEL SECURITY;

-- Anyone can view verified handymen
DO $$ BEGIN
  CREATE POLICY "Anyone can view verified handymen" ON verified_handymen FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- No INSERT/UPDATE/DELETE policies are created intentionally.
-- Supabase service-role/admin clients bypass RLS for verification management.

-- ============================================
-- DOWN
-- ============================================

-- DROP POLICY IF EXISTS "Anyone can view verified handymen" ON verified_handymen;
-- DROP TABLE IF EXISTS verified_handymen;
