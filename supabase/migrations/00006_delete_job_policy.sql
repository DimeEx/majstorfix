-- Migration: Add DELETE policy for jobs table
-- Job owners can delete their own jobs

DO $$ BEGIN
  CREATE POLICY "Job owners can delete their jobs" ON jobs FOR DELETE USING (auth.uid() = owner_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
