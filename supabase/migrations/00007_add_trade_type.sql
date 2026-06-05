ALTER TABLE jobs ADD COLUMN IF NOT EXISTS trade_type TEXT NOT NULL DEFAULT 'other';

CREATE INDEX IF NOT EXISTS idx_jobs_trade_type ON jobs(trade_type);

DO $$ BEGIN
  ALTER TABLE jobs ADD CONSTRAINT jobs_trade_type_check CHECK (
    trade_type IN ('plumbing', 'electrical', 'painting', 'drywall', 'tiling', 'flooring', 'carpentry', 'hvac', 'construction', 'other')
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
