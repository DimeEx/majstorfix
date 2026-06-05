-- Migration: Enable Realtime for the bids table
-- Required for real-time bid notifications on the homeowner dashboard
--
-- Run this in the Supabase SQL editor or via CLI:
--   supabase migration up
--
-- ============================================
-- UP
-- ============================================

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE bids;
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

-- ============================================
-- DOWN
-- ============================================

-- ALTER PUBLICATION supabase_realtime DROP TABLE bids;
