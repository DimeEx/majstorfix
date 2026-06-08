-- Migration: Harden bid privacy and handyman verification writes
-- Bid details are only visible to the job owner or the bidder.
-- Verified handymen are public to read, but writes require privileged access.

-- ============================================
-- UP
-- ============================================

ALTER TABLE bids ADD COLUMN IF NOT EXISTS bidder_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON bids(bidder_id);

DROP POLICY IF EXISTS "Anyone can view bids" ON bids;
DROP POLICY IF EXISTS "Job owners and bidders can view bids" ON bids;
DROP POLICY IF EXISTS "Authenticated users can create bids" ON bids;
DROP POLICY IF EXISTS "Authenticated users can create own bids" ON bids;

DO $$ BEGIN
  CREATE POLICY "Job owners and bidders can view bids" ON bids FOR SELECT USING (
    auth.uid() = bidder_id
    OR EXISTS (
      SELECT 1 FROM jobs WHERE jobs.id = bids.job_id AND jobs.owner_id = auth.uid()
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can create own bids" ON bids FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND bidder_id = auth.uid()
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DROP POLICY IF EXISTS "Authenticated users can manage verified handymen" ON verified_handymen;
DROP POLICY IF EXISTS "Authenticated users can update verified handymen" ON verified_handymen;
DROP POLICY IF EXISTS "Authenticated users can delete verified handymen" ON verified_handymen;

-- No INSERT/UPDATE/DELETE policies are created here intentionally.
-- Supabase service-role/admin clients bypass RLS for verification management.

-- ============================================
-- DOWN
-- ============================================

-- DROP POLICY IF EXISTS "Job owners and bidders can view bids" ON bids;
-- DROP POLICY IF EXISTS "Authenticated users can create own bids" ON bids;
-- DROP INDEX IF EXISTS idx_bids_bidder_id;
-- ALTER TABLE bids DROP COLUMN IF EXISTS bidder_id;
