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

-- Only authenticated users can manage (insert/update/delete) — for Supabase dashboard use
DO $$ BEGIN
  CREATE POLICY "Authenticated users can manage verified handymen" ON verified_handymen FOR INSERT WITH CHECK (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can update verified handymen" ON verified_handymen FOR UPDATE USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can delete verified handymen" ON verified_handymen FOR DELETE USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- DOWN
-- ============================================

-- DROP POLICY IF EXISTS "Authenticated users can delete verified handymen" ON verified_handymen;
-- DROP POLICY IF EXISTS "Authenticated users can update verified handymen" ON verified_handymen;
-- DROP POLICY IF EXISTS "Authenticated users can manage verified handymen" ON verified_handymen;
-- DROP POLICY IF EXISTS "Anyone can view verified handymen" ON verified_handymen;
-- DROP TABLE IF EXISTS verified_handymen;
