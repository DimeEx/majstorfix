-- Migration: Align live security policies with intended app access rules
-- Removes permissive drift in bids, verified_handymen, storage listing, and helper function execution.

-- ============================================
-- UP
-- ============================================

-- Ensure the live bids table has bidder ownership before rebuilding policies.
ALTER TABLE bids ADD COLUMN IF NOT EXISTS bidder_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON bids(bidder_id);

-- Rebuild bids policies to match the app's intended privacy model.
DROP POLICY IF EXISTS "Anyone can view bids" ON bids;
DROP POLICY IF EXISTS "Authenticated users can create bids" ON bids;
DROP POLICY IF EXISTS "Anyone can delete bids" ON bids;
DROP POLICY IF EXISTS "Job owners and bidders can view bids" ON bids;
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

-- Remove regular-user write access for verified handymen.
DROP POLICY IF EXISTS "Authenticated users can manage verified handymen" ON verified_handymen;
DROP POLICY IF EXISTS "Authenticated users can update verified handymen" ON verified_handymen;
DROP POLICY IF EXISTS "Authenticated users can delete verified handymen" ON verified_handymen;

-- Remove broad public listing from the public image bucket.
DROP POLICY IF EXISTS "Anyone can view job images" ON storage.objects;

-- This helper should not be callable from the public API.
DO $$ BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'rls_auto_enable'
  ) THEN
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
    REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;
  END IF;
END $$;

-- ============================================
-- DOWN
-- ============================================

-- Recreate prior permissive policies only if rollback is explicitly needed.
-- DO $$ BEGIN
--   CREATE POLICY "Anyone can view bids" ON bids FOR SELECT USING (true);
-- EXCEPTION WHEN duplicate_object THEN NULL;
-- END $$;
--
-- DO $$ BEGIN
--   CREATE POLICY "Authenticated users can create bids" ON bids FOR INSERT WITH CHECK (
--     auth.role() = 'authenticated'
--   );
-- EXCEPTION WHEN duplicate_object THEN NULL;
-- END $$;
--
-- DO $$ BEGIN
--   CREATE POLICY "Anyone can delete bids" ON bids FOR DELETE USING (true);
-- EXCEPTION WHEN duplicate_object THEN NULL;
-- END $$;
--
-- DO $$ BEGIN
--   CREATE POLICY "Authenticated users can manage verified handymen" ON verified_handymen FOR INSERT WITH CHECK (
--     auth.role() = 'authenticated'
--   );
-- EXCEPTION WHEN duplicate_object THEN NULL;
-- END $$;
--
-- DO $$ BEGIN
--   CREATE POLICY "Authenticated users can update verified handymen" ON verified_handymen FOR UPDATE USING (
--     auth.role() = 'authenticated'
--   ) WITH CHECK (
--     auth.role() = 'authenticated'
--   );
-- EXCEPTION WHEN duplicate_object THEN NULL;
-- END $$;
--
-- DO $$ BEGIN
--   CREATE POLICY "Authenticated users can delete verified handymen" ON verified_handymen FOR DELETE USING (
--     auth.role() = 'authenticated'
--   );
-- EXCEPTION WHEN duplicate_object THEN NULL;
-- END $$;
--
-- DO $$ BEGIN
--   CREATE POLICY "Anyone can view job images" ON storage.objects FOR SELECT USING (
--     bucket_id = 'job-images'
--   );
-- EXCEPTION WHEN duplicate_object THEN NULL;
-- END $$;
