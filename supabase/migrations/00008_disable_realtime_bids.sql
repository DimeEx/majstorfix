-- Migration: Disable Realtime for the bids table
-- Replaced with client-side polling (30s interval) to reduce DB load.
-- The realtime.list_changes query was consuming 64% of total DB time.
--
-- ============================================
-- UP
-- ============================================

ALTER PUBLICATION supabase_realtime DROP TABLE bids;

-- ============================================
-- DOWN
-- ============================================

-- ALTER PUBLICATION supabase_realtime ADD TABLE bids;
