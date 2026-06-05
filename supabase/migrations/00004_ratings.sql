-- Migration: Add ratings table for homeowner reviews of handymen
-- Allows homeowners to rate and comment on handymen after receiving bids

-- ============================================
-- UP
-- ============================================

CREATE TABLE IF NOT EXISTS ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bid_id UUID UNIQUE REFERENCES bids(id) ON DELETE CASCADE NOT NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
    reviewer_id UUID REFERENCES auth.users(id) NOT NULL,
    handyman_phone TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_ratings_handyman_phone ON ratings(handyman_phone);
CREATE INDEX IF NOT EXISTS idx_ratings_job_id ON ratings(job_id);
CREATE INDEX IF NOT EXISTS idx_ratings_bid_id ON ratings(bid_id);
CREATE INDEX IF NOT EXISTS idx_ratings_reviewer_id ON ratings(reviewer_id);

-- Row Level Security
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Anyone can view ratings
DO $$ BEGIN
  CREATE POLICY "Anyone can view ratings" ON ratings FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Job owners can rate bids on their jobs
DO $$ BEGIN
  CREATE POLICY "Job owners can rate bids on their jobs" ON ratings FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id
    AND EXISTS (
      SELECT 1 FROM jobs WHERE jobs.id = job_id AND jobs.owner_id = auth.uid()
    )
    AND EXISTS (
      SELECT 1 FROM bids WHERE bids.id = bid_id AND bids.job_id = ratings.job_id
    )
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Reviewers can update their own ratings
DO $$ BEGIN
  CREATE POLICY "Reviewers can update their own ratings" ON ratings FOR UPDATE USING (auth.uid() = reviewer_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Reviewers can delete their own ratings
DO $$ BEGIN
  CREATE POLICY "Reviewers can delete their own ratings" ON ratings FOR DELETE USING (auth.uid() = reviewer_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- DOWN
-- ============================================

-- DROP POLICY IF EXISTS "Reviewers can delete their own ratings" ON ratings;
-- DROP POLICY IF EXISTS "Reviewers can update their own ratings" ON ratings;
-- DROP POLICY IF EXISTS "Job owners can rate bids on their jobs" ON ratings;
-- DROP POLICY IF EXISTS "Anyone can view ratings" ON ratings;
-- DROP TABLE IF EXISTS ratings;
